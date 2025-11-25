import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import './AvatarShowcase.css'



// Rotating shadow component
function RotatingShadow({ scene, scale }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      // Slow rotation on Y axis for dramatic effect
      groupRef.current.rotation.y = time * 0.15
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// Animated camera component for zoom effect
function AnimatedCamera({ isKnight, isShadow, baseDistance, baseFov, modelPosition }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    if (isKnight || isShadow) {
      const time = state.clock.elapsedTime
      // Slow zoom cycle - closer to see face details, then back out
      const zoomCycle = Math.sin(time * 0.3) * 0.5 + 0.5 // 0 to 1
      
      if (isShadow) {
        // Shadow: closer zoom and dynamic height adjustment
        const minDistance = baseDistance * 0.5  // Close but not too close - show face and upper torso
        const maxDistance = baseDistance * 1.2  // Medium distance
        const currentDistance = minDistance + (maxDistance - minDistance) * zoomCycle
        
        // Dynamic height - adjust to keep face centered during zoom
        const baseHeight = modelPosition[1] + 0.75  // Focus on face/upper torso area 
        const heightAdjustment = (1 - zoomCycle) * 0.4  // Slight upward movement when zooming in
        const dynamicHeight = baseHeight + heightAdjustment
        
        // Update camera position
        camera.position.setFromSphericalCoords(
          currentDistance,
          Math.PI / 2,
          0
        )
        camera.position.y = dynamicHeight
        
        // Look at face area with slight downward angle when close
        const lookAtHeight = dynamicHeight - 0.3 - (1 - zoomCycle) * 0.2
        camera.lookAt(0, lookAtHeight, 0)
        
      } else {
        // Knight: keep original perfect behavior
        const minDistance = baseDistance * 0.4
        const maxDistance = baseDistance * 1.2
        const currentDistance = minDistance + (maxDistance - minDistance) * zoomCycle
        const faceHeight = modelPosition[1] + 2.5
        
        camera.position.setFromSphericalCoords(
          currentDistance,
          Math.PI / 2,
          0
        )
        camera.position.y = faceHeight
        camera.lookAt(0, faceHeight - 0.5, 0)
      }
      
      // Slight FOV variation for dramatic effect
      camera.fov = baseFov + Math.sin(time * 0.25) * 5
      camera.updateProjectionMatrix()
    }
  })
  
  return null
}

