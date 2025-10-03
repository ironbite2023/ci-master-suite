'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, TrendingUp, Activity, Clock, Target, Award, Download, ArrowLeft } from 'lucide-react'
import { calculateOEE, formatMinutes, type OEEInput } from '@/lib/calculations/oee'
import { toast } from 'sonner'

export default function OEEPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/lean');
  };

  const [input, setInput] = useState<OEEInput>({
    plannedProductionTime: 480, // 8 hour shift
    breaks: 60, // 1 hour breaks
    idealCycleTime: 30, // 30 seconds per unit
    totalCount: 750,
    goodCount: 720,
    downtimeMinutes: 45,
    changeoverMinutes: 30
  })

  const results = useMemo(() => calculateOEE(input), [input])

  const handleInputChange = (field: keyof OEEInput, value: string) => {
    const numValue = parseFloat(value) || 0
    setInput(prev => ({ ...prev, [field]: numValue }))
  }

  const getMetricColor = (value: number, thresholds: { good: number, fair: number }) => {
    if (value >= thresholds.good) return 'text-green-600'
    if (value >= thresholds.fair) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricBgColor = (value: number, thresholds: { good: number, fair: number }) => {
    if (value >= thresholds.good) return 'bg-green-50 border-green-200'
    if (value >= thresholds.fair) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const handleExport = () => {
    const report = `OEE Analysis Report
Generated: ${new Date().toLocaleString()}

=== INPUT PARAMETERS ===
Planned Production Time: ${formatMinutes(input.plannedProductionTime)}
Breaks: ${formatMinutes(input.breaks)}
Ideal Cycle Time: ${input.idealCycleTime} seconds/unit
Total Count: ${input.totalCount} units
Good Count: ${input.goodCount} units
Downtime: ${formatMinutes(input.downtimeMinutes)}
Changeover Time: ${formatMinutes(input.changeoverMinutes)}

=== OEE RESULTS ===
Overall OEE: ${results.oee.toFixed(1)}% (${results.grade})
${results.worldClass ? '🏆 WORLD CLASS PERFORMANCE!' : ''}

Component Metrics:
- Availability: ${results.availability.toFixed(1)}%
- Performance: ${results.performance.toFixed(1)}%
- Quality: ${results.quality.toFixed(1)}%

=== TIME ANALYSIS ===
Operating Time: ${formatMinutes(results.operatingTime)}
Availability Loss: ${formatMinutes(results.availabilityLoss)}
Performance Loss: ${formatMinutes(results.performanceLoss)}

=== PERFORMANCE DETAILS ===
Actual Cycle Time: ${results.actualCycleTime.toFixed(2)} seconds
Speed Loss: ${results.speedLoss.toFixed(1)}%

=== QUALITY METRICS ===
Quality Loss: ${results.qualityLoss} units (${((results.qualityLoss / input.totalCount) * 100).toFixed(1)}%)

=== RECOMMENDATIONS ===
${results.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
`

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `oee-report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    toast.success('Report exported successfully')
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lean Tools
            </Button>
          </div>
          <h1 className="text-3xl font-bold">OEE Calculator</h1>
          <p className="text-muted-foreground mt-1">
            Overall Equipment Effectiveness = Availability × Performance × Quality
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* OEE Score Card */}
      <Card className={`border-2 ${results.worldClass ? 'border-green-500 bg-green-50' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Overall Equipment Effectiveness</p>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-5xl font-bold ${getMetricColor(results.oee, { good: 85, fair: 60 })}`}>
                      {results.oee.toFixed(1)}%
                    </span>
                    <Badge variant={results.worldClass ? 'default' : 'secondary'} className="text-base">
                      {results.grade}
                    </Badge>
                  </div>
                </div>
              </div>
              <Progress value={results.oee} className="h-3 mt-4" />
              {results.worldClass && (
                <div className="flex items-center gap-2 mt-3 text-green-700">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">World Class Performance Achieved!</span>
                </div>
              )}
            </div>
            <div className="text-6xl">
              {results.oee >= 85 ? '🏆' : results.oee >= 60 ? '📈' : '⚠️'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={getMetricBgColor(results.availability, { good: 90, fair: 80 })}>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getMetricColor(results.availability, { good: 90, fair: 80 })}`}>
              {results.availability.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Operating Time / Available Time
            </p>
            <p className="text-sm mt-2">
              Loss: {formatMinutes(results.availabilityLoss)}
            </p>
            <Progress value={results.availability} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className={getMetricBgColor(results.performance, { good: 95, fair: 85 })}>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getMetricColor(results.performance, { good: 95, fair: 85 })}`}>
              {results.performance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              (Ideal Cycle Time × Total Count) / Operating Time
            </p>
            <p className="text-sm mt-2">
              Speed Loss: {results.speedLoss.toFixed(1)}%
            </p>
            <Progress value={results.performance} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className={getMetricBgColor(results.quality, { good: 99, fair: 95 })}>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getMetricColor(results.quality, { good: 99, fair: 95 })}`}>
              {results.quality.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Good Count / Total Count
            </p>
            <p className="text-sm mt-2">
              Defects: {results.qualityLoss} units
            </p>
            <Progress value={results.quality} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter your production data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Planned Production Time (minutes)</Label>
                  <Input
                    type="number"
                    value={input.plannedProductionTime}
                    onChange={(e) => handleInputChange('plannedProductionTime', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatMinutes(input.plannedProductionTime)}
                  </p>
                </div>
                <div>
                  <Label>Breaks (minutes)</Label>
                  <Input
                    type="number"
                    value={input.breaks}
                    onChange={(e) => handleInputChange('breaks', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatMinutes(input.breaks)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Downtime (minutes)</Label>
                  <Input
                    type="number"
                    value={input.downtimeMinutes}
                    onChange={(e) => handleInputChange('downtimeMinutes', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unplanned stops
                  </p>
                </div>
                <div>
                  <Label>Changeover Time (minutes)</Label>
                  <Input
                    type="number"
                    value={input.changeoverMinutes}
                    onChange={(e) => handleInputChange('changeoverMinutes', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Setup & adjustments
                  </p>
                </div>
              </div>

              <div>
                <Label>Ideal Cycle Time (seconds/unit)</Label>
                <Input
                  type="number"
                  value={input.idealCycleTime}
                  onChange={(e) => handleInputChange('idealCycleTime', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Target production rate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Count (units)</Label>
                  <Input
                    type="number"
                    value={input.totalCount}
                    onChange={(e) => handleInputChange('totalCount', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    All units produced
                  </p>
                </div>
                <div>
                  <Label>Good Count (units)</Label>
                  <Input
                    type="number"
                    value={input.goodCount}
                    onChange={(e) => handleInputChange('goodCount', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Quality units only
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>Time and performance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Available Time</span>
                <span className="text-sm font-bold">
                  {formatMinutes(input.plannedProductionTime - input.breaks)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Operating Time</span>
                <span className="text-sm font-bold">
                  {formatMinutes(results.operatingTime)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium">Availability Loss</span>
                <span className="text-sm font-bold text-red-600">
                  {formatMinutes(results.availabilityLoss)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium">Performance Loss</span>
                <span className="text-sm font-bold text-yellow-600">
                  {formatMinutes(results.performanceLoss)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium">Actual Cycle Time</span>
                <span className="text-sm font-bold text-blue-600">
                  {results.actualCycleTime.toFixed(2)}s vs {input.idealCycleTime}s ideal
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm font-medium">Utilization Rate</span>
                <span className="text-sm font-bold text-purple-600">
                  {((results.operatingTime / input.plannedProductionTime) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recommendations & Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="font-bold text-primary min-w-6">{index + 1}.</span>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* OEE Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="font-bold text-red-600">&lt;40%</div>
              <div className="text-xs mt-1">Unacceptable</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-bold text-orange-600">40-60%</div>
              <div className="text-xs mt-1">Poor</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="font-bold text-yellow-600">60-70%</div>
              <div className="text-xs mt-1">Fair</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-bold text-blue-600">70-85%</div>
              <div className="text-xs mt-1">Good</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-500">
              <div className="font-bold text-green-600">≥85%</div>
              <div className="text-xs mt-1">World Class</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
