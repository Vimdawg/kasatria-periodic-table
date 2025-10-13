import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

// Helper function to generate points on a triangular grid
function generateTriangularGrid(vertex1: Vector3, vertex2: Vector3, vertex3: Vector3, numPoints: number): Vector3[] {
  const points: Vector3[] = []
  
  // Calculate the number of rows needed for a triangular grid
  const rows = Math.ceil(Math.sqrt(2 * numPoints))
  
  for (let i = 0; i < numPoints; i++) {
    // Convert linear index to triangular grid coordinates
    const row = Math.floor((Math.sqrt(8 * i + 1) - 1) / 2)
    const col = i - (row * (row + 1)) / 2
    
    // Normalize coordinates to [0,1]
    const u = col / Math.max(1, row)
    const v = (row - col) / Math.max(1, row)
    const w = 1 - u - v
    
    // Ensure barycentric coordinates sum to 1
    const total = u + v + w
    const normalizedU = u / total
    const normalizedV = v / total
    const normalizedW = w / total
    
    // Interpolate position using barycentric coordinates
    const position = new Vector3(
      normalizedU * vertex1.x + normalizedV * vertex2.x + normalizedW * vertex3.x,
      normalizedU * vertex1.y + normalizedV * vertex2.y + normalizedW * vertex3.y,
      normalizedU * vertex1.z + normalizedV * vertex2.z + normalizedW * vertex3.z
    )
    
    points.push(position)
  }
  
  return points
}

// Helper function to calculate face normal for proper rotation
function calculateFaceNormal(vertex1: Vector3, vertex2: Vector3, vertex3: Vector3): Vector3 {
  const edge1 = vertex2.clone().sub(vertex1)
  const edge2 = vertex3.clone().sub(vertex1)
  return edge1.clone().cross(edge2).normalize()
}

export function getTetrahedronLayout(count: number): LayoutTarget[] {
  const targets: LayoutTarget[] = []
  
  // Tetrahedron parameters - more balanced proportions
  const baseRadius = 1000
  const height = 1000 * Math.sqrt(2/3) // Proper tetrahedron height
  
  // Calculate tetrahedron vertices for a perfect regular tetrahedron
  const baseVertices = [
    new Vector3(baseRadius, 0, 0),
    new Vector3(-baseRadius/2, 0, baseRadius * Math.sqrt(3)/2),
    new Vector3(-baseRadius/2, 0, -baseRadius * Math.sqrt(3)/2)
  ]
  
  // Apex vertex - positioned above the centroid of the base
  const apex = new Vector3(0, height, 0)
  
  // Calculate how many points per face (distribute evenly across all 4 faces)
  const pointsPerFace = Math.ceil(count / 4)
  
  // Generate points for each face
  let pointIndex = 0
  
  // Face 1: Base face (bottom)
  const baseFacePoints = generateTriangularGrid(baseVertices[0], baseVertices[1], baseVertices[2], pointsPerFace)
  const baseNormal = calculateFaceNormal(baseVertices[0], baseVertices[1], baseVertices[2])
  
  for (let i = 0; i < baseFacePoints.length && pointIndex < count; i++) {
    const position = baseFacePoints[i]
    const rotation = new Vector3(
      Math.atan2(baseNormal.y, Math.sqrt(baseNormal.x * baseNormal.x + baseNormal.z * baseNormal.z)),
      Math.atan2(baseNormal.x, baseNormal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointIndex++
  }
  
  // Face 2: Side face 1 (base vertex 0, base vertex 1, apex)
  const side1Points = generateTriangularGrid(baseVertices[0], baseVertices[1], apex, pointsPerFace)
  const side1Normal = calculateFaceNormal(baseVertices[0], baseVertices[1], apex)
  
  for (let i = 0; i < side1Points.length && pointIndex < count; i++) {
    const position = side1Points[i]
    const rotation = new Vector3(
      Math.atan2(side1Normal.y, Math.sqrt(side1Normal.x * side1Normal.x + side1Normal.z * side1Normal.z)),
      Math.atan2(side1Normal.x, side1Normal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointIndex++
  }
  
  // Face 3: Side face 2 (base vertex 1, base vertex 2, apex)
  const side2Points = generateTriangularGrid(baseVertices[1], baseVertices[2], apex, pointsPerFace)
  const side2Normal = calculateFaceNormal(baseVertices[1], baseVertices[2], apex)
  
  for (let i = 0; i < side2Points.length && pointIndex < count; i++) {
    const position = side2Points[i]
    const rotation = new Vector3(
      Math.atan2(side2Normal.y, Math.sqrt(side2Normal.x * side2Normal.x + side2Normal.z * side2Normal.z)),
      Math.atan2(side2Normal.x, side2Normal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointIndex++
  }
  
  // Face 4: Side face 3 (base vertex 2, base vertex 0, apex)
  const side3Points = generateTriangularGrid(baseVertices[2], baseVertices[0], apex, pointsPerFace)
  const side3Normal = calculateFaceNormal(baseVertices[2], baseVertices[0], apex)
  
  for (let i = 0; i < side3Points.length && pointIndex < count; i++) {
    const position = side3Points[i]
    const rotation = new Vector3(
      Math.atan2(side3Normal.y, Math.sqrt(side3Normal.x * side3Normal.x + side3Normal.z * side3Normal.z)),
      Math.atan2(side3Normal.x, side3Normal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointIndex++
  }
  
  return targets
}
