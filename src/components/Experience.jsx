import React, { Suspense, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CONFIG } from '../config/config'
import NemoTears from '../avatars/NemoTears'
import Courage from '../avatars/Courage'
import AveDePresa from '../avatars/AveDePresa'
import ToHellAndBack from '../avatars/ToHellAndBack'

const AVATAR_COMPONENTS = { 
  'NemoTears': NemoTears, 
  'Courage': Courage, 
  'AveDePresa': AveDePresa, 
  'ToHellAndBack': ToHellAndBack 
}

function Experience({ currentSong, isPlaying, onSongSelect }) {
  const sceneRef = useRef()
  const [avatarPositions, setAvatarPositions] = useState(() => {
    // Initialize random positions for all avatars - full 3D space
    return CONFIG.songs.map(song => ({
      id: song.id,
      position: [
        (Math.random() - 0.5) * 30, // x: -15 to 15 (full width)
        (Math.random() - 0.5) * 20,  // y: -10 to 10 (full height including behind title)
        (Math.random() - 0.5) * 20 - 5 // z: -15 to 5 (depth range)
      ],
      velocity: [
        (Math.random() - 0.5) * 0.04, // x velocity (faster)
        (Math.random() - 0.5) * 0.04, // y velocity (faster)
        (Math.random() - 0.5) * 0.04  // z velocity (faster)
      ],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04
    }))
  })

  // Animate all avatars moving around
  useFrame((state, delta) => {
    setAvatarPositions(prev => prev.map(avatar => {
      const newPosition = [
        avatar.position[0] + avatar.velocity[0],
        avatar.position[1] + avatar.velocity[1],
        avatar.position[2] + avatar.velocity[2]
      ]
      
      // Bounce off boundaries - full 3D space bounds
      const bounds = { x: 16, y: 12, z: 10 }
      const newVelocity = [...avatar.velocity]
      
      if (Math.abs(newPosition[0]) > bounds.x) {
        newVelocity[0] *= -1
        newPosition[0] = Math.sign(newPosition[0]) * bounds.x
      }
      if (Math.abs(newPosition[1]) > bounds.y) {
        newVelocity[1] *= -1
        newPosition[1] = Math.sign(newPosition[1]) * bounds.y
      }
      if (Math.abs(newPosition[2]) > bounds.z) {
        newVelocity[2] *= -1
        newPosition[2] = Math.sign(newPosition[2]) * bounds.z
      }
      
      return {
        ...avatar,
        position: newPosition,
        velocity: newVelocity,
        rotation: avatar.rotation + avatar.rotationSpeed
      }
    }))
  })

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground currentSong={currentSong} isPlaying={isPlaying} />
      
      {/* Dynamic Lighting based on current song */}
      <DynamicLighting currentSong={currentSong} isPlaying={isPlaying} />
      
      {/* All Avatars - Always Visible */}
      <Suspense fallback={null}>
        {CONFIG.songs.map((song, index) => {
          const AvatarComponent = AVATAR_COMPONENTS[song.avatar]
          const avatarData = avatarPositions[index]
          const isCurrentSong = currentSong === song.id
          
          return (
            <group
              key={song.id}
              position={avatarData.position}
              rotation={[0, avatarData.rotation, 0]}
              // Ensure the group can receive pointer events
              onPointerOver={(e) => e.stopPropagation()}
              onPointerOut={(e) => e.stopPropagation()}
            >
              <AvatarComponent 
                isPlaying={isCurrentSong && isPlaying}
                songData={song}
                isCurrentSong={isCurrentSong}
                onClick={() => onSongSelect(song.id)}
              />
            </group>
          )
        })}
      </Suspense>
      
      {/* Particle Effects */}
      <ParticleEffects currentSong={currentSong} isPlaying={isPlaying} />
    </>
  )
}

// Animated Background Component
function AnimatedBackground({ currentSong, isPlaying }) {
  const bgRef = useRef()
  
  useFrame((state) => {
    if (bgRef.current) {
      // Subtle movement for the background
      bgRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5
      bgRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.3
    }
  })
  
  // Get current song data
  const currentSongData = CONFIG.songs.find(song => song.id === currentSong)
  
  return (
    <group ref={bgRef}>
      {/* Dynamic background based on current song */}
      {currentSongData && (
        <SongSpecificBackground 
          songData={currentSongData} 
          isPlaying={isPlaying} 
        />
      )}
    </group>
  )
}

