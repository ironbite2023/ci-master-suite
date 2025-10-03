/**
 * Capability Results Component
 * Displays Cp, Cpk, Pp, Ppk, Cpm indices with color-coded ratings
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react'
import { CapabilityAnalysis } from '@/lib/games/catapult/capabilityCalculations'

// ============================================================================
// TYPES
// ============================================================================

interface CapabilityResultsProps {
  analysis: CapabilityAnalysis | null
  compact?: boolean
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRatingIcon(rating: 'excellent' | 'adequate' | 'marginal' | 'inadequate') {
  switch (rating) {
    case 'excellent':
      return <CheckCircle2 className="h-5 w-5" />
    case 'adequate':
      return <TrendingUp className="h-5 w-5" />
    case 'marginal':
      return <AlertTriangle className="h-5 w-5" />
    case 'inadequate':
      return <XCircle className="h-5 w-5" />
  }
}

function getRatingColor(rating: 'excellent' | 'adequate' | 'marginal' | 'inadequate'): string {
  switch (rating) {
    case 'excellent':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'adequate':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'marginal':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'inadequate':
      return 'text-red-600 bg-red-50 border-red-200'
  }
}

// ============================================================================
// INDEX CARD COMPONENT
// ============================================================================

interface IndexCardProps {
  label: string
  value: number
  description: string
  isPotential?: boolean
}

function IndexCard({ label, value, description, isPotential = false }: IndexCardProps) {
  return (
    <div className={`p-4 border rounded-lg ${isPotential ? 'bg-purple-50 border-purple-200' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {isPotential && (
          <Badge variant="secondary" className="text-xs">
            Potential
          </Badge>
        )}
      </div>
      <div className={`text-3xl font-bold ${isPotential ? 'text-purple-700' : 'text-blue-600'}`}>
        {value.toFixed(2)}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CapabilityResults({
  analysis,
  compact = false
}: CapabilityResultsProps) {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No capability analysis available yet.</p>
          <p className="text-sm mt-2">Define specifications and collect data to analyze capability.</p>
        </div>
      </Card>
    )
  }

  const { indices, rating } = analysis

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">Capability</span>
          <Badge className={getRatingColor(rating.rating as 'excellent' | 'adequate' | 'marginal' | 'inadequate')}>
            {rating.rating.toUpperCase()}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Cp:</span>
            <span className="font-bold ml-2">{(indices.cp || 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Cpk:</span>
            <span className="font-bold ml-2">{(indices.cpk || 0).toFixed(2)}</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-xl flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Process Capability Indices
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Measures of how well your process meets specifications
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${getRatingColor(rating.rating as 'excellent' | 'adequate' | 'marginal' | 'inadequate')}`}>
          <div className="flex items-center gap-2 mb-1">
            {getRatingIcon(rating.rating as 'excellent' | 'adequate' | 'marginal' | 'inadequate')}
            <span className="font-bold text-lg">{rating.rating.toUpperCase()}</span>
          </div>
          <p className="text-xs">{rating.description}</p>
        </div>
      </div>

      {/* Short-Term Capability (Cp, Cpk) */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Short-Term Capability (Within-Subgroup)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <IndexCard
            label="Cp (Potential Capability)"
            value={indices.cp || 0}
            description="Process potential if perfectly centered"
          />
          <IndexCard
            label="Cpk (Actual Capability)"
            value={indices.cpk || 0}
            description="Actual capability considering centering"
          />
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>Short-term:</strong> Uses within-subgroup variation (R̄/d₂). 
            Shows inherent process capability without special causes.
          </p>
        </div>
      </div>

      {/* Long-Term Performance (Pp, Ppk) */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Long-Term Performance (Overall)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <IndexCard
            label="Pp (Potential Performance)"
            value={indices.pp || 0}
            description="Overall potential if centered"
            isPotential
          />
          <IndexCard
            label="Ppk (Actual Performance)"
            value={indices.ppk || 0}
            description="Overall performance with centering"
            isPotential
          />
        </div>
        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-900">
            <strong>Long-term:</strong> Uses overall variation (sample std dev). 
            Includes all sources of variation over time.
          </p>
        </div>
      </div>

      {/* Additional Index (Cpm) */}
      {indices.cpm !== null && (
        <div>
          <h4 className="font-semibold text-sm mb-3">Taguchi Index (Cpm)</h4>
          <IndexCard
            label="Cpm (Capability around Target)"
            value={indices.cpm || 0}
            description="Penalizes deviation from target value"
          />
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-900">
              <strong>Taguchi Index:</strong> Considers both variation and deviation from target. 
              Lower values indicate process is off-target or has high variation.
            </p>
          </div>
        </div>
      )}

      {/* Interpretation Guide */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-sm mb-3">Quick Reference:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span><strong>≥ 1.67:</strong> Excellent capability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span><strong>1.33 - 1.67:</strong> Adequate capability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span><strong>1.00 - 1.33:</strong> Marginal capability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span><strong>&lt; 1.00:</strong> Inadequate capability</span>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2">
          💡 Key Insight:
        </p>
        <p className="text-sm text-blue-800">
          {rating.recommendation}
        </p>
      </div>
    </Card>
  )
}
