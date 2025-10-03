/**
 * R Chart (Range Chart) Component
 * Displays process variation over time with control limits
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
  ResponsiveContainer
} from 'recharts'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { Subgroup, ControlLimits } from '@/lib/games/catapult/controlCharts'
import { NelsonAnalysis } from '@/lib/games/catapult/nelsonRules'

// ============================================================================
// TYPES
// ============================================================================

interface RChartProps {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  analysis: NelsonAnalysis | null
  height?: number
  showLegend?: boolean
}

interface ChartDataPoint {
  subgroupNumber: number
  range: number
  hasViolation: boolean
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if subgroup has range chart violations
 */
function hasRangeViolation(
  subgroupIndex: number,
  analysis: NelsonAnalysis | null
): boolean {
  if (!analysis) return false
  return analysis.violations.some(
    v => v.subgroupIndex === subgroupIndex && v.chart === 'range'
  )
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

  const color = payload.hasViolation ? '#ef4444' : '#10b981' // red or green
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
            <span className="text-muted-foreground">Range (R):</span>
            <span className="font-mono font-semibold">{data.range.toFixed(2)} m</span>
          </div>
          
          {controlLimits && (
            <>
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>UCL:</span>
                <span className="font-mono">{controlLimits.rBarUCL.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>R̄:</span>
                <span className="font-mono">{controlLimits.rBarCL.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>LCL:</span>
                <span className="font-mono">{controlLimits.rBarLCL.toFixed(2)} m</span>
              </div>
            </>
          )}
        </div>

        {data.hasViolation && (
          <div className="mt-2 pt-2 border-t text-xs text-red-600">
            <div className="flex items-center gap-1 font-semibold">
              <AlertTriangle className="h-3 w-3" />
              Range outside control limits
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

export default function RChart({
  subgroups,
  controlLimits,
  analysis,
  height = 300,
  showLegend = true
}: RChartProps) {
  // Prepare chart data
  const chartData: ChartDataPoint[] = subgroups.map((sg, index) => ({
    subgroupNumber: sg.subgroupNumber,
    range: sg.range,
    hasViolation: hasRangeViolation(index, analysis)
  }))

  // Calculate Y-axis domain
  const allRanges = subgroups.map(sg => sg.range)
  const maxRange = Math.max(...allRanges, 0)
  const padding = maxRange * 0.2 || 2

  let yMax = maxRange + padding
  if (controlLimits) {
    yMax = Math.max(yMax, controlLimits.rBarUCL + padding)
  }

  // Count range violations
  const rangeViolations = analysis?.violations.filter(v => v.chart === 'range').length || 0
  const isRangeStable = rangeViolations === 0

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            R Chart (Process Variation)
            <Info className="h-4 w-4 text-muted-foreground" />
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitors whether the process variation is stable over time
          </p>
        </div>

        <Badge
          variant={isRangeStable ? 'default' : 'destructive'}
          className="text-sm"
        >
          {isRangeStable ? (
            <>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Variation Stable
            </>
          ) : (
            <>
              <AlertTriangle className="mr-1 h-4 w-4" />
              {rangeViolations} Violation(s)
            </>
          )}
        </Badge>
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
            domain={[0, yMax]}
            label={{ value: 'Range (meters)', angle: -90, position: 'insideLeft' }}
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

          {/* Control Limits */}
          {controlLimits && (
            <>
              <ReferenceLine
                y={controlLimits.rBarUCL}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'UCL', position: 'right', fill: '#ef4444', fontSize: 12 }}
              />
              <ReferenceLine
                y={controlLimits.rBarCL}
                stroke="#10b981"
                strokeWidth={2}
                label={{ value: 'R̄', position: 'right', fill: '#10b981', fontSize: 12 }}
              />
              {controlLimits.rBarLCL > 0 && (
                <ReferenceLine
                  y={controlLimits.rBarLCL}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: 'LCL', position: 'right', fill: '#ef4444', fontSize: 12 }}
                />
              )}
            </>
          )}

          {/* Data Line */}
          <Line
            type="monotone"
            dataKey="range"
            stroke="#10b981"
            strokeWidth={2}
            dot={<CustomDot />}
            name="Subgroup Range"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Statistics Summary */}
      {controlLimits && (
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">UCL</div>
            <div className="font-semibold text-sm">{controlLimits.rBarUCL.toFixed(2)} m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Average Range (R̄)</div>
            <div className="font-semibold text-sm text-green-600">{controlLimits.rBarCL.toFixed(2)} m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">LCL</div>
            <div className="font-semibold text-sm">{controlLimits.rBarLCL.toFixed(2)} m</div>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-xs text-green-900">
          <strong>R Chart Purpose:</strong> Must be in control before interpreting X-bar chart. 
          Unstable variation makes the X-bar control limits unreliable.
        </p>
      </div>

      {/* No Data Message */}
      {subgroups.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No data collected yet. Start launching shots to see the R chart.</p>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface CompactRChartProps {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  analysis: NelsonAnalysis | null
  height?: number
}

export function CompactRChart({
  subgroups,
  controlLimits,
  analysis,
  height = 150
}: CompactRChartProps) {
  const chartData: ChartDataPoint[] = subgroups.map((sg, index) => ({
    subgroupNumber: sg.subgroupNumber,
    range: sg.range,
    hasViolation: hasRangeViolation(index, analysis)
  }))

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="subgroupNumber" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 10 }} />
          
          {controlLimits && (
            <>
              <ReferenceLine y={controlLimits.rBarUCL} stroke="#ef4444" strokeDasharray="3 3" />
              <ReferenceLine y={controlLimits.rBarCL} stroke="#10b981" />
              {controlLimits.rBarLCL > 0 && (
                <ReferenceLine y={controlLimits.rBarLCL} stroke="#ef4444" strokeDasharray="3 3" />
              )}
            </>
          )}

          <Line
            type="monotone"
            dataKey="range"
            stroke="#10b981"
            strokeWidth={2}
            dot={<CustomDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
