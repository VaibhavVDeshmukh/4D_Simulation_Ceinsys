import { Matrix4 } from 'three'
import { type NodeData } from '../../..'
import { type GeometryData } from '../../converter/Geometry'
import { GeometryConverter, SpeckleType } from '../GeometryConverter'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'

export class IfcGeometryConverter extends GeometryConverter {
  public getSpeckleType(node: NodeData): SpeckleType {
    switch (node.raw.type) {
      case 'Group':
        return SpeckleType.BlockInstance
      case 'Mesh':
        return SpeckleType.Mesh
      case 'IFCModel':
        return SpeckleType.IFCModel // Assuming IFCModel is a type of object
      default:
        return SpeckleType.Unknown
    }
  }

  public convertNodeToGeometryData(node: NodeData): GeometryData | null {
    const type = this.getSpeckleType(node)
    switch (type) {
      case SpeckleType.BlockInstance:
        return this.blockInstanceToGeometryData(node)
      case SpeckleType.Mesh:
        return this.meshToGeometryData(node)
      case SpeckleType.IFCModel:
        return this.ifcModelToGeometryData(node)
      default:
        return null
    }
  }

  public disposeNodeGeometryData(node: NodeData): void {
    // Implement any cleanup logic if necessary
    console.log({ node })
  }

  /** BLOCK INSTANCE */
  private blockInstanceToGeometryData(node: NodeData): GeometryData {
    const conversionFactor = 1
    const matrix = new Matrix4().copy(node.raw.matrixWorld)
    const transform: Matrix4 = new Matrix4()
      .makeScale(conversionFactor, conversionFactor, conversionFactor)
      .multiply(matrix)
      .multiply(
        new Matrix4().makeScale(
          1 / conversionFactor,
          1 / conversionFactor,
          1 / conversionFactor
        )
      )

    return {
      attributes: null,
      bakeTransform: null,
      transform
    } as GeometryData
  }

  /**
   * MESH
   */
  private meshToGeometryData(node: NodeData): GeometryData | null {
    if (!node.raw) return null

    const conversionFactor = 1
    if (!node.raw.geometry.index || node.raw.geometry.index.array.length === 0) {
      node.raw.geometry = mergeVertices(node.raw.geometry)
    }

    return {
      attributes: {
        POSITION: Array.from(node.raw.geometry.attributes.position.array),
        INDEX: Array.from(node.raw.geometry.index.array),
        ...(node.raw.geometry.attributes.color && {
          COLOR: Array.from(node.raw.geometry.attributes.color.array)
        })
      },
      bakeTransform: new Matrix4().makeScale(
        conversionFactor,
        conversionFactor,
        conversionFactor
      ),
      transform: null
    } as GeometryData
  }

  /**
   * IFC MODEL
   */
  private ifcModelToGeometryData(node: NodeData): GeometryData | null {
    if (!node.raw) return null

    const conversionFactor = 1
    // Implement IFC model specific data extraction
    // This is a placeholder logic, adjust based on actual IFC data structure
    const geometry = node.raw.geometry

    if (!geometry) return null

    return {
      attributes: {
        POSITION: Array.from(geometry.attributes.position.array),
        INDEX: Array.from(geometry.index.array),
        ...(geometry.attributes.color && {
          COLOR: Array.from(geometry.attributes.color.array)
        })
      },
      bakeTransform: new Matrix4().makeScale(
        conversionFactor,
        conversionFactor,
        conversionFactor
      ),
      transform: null
    } as GeometryData
  }
}
