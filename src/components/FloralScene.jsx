import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function TulipShape({ position, color, scale = 1, speed = 1 }) {
  const groupRef = useRef()
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + timeOffset
    groupRef.current.rotation.y = t * 0.15
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#6BAB6E" roughness={0.6} />
      </mesh>
      {/* Petals - tulip shape */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.sin((i / 5) * Math.PI * 2) * 0.18, 0.1, Math.cos((i / 5) * Math.PI * 2) * 0.18]}
          rotation={[0.3, (i / 5) * Math.PI * 2, 0]}
        >
          <sphereGeometry args={[0.22, 8, 8, 0, Math.PI, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
        </mesh>
      ))}
      {/* Center */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
    </group>
  )
}

function HydrangeaShape({ position, color, scale = 1, speed = 1 }) {
  const groupRef = useRef()
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed * 0.5 + timeOffset
    groupRef.current.rotation.y = t * 0.2
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.08
  })

  const petalPositions = useMemo(() => {
    const positions = []
    for (let ring = 0; ring < 3; ring++) {
      const count = 6 + ring * 4
      const radius = 0.15 + ring * 0.18
      for (let i = 0; i < count; i++) {
        positions.push({
          x: Math.sin((i / count) * Math.PI * 2) * radius,
          y: 0,
          z: Math.cos((i / count) * Math.PI * 2) * radius,
          ring,
        })
      }
    }
    return positions
  }, [])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#5A9E5E" roughness={0.7} />
      </mesh>
      {/* Florets */}
      {petalPositions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y - p.ring * 0.03, p.z]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.02}
            emissive={color}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

function FloatingOrb({ position, color, radius = 0.3 }) {
  const meshRef = useRef()
  const timeOffset = useMemo(() => Math.random() * 100, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime + timeOffset
    meshRef.current.rotation.x = t * 0.3
    meshRef.current.rotation.y = t * 0.2
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[radius, 2]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.3}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

function SceneContent({ mouse }) {
  const { viewport } = useThree()
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += (mouse.current[1] * 0.04 - groupRef.current.rotation.x) * 0.05
      groupRef.current.rotation.y += (mouse.current[0] * 0.04 - groupRef.current.rotation.y) * 0.05
    }
  })

  const shapes = useMemo(() => {
    const items = []
    const spread = Math.min(viewport.width, 10)

    const tulipColors = ['#FF8B94', '#FFB3BA', '#FF6B7A', '#FFD4D7', '#A2C2E8']
    const hydrangeaColors = ['#A2C2E8', '#7AAAD4', '#C8DCEF', '#B8D0E8', '#9BB8DC']

    // Tulips
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const r = 2.5 + Math.random() * 2
      items.push({
        type: 'tulip',
        position: [Math.cos(angle) * r, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3 - 2],
        color: tulipColors[i % tulipColors.length],
        scale: 0.5 + Math.random() * 0.6,
        speed: 0.5 + Math.random() * 0.5,
        id: `t${i}`,
      })
    }

    // Hydrangeas
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + 0.5
      const r = 3 + Math.random() * 2.5
      items.push({
        type: 'hydrangea',
        position: [Math.cos(angle) * r, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3 - 2],
        color: hydrangeaColors[i % hydrangeaColors.length],
        scale: 0.5 + Math.random() * 0.7,
        speed: 0.4 + Math.random() * 0.4,
        id: `h${i}`,
      })
    }

    // Orbs
    for (let i = 0; i < 4; i++) {
      items.push({
        type: 'orb',
        position: [(Math.random() - 0.5) * spread, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3 - 3],
        color: i % 2 === 0 ? '#A2C2E8' : '#FF8B94',
        radius: 0.15 + Math.random() * 0.25,
        id: `o${i}`,
      })
    }

    return items
  }, [viewport.width])

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#fff5e0" />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#A2C2E8" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#FFB3BA" />

      <group ref={groupRef}>
        {shapes.map((s) => {
          if (s.type === 'tulip')
            return <TulipShape key={s.id} position={s.position} color={s.color} scale={s.scale} speed={s.speed} />
          if (s.type === 'hydrangea')
            return <HydrangeaShape key={s.id} position={s.position} color={s.color} scale={s.scale} speed={s.speed} />
          return <FloatingOrb key={s.id} position={s.position} color={s.color} radius={s.radius} />
        })}
      </group>
    </>
  )
}

export default function FloralScene({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      className="absolute inset-0"
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <SceneContent mouse={mouse} />
    </Canvas>
  )
}
