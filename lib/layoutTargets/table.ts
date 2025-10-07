import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

export function getTableLayout(count: number): LayoutTarget[] {
  const targets: LayoutTarget[] = []
  const cols = 20
  const rows = 10
  const spacing = 200

  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    
    const x = (col - (cols - 1) / 2) * spacing
    const y = ((rows - 1) / 2 - row) * spacing
    const z = 0

    targets.push({
      position: new Vector3(x, y, z),
      rotation: new Vector3(0, 0, 0)
    })
  }

  return targets
}

