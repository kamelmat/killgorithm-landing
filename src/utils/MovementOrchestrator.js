// ============================================================================
// MOVEMENT ORCHESTRATOR - Prevents avatar collisions
// ============================================================================

class MovementOrchestrator {
  constructor() {
    this.avatars = new Map() // Store avatar positions and zones
    this.zones = {
      // Define separate movement zones for each avatar
      submarine: {
        name: 'submarine',
        bounds: {
          x: [-40, 40],     // Full width
          y: [-15, 5],      // Lower half (underwater)
          z: [-60, -10]     // Back to medium depth
        },
        color: '#00ffff'    // Cyan for submarine
      },
      eagle: {
        name: 'eagle', 
        bounds: {
          x: [-15, 15],     // Narrower horizontal range
          y: [-5, 10],      // MUCH LOWER - below title, at eye level
          z: [-25, 15]      // DEEP forward/back movement range
        },
        color: '#8b0000'    // Dark red for eagle
      },
      cyborg: {
        name: 'cyborg',
        bounds: {
          x: [-25, 25],     // Center area
          y: [-10, 15],     // Middle vertical
          z: [-40, -5]      // Medium depth
        },
        color: '#ff0000'    // Red for cyborg
      },
      bat: {
        name: 'bat',
        bounds: {
          x: [-30, 30],     // Center-wide
          y: [10, 30],      // High up (sky)
          z: [-45, -5]      // Medium depth
        },
        color: '#ff6600'    // Orange for bat
      }
    }
  }

  // Register an avatar with the orchestrator
  registerAvatar(avatarType, initialPosition) {
    const zone = this.zones[avatarType]
    if (!zone) {
      console.warn(`Unknown avatar type: ${avatarType}`)
      return null
    }

    const avatarData = {
      type: avatarType,
      position: { ...initialPosition },
      zone: zone,
      lastUpdate: Date.now()
    }

    this.avatars.set(avatarType, avatarData)
    console.log(`🎭 Registered ${avatarType} in zone:`, zone.name)
    return zone
  }

  // Update avatar position
  updatePosition(avatarType, newPosition) {
    const avatar = this.avatars.get(avatarType)
    if (avatar) {
      avatar.position = { ...newPosition }
      avatar.lastUpdate = Date.now()
    }
  }

  // Check if a position is within the avatar's allowed zone
  isPositionInZone(avatarType, position) {
    const avatar = this.avatars.get(avatarType)
    if (!avatar) return false

    const zone = avatar.zone.bounds
    return (
      position.x >= zone.x[0] && position.x <= zone.x[1] &&
      position.y >= zone.y[0] && position.y <= zone.y[1] &&
      position.z >= zone.z[0] && position.z <= zone.z[1]
    )
  }

