'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Beaker, Plus, Trash2, Download, Play, BarChart3, TrendingUp, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { generateFullFactorialDesign, calculateMainEffects, type Factor, type Response, type RunData } from '@/lib/calculations/doe'

/**
 * Design of Experiments (DOE) - Phase 4 Sprint 4
 * UI for existing calculation library
 * Full factorial design, ANOVA, main effects, interactions
 */

type DesignType = 'full_factorial' | 'fractional_factorial' | '2_level'

interface DOEExperiment {
  id: string
  name: string
  designType: DesignType
  factors: Factor[]
  responses: Response[]
  designMatrix: number[][]
  runData: RunData[]
  status: 'design' | 'data_collection' | 'analysis' | 'completed'
}

const initialExperiments: DOEExperiment[] = []

export default function DOEPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  const [experiments, setExperiments] = useState<DOEExperiment[]>(initialExperiments)
  const [selectedExperiment, setSelectedExperiment] = useState<DOEExperiment | null>(null)
  const [activeTab, setActiveTab] = useState('experiments')
  
  // New experiment form
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    designType: '2_level' as DesignType,
    factors: [] as Factor[],
    responses: [] as Response[]
  })

  // New factor form
  const [newFactor, setNewFactor] = useState({
    name: '',
    symbol: '',
    type: 'continuous' as 'continuous' | 'discrete',
    levels: 2,
    lowValue: 0,
    highValue: 1,
    unit: ''
  })

  // New response form
  const [newResponse, setNewResponse] = useState({
    name: '',
    target: 'maximize' as 'maximize' | 'minimize' | 'target',
    targetValue: 0,
    unit: ''
  })

  // Add factor to new experiment
  const handleAddFactor = () => {
    if (!newFactor.name.trim() || !newFactor.symbol.trim()) {
      toast.error('Please provide factor name and symbol')
      return
    }

    const factor: Factor = {
      id: Date.now().toString(),
      ...newFactor
    }

    setNewExperiment({
      ...newExperiment,
      factors: [...newExperiment.factors, factor]
    })

    setNewFactor({
      name: '',
      symbol: '',
      type: 'continuous',
      levels: 2,
      lowValue: 0,
      highValue: 1,
      unit: ''
    })

    toast.success('Factor added')
  }

  // Add response to new experiment
  const handleAddResponse = () => {
    if (!newResponse.name.trim()) {
      toast.error('Please provide response name')
      return
    }

    const response: Response = {
      id: Date.now().toString(),
      ...newResponse
    }

    setNewExperiment({
      ...newExperiment,
      responses: [...newExperiment.responses, response]
    })

    setNewResponse({
      name: '',
      target: 'maximize',
      targetValue: 0,
      unit: ''
    })

    toast.success('Response added')
  }

  // Generate design matrix
  const handleGenerateDesign = () => {
    if (!newExperiment.name.trim()) {
      toast.error('Please provide experiment name')
      return
    }

    if (newExperiment.factors.length < 2) {
      toast.error('Please add at least 2 factors')
      return
    }

    if (newExperiment.responses.length < 1) {
      toast.error('Please add at least 1 response')
      return
    }

    try {
      // Generate design matrix
      const designMatrix = generateFullFactorialDesign(newExperiment.factors)

      // Create run data template
      const runData: RunData[] = designMatrix.map((row, index) => {
        const factorValues: Record<string, number> = {}
        newExperiment.factors.forEach((factor, factorIndex) => {
          factorValues[factor.id] = row[factorIndex]
        })

        const responseValues: Record<string, number> = {}
        newExperiment.responses.forEach(response => {
          responseValues[response.id] = 0
        })

        return {
          runNumber: index + 1,
          factorValues,
          responseValues,
          standardOrder: index + 1,
          randomOrder: index + 1
        }
      })

      const experiment: DOEExperiment = {
        id: Date.now().toString(),
        name: newExperiment.name,
        designType: newExperiment.designType,
        factors: newExperiment.factors,
        responses: newExperiment.responses,
        designMatrix,
        runData,
        status: 'data_collection'
      }

      setExperiments([experiment, ...experiments])
      setSelectedExperiment(experiment)
      setNewExperiment({
        name: '',
        designType: '2_level',
        factors: [],
        responses: []
      })
      setActiveTab('design')
      toast.success('Design matrix generated!')
    } catch (error) {
      toast.error('Error generating design')
      console.error(error)
    }
  }

  // Update run data
  const handleUpdateRunData = (runIndex: number, responseId: string, value: number) => {
    if (!selectedExperiment) return

    const updatedRunData = [...selectedExperiment.runData]
    updatedRunData[runIndex].responseValues[responseId] = value

    const updatedExperiment = {
      ...selectedExperiment,
      runData: updatedRunData
    }

    setSelectedExperiment(updatedExperiment)
    setExperiments(experiments.map(exp => 
      exp.id === selectedExperiment.id ? updatedExperiment : exp
    ))
  }

  // Analyze results
  const handleAnalyze = () => {
    if (!selectedExperiment) return

    // Check if all data is entered
    const allDataEntered = selectedExperiment.runData.every(run =>
      selectedExperiment.responses.every(response => 
        run.responseValues[response.id] !== 0
      )
    )

    if (!allDataEntered) {
      toast.error('Please enter all run data before analysis')
      return
    }

    const updatedExperiment = {
      ...selectedExperiment,
      status: 'analysis' as const
    }

    setSelectedExperiment(updatedExperiment)
    setExperiments(experiments.map(exp => 
      exp.id === selectedExperiment.id ? updatedExperiment : exp
    ))

    toast.success('Analysis complete!')
  }

  // Calculate effects for selected response
  const calculateEffects = (responseId: string) => {
    if (!selectedExperiment) return null

    // Extract response data
    const responseData = selectedExperiment.runData.map(run => 
      run.responseValues[responseId]
    )

    // For 2-level designs, calculate effects
    if (selectedExperiment.designType === '2_level' && selectedExperiment.factors.length <= 5) {
      try {
        const effects = calculateMainEffects(
          selectedExperiment.designMatrix,
          responseData,
          selectedExperiment.factors.map(f => f.symbol)
        )
        return effects
      } catch (error) {
        console.error('Error calculating effects:', error)
        return null
      }
    }

    return null
  }

  // Delete experiment
  const handleDeleteExperiment = (id: string) => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      setExperiments(experiments.filter(exp => exp.id !== id))
      if (selectedExperiment?.id === id) {
        setSelectedExperiment(null)
      }
      toast.success('Experiment deleted')
    }
  }

  // Export
  const handleExport = () => {
    const exportData = {
      experiments,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `doe-experiments-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Experiments exported')
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Six Sigma Tools
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Beaker className="h-8 w-8 text-purple-600" />
              Design of Experiments (DOE)
            </h1>
            <p className="text-gray-600 mt-1">
              Factorial designs, ANOVA, and optimization
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">{experiments.length}</div>
              <p className="text-sm text-gray-600">Total Experiments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {experiments.filter(e => e.status === 'data_collection').length}
              </div>
              <p className="text-sm text-gray-600">Data Collection</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {experiments.filter(e => e.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {experiments.reduce((sum, exp) => sum + exp.runData.length, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Runs</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="design">Design Matrix</TabsTrigger>
          <TabsTrigger value="data">Run Data</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Experiments Tab */}
        <TabsContent value="experiments" className="mt-6 space-y-6">
          {/* Create New Experiment */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Experiment</CardTitle>
              <CardDescription>Define factors and responses for your DOE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expName">Experiment Name *</Label>
                  <Input
                    id="expName"
                    value={newExperiment.name}
                    onChange={(e) => setNewExperiment({ ...newExperiment, name: e.target.value })}
                    placeholder="Process Optimization Study"
                  />
                </div>
                <div>
                  <Label htmlFor="designType">Design Type</Label>
                  <Select
                    value={newExperiment.designType}
                    onValueChange={(value: DesignType) => setNewExperiment({ ...newExperiment, designType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2_level">2-Level Factorial</SelectItem>
                      <SelectItem value="full_factorial">Full Factorial</SelectItem>
                      <SelectItem value="fractional_factorial">Fractional Factorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Factor */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Add Factor ({newExperiment.factors.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <Input
                    placeholder="Factor name"
                    value={newFactor.name}
                    onChange={(e) => setNewFactor({ ...newFactor, name: e.target.value })}
                  />
                  <Input
                    placeholder="Symbol (A, B, C)"
                    value={newFactor.symbol}
                    onChange={(e) => setNewFactor({ ...newFactor, symbol: e.target.value.toUpperCase() })}
                  />
                  <Input
                    type="number"
                    placeholder="Low value"
                    value={newFactor.lowValue}
                    onChange={(e) => setNewFactor({ ...newFactor, lowValue: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="High value"
                    value={newFactor.highValue}
                    onChange={(e) => setNewFactor({ ...newFactor, highValue: Number(e.target.value) })}
                  />
                </div>
                <Button size="sm" onClick={handleAddFactor}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Factor
                </Button>

                {newExperiment.factors.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newExperiment.factors.map((factor) => (
                      <div key={factor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{factor.symbol}: {factor.name}</span>
                        <span className="text-sm text-gray-600">
                          {factor.lowValue} to {factor.highValue} {factor.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setNewExperiment({
                            ...newExperiment,
                            factors: newExperiment.factors.filter(f => f.id !== factor.id)
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Response */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Add Response ({newExperiment.responses.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <Input
                    placeholder="Response name"
                    value={newResponse.name}
                    onChange={(e) => setNewResponse({ ...newResponse, name: e.target.value })}
                  />
                  <Select
                    value={newResponse.target}
                    onValueChange={(value: 'maximize' | 'minimize' | 'target') => 
                      setNewResponse({ ...newResponse, target: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maximize">Maximize</SelectItem>
                      <SelectItem value="minimize">Minimize</SelectItem>
                      <SelectItem value="target">Target Value</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Unit"
                    value={newResponse.unit}
                    onChange={(e) => setNewResponse({ ...newResponse, unit: e.target.value })}
                  />
                </div>
                <Button size="sm" onClick={handleAddResponse}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Response
                </Button>

                {newExperiment.responses.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newExperiment.responses.map((response) => (
                      <div key={response.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{response.name}</span>
                        <span className="text-sm text-gray-600 capitalize">
                          {response.target} {response.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setNewExperiment({
                            ...newExperiment,
                            responses: newExperiment.responses.filter(r => r.id !== response.id)
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleGenerateDesign} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Generate Design Matrix
              </Button>
            </CardContent>
          </Card>

          {/* Experiments List */}
          <Card>
            <CardHeader>
              <CardTitle>My Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              {experiments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Beaker className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No experiments yet. Create one above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {experiments.map((exp) => (
                    <Card 
                      key={exp.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedExperiment(exp)
                        setActiveTab('design')
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{exp.designType.replace('_', ' ')}</Badge>
                              <Badge className={
                                exp.status === 'completed' ? 'bg-green-100 text-green-800' :
                                exp.status === 'analysis' ? 'bg-purple-100 text-purple-800' :
                                exp.status === 'data_collection' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {exp.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg">{exp.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {exp.factors.length} factors × {exp.responses.length} responses = {exp.runData.length} runs
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteExperiment(exp.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Matrix Tab */}
        <TabsContent value="design" className="mt-6">
          {selectedExperiment ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedExperiment.name} - Design Matrix</CardTitle>
                <CardDescription>
                  {selectedExperiment.runData.length} experimental runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Run #</th>
                        {selectedExperiment.factors.map(factor => (
                          <th key={factor.id} className="text-left p-2">{factor.symbol}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExperiment.runData.map((run, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{run.runNumber}</td>
                          {selectedExperiment.factors.map(factor => (
                            <td key={factor.id} className="p-2">
                              {run.factorValues[factor.id].toFixed(2)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Beaker className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select an experiment to view design matrix</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Run Data Tab */}
        <TabsContent value="data" className="mt-6">
          {selectedExperiment ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedExperiment.name} - Run Data Entry</CardTitle>
                <CardDescription>
                  Enter response values for each experimental run
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Run #</th>
                        {selectedExperiment.factors.map(factor => (
                          <th key={factor.id} className="text-left p-2">{factor.symbol}</th>
                        ))}
                        {selectedExperiment.responses.map(response => (
                          <th key={response.id} className="text-left p-2 text-green-700">
                            {response.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExperiment.runData.map((run, runIndex) => (
                        <tr key={runIndex} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{run.runNumber}</td>
                          {selectedExperiment.factors.map(factor => (
                            <td key={factor.id} className="p-2">
                              {run.factorValues[factor.id].toFixed(2)}
                            </td>
                          ))}
                          {selectedExperiment.responses.map(response => (
                            <td key={response.id} className="p-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={run.responseValues[response.id] || ''}
                                onChange={(e) => handleUpdateRunData(
                                  runIndex,
                                  response.id,
                                  Number(e.target.value)
                                )}
                                className="w-24"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button onClick={handleAnalyze} className="mt-4">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Results
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Beaker className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select an experiment to enter run data</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-6">
          {selectedExperiment && selectedExperiment.status !== 'design' ? (
            <div className="space-y-6">
              {selectedExperiment.responses.map(response => {
                const effects = calculateEffects(response.id)

                return (
                  <Card key={response.id}>
                    <CardHeader>
                      <CardTitle>Analysis: {response.name}</CardTitle>
                      <CardDescription>
                        Main effects and significance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {effects && effects.length > 0 ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Main Effects</h3>
                            <div className="space-y-2">
                              {effects.slice(0, selectedExperiment.factors.length).map(effect => (
                                <div key={effect.factor} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{effect.factor}</span>
                                    <span className="text-sm text-gray-600 ml-2">
                                      Effect: {effect.effect.toFixed(3)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      {effect.percentContribution.toFixed(1)}%
                                    </span>
                                    {effect.significant && (
                                      <Badge variant="default" className="bg-green-100 text-green-800">
                                        Significant
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {effects.length > selectedExperiment.factors.length && (
                            <div>
                              <h3 className="font-semibold mb-2">Interaction Effects</h3>
                              <div className="space-y-2">
                                {effects.slice(selectedExperiment.factors.length).map(effect => (
                                  <div key={effect.factor} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                                    <div>
                                      <span className="font-medium">{effect.factor}</span>
                                      <span className="text-sm text-gray-600 ml-2">
                                        Effect: {effect.effect.toFixed(3)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">
                                        {effect.percentContribution.toFixed(1)}%
                                      </span>
                                      {effect.significant && (
                                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                                          Significant
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">No analysis available. Ensure all run data is entered.</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Enter run data and click &quot;Analyze Results&quot; to see analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
