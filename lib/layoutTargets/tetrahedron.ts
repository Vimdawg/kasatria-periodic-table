import { Vector3 } from 'three'

export interface LayoutTarget {
  position: Vector3
  rotation: Vector3
}

// Helper function to generate evenly spaced points on a triangular face
function generateTriangularSurface(vertex1: Vector3, vertex2: Vector3, vertex3: Vector3, numPoints: number): Vector3[] {
  const points: Vector3[] = []
  
  // Calculate optimal grid size for the triangle to accommodate all points
  const gridSize = Math.ceil(Math.sqrt(numPoints * 2 / Math.sqrt(3))) // Account for triangular area
  
  // Generate all possible positions first
  const allPositions: Vector3[] = []
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - row; col++) {
      // Calculate barycentric coordinates for even distribution
      const u = col / Math.max(1, gridSize - 1)
      const v = row / Math.max(1, gridSize - 1)
      const w = 1 - u - v
      
      // Ensure we're inside the triangle
      if (u >= 0 && v >= 0 && w >= 0) {
        const position = new Vector3(
          u * vertex1.x + v * vertex2.x + w * vertex3.x,
          u * vertex1.y + v * vertex2.y + w * vertex3.y,
          u * vertex1.z + v * vertex2.z + w * vertex3.z
        )
        allPositions.push(position)
      }
    }
  }
  
  // If we have more positions than needed, select evenly spaced ones
  if (allPositions.length >= numPoints) {
    const step = allPositions.length / numPoints
    for (let i = 0; i < numPoints; i++) {
      const index = Math.floor(i * step)
      points.push(allPositions[index])
    }
  } else {
    // If we need more points, add them with slight randomization to fill gaps
    points.push(...allPositions)
    
    while (points.length < numPoints) {
      // Generate additional points with slight random offset
      const basePoint = allPositions[Math.floor(Math.random() * allPositions.length)]
      const offset = 0.05 // Small offset to avoid exact duplicates
      
      const u = Math.random() * offset - offset/2
      const v = Math.random() * offset - offset/2
      const w = Math.random() * offset - offset/2
      
      const newPosition = new Vector3(
        basePoint.x + u * (vertex1.x - basePoint.x),
        basePoint.y + v * (vertex1.y - basePoint.y),
        basePoint.z + w * (vertex1.z - basePoint.z)
      )
      points.push(newPosition)
    }
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
  
  // Tetrahedron parameters - perfect regular tetrahedron (larger for better visibility)
  const baseRadius = 1400
  const height = baseRadius * Math.sqrt(6) / 3 // Proper tetrahedron height
  
  // Calculate tetrahedron vertices for a perfect regular tetrahedron
  const baseVertices = [
    new Vector3(baseRadius, 0, 0),
    new Vector3(-baseRadius/2, 0, baseRadius * Math.sqrt(3)/2),
    new Vector3(-baseRadius/2, 0, -baseRadius * Math.sqrt(3)/2)
  ]
  
  // Apex vertex - positioned above the centroid of the base
  const apex = new Vector3(0, height, 0)
  
  // Calculate points per face - distribute evenly across all 4 faces
  const pointsPerFace = Math.floor(count / 4)
  const remainingPoints = count % 4
  
  // Track how many points we've used
  let pointsUsed = 0
  
  // Face 1: Base face (bottom triangle)
  const baseFaceCount = pointsPerFace + (remainingPoints > 0 ? 1 : 0)
  const baseFacePoints = generateTriangularSurface(baseVertices[0], baseVertices[1], baseVertices[2], baseFaceCount)
  const baseNormal = calculateFaceNormal(baseVertices[0], baseVertices[1], baseVertices[2])
  
  for (let i = 0; i < baseFacePoints.length && pointsUsed < count; i++) {
    const position = baseFacePoints[i]
    const rotation = new Vector3(
      Math.atan2(baseNormal.y, Math.sqrt(baseNormal.x * baseNormal.x + baseNormal.z * baseNormal.z)),
      Math.atan2(baseNormal.x, baseNormal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointsUsed++
  }
  
  // Face 2: Side face 1 (base vertex 0, base vertex 1, apex)
  const side1Count = pointsPerFace + (remainingPoints > 1 ? 1 : 0)
  const side1Points = generateTriangularSurface(baseVertices[0], baseVertices[1], apex, side1Count)
  const side1Normal = calculateFaceNormal(baseVertices[0], baseVertices[1], apex)
  
  for (let i = 0; i < side1Points.length && pointsUsed < count; i++) {
    const position = side1Points[i]
    const rotation = new Vector3(
      Math.atan2(side1Normal.y, Math.sqrt(side1Normal.x * side1Normal.x + side1Normal.z * side1Normal.z)),
      Math.atan2(side1Normal.x, side1Normal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointsUsed++
  }
  
  // Face 3: Side face 2 (base vertex 1, base vertex 2, apex)
  const side2Count = pointsPerFace + (remainingPoints > 2 ? 1 : 0)
  const side2Points = generateTriangularSurface(baseVertices[1], baseVertices[2], apex, side2Count)
  const side2Normal = calculateFaceNormal(baseVertices[1], baseVertices[2], apex)
  
  for (let i = 0; i < side2Points.length && pointsUsed < count; i++) {
    const position = side2Points[i]
    const rotation = new Vector3(
      Math.atan2(side2Normal.y, Math.sqrt(side2Normal.x * side2Normal.x + side2Normal.z * side2Normal.z)),
      Math.atan2(side2Normal.x, side2Normal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointsUsed++
  }
  
  // Face 4: Side face 3 (base vertex 2, base vertex 0, apex)
  const side3Count = pointsPerFace + (remainingPoints > 3 ? 1 : 0)
  const side3Points = generateTriangularSurface(baseVertices[2], baseVertices[0], apex, side3Count)
  const side3Normal = calculateFaceNormal(baseVertices[2], baseVertices[0], apex)
  
  for (let i = 0; i < side3Points.length && pointsUsed < count; i++) {
    const position = side3Points[i]
    const rotation = new Vector3(
      Math.atan2(side3Normal.y, Math.sqrt(side3Normal.x * side3Normal.x + side3Normal.z * side3Normal.z)),
      Math.atan2(side3Normal.x, side3Normal.z),
      0
    )
    
    targets.push({ position, rotation })
    pointsUsed++
  }
  
  // Ensure we have exactly the right number of points
  console.log(`Tetrahedron: Generated ${targets.length} positions for ${count} employees`)
  
  return targets
}
