'use client'

import { useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'

// ============================================================================
// VISUAL EFFECTS TYPES
// ============================================================================

export interface ConfettiOptions {
  particleCount?: number
  angle?: number
  spread?: number
  startVelocity?: number
  decay?: number
  gravity?: number
  drift?: number
  ticks?: number
  origin?: { x: number; y: number }
  colors?: string[]
  shapes?: ('square' | 'circle')[]
  scalar?: number
  zIndex?: number
  disableForReducedMotion?: boolean
}

export interface ParticleOptions {
  count?: number
  duration?: number
  colors?: string[]
  size?: { min: number; max: number }
  velocity?: { min: number; max: number }
  gravity?: number
}

export interface ShakeOptions {
  duration?: number
  intensity?: number
  frequency?: number
}

export interface FlashOptions {
  duration?: number
  color?: string
  opacity?: number
}

export interface GlowOptions {
  duration?: number
  color?: string
  intensity?: number
}

export interface UseGameVisualsReturn {
  // Confetti effects
  fireConfetti: (options?: ConfettiOptions) => void
  fireworksEffect: () => void
  celebrationEffect: () => void
  rainEffect: (duration?: number) => void
  burstEffect: (x: number, y: number) => void
  
  // Screen effects
  shakeScreen: (options?: ShakeOptions) => void
  flashScreen: (options?: FlashOptions) => void
  
  // Element effects
  glowElement: (elementId: string, options?: GlowOptions) => void
  pulseElement: (elementId: string, duration?: number) => void
  bounceElement: (elementId: string) => void
  
  // Particle effects
  createParticles: (x: number, y: number, options?: ParticleOptions) => void
  
  // Cleanup
  stopAllEffects: () => void
}

// ============================================================================
// USEGAMEVISUALS HOOK
// ============================================================================

export function useGameVisuals(): UseGameVisualsReturn {
  const activeEffectsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  
  // ============================================================================
  // CONFETTI EFFECTS
  // ============================================================================
  
  const fireConfetti = useCallback((options: ConfettiOptions = {}) => {
    const defaults: ConfettiOptions = {
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      disableForReducedMotion: true
    }
    
    confetti({
      ...defaults,
      ...options
    })
  }, [])
  
  const fireworksEffect = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 }
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      
      if (timeLeft <= 0) {
        clearInterval(interval)
        activeEffectsRef.current.delete(interval)
        return
      }
      
      const particleCount = 50 * (timeLeft / duration)
      
      // Random positions
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        }
      })
    }, 250)
    
    activeEffectsRef.current.add(interval)
  }, [])
  
  const celebrationEffect = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 999
    }
    
    // Fire from both sides
    confetti({
      ...defaults,
      particleCount: count,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 }
    })
    
    confetti({
      ...defaults,
      particleCount: count,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 }
    })
    
    // Center burst
    confetti({
      particleCount: count / 2,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
      zIndex: 999
    })
  }, [])
  
  const rainEffect = useCallback((duration: number = 5000) => {
    const animationEnd = Date.now() + duration
    
    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval)
        activeEffectsRef.current.delete(interval)
        return
      }
      
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 45,
        origin: { x: Math.random(), y: 0 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 20,
        zIndex: 999
      })
    }, 50)
    
    activeEffectsRef.current.add(interval)
  }, [])
  
  const burstEffect = useCallback((x: number, y: number) => {
    confetti({
      particleCount: 50,
      spread: 360,
      origin: { x, y },
      colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
      ticks: 100,
      gravity: 0.8,
      decay: 0.95,
      startVelocity: 25,
      zIndex: 999
    })
  }, [])
  
  // ============================================================================
  // SCREEN EFFECTS
  // ============================================================================
  
  const shakeScreen = useCallback((options: ShakeOptions = {}) => {
    const {
      duration = 500,
      intensity = 10,
      frequency = 50
    } = options
    
    const originalTransform = document.body.style.transform || ''
    const startTime = Date.now()
    
    const shake = () => {
      const elapsed = Date.now() - startTime
      
      if (elapsed >= duration) {
        document.body.style.transform = originalTransform
        return
      }
      
      const progress = elapsed / duration
      const currentIntensity = intensity * (1 - progress) // Decay over time
      
      const x = (Math.random() - 0.5) * currentIntensity * 2
      const y = (Math.random() - 0.5) * currentIntensity * 2
      const rotation = (Math.random() - 0.5) * 2
      
      document.body.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`
      
      const timeout = setTimeout(shake, frequency)
      activeEffectsRef.current.add(timeout)
    }
    
    shake()
  }, [])
  
  const flashScreen = useCallback((options: FlashOptions = {}) => {
    const {
      duration = 300,
      color = '#ffffff',
      opacity = 0.7
    } = options
    
    // Create flash overlay
    const flash = document.createElement('div')
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${color};
      opacity: ${opacity};
      pointer-events: none;
      z-index: 9999;
      transition: opacity ${duration}ms ease-out;
    `
    
    document.body.appendChild(flash)
    
    // Fade out
    requestAnimationFrame(() => {
      flash.style.opacity = '0'
    })
    
    // Remove after animation
    const timeout = setTimeout(() => {
      document.body.removeChild(flash)
      activeEffectsRef.current.delete(timeout)
    }, duration)
    
    activeEffectsRef.current.add(timeout)
  }, [])
  
  // ============================================================================
  // ELEMENT EFFECTS
  // ============================================================================
  
  const glowElement = useCallback((elementId: string, options: GlowOptions = {}) => {
    const {
      duration = 1000,
      color = '#00ff00',
      intensity = 20
    } = options
    
    const element = document.getElementById(elementId)
    if (!element) return
    
    const originalBoxShadow = element.style.boxShadow || ''
    
    // Add glow
    element.style.transition = `box-shadow ${duration / 2}ms ease-in-out`
    element.style.boxShadow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`
    
    // Remove glow
    const timeout = setTimeout(() => {
      element.style.boxShadow = originalBoxShadow
      
      // Clean up transition after effect
      setTimeout(() => {
        element.style.transition = ''
        activeEffectsRef.current.delete(timeout)
      }, duration / 2)
    }, duration / 2)
    
    activeEffectsRef.current.add(timeout)
  }, [])
  
  const pulseElement = useCallback((elementId: string, duration: number = 1000) => {
    const element = document.getElementById(elementId)
    if (!element) return
    
    const originalTransform = element.style.transform || ''
    const originalTransition = element.style.transition || ''
    
    // Pulse animation
    element.style.transition = `transform ${duration / 2}ms ease-in-out`
    element.style.transform = 'scale(1.2)'
    
    const timeout = setTimeout(() => {
      element.style.transform = originalTransform
      
      setTimeout(() => {
        element.style.transition = originalTransition
        activeEffectsRef.current.delete(timeout)
      }, duration / 2)
    }, duration / 2)
    
    activeEffectsRef.current.add(timeout)
  }, [])
  
  const bounceElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (!element) return
    
    const keyframes = [
      { transform: 'translateY(0px)', offset: 0 },
      { transform: 'translateY(-20px)', offset: 0.25 },
      { transform: 'translateY(0px)', offset: 0.5 },
      { transform: 'translateY(-10px)', offset: 0.75 },
      { transform: 'translateY(0px)', offset: 1 }
    ]
    
    const options = {
      duration: 600,
      easing: 'ease-in-out'
    }
    
    element.animate(keyframes, options)
  }, [])
  
  // ============================================================================
  // PARTICLE EFFECTS
  // ============================================================================
  
  const createParticles = useCallback((
    x: number,
    y: number,
    options: ParticleOptions = {}
  ) => {
    const {
      count = 20,
      duration = 1000,
      colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      size = { min: 4, max: 8 },
      velocity = { min: 2, max: 5 },
      gravity = 0.5
    } = options
    
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
    `
    document.body.appendChild(container)
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      const particleSize = Math.random() * (size.max - size.min) + size.min
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * (velocity.max - velocity.min) + velocity.min
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background-color: ${color};
        border-radius: 50%;
        pointer-events: none;
      `
      
      container.appendChild(particle)
      
      // Animate particle
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed
      let currentX = x
      let currentY = y
      let currentVY = vy
      let opacity = 1
      
      const animate = () => {
        currentX += vx
        currentY += currentVY
        currentVY += gravity
        opacity -= 1 / (duration / 16) // Fade out over duration
        
        particle.style.left = `${currentX}px`
        particle.style.top = `${currentY}px`
        particle.style.opacity = `${Math.max(0, opacity)}`
        
        if (opacity > 0) {
          requestAnimationFrame(animate)
        } else {
          particle.remove()
        }
      }
      
      animate()
    }
    
    // Remove container after all particles are gone
    const timeout = setTimeout(() => {
      container.remove()
      activeEffectsRef.current.delete(timeout)
    }, duration)
    
    activeEffectsRef.current.add(timeout)
  }, [])
  
  // ============================================================================
  // CLEANUP
  // ============================================================================
  
  const stopAllEffects = useCallback(() => {
    // Clear all active timeouts
    activeEffectsRef.current.forEach(timeout => {
      clearTimeout(timeout)
    })
    activeEffectsRef.current.clear()
    
    // Reset body transform
    document.body.style.transform = ''
    
    // Remove any effect overlays
    document.querySelectorAll('[data-effect-overlay]').forEach(el => el.remove())
  }, [])
  
  // ============================================================================
  // RETURN HOOK API
  // ============================================================================
  
  return {
    // Confetti effects
    fireConfetti,
    fireworksEffect,
    celebrationEffect,
    rainEffect,
    burstEffect,
    
    // Screen effects
    shakeScreen,
    flashScreen,
    
    // Element effects
    glowElement,
    pulseElement,
    bounceElement,
    
    // Particle effects
    createParticles,
    
    // Cleanup
    stopAllEffects
  }
}

// ============================================================================
// PRESET EFFECTS FOR COMMON GAME EVENTS
// ============================================================================

export const PRESET_EFFECTS = {
  achievement: {
    confetti: {
      particleCount: 100,
      spread: 70,
      colors: ['#ffd700', '#ff8c00', '#ff4500']
    },
    glow: {
      color: '#ffd700',
      intensity: 30,
      duration: 1500
    }
  },
  
  victory: {
    confetti: {
      particleCount: 150,
      spread: 120,
      colors: ['#00ff00', '#ffff00', '#ff00ff']
    },
    flash: {
      color: '#ffff00',
      opacity: 0.3,
      duration: 500
    }
  },
  
  defeat: {
    flash: {
      color: '#ff0000',
      opacity: 0.5,
      duration: 400
    },
    shake: {
      intensity: 15,
      duration: 600
    }
  },
  
  levelUp: {
    confetti: {
      particleCount: 75,
      spread: 60,
      colors: ['#00ffff', '#ff00ff', '#ffff00']
    },
    glow: {
      color: '#00ffff',
      intensity: 25,
      duration: 1200
    }
  },
  
  perfectScore: {
    fireworks: true,
    flash: {
      color: '#ffffff',
      opacity: 0.5,
      duration: 300
    }
  },
  
  error: {
    shake: {
      intensity: 8,
      duration: 300
    },
    flash: {
      color: '#ff0000',
      opacity: 0.2,
      duration: 200
    }
  }
}
