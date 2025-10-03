'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, Trophy, Target as TargetIcon, Zap } from 'lucide-react'
import Link from 'next/link'
import { CatapultCanvas } from '@/components/games/catapult/CatapultCanvas'
import { CatapultControls } from '@/components/games/catapult/CatapultControls'
import { ModeSelector } from '@/components/games/catapult/ModeSelector'
import { DOEControls } from '@/components/games/catapult/DOEControls'
import { ExperimentMatrix } from '@/components/games/catapult/ExperimentMatrix'
import { DOEAnalysis } from '@/components/games/catapult/DOEAnalysis'
// Week 2 - Validation Components
import { ValidationControls } from '@/components/games/catapult/ValidationControls'
import { NormalityResults } from '@/components/games/catapult/NormalityResults'
import { QQPlot } from '@/components/games/catapult/QQPlot'
import { HistogramChart } from '@/components/games/catapult/HistogramChart'
import { DescriptiveStatsCard } from '@/components/games/catapult/DescriptiveStatsCard'
// Week 2 - Capability Components
import { CapabilityControls } from '@/components/games/catapult/CapabilityControls'
import CapabilityResults from '@/components/games/catapult/CapabilityResults'
import ProcessCapabilityChart from '@/components/games/catapult/ProcessCapabilityChart'
import SigmaLevelCard from '@/components/games/catapult/SigmaLevelCard'
import CapabilityInterpretation from '@/components/games/catapult/CapabilityInterpretation'
// Week 3 - Control Components
import ControlModeControls from '@/components/games/catapult/ControlModeControls'
import XBarChart from '@/components/games/catapult/XBarChart'
import RChart from '@/components/games/catapult/RChart'
import type {
  CatapultSettings,
  Projectile,
  TrajectoryPoint,
  Shot,
  GameMode,
  GameProgress,
  DOEExperiment,
  DOEResult,
  ControlChartData,
  Subgroup
} from '@/types/catapult'
import {
  createProjectile,
  updateProjectile,
  checkTargetHit,
  predictTrajectoryQuick,
  simulateTrajectoryWithVariation
} from '@/lib/games/catapult/physics'
import {
  calculateScore,
  calculateGameStats,
  formatScore,
  formatDistance
} from '@/lib/games/catapult/scoring'
import { PHYSICS_CONSTANTS } from '@/types/catapult'
import {
  generateDOEExperiments,
  saveExperimentResult,
  exportToCSV,
  isExperimentSetComplete,
  findExperimentBySettings,
  getNextIncompleteExperiment
} from '@/lib/games/catapult/doeEngine'
import { performDOEAnalysis } from '@/lib/games/catapult/doeCalculations'
import { performNormalityAnalysis, type NormalityAnalysis } from '@/lib/games/catapult/normalityTests'
import { performCapabilityAnalysis, type SpecificationLimits, type CapabilityAnalysis } from '@/lib/games/catapult/capabilityCalculations'
import { createControlChartData, createSubgroup } from '@/lib/games/catapult/controlCharts'
import { performNelsonAnalysis, type NelsonAnalysis } from '@/lib/games/catapult/nelsonRules'
import { doeSupabaseService } from '@/lib/games/catapult/doeSupabaseService'
// Game Rules System
import { RulesButton } from '@/components/games/RulesButton'
import { GameRulesModal } from '@/components/games/GameRulesModal'
import { ModeRulesNotification } from '@/components/games/ModeRulesNotification'
import { getGameRules, hasSeenRules } from '@/lib/games/gameRules'
// Process Variation Educational Components
import { ProcessVariationBanner } from '@/components/games/catapult/ProcessVariationBanner'
import { VariationIndicator, VariationStatsSummary } from '@/components/games/catapult/VariationIndicator'

// ============================================================================
// CATAPULT GAME PAGE
// ============================================================================

