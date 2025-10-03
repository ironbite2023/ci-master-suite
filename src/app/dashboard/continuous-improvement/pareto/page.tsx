'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Plus, Trash2, Download, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

/**
 * Pareto Analysis Tool - Phase 4 Week 8 Implementation
 * 80/20 Rule visualization and analysis
 * Identifies the vital few from the trivial many
 */

interface DataPoint {
  id: string
  category: string
  value: number
  percentage?: number
  cumulativePercentage?: number
}

interface ParetoAnalysis {
  title: string
  description: string
  valueUnit: string
  dataPoints: DataPoint[]
  createdDate: string
}

const initialAnalysis: ParetoAnalysis = {
  title: '',
  description: '',
  valueUnit: '',
  dataPoints: [],
  createdDate: new Date().toISOString().split('T')[0]
}

export default function ParetoAnalysisPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/continuous-improvement');
  };

  const [analysis, setAnalysis] = useState<ParetoAnalysis>(initialAnalysis)
  const [newDataPoint, setNewDataPoint] = useState({ category: '', value: '' })

  // Calculate Pareto analysis
  const paretoData = useMemo(() => {
    if (analysis.dataPoints.length === 0) return []

    // Sort by value descending
    const sorted = [...analysis.dataPoints].sort((a, b) => b.value - a.value)

    // Calculate total
    const total = sorted.reduce((sum, point) => sum + point.value, 0)

    // Calculate percentages and cumulative
    let cumulative = 0
    return sorted.map(point => {
      const percentage = (point.value / total) * 100
      cumulative += percentage
      return {
        ...point,
        percentage,
        cumulativePercentage: cumulative
      }
    })
  }, [analysis.dataPoints])

  // Identify 80/20 items
  const eightyTwentyItems = useMemo(() => {
    return paretoData.filter(point => (point.cumulativePercentage || 0) <= 80)
  }, [paretoData])

  // Add data point
  const handleAddDataPoint = () => {
    if (!newDataPoint.category.trim() || !newDataPoint.value) {
      toast.error('Please provide both category and value')
      return
    }

    const dataPoint: DataPoint = {
      id: Date.now().toString(),
      category: newDataPoint.category.trim(),
      value: parseFloat(newDataPoint.value)
    }

    setAnalysis({
      ...analysis,
      dataPoints: [...analysis.dataPoints, dataPoint]
    })
    setNewDataPoint({ category: '', value: '' })
    toast.success('Data point added')
  }

  // Delete data point
  const handleDeleteDataPoint = (id: string) => {
    setAnalysis({
      ...analysis,
      dataPoints: analysis.dataPoints.filter(p => p.id !== id)
    })
    toast.success('Data point removed')
  }

  // Export
  const handleExport = () => {
    const exportData = {
      ...analysis,
      paretoAnalysis: paretoData,
      eightyTwentyItems: eightyTwentyItems.map(item => item.category),
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pareto-analysis-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Pareto analysis exported')
  }

  // Reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset the analysis? This cannot be undone.')) {
      setAnalysis(initialAnalysis)
      setNewDataPoint({ category: '', value: '' })
      toast.success('Analysis reset')
    }
  }

  // Load sample data
  const handleLoadSample = () => {
    const sampleData: ParetoAnalysis = {
      title: 'Defect Types in Manufacturing',
      description: 'Analysis of defect types to identify most common issues',
      valueUnit: 'defects',
      dataPoints: [
        { id: '1', category: 'Scratches', value: 145 },
        { id: '2', category: 'Misalignment', value: 98 },
        { id: '3', category: 'Missing Parts', value: 67 },
        { id: '4', category: 'Wrong Color', value: 45 },
        { id: '5', category: 'Contamination', value: 32 },
        { id: '6', category: 'Dimension Error', value: 28 },
        { id: '7', category: 'Surface Defects', value: 15 },
        { id: '8', category: 'Other', value: 12 }
      ],
      createdDate: new Date().toISOString().split('T')[0]
    }
    setAnalysis(sampleData)
    toast.success('Sample data loaded')
  }

  // Get max value for scaling
  const maxValue = useMemo(() => {
    return Math.max(...paretoData.map(p => p.value), 0)
  }, [paretoData])

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CI Tools
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pareto Analysis</h1>
            <p className="text-gray-600 mt-1">
              80/20 Rule - Identify the vital few from the trivial many
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLoadSample} variant="outline">
              Load Sample
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Pareto Analysis:</h3>
              <p className="text-sm text-blue-800">
                The Pareto Principle (80/20 Rule) states that roughly 80% of effects come from 20% of causes.
                This tool helps identify which few factors are responsible for most of the problems or results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analysis Information</CardTitle>
          <CardDescription>
            Define what you&apos;re analyzing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Analysis Title *</Label>
              <Input
                id="title"
                value={analysis.title}
                onChange={(e) => setAnalysis({ ...analysis, title: e.target.value })}
                placeholder="e.g., Defect Types, Customer Complaints, Sales by Product"
              />
            </div>
            <div>
              <Label htmlFor="valueUnit">Value Unit *</Label>
              <Input
                id="valueUnit"
                value={analysis.valueUnit}
                onChange={(e) => setAnalysis({ ...analysis, valueUnit: e.target.value })}
                placeholder="e.g., defects, complaints, dollars, units"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={analysis.description}
              onChange={(e) => setAnalysis({ ...analysis, description: e.target.value })}
              placeholder="Brief description of the analysis"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Entry */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data Points</span>
            <Badge variant="outline">
              {analysis.dataPoints.length} Categories
            </Badge>
          </CardTitle>
          <CardDescription>
            Enter your data categories and values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Data Points */}
          {analysis.dataPoints.length > 0 && (
            <div className="space-y-2 mb-4">
              {analysis.dataPoints.map((point) => (
                <div
                  key={point.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex-1 flex items-center gap-4">
                    <span className="font-medium">{point.category}</span>
                    <span className="text-gray-600">
                      {point.value} {analysis.valueUnit}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteDataPoint(point.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Data Point */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Category name"
                value={newDataPoint.category}
                onChange={(e) => setNewDataPoint({ ...newDataPoint, category: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const valueInput = e.currentTarget.nextElementSibling as HTMLInputElement
                    valueInput?.focus()
                  }
                }}
              />
            </div>
            <div className="w-40">
              <Input
                type="number"
                placeholder="Value"
                value={newDataPoint.value}
                onChange={(e) => setNewDataPoint({ ...newDataPoint, value: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddDataPoint()
                  }
                }}
              />
            </div>
            <Button onClick={handleAddDataPoint}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {paretoData.length > 0 && (
        <>
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">
                  {paretoData.reduce((sum, p) => sum + p.value, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total {analysis.valueUnit}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{paretoData.length}</div>
                <p className="text-sm text-gray-600">Categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{eightyTwentyItems.length}</div>
                <p className="text-sm text-gray-600">Vital Few (80%)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-600">
                  {paretoData.length - eightyTwentyItems.length}
                </div>
                <p className="text-sm text-gray-600">Trivial Many (20%)</p>
              </CardContent>
            </Card>
          </div>

          {/* Pareto Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Pareto Chart
              </CardTitle>
              <CardDescription>
                Bar chart with cumulative percentage line
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chart */}
                <div className="h-96 flex items-end gap-2 border-b-2 border-l-2 border-gray-300 p-4">
                  {paretoData.map((point, index) => {
                    const barHeight = (point.value / maxValue) * 100
                    const isVitalFew = eightyTwentyItems.some(item => item.id === point.id)

                    return (
                      <div key={point.id} className="flex-1 flex flex-col items-center gap-2">
                        {/* Cumulative % point */}
                        <div
                          className="relative w-full"
                          style={{ height: `${point.cumulativePercentage}%` }}
                        >
                          {index < paretoData.length - 1 && (
                            <div
                              className="absolute top-0 left-1/2 w-0.5 bg-red-500"
                              style={{
                                height: `${
                                  ((paretoData[index + 1].cumulativePercentage || 0) -
                                    (point.cumulativePercentage || 0)) *
                                  3.84
                                }px`,
                                transformOrigin: 'top'
                              }}
                            ></div>
                          )}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                          {point.cumulativePercentage === 80 || (point.cumulativePercentage || 0) > 80 && (paretoData[index-1]?.cumulativePercentage || 0) < 80 ? (
                            <div className="absolute left-full ml-2 top-0 text-xs text-red-600 font-semibold whitespace-nowrap">
                              80% Line
                            </div>
                          ) : null}
                        </div>

                        {/* Bar */}
                        <div className="w-full flex flex-col items-center">
                          <div
                            className={`w-full ${
                              isVitalFew ? 'bg-blue-500' : 'bg-gray-400'
                            } rounded-t transition-all hover:opacity-80 cursor-pointer relative group`}
                            style={{ height: `${barHeight * 3}px`, minHeight: '20px' }}
                          >
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {point.value} ({point.percentage?.toFixed(1)}%)
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2 text-center break-words max-w-full">
                            {point.category}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Vital Few (80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Trivial Many (20%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-red-500"></div>
                    <span>Cumulative %</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                Sorted data with percentages and cumulative values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-4 font-semibold">Rank</th>
                      <th className="text-left py-2 px-4 font-semibold">Category</th>
                      <th className="text-right py-2 px-4 font-semibold">Value</th>
                      <th className="text-right py-2 px-4 font-semibold">%</th>
                      <th className="text-right py-2 px-4 font-semibold">Cumulative %</th>
                      <th className="text-center py-2 px-4 font-semibold">Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paretoData.map((point, index) => {
                      const isVitalFew = eightyTwentyItems.some(item => item.id === point.id)

                      return (
                        <tr key={point.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 font-medium">{point.category}</td>
                          <td className="py-2 px-4 text-right">
                            {point.value.toLocaleString()} {analysis.valueUnit}
                          </td>
                          <td className="py-2 px-4 text-right">{point.percentage?.toFixed(1)}%</td>
                          <td className="py-2 px-4 text-right font-semibold">
                            {point.cumulativePercentage?.toFixed(1)}%
                          </td>
                          <td className="py-2 px-4 text-center">
                            <Badge variant={isVitalFew ? 'default' : 'secondary'}>
                              {isVitalFew ? 'Vital Few' : 'Trivial Many'}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Vital Few (80% of total):</h4>
                <p className="text-sm text-green-800 mb-2">
                  Focus your improvement efforts on these {eightyTwentyItems.length} categories:
                </p>
                <ul className="space-y-1">
                  {eightyTwentyItems.map((item) => (
                    <li key={item.id} className="text-sm text-green-800">
                      • <span className="font-medium">{item.category}</span>: {item.value}{' '}
                      {analysis.valueUnit} ({item.percentage?.toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    ✓ <span className="font-medium">Prioritize</span> the vital few categories for
                    immediate action
                  </li>
                  <li>
                    ✓ <span className="font-medium">Allocate resources</span> based on the 80/20
                    distribution
                  </li>
                  <li>
                    ✓ <span className="font-medium">Set targets</span> to reduce the top categories
                  </li>
                  <li>
                    ✓ <span className="font-medium">Monitor progress</span> and re-analyze
                    periodically
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
