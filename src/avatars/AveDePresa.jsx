import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function AveDePresa({ isPlaying, songData, isCurrentSong, onClick, movementZone }) {
  const eagleRef = useRef()
  const [hovered, setHovered] = useState(false)
  const currentPositionRef = useRef([0, 20, -10]) // Store current position
  
  // Use movement zone if provided, otherwise use defaults
  const zone = movementZone || {
    xRange: [-50, 50],
    yRange: [10, 30],
    zRange: [-30, 20]
  }
  
  // Load the GLB model with animations
  const { nodes, materials, animations, scene } = useGLTF('/blender/ave_de_presa_views/robot_bird_eagle.glb')
  
  // Set up animation mixer
  const mixerRef = useRef()
  
  React.useEffect(() => {
    if (scene && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene)
      animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip)
        action.play()
      })
    }
    
    // Cleanup animation mixer
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
        mixerRef.current.uncacheRoot(scene)
      }
    }
  }, [scene, animations])

  useFrame((state, delta) => {
    if (!eagleRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
    
    // SIMPLE EAGLE FLIGHT - Clear trajectory
    
    // Simple waypoints for the eagle
    const waypoints = [
      { x: -30, y: 20, z: -20 },  // Start left, high
      { x: -15, y: 25, z: -10 },  // Move right, higher
      { x: 0, y: 20, z: 0 },      // GO TO CENTER
      { x: 15, y: 25, z: -10 },   // Move right, higher
      { x: 30, y: 20, z: -20 },   // Go right, lower
      { x: 15, y: 15, z: -10 },   // Turn left, lower
      { x: 0, y: 18, z: 5 },      // BACK TO CENTER (closer)
      { x: -15, y: 15, z: -10 },  // Turn left, lower
      { x: -30, y: 20, z: -20 }   // Back to start
    ]
    
    // Simple timing
    const totalTime = 25 // 25 second cycle
    const currentTime = (time % totalTime) / totalTime
    const waypointIndex = Math.floor(currentTime * (waypoints.length - 1))
    const nextWaypointIndex = (waypointIndex + 1) % (waypoints.length - 1)
    
    // Simple linear interpolation
    const segmentProgress = (currentTime * (waypoints.length - 1)) % 1
    
    // Get current and next waypoints
    const currentWaypoint = waypoints[waypointIndex]
    const nextWaypoint = waypoints[nextWaypointIndex]
    
    // Interpolate position
    const x = currentWaypoint.x + (nextWaypoint.x - currentWaypoint.x) * segmentProgress
    const y = currentWaypoint.y + (nextWaypoint.y - currentWaypoint.y) * segmentProgress
    const z = currentWaypoint.z + (nextWaypoint.z - currentWaypoint.z) * segmentProgress
    
    // Set position
    eagleRef.current.position.set(x, y, z)
    
    // Store current position for lighting component
    currentPositionRef.current = [x, y, z]
    
    // Calculate direction vector for proper orientation
    const direction = new THREE.Vector3(
      nextWaypoint.x - currentWaypoint.x,
      nextWaypoint.y - currentWaypoint.y,
      nextWaypoint.z - currentWaypoint.z
    )
    direction.normalize()
    
    // Simple forward-facing rotation - only turn left/right
    const turnAngle = Math.atan2(direction.x, direction.z)
    eagleRef.current.rotation.y = turnAngle
    
    // Simple depth scaling - bigger when closer to viewer
    const depthScale = 0.6 + (z + 20) / 40 * 1.4 // Scale from 0.6 to 2.0
    eagleRef.current.scale.setScalar(depthScale)
    
    // Hover effect
    if (hovered) {
      eagleRef.current.scale.multiplyScalar(1.15)
    }
  })
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
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
      ref={eagleRef} 
      position={[-30, 20, -20]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 3D EAGLE MODEL from GLB - Use scene with animations */}
      <primitive object={scene} />
        
      {/* Subtle lighting that doesn't overpower textures */}
      <EagleLighting 
        isCurrentSong={isCurrentSong} 
        isPlaying={isPlaying} 
        position={currentPositionRef.current} // Pass current position for dynamic lighting
      />
      
      {/* Clickable area */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
        </mesh>
      
      {/* Aerial particle effects */}
      <AerialParticles isPlaying={isPlaying} />
    </group>
  )
}

