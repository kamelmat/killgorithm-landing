import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function AveDePresa({ isPlaying, songData, isCurrentSong, onClick }) {
  const hawkRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [wingPhase, setWingPhase] = useState(0)
  
  // Animation state
  const animationState = useRef({
    time: 0,
    wingTime: 0,
    laserIntensity: 0
  })

  useFrame((state, delta) => {
    if (!hawkRef.current) return
    
    animationState.current.time += delta
    animationState.current.wingTime += delta
    
    // Wing flapping animation
    const wingCycle = Math.sin(animationState.current.wingTime * 4) * 0.5 + 0.5
    setWingPhase(wingCycle)
    
    // Hovering movement
    const hoverY = Math.sin(animationState.current.time * 0.8) * 0.2
    const hoverX = Math.sin(animationState.current.time * 0.5) * 0.1
    hawkRef.current.position.y = hoverY
    hawkRef.current.position.x = hoverX
    
    // Subtle rotation
    hawkRef.current.rotation.y = Math.sin(animationState.current.time * 0.3) * 0.1
    
    // Hover effect
    if (hovered) {
      hawkRef.current.rotation.y += Math.sin(animationState.current.time * 2) * 0.05
      animationState.current.laserIntensity = Math.min(
        animationState.current.laserIntensity + delta * 3, 
        1
      )
    } else {
      animationState.current.laserIntensity = Math.max(
        animationState.current.laserIntensity - delta * 2, 
        0
      )
    }
  })

  return (
    <group ref={hawkRef} position={[0, 1, -4]}>
      {/* Main Hawk Body */}
      <group>
        {/* Body */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
          <meshStandardMaterial 
            color={isCurrentSong ? "#8b0000" : "#2a2a2a"} 
            metalness={0.9} 
            roughness={0.1}
            emissive={isCurrentSong ? "#8b0000" : "#000000"}
            emissiveIntensity={isCurrentSong ? 0.3 : 0}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.8, 0.6]} castShadow>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Beak */}
        <mesh position={[0, 0.8, 0.9]} castShadow>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Wings */}
      <group>
        {/* Left wing */}
        <Wing 
          position={[-0.8, 0.2, 0]} 
          rotation={[0, 0, Math.PI * 0.3]} 
          phase={wingPhase}
          side="left"
        />
        
        {/* Right wing */}
        <Wing 
          position={[0.8, 0.2, 0]} 
          rotation={[0, 0, -Math.PI * 0.3]} 
          phase={wingPhase}
          side="right"
        />
      </group>
      
      {/* Tail */}
      <group position={[0, 0, -0.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.1, 0.4]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Tail feathers */}
        <mesh position={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.4, 0.05, 0.3]} />
          <meshStandardMaterial 
            color="#333333" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Laser Eyes */}
      <LaserEyes 
        position={[0, 0.8, 0.7]} 
        intensity={animationState.current.laserIntensity}
        hovered={hovered}
      />
      
      {/* Talons */}
      <group position={[0, -0.6, 0.2]}>
        {/* Left talon */}
        <mesh position={[-0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.05, 0.3, 8]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Right talon */}
        <mesh position={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.05, 0.3, 8]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
      </group>
      
      {/* Hover interaction */}
      <mesh 
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        visible={false}
      >
        <capsuleGeometry args={[1.5, 2, 8, 16]} />
      </mesh>
    </group>
  )
}

// Wing component
function Wing({ position, rotation, phase, side }) {
  const wingRef = useRef()
  
  useFrame((state) => {
    if (wingRef.current) {
      // Flapping animation
      const flapAngle = Math.sin(phase * Math.PI * 2) * 0.3
      wingRef.current.rotation.z = rotation[2] + flapAngle
      
      // Subtle movement
      wingRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  return (
    <group ref={wingRef} position={position} rotation={rotation}>
      {/* Main wing */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.1, 1.2]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Wing feathers */}
      <mesh position={[0, 0, 0.6]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.6]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Wing details */}
      <mesh position={[side === 'left' ? -0.4 : 0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1.0]} />
        <meshStandardMaterial 
          color="#cccccc" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

// Laser eyes component
function LaserEyes({ position, intensity, hovered }) {
  return (
    <group position={position}>
      {/* Left eye */}
      <mesh position={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={intensity * 3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Right eye */}
      <mesh position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={intensity * 3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Laser beams when hovered */}
      {hovered && (
        <>
          <LaserBeam 
            position={[-0.15, 0, 0.1]} 
            direction={[0, 0, 1]}
            intensity={intensity}
          />
          <LaserBeam 
            position={[0.15, 0, 0.1]} 
            direction={[0, 0, 1]}
            intensity={intensity}
          />
        </>
      )}
    </group>
  )
}

// Laser beam component
function LaserBeam({ position, direction, intensity }) {
  const beamRef = useRef()
  
  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.material.opacity = intensity * 0.6
      beamRef.current.material.emissiveIntensity = intensity * 2
    }
  })
  
  return (
    <mesh ref={beamRef} position={position}>
      <cylinderGeometry args={[0.02, 0.02, 5, 8]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#ff0000"
        emissiveIntensity={1}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

export default AveDePresa 