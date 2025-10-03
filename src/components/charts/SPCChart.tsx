'use client'

import { useMemo } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { calculateControlLimits } from '@/lib/calculations/spc'

interface SPCChartProps {
  data: Array<{
    sample: number
    value: number
  }>
  title?: string
  yLabel?: string
  showViolations?: boolean
  showRules?: boolean
  sigmaLevel?: number
  showZones?: boolean
  className?: string
}

export function SPCChart({
  data,
  title = 'Control Chart',
  yLabel = 'Value',
  showViolations = true,
  showRules = true,
  sigmaLevel = 3,
  showZones = false,
  className = ''
}: SPCChartProps) {
  const controlData = useMemo(() => {
    return calculateControlLimits(
      data.map(d => d.value),
      sigmaLevel,
      showRules
    )
  }, [data, sigmaLevel, showRules])

  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      ...point,
      isViolation: controlData.violations.includes(index),
      mean: controlData.mean,
      ucl: controlData.ucl,
      lcl: controlData.lcl,
      zone1Upper: controlData.mean + controlData.sigma,
      zone1Lower: controlData.mean - controlData.sigma,
      zone2Upper: controlData.mean + 2 * controlData.sigma,
      zone2Lower: controlData.mean - 2 * controlData.sigma,
    }))
  }, [data, controlData])

  const CustomDot = (props: { cx?: number; cy?: number; payload?: { isViolation?: boolean } }) => {
    const { cx, cy, payload } = props
    const fill = payload?.isViolation ? '#ef4444' : '#3b82f6'
    const r = payload?.isViolation ? 6 : 4
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={r} 
        fill={fill}
        stroke={payload?.isViolation ? '#dc2626' : '#2563eb'}
        strokeWidth={2}
      />
    )
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { sample: number; value: number; isViolation?: boolean; violationType?: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">Sample {data.sample}</p>
          <p className="text-sm">Value: {data.value.toFixed(3)}</p>
          {data.isViolation && (
            <p className="text-sm text-red-600 font-medium mt-1">
              ⚠️ Control violation
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {controlData.violations.length} violations
              </Badge>
              {controlData.rules.length > 0 && (
                <Badge variant="outline">
                  {controlData.rules.length} rules triggered
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Control Statistics */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Mean (CL)</p>
              <p className="text-lg font-semibold">{controlData.mean.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">UCL</p>
              <p className="text-lg font-semibold text-red-600">{controlData.ucl.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">LCL</p>
              <p className="text-lg font-semibold text-red-600">{controlData.lcl.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sigma</p>
              <p className="text-lg font-semibold">{controlData.sigma.toFixed(3)}</p>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="sample" 
                label={{ value: 'Sample', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Control Lines */}
              <ReferenceLine 
                y={controlData.mean} 
                stroke="#22c55e" 
                strokeDasharray="5 5" 
                label="CL"
                strokeWidth={2}
              />
              <ReferenceLine 
                y={controlData.ucl} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label="UCL"
                strokeWidth={2}
              />
              <ReferenceLine 
                y={controlData.lcl} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label="LCL"
                strokeWidth={2}
              />

              {/* Zone Lines (optional) */}
              {showZones && (
                <>
                  <ReferenceLine 
                    y={controlData.mean + controlData.sigma} 
                    stroke="#f59e0b" 
                    strokeDasharray="2 2" 
                    label="+1σ"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <ReferenceLine 
                    y={controlData.mean - controlData.sigma} 
                    stroke="#f59e0b" 
                    strokeDasharray="2 2" 
                    label="-1σ"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <ReferenceLine 
                    y={controlData.mean + 2 * controlData.sigma} 
                    stroke="#f97316" 
                    strokeDasharray="2 2" 
                    label="+2σ"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <ReferenceLine 
                    y={controlData.mean - 2 * controlData.sigma} 
                    stroke="#f97316" 
                    strokeDasharray="2 2" 
                    label="-2σ"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                </>
              )}
              
              {/* Data Line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={<CustomDot />}
                name="Measured Value"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Violations Alert */}
          {showViolations && controlData.violations.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Control Violations Detected:</strong> {controlData.violations.length} points outside control limits at samples: {controlData.violations.map(v => v + 1).join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Nelson Rules Violations */}
          {showRules && controlData.rules.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-sm">Nelson Rules Violations:</h4>
              {controlData.rules.map((rule, index) => (
                <Alert
                  key={index}
                  variant={rule.severity === 'critical' ? 'destructive' : 'default'}
                  className="py-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{rule.rule}:</strong> {rule.description}
                    {rule.indices.length <= 10 && (
                      <span className="ml-2 text-xs">
                        (Samples: {rule.indices.map(i => i + 1).join(', ')})
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Chart Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span>In Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span>Out of Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-green-600"></div>
              <span>Center Line (CL)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-red-600 border-dashed"></div>
              <span>Control Limits</span>
            </div>
            {showZones && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-orange-500 opacity-50"></div>
                <span>Sigma Zones</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
