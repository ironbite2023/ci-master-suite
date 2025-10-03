'use client'

import { useRef, useEffect, useState } from 'react'
import type {
  CatapultSettings,
  Projectile,
  TrajectoryPoint,
  TargetZone
} from '@/types/catapult'
import { TARGET_ZONES, PHYSICS_CONSTANTS } from '@/types/catapult'
import { metersToPixels } from '@/lib/games/catapult/physics'

// ============================================================================
// TYPES
// ============================================================================

interface CatapultCanvasProps {
  settings: CatapultSettings
  projectile: Projectile | null
  trajectory?: TrajectoryPoint[]
  showPrediction?: boolean
  onCanvasReady?: () => void
  className?: string
}

// ============================================================================
// CATAPULT CANVAS COMPONENT
// ============================================================================

export function CatapultCanvas({
  settings,
  projectile,
  trajectory = [],
  showPrediction = true,
  onCanvasReady,
  className = ''
}: CatapultCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })

  // Update canvas dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement
        if (parent) {
          const width = parent.clientWidth
          const height = Math.min(500, width * 0.5) // 2:1 aspect ratio
          setDimensions({ width, height })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Notify parent when canvas is ready
  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady()
    }
  }, [onCanvasReady])

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate scale (fit 400m into canvas width with padding)
      const padding = 40
      const scale = (canvas.width - padding * 2) / PHYSICS_CONSTANTS.MAX_DISTANCE
      const groundY = canvas.height - 60

      // Draw background
      drawBackground(ctx, canvas.width, canvas.height, groundY)

      // Draw target zones
      drawTargets(ctx, TARGET_ZONES, scale, padding, groundY)

      // Draw trajectory prediction
      if (showPrediction && trajectory.length > 0 && !projectile?.isFlying) {
        drawTrajectoryPrediction(ctx, trajectory, scale, padding, groundY)
      }

      // Draw catapult
      drawCatapult(ctx, settings, padding, groundY, scale)

      // Draw projectile
      if (projectile) {
        drawProjectile(ctx, projectile, scale, padding, groundY)
        
        // Draw actual trajectory while flying
        if (projectile.isFlying && trajectory.length > 0) {
          drawActualTrajectory(ctx, trajectory, scale, padding, groundY)
        }
      }

      // Draw distance markers
      drawDistanceMarkers(ctx, scale, padding, groundY, canvas.width)

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [settings, projectile, trajectory, showPrediction, dimensions])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`rounded-lg border border-white/10 bg-gradient-to-b from-sky-900 to-slate-900 ${className}`}
    />
  )
}

// ============================================================================
// DRAWING FUNCTIONS
// ============================================================================

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  groundY: number
) {
  // Ground
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, groundY, width, height - groundY)
  
  // Ground line
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(width, groundY)
  ctx.stroke()
}

