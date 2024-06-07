/* eslint-disable @typescript-eslint/no-explicit-any */
export type TODO = any

declare global {
  const Potree: {
    Viewer: new (element: HTMLElement) => {
      setEDLEnabled: (enabled: boolean) => void
      setFOV: (fov: number) => void
      setPointBudget: (budget: number) => void
      loadSettingsFromURL: () => void
      loadGUI: (callback: () => void) => void
      setLanguage: (lang: string) => void
      setBackground: () => void
      initMap: () => void
      loadFrustumWindow: () => void
      loadLineProfileWindow: () => void
      toggleSidebar: () => void
      scene: {
        addPointCloud: (pointcloud: TODO) => void
        view: {
          setView: (
            position: [number, number, number],
            target: [number, number, number]
          ) => void
        }
      }
      mapView: {
        showSources: (show: boolean) => void
      }
      getProjection: () => string
    }
    loadPointCloud: (
      url: string,
      name: string,
      callback: (e: { pointcloud: TODO }) => void
    ) => void
    PointSizeType: { ADAPTIVE: TODO }
    PointShape: { SQUARE: TODO }
    Images360Loader: {
      load: (url: string, viewer: TODO, params: TODO) => Promise<TODO[]>
    }
    [key: string]: TODO
  }
}

declare global {
  const proj4: {
    defs: (name: string, projection: string) => void
    (fromProjection: string, toProjection: string): (
      coords: [number, number]
    ) => [number, number]
  }
}

declare global {
  const THREE: {
    [key: string]: TODO
  }
}

declare global {
  interface Window {
    viewer: any
  }
}

declare global {
  const $: typeof $
  const jQuery: typeof $
}
