import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function NemoTears({ isPlaying, songData, isCurrentSong, onClick, movementZone }) {
  const nautilusRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Load the GLB model
  const { nodes, materials } = useGLTF('/blender/nautilus_views/nautilus.glb')
  
  // Debug: Log model structure to identify nose
  React.useEffect(() => {
    console.log('Nautilus model nodes:', Object.keys(nodes))
    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.isMesh) {
        console.log(`Node: ${nodeName}`, {
          position: node.position,
          rotation: node.rotation,
          scale: node.scale
        })
      }
    })
  }, [nodes])
  
  useFrame((state, delta) => {
    if (!nautilusRef.current) return
    
    const time = state.clock.elapsedTime
    
    // SMOOTH SUBMARINE MOVEMENT WITH SINGLE TURN
    const totalTime = 10 // 10 second cycle
    const currentTime = time % totalTime
    
    if (currentTime < 5) {
      // PHASE 1: 5 seconds of smooth forward movement with slight inclination
      const progress = currentTime / 5 // 0 to 1 over 5 seconds
      
      // Smooth forward movement (Z from -10 to -30, getting smaller)
      const z = -10 + (progress * -20) // Move from -10 to -30
      nautilusRef.current.position.set(0, 0, z)
      
      // Slight Y inclination (5-10 degrees)
      const inclination = progress * (Math.PI / 18) // 0 to 10 degrees (π/18 radians)
      nautilusRef.current.rotation.set(inclination, Math.PI / 2, 0)
      
      // Scale down as it moves away (depth perception)
      const scale = 1.0 - (progress * 0.3) // Scale from 1.0 to 0.7
      nautilusRef.current.scale.setScalar(scale)
      
    } else {
      // PHASE 2: Stabilize and turn right while moving forward (elliptical path)
      const turnProgress = (currentTime - 5) / 5 // 0 to 1 over next 5 seconds
      
      // Calculate elliptical movement - continue moving forward while turning
      const radius = 15 // Radius of the turn
      const angle = turnProgress * Math.PI / 2 // 0 to 90 degrees
      
      // Elliptical path: start at (-30, 0) and curve to the right
      const x = radius * Math.sin(angle) // Move right as it turns
      const z = -30 + (radius * (1 - Math.cos(angle))) // Continue moving forward
      nautilusRef.current.position.set(x, 0, z)
      
      // Stabilize Y rotation to 0, then turn right 90 degrees
      const targetRotation = Math.PI / 2 - (turnProgress * Math.PI / 2) // Turn from 90° to 0° (right turn)
      nautilusRef.current.rotation.set(0, targetRotation, 0)
      
      // Keep consistent scale (no glitch)
      const scale = 0.7 // Fixed scale to prevent glitch
      nautilusRef.current.scale.setScalar(scale)
    }
    
    // Hover effect
    if (hovered) {
      nautilusRef.current.scale.multiplyScalar(1.1)
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
      ref={nautilusRef} 
      position={[0, -10, 40]}
      rotation={[Math.PI, 0, 0]} // Rotate 180° on X to fix nose direction
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 3D NAUTILUS MODEL from GLB - Preserve original materials */}
      <group>
        {/* Render all meshes from the GLB with original materials */}
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
                material={node.material} // Use original material to preserve textures
              />
            )
          }
          return null
        })}
      </group>
      
      {/* Subtle lighting that doesn't overpower textures */}
      <NautilusLighting isCurrentSong={isCurrentSong} isPlaying={isPlaying} />
      
      {/* Clickable area */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Underwater particle effects */}
      <UnderwaterParticles isPlaying={isPlaying} />
    </group>
  )
}

// Subtle Lighting Component that preserves textures
function NautilusLighting({ isCurrentSong, isPlaying }) {
  const lightsRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (lightsRef.current) {
      // Very subtle light animation
      lightsRef.current.children.forEach((light, index) => {
        if (light.isPointLight) {
          light.intensity = isCurrentSong ? 
            (0.3 + Math.sin(time * 1 + index) * 0.1) : 0.2
        }
      })
    }
  })
  
  return (
    <group ref={lightsRef}>
      {/* Very subtle ambient lighting - preserve original textures */}
      <pointLight
        position={[0, 0, 3]}
        intensity={isCurrentSong ? 0.4 : 0.2}
        color={isCurrentSong ? "#00ffff" : "#ffffff"}
        distance={10}
        decay={3}
      />
      
      {/* Top light - very subtle */}
      <pointLight
        position={[0, 2, 0]}
        intensity={isCurrentSong ? 0.3 : 0.15}
        color={isCurrentSong ? "#00ffff" : "#ffffff"}
        distance={8}
        decay={3}
      />
      
      {/* Bottom light - very subtle */}
      <pointLight
        position={[0, -2, 0]}
        intensity={isCurrentSong ? 0.2 : 0.1}
        color={isCurrentSong ? "#00ffff" : "#ffffff"}
        distance={8}
        decay={3}
      />
      
      {/* Left side light - very subtle */}
      <pointLight
        position={[-2, 0, 0]}
        intensity={isCurrentSong ? 0.25 : 0.12}
        color={isCurrentSong ? "#00ffff" : "#ffffff"}
        distance={8}
        decay={3}
      />
      
      {/* Right side light - very subtle */}
      <pointLight
        position={[2, 0, 0]}
        intensity={isCurrentSong ? 0.25 : 0.12}
        color={isCurrentSong ? "#00ffff" : "#ffffff"}
        distance={8}
        decay={3}
      />
      
      {/* Back light - very subtle */}
      <pointLight
        position={[0, 0, -3]}
        intensity={isCurrentSong ? 0.2 : 0.1}
        color={isCurrentSong ? "#00ffff" : "#ffffff"}
        distance={8}
        decay={3}
      />
      
      {/* Thruster lights when playing - more visible */}
      {isPlaying && (
        <>
          <pointLight
            position={[-0.8, 0, -3]}
            intensity={0.8}
            color="#ff6600"
            distance={6}
            decay={2}
          />
          <pointLight
            position={[0.8, 0, -3]}
            intensity={0.8}
            color="#ff6600"
            distance={6}
            decay={2}
          />
        </>
      )}
    </group>
  )
}

// Underwater particle effects for submarine
function UnderwaterParticles({ isPlaying }) {
  const particlesRef = useRef()
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      
      // Animate particles
      particlesRef.current.children.forEach((particle, index) => {
        if (particle.isMesh) {
          // Slow upward drift
          particle.position.y += 0.01
          particle.position.x += Math.sin(time * 0.5 + index) * 0.005
          
          // Reset particles that go too high
          if (particle.position.y > 20) {
            particle.position.y = -20
            particle.position.x = (Math.random() - 0.5) * 40
            particle.position.z = (Math.random() - 0.5) * 40
          }
          
          // Subtle rotation
          particle.rotation.z += 0.01
        }
      })
    }
  })
  
  return (
    <group ref={particlesRef}>
      {/* Generate underwater bubbles */}
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
          <meshBasicMaterial 
            color="#00ffff"
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
      
      {/* Generate floating debris */}
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
          <meshBasicMaterial 
            color="#0066cc"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export default NemoTears 