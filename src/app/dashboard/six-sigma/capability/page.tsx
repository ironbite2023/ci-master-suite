'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { AlertCircle, CheckCircle2, Download, TrendingUp, Target, ArrowLeft } from 'lucide-react'
import { calculateCapability, generateHistogramBins } from '@/lib/calculations/capability'
import { toast } from 'sonner'

export default function ProcessCapabilityPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  // Sample data - normally distributed around 100 with some variation
  const [data, setData] = useState<number[]>([
    98.5, 100.2, 99.8, 101.1, 100.5, 99.2, 100.8, 99.5, 100.3, 101.2,
    99.7, 100.9, 99.3, 100.6, 101.4, 99.1, 100.4, 99.9, 101.0, 100.1,
    99.4, 100.7, 99.6, 101.3, 100.0, 99.8, 100.2, 99.5, 100.9, 99.2,
    100.5, 99.7, 101.1, 100.3, 99.9, 100.6, 99.4, 100.8, 101.5, 99.3,
    100.1, 99.6, 100.4, 99.8, 101.2, 100.0, 99.5, 100.7, 99.2, 100.3
  ])

  const [usl, setUsl] = useState(102)
  const [lsl, setLsl] = useState(98)
  const [target, setTarget] = useState(100)

  const results = useMemo(() => {
    return calculateCapability({ data, usl, lsl, target })
  }, [data, usl, lsl, target])

  const histogram = useMemo(() => {
    return generateHistogramBins(data, usl, lsl, 15)
  }, [data, usl, lsl])

  const handleDataInput = useCallback((text: string) => {
    try {
      const values = text
        .split(/[\n,\s]+/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v))

      if (values.length > 0) {
        setData(values)
        toast.success(`Loaded ${values.length} data points`)
      }
    } catch {
      toast.error('Error parsing data')
    }
  }, [])

  const handleExport = useCallback(() => {
    const report = `Process Capability Analysis Report
Generated: ${new Date().toLocaleDateString()}

=== SPECIFICATION LIMITS ===
Upper Specification Limit (USL): ${usl}
Lower Specification Limit (LSL): ${lsl}
Target: ${target}

=== BASIC STATISTICS ===
Mean: ${results.mean.toFixed(4)}
Median: ${results.median.toFixed(4)}
Std Dev: ${results.stdDev.toFixed(4)}
Range: ${results.range.toFixed(4)}

=== CAPABILITY INDICES ===
Cp: ${results.cp.toFixed(4)}
Cpk: ${results.cpk.toFixed(4)}
Cpl: ${results.cpl.toFixed(4)}
Cpu: ${results.cpu.toFixed(4)}

=== PERFORMANCE INDICES ===
Pp: ${results.pp.toFixed(4)}
Ppk: ${results.ppk.toFixed(4)}

=== SIGMA LEVEL ===
Sigma Level: ${results.sigmaLevel.toFixed(2)}σ
DPMO: ${results.dpmo}

=== OUT OF SPECIFICATION ===
Total Out of Spec: ${results.outOfSpecCount} (${results.outOfSpecPercent.toFixed(2)}%)
Above USL: ${results.aboveUSL}
Below LSL: ${results.belowLSL}

=== CAPABILITY LEVEL ===
${results.capabilityLevel}
Status: ${results.isCapable ? 'CAPABLE' : 'NOT CAPABLE'}

=== RECOMMENDATIONS ===
${results.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'capability-analysis.txt'
    a.click()
    toast.success('Report exported')
  }, [results, usl, lsl, target])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Six Sigma Tools
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Process Capability Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Evaluate process performance against specification limits
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Capability Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Process Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {results.isCapable ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <Badge variant={results.isCapable ? 'default' : 'destructive'}>
                {results.isCapable ? 'Capable' : 'Not Capable'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.capabilityLevel}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cpk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {results.cpk.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Actual capability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sigma Level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {results.sigmaLevel.toFixed(2)}σ
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {results.dpmo.toLocaleString()} DPMO
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Out of Spec</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {results.outOfSpecPercent.toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {results.outOfSpecCount} of {data.length} samples
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="specs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specification Limits</CardTitle>
                  <CardDescription>Define process requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Upper Specification Limit (USL)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={usl}
                      onChange={(e) => setUsl(parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Lower Specification Limit (LSL)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={lsl}
                      onChange={(e) => setLsl(parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Target Value</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={target}
                      onChange={(e) => setTarget(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spec Width:</span>
                      <span className="font-medium">{results.specificationWidth.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Process Width:</span>
                      <span className="font-medium">{results.processWidth.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target Distance:</span>
                      <span className="font-medium">{results.targetDistance.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Input</CardTitle>
                  <CardDescription>
                    Paste values (space, comma, or newline separated)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    className="w-full h-64 p-3 border rounded-md font-mono text-sm"
                    placeholder="100.2, 99.8, 101.1, ..."
                    defaultValue={data.join(', ')}
                    onBlur={(e) => handleDataInput(e.target.value)}
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {data.length} data points
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Process Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mean</p>
                  <p className="font-semibold">{results.mean.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Median</p>
                  <p className="font-semibold">{results.median.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Std Dev</p>
                  <p className="font-semibold">{results.stdDev.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Range</p>
                  <p className="font-semibold">{results.range.toFixed(4)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Visualizations and Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Histogram */}
          <Card>
            <CardHeader>
              <CardTitle>Process Distribution</CardTitle>
              <CardDescription>
                Histogram with specification limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={histogram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="start"
                    tickFormatter={(value) => value.toFixed(1)}
                    label={{ value: 'Measurement', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value: number) => [value, 'Count']}
                    labelFormatter={(value) => `Range: ${parseFloat(value as string).toFixed(2)}`}
                  />
                  <ReferenceLine x={lsl} stroke="#ef4444" strokeWidth={2} label="LSL" />
                  <ReferenceLine x={usl} stroke="#ef4444" strokeWidth={2} label="USL" />
                  <ReferenceLine x={target} stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" label="Target" />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {histogram.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isOutOfSpec ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Within Spec</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span>Out of Spec</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capability Indices */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Capability Indices</CardTitle>
                <CardDescription>Short-term potential</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Cp:</span>
                  <span className="font-semibold">{results.cp.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cpk:</span>
                  <span className="font-semibold">{results.cpk.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cpu:</span>
                  <span className="font-semibold">{results.cpu.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cpl:</span>
                  <span className="font-semibold">{results.cpl.toFixed(3)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance Indices</CardTitle>
                <CardDescription>Long-term actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Pp:</span>
                  <span className="font-semibold">{results.pp.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ppk:</span>
                  <span className="font-semibold">{results.ppk.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ppu:</span>
                  <span className="font-semibold">{results.ppu.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ppl:</span>
                  <span className="font-semibold">{results.ppl.toFixed(3)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.recommendations.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Process is performing well. Continue monitoring to maintain capability.
                  </AlertDescription>
                </Alert>
              ) : (
                results.recommendations.map((rec, index) => (
                  <Alert
                    key={index}
                    variant={rec.includes('CRITICAL') ? 'destructive' : 'default'}
                  >
                    {rec.includes('CRITICAL') ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : rec.includes('Excellent') ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Target className="h-4 w-4" />
                    )}
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
