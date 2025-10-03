/**
 * Control Chart Summary Component
 * Overall dashboard with process statistics and stability assessment
 */

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  BarChart3,
  Download,
  Share2
} from 'lucide-react'
import {
  Subgroup,
  ControlLimits,
  calculateProcessStatistics,
  ProcessStatistics
} from '@/lib/games/catapult/controlCharts'
import {
  NelsonAnalysis,
  generateEducationalInsights
} from '@/lib/games/catapult/nelsonRules'

// ============================================================================
// TYPES
// ============================================================================

interface ControlChartSummaryProps {
  subgroups: Subgroup[]
  subgroupSize: number
  controlLimits: ControlLimits | null
  analysis: NelsonAnalysis | null
  onExportSummary?: () => void
  onShare?: () => void
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ControlChartSummary({
  subgroups,
  subgroupSize,
  controlLimits,
  analysis,
  onExportSummary,
  onShare
}: ControlChartSummaryProps) {
  // Calculate process statistics
  const stats: ProcessStatistics | null = subgroups.length > 0
    ? calculateProcessStatistics(subgroups, subgroupSize)
    : null

  // Generate insights
  const insights = analysis ? generateEducationalInsights(analysis) : []

  // Calculate completion percentage
  const completionPercentage = Math.min((subgroups.length / 20) * 100, 100)

  return (
    <div className="space-y-4">
      {/* Overall Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-2xl mb-1">Process Status</h3>
            <p className="text-sm text-muted-foreground">
              Control Phase Summary
            </p>
          </div>
          {analysis && (
            <div className={`p-3 rounded-full ${
              analysis.isStable ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {analysis.isStable ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
            </div>
          )}
        </div>

        {analysis ? (
          <div className={`p-4 rounded-lg border-2 ${
            analysis.isStable
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-semibold text-lg ${
              analysis.isStable ? 'text-green-900' : 'text-red-900'
            }`}>
              {analysis.summary}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
            <p className="font-semibold text-blue-900">
              Collect {20 - subgroups.length} more subgroup{20 - subgroups.length !== 1 ? 's' : ''} to calculate control limits
            </p>
            <Progress value={completionPercentage} className="mt-2 h-2" />
          </div>
        )}
      </Card>

      {/* Process Statistics Grid */}
      {stats && controlLimits && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Process Statistics
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* X-bar Statistics */}
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="text-xs text-blue-700 mb-1 font-medium">Grand Mean (X̿)</div>
              <div className="text-2xl font-bold text-blue-900">
                {stats.grandMean.toFixed(2)} m
              </div>
              <div className="text-xs text-blue-600 mt-1">Process Center</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1 font-medium">UCL</div>
              <div className="text-2xl font-bold">
                {controlLimits.xBarUCL.toFixed(2)} m
              </div>
              <div className="text-xs text-muted-foreground mt-1">Upper Limit</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1 font-medium">LCL</div>
              <div className="text-2xl font-bold">
                {controlLimits.xBarLCL.toFixed(2)} m
              </div>
              <div className="text-xs text-muted-foreground mt-1">Lower Limit</div>
            </div>

            {/* R Statistics */}
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="text-xs text-green-700 mb-1 font-medium">Average Range (R̄)</div>
              <div className="text-2xl font-bold text-green-900">
                {stats.rBar.toFixed(2)} m
              </div>
              <div className="text-xs text-green-600 mt-1">Process Variation</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1 font-medium">Process Std Dev (σ)</div>
              <div className="text-2xl font-bold">
                {stats.processStdDev.toFixed(2)} m
              </div>
              <div className="text-xs text-muted-foreground mt-1">Estimated</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1 font-medium">Overall Range</div>
              <div className="text-2xl font-bold">
                {stats.overallRange.toFixed(2)} m
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.minValue.toFixed(1)} - {stats.maxValue.toFixed(1)} m
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Violations Summary */}
      {analysis && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Violations Summary
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 border rounded-lg text-center">
              <div className="text-3xl font-bold">{analysis.totalViolations}</div>
              <div className="text-xs text-muted-foreground mt-1">Total</div>
            </div>
            <div className="p-3 border rounded-lg text-center border-red-200 bg-red-50">
              <div className="text-3xl font-bold text-red-600">{analysis.highSeverityCount}</div>
              <div className="text-xs text-red-700 mt-1">High</div>
            </div>
            <div className="p-3 border rounded-lg text-center border-amber-200 bg-amber-50">
              <div className="text-3xl font-bold text-amber-600">{analysis.mediumSeverityCount}</div>
              <div className="text-xs text-amber-700 mt-1">Medium</div>
            </div>
            <div className="p-3 border rounded-lg text-center border-yellow-200 bg-yellow-50">
              <div className="text-3xl font-bold text-yellow-600">{analysis.lowSeverityCount}</div>
              <div className="text-xs text-yellow-700 mt-1">Low</div>
            </div>
          </div>
        </Card>
      )}

      {/* Educational Insights */}
      {insights.length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-900">
            <TrendingUp className="h-5 w-5" />
            Key Insights & Next Steps
          </h3>
          
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                <span className="font-semibold mt-0.5">{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {onExportSummary && (
          <Button onClick={onExportSummary} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        )}
        {onShare && (
          <Button onClick={onShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        )}
      </div>

      {/* Next Steps Card */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h3 className="font-semibold text-lg mb-3 text-purple-900">
          🎯 What&apos;s Next?
        </h3>
        
        {analysis?.isStable ? (
          <div className="space-y-2 text-sm text-purple-800">
            <p className="font-semibold">✅ Your process is stable! You can now:</p>
            <ul className="space-y-1 ml-4">
              <li>• Proceed to Capability Analysis to assess if the process meets specifications</li>
              <li>• Use this stable baseline for process improvement initiatives</li>
              <li>• Continue monitoring to maintain control</li>
              <li>• Document these control limits as your process baseline</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-purple-800">
            <p className="font-semibold">⚠️ Process needs stabilization first:</p>
            <ul className="space-y-1 ml-4">
              <li>• Investigate and eliminate special causes of variation</li>
              <li>• Address high-severity violations immediately</li>
              <li>• Re-collect data after corrective actions</li>
              <li>• Capability analysis requires a stable process</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  )
}
