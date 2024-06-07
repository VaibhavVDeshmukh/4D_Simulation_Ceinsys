import { Loader, LoaderEvent } from '../Loader'
import { IFCLoader, IFCModel } from 'three/examples/jsm/loaders/IFCLoader'
import { IfcConverter } from './IfcConverter' // You would need to implement this
import { IfcGeometryConverter } from './IfcGeometryConverter' // You would need to implement this
import Logger from 'js-logger'
import { WorldTree } from '../../..'

export class IfcLoader extends Loader {
  private baseLoader: IFCLoader
  private converter: IfcConverter
  private tree: WorldTree
  private isFinished: boolean = false

  public get resource(): string {
    return this._resource
  }

  public get finished(): boolean {
    return this.isFinished
  }

  public constructor(
    targetTree: WorldTree,
    resource: string,
    resourceData?: ArrayBuffer
  ) {
    super(resource, resourceData)
    this.tree = targetTree
    this.baseLoader = new IFCLoader()
    this.converter = new IfcConverter(this.tree)
  }

  public load(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const pload = new Promise<void>((loadResolve, loadReject) => {
        if (!this._resourceData) {
          this.baseLoader.load(
            this._resource,
            async (model: IFCModel) => {
              await this.converter.traverse(this._resource, model, async () => {})

              loadResolve()
            },
            (event: ProgressEvent) => {
              this.emit(LoaderEvent.LoadProgress, {
                progress: event.loaded / (event.total + 1),
                id: this._resource
              })
            },
            (event: ErrorEvent) => {
              Logger.error(`Loading IFC ${this._resource} failed with ${event.message}`)
              loadReject(new Error(event.message))
            }
          )
        } else {
          try {
            this.baseLoader
              .parse(this._resourceData as ArrayBuffer)
              .then((ifcModel) => {
                this.converter.traverse(this._resource, ifcModel, async () => {})
              })
            loadResolve()
          } catch (err) {
            Logger.error(`Loading IFC ${this._resource} failed with ${err}`)
            loadReject(err)
          }
        }
      })

      pload
        .then(async () => {
          const t0 = performance.now()
          const renderTree = this.tree.getRenderTree(this._resource)
          if (renderTree) {
            const res = await renderTree.buildRenderTree(new IfcGeometryConverter())
            Logger.log('Tree build time -> ', performance.now() - t0)
            this.isFinished = true
            resolve(res)
          } else {
            Logger.error(`Could not get render tree for ${this._resource}`)
            reject(new Error(`Could not get render tree for ${this._resource}`))
          }
        })
        .catch((err) => {
          Logger.error(`Could not load ${this._resource}: ${err}`)
          reject(err)
        })
    })
  }

  public cancel() {
    this.isFinished = false
  }

  public dispose() {
    super.dispose()
  }
}
