import { TODO } from './potree'
import * as THREE from 'three'

const container = document.getElementById('potree_render_area')
if (container) window.viewer = new Potree.Viewer(container)

const viewer = window.viewer

viewer.setEDLEnabled(true)
viewer.setFOV(60)
viewer.setPointBudget(2_000_000)
viewer.loadSettingsFromURL()
viewer.loadGUI(() => {
  viewer.setLanguage('en')
  $('#menu_appearance').next().show()
  viewer.toggleSidebar()
})

// Load and add point cloud to scene
Potree.loadPointCloud(
  // 'http://5.9.65.151/mschuetz/potree/resources/pointclouds/helimap/360/MLS_drive1/cloud.js',
  // 'MLS',
  '/potreeConverted/metadata.json',
  'MLS',
  (e) => {
    console.log('loaded pointcloud')
    const scene = viewer.scene
    const pointcloud = e.pointcloud

    const material = pointcloud.material
    material.size = 0.7
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE
    material.shape = Potree.PointShape.SQUARE
    material.activeAttributeName = 'rgba'
    material.rgbGamma = 0.67

    scene.addPointCloud(pointcloud)
    viewer.fitToScreen()
    // viewer.scene.view.setView(
    //   [2652381.103, 1249049.447, 411.636],
    //   [2652364.407, 1249077.205, 399.696]
    // )
    startClipping(viewer), run()
  }
)

async function run() {
  proj4.defs('WGS84', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
  proj4.defs('pointcloud', viewer.getProjection())
}

function startClipping(viewer: TODO) {
  // const center = new THREE.Vector3()
  // viewer.getBoundingBox().getCenter(center)
  const center = viewer.getBoundingBox().min
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2
  })
  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  box.visible = false
  box.scale.set(100000000, 100000, 0.123)
  box.up.set(0, 0, 0)
  box.position.set(0, 0, 0)
  //box.lookAt(target)
  box.position.copy(center.clone())
  viewer.clippingBox = box
  viewer.setClipTask(Potree.ClipTask.SHOW_INSIDE)
  //viewer.update()
}
