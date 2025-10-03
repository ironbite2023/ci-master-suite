/**
 * Process Capability Chart Component
 * Histogram with normal curve and specification limits
 */

'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'
import { Target, TrendingUp } from 'lucide-react'
import { CapabilityAnalysis, SpecificationLimits } from '@/lib/games/catapult/capabilityCalculations'

// ============================================================================
// TYPES
// ============================================================================

interface ProcessCapabilityChartProps {
  data: number[]
  specs: SpecificationLimits
  analysis: CapabilityAnalysis | null
  height?: number
}

interface HistogramBin {
  binStart: number
  binEnd: number
  binMid: number
  frequency: number
  normalDensity: number
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate histogram bins
 */
function calculateHistogramBins(data: number[], binCount: number = 12): HistogramBin[] {
  if (data.length === 0) return []

  const min = Math.min(...data)
  const max = Math.max(...data)
  const binWidth = (max - min) / binCount

  const bins: HistogramBin[] = []
  
  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binWidth
    const binEnd = binStart + binWidth
    const binMid = (binStart + binEnd) / 2
    
    const frequency = data.filter(v => v >= binStart && v < binEnd).length
    
    bins.push({
      binStart,
      binEnd,
      binMid,
      frequency,
      normalDensity: 0 // Will calculate below
    })
  }

  // Calculate normal density curve
  const mean = data.reduce((sum, v) => sum + v, 0) / data.length
  const variance = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (data.length - 1)
  const stdDev = Math.sqrt(variance)

  bins.forEach(bin => {
    bin.normalDensity = normalPDF(bin.binMid, mean, stdDev) * data.length * binWidth
  })

  return bins
}

/**
 * Normal probability density function
 */
function normalPDF(x: number, mean: number, stdDev: number): number {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI))
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2))
  return coefficient * Math.exp(exponent)
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: HistogramBin
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <Card className="p-3 shadow-lg border-2">
      <div className="space-y-1">
        <div className="font-semibold text-sm border-b pb-1">
          Range: {data.binStart.toFixed(2)} - {data.binEnd.toFixed(2)} m
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Frequency:</span>
          <span className="font-semibold ml-2">{data.frequency} shots</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Expected: {data.normalDensity.toFixed(1)} shots
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProcessCapabilityChart({
  data,
  specs,
  height = 400
}: ProcessCapabilityChartProps) {
  // Calculate histogram
  const histogramData = useMemo(() => calculateHistogramBins(data, 15), [data])

  // Calculate statistics
  const mean = useMemo(() => 
    data.reduce((sum, v) => sum + v, 0) / data.length,
    [data]
  )

  if (data.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No data collected yet.</p>
          <p className="text-sm mt-2">Collect shots to see the capability chart.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Process Capability Histogram
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribution of shot distances with normal curve overlay
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={histogramData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            dataKey="binMid"
            tickFormatter={(value) => value.toFixed(1)}
            label={{ value: 'Distance (meters)', position: 'insideBottom', offset: -10 }}
            tick={{ fontSize: 12 }}
          />
          
          <YAxis
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />

          {/* Specification Limits */}
          {specs.lsl !== null && (
            <ReferenceLine
              x={specs.lsl}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'LSL', position: 'top', fill: '#ef4444', fontSize: 12 }}
            />
          )}
          
          {specs.target !== null && (
            <ReferenceLine
              x={specs.target}
              stroke="#10b981"
              strokeWidth={2}
              label={{ value: 'Target', position: 'top', fill: '#10b981', fontSize: 12 }}
            />
          )}
          
          {specs.usl !== null && (
            <ReferenceLine
              x={specs.usl}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'USL', position: 'top', fill: '#ef4444', fontSize: 12 }}
            />
          )}

          {/* Process Mean */}
          <ReferenceLine
            x={mean}
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{ value: 'Mean', position: 'top', fill: '#3b82f6', fontSize: 12 }}
          />

          {/* Histogram Bars */}
          <Bar
            dataKey="frequency"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Actual Frequency"
          />

          {/* Normal Curve */}
          <Line
            type="monotone"
            dataKey="normalDensity"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Normal Distribution"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Process Mean</div>
          <div className="font-semibold text-blue-600">{mean.toFixed(2)} m</div>
        </div>
        {specs.target !== null && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Target</div>
            <div className="font-semibold text-green-600">{specs.target.toFixed(2)} m</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Sample Size</div>
          <div className="font-semibold">{data.length} shots</div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Reading the Chart:</strong> The blue bars show your actual data distribution. 
          The green line shows the expected normal distribution. Specification limits (red) define 
          acceptable values. The closer your process mean (blue) is to the target (green), the better!
        </p>
      </div>
    </Card>
  )
}
