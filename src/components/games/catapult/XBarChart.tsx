/**
 * X-bar Control Chart Component
 * Displays process mean over time with control limits and Nelson Rules violations
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer
} from 'recharts'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { Subgroup, ControlLimits } from '@/lib/games/catapult/controlCharts'
import { NelsonAnalysis } from '@/lib/games/catapult/nelsonRules'

// ============================================================================
// TYPES
// ============================================================================

interface XBarChartProps {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  analysis: NelsonAnalysis | null
  height?: number
  showSigmaZones?: boolean
  showLegend?: boolean
}

interface ChartDataPoint {
  subgroupNumber: number
  mean: number
  hasViolation: boolean
  violationSeverity?: 'high' | 'medium' | 'low'
  violationRule?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get violation info for a subgroup
 */
function getViolationInfo(
  subgroupIndex: number,
  analysis: NelsonAnalysis | null
): { hasViolation: boolean; severity?: 'high' | 'medium' | 'low'; rule?: string } {
  if (!analysis) return { hasViolation: false }

  const violations = analysis.violations.filter(v => v.subgroupIndex === subgroupIndex)
  if (violations.length === 0) return { hasViolation: false }

  // Get most severe violation
  const highSeverity = violations.find(v => v.severity === 'high')
  if (highSeverity) {
    return { hasViolation: true, severity: 'high', rule: highSeverity.rule }
  }

  const mediumSeverity = violations.find(v => v.severity === 'medium')
  if (mediumSeverity) {
    return { hasViolation: true, severity: 'medium', rule: mediumSeverity.rule }
  }

  return { hasViolation: true, severity: 'low', rule: violations[0].rule }
}

/**
 * Get color for point based on violation severity
 */
function getPointColor(severity?: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high':
      return '#ef4444' // red-500
    case 'medium':
      return '#f59e0b' // amber-500
    case 'low':
      return '#eab308' // yellow-500
    default:
      return '#3b82f6' // blue-500
  }
}

// ============================================================================
// CUSTOM DOT COMPONENT
// ============================================================================

interface CustomDotProps {
  cx?: number
  cy?: number
  payload?: ChartDataPoint
}

function CustomDot({ cx, cy, payload }: CustomDotProps) {
  if (!cx || !cy || !payload) return null

  const color = getPointColor(payload.violationSeverity)
  const size = payload.hasViolation ? 8 : 6

  return (
    <>
      <circle cx={cx} cy={cy} r={size} fill={color} stroke="white" strokeWidth={2} />
      {payload.hasViolation && (
        <circle cx={cx} cy={cy} r={size + 3} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
      )}
    </>
  )
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: ChartDataPoint
  }>
  controlLimits?: ControlLimits | null
}

