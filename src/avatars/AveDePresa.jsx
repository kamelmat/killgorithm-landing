import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { movementOrchestrator } from '../utils/MovementOrchestrator'

// ============================================================================
// EAGLE MOVEMENT CONFIGURATION
// ============================================================================
const MOVEMENT_CONFIG = {
  SPEED: 3.0,                 // Eagle flies faster than submarine
  TURN_SPEED: 1.2,           // Eagles turn more aggressively
  TURN_RADIUS: 6,            // Tighter turns
  
  // Starting position and nose direction (at eye level, close)
  START_POSITION: { x: 0, y: 2, z: -20 },  // Start center, low, back
  START_ROTATION: 0,  // Start facing straight ahead
  START_SCALE: 0.8
}

function AveDePresa({ isPlaying, songData, isCurrentSong, onClick, movementZone }) {
  const eagleRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Load the GLB model with animations
  const { nodes, materials, animations, scene } = useGLTF('/blender/ave_de_presa_views/robot_bird_eagle.glb')
  
  // Debug: Log model loading
  useEffect(() => {
    console.log('🦅🎯 GLB Model loaded:', {
      hasScene: !!scene,
      hasNodes: !!nodes && Object.keys(nodes).length,
      hasAnimations: animations?.length || 0,
      sceneChildren: scene?.children?.length || 0
    })
  }, [scene, nodes, animations])
  
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
    console.log('🦅 AveDePresa component mounting...')
    const zone = movementOrchestrator.registerAvatar('eagle', MOVEMENT_CONFIG.START_POSITION)
    if (zone) {
      navigationState.current.zone = zone
      navigationState.current.waypoints = movementOrchestrator.getWaypointsForAvatar('eagle')
      navigationState.current.targetPosition = { ...navigationState.current.waypoints[0] }
      console.log('🦅 Eagle registered with orchestrator, waypoints:', navigationState.current.waypoints.length)
    } else {
      console.error('🦅 Failed to register eagle with orchestrator')
    }
  }, [])

  // ============================================================================
  // EAGLE NOSE-FORWARD NAVIGATION LOOP
  // ============================================================================
  
  useFrame((frameState, delta) => {
    const eagle = eagleRef.current
    if (!eagle) return

    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    const nav = navigationState.current
    
    // Initialize position on first frame
    if (!nav.isInitialized) {
      eagle.position.set(nav.position.x, nav.position.y, nav.position.z)
      eagle.rotation.y = nav.rotation
      eagle.scale.setScalar(nav.scale)
      nav.isInitialized = true
      return
    }
    
    // Skip if no waypoints yet
    if (!nav.targetPosition || nav.waypoints.length === 0) return
    
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
    
    // Check if we've reached the current waypoint (within 3 units for eagle)
    if (distanceToTarget < 3) {
      // Move to next waypoint
      nav.currentWaypointIndex = (nav.currentWaypointIndex + 1) % nav.waypoints.length
      nav.targetPosition = { ...nav.waypoints[nav.currentWaypointIndex] }
      
      // Special logging for Z movement
      if (nav.targetPosition.z > 10) {
        console.log(`🦅🔥 Eagle VERY FORWARD APPROACH! Z=${nav.targetPosition.z} (MASSIVE SIZE!)`)
      } else if (nav.targetPosition.z > 0) {
        console.log(`🦅✨ Eagle FORWARD APPROACH! Z=${nav.targetPosition.z} (Big size)`)
      } else if (nav.targetPosition.z < -15) {
        console.log(`🦅⬅️ Eagle going FAR BACK! Z=${nav.targetPosition.z} (Small size)`)
      } else {
        console.log(`🦅 Eagle waypoint ${nav.currentWaypointIndex}: X=${nav.targetPosition.x.toFixed(1)} Y=${nav.targetPosition.y.toFixed(1)} Z=${nav.targetPosition.z.toFixed(1)}`)
      }
      return // Skip this frame to recalculate with new target
    }
    
    // ============================================================================
    // STEP 2: Calculate desired nose direction (angle to target)
    // ============================================================================
    const desiredRotation = Math.atan2(toTarget.x, toTarget.z) // atan2(x, z) gives Y-axis rotation
    
    // ============================================================================
    // STEP 3: Smoothly turn nose towards target (eagles turn faster)
    // ============================================================================
    let rotationDiff = desiredRotation - nav.rotation
    
    // Handle angle wrapping (shortest path)
    while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
    while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI
    
    // Apply turn speed limit (eagles turn faster)
    const maxTurnThisFrame = MOVEMENT_CONFIG.TURN_SPEED * delta
    if (Math.abs(rotationDiff) > maxTurnThisFrame) {
      rotationDiff = Math.sign(rotationDiff) * maxTurnThisFrame
    }
    
    nav.rotation += rotationDiff
    
    // ============================================================================
    // STEP 4: Move forward in nose direction (eagles fly faster)
    // ============================================================================
    const speed = MOVEMENT_CONFIG.SPEED * delta
    
    // Calculate forward vector based on nose direction
    const forwardX = Math.sin(nav.rotation) * speed
    const forwardZ = Math.cos(nav.rotation) * speed
    
    // Move forward
    nav.position.x += forwardX
    nav.position.z += forwardZ
    
    // Y movement towards target (eagles are more agile in vertical movement)
    const yDiff = toTarget.y
    nav.position.y += Math.sign(yDiff) * Math.min(Math.abs(yDiff), speed) * 0.8 // Faster Y movement for eagle
    
    // ============================================================================
    // STEP 5: Apply depth-based scaling (EXTREME scaling for forward movement)
    // ============================================================================
    const bounds = nav.zone ? nav.zone.bounds : { z: [-25, 15] }
    
    // EXTREME scaling based on Z position
    if (nav.position.z > 10) {
      // VERY FORWARD - gets MASSIVE
      nav.scale = 3.0 + (nav.position.z - 10) * 1.0 // Scale 3.0+ when very forward
    } else if (nav.position.z > 0) {
      // FORWARD positions - dramatic scaling
      nav.scale = 1.8 + nav.position.z * 0.12 // Scale 1.8 to 3.0 
    } else if (nav.position.z > -10) {
      // CLOSE behind camera - normal large
      nav.scale = 1.2 + (nav.position.z + 10) * 0.06 // Scale 1.2 to 1.8
    } else {
      // FAR behind camera - smaller
      nav.scale = 0.4 + (nav.position.z + 25) * 0.053 // Scale 0.4 to 1.2
    }
    
    // ============================================================================
    // STEP 6: Update Three.js object
    // ============================================================================
    eagle.position.set(nav.position.x, nav.position.y, nav.position.z)
    eagle.rotation.y = nav.rotation
    eagle.scale.setScalar(nav.scale * (hovered ? 1.15 : 1.0))
    
    // Debug: Log when eagle is facing forward (toward positive Z)
    const facingForward = Math.abs(nav.rotation) < Math.PI / 4 || Math.abs(nav.rotation - Math.PI) < Math.PI / 4
    if (facingForward && nav.position.z > 5) {
      console.log(`🦅👁️ Eagle FACING FORWARD at Z=${nav.position.z.toFixed(1)}, rotation=${(nav.rotation * 180 / Math.PI).toFixed(1)}°, scale=${nav.scale.toFixed(2)}`)
    }
    
    // ============================================================================
    // STEP 7: Update orchestrator and check boundaries
    // ============================================================================
    movementOrchestrator.updatePosition('eagle', nav.position)
    
    // Check if out of assigned zone
    if (nav.zone && !movementOrchestrator.isPositionInZone('eagle', nav.position)) {
      // Get a safe waypoint within zone
      nav.targetPosition = movementOrchestrator.getSafeWaypoint('eagle')
      console.log('🦅 Eagle out of zone, heading to safe waypoint:', nav.targetPosition)
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
      />
      
      {/* Clickable area */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Aerial particle effects */}
      <AerialParticles isPlaying={isPlaying} />
      
      {/* DEBUG: Always visible test sphere to confirm effects are rendering */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial 
          color="#ff00ff" 
          emissive="#ff00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

// DRAMATIC LIGHTING SYSTEM for eagle
function EagleLighting({ isCurrentSong, isPlaying }) {
  const lightsRef = useRef()
  const dynamicLightsRef = useRef()
  const auraRef = useRef()
  
  // Debug: Log lighting state changes
  useEffect(() => {
    console.log('🦅💡 EagleLighting mounted - isCurrentSong:', isCurrentSong, 'isPlaying:', isPlaying)
  }, [])
  
  useEffect(() => {
    console.log('🦅🎵 EagleLighting state changed - isCurrentSong:', isCurrentSong, 'isPlaying:', isPlaying)
  }, [isCurrentSong, isPlaying])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // MAIN LIGHTS - Dynamic intensity
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, index) => {
        if (light.isPointLight) {
          if (isCurrentSong && isPlaying) {
            // INTENSE pulsing when song is active
            light.intensity = 1.5 + Math.sin(time * 3 + index) * 0.8
          } else if (isCurrentSong) {
            // Medium intensity when selected but not playing
            light.intensity = 0.8 + Math.sin(time * 1.2 + index) * 0.3
          } else {
            // Subtle when not selected
            light.intensity = 0.3
          }
        }
      })
    }
    
    // DYNAMIC ORBITAL LIGHTS - When playing
    if (dynamicLightsRef.current && isPlaying) {
      dynamicLightsRef.current.children.forEach((light, index) => {
        if (light.isPointLight) {
          // Orbital motion
          const radius = 8 + Math.sin(time * 0.5) * 2
          const angle = time * 2 + index * (Math.PI * 2 / 4)
          light.position.x = Math.cos(angle) * radius
          light.position.z = Math.sin(angle) * radius
          light.position.y = Math.sin(time * 1.5 + index) * 3
          
          // Pulsing intensity
          light.intensity = 2.0 + Math.sin(time * 4 + index) * 1.0
        }
      })
    }
    
    // ENERGY AURA - Surrounding glow
    if (auraRef.current) {
      const auraIntensity = isPlaying ? 1.0 : (isCurrentSong ? 0.6 : 0.2)
      const auraPulse = Math.sin(time * 2) * 0.3 + 0.7
      
      auraRef.current.children.forEach((light, index) => {
        if (light.isPointLight) {
          light.intensity = auraIntensity * auraPulse * (0.8 + index * 0.1)
        }
      })
    }
  })
  
  return (
    <group>
      {/* MAIN EAGLE LIGHTS - Core illumination */}
      <group ref={lightsRef}>
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#ff0040" distance={15} decay={2} />
        <pointLight position={[0, 3, 0]} intensity={0.4} color="#ff6600" distance={12} decay={2} />
        <pointLight position={[0, -3, 0]} intensity={0.3} color="#ff0040" distance={12} decay={2} />
        <pointLight position={[-3, 0, 0]} intensity={0.35} color="#ff6600" distance={12} decay={2} />
        <pointLight position={[3, 0, 0]} intensity={0.35} color="#ff0040" distance={12} decay={2} />
        <pointLight position={[0, 0, -3]} intensity={0.3} color="#ff6600" distance={12} decay={2} />
      </group>
      
      {/* DYNAMIC ORBITAL LIGHTS - When playing */}
      {isPlaying && (
        <group ref={dynamicLightsRef}>
          <pointLight position={[8, 0, 0]} intensity={2.0} color="#00ffff" distance={20} decay={1.5} />
          <pointLight position={[-8, 0, 0]} intensity={2.0} color="#ff0080" distance={20} decay={1.5} />
          <pointLight position={[0, 0, 8]} intensity={2.0} color="#80ff00" distance={20} decay={1.5} />
          <pointLight position={[0, 0, -8]} intensity={2.0} color="#ff8000" distance={20} decay={1.5} />
        </group>
      )}
      
      {/* ENERGY AURA - Surrounding glow */}
      <group ref={auraRef}>
        <pointLight position={[0, 0, 0]} intensity={0.6} color="#ffffff" distance={25} decay={1} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#ff4080" distance={18} decay={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#40ff80" distance={18} decay={1.2} />
        <pointLight position={[5, -5, 0]} intensity={0.3} color="#8040ff" distance={15} decay={1.3} />
        <pointLight position={[-5, 5, 0]} intensity={0.3} color="#ff8040" distance={15} decay={1.3} />
      </group>
      
      {/* LASER EYES - Intense forward beams when playing */}
      {isPlaying && (
        <>
          <pointLight position={[-0.8, 0.2, 4]} intensity={3.0} color="#ff0000" distance={12} decay={1} />
          <pointLight position={[0.8, 0.2, 4]} intensity={3.0} color="#ff0000" distance={12} decay={1} />
          <pointLight position={[0, 0, 6]} intensity={2.5} color="#ffffff" distance={15} decay={1.2} />
        </>
      )}
      
      {/* WING TIPS - Edge lighting */}
      {isCurrentSong && (
        <>
          <pointLight position={[-4, 1, 0]} intensity={isPlaying ? 1.5 : 0.8} color="#00ffff" distance={10} decay={2} />
          <pointLight position={[4, 1, 0]} intensity={isPlaying ? 1.5 : 0.8} color="#00ffff" distance={10} decay={2} />
        </>
      )}
    </group>
  )
}