export default function CatapultGamePage() {
  // Multi-mode state
  const [gameMode, setGameMode] = useState<GameMode>('freeplay')
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    unlockedModes: ['freeplay' as GameMode, 'doe' as GameMode], // Start with freeplay and DOE unlocked
    completedModes: [],
    currentMode: 'freeplay',
    achievements: []
  })

  // Game Rules System state
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showModeNotification, setShowModeNotification] = useState(false)

  // Process Variation UI state
  const [showVariationModal, setShowVariationModal] = useState(false)
  const [optimalDistance, setOptimalDistance] = useState(100) // Target from DOE optimal settings

  // DOE state
  const [doeExperiments, setDoeExperiments] = useState<DOEExperiment[]>([])
  const [doeSessionId, setDoeSessionId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showExperimentMatrix, setShowExperimentMatrix] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Validation state
  const [validationData, setValidationData] = useState<NormalityAnalysis | null>(null)
  const [isRunningNormality, setIsRunningNormality] = useState(false)

  // Capability state
  const [capabilitySpecs, setCapabilitySpecs] = useState<SpecificationLimits>({
    lsl: 8,
    usl: 12,
    target: 10
  })
  const [capabilityAnalysis, setCapabilityAnalysis] = useState<CapabilityAnalysis | null>(null)
  const [isRunningCapability, setIsRunningCapability] = useState(false)

  // Control state
  const [controlData, setControlData] = useState<ControlChartData | null>(null)
  const [nelsonAnalysis, setNelsonAnalysis] = useState<NelsonAnalysis | null>(null)
  const [controlSubgroupSize, setControlSubgroupSize] = useState(5)
  const [currentSubgroupShots, setCurrentSubgroupShots] = useState<number[]>([])

  // Game settings
  const [settings, setSettings] = useState<CatapultSettings>({
    angle: 45,
    force: 100,
    weight: 'medium'
  })

  // Game state
  const [projectile, setProjectile] = useState<Projectile | null>(null)
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([])
  const [shots, setShots] = useState<Shot[]>([])
  const [consecutiveHits, setConsecutiveHits] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showPrediction, setShowPrediction] = useState(true)
  
  // Refs
  const animationRef = useRef<number | undefined>(undefined)
  const shotStartTime = useRef<number>(0)
  const trajectoryHistory = useRef<TrajectoryPoint[]>([])
  const shotCounter = useRef<number>(0)
  const isProcessingLanding = useRef<boolean>(false)

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      const authenticated = await doeSupabaseService.isAuthenticated()
      setIsAuthenticated(authenticated)
    }
    checkAuth()
  }, [])

  // Initialize DOE experiments when switching to DOE mode
  useEffect(() => {
    if (gameMode === 'doe' && doeExperiments.length === 0) {
      const experiments = generateDOEExperiments()
      setDoeExperiments(experiments)
      
      // Load first experiment settings
      if (experiments[0]) {
        setSettings({
          angle: experiments[0].angleValue,
          force: experiments[0].forceValue,
          weight: experiments[0].weightValue
        })
      }

      // Create Supabase session if authenticated
      if (isAuthenticated) {
        doeSupabaseService.createSession(experiments)
          .then(session => {
            setDoeSessionId(session.id)
            console.log('✅ DOE session created in Supabase:', session.id)
          })
          .catch(error => {
            console.warn('Could not create Supabase session:', error)
          })
      }
    }
  }, [gameMode, doeExperiments.length, isAuthenticated])

  // Load DOE state from Supabase or localStorage on mount
  useEffect(() => {
    async function loadDOEState() {
      // Try Supabase first if authenticated
      if (isAuthenticated) {
        try {
          const session = await doeSupabaseService.getMostRecentSession()
          if (session && session.status === 'in_progress') {
            setDoeExperiments(session.experiments)
            setDoeSessionId(session.id)
            console.log('✅ Loaded DOE session from Supabase:', session.id)
            
            // Also save to localStorage for offline access
            localStorage.setItem('catapult-doe-experiments', JSON.stringify(session.experiments))
            localStorage.setItem('catapult-doe-session-id', session.id)
            return
          }
        } catch (error) {
          console.warn('Could not load from Supabase, falling back to localStorage:', error)
        }
      }

      // Fallback to localStorage
      const saved = localStorage.getItem('catapult-doe-experiments')
      const savedSessionId = localStorage.getItem('catapult-doe-session-id')
      if (saved) {
        try {
          const experiments = JSON.parse(saved)
          setDoeExperiments(experiments)
          if (savedSessionId) {
            setDoeSessionId(savedSessionId)
          }
          console.log('✅ Loaded DOE session from localStorage')
        } catch (error) {
          console.error('Failed to load DOE experiments:', error)
        }
      }
    }

    loadDOEState()
  }, [isAuthenticated])

  // Save DOE state to both localStorage and Supabase when experiments change
  useEffect(() => {
    if (doeExperiments.length > 0) {
      // Always save to localStorage for fast access
      localStorage.setItem('catapult-doe-experiments', JSON.stringify(doeExperiments))
      
      // Sync to Supabase if authenticated and have session ID
      if (isAuthenticated && doeSessionId) {
        doeSupabaseService.updateSessionExperiments(doeSessionId, doeExperiments)
          .catch(error => {
            console.warn('Could not sync to Supabase:', error)
          })
      }
    }
  }, [doeExperiments, isAuthenticated, doeSessionId])

  // Check for DOE completion and unlock next mode
  useEffect(() => {
    if (gameMode === 'doe' && isExperimentSetComplete(doeExperiments)) {
      // Auto-show analysis when complete
      setShowAnalysis(true)

      // Calculate optimal distance from DOE analysis
      const analysis = performDOEAnalysis(doeExperiments)
      const { trajectory } = simulateTrajectoryWithVariation(analysis.optimalSettings)
      const optimalLandingDistance = trajectory[trajectory.length - 1].x
      setOptimalDistance(optimalLandingDistance)
      console.log('🎯 Optimal target distance set:', optimalLandingDistance.toFixed(2))

      // Unlock Validation mode
      setGameProgress(prev => {
        const updated: GameProgress = {
          ...prev,
          unlockedModes: prev.unlockedModes.includes('validation')
            ? prev.unlockedModes
            : [...prev.unlockedModes, 'validation' as GameMode],
          completedModes: prev.completedModes.includes('doe')
            ? prev.completedModes
            : [...prev.completedModes, 'doe' as GameMode]
        }
        // Save to localStorage
        localStorage.setItem('catapult-game-progress', JSON.stringify(updated))
        console.log('✅ Validation mode unlocked!')
        return updated
      })

      // Mark session as complete in Supabase
      if (isAuthenticated && doeSessionId) {
        doeSupabaseService.completeSession(doeSessionId, doeExperiments)
          .then(() => {
            console.log('✅ DOE session marked complete in Supabase')
          })
          .catch(error => {
            console.warn('Could not complete Supabase session:', error)
          })
      }
    }
  }, [doeExperiments, gameMode, isAuthenticated, doeSessionId])

  // Load game progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('catapult_progress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        setGameProgress(progress)
      } catch (error) {
        console.error('Failed to load game progress:', error)
      }
    }
  }, [])

  // Save validation data
  useEffect(() => {
    if (validationData) {
      localStorage.setItem('catapult_validation', JSON.stringify(validationData))
    }
  }, [validationData])

  // Save capability data
  useEffect(() => {
    if (capabilityAnalysis) {
      localStorage.setItem('catapult_capability', JSON.stringify(capabilityAnalysis))
    }
  }, [capabilityAnalysis])

  // Save control data
  useEffect(() => {
    if (controlData) {
      localStorage.setItem('catapult_control', JSON.stringify(controlData))
    }
  }, [controlData])

  // Update trajectory prediction when settings change
  useEffect(() => {
    if (!projectile?.isFlying) {
      const predicted = predictTrajectoryQuick(settings, 30)
      setTrajectory(predicted)
    }
  }, [settings, projectile?.isFlying])

  // Handle landing
  const handleLanding = useCallback((landed: Projectile, shotTrajectory: TrajectoryPoint[]) => {
    let landingDistance = landed.x
    
    // Add process variation in Validation, Capability, and Control modes
    // Simulates real-world process noise (typically ±2-3% standard deviation)
    if (gameMode === 'validation' || gameMode === 'capability' || gameMode === 'control') {
      // Box-Muller transform for normal distribution
      const u1 = Math.random()
      const u2 = Math.random()
      const normalRandom = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
      
      // Apply 2% standard deviation (realistic Six Sigma process variation)
      const variation = normalRandom * 0.02 // 2% std dev
      landingDistance = landingDistance * (1 + variation)
      
      // Keep within reasonable bounds
      landingDistance = Math.max(0, landingDistance)
    }
    
    const shotTime = (Date.now() - shotStartTime.current) / 1000
    
    // Check target hit
    const { targetHit, isInBullseye, distanceFromCenter } = checkTargetHit(landingDistance)
    
    // Calculate score
    const scoreBreakdown = calculateScore(
      landingDistance,
      targetHit,
      isInBullseye,
      distanceFromCenter,
      shotTime,
      consecutiveHits,
      1.0 // Easy difficulty for now
    )

    // Calculate accuracy
    const accuracy = targetHit ? Math.max(0, 100 - distanceFromCenter * 10) : 0

    // Update consecutive hits
    if (targetHit) {
      setConsecutiveHits(prev => prev + 1)
    } else {
      setConsecutiveHits(0)
    }

    // Create shot record with unique ID
    shotCounter.current += 1
    const newShot: Shot = {
      id: `shot-${Date.now()}-${shotCounter.current}`,
      settings: { ...settings },
      launchTime: shotStartTime.current,
      landingTime: Date.now(),
      landingDistance,
      targetHit,
      score: scoreBreakdown.totalScore,
      trajectory: shotTrajectory
    }

    // Update shots and score
    setShots(prev => [...prev, newShot])
    setTotalScore(prev => prev + scoreBreakdown.totalScore)

    // DOE Mode: Save experiment result
    if (gameMode === 'doe') {
      const currentExperiment = findExperimentBySettings(doeExperiments, settings)
      if (currentExperiment && !currentExperiment.completed) {
        const result: DOEResult = {
          distance: landingDistance,
          accuracy,
          score: scoreBreakdown.totalScore,
          timestamp: Date.now()
        }
        
        const updatedExperiments = saveExperimentResult(
          doeExperiments,
          currentExperiment.runNumber,
          result
        )
        setDoeExperiments(updatedExperiments)

        // Auto-load next experiment after a delay
        setTimeout(() => {
          const nextExp = getNextIncompleteExperiment(updatedExperiments)
          if (nextExp) {
            setSettings({
              angle: nextExp.angleValue,
              force: nextExp.forceValue,
              weight: nextExp.weightValue
            })
          }
        }, 2000)
      }
    }

    // Keep trajectory visible briefly
    setTimeout(() => {
      setTrajectory([])
    }, 2000)
  }, [consecutiveHits, settings, gameMode, doeExperiments])

  // Physics simulation loop
  useEffect(() => {
    if (!projectile?.isFlying) return

    const simulateStep = () => {
      setProjectile(prev => {
        if (!prev || !prev.isFlying) return prev

        const dt = PHYSICS_CONSTANTS.TIME_STEP
        const updated = updateProjectile(prev, dt)

        // Record trajectory point
        trajectoryHistory.current.push({
          x: updated.x,
          y: updated.y,
          time: (Date.now() - shotStartTime.current) / 1000,
          velocity: { x: updated.vx, y: updated.vy }
        })

        // Check if landed (with guard to prevent duplicate processing)
        if (updated.hasLanded && !isProcessingLanding.current) {
          isProcessingLanding.current = true
          handleLanding(updated, trajectoryHistory.current)
          return null
        }

        return updated
      })

      animationRef.current = requestAnimationFrame(simulateStep)
    }

    animationRef.current = requestAnimationFrame(simulateStep)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [projectile?.isFlying, handleLanding])

  // Update canvas trajectory
  useEffect(() => {
    if (projectile?.isFlying) {
      setTrajectory(trajectoryHistory.current)
    }
  }, [projectile])

  // Launch catapult
  const handleLaunch = () => {
    const newProjectile = createProjectile(settings)
    setProjectile(newProjectile)
    shotStartTime.current = Date.now()
    trajectoryHistory.current = []
    setTrajectory([])
    isProcessingLanding.current = false // Reset landing guard for new shot
  }

  // Reset settings
  const handleReset = () => {
    setSettings({
      angle: 45,
      force: 100,
      weight: 'medium'
    })
  }

  // Handle mode change
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode)
    setGameProgress(prev => ({
      ...prev,
      currentMode: mode
    }))

    // Reset game state when changing modes
    setShots([])
    setTotalScore(0)
    setConsecutiveHits(0)
    setProjectile(null)
    
    // Show mode notification if user hasn't seen rules for this mode
    setShowModeNotification(true)
  }

  // Load game progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('catapult-game-progress')
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setGameProgress(progress)
        console.log('✅ Loaded game progress:', progress)
      } catch (error) {
        console.error('Failed to load game progress:', error)
      }
    }
  }, [])

  // Check if user needs to see rules on first visit
  useEffect(() => {
    if (!hasSeenRules('catapult')) {
      setShowRulesModal(true)
    }
  }, [])

  // Get current mode rules
  const currentRules = getGameRules('catapult', gameMode)

  // DOE: Reset experiments
  const handleDOEReset = async () => {
    const fresh = generateDOEExperiments()
    setDoeExperiments(fresh)
    setShowAnalysis(false)
    
    // Load first experiment
    if (fresh[0]) {
      setSettings({
        angle: fresh[0].angleValue,
        force: fresh[0].forceValue,
        weight: fresh[0].weightValue
      })
    }

    // Create new Supabase session if authenticated
    if (isAuthenticated && doeSessionId) {
      try {
        // Mark old session as abandoned
        await doeSupabaseService.abandonSession(doeSessionId)
        
        // Create new session
        const newSession = await doeSupabaseService.createSession(fresh)
        setDoeSessionId(newSession.id)
        localStorage.setItem('catapult-doe-session-id', newSession.id)
        console.log('✅ Created new DOE session:', newSession.id)
      } catch (error) {
        console.warn('Could not reset Supabase session:', error)
      }
    }
  }

  // DOE: Export CSV
  const handleDOEExport = () => {
    const csv = exportToCSV(doeExperiments)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `catapult-doe-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // VALIDATION: Run normality tests
  const handleRunNormalityTests = useCallback(() => {
    setIsRunningNormality(true)
    
    try {
      const shotDistances = shots.map(s => s.landingDistance)
      const analysis = performNormalityAnalysis(shotDistances)
      
      setValidationData(analysis)
      
      // Check for mode unlock
      if (analysis.overallPassed && !gameProgress.unlockedModes.includes('capability')) {
        const newProgress: GameProgress = {
          ...gameProgress,
          unlockedModes: [...gameProgress.unlockedModes, 'capability' as GameMode],
          completedModes: [...gameProgress.completedModes, 'validation' as GameMode]
        }
        setGameProgress(newProgress)
        localStorage.setItem('catapult-game-progress', JSON.stringify(newProgress))
        console.log('✅ Capability mode unlocked!')
      }
    } finally {
      setIsRunningNormality(false)
    }
  }, [shots, gameProgress])

  const handleResetValidation = useCallback(() => {
    setValidationData(null)
    setShots([])
    setTotalScore(0)
    setConsecutiveHits(0)
  }, [])

  // CAPABILITY: Run capability analysis
  const handleRunCapabilityAnalysis = useCallback(() => {
    setIsRunningCapability(true)
    
    try {
      const shotDistances = shots.map(s => s.landingDistance)
      const mean = shotDistances.reduce((a, b) => a + b, 0) / shotDistances.length
      const variance = shotDistances.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / shotDistances.length
      const stdDev = Math.sqrt(variance)
      const analysis = performCapabilityAnalysis(shotDistances, mean, stdDev, capabilitySpecs)
      
      setCapabilityAnalysis(analysis)
      
      // Check for mode unlock
      if (analysis.indices.cpk !== null && analysis.indices.cpk >= 1.33 && !gameProgress.unlockedModes.includes('control')) {
        const newProgress: GameProgress = {
          ...gameProgress,
          unlockedModes: [...gameProgress.unlockedModes, 'control' as GameMode],
          completedModes: [...gameProgress.completedModes, 'capability' as GameMode]
        }
        setGameProgress(newProgress)
        localStorage.setItem('catapult-game-progress', JSON.stringify(newProgress))
        console.log('✅ Control mode unlocked!')
      }
    } finally {
      setIsRunningCapability(false)
    }
  }, [shots, capabilitySpecs, gameProgress])

  // CONTROL: Run control chart analysis
  const handleRunControlAnalysis = useCallback(() => {
    try {
      const shotDistances = shots.map(s => s.landingDistance)
      
      // Create subgroups
      const subgroups: Subgroup[] = []
      for (let i = 0; i < shotDistances.length; i += controlSubgroupSize) {
        const subgroupShots = shots.slice(i, i + controlSubgroupSize).map(s => ({
          id: s.id,
          distance: s.landingDistance
        }))
        if (subgroupShots.length === controlSubgroupSize) {
          subgroups.push(createSubgroup(subgroupShots, subgroups.length + 1))
        }
      }
      
      if (subgroups.length >= 2) {
        // Calculate control limits
        const chartData = createControlChartData(subgroups, controlSubgroupSize)
        
        // Run Nelson Rules (only if control limits exist)
        const analysis = chartData.controlLimits 
          ? performNelsonAnalysis(chartData.subgroups, chartData.controlLimits)
          : null
        
        setControlData({
          ...chartData,
          violations: analysis?.violations || []
        })
        setNelsonAnalysis(analysis)
        
        // Check for completion
        if (chartData.isStable && subgroups.length >= 20) {
          const newProgress: GameProgress = {
            ...gameProgress,
            completedModes: [...gameProgress.completedModes, 'control' as GameMode]
          }
          setGameProgress(newProgress)
          localStorage.setItem('catapult_progress', JSON.stringify(newProgress))
        }
      }
    } catch (error) {
      console.error('Error running control analysis:', error)
    }
  }, [shots, controlSubgroupSize, gameProgress])

  const handleResetControl = useCallback(() => {
    setControlData(null)
    setCurrentSubgroupShots([])
    setShots([])
    setTotalScore(0)
    setConsecutiveHits(0)
  }, [])

  // Get optimal settings from DOE for validation mode
  const getOptimalSettings = useCallback((): CatapultSettings => {
    if (isExperimentSetComplete(doeExperiments)) {
      const analysis = performDOEAnalysis(doeExperiments)
      return analysis.optimalSettings
    }
    return { angle: 45, force: 100, weight: 'medium' }
  }, [doeExperiments])

  // Calculate stats
  const stats = calculateGameStats(shots)

  // Get current experiment for DOE mode
  const currentDOEExperiment = gameMode === 'doe' 
    ? findExperimentBySettings(doeExperiments, settings)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Floating Rules Button */}
      <RulesButton
        gameRule={currentRules}
        variant="floating"
        position="top-right"
        size="md"
      />

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/games/catapult">
            <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Game Info
            </Button>
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                DOE Catapult Challenge
              </h1>
              <p className="text-gray-400">
                Master Design of Experiments through interactive gameplay
              </p>
            </div>

            {/* Stats Summary */}
            <div className="flex gap-4">
              <Card className="border-white/10 bg-slate-800/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-xs text-gray-400">Score</div>
                    <div className="text-lg font-bold text-white">
                      {formatScore(totalScore)}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="border-white/10 bg-slate-800/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <TargetIcon className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-400">Hits</div>
                    <div className="text-lg font-bold text-white">
                      {stats.successfulHits}/{stats.totalShots}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-slate-800/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-xs text-gray-400">Streak</div>
                    <div className="text-lg font-bold text-white">
                      {consecutiveHits}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector
            currentMode={gameMode}
            progress={gameProgress}
            onModeChange={handleModeChange}
            disabled={projectile?.isFlying || false}
          />
        </div>

        {/* Process Variation Educational Banner */}
        {(gameMode === 'validation' || gameMode === 'capability' || gameMode === 'control') && (
          <ProcessVariationBanner
            mode={gameMode}
            onDismiss={() => {}}
            onLearnMore={() => setShowVariationModal(true)}
          />
        )}

        {/* Main Game Area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-slate-800/50 p-4">
              <CatapultCanvas
                settings={settings}
                projectile={projectile}
                trajectory={trajectory}
                showPrediction={showPrediction}
              />
              
              {/* Status Bar */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {projectile?.isFlying && (
                    <Badge className="bg-green-500/20 text-green-400">
                      <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-400" />
                      In Flight
                    </Badge>
                  )}
                  {shots.length > 0 && !projectile?.isFlying && (
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-400">
                        Last shot: {formatDistance(shots[shots.length - 1].landingDistance)}
                        {shots[shots.length - 1].targetHit && (
                          <span className="ml-2 text-green-400">
                            ✓ Hit {shots[shots.length - 1].targetHit?.name}!
                          </span>
                        )}
                      </div>
                      {/* Variation Indicator for Validation/Capability/Control modes */}
                      {(gameMode === 'validation' || gameMode === 'capability' || gameMode === 'control') && (
                        <VariationIndicator
                          lastDistance={shots[shots.length - 1].landingDistance}
                          targetDistance={optimalDistance}
                          optimalDistance={optimalDistance}
                          compact
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Shot #{stats.totalShots + 1}
                </div>
              </div>
            </Card>

            {/* Validation Mode Analysis Panels */}
            {gameMode === 'validation' && validationData && (
              <div className="mt-6 space-y-6">
                <NormalityResults
                  andersonDarling={validationData.andersonDarling}
                  shapiroWilk={validationData.shapiroWilk}
                  kolmogorovSmirnov={validationData.kolmogorovSmirnov}
                  overallPassed={validationData.overallPassed}
                  recommendation={validationData.recommendation}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QQPlot data={validationData.qqPlot} />
                  <HistogramChart
                    data={shots.map(s => s.landingDistance)}
                    stats={validationData.descriptiveStats}
                    passed={validationData.overallPassed}
                  />
                </div>
                <DescriptiveStatsCard stats={validationData.descriptiveStats} />
              </div>
            )}

            {/* Capability Mode Analysis Panels */}
            {gameMode === 'capability' && capabilityAnalysis && (
              <div className="mt-6 space-y-6">
                <CapabilityResults analysis={capabilityAnalysis} />
                <ProcessCapabilityChart
                  data={shots.map(s => s.landingDistance)}
                  specs={capabilitySpecs}
                  analysis={capabilityAnalysis}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SigmaLevelCard analysis={capabilityAnalysis} />
                  <CapabilityInterpretation analysis={capabilityAnalysis} />
                </div>
              </div>
            )}

            {/* Control Mode Charts */}
            {gameMode === 'control' && controlData && (
              <div className="mt-6 space-y-6">
                <XBarChart
                  subgroups={controlData.subgroups}
                  controlLimits={controlData.controlLimits}
                  analysis={nelsonAnalysis}
                />
                <RChart
                  subgroups={controlData.subgroups}
                  controlLimits={controlData.controlLimits}
                  analysis={nelsonAnalysis}
                />
              </div>
            )}

            {/* Shot History - Only show in free play mode */}
            {gameMode === 'freeplay' && shots.length > 0 && (
              <Card className="mt-4 border-white/10 bg-slate-800/50 p-4">
                <h3 className="mb-3 font-bold text-white">Recent Shots</h3>
                <div className="space-y-2">
                  {shots.slice(-5).reverse().map((shot, index) => (
                    <div
                      key={shot.id}
                      className="flex items-center justify-between rounded-lg bg-slate-700/50 p-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">#{shots.length - index}</span>
                        <span className="text-gray-300">
                          {formatDistance(shot.landingDistance)}
                        </span>
                        {shot.targetHit ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            {shot.targetHit.name}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                            Miss
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold text-white">
                        +{formatScore(shot.score)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Controls Sidebar */}
          <div>
            {/* Conditional Controls based on game mode */}
            {gameMode === 'freeplay' && (
              <CatapultControls
                settings={settings}
                onSettingsChange={setSettings}
                onLaunch={handleLaunch}
                onReset={handleReset}
                isFlying={projectile?.isFlying || false}
                showPrediction={showPrediction}
                onPredictionToggle={() => setShowPrediction(prev => !prev)}
              />
            )}

            {gameMode === 'doe' && (
              <DOEControls
                experiments={doeExperiments}
                currentSettings={settings}
                onSettingsChange={setSettings}
                onLaunch={handleLaunch}
                onReset={handleDOEReset}
                onShowMatrix={() => setShowExperimentMatrix(true)}
                onExport={handleDOEExport}
                isFlying={projectile?.isFlying || false}
              />
            )}

            {gameMode === 'validation' && (
              <>
                <ValidationControls
                  shotCount={shots.length}
                  requiredShots={30}
                  optimalSettings={getOptimalSettings()}
                  onReset={handleResetValidation}
                  onAnalyze={handleRunNormalityTests}
                  canAnalyze={shots.length >= 30}
                  isAnalyzing={isRunningNormality}
                />
                <Card className="mt-4 border-white/10 bg-slate-800/50 p-4">
                  <Button
                    onClick={handleLaunch}
                    disabled={projectile?.isFlying || false}
                    className="w-full"
                    size="lg"
                  >
                    Launch Shot
                  </Button>
                </Card>
              </>
            )}

            {gameMode === 'capability' && (
              <>
                <CapabilityControls
                  specs={capabilitySpecs}
                  onSpecsChange={setCapabilitySpecs}
                  onAnalyze={handleRunCapabilityAnalysis}
                  canAnalyze={shots.length >= 30}
                  isAnalyzing={isRunningCapability}
                />
                <Card className="mt-4 border-white/10 bg-slate-800/50 p-4">
                  <Button
                    onClick={handleLaunch}
                    disabled={projectile?.isFlying || false}
                    className="w-full"
                    size="lg"
                  >
                    Launch Shot
                  </Button>
                </Card>
                {capabilityAnalysis && (
                  <div className="mt-4 space-y-4">
                    <CapabilityResults analysis={capabilityAnalysis} compact />
                    <SigmaLevelCard analysis={capabilityAnalysis} compact />
                  </div>
                )}
              </>
            )}

            {gameMode === 'control' && (
              <ControlModeControls
                subgroupSize={controlSubgroupSize}
                onSubgroupSizeChange={setControlSubgroupSize}
                currentSubgroupShots={currentSubgroupShots.length}
                totalSubgroups={Math.floor(shots.length / controlSubgroupSize)}
                hasControlLimits={controlData !== null}
                minimumSubgroupsNeeded={20}
                onCollectShot={handleLaunch}
                onAnalyze={handleRunControlAnalysis}
                onReset={handleResetControl}
                onExport={() => {}}
                isLaunching={projectile?.isFlying || false}
                canLaunch={!projectile?.isFlying}
                settings={settings}
              />
            )}

            {/* Process Variation Statistics Summary */}
            {(gameMode === 'validation' || gameMode === 'capability' || gameMode === 'control') && shots.length >= 5 && (
              <div className="mt-4">
                <VariationStatsSummary
                  shots={shots}
                />
              </div>
            )}

            {/* Quick Stats */}
            <Card className="mt-4 border-white/10 bg-slate-800/50 p-4">
              <h3 className="mb-3 font-bold text-white">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="font-medium text-white">
                    {stats.accuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Distance</span>
                  <span className="font-medium text-white">
                    {formatDistance(stats.bestDistance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Distance</span>
                  <span className="font-medium text-white">
                    {formatDistance(stats.averageDistance)}
                  </span>
                </div>
              </div>
            </Card>

            {/* DOE: Show Analysis Button when complete */}
            {gameMode === 'doe' && isExperimentSetComplete(doeExperiments) && (
              <Card className="mt-4 border-white/10 bg-green-500/10 p-4">
                <h3 className="mb-2 font-bold text-green-400">
                  🎉 All Experiments Complete!
                </h3>
                <p className="mb-3 text-sm text-gray-300">
                  Ready to analyze your results
                </p>
                <Button
                  onClick={() => setShowAnalysis(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  View Analysis
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Experiment Matrix Dialog */}
      <Dialog open={showExperimentMatrix} onOpenChange={setShowExperimentMatrix}>
        <DialogContent className="max-w-6xl bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-white">Experiment Matrix</DialogTitle>
          </DialogHeader>
          <ExperimentMatrix
            experiments={doeExperiments}
            currentExperiment={currentDOEExperiment}
            onLoadExperiment={(newSettings) => {
              setSettings(newSettings)
              setShowExperimentMatrix(false)
            }}
            onReset={handleDOEReset}
            onClose={() => setShowExperimentMatrix(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-y-auto bg-slate-900 p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">DOE Analysis</DialogTitle>
          </DialogHeader>
          <DOEAnalysis
            experiments={doeExperiments}
            onClose={() => setShowAnalysis(false)}
            onExport={handleDOEExport}
          />
        </DialogContent>
      </Dialog>

      {/* Game Rules Modal */}
      <GameRulesModal
        open={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        gameRule={currentRules}
        onStartGame={() => setShowRulesModal(false)}
      />

      {/* Mode Change Notification */}
      {showModeNotification && (
        <ModeRulesNotification
          gameId="catapult"
          mode={gameMode}
          modeRule={currentRules}
          onViewDetails={() => {
            setShowModeNotification(false)
            setShowRulesModal(true)
          }}
          position="bottom-right"
          autoHideDelay={10000}
        />
      )}

      {/* Process Variation Educational Modal */}
      {showVariationModal && (
        <Dialog open={showVariationModal} onOpenChange={setShowVariationModal}>
          <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Process Variation in Six Sigma</DialogTitle>
            </DialogHeader>
            {/* Modal content will be rendered by ProcessVariationBanner's Learn More */}
            <div className="space-y-4">
              <p className="text-gray-300">
                Process variation is the natural fluctuation that occurs in any real-world process.
                In this game, we simulate realistic manufacturing conditions where even with identical
                settings, each shot will have slight differences due to:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-300">
                <li><strong>Environmental factors:</strong> Temperature, humidity, air pressure</li>
                <li><strong>Material variation:</strong> Slight differences in weight, density</li>
                <li><strong>Equipment wear:</strong> Mechanical tolerances and drift</li>
                <li><strong>Human factors:</strong> Operator technique and consistency</li>
              </ul>
              <div className="rounded-lg bg-blue-500/10 p-4">
                <h4 className="mb-2 font-bold text-blue-400">Why This Matters for Six Sigma:</h4>
                <p className="text-sm text-gray-300">
                  Understanding and managing variation is the core of Six Sigma methodology.
                  By collecting data with process variation, you learn to:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-300">
                  <li>Distinguish between common cause and special cause variation</li>
                  <li>Use statistical tools to assess process capability</li>
                  <li>Make data-driven decisions about process improvement</li>
                  <li>Calculate meaningful metrics like Cp, Cpk, and Sigma Level</li>
                </ul>
              </div>
              <div className="rounded-lg bg-green-500/10 p-4">
                <h4 className="mb-2 font-bold text-green-400">In This Game:</h4>
                <p className="text-sm text-gray-300">
                  We apply ±2% standard deviation to simulate a typical Six Sigma process.
                  This means approximately 95% of shots will be within ±4% of the target distance,
                  representing a realistic, well-controlled manufacturing process.
                </p>
              </div>
              <Button
                onClick={() => setShowVariationModal(false)}
                className="w-full"
              >
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
