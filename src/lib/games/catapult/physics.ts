import type {
  CatapultSettings,
  Projectile,
  TrajectoryPoint,
  TargetZone
} from '@/types/catapult'
import { PHYSICS_CONSTANTS, TARGET_ZONES, WEIGHT_VALUES } from '@/types/catapult'

// ============================================================================
// PROJECTILE MOTION CALCULATIONS
// ============================================================================

export function calculateInitialVelocity(angle: number, force: number, weight: number): { vx: number; vy: number } {
  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180
  
  // Calculate velocity based on force and mass
  // F = ma, therefore a = F/m
  // Using simplified model where force directly affects velocity
  const velocity = force / Math.sqrt(weight)
  
  return {
    vx: velocity * Math.cos(angleRad),
    vy: velocity * Math.sin(angleRad)
  }
}

export function simulateTrajectory(settings: CatapultSettings): {
  trajectory: TrajectoryPoint[]
  landingDistance: number
  maxHeight: number
  flightTime: number
} {
  const { angle, force, weight: weightType } = settings
  const weight = WEIGHT_VALUES[weightType]
  
  const { vx, vy } = calculateInitialVelocity(angle, force, weight)
  
  const trajectory: TrajectoryPoint[] = []
  const dt = PHYSICS_CONSTANTS.TIME_STEP
  const gravity = PHYSICS_CONSTANTS.GRAVITY
  const airResistance = PHYSICS_CONSTANTS.AIR_RESISTANCE
  
  let x = 0
  let y = PHYSICS_CONSTANTS.CATAPULT_HEIGHT
  let velocityX = vx
  let velocityY = vy
  let time = 0
  let maxHeight = y
  
  // Simulate until projectile hits ground
  while (y >= 0 && time < PHYSICS_CONSTANTS.MAX_FLIGHT_TIME) {
    // Record trajectory point
    trajectory.push({
      x,
      y,
      time,
      velocity: { x: velocityX, y: velocityY }
    })
    
    // Calculate air resistance (proportional to velocity squared)
    const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2)
    const dragForceX = -airResistance * velocityX * speed / weight
    const dragForceY = -airResistance * velocityY * speed / weight
    
    // Update velocity (F = ma, a = F/m)
    velocityY -= (gravity * dt) + (dragForceY * dt)
    velocityX += dragForceX * dt
    
    // Update position
    x += velocityX * dt
    y += velocityY * dt
    
    // Track max height
    if (y > maxHeight) {
      maxHeight = y
    }
    
    time += dt
  }
  
  // Add final landing point
  trajectory.push({
    x,
    y: 0,
    time,
    velocity: { x: velocityX, y: 0 }
  })
  
  return {
    trajectory,
    landingDistance: x,
    maxHeight,
    flightTime: time
  }
}

// ============================================================================
// TARGET DETECTION
// ============================================================================

export function checkTargetHit(landingDistance: number): {
  targetHit: TargetZone | null
  isInBullseye: boolean
  distanceFromCenter: number
} {
  for (const target of TARGET_ZONES) {
    const targetStart = target.distance - target.width / 2
    const targetEnd = target.distance + target.width / 2
    
    if (landingDistance >= targetStart && landingDistance <= targetEnd) {
      const distanceFromCenter = Math.abs(landingDistance - target.distance)
      const isInBullseye = target.hasBullseye && 
        distanceFromCenter <= (target.bullseyeRadius || 0)
      
      return {
        targetHit: target,
        isInBullseye,
        distanceFromCenter
      }
    }
  }
  
  return {
    targetHit: null,
    isInBullseye: false,
    distanceFromCenter: 0
  }
}

// ============================================================================
// PHYSICS STEP (for real-time simulation)
// ============================================================================

