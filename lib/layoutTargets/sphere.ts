import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

export function getSphereLayout(count: number): LayoutTarget[] {
  const targets: LayoutTarget[] = []
  const radius = 1000

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count)
    const theta = Math.sqrt(count * Math.PI) * phi

    const x = radius * Math.cos(theta) * Math.sin(phi)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(theta) * Math.sin(phi)

    // Calculate rotation to face outward from center
    const rotationX = Math.atan2(z, Math.sqrt(x * x + y * y))
    const rotationY = Math.atan2(x, y)

    targets.push({
      position: new Vector3(x, y, z),
      rotation: new Vector3(rotationX, rotationY, 0)
    })
  }

  return targets
}