function FloatingModel({ modelPath, scale = 1 }) {
  console.log('🔍 Loading model:', modelPath)
  const { scene, animations, error } = useGLTF(modelPath, true) // Get animations too!
  
  if (error) {
    console.warn('❌ GLB loading error:', modelPath, error)
    return (
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#440000" 
          emissiveIntensity={0.5}
          wireframe={true}
        />
      </mesh>
    )
  }
  
  if (!scene) {
    console.warn('⚠️ No scene loaded for:', modelPath)
    return (
      <mesh>
        <sphereGeometry args={[0.8]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#444400" 
          emissiveIntensity={0.3}
        />
      </mesh>
    )
  }
  
  console.log('✅ Scene loaded successfully:', modelPath, 'Animations:', animations?.length || 0)
  
  // DON'T CLONE for animated models - use original scene for proper animation binding
  const isEagle = modelPath.includes('eagle')
  console.log('🔍 Is eagle?', isEagle, 'Path:', modelPath, 'Has animations:', !!animations?.length)
  
  if (isEagle) {
    console.log('🦅 Eagle confirmed! Using ORIGINAL scene for proper animation binding...')
    return (
      <AnimatedEagle scene={scene} animations={animations} scale={scale} />
    )
  }
  
  const isKnight = modelPath.includes('forgotten_knight')
  const isShadow = modelPath.includes('death_star') || modelPath.includes('shadow_wraith')
  
  if (isKnight || isShadow) {
    console.log('⚔️💀 Static model (Knight/Shadow) - no animation...')
    // For static models, return with rotation for shadow
    if (isShadow) {
      return <RotatingShadow scene={scene} scale={scale} />
    } else {
      return (
        <primitive object={scene} scale={scale} />
      )
    }
  }
  
  console.log('🚢 Nautilus confirmed! Starting submarine animation...')
  // For non-animated models, we can clone safely
  const clonedScene = scene.clone()
  return (
    <AnimatedNautilus scene={clonedScene} animations={animations} scale={scale} />
  )
}

function AnimatedNautilus({ scene, animations, scale }) {
  const groupRef = useRef()
  const mixerRef = useRef()
  
  // Set up animation mixer for nautilus too
  useEffect(() => {
    console.log('🚢 Setting up Nautilus AnimationMixer with', animations?.length || 0, 'animations')
    
    if (scene && animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene)
      
      animations.forEach((clip, index) => {
        console.log(`🚢 Playing nautilus animation ${index}:`, clip.name)
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
    // Update animation mixer for nautilus animations
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
    
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      
      // Gentle submarine floating
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function AnimatedEagle({ scene, animations, scale }) {
  const groupRef = useRef()
  const mixerRef = useRef()
  
  // Set up animation mixer like in the original
  useEffect(() => {
    console.log('🦅 Setting up AnimationMixer with', animations?.length || 0, 'animations')
    console.log('🦅 Scene structure:', scene)
    
    // Debug scene structure
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          console.log('🦅 Found mesh:', child.name, 'Has skeleton:', !!child.skeleton)
        }
        if (child.isBone) {
          console.log('🦅 Found bone:', child.name)
        }
      })
    }
    
    if (scene && animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene)
      
      animations.forEach((clip, index) => {
        console.log(`🦅 Playing animation ${index}:`, clip.name, 'Duration:', clip.duration, 'Tracks:', clip.tracks.length)
        const action = mixerRef.current.clipAction(clip)
        action.setLoop(THREE.LoopRepeat) // Make sure it loops
        action.timeScale = 2.0 // Speed up animation to make it more visible
        action.enabled = true
        action.play()
        console.log(`🦅 Animation action state:`, {
          isRunning: action.isRunning(),
          time: action.time,
          timeScale: action.timeScale,
          enabled: action.enabled,
          weight: action.getEffectiveWeight()
        })
      })
    } else {
      console.warn('🦅 No animations found in GLB - will use basic floating')
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
    // Update animation mixer - THIS IS THE KEY FOR WING MOVEMENT!
    if (mixerRef.current) {
      mixerRef.current.update(delta)
      
      // Debug animation state every 60 frames
      if (Math.floor(state.clock.elapsedTime * 60) % 60 === 0) {
        console.log('🦅 Animation mixer updating, time:', mixerRef.current.time.toFixed(2))
        
        // Debug: Check if wing bones are actually moving
        if (scene) {
          scene.traverse((child) => {
            if (child.isBone && (child.name.includes('WRLeft') || child.name.includes('WRRight'))) {
              console.log(`🦅 Wing bone ${child.name}:`, {
                position: [child.position.x.toFixed(2), child.position.y.toFixed(2), child.position.z.toFixed(2)],
                rotation: [child.rotation.x.toFixed(2), child.rotation.y.toFixed(2), child.rotation.z.toFixed(2)]
              })
            }
          })
        }
      }
    }
    
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      
      // Gentle floating motion (subtle - let wings do the main animation)
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.1
      
      // Subtle banking
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05
      
      // Basic scale
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  console.log('🦅 AnimatedEagle component rendered with scene:', scene, 'animations:', animations?.length)
  
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function Avatar3D({ modelPath, isActive }) {
  // Different settings for each model
  const isEagle = modelPath.includes('eagle')
  const isNautilus = modelPath.includes('nautilus')
  const isShadow = modelPath.includes('death_star') || modelPath.includes('shadow_wraith')
  const isKnight = modelPath.includes('forgotten_knight')
  
  // Camera settings per model
  let cameraDistance, fov, scale
  
  if (isEagle) {
    cameraDistance = 1.5
    fov = 90
    scale = 1.0
  } else if (isNautilus) {
    cameraDistance = 3
    fov = 60
    scale = 0.3
  } else if (isShadow) {
    cameraDistance = 2.2  // Base distance for zoom animation
    fov = 75
    scale = 1.0  // Moderate scale
  } else if (isKnight) {
    cameraDistance = 2.0   // Base distance for zoom animation
    fov = 75   // Base FOV for animation
    scale = 1.0  // Moderate scale
  } else {
    // Default settings
    cameraDistance = 3
    fov = 60
    scale = 0.5
  }
  
  // Model positioning - move knight UP so his torso is centered
  let modelPosition = [0, 0, 0]
  let cameraPosition = [0, 0, cameraDistance]
  
  if (isKnight) {
    modelPosition = [0, -2.5, 0]  // Move knight significantly DOWN to center his torso/face area
    cameraPosition = [0, 1, cameraDistance]  // Raise camera slightly to focus on face
  } else if (isShadow) {
    modelPosition = [0, -0.25, 0]  // Move shadow down just a little - perfect balance
    cameraPosition = [0, 0, cameraDistance]  // Normal camera position
  }
  
  console.log('🎮 Avatar3D settings:', {
    modelPath,
    isEagle, isNautilus, isShadow, isKnight,
    cameraDistance, fov, scale, cameraPosition, modelPosition
  })
  
  return (
    <div className="avatar-3d-container">
      <Canvas 
        key={`${modelPath}-${modelPosition.join(',')}`}
        camera={{ position: cameraPosition, fov: fov }}
      >
        {/* Animated camera for knight and shadow */}
        <AnimatedCamera 
          isKnight={isKnight} 
          isShadow={isShadow} 
          baseDistance={cameraDistance} 
          baseFov={fov} 
          modelPosition={modelPosition}
        />
        
        {/* Enhanced lighting */}
        {isShadow ? (
          <>
            <ambientLight intensity={0.4} />
            {/* Strong front lighting to expose shadow face features */}
            <directionalLight position={[0, 0, 5]} intensity={2.5} color="#ffffff" />
            {/* Side lighting for dramatic definition */}
            <directionalLight position={[3, 2, 2]} intensity={1.5} color="#ff0040" />
            <directionalLight position={[-3, 2, 2]} intensity={1.5} color="#ff0040" />
            {/* Hell atmosphere glow from below */}
            <directionalLight position={[0, -3, 1]} intensity={1.5} color="#ff6600" />
          </>
        ) : isKnight ? (
          <>
            <ambientLight intensity={0.6} />
            {/* Heroic lighting for knight */}
            <directionalLight position={[2, 3, 3]} intensity={1.8} color="#ffffff" />
            <directionalLight position={[-2, 1, 2]} intensity={0.8} color="#00ffff" />
          </>
        ) : (
          <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 3]} intensity={1.2} color="#00ffff" />
            <directionalLight position={[-5, -5, -3]} intensity={0.6} color="#ff0040" />
          </>
        )}
        
        <Suspense 
          fallback={
            <mesh>
              <sphereGeometry args={[0.5]} />
              <meshStandardMaterial color="#666666" emissive="#222222" />
            </mesh>
          }
        >
          <group position={modelPosition}>
            <FloatingModel modelPath={modelPath} scale={scale} />

          </group>
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate={isKnight || isShadow ? false : true}  // Disable auto-rotate for camera zoom effect
          autoRotateSpeed={1.5}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
}

function AvatarCard({ title, subtitle, buttonText, modelPath, songId, onSelect, isActive, isCurrentSong, isPlaying }) {
  // Determine what to show in subtitle area
  const getSubtitleContent = () => {
    if (isCurrentSong && isPlaying) {
      return '⏸ PAUSE'
    } else if (isCurrentSong && !isPlaying) {
      return '▶ RESUME'
    } else {
      return '' // Blank when not clicked
    }
  }

  return (
    <motion.div
      className={`avatar-card ${isActive ? 'active' : ''} ${isCurrentSong ? 'selected' : ''} ${isPlaying ? 'playing' : ''}`}
      whileHover={{ 
        y: -20, 
        scale: 1.05,
        rotateY: 5
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        console.log('🎵 Card clicked! Song ID:', songId)
        onSelect(songId)
      }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isPlaying ? 
          "0 0 30px rgba(255, 0, 64, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)" : 
          "0 10px 20px rgba(0, 0, 0, 0.5)"
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Avatar3D modelPath={modelPath} isActive={isActive} />
      
      <div className="avatar-info">
        <h3>{title}</h3>
        <motion.p 
          className="avatar-subtitle"
          animate={{
            color: isPlaying ? 
              ["#ff0040", "#ff4000", "#ff0040"] : 
              "#00ffff",
            scale: isCurrentSong ? 1.1 : 1
          }}
          transition={{
            duration: isPlaying ? 1 : 0.3,
            repeat: isPlaying ? Infinity : 0
          }}
        >
          {getSubtitleContent()}
        </motion.p>
      </div>
      
      <div className="avatar-glow" />
    </motion.div>
  )
}

function AvatarShowcase({ onSongSelect, selectedSong, isPlaying }) {
  const avatars = [
    {
      id: 'nemos-tears',
      title: "NEMO'S TEARS",
      subtitle: 'Deep Sea Assault',
      buttonText: 'ENTER THE ABYSS',
      modelPath: '/models/nautilus.glb'
    },
    {
      id: 'ave-de-presa',
      title: 'AVE DE PRESA',
      subtitle: 'Aerial Domination', 
      buttonText: 'SOAR INTO BATTLE',
      modelPath: '/models/eagle.glb'
    },
    {
      id: 'to-hell-and-back',
      title: 'TO HELL & BACK TO HELL',
      subtitle: 'System Fallen',
      buttonText: 'DESCEND INTO DARKNESS',
      modelPath: '/models/death_star_asuirila_shadow_wraith.glb'
    },
    {
      id: 'courage',
      title: 'COURAGE',
      subtitle: 'Never surrender',
      buttonText: 'RISE WITH VALOR',
      modelPath: '/models/the_forgotten_knight (1).glb'
    }
  ]

  console.log('🎵🔧 AvatarShowcase rendering with avatars:', avatars)

  return (
    <motion.div 
      className="avatar-showcase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
    >
      {avatars.map((avatar, index) => (
        <motion.div
          key={avatar.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -200 : 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.5 + index * 0.3 }}
        >
          <AvatarCard
            title={avatar.title}
            subtitle={avatar.subtitle}
            buttonText={avatar.buttonText}
            modelPath={avatar.modelPath}
            songId={avatar.id}
            onSelect={onSongSelect}
            isActive={false}
            isCurrentSong={selectedSong === avatar.id}
            isPlaying={isPlaying && selectedSong === avatar.id}
          />
        </motion.div>
      ))}
      

    </motion.div>
  )
}

export default AvatarShowcase