function CustomTooltip({ active, payload, controlLimits }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <Card className="p-3 shadow-lg border-2">
      <div className="space-y-2">
        <div className="font-semibold text-sm border-b pb-1">
          Subgroup #{data.subgroupNumber}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Mean (x̄):</span>
            <span className="font-mono font-semibold">{data.mean.toFixed(2)} m</span>
          </div>
          
          {controlLimits && (
            <>
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>UCL:</span>
                <span className="font-mono">{controlLimits.xBarUCL.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>CL:</span>
                <span className="font-mono">{controlLimits.xBarCL.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>LCL:</span>
                <span className="font-mono">{controlLimits.xBarLCL.toFixed(2)} m</span>
              </div>
            </>
          )}
        </div>

        {data.hasViolation && (
          <div className={`mt-2 pt-2 border-t text-xs ${
            data.violationSeverity === 'high' ? 'text-red-600' :
            data.violationSeverity === 'medium' ? 'text-amber-600' :
            'text-yellow-600'
          }`}>
            <div className="flex items-center gap-1 font-semibold">
              <AlertTriangle className="h-3 w-3" />
              {data.violationRule}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function XBarChart({
  subgroups,
  controlLimits,
  analysis,
  height = 400,
  showSigmaZones = true,
  showLegend = true
}: XBarChartProps) {
  // Prepare chart data
  const chartData: ChartDataPoint[] = subgroups.map((sg, index) => {
    const violationInfo = getViolationInfo(index, analysis)
    return {
      subgroupNumber: sg.subgroupNumber,
      mean: sg.mean,
      hasViolation: violationInfo.hasViolation,
      violationSeverity: violationInfo.severity,
      violationRule: violationInfo.rule
    }
  })

  // Calculate Y-axis domain
  const allMeans = subgroups.map(sg => sg.mean)
  const minMean = Math.min(...allMeans)
  const maxMean = Math.max(...allMeans)
  const padding = (maxMean - minMean) * 0.2 || 5

  let yMin = minMean - padding
  let yMax = maxMean + padding

  if (controlLimits) {
    yMin = Math.min(yMin, controlLimits.xBarLCL - padding)
    yMax = Math.max(yMax, controlLimits.xBarUCL + padding)
  }

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            X-bar Chart (Process Mean)
            <Info className="h-4 w-4 text-muted-foreground" />
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitors whether the process average is stable over time
          </p>
        </div>

        {analysis && (
          <Badge
            variant={analysis.isStable ? 'default' : 'destructive'}
            className="text-sm"
          >
            {analysis.isStable ? (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                In Control
              </>
            ) : (
              <>
                <AlertTriangle className="mr-1 h-4 w-4" />
                Out of Control
              </>
            )}
          </Badge>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            dataKey="subgroupNumber"
            label={{ value: 'Subgroup Number', position: 'insideBottom', offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          
          <YAxis
            domain={[yMin, yMax]}
            label={{ value: 'Mean Distance (meters)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip controlLimits={controlLimits} />} />

          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          )}

          {/* Sigma Zones (Background) */}
          {controlLimits && showSigmaZones && (
            <>
              {/* 3σ zone (lightest) */}
              <ReferenceArea
                y1={controlLimits.xBarCL + controlLimits.xBar2Sigma}
                y2={controlLimits.xBarUCL}
                fill="#fef3c7"
                fillOpacity={0.3}
              />
              <ReferenceArea
                y1={controlLimits.xBarLCL}
                y2={controlLimits.xBarCL - controlLimits.xBar2Sigma}
                fill="#fef3c7"
                fillOpacity={0.3}
              />

              {/* 2σ zone (medium) */}
              <ReferenceArea
                y1={controlLimits.xBarCL + controlLimits.xBar1Sigma}
                y2={controlLimits.xBarCL + controlLimits.xBar2Sigma}
                fill="#fef3c7"
                fillOpacity={0.2}
              />
              <ReferenceArea
                y1={controlLimits.xBarCL - controlLimits.xBar2Sigma}
                y2={controlLimits.xBarCL - controlLimits.xBar1Sigma}
                fill="#fef3c7"
                fillOpacity={0.2}
              />

              {/* 1σ zone (center, lightest) */}
              <ReferenceArea
                y1={controlLimits.xBarCL - controlLimits.xBar1Sigma}
                y2={controlLimits.xBarCL + controlLimits.xBar1Sigma}
                fill="#dbeafe"
                fillOpacity={0.2}
              />
            </>
          )}

          {/* Control Limits */}
          {controlLimits && (
            <>
              <ReferenceLine
                y={controlLimits.xBarUCL}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'UCL', position: 'right', fill: '#ef4444', fontSize: 12 }}
              />
              <ReferenceLine
                y={controlLimits.xBarCL}
                stroke="#3b82f6"
                strokeWidth={2}
                label={{ value: 'CL (X̿)', position: 'right', fill: '#3b82f6', fontSize: 12 }}
              />
              <ReferenceLine
                y={controlLimits.xBarLCL}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'LCL', position: 'right', fill: '#ef4444', fontSize: 12 }}
              />
            </>
          )}

          {/* Data Line */}
          <Line
            type="monotone"
            dataKey="mean"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={<CustomDot />}
            name="Subgroup Mean"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Statistics Summary */}
      {controlLimits && (
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">UCL</div>
            <div className="font-semibold text-sm">{controlLimits.xBarUCL.toFixed(2)} m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Grand Mean (X̿)</div>
            <div className="font-semibold text-sm text-blue-600">{controlLimits.xBarCL.toFixed(2)} m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">LCL</div>
            <div className="font-semibold text-sm">{controlLimits.xBarLCL.toFixed(2)} m</div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {subgroups.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No data collected yet. Start launching shots to see the X-bar chart.</p>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface CompactXBarChartProps {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  analysis: NelsonAnalysis | null
  height?: number
}

export function CompactXBarChart({
  subgroups,
  controlLimits,
  analysis,
  height = 200
}: CompactXBarChartProps) {
  const chartData: ChartDataPoint[] = subgroups.map((sg, index) => {
    const violationInfo = getViolationInfo(index, analysis)
    return {
      subgroupNumber: sg.subgroupNumber,
      mean: sg.mean,
      hasViolation: violationInfo.hasViolation,
      violationSeverity: violationInfo.severity,
      violationRule: violationInfo.rule
    }
  })

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="subgroupNumber" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          
          {controlLimits && (
            <>
              <ReferenceLine y={controlLimits.xBarUCL} stroke="#ef4444" strokeDasharray="3 3" />
              <ReferenceLine y={controlLimits.xBarCL} stroke="#3b82f6" />
              <ReferenceLine y={controlLimits.xBarLCL} stroke="#ef4444" strokeDasharray="3 3" />
            </>
          )}

          <Line
            type="monotone"
            dataKey="mean"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={<CustomDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
