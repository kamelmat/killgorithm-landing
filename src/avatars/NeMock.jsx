import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function NemoTears({ isPlaying, songData, isCurrentSong, onClick, movementZone }) {
  const nautilusRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const { nodes } = useGLTF('/blender/nautilus_views/nautilus.glb')

  // SUBMARINE STATE SYSTEM - Like a video game character
  const submarineState = useRef({
    // Current position and rotation
    position: { x: 0, y: 0, z: -80 }, // Starting position
    rotation: { x: 0, y: -Math.PI / 2 - 0.3, z: 0 }, // Starting diagonal rotation
    scale: 0.5, // Starting scale
    
    // Movement state
    currentState: 'diagonal_forward', // Current movement state
    stateStartTime: 0, // When current state started
    stateDuration: 8, // How long current state lasts
    
    // Movement parameters
    speed: 1.5, // Base movement speed
    turnSpeed: 0.5, // Turn speed multiplier
  })

  useFrame((frameState, delta) => {
    const nautilus = nautilusRef.current
    if (!nautilus) return

    const time = frameState.clock.elapsedTime

    // STATE-BASED MOVEMENT SYSTEM
    const submarineStateData = submarineState.current
    
    // Initialize state start time
    if (submarineStateData.stateStartTime === 0) {
      submarineStateData.stateStartTime = time
    }
    
    // Calculate state progress
    const stateElapsed = time - submarineStateData.stateStartTime
    const stateProgress = Math.min(stateElapsed / submarineStateData.stateDuration, 1)
    const smoothProgress = stateProgress * stateProgress * (3 - 2 * stateProgress) // Smoothstep
    
    // Execute current state
    switch (submarineStateData.currentState) {
      case 'diagonal_forward':
        // DIAGONAL FORWARD MOVEMENT STATE
        // X-AXIS: Move left (negative X)
        const startX = 0
        const endX = -40 // Move 40 units left
        const x = startX + (smoothProgress * (endX - startX)) // X: 0 → -40
        
        // Z-AXIS: Move closer (positive Z) - increases size
        const startZ = -80 // Starting position
        const endZ = -20 // End position (closer to viewer)
        const z = startZ + (smoothProgress * (endZ - startZ)) // Z: -80 → -20
        
        // Set position with diagonal movement
        nautilus.position.set(x, 0, z)
        
        // Keep the same rotation (nose pointing diagonal)
        nautilus.rotation.set(0, -Math.PI / 2 - 0.3, 0) // Maintain diagonal direction
        
        // Scale increases as it gets closer (depth perception)
        const startScale = 0.5 // Smaller when far
        const endScale = 1.5 // Bigger when close
        const scale = startScale + (smoothProgress * (endScale - startScale)) // Scale: 0.5 → 1.5
        nautilus.scale.setScalar(scale)
        
        // Update state position for next state
        submarineStateData.position = { x, y: 0, z }
        submarineStateData.rotation = { x: 0, y: -Math.PI / 2 - 0.3, z: 0 }
        submarineStateData.scale = scale
        break
        
      case 'turn_right':
        // GRADUAL TURN RIGHT - VISIBLE STEP-BY-STEP ROTATION
        // Start from end position of diagonal_forward (NO GLITCH - CONTINUOUS)
        const turnRightStartX = submarineStateData.position.x || -40// 🔧 TWEAK: Starting X position
        const turnRightStartZ = submarineStateData.position.z || -20 // 🔧 TWEAK: Starting Z position  
        const turnRightStartScale = submarineStateData.scale || 1.0 // 🔧 TWEAK: Starting scale
        
        // CONSTANT SPEED ROTATION: BIGGER turn (more rotation) - TURNING RIGHT
        const rightStartRotation = -Math.PI / 2 - 0.3 // 🔧 TWEAK: Starting rotation angle
        const rightEndRotation = -Math.PI / 2 - 2.2 // 🔧 TWEAK: BIGGER ending angle + 45° more (larger turn RIGHT)
        
        // LINEAR INTERPOLATION for constant speed (no acceleration/deceleration)
        const rightTargetRotation = rightStartRotation + (smoothProgress * (rightEndRotation - rightStartRotation))
        nautilus.rotation.set(0, rightTargetRotation, 0)
        
        // NO MOVEMENT DURING TURN - JUST ROTATION
        // Keep the same position throughout the turn
        nautilus.position.set(turnRightStartX, 0, turnRightStartZ)
        
        // NO SCALE CHANGE DURING TURN - JUST ROTATION
        // Keep the same scale throughout the turn
        nautilus.scale.setScalar(turnRightStartScale)
        
        // Update state for next transition (NO GLITCH - SEAMLESS)
        submarineStateData.position = { x: turnRightStartX, y: 0, z: turnRightStartZ }
        submarineStateData.rotation = { x: 0, y: rightTargetRotation, z: 0 }
        submarineStateData.scale = turnRightStartScale
        break
        
      case 'move_forward_and_down':
        // MOVE FORWARD AND DOWN STATE (moving away from viewer)
        // Start from end position of turn_right
        const forwardDownStartX = submarineStateData.position.x || -40
        const forwardDownStartZ = submarineStateData.position.z || -20
        const forwardDownStartScale = submarineStateData.scale || 1.0
        
        // X-AXIS: Move left (negative X) - maintaining diagonal direction
        const forwardDownEndX = forwardDownStartX - 15 // 🔧 TWEAK: Move 15 units left (diagonal)
        const forwardDownX = forwardDownStartX + (smoothProgress * (forwardDownEndX - forwardDownStartX))
        
        // Z-AXIS: Move away (negative Z) - getting smaller
        const forwardDownEndZ = forwardDownStartZ - 20 // 🔧 TWEAK: Move 20 units away
        const forwardDownZ = forwardDownStartZ + (smoothProgress * (forwardDownEndZ - forwardDownStartZ))
        
        // Set position with diagonal movement
        nautilus.position.set(forwardDownX, 0, forwardDownZ)
        
        // ROTATION: Incline nose down 3% (X-axis rotation)
        const startRotationY = submarineStateData.rotation?.y || -Math.PI / 2 - 2.2 // 🔧 TWEAK: Keep Y rotation from turn_right
        const startRotationX = 0 // 🔧 TWEAK: Starting X rotation (level)
        const endRotationX = -0.03 // 🔧 TWEAK: 3% nose down (negative X rotation)
        const currentRotationX = startRotationX + (smoothProgress * (endRotationX - startRotationX))
        
        nautilus.rotation.set(currentRotationX, startRotationY, 0)
        
        // Scale decreases as it gets away (depth perception)
        const forwardDownEndScale = 0.4 // 🔧 TWEAK: Much smaller when far away
        const forwardDownScale = forwardDownStartScale + (smoothProgress * (forwardDownEndScale - forwardDownStartScale))
        nautilus.scale.setScalar(forwardDownScale)
        
        // Update state for next transition
        submarineStateData.position = { x: forwardDownX, y: 0, z: forwardDownZ }
        submarineStateData.rotation = { x: currentRotationX, y: startRotationY, z: 0 }
        submarineStateData.scale = forwardDownScale
        break
        
      case 'diagonal_backward':
        // DIAGONAL BACKWARD MOVEMENT STATE (getting away from viewer)
        // Start from end position of turn_right
        const backStartX = submarineStateData.position.x || -42
        const backStartZ = submarineStateData.position.z || -15
        const backStartScale = submarineStateData.scale || 0.8
        
        // X-AXIS: Move right (positive X) - opposite of diagonal_forward
        const backEndX = backStartX + 30 // 🔧 TWEAK: Move 30 units right
        const backX = backStartX + (smoothProgress * (backEndX - backStartX))
        
        // Z-AXIS: Move away (negative Z) - getting smaller
        const backEndZ = backStartZ - 20 // 🔧 TWEAK: Move 20 units away
        const backZ = backStartZ + (smoothProgress * (backEndZ - backStartZ))
        
        // Set position with diagonal movement
        nautilus.position.set(backX, 0, backZ)
        
        // Keep the same rotation (nose pointing diagonal)
        nautilus.rotation.set(0, rightTargetRotation, 0) // Use rotation from turn_right
        
        // Scale decreases as it gets away (depth perception)
        const backEndScale = 0.3 // 🔧 TWEAK: Much smaller when far away
        const backScale = backStartScale + (smoothProgress * (backEndScale - backStartScale))
        nautilus.scale.setScalar(backScale)
        
        // Update state for next transition
        submarineStateData.position = { x: backX, y: 0, z: backZ }
        submarineStateData.rotation = { x: 0, y: rightTargetRotation, z: 0 }
        submarineStateData.scale = backScale
        break
        
      case 'turn_right_varied':
        // VARIED TURN RIGHT - Different angle and movement
        // Start from end position of diagonal_backward
        const turnVarStartX = submarineStateData.position.x || -12
        const turnVarStartZ = submarineStateData.position.z || -35
        const turnVarStartScale = submarineStateData.scale || 0.3
        
        // CONSTANT SPEED ROTATION: Different turn angle
        const varStartRotation = rightTargetRotation // 🔧 TWEAK: Start from previous rotation
        const varEndRotation = rightTargetRotation + 0.4 // 🔧 TWEAK: Turn 0.4 radians more
        const varTargetRotation = varStartRotation + (smoothProgress * (varEndRotation - varStartRotation))
        nautilus.rotation.set(0, varTargetRotation, 0)
        
        // CONSTANT SPEED Z-AXIS MOVEMENT: Stay at distance
        const turnVarZ = turnVarStartZ + (smoothProgress * 5) // 🔧 TWEAK: Move 5 units closer
        nautilus.position.set(turnVarStartX, 0, turnVarZ)
        
        // CONSTANT SPEED SCALE: Stay small
        const turnVarEndScale = 0.4 // 🔧 TWEAK: Slightly bigger
        const turnVarScale = turnVarStartScale + (smoothProgress * (turnVarEndScale - turnVarStartScale))
        nautilus.scale.setScalar(turnVarScale)
        
        // Update state for next transition
        submarineStateData.position = { x: turnVarStartX, y: 0, z: turnVarZ }
        submarineStateData.rotation = { x: 0, y: varTargetRotation, z: 0 }
        submarineStateData.scale = turnVarScale
        break
        
      case 'move_forward':
        // MOVE FORWARD STATE (getting closer to viewer)
        // Start from end position of turn_right_varied
        const forwardStartX = submarineStateData.position.x || -12
        const forwardStartZ = submarineStateData.position.z || -30
        const forwardStartScale = submarineStateData.scale || 0.4
        
        // X-AXIS: Move left (negative X) - towards center
        const forwardEndX = forwardStartX - 20 // 🔧 TWEAK: Move 20 units left
        const forwardX = forwardStartX + (smoothProgress * (forwardEndX - forwardStartX))
        
        // Z-AXIS: Move closer (positive Z) - getting bigger
        const forwardEndZ = forwardStartZ + 30 // 🔧 TWEAK: Move 30 units closer
        const forwardZ = forwardStartZ + (smoothProgress * (forwardEndZ - forwardStartZ))
        
        // Set position
        nautilus.position.set(forwardX, 0, forwardZ)
        
        // Keep the same rotation
        nautilus.rotation.set(0, varTargetRotation, 0) // Use rotation from turn_right_varied
        
        // Scale increases as it gets closer
        const forwardEndScale = 1.2 // 🔧 TWEAK: Bigger when close
        const forwardScale = forwardStartScale + (smoothProgress * (forwardEndScale - forwardStartScale))
        nautilus.scale.setScalar(forwardScale)
        
        // Update state for next transition
        submarineStateData.position = { x: forwardX, y: 0, z: forwardZ }
        submarineStateData.rotation = { x: 0, y: varTargetRotation, z: 0 }
        submarineStateData.scale = forwardScale
        break
        
      // Future states will be added here:
      // case 'turn_right':
      // case 'move_forward':
      // case 'move_backward':
      // case 'move_left':
      // case 'move_right':
    }
    
    // Check if state is complete and transition to next state (NO GLITCHES)
    if (stateProgress >= 1) {
      if (submarineStateData.currentState === 'diagonal_forward') {
        // SEAMLESS TRANSITION: Keep current position/scale, just change state
        submarineStateData.currentState = 'turn_right' // 🔧 TWEAK: Now turns RIGHT instead of LEFT
        submarineStateData.stateStartTime = time
        submarineStateData.stateDuration = 8 // 🔧 TWEAK: Turn duration (seconds)
        // Position/scale continue from previous state (no reset)
      } else if (submarineStateData.currentState === 'turn_right') {
        // TRANSITION TO MOVE FORWARD AND DOWN
        submarineStateData.currentState = 'move_forward_and_down'
        submarineStateData.stateStartTime = time
        submarineStateData.stateDuration = 4 // 🔧 TWEAK: Forward and down duration (seconds)
        // Position/scale continue from previous state (no reset)
      } else if (submarineStateData.currentState === 'move_forward_and_down') {
        // TRANSITION TO DIAGONAL BACKWARD
        submarineStateData.currentState = 'diagonal_backward'
        submarineStateData.stateStartTime = time
        submarineStateData.stateDuration = 6 // 🔧 TWEAK: Backward duration (seconds)
        // Position/scale continue from previous state (no reset)
      } else if (submarineStateData.currentState === 'diagonal_backward') {
        // TRANSITION TO VARIED TURN RIGHT
        submarineStateData.currentState = 'turn_right_varied'
        submarineStateData.stateStartTime = time
        submarineStateData.stateDuration = 5 // 🔧 TWEAK: Varied turn duration (seconds)
        // Position/scale continue from previous state (no reset)
      } else if (submarineStateData.currentState === 'turn_right_varied') {
        // TRANSITION TO MOVE FORWARD
        submarineStateData.currentState = 'move_forward'
        submarineStateData.stateStartTime = time
        submarineStateData.stateDuration = 7 // 🔧 TWEAK: Forward duration (seconds)
        // Position/scale continue from previous state (no reset)
      } else if (submarineStateData.currentState === 'move_forward') {
        // RESTART CYCLE: Reset to starting position
        submarineStateData.currentState = 'diagonal_forward'
        submarineStateData.stateStartTime = time
        submarineStateData.stateDuration = 8 // 🔧 TWEAK: Diagonal duration (seconds)
        submarineStateData.position = { x: 0, y: 0, z: -80 } // 🔧 TWEAK: Starting position
        submarineStateData.rotation = { x: 0, y: -Math.PI / 2 - 0.3, z: 0 } // 🔧 TWEAK: Starting rotation
        submarineStateData.scale = 0.5 // 🔧 TWEAK: Starting scale
      }
    }
    
    // Hover effect
    nautilus.scale.setScalar(hovered ? 1.1 : 1.0)
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
      position={[0, 0, -80]} // CENTER OF SCREEN - FINDING NOSE
      rotation={[0, -Math.PI / 2 - 0.3, 0]} // ROTATE 90° LEFT TO FACE FORWARD
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

// Iluminación y partículas igual que antes
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
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#00ffff" distance={10} decay={3} />
      <pointLight position={[0, 2, 0]} intensity={0.3} color="#00ffff" distance={8} decay={3} />
      <pointLight position={[0, -2, 0]} intensity={0.2} color="#00ffff" distance={8} decay={3} />
      <pointLight position={[-2, 0, 0]} intensity={0.25} color="#00ffff" distance={8} decay={3} />
      <pointLight position={[2, 0, 0]} intensity={0.25} color="#00ffff" distance={8} decay={3} />
      <pointLight position={[0, 0, -3]} intensity={0.2} color="#00ffff" distance={8} decay={3} />
      {isPlaying && (
        <>
          <pointLight position={[-0.8, 0, -3]} intensity={0.8} color="#ff6600" distance={6} decay={2} />
          <pointLight position={[0.8, 0, -3]} intensity={0.8} color="#ff6600" distance={6} decay={2} />
        </>
      )}
    </group>
  )
}

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
