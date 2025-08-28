import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { movementOrchestrator } from '../utils/MovementOrchestrator'

// ============================================================================
// ZONE DEBUGGER - Visualizes movement zones (optional)
// ============================================================================

function ZoneDebugger({ showZones = false }) {
  const zoneRef = useRef()
  
  if (!showZones) return null
  
  // Get zone definitions
  const zones = {
    submarine: movementOrchestrator.zones?.submarine,
    eagle: movementOrchestrator.zones?.eagle,
    cyborg: movementOrchestrator.zones?.cyborg,
    bat: movementOrchestrator.zones?.bat
  }
  
  return (
    <group ref={zoneRef}>
      {Object.entries(zones).map(([avatarType, zone]) => {
        if (!zone) return null
        
        const bounds = zone.bounds
        const centerX = (bounds.x[0] + bounds.x[1]) / 2
        const centerY = (bounds.y[0] + bounds.y[1]) / 2
        const centerZ = (bounds.z[0] + bounds.z[1]) / 2
        
        const sizeX = bounds.x[1] - bounds.x[0]
        const sizeY = bounds.y[1] - bounds.y[0]
        const sizeZ = bounds.z[1] - bounds.z[0]
        
        return (
          <mesh
            key={avatarType}
            position={[centerX, centerY, centerZ]}
          >
            <boxGeometry args={[sizeX, sizeY, sizeZ]} />
            <meshBasicMaterial 
              color={zone.color}
              transparent
              opacity={0.1}
              wireframe
            />
          </mesh>
        )
      })}
      
      {/* Zone labels */}
      {Object.entries(zones).map(([avatarType, zone]) => {
        if (!zone) return null
        
        const bounds = zone.bounds
        const centerX = (bounds.x[0] + bounds.x[1]) / 2
        const centerY = bounds.y[1] + 2 // Above the zone
        const centerZ = (bounds.z[0] + bounds.z[1]) / 2
        
        return (
          <mesh
            key={`${avatarType}-label`}
            position={[centerX, centerY, centerZ]}
          >
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial 
              color={zone.color}
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default ZoneDebugger
