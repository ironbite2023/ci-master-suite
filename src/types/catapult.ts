// ============================================================================
// CATAPULT GAME TYPES
// ============================================================================

export interface CatapultSettings {
  angle: number // 30-60 degrees
  force: number // 75-125 normalized units
  weight: WeightType // Light/Medium/Heavy
}

export type WeightType = 'light' | 'medium' | 'heavy'

export const WEIGHT_VALUES: Record<WeightType, number> = {
  light: 1.0,
  medium: 1.5,
  heavy: 2.0
}

// ============================================================================
// SHOT & PROJECTILE
// ============================================================================

export interface Shot {
  id: string
  settings: CatapultSettings
  launchTime: number
  landingTime: number
  landingDistance: number // meters
  targetHit: TargetZone | null
  score: number
  trajectory: TrajectoryPoint[]
}

export interface TrajectoryPoint {
  x: number
  y: number
  time: number
  velocity: { x: number; y: number }
}

export interface Projectile {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  radius: number
  isFlying: boolean
  hasLanded: boolean
}

// ============================================================================
// TARGETS
// ============================================================================

export interface TargetZone {
  id: string
  name: string
  distance: number // center distance in meters
  width: number // width in meters
  points: number // base points
  color: string
  hasBullseye: boolean
  bullseyeRadius?: number
  bullseyeBonus?: number
}

export const TARGET_ZONES: TargetZone[] = [
  {
    id: 'near',
    name: 'Near Zone',
    distance: 125,
    width: 50,
    points: 50,
    color: '#10b981',
    hasBullseye: true,
    bullseyeRadius: 10,
    bullseyeBonus: 25
  },
  {
    id: 'mid',
    name: 'Mid Zone',
    distance: 225,
    width: 50,
    points: 100,
    color: '#3b82f6',
    hasBullseye: true,
    bullseyeRadius: 10,
    bullseyeBonus: 50
  },
  {
    id: 'far',
    name: 'Far Zone',
    distance: 325,
    width: 50,
    points: 150,
    color: '#8b5cf6',
    hasBullseye: true,
    bullseyeRadius: 10,
    bullseyeBonus: 75
  }
]

// ============================================================================
// DOE (Design of Experiments)
// ============================================================================

export interface DOEExperiment {
  runNumber: number
  angle: 'low' | 'high'
  force: 'low' | 'high'
  weight: 'low' | 'high'
  angleValue: number
  forceValue: number
  weightValue: WeightType
  completed: boolean
  result?: DOEResult
}

export interface DOEResult {
  distance: number
  accuracy: number
  score: number
  timestamp: number
}

export interface DOEAnalysis {
  mainEffects: {
    angle: number
    force: number
    weight: number
  }
  interactions: {
    angleForce: number
    angleWeight: number
    forceWeight: number
  }
  recommendations: string[]
  optimalSettings: CatapultSettings
}

export const DOE_LEVELS = {
  angle: { low: 30, high: 60 },
  force: { low: 75, high: 125 },
  weight: { low: 'light' as WeightType, high: 'heavy' as WeightType }
}

// ============================================================================
// GAME STATE
// ============================================================================

export interface CatapultGameState {
  // Game Status
  gamePhase: 'setup' | 'aiming' | 'launching' | 'flying' | 'landed' | 'analyzing'
  isPaused: boolean
  isComplete: boolean
  
  // Settings
  currentSettings: CatapultSettings
  
  // Shots
  shots: Shot[]
  currentShot: Shot | null
  bestShot: Shot | null
  
  // Projectile
  projectile: Projectile | null
  
  // Scoring
  totalScore: number
  consecutiveHits: number
  highestCombo: number
  
  // DOE
  experiments: DOEExperiment[]
  currentExperiment: number
  doeMode: boolean
  analysis: DOEAnalysis | null
  
  // Tutorial
  tutorialStep: number
  tutorialComplete: boolean
  showTutorial: boolean
  
  // Time
  gameStartTime: number
  totalGameTime: number
}

// ============================================================================
// PHYSICS CONSTANTS
// ============================================================================

export const PHYSICS_CONSTANTS = {
  GRAVITY: 9.81, // m/s²
  AIR_RESISTANCE: 0.01,
  SCALE: 2, // pixels per meter
  CATAPULT_HEIGHT: 20, // meters
  MAX_DISTANCE: 400, // meters
  TIME_STEP: 1 / 60, // 60 FPS
  MAX_FLIGHT_TIME: 15 // seconds
}

// ============================================================================
// CANVAS DIMENSIONS
// ============================================================================

export interface CanvasDimensions {
  width: number
  height: number
  groundY: number
  catapultX: number
  catapultY: number
  scale: number
}

// ============================================================================
// SCORING
// ============================================================================

