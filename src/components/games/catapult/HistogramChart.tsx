'use client'

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
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import type { DescriptiveStats } from '@/lib/games/catapult/normalityTests'

// ============================================================================
// TYPES
// ============================================================================

interface HistogramChartProps {
  data: number[]
  stats: DescriptiveStats
  binCount?: number
  showNormalCurve?: boolean
  showMean?: boolean
  showMedian?: boolean
  passed?: boolean
}

interface HistogramBin {
  binStart: number
  binEnd: number
  binCenter: number
  frequency: number
  normalDensity: number
}

// ============================================================================
// HISTOGRAM CHART COMPONENT
// ============================================================================

export function HistogramChart({
  data,
  stats,
  binCount = 10,
  showNormalCurve = true,
  showMean = true,
  showMedian = true,
  passed = true
}: HistogramChartProps) {
  // Calculate histogram bins
  const bins = calculateHistogramBins(data, binCount, stats)

  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">
          Distribution Histogram
        </h3>
        <p className="text-sm text-gray-400">
          Frequency distribution with normal curve overlay
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={bins}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis
            dataKey="binCenter"
            stroke="#94a3b8"
            label={{
              value: 'Distance (m)',
              position: 'insideBottom',
              offset: -10,
              fill: '#94a3b8'
            }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          
          <YAxis
            yAxisId="left"
            stroke="#94a3b8"
            label={{
              value: 'Frequency',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8'
            }}
          />
          
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#8b5cf6"
            label={{
              value: 'Density',
              angle: 90,
              position: 'insideRight',
              fill: '#8b5cf6'
            }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Frequency') return value.toFixed(0)
              if (name === 'Normal Density') return value.toFixed(4)
              return value
            }}
          />
          
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />

          {/* Mean line */}
          {showMean && (
            <ReferenceLine
              x={stats.mean}
              yAxisId="left"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `Mean: ${stats.mean.toFixed(2)}`,
                position: 'top',
                fill: '#10b981'
              }}
            />
          )}

          {/* Median line */}
          {showMedian && Math.abs(stats.mean - stats.median) > 0.5 && (
            <ReferenceLine
              x={stats.median}
              yAxisId="left"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `Median: ${stats.median.toFixed(2)}`,
                position: 'top',
                fill: '#3b82f6'
              }}
            />
          )}

          {/* Histogram bars */}
          <Bar
            yAxisId="left"
            dataKey="frequency"
            fill={passed ? '#10b981' : '#ef4444'}
            fillOpacity={0.6}
            name="Frequency"
          />

          {/* Normal curve */}
          {showNormalCurve && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="normalDensity"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              name="Normal Density"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Distribution Info */}
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <div className="rounded-lg bg-slate-700/30 p-3 text-xs">
          <div className="mb-1 font-medium text-gray-300">
            Distribution Shape
          </div>
          <div className="text-gray-400">
            {getDistributionShape(stats.skewness)}
          </div>
        </div>
        
        <div className="rounded-lg bg-slate-700/30 p-3 text-xs">
          <div className="mb-1 font-medium text-gray-300">
            Peakedness
          </div>
          <div className="text-gray-400">
            {getPeakedness(stats.kurtosis)}
          </div>
        </div>
        
        <div className="rounded-lg bg-slate-700/30 p-3 text-xs">
          <div className="mb-1 font-medium text-gray-300">
            Sample Size
          </div>
          <div className="text-gray-400">
            n = {stats.n}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// HISTOGRAM CALCULATION HELPER
// ============================================================================

