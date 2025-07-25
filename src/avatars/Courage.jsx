import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Courage({ isPlaying, songData, isCurrentSong, onClick }) {
  const cyborgRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState(0)
  const animationState = useRef({ time: 0, breathingTime: 0, heartPulse: 0 })

  useFrame((state, delta) => {
    if (!cyborgRef.current) return

    const time = state.clock.elapsedTime
    animationState.current.time = time

    // Breathing animation
    animationState.current.breathingTime += delta
    const breathingCycle = Math.sin(animationState.current.breathingTime * 0.5)
    setBreathingPhase(breathingCycle)

    // Floating movement
    cyborgRef.current.position.y = Math.sin(time * 0.3) * 0.2

    // Subtle rotation
    cyborgRef.current.rotation.y = Math.sin(time * 0.2) * 0.1

    // Hover effect
    if (hovered) {
      cyborgRef.current.scale.setScalar(1.1)
      cyborgRef.current.rotation.y = Math.sin(time * 2) * 0.3
    } else {
      cyborgRef.current.scale.setScalar(1)
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
      ref={cyborgRef} 
      position={[0, 0, -3]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Main Cyborg Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 2, 0.8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#333333"}
          metalness={0.8}
          roughness={0.2}
          emissive={isCurrentSong ? "#ff0000" : "#000000"}
          emissiveIntensity={isCurrentSong ? 0.3 : 0}
        />
      </mesh>

      {/* Chest Armor */}
      <mesh position={[0, 0.2, 0.4]}>
        <boxGeometry args={[1.4, 1.2, 0.3]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#444444"}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Shoulder Armor */}
      <mesh position={[0.6, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.4, 1]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#555555"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.6, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.4, 1]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#555555"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#222222"}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 1.5, 0.3]}>
        <boxGeometry args={[0.6, 0.2, 0.1]} />
        <meshStandardMaterial 
          color={hovered || isCurrentSong ? "#ff0000" : "#00ffff"}
          emissive={hovered || isCurrentSong ? "#ff0000" : "#00ffff"}
          emissiveIntensity={hovered ? 1 : (isCurrentSong ? 0.5 : 0.2)}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.8, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#444444"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.8, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#444444"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Heart */}
      <Heart 
        position={[0, 0, 0.4]} 
        breathingPhase={breathingPhase} 
        isPlaying={isPlaying} 
        hovered={hovered}
        isCurrentSong={isCurrentSong}
      />
      
      <BreathingEffect position={[0, 0, 0.5]} phase={breathingPhase} isPlaying={isPlaying} />

      {/* Clickable area */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

function Heart({ position, breathingPhase, isPlaying, hovered, isCurrentSong }) {
  const heartRef = useRef()
  
  useFrame((state) => {
    if (heartRef.current) {
      const time = state.clock.elapsedTime
      const pulse = isPlaying ? Math.sin(time * 3) * 0.1 + 1 : 1
      heartRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <mesh ref={heartRef} position={position}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial 
        color={hovered || isCurrentSong ? "#ff0000" : "#ff6666"}
        emissive={hovered || isCurrentSong ? "#ff0000" : "#ff6666"}
        emissiveIntensity={hovered ? 1 : (isCurrentSong ? 0.8 : 0.3)}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function BreathingEffect({ position, phase, isPlaying }) {
  const effectRef = useRef()
  
  useFrame(() => {
    if (effectRef.current && isPlaying) {
      effectRef.current.scale.setScalar(1 + Math.abs(phase) * 0.2)
      effectRef.current.material.opacity = Math.abs(phase) * 0.3
    }
  })

  return (
    <mesh ref={effectRef} position={position}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshBasicMaterial 
        color="#ff0000"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default Courage 