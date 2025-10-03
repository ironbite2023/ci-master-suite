'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FlaskConical, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Target,
  TrendingUp
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface ValidationControlsProps {
  shotCount: number
  requiredShots: number
  optimalSettings: {
    angle: number
    force: number
    weight: string
  }
  onReset: () => void
  onAnalyze: () => void
  canAnalyze: boolean
  isAnalyzing?: boolean
}

// ============================================================================
// VALIDATION CONTROLS COMPONENT
// ============================================================================

export function ValidationControls({
  shotCount,
  requiredShots,
  optimalSettings,
  onReset,
  onAnalyze,
  canAnalyze,
  isAnalyzing = false
}: ValidationControlsProps) {
  const progress = Math.min((shotCount / requiredShots) * 100, 100)
  const remaining = Math.max(requiredShots - shotCount, 0)
  const isComplete = shotCount >= requiredShots

  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Validation Study</h3>
        </div>
        {isComplete && (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Ready to Analyze
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-400">
        Collect shots at the optimal settings from DOE to validate that the
        process produces normally distributed results.
      </p>

      {/* Optimal Settings Display */}
      <div className="mb-6 rounded-lg bg-slate-700/30 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
          <Target className="h-4 w-4" />
          <span>Optimal Settings (from DOE)</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-500">Angle</div>
            <div className="text-lg font-bold text-white">
              {optimalSettings.angle}°
            </div>
          </div>
          <div className="text-gray-600">•</div>
          <div>
            <div className="text-xs text-gray-500">Force</div>
            <div className="text-lg font-bold text-white">
              {optimalSettings.force}N
            </div>
          </div>
          <div className="text-gray-600">•</div>
          <div>
            <div className="text-xs text-gray-500">Weight</div>
            <div className="text-lg font-bold capitalize text-white">
              {optimalSettings.weight}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-white">
            Data Collection Progress
          </span>
          <span className="text-sm text-gray-400">
            {shotCount} / {requiredShots} shots
          </span>
        </div>
        
        <Progress 
          value={progress} 
          className="h-3 bg-slate-700"
        />
        
        {!isComplete && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>
              Collect {remaining} more shot{remaining !== 1 ? 's' : ''} before analysis
            </span>
          </div>
        )}

        {isComplete && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Minimum sample size achieved!</span>
          </div>
        )}
      </div>

      {/* Statistics Hint */}
      {shotCount > 0 && !isComplete && (
        <div className="mb-4 rounded-lg bg-blue-500/10 p-3 text-sm text-blue-400">
          <div className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <strong>Pro Tip:</strong> For reliable normality testing, aim for
              at least 30 data points. The more data you collect, the more
              accurate your analysis will be.
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <FlaskConical className="mr-2 h-4 w-4" />
              Run Normality Tests
            </>
          )}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="border-white/10 hover:bg-slate-700/50"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Info Box */}
      <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
        <div className="text-xs text-blue-400">
          <strong>What&apos;s Next:</strong> Once you run the analysis,
          you&apos;ll see three normality tests (Anderson-Darling, Shapiro-Wilk,
          Kolmogorov-Smirnov) plus Q-Q plots and descriptive statistics to
          validate your process.
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

interface CompactValidationControlsProps {
  shotCount: number
  requiredShots: number
  onAnalyze: () => void
  canAnalyze: boolean
}

export function CompactValidationControls({
  shotCount,
  requiredShots,
  onAnalyze,
  canAnalyze
}: CompactValidationControlsProps) {
  const progress = Math.min((shotCount / requiredShots) * 100, 100)
  const isComplete = shotCount >= requiredShots

  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          Validation Study
        </span>
        <span className="text-xs text-gray-400">
          {shotCount}/{requiredShots}
        </span>
      </div>
      
      <Progress value={progress} className="mb-3 h-2 bg-slate-700" />
      
      <Button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        size="sm"
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        <FlaskConical className="mr-2 h-3 w-3" />
        {isComplete ? 'Analyze' : `Need ${requiredShots - shotCount} more`}
      </Button>
    </div>
  )
}
