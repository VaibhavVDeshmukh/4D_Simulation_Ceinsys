import { Mesh, Object3D } from 'three'
import { type TreeNode, WorldTree } from '../../tree/WorldTree'
import type { ConverterResultDelegate } from '../Speckle/SpeckleConverter'
import Logger from 'js-logger'

export type IfcConverterNodeDelegate =
  | ((object: Object3D, node: TreeNode) => Promise<void>)
  | null

export class IfcConverter {
  private lastAsyncPause: number = 0
  private tree: WorldTree

  private readonly NodeConverterMapping: {
    [name: string]: IfcConverterNodeDelegate
  } = {
    Group: this.groupToNode.bind(this),
    Mesh: this.meshToNode.bind(this),
    IFCModel: this.ifcModelToNode.bind(this) // Assuming IFCModel is a type of object in the IFC loader
  }

  public constructor(tree: WorldTree) {
    this.tree = tree
  }

  public async asyncPause() {
    // Don't freeze the UI when doing all those traversals
    if (Date.now() - this.lastAsyncPause >= 100) {
      this.lastAsyncPause = Date.now()
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  public async traverse(
    objectURL: string,
    object: Object3D,
    callback: ConverterResultDelegate,
    node: TreeNode | null = null
  ) {
    await this.asyncPause()

    const childNode: TreeNode = this.tree.parse({
      id: !node ? objectURL : object.uuid,
      raw: object,
      atomic: true,
      children: []
    })

    if (!node) {
      this.tree.addSubtree(childNode)
    } else {
      this.tree.addNode(childNode, node)
    }

    const type = object.type

    if (this.directNodeConverterExists(object)) {
      try {
        await this.convertToNode(object, childNode)
        await callback()
      } catch (e) {
        Logger.warn(
          `(Traversing - direct) Failed to convert ${type} with id: ${object.uuid}`,
          e
        )
      }
    }
    for (let k = 0; k < object.children.length; k++) {
      this.traverse(objectURL, object.children[k], callback, childNode)
    }
  }

  private directNodeConverterExists(obj: Object3D) {
    return obj.type in this.NodeConverterMapping
  }

  private async convertToNode(obj: Object3D, node: TreeNode) {
    try {
      if (this.directNodeConverterExists(obj)) {
        const delegate = this.NodeConverterMapping[obj.type]
        if (delegate) return await delegate(obj, node)
      }
      return null
    } catch (e) {
      Logger.warn(`(Direct convert) Failed to convert object with id: ${obj.id}`)
      throw e
    }
  }

  private async meshToNode(_obj: Object3D, node: TreeNode) {
    const obj = _obj as Mesh
    if (!obj) return
    if (
      !obj.geometry.attributes.position ||
      obj.geometry.attributes.position.array.length === 0
    ) {
      Logger.warn(
        `Object id ${obj.id} of type ${obj.type} has no vertex position data and will be ignored`
      )
      return
    }

    node.model.raw.vertices = obj.geometry.attributes.position.array
    node.model.raw.faces = obj.geometry.index?.array
    node.model.raw.colors = obj.geometry.attributes.color?.array
    return Promise.resolve()
  }

  private async ifcModelToNode(obj: Object3D, node: TreeNode) {
    // Implement the specific conversion logic for IFC models here
    // This might include parsing IFC specific properties and structure
    node.model.raw.ifcData = {} // Placeholder for IFC specific data
    return Promise.resolve()
  }

  private groupToNode(obj: Object3D, node: TreeNode) {
    obj
    node
    return Promise.resolve()
  }
}
