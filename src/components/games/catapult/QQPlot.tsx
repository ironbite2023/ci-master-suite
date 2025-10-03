'use client'

import { Card } from '@/components/ui/card'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  ReferenceLine
} from 'recharts'
import type { QQPlotData } from '@/lib/games/catapult/normalityTests'

// ============================================================================
// TYPES
// ============================================================================

interface QQPlotProps {
  data: QQPlotData
  title?: string
  showConfidenceBounds?: boolean
}

// ============================================================================
// Q-Q PLOT COMPONENT
// ============================================================================

export function QQPlot({ 
  data, 
  title = 'Q-Q Plot (Normal Distribution)',
  showConfidenceBounds = true 
}: QQPlotProps) {
  // Prepare data for Recharts
  const chartData = data.theoretical.map((theoretical, index) => ({
    theoretical,
    actual: data.actual[index],
    lowerBound: data.lowerBound[index],
    upperBound: data.upperBound[index]
  }))

  // Calculate axis limits
  const allValues = [...data.theoretical, ...data.actual]
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const range = maxVal - minVal
  const axisMin = minVal - range * 0.1
  const axisMax = maxVal + range * 0.1

  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400">
          Points close to the reference line indicate normal distribution
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis
            dataKey="theoretical"
            type="number"
            domain={[axisMin, axisMax]}
            stroke="#94a3b8"
            label={{
              value: 'Theoretical Quantiles',
              position: 'insideBottom',
              offset: -10,
              fill: '#94a3b8'
            }}
          />
          
          <YAxis
            dataKey="actual"
            type="number"
            domain={[axisMin, axisMax]}
            stroke="#94a3b8"
            label={{
              value: 'Sample Quantiles',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8'
            }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => value.toFixed(3)}
            labelFormatter={(label: number) => `Theoretical: ${label.toFixed(3)}`}
          />
          
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />

          {/* Reference line (perfect normality) */}
          <Line
            type="monotone"
            dataKey="theoretical"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Perfect Normal"
            strokeDasharray="5 5"
          />

          {/* Confidence bounds */}
          {showConfidenceBounds && (
            <>
              <Line
                type="monotone"
                dataKey="lowerBound"
                stroke="#f59e0b"
                strokeWidth={1}
                dot={false}
                name="95% CI Lower"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="upperBound"
                stroke="#f59e0b"
                strokeWidth={1}
                dot={false}
                name="95% CI Upper"
                strokeDasharray="3 3"
              />
            </>
          )}

          {/* Actual data points */}
          <Scatter
            name="Sample Data"
            dataKey="actual"
            fill="#8b5cf6"
            fillOpacity={0.8}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Interpretation Guide */}
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <div className="rounded-lg bg-green-500/10 p-3 text-xs">
          <div className="mb-1 font-medium text-green-400">
            Points on Line
          </div>
          <div className="text-green-300">
            Data follows normal distribution well
          </div>
        </div>
        
        <div className="rounded-lg bg-yellow-500/10 p-3 text-xs">
          <div className="mb-1 font-medium text-yellow-400">
            Points within Bounds
          </div>
          <div className="text-yellow-300">
            Acceptable deviation from normal
          </div>
        </div>
        
        <div className="rounded-lg bg-red-500/10 p-3 text-xs">
          <div className="mb-1 font-medium text-red-400">
            Points outside Bounds
          </div>
          <div className="text-red-300">
            May indicate non-normality
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// COMPACT Q-Q PLOT
// ============================================================================

interface CompactQQPlotProps {
  data: QQPlotData
}

export function CompactQQPlot({ data }: CompactQQPlotProps) {
  const chartData = data.theoretical.map((theoretical, index) => ({
    theoretical,
    actual: data.actual[index]
  }))

  const allValues = [...data.theoretical, ...data.actual]
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const range = maxVal - minVal
  const axisMin = minVal - range * 0.1
  const axisMax = maxVal + range * 0.1

  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
      <h4 className="mb-3 text-sm font-medium text-white">Q-Q Plot</h4>
      
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="theoretical"
            type="number"
            domain={[axisMin, axisMax]}
            stroke="#94a3b8"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            dataKey="actual"
            type="number"
            domain={[axisMin, axisMax]}
            stroke="#94a3b8"
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
          
          {/* Reference line */}
          <ReferenceLine
            segment={[
              { x: axisMin, y: axisMin },
              { x: axisMax, y: axisMax }
            ]}
            stroke="#10b981"
            strokeDasharray="3 3"
          />
          
          <Scatter
            name="Data"
            dataKey="actual"
            fill="#8b5cf6"
            fillOpacity={0.8}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

// ============================================================================
// Q-Q PLOT WITH ANALYSIS
// ============================================================================

interface QQPlotWithAnalysisProps {
  data: QQPlotData
  passed: boolean
}

export function QQPlotWithAnalysis({ data, passed }: QQPlotWithAnalysisProps) {
  // Calculate how many points are within confidence bounds
  const pointsWithinBounds = data.actual.filter((actual, index) => {
    const lower = data.lowerBound[index]
    const upper = data.upperBound[index]
    return actual >= lower && actual <= upper
  }).length

  const percentWithin = (pointsWithinBounds / data.actual.length) * 100

  return (
    <div className="space-y-4">
      <QQPlot data={data} />
      
      {/* Analysis Summary */}
      <Card className={`border p-4 ${
        passed
          ? 'border-green-500/30 bg-green-500/10'
          : 'border-red-500/30 bg-red-500/10'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-sm font-medium ${
              passed ? 'text-green-400' : 'text-red-400'
            }`}>
              Q-Q Plot Assessment
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {pointsWithinBounds} of {data.actual.length} points within 95% confidence bounds
            </div>
          </div>
          <div className={`text-2xl font-bold ${
            passed ? 'text-green-400' : 'text-red-400'
          }`}>
            {percentWithin.toFixed(0)}%
          </div>
        </div>
      </Card>
    </div>
  )
}