export function updateProjectile(projectile: Projectile, dt: number): Projectile {
  if (!projectile.isFlying) {
    return projectile
  }
  
  const gravity = PHYSICS_CONSTANTS.GRAVITY
  const airResistance = PHYSICS_CONSTANTS.AIR_RESISTANCE
  
  // Calculate air resistance
  const speed = Math.sqrt(projectile.vx ** 2 + projectile.vy ** 2)
  const dragForceX = -airResistance * projectile.vx * speed / projectile.mass
  const dragForceY = -airResistance * projectile.vy * speed / projectile.mass
  
  // Update velocity
  const newVy = projectile.vy - (gravity * dt) + (dragForceY * dt)
  const newVx = projectile.vx + (dragForceX * dt)
  
  // Update position
  const newX = projectile.x + newVx * dt
  const newY = projectile.y + newVy * dt
  
  // Check if landed
  const hasLanded = newY <= 0
  
  return {
    ...projectile,
    x: newX,
    y: hasLanded ? 0 : newY,
    vx: newVx,
    vy: hasLanded ? 0 : newVy,
    isFlying: !hasLanded,
    hasLanded
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function createProjectile(settings: CatapultSettings): Projectile {
  const weight = WEIGHT_VALUES[settings.weight]
  const { vx, vy } = calculateInitialVelocity(settings.angle, settings.force, weight)
  
  return {
    x: 0,
    y: PHYSICS_CONSTANTS.CATAPULT_HEIGHT,
    vx,
    vy,
    mass: weight,
    radius: 0.5, // 0.5 meter radius
    isFlying: true,
    hasLanded: false
  }
}

export function metersToPixels(meters: number, scale: number = PHYSICS_CONSTANTS.SCALE): number {
  return meters * scale
}

export function pixelsToMeters(pixels: number, scale: number = PHYSICS_CONSTANTS.SCALE): number {
  return pixels / scale
}

// ============================================================================
// TRAJECTORY PREDICTION (for aiming assistance)
// ============================================================================

export function predictTrajectoryQuick(settings: CatapultSettings, points: number = 20): TrajectoryPoint[] {
  const { trajectory } = simulateTrajectory(settings)
  
  // Sample trajectory at regular intervals
  const step = Math.floor(trajectory.length / points)
  const quickTrajectory: TrajectoryPoint[] = []
  
  for (let i = 0; i < trajectory.length; i += step) {
    quickTrajectory.push(trajectory[i])
  }
  
  // Always include the last point
  if (quickTrajectory[quickTrajectory.length - 1] !== trajectory[trajectory.length - 1]) {
    quickTrajectory.push(trajectory[trajectory.length - 1])
  }
  
  return quickTrajectory
}

// ============================================================================
// OPTIMAL ANGLE CALCULATION (for educational purposes)
// ============================================================================

export function calculateOptimalAngle(force: number, weight: number, targetDistance: number): number {
  // For simplified ballistics, optimal angle for max distance is 45°
  // But we adjust based on target distance and parameters
  
  // If target is far, use higher angle
  // If target is near, use lower angle
  
  const maxDistance = PHYSICS_CONSTANTS.MAX_DISTANCE
  const distanceRatio = targetDistance / maxDistance
  
  // Range from 30° (near targets) to 60° (far targets)
  const optimalAngle = 30 + (30 * distanceRatio)
  
  return Math.max(30, Math.min(60, optimalAngle))
}

// ============================================================================
// PROCESS VARIATION (FOR VALIDATION MODE)
// ============================================================================

/**
 * Add realistic process variation to settings
 * Simulates natural process variation that exists in real-world manufacturing
 * 
 * Typical process variation sources:
 * - Material inconsistencies: ±1-2%
 * - Environmental factors: ±0.5-1%
 * - Equipment wear: ±1%
 * - Operator variation: ±2-3%
 * - Measurement error: ±0.5%
 * 
 * Total typical variation: ±3-5% (Six Sigma aims to reduce this!)
 */
export interface ProcessVariationConfig {
  enabled: boolean
  standardDeviation: number // As percentage (default: 2% = 0.02)
  seed?: number // Optional for reproducibility
}

const DEFAULT_VARIATION: ProcessVariationConfig = {
  enabled: false,
  standardDeviation: 0.02 // 2% variation (realistic Six Sigma process)
}

/**
 * Generate normal distribution random number (Box-Muller transform)
 * Used to simulate realistic process variation
 */
function normalRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return z0 * stdDev + mean
}

/**
 * Apply process variation to a value
 * Returns value with added normal distribution noise
 */
function applyVariation(value: number, variationPercent: number): number {
  // variationPercent is standard deviation as a percentage
  // e.g., 0.02 = 2% standard deviation
  const variation = normalRandom(0, variationPercent)
  return value * (1 + variation)
}

/**
 * Add process variation to settings
 * This simulates real-world process noise for Validation mode
 */
export function addProcessVariation(
  settings: CatapultSettings,
  config: ProcessVariationConfig = DEFAULT_VARIATION
): CatapultSettings {
  if (!config.enabled) {
    return settings
  }

  const stdDev = config.standardDeviation

  return {
    angle: applyVariation(settings.angle, stdDev * 0.5), // Less variation in angle
    force: applyVariation(settings.force, stdDev), // Normal variation
    weight: settings.weight // Weight doesn't vary (discrete selection)
  }
}

/**
 * Simulate trajectory with optional process variation
 * Use this in Validation mode to generate realistic data distributions
 */
export function simulateTrajectoryWithVariation(
  settings: CatapultSettings,
  variation?: ProcessVariationConfig
): {
  trajectory: TrajectoryPoint[]
  landingDistance: number
  maxHeight: number
  flightTime: number
} {
  const variedSettings = variation?.enabled
    ? addProcessVariation(settings, variation)
    : settings

  return simulateTrajectory(variedSettings)
}