export interface ScoreBreakdown {
  basePoints: number
  accuracyBonus: number
  consistencyBonus: number
  timePenalty: number
  comboMultiplier: number
  totalScore: number
}

export interface GameStats {
  totalShots: number
  successfulHits: number
  accuracy: number // percentage
  averageDistance: number
  bestDistance: number
  totalScore: number
  experimentsCompleted: number
}

// ============================================================================
// MULTI-MODE GAME SYSTEM
// ============================================================================

export type GameMode = 'freeplay' | 'doe' | 'validation' | 'capability' | 'control'

export interface GameProgress {
  unlockedModes: GameMode[]
  completedModes: GameMode[]
  currentMode: GameMode
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: number
  category: 'freeplay' | 'doe' | 'validation' | 'capability' | 'control' | 'meta'
}

// ============================================================================
// VALIDATION MODE (Normality Testing)
// ============================================================================

export interface ValidationData {
  shots: Shot[]
  normalityTests: {
    andersonDarling: { statistic: number; pValue: number; isNormal: boolean }
    shapiroWilk: { statistic: number; pValue: number; isNormal: boolean }
    kolmogorovSmirnov: { statistic: number; pValue: number; isNormal: boolean }
  }
  descriptiveStats: {
    mean: number
    median: number
    stdDev: number
    variance: number
    min: number
    max: number
    range: number
    skewness: number
    kurtosis: number
  }
  qqPlotData?: {
    theoretical: number[]
    observed: number[]
    referenceLineSlope: number
    referenceLineIntercept: number
  }
}

// ============================================================================
// CAPABILITY MODE (Process Capability Analysis)
// ============================================================================

export interface CapabilityData {
  specifications: {
    USL: number // Upper Specification Limit
    LSL: number // Lower Specification Limit
    target: number
  }
  indices: {
    Cp: number
    Cpk: number
    Pp: number
    Ppk: number
    Cpm: number
  }
  sigmaLevel: number
  ppm: number // Parts per million defective
  dpmo: number // Defects per million opportunities
  yield: {
    withinSpec: number
    outOfSpec: number
    yieldPercent: number
  }
}

export interface CapabilityInterpretation {
  rating: 'excellent' | 'adequate' | 'marginal' | 'inadequate'
  color: string
  description: string
  recommendation: string
}

// ============================================================================
// CONTROL MODE (Statistical Process Control)
// ============================================================================

export interface Subgroup {
  id: string
  shots: Array<{ id: string; distance: number }>
  mean: number
  range: number
  timestamp: Date
  subgroupNumber: number
}

export interface ControlLimits {
  // X-bar Chart (Process Mean)
  xBarUCL: number  // Upper Control Limit
  xBarCL: number   // Center Line (Grand Mean)
  xBarLCL: number  // Lower Control Limit
  
  // R Chart (Process Variation)
  rBarUCL: number  // Upper Control Limit
  rBarCL: number   // Center Line (Average Range)
  rBarLCL: number  // Lower Control Limit (often 0)
  
  // Sigma zones for Nelson Rules
  xBar1Sigma: number  // 1σ from center
  xBar2Sigma: number  // 2σ from center
  xBar3Sigma: number  // 3σ from center (same as UCL/LCL)
}

export interface ControlConstants {
  A2: number  // X-bar chart factor
  D3: number  // R chart lower limit factor
  D4: number  // R chart upper limit factor
  d2: number  // Bias correction factor for estimating σ
}

export interface ControlChartData {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  subgroupSize: number
  totalSubgroups: number
  isStable: boolean
  violations?: Violation[]
}

export interface ProcessStatistics {
  grandMean: number
  rBar: number
  processStdDev: number
  minValue: number
  maxValue: number
  overallRange: number
}

export interface Violation {
  id: string
  subgroupIndex: number
  subgroupNumber: number
  rule: string
  ruleNumber: number
  severity: 'high' | 'medium' | 'low'
  description: string
  recommendation: string
  chart: 'xbar' | 'range'
}

export const CONTROL_CHART_CONSTANTS: Record<number, ControlConstants> = {
  2: { A2: 1.880, D3: 0, D4: 3.267, d2: 1.128 },
  3: { A2: 1.023, D3: 0, D4: 2.574, d2: 1.693 },
  4: { A2: 0.729, D3: 0, D4: 2.282, d2: 2.059 },
  5: { A2: 0.577, D3: 0, D4: 2.114, d2: 2.326 },
  6: { A2: 0.483, D3: 0, D4: 2.004, d2: 2.534 },
  7: { A2: 0.419, D3: 0.076, D4: 1.924, d2: 2.704 },
  8: { A2: 0.373, D3: 0.136, D4: 1.864, d2: 2.847 },
  9: { A2: 0.337, D3: 0.184, D4: 1.816, d2: 2.970 },
  10: { A2: 0.308, D3: 0.223, D4: 1.777, d2: 3.078 }
}