// Song-specific background effects
function SongSpecificBackground({ songData, isPlaying }) {
  const bgRef = useRef()
  
  useFrame((state) => {
    if (bgRef.current && isPlaying) {
      const time = state.clock.elapsedTime
      
      // Different animation speeds based on song
      switch (songData.id) {
        case 'nemo-tears':
          // Underwater effect - slow, flowing movement
          bgRef.current.position.x = Math.sin(time * 0.2) * 2
          bgRef.current.position.y = Math.cos(time * 0.3) * 1.5
          bgRef.current.rotation.z = Math.sin(time * 0.1) * 0.1
          break
          
        case 'ave-de-presa':
          // Aggressive, sharp movements
          bgRef.current.position.x = Math.sin(time * 0.8) * 3
          bgRef.current.position.y = Math.cos(time * 0.6) * 2
          bgRef.current.rotation.z = Math.sin(time * 0.4) * 0.2
          break
          
        case 'to-hell-and-back':
          // Chaotic, glitchy movements
          bgRef.current.position.x = Math.sin(time * 1.2) * 4 + Math.sin(time * 0.3) * 1
          bgRef.current.position.y = Math.cos(time * 0.9) * 3 + Math.cos(time * 0.2) * 1
          bgRef.current.rotation.z = Math.sin(time * 0.7) * 0.3
          break
          
        case 'courage-mix':
          // Steady, powerful movements
          bgRef.current.position.x = Math.sin(time * 0.5) * 2.5
          bgRef.current.position.y = Math.cos(time * 0.4) * 2
          bgRef.current.rotation.z = Math.sin(time * 0.3) * 0.15
          break
          
        default:
          // Default subtle movement
          bgRef.current.position.x = Math.sin(time * 0.1) * 0.5
          bgRef.current.position.y = Math.cos(time * 0.15) * 0.3
      }
    }
  })
  
  // Different background elements based on song
  const getBackgroundElements = () => {
    switch (songData.id) {
      case 'nemo-tears':
        return (
          <>
            {/* Underwater bubbles */}
            {Array.from({ length: 20 }, (_, i) => (
              <mesh
                key={`bubble-${i}`}
                position={[
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 30,
                  -20 - Math.random() * 10
                ]}
              >
                <sphereGeometry args={[0.1 + Math.random() * 0.2, 8, 8]} />
                <meshBasicMaterial 
                  color="#00ffff"
                  transparent
                  opacity={0.3}
                />
              </mesh>
            ))}
          </>
        )
        
      case 'ave-de-presa':
        return (
          <>
            {/* Dystopian skyline elements */}
            {Array.from({ length: 15 }, (_, i) => (
              <mesh
                key={`building-${i}`}
                position={[
                  (Math.random() - 0.5) * 40,
                  -15 + Math.random() * 10,
                  -20 - Math.random() * 5
                ]}
              >
                <boxGeometry args={[1 + Math.random() * 3, 5 + Math.random() * 10, 1 + Math.random() * 2]} />
                <meshBasicMaterial 
                  color="#333333"
                  transparent
                  opacity={0.4}
                />
              </mesh>
            ))}
          </>
        )
        
      case 'to-hell-and-back':
        return (
          <>
            {/* Glitch fire elements */}
            {Array.from({ length: 25 }, (_, i) => (
              <mesh
                key={`fire-${i}`}
                position={[
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 30,
                  -20 - Math.random() * 10
                ]}
              >
                <sphereGeometry args={[0.2 + Math.random() * 0.3, 8, 8]} />
                <meshBasicMaterial 
                  color="#ff6600"
                  transparent
                  opacity={0.5}
                />
              </mesh>
            ))}
          </>
        )
        
      case 'courage-mix':
        return (
          <>
            {/* Cyberpunk grid elements */}
            {Array.from({ length: 30 }, (_, i) => (
              <mesh
                key={`grid-${i}`}
                position={[
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 30,
                  -20 - Math.random() * 10
                ]}
              >
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial 
                  color="#ff0000"
                  transparent
                  opacity={0.6}
                />
              </mesh>
            ))}
          </>
        )
        
      default:
        return null
    }
  }
  
  return (
    <group ref={bgRef}>
      {getBackgroundElements()}
    </group>
  )
}

// Particle Effects Component
function ParticleEffects({ currentSong, isPlaying }) {
  const particlesRef = useRef()
  
  // Get current song data
  const currentSongData = CONFIG.songs.find(song => song.id === currentSong)
  
  useFrame((state) => {
    if (particlesRef.current && isPlaying) {
      particlesRef.current.rotation.y += 0.01
      particlesRef.current.rotation.x += 0.005
    }
  })
  
  // Get particle color based on current song
  const getParticleColor = () => {
    if (!currentSongData) return isPlaying ? "#ff0000" : "#333333"
    
    switch (currentSongData.id) {
      case 'nemo-tears':
        return isPlaying ? "#00ffff" : "#333333"
      case 'ave-de-presa':
        return isPlaying ? "#8b0000" : "#333333"
      case 'to-hell-and-back':
        return isPlaying ? "#ff6600" : "#333333"
      case 'courage-mix':
        return isPlaying ? "#ff0000" : "#333333"
      default:
        return isPlaying ? "#ff0000" : "#333333"
    }
  }
  
  return (
    <group ref={particlesRef}>
      {/* Generate random particles */}
      {Array.from({ length: 50 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20 - 10
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={getParticleColor()}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// Dynamic Lighting Component
function DynamicLighting({ currentSong, isPlaying }) {
  const currentSongData = CONFIG.songs.find(song => song.id === currentSong)
  
  // Get lighting based on current song
  const getLighting = () => {
    if (!currentSongData) {
      return (
        <>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.0} color="#ff0000" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ffff" />
          <pointLight position={[0, 10, 0]} intensity={0.6} color="#ffffff" />
        </>
      )
    }
    
    switch (currentSongData.id) {
      case 'nemo-tears':
        return (
          <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.6} color="#0066cc" />
            <pointLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />
          </>
        )
        
      case 'ave-de-presa':
        return (
          <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#8b0000" />
            <pointLight position={[-10, -10, -10]} intensity={0.9} color="#ff6600" />
            <pointLight position={[0, 10, 0]} intensity={0.7} color="#ffffff" />
          </>
        )
        
      case 'to-hell-and-back':
        return (
          <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.1} color="#ff6600" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff0000" />
            <pointLight position={[0, 10, 0]} intensity={0.6} color="#ffffff" />
          </>
        )
        
      case 'courage-mix':
        return (
          <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.0} color="#ff0000" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#cccccc" />
            <pointLight position={[0, 10, 0]} intensity={0.6} color="#ffffff" />
          </>
        )
        
      default:
        return (
          <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.0} color="#ff0000" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ffff" />
            <pointLight position={[0, 10, 0]} intensity={0.6} color="#ffffff" />
          </>
        )
    }
  }
  
  return getLighting()
}

export default Experience 