function drawCatapult(
  ctx: CanvasRenderingContext2D,
  settings: CatapultSettings,
  offsetX: number,
  groundY: number,
  scale: number
) {
  const catapultX = offsetX
  const catapultY = groundY - metersToPixels(PHYSICS_CONSTANTS.CATAPULT_HEIGHT, scale)
  
  // Base
  ctx.fillStyle = '#8b4513'
  ctx.fillRect(catapultX - 15, groundY - 30, 30, 30)
  
  // Arm
  const armLength = 40
  const angle = (settings.angle * Math.PI) / 180
  const armEndX = catapultX + Math.cos(angle) * armLength
  const armEndY = catapultY - Math.sin(angle) * armLength
  
  ctx.strokeStyle = '#654321'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(catapultX, catapultY)
  ctx.lineTo(armEndX, armEndY)
  ctx.stroke()
  
  // Pivot
  ctx.fillStyle = '#4b5563'
  ctx.beginPath()
  ctx.arc(catapultX, catapultY, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // Basket
  ctx.fillStyle = '#92400e'
  ctx.beginPath()
  ctx.arc(armEndX, armEndY, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Angle indicator
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(catapultX, catapultY, 25, -angle, 0)
  ctx.stroke()
  ctx.setLineDash([])
  
  // Angle label
  ctx.fillStyle = '#60a5fa'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${settings.angle}°`, catapultX, catapultY + 45)
}

function drawTargets(
  ctx: CanvasRenderingContext2D,
  targets: TargetZone[],
  scale: number,
  offsetX: number,
  groundY: number
) {
  targets.forEach(target => {
    const centerX = offsetX + metersToPixels(target.distance, scale)
    const width = metersToPixels(target.width, scale)
    const height = 60
    
    // Target zone
    ctx.fillStyle = target.color + '30'
    ctx.strokeStyle = target.color
    ctx.lineWidth = 2
    ctx.fillRect(centerX - width / 2, groundY - height, width, height)
    ctx.strokeRect(centerX - width / 2, groundY - height, width, height)
    
    // Bullseye
    if (target.hasBullseye && target.bullseyeRadius) {
      const bullseyeWidth = metersToPixels(target.bullseyeRadius * 2, scale)
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(centerX - bullseyeWidth / 2, groundY - height, bullseyeWidth, height)
    }
    
    // Label
    ctx.fillStyle = target.color
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(target.name, centerX, groundY + 15)
    ctx.font = '10px sans-serif'
    ctx.fillText(`${target.points} pts`, centerX, groundY + 28)
  })
}

function drawProjectile(
  ctx: CanvasRenderingContext2D,
  projectile: Projectile,
  scale: number,
  offsetX: number,
  groundY: number
) {
  const x = offsetX + metersToPixels(projectile.x, scale)
  const y = groundY - metersToPixels(projectile.y, scale)
  const radius = metersToPixels(projectile.radius, scale)
  
  // Shadow
  if (projectile.isFlying) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(x, groundY - 5, radius, radius * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Projectile
  const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius)
  gradient.addColorStop(0, '#94a3b8')
  gradient.addColorStop(1, '#475569')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  
  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.beginPath()
  ctx.arc(x - radius/3, y - radius/3, radius/3, 0, Math.PI * 2)
  ctx.fill()
}

function drawTrajectoryPrediction(
  ctx: CanvasRenderingContext2D,
  trajectory: TrajectoryPoint[],
  scale: number,
  offsetX: number,
  groundY: number
) {
  if (trajectory.length === 0) return
  
  ctx.strokeStyle = '#60a5fa'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.globalAlpha = 0.5
  
  ctx.beginPath()
  trajectory.forEach((point, i) => {
    const x = offsetX + metersToPixels(point.x, scale)
    const y = groundY - metersToPixels(point.y, scale)
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  ctx.setLineDash([])
  ctx.globalAlpha = 1
  
  // Landing marker
  if (trajectory.length > 0) {
    const last = trajectory[trajectory.length - 1]
    const x = offsetX + metersToPixels(last.x, scale)
    
    ctx.fillStyle = '#60a5fa'
    ctx.beginPath()
    ctx.moveTo(x, groundY - 10)
    ctx.lineTo(x - 5, groundY)
    ctx.lineTo(x + 5, groundY)
    ctx.fill()
  }
}

function drawActualTrajectory(
  ctx: CanvasRenderingContext2D,
  trajectory: TrajectoryPoint[],
  scale: number,
  offsetX: number,
  groundY: number
) {
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.7
  
  ctx.beginPath()
  trajectory.forEach((point, i) => {
    const x = offsetX + metersToPixels(point.x, scale)
    const y = groundY - metersToPixels(point.y, scale)
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  ctx.globalAlpha = 1
}

function drawDistanceMarkers(
  ctx: CanvasRenderingContext2D,
  scale: number,
  offsetX: number,
  groundY: number,
  canvasWidth: number
) {
  ctx.strokeStyle = '#475569'
  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'center'
  ctx.lineWidth = 1
  
  // Draw markers every 50m
  for (let distance = 0; distance <= PHYSICS_CONSTANTS.MAX_DISTANCE; distance += 50) {
    const x = offsetX + metersToPixels(distance, scale)
    
    if (x > canvasWidth - 20) break
    
    // Tick mark
    ctx.beginPath()
    ctx.moveTo(x, groundY)
    ctx.lineTo(x, groundY + 5)
    ctx.stroke()
    
    // Label
    if (distance > 0) {
      ctx.fillText(`${distance}m`, x, groundY + 18)
    }
  }
}
