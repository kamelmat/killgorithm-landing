import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function NemoTears({ isPlaying, songData, isCurrentSong, onClick }) {
  const submarineRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [sonarPing, setSonarPing] = useState(0)
  const animationState = useRef({ time: 0, sonarTime: 0, thrusterIntensity: 0 })

  useFrame((state, delta) => {
    if (!submarineRef.current) return

    const time = state.clock.elapsedTime
    animationState.current.time = time

    // Idle floating animation
    submarineRef.current.position.y = Math.sin(time * 0.5) * 0.3
    submarineRef.current.rotation.z = Math.sin(time * 0.3) * 0.1

    // Forward movement
    submarineRef.current.position.x += Math.sin(time * 0.2) * 0.01

    // Sonar ping effect
    animationState.current.sonarTime += delta
    if (animationState.current.sonarTime > 3) {
      setSonarPing(1)
      animationState.current.sonarTime = 0
    }
    if (sonarPing > 0) {
      setSonarPing(prev => Math.max(0, prev - delta * 2))
    }

    // Thruster intensity based on playing state
    if (isPlaying) {
      animationState.current.thrusterIntensity = Math.min(1, animationState.current.thrusterIntensity + delta * 2)
    } else {
      animationState.current.thrusterIntensity = Math.max(0.2, animationState.current.thrusterIntensity - delta)
    }

    // Hover effect
    if (hovered) {
      submarineRef.current.scale.setScalar(1.1)
      submarineRef.current.rotation.y = Math.sin(time * 2) * 0.2
    } else {
      submarineRef.current.scale.setScalar(1)
      submarineRef.current.rotation.y = 0
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
      ref={submarineRef} 
      position={[0, 0, -5]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Main Submarine Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.8, 3, 8, 16]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#00ffff" : "#444444"}
          metalness={0.8}
          roughness={0.2}
          emissive={isCurrentSong ? "#00ffff" : "#000000"}
          emissiveIntensity={isCurrentSong ? 0.3 : 0}
        />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 0, 1.8]}>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#00ffff" : "#666666"}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0, -1.8]}>
        <cylinderGeometry args={[0.3, 0.8, 1, 8]} />
        <meshStandardMaterial 
          color={isCurrentSong ? "#00ffff" : "#555555"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Thrusters */}
      <ThrusterExhaust 
        position={[0.3, 0, -2.2]} 
        intensity={animationState.current.thrusterIntensity}
        isPlaying={isPlaying}
      />
      <ThrusterExhaust 
        position={[-0.3, 0, -2.2]} 
        intensity={animationState.current.thrusterIntensity}
        isPlaying={isPlaying}
      />

      {/* Glowing Eyes */}
      <mesh position={[0.2, 0.3, 1.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color={hovered || isCurrentSong ? "#ff0000" : "#00ffff"}
          emissive={hovered || isCurrentSong ? "#ff0000" : "#00ffff"}
          emissiveIntensity={hovered ? 1 : (isCurrentSong ? 0.5 : 0.2)}
        />
      </mesh>
      <mesh position={[-0.2, 0.3, 1.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color={hovered || isCurrentSong ? "#ff0000" : "#00ffff"}
          emissive={hovered || isCurrentSong ? "#ff0000" : "#00ffff"}
          emissiveIntensity={hovered ? 1 : (isCurrentSong ? 0.5 : 0.2)}
        />
      </mesh>

      {/* Sonar Ping */}
      {sonarPing > 0 && (
        <SonarPing position={[0, 0, 1.8]} intensity={sonarPing} />
      )}

      {/* Clickable area */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

function ThrusterExhaust({ position, intensity, isPlaying }) {
  const exhaustRef = useRef()
  
  useFrame((state) => {
    if (exhaustRef.current) {
      const time = state.clock.elapsedTime
      exhaustRef.current.scale.setScalar(intensity * (0.5 + Math.sin(time * 10) * 0.2))
    }
  })

  return (
    <mesh ref={exhaustRef} position={position}>
      <cylinderGeometry args={[0.1, 0.2, 0.5, 8]} />
      <meshStandardMaterial 
        color={isPlaying ? "#ff6600" : "#666666"}
        emissive={isPlaying ? "#ff6600" : "#000000"}
        emissiveIntensity={isPlaying ? intensity : 0}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function SonarPing({ position, intensity }) {
  const pingRef = useRef()
  
  useFrame(() => {
    if (pingRef.current) {
      pingRef.current.scale.setScalar(1 + intensity * 3)
      pingRef.current.material.opacity = intensity * 0.5
    }
  })

  return (
    <mesh ref={pingRef} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial 
        color="#00ffff"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default NemoTears 