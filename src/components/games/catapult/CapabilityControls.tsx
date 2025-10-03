'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Gauge, 
  AlertCircle, 
  CheckCircle2,
  Info,
  Target,
  ArrowUpDown
} from 'lucide-react'
import type { SpecificationLimits } from '@/lib/games/catapult/capabilityCalculations'

// ============================================================================
// TYPES
// ============================================================================

interface CapabilityControlsProps {
  specs: SpecificationLimits
  onSpecsChange: (specs: SpecificationLimits) => void
  onAnalyze: () => void
  canAnalyze: boolean
  isAnalyzing?: boolean
  validationErrors?: string[]
}

// ============================================================================
// CAPABILITY CONTROLS COMPONENT
// ============================================================================

export function CapabilityControls({
  specs,
  onSpecsChange,
  onAnalyze,
  canAnalyze,
  isAnalyzing = false,
  validationErrors = []
}: CapabilityControlsProps) {
  const [localSpecs, setLocalSpecs] = useState(specs)

  const handleChange = (field: keyof SpecificationLimits, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    const newSpecs = { ...localSpecs, [field]: numValue }
    setLocalSpecs(newSpecs)
    onSpecsChange(newSpecs)
  }

  const isValid = validationErrors.length === 0
  const hasSpecs = localSpecs.lsl !== null || localSpecs.usl !== null

  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Process Capability Analysis</h3>
        </div>
        {hasSpecs && isValid && (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Ready
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="mb-6 text-sm text-gray-400">
        Define specification limits to assess if your process can consistently
        meet requirements. At least one limit (LSL or USL) must be defined.
      </p>

      {/* Specification Inputs */}
      <div className="mb-6 space-y-4">
        {/* Lower Specification Limit */}
        <div>
          <Label htmlFor="lsl" className="mb-2 flex items-center gap-2 text-sm text-gray-300">
            <ArrowUpDown className="h-4 w-4 text-red-400" />
            Lower Specification Limit (LSL)
          </Label>
          <div className="flex gap-2">
            <Input
              id="lsl"
              type="number"
              step="0.1"
              value={localSpecs.lsl ?? ''}
              onChange={(e) => handleChange('lsl', e.target.value)}
              placeholder="e.g., 150"
              className="bg-slate-700 border-white/10 text-white"
            />
            <span className="flex items-center text-sm text-gray-400">meters</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimum acceptable distance
          </p>
        </div>

        {/* Upper Specification Limit */}
        <div>
          <Label htmlFor="usl" className="mb-2 flex items-center gap-2 text-sm text-gray-300">
            <ArrowUpDown className="h-4 w-4 text-green-400" />
            Upper Specification Limit (USL)
          </Label>
          <div className="flex gap-2">
            <Input
              id="usl"
              type="number"
              step="0.1"
              value={localSpecs.usl ?? ''}
              onChange={(e) => handleChange('usl', e.target.value)}
              placeholder="e.g., 180"
              className="bg-slate-700 border-white/10 text-white"
            />
            <span className="flex items-center text-sm text-gray-400">meters</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Maximum acceptable distance
          </p>
        </div>

        {/* Target Value */}
        <div>
          <Label htmlFor="target" className="mb-2 flex items-center gap-2 text-sm text-gray-300">
            <Target className="h-4 w-4 text-blue-400" />
            Target Value (Optional)
          </Label>
          <div className="flex gap-2">
            <Input
              id="target"
              type="number"
              step="0.1"
              value={localSpecs.target ?? ''}
              onChange={(e) => handleChange('target', e.target.value)}
              placeholder="e.g., 165"
              className="bg-slate-700 border-white/10 text-white"
            />
            <span className="flex items-center text-sm text-gray-400">meters</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Ideal target (used for Cpm calculation)
          </p>
        </div>
      </div>

      {/* Specification Summary */}
      {hasSpecs && (
        <div className="mb-6 rounded-lg bg-slate-700/30 p-4">
          <div className="mb-2 text-sm font-medium text-gray-300">
            Specification Summary
          </div>
          <div className="space-y-1 text-sm">
            {localSpecs.lsl !== null && localSpecs.usl !== null && (
              <div className="text-gray-400">
                Tolerance: <span className="font-mono text-white">
                  {(localSpecs.usl - localSpecs.lsl).toFixed(1)}m
                </span>
              </div>
            )}
            {localSpecs.lsl !== null && localSpecs.usl !== null && (
              <div className="text-gray-400">
                Center: <span className="font-mono text-white">
                  {((localSpecs.lsl + localSpecs.usl) / 2).toFixed(1)}m
                </span>
              </div>
            )}
            {localSpecs.target !== null && (
              <div className="text-gray-400">
                Target: <span className="font-mono text-white">
                  {localSpecs.target.toFixed(1)}m
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-red-400">
                Validation Errors
              </div>
              <ul className="mt-2 space-y-1 text-xs text-red-300">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={onAnalyze}
        disabled={!canAnalyze || !isValid || isAnalyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Analyzing...
          </>
        ) : (
          <>
            <Gauge className="mr-2 h-4 w-4" />
            Run Capability Analysis
          </>
        )}
      </Button>

      {/* Info Box */}
      <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
        <div className="flex items-start gap-2 text-xs text-blue-400">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <strong>What&apos;s Next:</strong> Once you run the analysis,
            you&apos;ll see capability indices (Cp, Cpk, Pp, Ppk), sigma level,
            DPMO, and recommendations for process improvement based on Six Sigma
            standards.
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

interface CompactCapabilityControlsProps {
  specs: SpecificationLimits
  onAnalyze: () => void
  canAnalyze: boolean
}

export function CompactCapabilityControls({
  specs,
  onAnalyze,
  canAnalyze
}: CompactCapabilityControlsProps) {
  const hasSpecs = specs.lsl !== null || specs.usl !== null

  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          Capability Analysis
        </span>
        {hasSpecs && (
          <Badge className="bg-green-500/20 text-green-400 text-xs">
            Ready
          </Badge>
        )}
      </div>
      
      <div className="mb-3 space-y-2 text-sm">
        {specs.lsl !== null && (
          <div className="flex justify-between">
            <span className="text-gray-400">LSL:</span>
            <span className="font-mono text-white">{specs.lsl}m</span>
          </div>
        )}
        {specs.usl !== null && (
          <div className="flex justify-between">
            <span className="text-gray-400">USL:</span>
            <span className="font-mono text-white">{specs.usl}m</span>
          </div>
        )}
        {specs.target !== null && (
          <div className="flex justify-between">
            <span className="text-gray-400">Target:</span>
            <span className="font-mono text-white">{specs.target}m</span>
          </div>
        )}
      </div>
      
      <Button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        size="sm"
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Gauge className="mr-2 h-3 w-3" />
        Analyze
      </Button>
    </div>
  )
}
