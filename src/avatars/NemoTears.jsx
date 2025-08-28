import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { movementOrchestrator } from '../utils/MovementOrchestrator'

// ============================================================================
// SIMPLE MOVEMENT CONFIGURATION
// ============================================================================
const MOVEMENT_CONFIG = {
  SPEED: 2.0,                 // Forward movement speed
  TURN_SPEED: 0.8,           // How fast it turns (radians per second)
  TURN_RADIUS: 8,            // How wide the turns are
  
  // Starting position and nose direction
  START_POSITION: { x: 0, y: -5, z: -30 },  // Start underwater
  START_ROTATION: 0,         // 0 = pointing right, Math.PI/2 = pointing forward, etc.
  START_SCALE: 1.0
}

function NemoTears({ isPlaying, songData, isCurrentSong, onClick, movementZone }) {
  const nautilusRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const { nodes } = useGLTF('/blender/nautilus_views/nautilus.glb')

  // ============================================================================
  // ORCHESTRATED NAVIGATION STATE
  // ============================================================================
  const navigationState = useRef({
    // Current position and orientation
    position: { ...MOVEMENT_CONFIG.START_POSITION },
    rotation: MOVEMENT_CONFIG.START_ROTATION,
    scale: MOVEMENT_CONFIG.START_SCALE,
    
    // Target waypoint
    currentWaypointIndex: 0,
    targetPosition: null,
    waypoints: [],
    
    // Movement state
    isInitialized: false,
    zone: null
  })

  // Register with orchestrator on mount
  useEffect(() => {
    const zone = movementOrchestrator.registerAvatar('submarine', MOVEMENT_CONFIG.START_POSITION)
    if (zone) {
      navigationState.current.zone = zone
      navigationState.current.waypoints = movementOrchestrator.getWaypointsForAvatar('submarine')
      navigationState.current.targetPosition = { ...navigationState.current.waypoints[0] }
    }
  }, [])

  // ============================================================================
  // SIMPLE NOSE-FORWARD NAVIGATION LOOP
  // ============================================================================
  
  useFrame((frameState, delta) => {
    const nautilus = nautilusRef.current
    if (!nautilus) return

    const nav = navigationState.current
    
    // Initialize position on first frame
    if (!nav.isInitialized) {
      nautilus.position.set(nav.position.x, nav.position.y, nav.position.z)
      nautilus.rotation.y = nav.rotation
      nautilus.scale.setScalar(nav.scale)
      nav.isInitialized = true
      return
    }
    
    // ============================================================================
    // STEP 1: Calculate direction to target waypoint
    // ============================================================================
    const target = nav.targetPosition
    const current = nav.position
    
    // Vector from current position to target
    const toTarget = {
      x: target.x - current.x,
      y: target.y - current.y,
      z: target.z - current.z
    }
    
    // Distance to target
    const distanceToTarget = Math.sqrt(toTarget.x * toTarget.x + toTarget.y * toTarget.y + toTarget.z * toTarget.z)
    
    // Check if we've reached the current waypoint (within 2 units)
    if (distanceToTarget < 2) {
      // Move to next waypoint
      nav.currentWaypointIndex = (nav.currentWaypointIndex + 1) % nav.waypoints.length
      nav.targetPosition = { ...nav.waypoints[nav.currentWaypointIndex] }
      console.log(`🚢 Nautilus heading to waypoint ${nav.currentWaypointIndex}:`, nav.targetPosition)
      return // Skip this frame to recalculate with new target
    }
    
    // ============================================================================
    // STEP 2: Calculate desired nose direction (angle to target)
    // ============================================================================
    const desiredRotation = Math.atan2(toTarget.x, toTarget.z) // atan2(x, z) gives Y-axis rotation
    
    // ============================================================================
    // STEP 3: Smoothly turn nose towards target
    // ============================================================================
    let rotationDiff = desiredRotation - nav.rotation
    
    // Handle angle wrapping (shortest path)
    while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
    while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI
    
    // Apply turn speed limit
    const maxTurnThisFrame = MOVEMENT_CONFIG.TURN_SPEED * delta
    if (Math.abs(rotationDiff) > maxTurnThisFrame) {
      rotationDiff = Math.sign(rotationDiff) * maxTurnThisFrame
    }
    
    nav.rotation += rotationDiff
    
    // ============================================================================
    // STEP 4: Move forward in nose direction
    // ============================================================================
    const speed = MOVEMENT_CONFIG.SPEED * delta
    
    // Calculate forward vector based on nose direction
    const forwardX = Math.sin(nav.rotation) * speed
    const forwardZ = Math.cos(nav.rotation) * speed
    
    // Move forward
    nav.position.x += forwardX
    nav.position.z += forwardZ
    
    // Simple Y movement towards target (up/down)
    const yDiff = toTarget.y
    nav.position.y += Math.sign(yDiff) * Math.min(Math.abs(yDiff), speed) * 0.5 // Slower Y movement
    
    // ============================================================================
    // STEP 5: Apply depth-based scaling (bigger when closer to camera)
    // ============================================================================
    const bounds = nav.zone ? nav.zone.bounds : { z: [-60, -10] }
    const zNormalized = (nav.position.z - bounds.z[0]) / (bounds.z[1] - bounds.z[0])
    nav.scale = 0.4 + (1 - zNormalized) * 1.2 // Scale from 0.4 (far) to 1.6 (close)
    
    // ============================================================================
    // STEP 6: Update Three.js object
    // ============================================================================
    nautilus.position.set(nav.position.x, nav.position.y, nav.position.z)
    nautilus.rotation.y = nav.rotation
    nautilus.scale.setScalar(nav.scale * (hovered ? 1.1 : 1.0))
    
    // ============================================================================
    // STEP 7: Update orchestrator and check boundaries
    // ============================================================================
    movementOrchestrator.updatePosition('submarine', nav.position)
    
    // Check if out of assigned zone
    if (nav.zone && !movementOrchestrator.isPositionInZone('submarine', nav.position)) {
      // Get a safe waypoint within zone
      nav.targetPosition = movementOrchestrator.getSafeWaypoint('submarine')
      console.log('🚢 Nautilus out of zone, heading to safe waypoint:', nav.targetPosition)
    }
  })
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  const handlePointerOver = () => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }
  
  return (
    <group 
      ref={nautilusRef} 
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group>
        {Object.keys(nodes).map((nodeName) => {
          const node = nodes[nodeName]
          if (node.isMesh) {
            return (
              <mesh
                key={nodeName}
                geometry={node.geometry}
                position={node.position}
                rotation={node.rotation}
                scale={node.scale}
                material={node.material}
              />
            )
          }
          return null
        })}
      </group>
      
      <NautilusLighting isCurrentSong={isCurrentSong} isPlaying={isPlaying} />
      
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <UnderwaterParticles isPlaying={isPlaying} />
    </group>
  )
}

