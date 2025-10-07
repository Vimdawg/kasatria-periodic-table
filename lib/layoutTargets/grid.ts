import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

export function getGridLayout(count: number): LayoutTarget[] {
  const targets: LayoutTarget[] = []
  const xSize = 5
  const ySize = 4
  const zSize = 10
  const spacing = 200

  for (let i = 0; i < count; i++) {
    const ix = i % xSize
    const iy = Math.floor(i / xSize) % ySize
    const iz = Math.floor(i / (xSize * ySize)) % zSize

    const x = (ix - (xSize - 1) / 2) * spacing
    const y = ((ySize - 1) / 2 - iy) * spacing
    const z = (iz - (zSize - 1) / 2) * spacing

    targets.push({
      position: new Vector3(x, y, z),
      rotation: new Vector3(0, 0, 0)
    })
  }

  return targets
}

