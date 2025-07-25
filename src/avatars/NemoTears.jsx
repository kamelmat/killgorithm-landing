import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function NemoTears({ isPlaying, songData, isCurrentSong, onClick }) {
  const nautilusRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Load the GLB model
  const { nodes, materials } = useGLTF('/blender/nautilus_views/nautilus.glb')
  
  useFrame((state, delta) => {
    if (!nautilusRef.current) return
    
    const time = state.clock.elapsedTime
    
    // ACTUAL TRAVEL MOVEMENT - The Nautilus moves through 3D space
    
    // Create a complex 3D path for the Nautilus to follow
    const pathRadius = 8
    const pathHeight = 3
    const pathSpeed = 0.3
    
    // Primary circular path with height variation
    const x = Math.sin(time * pathSpeed) * pathRadius
    const y = Math.sin(time * pathSpeed * 0.7) * pathHeight
    const z = Math.cos(time * pathSpeed) * pathRadius - 5
    
    // Set position - this is actual movement through space
    nautilusRef.current.position.set(x, y, z)
    
    // Calculate the direction of travel for proper orientation
    const nextX = Math.sin((time + 0.1) * pathSpeed) * pathRadius
    const nextY = Math.sin((time + 0.1) * pathSpeed * 0.7) * pathHeight
    const nextZ = Math.cos((time + 0.1) * pathSpeed) * pathRadius - 5
    
    // Point the Nautilus in the direction it's traveling
    const direction = new THREE.Vector3(nextX - x, nextY - y, nextZ - z)
    direction.normalize()
    
    // Create a rotation matrix to orient the Nautilus
    const up = new THREE.Vector3(0, 1, 0)
    const right = new THREE.Vector3().crossVectors(direction, up).normalize()
    const correctedUp = new THREE.Vector3().crossVectors(right, direction).normalize()
    
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeBasis(right, correctedUp, direction)
    
    // Apply the rotation
    nautilusRef.current.quaternion.setFromRotationMatrix(rotationMatrix)
    
    // Add subtle banking when turning
    const turnIntensity = Math.abs(Math.sin(time * pathSpeed)) * 0.3
    nautilusRef.current.rotateZ(turnIntensity * 0.1)
    
    // Size changes based on distance from center (depth perception)
    const distanceFromCenter = Math.sqrt(x * x + z * z)
    const depthScale = 1 + (distanceFromCenter / pathRadius) * 0.3
    nautilusRef.current.scale.setScalar(depthScale)
    
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
      position={[0, 0, -5]}
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

export default NemoTears 