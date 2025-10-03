'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Howl, Howler } from 'howler'

// ============================================================================
// AUDIO TYPES
// ============================================================================

export interface AudioConfig {
  volume?: number // 0-1
  muted?: boolean
  backgroundMusic?: boolean
  soundEffects?: boolean
}

export interface SoundEffect {
  key: string
  src: string
  volume?: number
  loop?: boolean
  sprite?: Record<string, [number, number]> // For sprite sheets: { name: [start, duration] }
}

export interface UseGameAudioReturn {
  // State
  isMuted: boolean
  volume: number
  isBackgroundMusicPlaying: boolean
  currentTrack: string | null
  
  // Controls
  playSound: (soundKey: string, options?: { volume?: number; loop?: boolean }) => void
  stopSound: (soundKey: string) => void
  playBackgroundMusic: (trackKey: string) => void
  stopBackgroundMusic: () => void
  pauseBackgroundMusic: () => void
  resumeBackgroundMusic: () => void
  
  // Settings
  setVolume: (volume: number) => void
  toggleMute: () => void
  setMuted: (muted: boolean) => void
  preloadSounds: (sounds: SoundEffect[]) => Promise<void>
  unloadSounds: () => void
}

// ============================================================================
// DEFAULT SOUND LIBRARY
// ============================================================================

const DEFAULT_SOUNDS: Record<string, SoundEffect> = {
  // UI Sounds
  click: {
    key: 'click',
    src: '/sounds/ui/click.mp3',
    volume: 0.5
  },
  hover: {
    key: 'hover',
    src: '/sounds/ui/hover.mp3',
    volume: 0.3
  },
  success: {
    key: 'success',
    src: '/sounds/ui/success.mp3',
    volume: 0.6
  },
  error: {
    key: 'error',
    src: '/sounds/ui/error.mp3',
    volume: 0.6
  },
  
  // Game Sounds
  achievement: {
    key: 'achievement',
    src: '/sounds/game/achievement.mp3',
    volume: 0.8
  },
  levelUp: {
    key: 'levelUp',
    src: '/sounds/game/level-up.mp3',
    volume: 0.7
  },
  countdown: {
    key: 'countdown',
    src: '/sounds/game/countdown.mp3',
    volume: 0.6
  },
  gameStart: {
    key: 'gameStart',
    src: '/sounds/game/game-start.mp3',
    volume: 0.7
  },
  gameComplete: {
    key: 'gameComplete',
    src: '/sounds/game/game-complete.mp3',
    volume: 0.8
  },
  
  // Catapult Sounds
  catapultLoad: {
    key: 'catapultLoad',
    src: '/sounds/catapult/load.mp3',
    volume: 0.6
  },
  catapultFire: {
    key: 'catapultFire',
    src: '/sounds/catapult/fire.mp3',
    volume: 0.8
  },
  projectileWhoosh: {
    key: 'projectileWhoosh',
    src: '/sounds/catapult/whoosh.mp3',
    volume: 0.5
  },
  targetHit: {
    key: 'targetHit',
    src: '/sounds/catapult/hit.mp3',
    volume: 0.7
  },
  targetMiss: {
    key: 'targetMiss',
    src: '/sounds/catapult/miss.mp3',
    volume: 0.4
  }
}

// ============================================================================
// USEGAMEAUDIO HOOK
// ============================================================================

