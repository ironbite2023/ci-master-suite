/**
 * Capability Interpretation Component
 * Provides actionable insights and recommendations based on capability analysis
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react'
import { CapabilityAnalysis } from '@/lib/games/catapult/capabilityCalculations'

// ============================================================================
// TYPES
// ============================================================================

interface CapabilityInterpretationProps {
  analysis: CapabilityAnalysis | null
  compact?: boolean
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  icon: React.ReactNode
  title: string
  description: string
  action: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateRecommendations(analysis: CapabilityAnalysis): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { indices } = analysis

  // Check centering
  const isCentered = Math.abs((indices.cp || 0) - (indices.cpk || 0)) < 0.1
  if (!isCentered) {
    recommendations.push({
      priority: 'high',
      icon: <Target className="h-5 w-5" />,
      title: 'Process is Off-Center',
      description: `Your process mean is not aligned with the target. Cp (${(indices.cp || 0).toFixed(2)}) is higher than Cpk (${(indices.cpk || 0).toFixed(2)}), indicating the process is shifted.`,
      action: 'Adjust settings to center the process on the target value.'
    })
  }

  // Check short vs long term
  const hasShift = Math.abs((indices.cp || 0) - (indices.pp || 0)) > 0.2
  if (hasShift) {
    recommendations.push({
      priority: 'medium',
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Process Drift Detected',
      description: `Short-term capability (Cp: ${(indices.cp || 0).toFixed(2)}) differs from long-term performance (Pp: ${(indices.pp || 0).toFixed(2)}). This suggests process drift over time.`,
      action: 'Investigate special causes of variation. Implement process controls.'
    })
  }

  // Check overall capability
  if ((indices.cpk || 0) < 1.0) {
    recommendations.push({
      priority: 'high',
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Inadequate Process Capability',
      description: `Cpk of ${(indices.cpk || 0).toFixed(2)} means the process cannot consistently meet specifications. Significant defects are expected.`,
      action: 'Reduce variation through process improvements or widen specifications if possible.'
    })
  } else if ((indices.cpk || 0) < 1.33) {
    recommendations.push({
      priority: 'medium',
      icon: <Settings className="h-5 w-5" />,
      title: 'Marginal Capability',
      description: `Cpk of ${(indices.cpk || 0).toFixed(2)} indicates the process is barely capable. Some defects may occur.`,
      action: 'Focus on reducing variation and improving process centering.'
    })
  }

  // Check if excellent
  if ((indices.cpk || 0) >= 1.67 && isCentered) {
    recommendations.push({
      priority: 'low',
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: 'Excellent Capability Achieved',
      description: `Cpk of ${(indices.cpk || 0).toFixed(2)} indicates world-class capability. The process is well-centered and consistent.`,
      action: 'Maintain current process controls. Document best practices.'
    })
  }

  // Check Taguchi index
  if (indices.cpm !== null && (indices.cpm || 0) < (indices.cpk || 0)) {
    recommendations.push({
      priority: 'medium',
      icon: <Target className="h-5 w-5" />,
      title: 'Deviation from Target',
      description: `Cpm (${(indices.cpm || 0).toFixed(2)}) is lower than Cpk (${(indices.cpk || 0).toFixed(2)}), indicating significant deviation from the target value.`,
      action: 'Focus on hitting the target, not just staying within specifications.'
    })
  }

  return recommendations
}

function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
  }
}

function getPriorityBadge(priority: 'high' | 'medium' | 'low') {
  const colors = {
    high: 'bg-red-500 text-white',
    medium: 'bg-amber-500 text-white',
    low: 'bg-green-500 text-white'
  }
  
  return (
    <Badge className={colors[priority]}>
      {priority.toUpperCase()}
    </Badge>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CapabilityInterpretation({
  analysis,
  compact = false
}: CapabilityInterpretationProps) {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No interpretation available</p>
        </div>
      </Card>
    )
  }

  const recommendations = generateRecommendations(analysis)
  const highPriority = recommendations.filter(r => r.priority === 'high')
  const mediumPriority = recommendations.filter(r => r.priority === 'medium')
  const lowPriority = recommendations.filter(r => r.priority === 'low')

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <span className="font-semibold">Key Insights</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {analysis.interpretation}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-600" />
            Capability Interpretation & Recommendations
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Actionable insights to improve your process
          </p>
        </div>
        <div className="flex gap-2">
          {highPriority.length > 0 && (
            <Badge className="bg-red-500 text-white">
              {highPriority.length} High Priority
            </Badge>
          )}
          {mediumPriority.length > 0 && (
            <Badge className="bg-amber-500 text-white">
              {mediumPriority.length} Medium
            </Badge>
          )}
        </div>
      </div>

      {/* Overall Interpretation */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Overall Assessment:</h4>
            <p className="text-sm text-blue-800">{analysis.interpretation}</p>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Recommendations ({recommendations.length}):</h4>

        {/* High Priority */}
        {highPriority.map((rec, idx) => (
          <div
            key={`high-${idx}`}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {rec.icon}
                <h5 className="font-semibold">{rec.title}</h5>
              </div>
              {getPriorityBadge(rec.priority)}
            </div>
            <p className="text-sm mb-2">{rec.description}</p>
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-current opacity-70">
              <span className="text-xs font-semibold">Action:</span>
              <span className="text-xs">{rec.action}</span>
            </div>
          </div>
        ))}

        {/* Medium Priority */}
        {mediumPriority.map((rec, idx) => (
          <div
            key={`medium-${idx}`}
            className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {rec.icon}
                <h5 className="font-semibold">{rec.title}</h5>
              </div>
              {getPriorityBadge(rec.priority)}
            </div>
            <p className="text-sm mb-2">{rec.description}</p>
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-current opacity-70">
              <span className="text-xs font-semibold">Action:</span>
              <span className="text-xs">{rec.action}</span>
            </div>
          </div>
        ))}

        {/* Low Priority */}
        {lowPriority.map((rec, idx) => (
          <div
            key={`low-${idx}`}
            className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {rec.icon}
                <h5 className="font-semibold">{rec.title}</h5>
              </div>
              {getPriorityBadge(rec.priority)}
            </div>
            <p className="text-sm mb-2">{rec.description}</p>
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-current opacity-70">
              <span className="text-xs font-semibold">Action:</span>
              <span className="text-xs">{rec.action}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Next Steps:
        </h4>
        <ol className="space-y-2 text-sm text-purple-800 list-decimal list-inside">
          <li>Address high-priority recommendations immediately</li>
          <li>Implement process controls to monitor stability</li>
          <li>Collect more data to verify improvements</li>
          <li>Re-run capability analysis after changes</li>
          {(analysis.indices.cpk || 0) >= 1.33 && (
            <li>Document best practices and standardize the process</li>
          )}
        </ol>
      </div>

      {/* Educational Note */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-700">
          <strong>Remember:</strong> Process capability analysis is most meaningful when the process 
          is in statistical control (stable). If control chart analysis shows instability, address 
          special causes before focusing on capability improvement.
        </p>
      </div>
    </Card>
  )
}