function calculateHistogramBins(
  data: number[],
  binCount: number,
  stats: DescriptiveStats
): HistogramBin[] {
  const min = stats.min
  const max = stats.max
  const binWidth = (max - min) / binCount

  // Initialize bins
  const bins: HistogramBin[] = []
  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binWidth
    const binEnd = binStart + binWidth
    bins.push({
      binStart,
      binEnd,
      binCenter: (binStart + binEnd) / 2,
      frequency: 0,
      normalDensity: 0
    })
  }

  // Count frequencies
  data.forEach(value => {
    const binIndex = Math.min(
      Math.floor((value - min) / binWidth),
      binCount - 1
    )
    if (binIndex >= 0 && binIndex < binCount) {
      bins[binIndex].frequency++
    }
  })

  // Calculate normal density for each bin center
  bins.forEach(bin => {
    bin.normalDensity = normalPDF(bin.binCenter, stats.mean, stats.stdDev) * data.length * binWidth
  })

  return bins
}

// ============================================================================
// NORMAL PDF FUNCTION
// ============================================================================

function normalPDF(x: number, mean: number, stdDev: number): number {
  const variance = stdDev * stdDev
  const exponent = -Math.pow(x - mean, 2) / (2 * variance)
  return (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(exponent)
}

// ============================================================================
// DISTRIBUTION SHAPE HELPERS
// ============================================================================

function getDistributionShape(skewness: number): string {
  if (Math.abs(skewness) < 0.5) {
    return 'Symmetric (Normal)'
  } else if (skewness > 0) {
    return `Right-skewed (${skewness.toFixed(2)})`
  } else {
    return `Left-skewed (${skewness.toFixed(2)})`
  }
}

function getPeakedness(kurtosis: number): string {
  if (Math.abs(kurtosis) < 0.5) {
    return 'Normal (Mesokurtic)'
  } else if (kurtosis > 0) {
    return `Heavy-tailed (${kurtosis.toFixed(2)})`
  } else {
    return `Light-tailed (${kurtosis.toFixed(2)})`
  }
}

// ============================================================================
// COMPACT HISTOGRAM
// ============================================================================

interface CompactHistogramProps {
  data: number[]
  stats: DescriptiveStats
  passed?: boolean
}

export function CompactHistogram({ data, stats, passed = true }: CompactHistogramProps) {
  const bins = calculateHistogramBins(data, 8, stats)

  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
      <h4 className="mb-3 text-sm font-medium text-white">Distribution</h4>
      
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          data={bins}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="binCenter"
            stroke="#94a3b8"
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <YAxis
            yAxisId="left"
            stroke="#94a3b8"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#8b5cf6"
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          
          <Bar
            yAxisId="left"
            dataKey="frequency"
            fill={passed ? '#10b981' : '#ef4444'}
            fillOpacity={0.6}
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="normalDensity"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ============================================================================
// HISTOGRAM WITH STATS
// ============================================================================

interface HistogramWithStatsProps {
  data: number[]
  stats: DescriptiveStats
  passed: boolean
}

export function HistogramWithStats({ data, stats, passed }: HistogramWithStatsProps) {
  return (
    <div className="space-y-4">
      <HistogramChart data={data} stats={stats} passed={passed} />
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-slate-800/50 p-4">
          <div className="text-xs text-gray-400">Mean</div>
          <div className="text-lg font-bold text-white">
            {stats.mean.toFixed(2)}
          </div>
        </Card>
        
        <Card className="border-white/10 bg-slate-800/50 p-4">
          <div className="text-xs text-gray-400">Std Dev</div>
          <div className="text-lg font-bold text-white">
            {stats.stdDev.toFixed(2)}
          </div>
        </Card>
        
        <Card className="border-white/10 bg-slate-800/50 p-4">
          <div className="text-xs text-gray-400">Skewness</div>
          <div className={`text-lg font-bold ${
            Math.abs(stats.skewness) < 0.5 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {stats.skewness.toFixed(2)}
          </div>
        </Card>
        
        <Card className="border-white/10 bg-slate-800/50 p-4">
          <div className="text-xs text-gray-400">Kurtosis</div>
          <div className={`text-lg font-bold ${
            Math.abs(stats.kurtosis) < 0.5 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {stats.kurtosis.toFixed(2)}
          </div>
        </Card>
      </div>
    </div>
  )
}
