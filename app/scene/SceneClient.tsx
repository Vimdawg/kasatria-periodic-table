'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import { PersonData } from '@/lib/fetchCsv'
import { 
  getTableLayout, 
  getSphereLayout, 
  getDoubleHelixLayout, 
  getGridLayout,
  LayoutTarget 
} from '@/lib/layoutTargets'

type LayoutType = 'table' | 'sphere' | 'helix' | 'grid'

interface SceneClientProps {
  data: PersonData[]
  error: string | null
}

export default function SceneClient({ data, error }: SceneClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<CSS3DRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const controlsRef = useRef<OrbitControls>()
  const objectsRef = useRef<CSS3DObject[]>([])
  const currentLayoutRef = useRef<LayoutType>('table')
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('table')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const authState = localStorage.getItem('googleAuth')
    if (!authState) {
      router.push('/')
      return
    }
    setIsAuthenticated(true)

    if (error) {
      console.error('Scene error:', error)
      setIsLoading(false)
      return
    }

    if (data.length === 0) {
      setIsLoading(false)
      return
    }

    initializeScene()
    createObjects(data)
    animate()

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
    }
  }, [data, error, router])

  const initializeScene = () => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      5000
    )
    camera.position.set(0, 0, 2000)
    cameraRef.current = camera

    // Renderer
    const renderer = new CSS3DRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    controls.minDistance = 500
    controls.maxDistance = 3000
    controlsRef.current = controls

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    setIsLoading(false)
  }

  const createObjects = (personData: PersonData[]) => {
    if (!sceneRef.current) return

    // Clear existing objects
    objectsRef.current.forEach(obj => {
      sceneRef.current?.remove(obj)
    })
    objectsRef.current = []

    personData.forEach((person, index) => {
      const element = createElement(person, index)
      const object = new CSS3DObject(element)
      object.position.copy(getTableLayout(personData.length)[index].position)
      sceneRef.current?.add(object)
      objectsRef.current.push(object)
    })
  }

  const createElement = (person: PersonData, index: number) => {
    const element = document.createElement('div')
    element.className = 'element'

    // Determine color class based on net worth
    let colorClass = 'networth-red'
    if (person.netWorth >= 200000) {
      colorClass = 'networth-green'
    } else if (person.netWorth >= 100000) {
      colorClass = 'networth-orange'
    }

    element.classList.add(colorClass)

    // Format net worth
    const formattedNetWorth = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(person.netWorth)

    element.innerHTML = `
      <div class="number">${person.rank}</div>
      <div class="symbol">${person.name.charAt(0).toUpperCase()}</div>
      <div class="details">
        <div class="name">${person.name}</div>
        <div class="company">${person.company}</div>
        <div class="country">${person.country}</div>
        <div class="networth">${formattedNetWorth}</div>
      </div>
    `

    return element
  }

  const transform = (targets: LayoutTarget[], duration: number = 2000) => {
    objectsRef.current.forEach((object, i) => {
      if (i >= targets.length) return

      const target = targets[i]
      
      gsap.to(object.position, {
        duration: duration / 1000,
        x: target.position.x,
        y: target.position.y,
        z: target.position.z,
        ease: "power2.inOut"
      })

      gsap.to(object.rotation, {
        duration: duration / 1000,
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z,
        ease: "power2.inOut"
      })
    })
  }

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return

    cameraRef.current.aspect = window.innerWidth / window.innerHeight
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
  }

  const animate = () => {
    requestAnimationFrame(animate)
    
    if (controlsRef.current) {
      controlsRef.current.update()
    }
    
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }

  const handleLayoutChange = (layout: LayoutType) => {
    if (!data.length) return

    currentLayoutRef.current = layout
    setCurrentLayout(layout)

    let targets: LayoutTarget[] = []
    
    switch (layout) {
      case 'table':
        targets = getTableLayout(data.length)
        break
      case 'sphere':
        targets = getSphereLayout(data.length)
        break
      case 'helix':
        targets = getDoubleHelixLayout(data.length)
        break
      case 'grid':
        targets = getGridLayout(data.length)
        break
    }

    transform(targets)
  }

  const handleLogout = () => {
    localStorage.removeItem('googleAuth')
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading 3D Scene...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Data</h1>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Menu */}
      <div id="menu">
        <button
          className={currentLayout === 'table' ? 'active' : ''}
          onClick={() => handleLayoutChange('table')}
        >
          Table
        </button>
        <button
          className={currentLayout === 'sphere' ? 'active' : ''}
          onClick={() => handleLayoutChange('sphere')}
        >
          Sphere
        </button>
        <button
          className={currentLayout === 'helix' ? 'active' : ''}
          onClick={() => handleLayoutChange('helix')}
        >
          Double Helix
        </button>
        <button
          className={currentLayout === 'grid' ? 'active' : ''}
          onClick={() => handleLayoutChange('grid')}
        >
          Grid
        </button>
      </div>

      {/* Legend */}
      <div id="legend">
        <h3>Net Worth Legend</h3>
        <div className="legend-item">
          <div className="legend-color red"></div>
          <span>&lt; $100,000</span>
        </div>
        <div className="legend-item">
          <div className="legend-color orange"></div>
          <span>$100,000 - $199,999</span>
        </div>
        <div className="legend-item">
          <div className="legend-color green"></div>
          <span>≥ $200,000</span>
        </div>
      </div>

      {/* Data Source Link */}
      <a
        id="data-source"
        href={process.env.NEXT_PUBLIC_CSV_URL || '#'}
        target="_blank"
        rel="noopener noreferrer"
      >
        Data Source
      </a>

      {/* Logout Button */}
      <button id="logout" onClick={handleLogout}>
        Logout
      </button>

      {/* Info */}
      <div id="info">
        <div>Kasatria Periodic Table | {data.length} entries loaded</div>
      </div>
    </div>
  )
}

