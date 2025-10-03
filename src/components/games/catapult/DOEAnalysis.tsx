'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  Target,
  Lightbulb,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Line
} from 'recharts'
import type { DOEExperiment } from '@/types/catapult'
import { 
  performDOEAnalysis,
  calculateDOESummary,
  performParetoAnalysis,
  calculateOptimalConfidence,
  classifyEffect
} from '@/lib/games/catapult/doeCalculations'

// ============================================================================
// TYPES
// ============================================================================

interface DOEAnalysisProps {
  experiments: DOEExperiment[]
  onClose?: () => void
  onExport?: () => void
}

// ============================================================================
// DOE ANALYSIS COMPONENT
// ============================================================================

export function DOEAnalysis({ experiments, onClose, onExport }: DOEAnalysisProps) {
  // Perform analysis
  const analysis = performDOEAnalysis(experiments)
  const summary = calculateDOESummary(experiments)
  const paretoData = performParetoAnalysis(analysis.mainEffects, analysis.interactions)
  const confidence = calculateOptimalConfidence(experiments, analysis.optimalSettings)
  
  // Prepare chart data for main effects
  const mainEffectsData = [
    { 
      factor: 'Angle', 
      effect: analysis.mainEffects.angle,
      absEffect: Math.abs(analysis.mainEffects.angle)
    },
    { 
      factor: 'Force', 
      effect: analysis.mainEffects.force,
      absEffect: Math.abs(analysis.mainEffects.force)
    },
    { 
      factor: 'Weight', 
      effect: analysis.mainEffects.weight,
      absEffect: Math.abs(analysis.mainEffects.weight)
    }
  ].sort((a, b) => b.absEffect - a.absEffect)
  
  // Prepare interaction chart data
  const interactionData = [
    { name: 'Angle × Force', value: analysis.interactions.angleForce },
    { name: 'Angle × Weight', value: analysis.interactions.angleWeight },
    { name: 'Force × Weight', value: analysis.interactions.forceWeight }
  ]
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-white/10 bg-slate-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">DOE Analysis Results</h2>
            <p className="text-sm text-gray-400">
              2³ Factorial Design • 8 Experiments Complete
            </p>
          </div>
          
          <div className="flex gap-2">
            {onExport && (
              <Button onClick={onExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Mean Distance"
          value={`${summary.mean}m`}
          icon={Target}
          color="blue"
        />
        <StatCard
          label="Std Deviation"
          value={`${summary.stdDev}m`}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          label="Range"
          value={`${summary.range}m`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Confidence"
          value={`${confidence.percentage.toFixed(0)}%`}
          icon={CheckCircle2}
          color="orange"
        />
      </div>

      {/* Tabs for different analysis views */}
      <Tabs defaultValue="main-effects" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="main-effects">Main Effects</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="pareto">Pareto</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Main Effects Tab */}
        <TabsContent value="main-effects" className="space-y-4">
          <Card className="border-white/10 bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              Main Effects on Distance
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Shows how much each factor individually affects the distance when changed from LOW to HIGH
            </p>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mainEffectsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="factor" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Effect (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="effect" radius={[8, 8, 0, 0]}>
                  {mainEffectsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.effect > 0 ? '#22c55e' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Effect explanations */}
            <div className="mt-6 space-y-3">
              {mainEffectsData.map((data) => {
                const classification = classifyEffect(data.effect)
                return (
                  <div
                    key={data.factor}
                    className="flex items-center justify-between rounded-lg bg-slate-700/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          data.effect > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium text-white">{data.factor}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={`${
                          classification.magnitude === 'large'
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                            : classification.magnitude === 'moderate'
                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                            : 'border-gray-500 bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {classification.magnitude}
                      </Badge>
                      <span className="font-mono text-sm text-white">
                        {data.effect > 0 ? '+' : ''}
                        {data.effect.toFixed(1)}m
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Interactions Tab */}
        <TabsContent value="interactions" className="space-y-4">
          <Card className="border-white/10 bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              Two-Factor Interactions
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Positive values indicate synergistic effects (use both at HIGH). Negative values indicate antagonistic effects.
            </p>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interactionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {interactionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value > 0 ? '#3b82f6' : '#f97316'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Interaction explanations */}
            <div className="mt-6 space-y-3">
              {interactionData.map((data) => {
                const isSignificant = Math.abs(data.value) > 5
                return (
                  <div
                    key={data.name}
                    className="flex items-center justify-between rounded-lg bg-slate-700/30 p-3"
                  >
                    <span className="font-medium text-white">{data.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        {data.value > 0 ? 'Synergistic' : 'Antagonistic'}
                      </span>
                      {isSignificant && (
                        <Badge variant="outline" className="border-yellow-500 bg-yellow-500/20 text-yellow-400">
                          Significant
                        </Badge>
                      )}
                      <span className="font-mono text-sm text-white">
                        {data.value > 0 ? '+' : ''}
                        {data.value.toFixed(1)}m
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Pareto Tab */}
        <TabsContent value="pareto" className="space-y-4">
          <Card className="border-white/10 bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              Pareto Analysis
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Identifies the vital few factors that have the most impact (80/20 rule)
            </p>
            
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="factor" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="absEffect" fill="#8b5cf6" name="Absolute Effect" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#f59e0b" strokeWidth={2} name="Cumulative %" />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* 80/20 Analysis */}
            <div className="mt-6 rounded-lg bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-medium text-blue-400">80/20 Insight</div>
                  <div className="mt-1 text-sm text-gray-300">
                    {paretoData[0].cumulative > 80 ? (
                      <>
                        <strong>{paretoData[0].factor}</strong> alone accounts for{' '}
                        <strong>{paretoData[0].percentage.toFixed(0)}%</strong> of the total variation.
                        Focus on this factor for maximum improvement.
                      </>
                    ) : (
                      <>
                        The top 2 factors (<strong>{paretoData[0].factor}</strong> and{' '}
                        <strong>{paretoData[1].factor}</strong>) account for{' '}
                        <strong>{paretoData[1].cumulative.toFixed(0)}%</strong> of the total variation.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {/* Optimal Settings Card */}
          <Card className="border-white/10 bg-slate-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Optimal Settings</h3>
              <Badge
                variant="outline"
                className={`${
                  confidence.confidence === 'high'
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : confidence.confidence === 'medium'
                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                    : 'border-red-500 bg-red-500/20 text-red-400'
                }`}
              >
                {confidence.confidence.toUpperCase()} Confidence
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <SettingCard
                label="Angle"
                value={`${analysis.optimalSettings.angle}°`}
                recommendation={analysis.optimalSettings.angle === 60 ? 'HIGH' : 'LOW'}
                color="blue"
              />
              <SettingCard
                label="Force"
                value={`${analysis.optimalSettings.force}N`}
                recommendation={analysis.optimalSettings.force === 125 ? 'HIGH' : 'LOW'}
                color="green"
              />
              <SettingCard
                label="Weight"
                value={analysis.optimalSettings.weight}
                recommendation={analysis.optimalSettings.weight === 'heavy' ? 'HIGH' : 'LOW'}
                color="orange"
              />
            </div>
            
            <div className="mt-4 rounded-lg bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-green-400" />
                <div>
                  <div className="font-medium text-green-400">
                    {confidence.percentage.toFixed(0)}% Confidence
                  </div>
                  <div className="mt-1 text-sm text-gray-300">
                    {confidence.reasoning}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="border-white/10 bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Key Insights</h3>
            
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-slate-700/30 p-4"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary Statistics */}
          <Card className="border-white/10 bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Summary Statistics</h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm text-gray-400">Mean</div>
                <div className="mt-1 text-xl font-bold text-white">{summary.mean}m</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Median</div>
                <div className="mt-1 text-xl font-bold text-white">{summary.median}m</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Std Dev</div>
                <div className="mt-1 text-xl font-bold text-white">{summary.stdDev}m</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Min</div>
                <div className="mt-1 text-xl font-bold text-white">{summary.min}m</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Max</div>
                <div className="mt-1 text-xl font-bold text-white">{summary.max}m</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Range</div>
                <div className="mt-1 text-xl font-bold text-white">{summary.range}m</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  label: string
  value: string
  icon: React.ElementType
  color: 'blue' | 'purple' | 'green' | 'orange'
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-orange-500/20 text-orange-400'
  }

  return (
    <Card className="border-white/10 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">{label}</div>
          <div className="mt-1 text-2xl font-bold text-white">{value}</div>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// SETTING CARD COMPONENT
// ============================================================================

interface SettingCardProps {
  label: string
  value: string
  recommendation: string
  color: 'blue' | 'green' | 'orange'
}

function SettingCard({ label, value, recommendation, color }: SettingCardProps) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-500/20 text-blue-400',
    green: 'border-green-500 bg-green-500/20 text-green-400',
    orange: 'border-orange-500 bg-orange-500/20 text-orange-400'
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-700/30 p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      <Badge
        variant="outline"
        className={`mt-2 ${colorClasses[color]}`}
      >
        {recommendation}
      </Badge>
    </div>
  )
}