// ============================================================================
// LIGHTING COMPONENT
// ============================================================================
function NautilusLighting({ isCurrentSong, isPlaying }) {
  const lightsRef = useRef()
  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, index) => {
        if (light.isPointLight) {
          light.intensity = isCurrentSong
            ? 0.3 + Math.sin(time * 1 + index) * 0.1
            : 0.2
        }
      })
    }
  })
  
  return (
    <group ref={lightsRef}>
      {/* SUBMARINE FOLLOWING LIGHT - Moves with the submarine */}
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#00ffff" distance={20} decay={1.5} />
      <pointLight position={[0, 2, 0]} intensity={1.2} color="#00ffff" distance={15} decay={1.5} />
      <pointLight position={[0, -2, 0]} intensity={0.8} color="#00ffff" distance={15} decay={1.5} />
      <pointLight position={[-2, 0, 0]} intensity={1.0} color="#00ffff" distance={15} decay={1.5} />
      <pointLight position={[2, 0, 0]} intensity={1.0} color="#00ffff" distance={15} decay={1.5} />
      <pointLight position={[0, 0, -3]} intensity={0.8} color="#00ffff" distance={15} decay={1.5} />
      
      {/* WIDE AREA LIGHTS - Cover the entire movement range */}
      <pointLight position={[20, 0, -40]} intensity={0.8} color="#00ffff" distance={30} decay={1} />
      <pointLight position={[-20, 0, -40]} intensity={0.8} color="#00ffff" distance={30} decay={1} />
      <pointLight position={[0, 0, -40]} intensity={1.0} color="#00ffff" distance={40} decay={1} />
      
      {isPlaying && (
        <>
          <pointLight position={[-0.8, 0, -3]} intensity={2.0} color="#ff6600" distance={10} decay={1} />
          <pointLight position={[0.8, 0, -3]} intensity={2.0} color="#ff6600" distance={10} decay={1} />
        </>
      )}
    </group>
  )
}

// ============================================================================
// UNDERWATER PARTICLES COMPONENT
// ============================================================================
function UnderwaterParticles({ isPlaying }) {
  const particlesRef = useRef()
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      particlesRef.current.children.forEach((particle, index) => {
        if (particle.isMesh) {
          particle.position.y += 0.01
          particle.position.x += Math.sin(time * 0.5 + index) * 0.005
          if (particle.position.y > 20) {
            particle.position.y = -20
            particle.position.x = (Math.random() - 0.5) * 40
            particle.position.z = (Math.random() - 0.5) * 40
          }
          particle.rotation.z += 0.01
        }
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={`bubble-${i}`}
          position={[
            (Math.random() - 0.5) * 40,
            -20 + Math.random() * 40,
            (Math.random() - 0.5) * 40
          ]}
        >
          <sphereGeometry args={[0.1 + Math.random() * 0.2, 8, 8]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`debris-${i}`}
          position={[
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 50
          ]}
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#0066cc" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export default NemoTears