  // Get a safe waypoint within the avatar's zone
  getSafeWaypoint(avatarType) {
    const avatar = this.avatars.get(avatarType)
    if (!avatar) return { x: 0, y: 0, z: -20 }

    const zone = avatar.zone.bounds
    
    // Generate random position within zone bounds
    const waypoint = {
      x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
      y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]), 
      z: zone.z[0] + Math.random() * (zone.z[1] - zone.z[0])
    }

    return waypoint
  }

  // Get predefined waypoints for an avatar type
  getWaypointsForAvatar(avatarType) {
    const avatar = this.avatars.get(avatarType)
    if (!avatar) return []

    const zone = avatar.zone.bounds
    
    switch (avatarType) {
      case 'submarine':
        return [
          { x: zone.x[0] * 0.5, y: zone.y[0], z: zone.z[0] * 0.7 },      // Back left, low
          { x: zone.x[1] * 0.7, y: zone.y[0] * 0.5, z: zone.z[1] * 0.8 }, // Front right, mid
          { x: 0, y: zone.y[1], z: zone.z[0] },                           // Center, high back
          { x: zone.x[0] * 0.7, y: zone.y[1] * 0.8, z: zone.z[1] * 0.6 }, // Left, high front
          { x: zone.x[1] * 0.5, y: zone.y[0] * 0.7, z: zone.z[0] * 0.8 }, // Right, low back
          { x: 0, y: zone.y[0] * 0.5, z: zone.z[1] * 0.7 }               // Center, mid front
        ]

      case 'eagle':
        return [
          { x: 0, y: 2, z: -20 },     // Start center, low, far back
          { x: 5, y: 5, z: -10 },     // Move slightly right, closer
          { x: 0, y: 3, z: 5 },       // CENTER - come FORWARD past camera!
          { x: 0, y: 8, z: 12 },      // VERY FORWARD - huge and facing camera!
          { x: -5, y: 6, z: 8 },      // Pull back slightly, left
          { x: 0, y: 4, z: -5 },      // Center, medium distance
          { x: 8, y: 7, z: -15 },     // Right, further back
          { x: 0, y: 5, z: -25 },     // Far back to restart
        ]

      case 'cyborg':
        return [
          { x: zone.x[0] * 0.8, y: zone.y[0] * 0.8, z: zone.z[0] * 0.7 }, // Left, low, back
          { x: zone.x[1] * 0.8, y: zone.y[1] * 0.6, z: zone.z[0] * 0.8 }, // Right, mid, back
          { x: 0, y: zone.y[1] * 0.9, z: zone.z[1] * 0.8 },              // Center, high, front
          { x: zone.x[0] * 0.6, y: zone.y[1] * 0.7, z: zone.z[1] * 0.6 }, // Left, mid, front
          { x: zone.x[1] * 0.6, y: zone.y[0] * 0.9, z: zone.z[1] * 0.7 }, // Right, low, front
          { x: 0, y: zone.y[0] * 0.6, z: zone.z[0] * 0.9 }               // Center, low, back
        ]

      case 'bat':
        return [
          { x: zone.x[0] * 0.7, y: zone.y[1] * 0.9, z: zone.z[0] * 0.8 }, // Left, high, back
          { x: zone.x[1] * 0.7, y: zone.y[1] * 0.8, z: zone.z[0] * 0.6 }, // Right, high, back
          { x: zone.x[1] * 0.5, y: zone.y[0] * 1.5, z: zone.z[1] * 0.9 }, // Right, mid, front
          { x: 0, y: zone.y[1] * 0.7, z: zone.z[1] * 0.8 },              // Center, high, front
          { x: zone.x[0] * 0.5, y: zone.y[0] * 1.5, z: zone.z[1] * 0.9 }, // Left, mid, front
          { x: 0, y: zone.y[1] * 0.95, z: zone.z[0] * 0.7 }              // Center, high, back
        ]

      default:
        return [{ x: 0, y: 0, z: -20 }]
    }
  }

  // Check for potential collisions (within minimum distance)
  checkCollisions(avatarType, position, minDistance = 8) {
    const collisions = []
    
    for (const [otherType, otherAvatar] of this.avatars.entries()) {
      if (otherType === avatarType) continue
      
      const distance = Math.sqrt(
        Math.pow(position.x - otherAvatar.position.x, 2) +
        Math.pow(position.y - otherAvatar.position.y, 2) +
        Math.pow(position.z - otherAvatar.position.z, 2)
      )
      
      if (distance < minDistance) {
        collisions.push({
          avatar: otherType,
          distance: distance,
          position: otherAvatar.position
        })
      }
    }
    
    return collisions
  }

  // Get zone info for debugging
  getZoneInfo(avatarType) {
    const avatar = this.avatars.get(avatarType)
    return avatar ? avatar.zone : null
  }

  // Get all registered avatars
  getAllAvatars() {
    return Array.from(this.avatars.keys())
  }
}

// Create singleton instance
export const movementOrchestrator = new MovementOrchestrator()
export default MovementOrchestrator