// Subtle Lighting Component that preserves textures
function EagleLighting({ isCurrentSong, isPlaying, position }) {
  const lightsRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (lightsRef.current) {
      // Very subtle light animation
      lightsRef.current.children.forEach((light, index) => {
        if (light.isPointLight) {
          light.intensity = isCurrentSong ? 
            (0.4 + Math.sin(time * 1.2 + index) * 0.15) : 0.25
        }
      })
    }
  })
  
  return (
    <group ref={lightsRef}>
      {/* Very subtle ambient lighting - preserve original textures */}
      <pointLight
        position={[0, 0, 3]}
        intensity={isCurrentSong ? 0.5 : 0.25}
        color={isCurrentSong ? "#8b0000" : "#ffffff"}
        distance={12}
        decay={3}
        />
      
      {/* Top light - very subtle */}
      <pointLight
        position={[0, 3, 0]}
        intensity={isCurrentSong ? 0.4 : 0.2}
        color={isCurrentSong ? "#8b0000" : "#ffffff"}
        distance={10}
        decay={3}
        />
      
      {/* Bottom light - very subtle */}
      <pointLight
        position={[0, -3, 0]}
        intensity={isCurrentSong ? 0.3 : 0.15}
        color={isCurrentSong ? "#8b0000" : "#ffffff"}
        distance={10}
        decay={3}
        />
      
      {/* Left side light - very subtle */}
      <pointLight
        position={[-3, 0, 0]}
        intensity={isCurrentSong ? 0.35 : 0.18}
        color={isCurrentSong ? "#8b0000" : "#ffffff"}
        distance={10}
        decay={3}
        />
      
      {/* Right side light - very subtle */}
      <pointLight
        position={[3, 0, 0]}
        intensity={isCurrentSong ? 0.35 : 0.18}
        color={isCurrentSong ? "#8b0000" : "#ffffff"}
        distance={10}
        decay={3}
      />
      
      {/* Back light - very subtle */}
      <pointLight
        position={[0, 0, -3]}
        intensity={isCurrentSong ? 0.3 : 0.15}
        color={isCurrentSong ? "#8b0000" : "#ffffff"}
        distance={10}
        decay={3}
        />
      
      {/* Laser eyes when playing - more visible */}
      {isPlaying && (
        <>
          <pointLight
            position={[-0.5, 0, 2]}
            intensity={1.2}
            color="#ff0000"
            distance={8}
            decay={2}
          />
          <pointLight
            position={[0.5, 0, 2]}
            intensity={1.2}
          color="#ff0000" 
            distance={8}
            decay={2}
        />
        </>
      )}
      
      {/* Dynamic lighting when approaching viewer */}
      {position && position[2] > -8 && Math.abs(position[0]) < 10 && (
        <>
          <pointLight
            position={[0, 0, -2]}
            intensity={0.8}
            color="#ff6600"
            distance={6}
            decay={1.5}
          />
          <pointLight
            position={[0, 2, -1]}
            intensity={0.6}
            color="#ff6600"
            distance={4}
            decay={1.5}
          />
        </>
      )}
    </group>
  )
}

// Aerial particle effects for eagle
function AerialParticles({ isPlaying }) {
  const particlesRef = useRef()
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      
      // Animate particles
      particlesRef.current.children.forEach((particle, index) => {
        if (particle.isMesh) {
          // Slow downward drift (like falling debris)
          particle.position.y -= 0.02
          particle.position.x += Math.sin(time * 0.3 + index) * 0.01
          
          // Reset particles that go too low
          if (particle.position.y < -20) {
            particle.position.y = 30
            particle.position.x = (Math.random() - 0.5) * 50
            particle.position.z = (Math.random() - 0.5) * 50
          }
          
          // Subtle rotation
          particle.rotation.z += 0.02
        }
      })
    }
  })
  
  return (
    <group ref={particlesRef}>
      {/* Generate aerial debris */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={`debris-${i}`}
          position={[
            (Math.random() - 0.5) * 50,
            20 + Math.random() * 20,
            (Math.random() - 0.5) * 50
          ]}
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial 
            color="#8b0000"
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
      
      {/* Generate floating feathers */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`feather-${i}`}
          position={[
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 30 + 10,
            (Math.random() - 0.5) * 60
          ]}
        >
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshBasicMaterial 
            color="#333333"
        transparent
            opacity={0.5}
      />
    </mesh>
      ))}
    </group>
  )
}

export default AveDePresa 