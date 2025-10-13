import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

export function getTetrahedronLayout(count: number): LayoutTarget[] {
  const targets: LayoutTarget[] = []
  
  // Tetrahedron parameters
  const baseRadius = 800
  const height = 1200
  
  // Calculate tetrahedron vertices
  // Base triangle vertices (equilateral triangle)
  const baseVertices = [
    new Vector3(baseRadius * Math.cos(0), 0, baseRadius * Math.sin(0)),
    new Vector3(baseRadius * Math.cos(2 * Math.PI / 3), 0, baseRadius * Math.sin(2 * Math.PI / 3)),
    new Vector3(baseRadius * Math.cos(4 * Math.PI / 3), 0, baseRadius * Math.sin(4 * Math.PI / 3))
  ]
  
  // Apex vertex
  const apex = new Vector3(0, height, 0)
  
  // All four vertices of the tetrahedron
  const tetrahedronVertices = [...baseVertices, apex]
  
  // Distribute points across the tetrahedron faces
  for (let i = 0; i < count; i++) {
    let position: Vector3
    let rotation: Vector3
    
    // Determine which face to place the point on
    const faceIndex = i % 4
    
    if (faceIndex === 3) {
      // Apex face - distribute points on the triangular face opposite to the base
      const v1 = baseVertices[0]
      const v2 = baseVertices[1] 
      const v3 = baseVertices[2]
      
      // Use barycentric coordinates for even distribution
      const u = Math.random()
      const v = Math.random()
      const w = 1 - u - v
      
      // Ensure point is inside triangle
      const adjustedU = u
      const adjustedV = v < (1 - u) ? v : (1 - u) * Math.random()
      const adjustedW = 1 - adjustedU - adjustedV
      
      position = new Vector3(
        adjustedU * v1.x + adjustedV * v2.x + adjustedW * v3.x,
        adjustedU * v1.y + adjustedV * v2.y + adjustedW * v3.y,
        adjustedU * v1.z + adjustedV * v2.z + adjustedW * v3.z
      )
      
      // Rotate to face outward from the center
      const center = new Vector3(0, 0, 0)
      const direction = position.clone().sub(center).normalize()
      rotation = new Vector3(
        Math.atan2(direction.y, Math.sqrt(direction.x * direction.x + direction.z * direction.z)),
        Math.atan2(direction.x, direction.z),
        0
      )
    } else {
      // Side faces - distribute points on triangular faces connecting base to apex
      const baseVertex = baseVertices[faceIndex]
      const nextBaseVertex = baseVertices[(faceIndex + 1) % 3]
      
      // Use barycentric coordinates for the side face
      const u = Math.random()
      const v = Math.random()
      const w = 1 - u - v
      
      // Ensure point is inside triangle
      const adjustedU = u
      const adjustedV = v < (1 - u) ? v : (1 - u) * Math.random()
      const adjustedW = 1 - adjustedU - adjustedV
      
      // Interpolate between the three vertices of the side face
      const sidePosition = new Vector3(
        adjustedU * baseVertex.x + adjustedV * nextBaseVertex.x + adjustedW * apex.x,
        adjustedU * baseVertex.y + adjustedV * nextBaseVertex.y + adjustedW * apex.y,
        adjustedU * baseVertex.z + adjustedV * nextBaseVertex.z + adjustedW * apex.z
      )
      
      position = sidePosition
      
      // Calculate normal vector for the side face
      const edge1 = nextBaseVertex.clone().sub(baseVertex)
      const edge2 = apex.clone().sub(baseVertex)
      const normal = edge1.clone().cross(edge2).normalize()
      
      // Rotate to face outward along the normal
      rotation = new Vector3(
        Math.atan2(normal.y, Math.sqrt(normal.x * normal.x + normal.z * normal.z)),
        Math.atan2(normal.x, normal.z),
        0
      )
    }
    
    targets.push({
      position,
      rotation
    })
  }
  
  return targets
}
