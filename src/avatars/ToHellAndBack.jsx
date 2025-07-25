import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ToHellAndBack({ isPlaying, songData, isCurrentSong, onClick }) {
  const batRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [wingPhase, setWingPhase] = useState(0)
  const animationState = useRef({ time: 0, wingTime: 0, fireIntensity: 0 })

  useFrame((state, delta) => {
    if (!batRef.current) return

    const time = state.clock.elapsedTime
    animationState.current.time = time

    // Aggressive wing flapping
    animationState.current.wingTime += delta
    const wingCycle = Math.sin(animationState.current.wingTime * 6)
    setWingPhase(wingCycle)

    // Aggressive flying movement
    batRef.current.position.y = Math.sin(time * 0.8) * 0.5
    batRef.current.position.x = Math.sin(time * 0.4) * 0.3
    batRef.current.position.z = Math.sin(time * 0.6) * 0.2

    // Aggressive rotation
    batRef.current.rotation.y = Math.sin(time * 0.3) * 0.2
    batRef.current.rotation.z = Math.sin(time * 0.5) * 0.1

    // Hover effect
    if (hovered) {
      batRef.current.scale.setScalar(1.1)
      animationState.current.fireIntensity = Math.min(1, animationState.current.fireIntensity + delta * 3)
    } else {
      batRef.current.scale.setScalar(1)
      animationState.current.fireIntensity = Math.max(0, animationState.current.fireIntensity - delta * 2)
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
      ref={batRef} 
      position={[0, 0, -3]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Main Bat Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#222222"}
          metalness={0.7}
          roughness={0.3}
          emissive={isCurrentSong ? "#ff0000" : "#000000"}
          emissiveIntensity={isCurrentSong ? 0.4 : 0}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.5, 0.6]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#111111"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ears */}
      <mesh position={[0.15, 0.7, 0.6]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#111111"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.15, 0.7, 0.6]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#ff0000" : "#111111"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wings */}
      <Wing 
        position={[0.8, 0, 0]} 
        rotation={[0, 0, wingPhase * 0.8]} 
        phase={wingPhase} 
        side="right"
        isCurrentSong={isCurrentSong}
      />
      <Wing 
        position={[-0.8, 0, 0]} 
        rotation={[0, 0, -wingPhase * 0.8]} 
        phase={wingPhase} 
        side="left"
        isCurrentSong={isCurrentSong}
      />

      {/* Glowing Eyes */}
      <mesh position={[0.1, 0.5, 0.8]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color={hovered || isCurrentSong ? "#ff0000" : "#666666"}
          emissive={hovered || isCurrentSong ? "#ff0000" : "#666666"}
          emissiveIntensity={hovered ? 1 : (isCurrentSong ? 0.8 : 0.2)}
        />
      </mesh>
      <mesh position={[-0.1, 0.5, 0.8]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color={hovered || isCurrentSong ? "#ff0000" : "#666666"}
          emissive={hovered || isCurrentSong ? "#ff0000" : "#666666"}
          emissiveIntensity={hovered ? 1 : (isCurrentSong ? 0.8 : 0.2)}
        />
      </mesh>

      {/* Fire Trail Effect */}
      {isPlaying && (
        <FireTrail position={[0, 0, -0.8]} intensity={animationState.current.fireIntensity} />
      )}

      {/* Clickable area */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

function Wing({ position, rotation, phase, side, isCurrentSong }) {
  const wingRef = useRef()
  
  useFrame(() => {
    if (wingRef.current) {
      wingRef.current.rotation.z = rotation[2]
    }
  })

  return (
    <mesh ref={wingRef} position={position}>
      <boxGeometry args={[1.5, 0.05, 0.6]} />
      <meshStandardMaterial 
        color={isCurrentSong ? "#ff0000" : "#333333"}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  )
}

function FireTrail({ position, intensity }) {
  const fireRef = useRef()
  
  useFrame((state) => {
    if (fireRef.current) {
      const time = state.clock.elapsedTime
      fireRef.current.scale.setScalar(intensity * (0.8 + Math.sin(time * 8) * 0.2))
      fireRef.current.material.opacity = intensity * 0.6
    }
  })

  return (
    <mesh ref={fireRef} position={position}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial 
        color="#ff6600"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default ToHellAndBack 