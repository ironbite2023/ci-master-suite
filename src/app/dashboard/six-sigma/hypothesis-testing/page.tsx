'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, XCircle, Download, BarChart3, ArrowLeft } from 'lucide-react'
import {
  oneSampleTTest,
  twoSampleTTest,
  pairedTTest,
  oneWayANOVA,
  chiSquareTest,
  andersonDarlingTest
} from '@/lib/calculations/hypothesis-testing'
import { toast } from 'sonner'

export default function HypothesisTestingPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  const [testType, setTestType] = useState<string>('one-sample-t')
  const [alpha, setAlpha] = useState(0.05)
  
  // One-sample t-test state
  const [oneSampleData, setOneSampleData] = useState<number[]>([10.2, 9.8, 10.5, 10.1, 9.9, 10.3, 10.0, 9.7, 10.4, 10.2])
  const [hypothesizedMean, setHypothesizedMean] = useState(10)
  
  // Two-sample t-test state
  const [sample1Data, setSample1Data] = useState<number[]>([8.5, 9.2, 8.8, 9.1, 8.9, 9.0, 8.7, 9.3])
  const [sample2Data, setSample2Data] = useState<number[]>([9.5, 10.1, 9.8, 10.2, 9.9, 10.0, 9.7, 10.3])
  const [equalVariance, setEqualVariance] = useState(true)
  
  // Paired t-test state
  const [beforeData, setBeforeData] = useState<number[]>([85, 90, 88, 92, 87, 89, 91, 86])
  const [afterData, setAfterData] = useState<number[]>([88, 93, 91, 95, 90, 92, 94, 89])
  
  // ANOVA state
  const [anovaGroups, setAnovaGroups] = useState<number[][]>([
    [10, 12, 11, 13, 12],
    [15, 17, 16, 18, 16],
    [20, 22, 21, 23, 22]
  ])
  
  // Chi-square state
  const [chiSquareData, setChiSquareData] = useState<number[][]>([
    [30, 10],
    [20, 40]
  ])

  const handleParseData = useCallback((text: string): number[] => {
    return text
      .split(/[\n,\s]+/)
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v))
  }, [])

  const handleParseGroups = useCallback((text: string): number[][] => {
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => 
        line.split(/[,\s]+/)
          .map(v => parseFloat(v.trim()))
          .filter(v => !isNaN(v))
      )
      .filter(group => group.length > 0)
  }, [])

  const result = useMemo(() => {
    try {
      switch (testType) {
        case 'one-sample-t':
          return oneSampleTTest(oneSampleData, hypothesizedMean, alpha)
        case 'two-sample-t':
          return twoSampleTTest(sample1Data, sample2Data, alpha, equalVariance)
        case 'paired-t':
          return pairedTTest(beforeData, afterData, alpha)
        case 'anova':
          return oneWayANOVA(anovaGroups, alpha)
        case 'chi-square':
          return chiSquareTest(chiSquareData, alpha)
        case 'normality':
          return andersonDarlingTest(oneSampleData)
        default:
          return null
      }
    } catch (error) {
      toast.error('Error performing test: ' + (error as Error).message)
      return null
    }
  }, [testType, oneSampleData, hypothesizedMean, sample1Data, sample2Data, beforeData, afterData, anovaGroups, chiSquareData, alpha, equalVariance])

  const handleExportReport = useCallback(() => {
    if (!result) return
    
    let report = `Hypothesis Testing Report\nGenerated: ${new Date().toLocaleString()}\n\n`
    report += `Test Type: ${testType.replace(/-/g, ' ').toUpperCase()}\n`
    report += `Significance Level (α): ${alpha}\n\n`
    report += `=== RESULTS ===\n`
    
    if ('pValue' in result) {
      const statValue = 'fStatistic' in result ? result.fStatistic : 'statistic' in result ? result.statistic : 0
      report += `Test Statistic: ${statValue.toFixed(4)}\n`
      report += `P-value: ${result.pValue.toFixed(6)}\n`
      
      if ('degreesOfFreedom' in result) {
        report += `Degrees of Freedom: ${result.degreesOfFreedom.toFixed(2)}\n`
      }
      
      if ('confidenceInterval' in result) {
        report += `\n95% Confidence Interval: [${result.confidenceInterval[0].toFixed(4)}, ${result.confidenceInterval[1].toFixed(4)}]\n`
      }
      
      if ('significant' in result) {
        report += `\nSignificant: ${result.significant ? 'YES' : 'NO'}\n`
      }
      if ('normal' in result) {
        report += `\nNormal Distribution: ${result.normal ? 'YES' : 'NO'}\n`
      }
      report += `\nConclusion:\n${result.conclusion}\n`
    }
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hypothesis-test-${testType}-${Date.now()}.txt`
    a.click()
    toast.success('Report exported')
  }, [result, testType, alpha])

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
          <h1 className="text-3xl font-bold">Hypothesis Testing</h1>
          <p className="text-muted-foreground mt-1">
            Statistical tests for comparing means, proportions, and distributions
          </p>
        </div>
        <Button variant="outline" onClick={handleExportReport} disabled={!result}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Test Selection and Input */}
        <div className="lg:col-span-1 space-y-4">
          {/* Test Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Test</CardTitle>
              <CardDescription>Choose the appropriate statistical test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Test Type</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-sample-t">One-Sample t-Test</SelectItem>
                    <SelectItem value="two-sample-t">Two-Sample t-Test</SelectItem>
                    <SelectItem value="paired-t">Paired t-Test</SelectItem>
                    <SelectItem value="anova">One-Way ANOVA</SelectItem>
                    <SelectItem value="chi-square">Chi-Square Test</SelectItem>
                    <SelectItem value="normality">Normality Test (Anderson-Darling)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Significance Level (α)</Label>
                <Select value={alpha.toString()} onValueChange={(v) => setAlpha(parseFloat(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.01">0.01 (99% confidence)</SelectItem>
                    <SelectItem value="0.05">0.05 (95% confidence)</SelectItem>
                    <SelectItem value="0.10">0.10 (90% confidence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Input</CardTitle>
              <CardDescription>
                {testType === 'one-sample-t' && 'Enter sample data'}
                {testType === 'two-sample-t' && 'Enter two independent samples'}
                {testType === 'paired-t' && 'Enter before and after measurements'}
                {testType === 'anova' && 'Enter multiple groups (one per line)'}
                {testType === 'chi-square' && 'Enter contingency table'}
                {testType === 'normality' && 'Enter data to test for normality'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testType === 'one-sample-t' && (
                <>
                  <div>
                    <Label>Sample Data</Label>
                    <Textarea
                      className="font-mono text-sm"
                      placeholder="10.2, 9.8, 10.5, ..."
                      defaultValue={oneSampleData.join(', ')}
                      onBlur={(e) => setOneSampleData(handleParseData(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Hypothesized Mean (μ₀)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={hypothesizedMean}
                      onChange={(e) => setHypothesizedMean(parseFloat(e.target.value))}
                    />
                  </div>
                </>
              )}

              {testType === 'two-sample-t' && (
                <>
                  <div>
                    <Label>Sample 1</Label>
                    <Textarea
                      className="font-mono text-sm"
                      placeholder="8.5, 9.2, 8.8, ..."
                      defaultValue={sample1Data.join(', ')}
                      onBlur={(e) => setSample1Data(handleParseData(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Sample 2</Label>
                    <Textarea
                      className="font-mono text-sm"
                      placeholder="9.5, 10.1, 9.8, ..."
                      defaultValue={sample2Data.join(', ')}
                      onBlur={(e) => setSample2Data(handleParseData(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Assume Equal Variance</Label>
                    <Select value={equalVariance.toString()} onValueChange={(v) => setEqualVariance(v === 'true')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes (Pooled)</SelectItem>
                        <SelectItem value="false">No (Welch&apos;s)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {testType === 'paired-t' && (
                <>
                  <div>
                    <Label>Before</Label>
                    <Textarea
                      className="font-mono text-sm"
                      placeholder="85, 90, 88, ..."
                      defaultValue={beforeData.join(', ')}
                      onBlur={(e) => setBeforeData(handleParseData(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>After</Label>
                    <Textarea
                      className="font-mono text-sm"
                      placeholder="88, 93, 91, ..."
                      defaultValue={afterData.join(', ')}
                      onBlur={(e) => setAfterData(handleParseData(e.target.value))}
                    />
                  </div>
                </>
              )}

              {testType === 'anova' && (
                <div>
                  <Label>Groups (one per line)</Label>
                  <Textarea
                    className="font-mono text-sm h-40"
                    placeholder="10, 12, 11, 13, 12&#10;15, 17, 16, 18, 16&#10;20, 22, 21, 23, 22"
                    defaultValue={anovaGroups.map(g => g.join(', ')).join('\n')}
                    onBlur={(e) => setAnovaGroups(handleParseGroups(e.target.value))}
                  />
                </div>
              )}

              {testType === 'chi-square' && (
                <div>
                  <Label>Contingency Table (rows separated by lines)</Label>
                  <Textarea
                    className="font-mono text-sm"
                    placeholder="30, 10&#10;20, 40"
                    defaultValue={chiSquareData.map(row => row.join(', ')).join('\n')}
                    onBlur={(e) => setChiSquareData(handleParseGroups(e.target.value))}
                  />
                </div>
              )}

              {testType === 'normality' && (
                <div>
                  <Label>Sample Data</Label>
                  <Textarea
                    className="font-mono text-sm"
                    placeholder="10.2, 9.8, 10.5, ..."
                    defaultValue={oneSampleData.join(', ')}
                    onBlur={(e) => setOneSampleData(handleParseData(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Test Result Summary */}
          {result && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Test Results</CardTitle>
                    {'significant' in result && (
                      <Badge variant={result.significant ? 'destructive' : 'default'}>
                        {result.significant ? 'Significant' : 'Not Significant'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Decision */}
                  <Alert variant={'significant' in result && result.significant ? 'destructive' : 'default'}>
                    {'significant' in result && result.significant ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <AlertDescription className="font-medium">
                      {'conclusion' in result && result.conclusion}
                    </AlertDescription>
                  </Alert>

                  <Separator />

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Test Statistic</p>
                      <p className="text-2xl font-bold">
                        {'fStatistic' in result ? result.fStatistic.toFixed(4) : 'statistic' in result ? result.statistic.toFixed(4) : 'N/A'}
                      </p>
                    </div>
                    {'pValue' in result && (
                      <div>
                        <p className="text-sm text-muted-foreground">P-value</p>
                        <p className="text-2xl font-bold">{result.pValue.toFixed(6)}</p>
                      </div>
                    )}
                    {'degreesOfFreedom' in result && (
                      <div>
                        <p className="text-sm text-muted-foreground">Degrees of Freedom</p>
                        <p className="text-xl font-semibold">{result.degreesOfFreedom.toFixed(2)}</p>
                      </div>
                    )}
                    {(testType === 'one-sample-t' || testType === 'two-sample-t' || testType === 'paired-t') && 'mean' in result && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {testType === 'two-sample-t' ? 'Mean Difference' : 'Sample Mean'}
                        </p>
                        <p className="text-xl font-semibold">{result.mean.toFixed(4)}</p>
                      </div>
                    )}
                  </div>

                  {/* Confidence Interval */}
                  {'confidenceInterval' in result && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">95% Confidence Interval</p>
                      <p className="text-lg">
                        [{result.confidenceInterval[0].toFixed(4)}, {result.confidenceInterval[1].toFixed(4)}]
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ANOVA Details */}
              {testType === 'anova' && 'dfBetween' in result && (
                <Card>
                  <CardHeader>
                    <CardTitle>ANOVA Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Source</th>
                            <th className="text-right p-2">SS</th>
                            <th className="text-right p-2">df</th>
                            <th className="text-right p-2">MS</th>
                            <th className="text-right p-2">F</th>
                            <th className="text-right p-2">p-value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Between Groups</td>
                            <td className="text-right p-2">{result.ssBetween.toFixed(4)}</td>
                            <td className="text-right p-2">{result.dfBetween}</td>
                            <td className="text-right p-2">{result.msBetween.toFixed(4)}</td>
                            <td className="text-right p-2 font-semibold">{result.fStatistic.toFixed(4)}</td>
                            <td className="text-right p-2 font-semibold">{result.pValue.toFixed(6)}</td>
                          </tr>
                          <tr>
                            <td className="p-2">Within Groups</td>
                            <td className="text-right p-2">{result.ssWithin.toFixed(4)}</td>
                            <td className="text-right p-2">{result.dfWithin}</td>
                            <td className="text-right p-2">{result.msWithin.toFixed(4)}</td>
                            <td className="text-right p-2">-</td>
                            <td className="text-right p-2">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Group Means</p>
                      <div className="flex flex-wrap gap-4">
                        {result.groupMeans.map((mean, index) => (
                          <div key={index}>
                            <p className="text-xs text-muted-foreground">Group {index + 1}</p>
                            <p className="text-lg font-semibold">{mean.toFixed(4)}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm mt-2">
                        <span className="text-muted-foreground">Grand Mean:</span>{' '}
                        <span className="font-semibold">{result.grandMean.toFixed(4)}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Chi-Square Details */}
              {testType === 'chi-square' && 'expectedFrequencies' in result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Expected Frequencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border">
                        <tbody>
                          {result.expectedFrequencies.map((row, i) => (
                            <tr key={i} className="border-b">
                              {row.map((val, j) => (
                                <td key={j} className="p-3 text-center border-r">
                                  {val.toFixed(2)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!result && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a test and enter data to see results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

