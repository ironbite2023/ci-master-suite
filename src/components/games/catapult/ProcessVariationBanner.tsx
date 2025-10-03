/**
 * Process Variation Banner
 * Educational banner explaining why variation exists in Validation/Capability/Control modes
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, TrendingUp, Info, Zap } from 'lucide-react'
import { GameMode } from '@/types/catapult'

// ============================================================================
// TYPES
// ============================================================================

interface ProcessVariationBannerProps {
  mode: GameMode
  onDismiss: () => void
  onLearnMore: () => void
}

interface ModeContent {
  title: string
  description: string
  keyPoints: string[]
  color: string
  icon: React.ReactNode
}

// ============================================================================
// CONTENT BY MODE
// ============================================================================

const MODE_CONTENT: Record<string, ModeContent> = {
  validation: {
    title: 'Validation Mode - Understanding Process Variation',
    description: 'Real-world processes ALWAYS have variation, even with "optimal settings"! This game simulates realistic 2% process variation to teach you:',
    keyPoints: [
      'How to collect variation data',
      'How to test if variation is normal',
      'Why Six Sigma focuses on reducing variation'
    ],
    color: 'green',
    icon: <TrendingUp className="h-5 w-5" />
  },
  capability: {
    title: 'Capability Mode - Measuring Process Spread',
    description: 'Process capability measures whether your variation fits within specification limits. This mode uses realistic 2% variation to teach you:',
    keyPoints: [
      'How process spread affects capability (Cp/Cpk)',
      'Why centering AND variation both matter',
      'How to achieve Six Sigma quality levels'
    ],
    color: 'orange',
    icon: <Zap className="h-5 w-5" />
  },
  control: {
    title: 'Control Mode - Monitoring Process Stability',
    description: 'Control charts detect when variation changes over time. This mode uses realistic 2% variation to teach you:',
    keyPoints: [
      'How to monitor variation with control charts',
      'How to distinguish normal vs abnormal patterns',
      'Why maintaining low variation is critical'
    ],
    color: 'red',
    icon: <TrendingUp className="h-5 w-5" />
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProcessVariationBanner({
  mode,
  onDismiss,
  onLearnMore
}: ProcessVariationBannerProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has seen this banner for this mode
    const seen = localStorage.getItem(`variation-banner-${mode}`)
    if (!seen) {
      setShow(true)
    }
  }, [mode])

  const handleDismiss = () => {
    localStorage.setItem(`variation-banner-${mode}`, 'true')
    setShow(false)
    onDismiss()
  }

  if (!show || !MODE_CONTENT[mode]) return null

  const content = MODE_CONTENT[mode]

  return (
    <div className="mb-6 animate-in slide-in-from-top duration-300">
      <Card className={`border-2 border-${content.color}-200 bg-${content.color}-50/50 p-4`}
        style={{
          borderColor: content.color === 'green' ? '#86efac' : 
                      content.color === 'orange' ? '#fdba74' : '#fca5a5',
          backgroundColor: content.color === 'green' ? 'rgba(220, 252, 231, 0.5)' : 
                          content.color === 'orange' ? 'rgba(254, 243, 199, 0.5)' : 'rgba(254, 226, 226, 0.5)'
        }}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg bg-${content.color}-100`}
            style={{
              backgroundColor: content.color === 'green' ? '#dcfce7' : 
                              content.color === 'orange' ? '#fed7aa' : '#fecaca'
            }}
          >
            {content.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900">
                {content.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                Educational Mode
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-3">
              {content.description}
            </p>

            {/* Key Points */}
            <div className="space-y-1.5 mb-4">
              {content.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`mt-0.5 h-1.5 w-1.5 rounded-full bg-${content.color}-500 flex-shrink-0`}
                    style={{
                      backgroundColor: content.color === 'green' ? '#22c55e' : 
                                      content.color === 'orange' ? '#f97316' : '#ef4444'
                    }}
                  />
                  <span className="text-sm text-gray-700">{point}</span>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Watch your shots vary around the target - this is normal and realistic!
              </p>
              <p className="text-xs text-gray-600">
                <strong>Process Variation:</strong> Material inconsistencies (±1-2%), environmental factors (±0.5-1%), 
                equipment wear (±1%), operator variation (±2-3%). <strong>Your simulated process: ±2% (Well-controlled!)</strong>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                onClick={onLearnMore}
                className={`bg-${content.color}-600 hover:bg-${content.color}-700 text-white`}
                style={{
                  backgroundColor: content.color === 'green' ? '#16a34a' : 
                                  content.color === 'orange' ? '#ea580c' : '#dc2626'
                }}
              >
                <Info className="mr-2 h-4 w-4" />
                Why Does This Happen?
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
              >
                Got it!
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface CompactVariationBannerProps {
  mode: GameMode
  onLearnMore: () => void
}

export function CompactVariationBanner({ mode, onLearnMore }: CompactVariationBannerProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(`variation-banner-compact-${mode}`)
    if (!seen) {
      setShow(true)
    }
  }, [mode])

  const handleDismiss = () => {
    localStorage.setItem(`variation-banner-compact-${mode}`, 'true')
    setShow(false)
  }

  if (!show || !MODE_CONTENT[mode]) return null

  return (
    <Card className="p-3 bg-blue-50 border-blue-200 mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-900">
            <strong>Process Variation:</strong> Your shots will vary ±2% (realistic simulation)
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onLearnMore} className="text-xs">
            Learn Why
          </Button>
          <button onClick={handleDismiss} className="text-blue-600 hover:text-blue-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// EXPORT
// ============================================================================

export default ProcessVariationBanner
