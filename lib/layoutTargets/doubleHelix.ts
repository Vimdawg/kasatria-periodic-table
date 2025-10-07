import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

export function getDoubleHelixLayout(count: number): LayoutTarget[] {
  const targets: LayoutTarget[] = []
  const radius = 300
  const heightStep = 50
  const angleStep = 0.2

  for (let i = 0; i < count; i++) {
    const isEven = i % 2 === 0
    const phaseOffset = isEven ? 0 : Math.PI
    
    const angle = angleStep * i + phaseOffset
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    const y = (i - count / 2) * heightStep

    // Calculate rotation to face outward from helix center
    const rotationY = angle + Math.PI / 2
    const rotationX = 0

    targets.push({
      position: new Vector3(x, y, z),
      rotation: new Vector3(rotationX, rotationY, 0)
    })
  }

  return targets
}