// FUTURISTIC PARTICLE EFFECTS for eagle
function AerialParticles({ isPlaying }) {
  const particlesRef = useRef()
  const energyTrailsRef = useRef()
  const plasmaFieldRef = useRef()
  
  // Debug: Log when component mounts and isPlaying changes
  useEffect(() => {
    console.log('🦅✨ AerialParticles component mounted, isPlaying:', isPlaying)
  }, [])
  
  useEffect(() => {
    console.log('🦅🎵 AerialParticles isPlaying changed to:', isPlaying)
  }, [isPlaying])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // ENERGY PARTICLES - Dynamic movement
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        if (particle.isMesh) {
          // Orbital motion around center
          const speed = isPlaying ? 2.0 : 0.8
          const radius = 15 + Math.sin(time * 0.5 + index) * 5
          particle.position.x = Math.cos(time * speed + index) * radius
          particle.position.y = Math.sin(time * speed * 0.7 + index) * 8 + 5
          particle.position.z = Math.sin(time * speed * 0.3 + index) * 10 - 5
          
          // Pulsing rotation
          particle.rotation.x = time * (1 + index * 0.1)
          particle.rotation.y = time * (0.8 + index * 0.15)
          particle.rotation.z = time * (1.2 + index * 0.05)
          
          // Dynamic scaling
          const pulse = Math.sin(time * 3 + index) * 0.3 + 0.7
          particle.scale.setScalar(pulse * (isPlaying ? 1.5 : 1.0))
        }
      })
    }
    
    // ENERGY TRAILS - Following eagle
    if (energyTrailsRef.current) {
      energyTrailsRef.current.children.forEach((trail, index) => {
        if (trail.isMesh) {
          // Spiral trails
          const trailSpeed = time * 2 + index * 0.5
          trail.position.x = Math.cos(trailSpeed) * (8 + index * 2)
          trail.position.y = Math.sin(trailSpeed * 0.8) * 6 + 3
          trail.position.z = Math.sin(trailSpeed * 0.4) * 8 - 3
          
          // Trail rotation
          trail.rotation.x = trailSpeed * 0.5
          trail.rotation.y = trailSpeed * 0.8
          
          // Intensity based on playing state
          const material = trail.material
          if (material) {
            material.opacity = (Math.sin(time * 4 + index) * 0.3 + 0.7) * (isPlaying ? 0.9 : 0.4)
          }
        }
      })
    }
    
    // PLASMA FIELD - Ambient energy
    if (plasmaFieldRef.current) {
      plasmaFieldRef.current.children.forEach((plasma, index) => {
        if (plasma.isMesh) {
          // Slow floating motion
          plasma.position.y += Math.sin(time * 0.5 + index) * 0.005
          plasma.position.x += Math.cos(time * 0.3 + index) * 0.003
          
          // Plasma pulsing
          const pulseFactor = Math.sin(time * 2 + index * 0.8) * 0.4 + 0.6
          plasma.scale.setScalar(pulseFactor * (isPlaying ? 1.8 : 1.0))
          
          // Color intensity
          const material = plasma.material
          if (material) {
            material.opacity = pulseFactor * (isPlaying ? 0.7 : 0.3)
          }
        }
      })
    }
  })
  
  return (
    <group>
      {/* ENERGY PARTICLES - Crystalline structures */}
      <group ref={particlesRef}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={`energy-${i}`}
            position={[
              Math.cos(i * Math.PI / 4) * 15,
              Math.sin(i * Math.PI / 4) * 8 + 5,
              Math.sin(i * Math.PI / 3) * 10 - 5
            ]}
          >
            <octahedronGeometry args={[0.4, 2]} />
            <meshBasicMaterial 
              color={isPlaying ? "#ff0040" : "#ff6600"}
              transparent
              opacity={0.8}
              emissive={isPlaying ? "#ff0040" : "#ff6600"}
              emissiveIntensity={isPlaying ? 0.6 : 0.3}
            />
          </mesh>
        ))}
      </group>
      
      {/* ENERGY TRAILS - Flowing streams */}
      <group ref={energyTrailsRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={`trail-${i}`}
            position={[
              Math.cos(i * Math.PI / 3) * 8,
              3,
              Math.sin(i * Math.PI / 3) * 8 - 3
            ]}
          >
            <cylinderGeometry args={[0.05, 0.15, 2, 8]} />
            <meshBasicMaterial 
              color={isPlaying ? "#00ffff" : "#0088cc"}
              transparent
              opacity={0.7}
              emissive={isPlaying ? "#00ffff" : "#0088cc"}
              emissiveIntensity={isPlaying ? 0.8 : 0.4}
            />
          </mesh>
        ))}
      </group>
      
      {/* PLASMA FIELD - Ambient energy spheres */}
      <group ref={plasmaFieldRef}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh
            key={`plasma-${i}`}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 20 + 8,
              (Math.random() - 0.5) * 30 - 5
            ]}
          >
            <sphereGeometry args={[0.3 + Math.random() * 0.4, 8, 8]} />
            <meshBasicMaterial 
              color={isPlaying ? "#ff4080" : "#cc3366"}
              transparent
              opacity={0.4}
              emissive={isPlaying ? "#ff4080" : "#cc3366"}
              emissiveIntensity={isPlaying ? 0.5 : 0.2}
            />
          </mesh>
        ))}
      </group>
      
      {/* HOLOGRAPHIC GRID - ALWAYS VISIBLE FOR TESTING */}
      <HolographicGrid />
      
      {/* DEBUG: Force some effects to always be visible */}
      <mesh position={[10, 3, 0]}>
        <octahedronGeometry args={[1, 2]} />
        <meshBasicMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

// HOLOGRAPHIC GRID - Special effect when song is active
function HolographicGrid() {
  const gridRef = useRef()
  
  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.elapsedTime
      
      // Grid animation
      gridRef.current.rotation.y = time * 0.2
      gridRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
      
      // Pulsing effect
      const pulse = Math.sin(time * 3) * 0.2 + 0.8
      gridRef.current.scale.setScalar(pulse)
      
      // Update material opacity
      gridRef.current.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = pulse * 0.3
        }
      })
    }
  })
  
  return (
    <group ref={gridRef}>
      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={`grid-line-${i}`}>
          {/* Horizontal lines */}
          <mesh position={[0, (i - 5) * 2, -10]}>
            <boxGeometry args={[20, 0.02, 0.02]} />
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0.3}
              emissive="#00ffff"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Vertical lines */}
          <mesh position={[(i - 5) * 2, 0, -10]}>
            <boxGeometry args={[0.02, 20, 0.02]} />
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0.3}
              emissive="#00ffff"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default AveDePresa