export function useGameAudio(config: AudioConfig = {}): UseGameAudioReturn {
  const {
    volume: initialVolume = 0.7,
    muted: initialMuted = false,
    backgroundMusic: enableBackgroundMusic = true,
    soundEffects: enableSoundEffects = true
  } = config
  
  // State
  const [isMuted, setIsMuted] = useState(initialMuted)
  const [volume, setVolumeState] = useState(initialVolume)
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  
  // Refs to store Howl instances
  const soundsRef = useRef<Map<string, Howl>>(new Map())
  const backgroundMusicRef = useRef<Howl | null>(null)
  const previousVolumeRef = useRef<number>(initialVolume)
  
  // ============================================================================
  // INITIALIZE
  // ============================================================================
  
  useEffect(() => {
    // Set global volume
    Howler.volume(isMuted ? 0 : volume)
    
    // Load default sounds on mount
    if (enableSoundEffects) {
      Object.values(DEFAULT_SOUNDS).forEach(sound => {
        if (!sound.key.startsWith('bg_')) { // Don't preload background music
          loadSound(sound)
        }
      })
    }
    
    // Cleanup on unmount
    return () => {
      unloadSounds()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // ============================================================================
  // UPDATE GLOBAL VOLUME
  // ============================================================================
  
  useEffect(() => {
    Howler.volume(isMuted ? 0 : volume)
  }, [isMuted, volume])
  
  // ============================================================================
  // LOAD SOUND
  // ============================================================================
  
  const loadSound = useCallback((sound: SoundEffect) => {
    if (soundsRef.current.has(sound.key)) return // Already loaded
    
    const howl = new Howl({
      src: [sound.src],
      volume: sound.volume ?? 1,
      loop: sound.loop ?? false,
      sprite: sound.sprite,
      preload: true,
      html5: false, // Use Web Audio API for better performance
      onloaderror: (id, error) => {
        console.error(`Failed to load sound: ${sound.key}`, error)
      }
    })
    
    soundsRef.current.set(sound.key, howl)
  }, [])
  
  // ============================================================================
  // PRELOAD SOUNDS
  // ============================================================================
  
  const preloadSounds = useCallback(async (sounds: SoundEffect[]) => {
    const loadPromises = sounds.map(sound => {
      return new Promise<void>((resolve, reject) => {
        if (soundsRef.current.has(sound.key)) {
          resolve()
          return
        }
        
        const howl = new Howl({
          src: [sound.src],
          volume: sound.volume ?? 1,
          loop: sound.loop ?? false,
          sprite: sound.sprite,
          preload: true,
          html5: false,
          onload: () => {
            soundsRef.current.set(sound.key, howl)
            resolve()
          },
          onloaderror: (_id, error) => {
            console.error(`Failed to load sound: ${sound.key}`, error)
            reject(error)
          }
        })
      })
    })
    
    try {
      await Promise.all(loadPromises)
    } catch (error) {
      console.error('Some sounds failed to load', error)
    }
  }, [])
  
  // ============================================================================
  // PLAY SOUND
  // ============================================================================
  
  const playSound = useCallback((
    soundKey: string,
    options?: { volume?: number; loop?: boolean }
  ) => {
    if (!enableSoundEffects || isMuted) return
    
    let sound = soundsRef.current.get(soundKey)
    
    // If sound not loaded, try to load from defaults
    if (!sound && DEFAULT_SOUNDS[soundKey]) {
      loadSound(DEFAULT_SOUNDS[soundKey])
      sound = soundsRef.current.get(soundKey)
    }
    
    if (!sound) {
      console.warn(`Sound not found: ${soundKey}`)
      return
    }
    
    // Stop any currently playing instance of this sound
    sound.stop()
    
    // Set options
    if (options?.volume !== undefined) {
      sound.volume(options.volume)
    }
    if (options?.loop !== undefined) {
      sound.loop(options.loop)
    }
    
    // Play
    sound.play()
  }, [enableSoundEffects, isMuted, loadSound])
  
  // ============================================================================
  // STOP SOUND
  // ============================================================================
  
  const stopSound = useCallback((soundKey: string) => {
    const sound = soundsRef.current.get(soundKey)
    if (sound) {
      sound.stop()
    }
  }, [])
  
  // ============================================================================
  // PLAY BACKGROUND MUSIC
  // ============================================================================
  
  const playBackgroundMusic = useCallback((trackKey: string) => {
    if (!enableBackgroundMusic || isMuted) return
    
    // Stop current track if playing
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop()
      backgroundMusicRef.current.unload()
    }
    
    // Check if track exists in default sounds or refs
    let track = soundsRef.current.get(trackKey)
    
    if (!track) {
      // Create new background music track
      const trackSrc = `/sounds/music/${trackKey}.mp3`
      
      track = new Howl({
        src: [trackSrc],
        volume: volume * 0.3, // Background music is quieter
        loop: true,
        html5: true, // Use HTML5 Audio for streaming
        preload: true,
        onloaderror: (_id, error) => {
          console.error(`Failed to load background music: ${trackKey}`, error)
        }
      })
      
      soundsRef.current.set(trackKey, track)
    }
    
    backgroundMusicRef.current = track
    
    // Fade in
    track.volume(0)
    track.play()
    track.fade(0, volume * 0.3, 2000) // 2 second fade in
    
    setCurrentTrack(trackKey)
    setIsBackgroundMusicPlaying(true)
  }, [enableBackgroundMusic, isMuted, volume])
  
  // ============================================================================
  // STOP BACKGROUND MUSIC
  // ============================================================================
  
  const stopBackgroundMusic = useCallback(() => {
    if (!backgroundMusicRef.current) return
    
    const track = backgroundMusicRef.current
    
    // Fade out
    track.fade(track.volume(), 0, 1000) // 1 second fade out
    
    setTimeout(() => {
      track.stop()
      setIsBackgroundMusicPlaying(false)
      setCurrentTrack(null)
    }, 1000)
  }, [])
  
  // ============================================================================
  // PAUSE BACKGROUND MUSIC
  // ============================================================================
  
  const pauseBackgroundMusic = useCallback(() => {
    if (!backgroundMusicRef.current) return
    
    backgroundMusicRef.current.pause()
    setIsBackgroundMusicPlaying(false)
  }, [])
  
  // ============================================================================
  // RESUME BACKGROUND MUSIC
  // ============================================================================
  
  const resumeBackgroundMusic = useCallback(() => {
    if (!backgroundMusicRef.current) return
    
    backgroundMusicRef.current.play()
    setIsBackgroundMusicPlaying(true)
  }, [])
  
  // ============================================================================
  // SET VOLUME
  // ============================================================================
  
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    previousVolumeRef.current = clampedVolume
    
    // Update background music volume
    if (backgroundMusicRef.current && isBackgroundMusicPlaying) {
      backgroundMusicRef.current.volume(clampedVolume * 0.3)
    }
  }, [isBackgroundMusicPlaying])
  
  // ============================================================================
  // TOGGLE MUTE
  // ============================================================================
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])
  
  // ============================================================================
  // SET MUTED
  // ============================================================================
  
  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted)
  }, [])
  
  // ============================================================================
  // UNLOAD SOUNDS
  // ============================================================================
  
  const unloadSounds = useCallback(() => {
    // Stop and unload all sounds
    soundsRef.current.forEach(sound => {
      sound.stop()
      sound.unload()
    })
    soundsRef.current.clear()
    
    // Stop background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop()
      backgroundMusicRef.current.unload()
      backgroundMusicRef.current = null
    }
    
    setIsBackgroundMusicPlaying(false)
    setCurrentTrack(null)
  }, [])
  
  // ============================================================================
  // RETURN HOOK API
  // ============================================================================
  
  return {
    // State
    isMuted,
    volume,
    isBackgroundMusicPlaying,
    currentTrack,
    
    // Controls
    playSound,
    stopSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    
    // Settings
    setVolume,
    toggleMute,
    setMuted,
    preloadSounds,
    unloadSounds
  }
}

// ============================================================================
// HELPER: Get all available sound keys
// ============================================================================

export function getAvailableSounds(): string[] {
  return Object.keys(DEFAULT_SOUNDS)
}

// ============================================================================
// HELPER: Create custom sound effect
// ============================================================================

export function createSoundEffect(
  key: string,
  src: string,
  options?: { volume?: number; loop?: boolean }
): SoundEffect {
  return {
    key,
    src,
    volume: options?.volume ?? 0.7,
    loop: options?.loop ?? false
  }
}
