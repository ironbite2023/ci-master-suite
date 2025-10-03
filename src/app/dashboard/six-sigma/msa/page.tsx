'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ruler, Plus, Trash2, Download, Calculator, BarChart3, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

/**
 * MSA (Measurement System Analysis) - Phase 4 Sprint 4
 * Gage R&R, repeatability/reproducibility, variance components
 */

interface Measurement {
  partId: string
  operatorId: string
  trial: number
  value: number
}

interface MSAStudy {
  id: string
  name: string
  studyType: 'gage_rr' | 'bias' | 'linearity'
  parts: string[]
  operators: string[]
  trials: number
  measurements: Measurement[]
  specifications: {
    usl: number | null
    lsl: number | null
    tolerance: number | null
  }
  results: {
    totalVariation: number
    equipmentVariation: number
    appraiserVariation: number
    partToPartVariation: number
    rrPercent: number
    equipmentPercent: number
    appraiserPercent: number
    acceptable: boolean
  } | null
  status: 'setup' | 'data_collection' | 'complete'
}

const initialStudies: MSAStudy[] = []

export default function MSAPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  const [studies, setStudies] = useState<MSAStudy[]>(initialStudies)
  const [selectedStudy, setSelectedStudy] = useState<MSAStudy | null>(null)
  const [activeTab, setActiveTab] = useState('studies')

  // New study form
  const [newStudy, setNewStudy] = useState({
    name: '',
    studyType: 'gage_rr' as 'gage_rr' | 'bias' | 'linearity',
    numParts: 10,
    numOperators: 3,
    trials: 2,
    usl: null as number | null,
    lsl: null as number | null
  })

  // Create new study
  const handleCreateStudy = () => {
    if (!newStudy.name.trim()) {
      toast.error('Please provide study name')
      return
    }

    const parts = Array.from({ length: newStudy.numParts }, (_, i) => `Part ${i + 1}`)
    const operators = Array.from({ length: newStudy.numOperators }, (_, i) => `Operator ${String.fromCharCode(65 + i)}`)

    // Generate measurement template
    const measurements: Measurement[] = []
    for (const partId of parts) {
      for (const operatorId of operators) {
        for (let trial = 1; trial <= newStudy.trials; trial++) {
          measurements.push({
            partId,
            operatorId,
            trial,
            value: 0
          })
        }
      }
    }

    const tolerance = newStudy.usl !== null && newStudy.lsl !== null 
      ? newStudy.usl - newStudy.lsl 
      : null

    const study: MSAStudy = {
      id: Date.now().toString(),
      name: newStudy.name,
      studyType: newStudy.studyType,
      parts,
      operators,
      trials: newStudy.trials,
      measurements,
      specifications: {
        usl: newStudy.usl,
        lsl: newStudy.lsl,
        tolerance
      },
      results: null,
      status: 'data_collection'
    }

    setStudies([study, ...studies])
    setSelectedStudy(study)
    setNewStudy({
      name: '',
      studyType: 'gage_rr',
      numParts: 10,
      numOperators: 3,
      trials: 2,
      usl: null,
      lsl: null
    })
    setActiveTab('data')
    toast.success('MSA study created!')
  }

  // Update measurement value
  const handleUpdateMeasurement = (index: number, value: number) => {
    if (!selectedStudy) return

    const updatedMeasurements = [...selectedStudy.measurements]
    updatedMeasurements[index].value = value

    const updatedStudy = {
      ...selectedStudy,
      measurements: updatedMeasurements
    }

    setSelectedStudy(updatedStudy)
    setStudies(studies.map(s => s.id === selectedStudy.id ? updatedStudy : s))
  }

  // Calculate Gage R&R
  const handleCalculate = () => {
    if (!selectedStudy) return

    // Check if all data is entered
    const allDataEntered = selectedStudy.measurements.every(m => m.value !== 0)
    if (!allDataEntered) {
      toast.error('Please enter all measurement data')
      return
    }

    try {
      // Calculate statistics
      const { parts, operators, trials, measurements } = selectedStudy

      // Group measurements
      const measurementsByPart = new Map<string, number[]>()
      measurements.forEach(m => {
        if (!measurementsByPart.has(m.partId)) {
          measurementsByPart.set(m.partId, [])
        }
        measurementsByPart.get(m.partId)!.push(m.value)
      })

      // Calculate ranges for each part
      const ranges = Array.from(measurementsByPart.values()).map(values => {
        return Math.max(...values) - Math.min(...values)
      })
      const avgRange = ranges.reduce((sum, r) => sum + r, 0) / ranges.length

      // Calculate Equipment Variation (EV) - Repeatability
      const d2 = trials === 2 ? 1.128 : trials === 3 ? 1.693 : 2.059 // d2 factors
      const equipmentVariation = avgRange / d2

      // Calculate Appraiser Variation (AV) - Reproducibility  
      // Simplified calculation - in real study would use more complex ANOVA
      const operatorAverages = operators.map(op => {
        const opMeasurements = measurements.filter(m => m.operatorId === op)
        return opMeasurements.reduce((sum, m) => sum + m.value, 0) / opMeasurements.length
      })
      const maxOpAvg = Math.max(...operatorAverages)
      const minOpAvg = Math.min(...operatorAverages)
      const rangeOperators = maxOpAvg - minOpAvg
      
      const appraiserVariation = Math.sqrt(Math.max(
        0,
        Math.pow(rangeOperators / d2, 2) - Math.pow(equipmentVariation, 2) / (parts.length * trials)
      ))

      // Calculate Part-to-Part Variation (PV)
      const partAverages = parts.map(part => {
        const partMeasurements = measurements.filter(m => m.partId === part)
        return partMeasurements.reduce((sum, m) => sum + m.value, 0) / partMeasurements.length
      })
      const Rp = Math.max(...partAverages) - Math.min(...partAverages)
      const partToPartVariation = Rp * 0.5908 // Using K3 factor for range method

      // Calculate total variation
      const rrVariation = Math.sqrt(
        Math.pow(equipmentVariation, 2) + Math.pow(appraiserVariation, 2)
      )
      const totalVariation = Math.sqrt(
        Math.pow(rrVariation, 2) + Math.pow(partToPartVariation, 2)
      )

      // Calculate percentages
      const rrPercent = (rrVariation / totalVariation) * 100
      const equipmentPercent = (equipmentVariation / totalVariation) * 100
      const appraiserPercent = (appraiserVariation / totalVariation) * 100

      // Determine acceptability (< 10% excellent, < 30% acceptable, >= 30% unacceptable)
      const acceptable = rrPercent < 30

      const results = {
        totalVariation,
        equipmentVariation,
        appraiserVariation,
        partToPartVariation,
        rrPercent,
        equipmentPercent,
        appraiserPercent,
        acceptable
      }

      const updatedStudy = {
        ...selectedStudy,
        results,
        status: 'complete' as const
      }

      setSelectedStudy(updatedStudy)
      setStudies(studies.map(s => s.id === selectedStudy.id ? updatedStudy : s))
      setActiveTab('results')
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error('Error calculating Gage R&R')
      console.error(error)
    }
  }

  // Delete study
  const handleDeleteStudy = (id: string) => {
    if (confirm('Are you sure you want to delete this study?')) {
      setStudies(studies.filter(s => s.id !== id))
      if (selectedStudy?.id === id) {
        setSelectedStudy(null)
      }
      toast.success('Study deleted')
    }
  }

  // Export
  const handleExport = () => {
    const exportData = {
      studies,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `msa-studies-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Studies exported')
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
              <Ruler className="h-8 w-8 text-blue-600" />
              Measurement System Analysis (MSA)
            </h1>
            <p className="text-gray-600 mt-1">
              Gage R&R and measurement system capability
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
              <div className="text-2xl font-bold text-gray-900">{studies.length}</div>
              <p className="text-sm text-gray-600">Total Studies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {studies.filter(s => s.status === 'data_collection').length}
              </div>
              <p className="text-sm text-gray-600">Data Collection</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {studies.filter(s => s.status === 'complete' && s.results?.acceptable).length}
              </div>
              <p className="text-sm text-gray-600">Acceptable</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {studies.filter(s => s.status === 'complete' && !s.results?.acceptable).length}
              </div>
              <p className="text-sm text-gray-600">Unacceptable</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="studies">Studies</TabsTrigger>
          <TabsTrigger value="data">Data Entry</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        {/* Studies Tab */}
        <TabsContent value="studies" className="mt-6 space-y-6">
          {/* Create New Study */}
          <Card>
            <CardHeader>
              <CardTitle>Create New MSA Study</CardTitle>
              <CardDescription>Define your measurement system analysis parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studyName">Study Name *</Label>
                  <Input
                    id="studyName"
                    value={newStudy.name}
                    onChange={(e) => setNewStudy({ ...newStudy, name: e.target.value })}
                    placeholder="Caliper Measurement Study"
                  />
                </div>
                <div>
                  <Label htmlFor="studyType">Study Type</Label>
                  <select
                    id="studyType"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={newStudy.studyType}
                    onChange={(e) => setNewStudy({ ...newStudy, studyType: e.target.value as MSAStudy['studyType'] })}
                  >
                    <option value="gage_rr">Gage R&R</option>
                    <option value="bias">Bias Study</option>
                    <option value="linearity">Linearity Study</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numParts">Number of Parts</Label>
                  <Input
                    id="numParts"
                    type="number"
                    min="5"
                    max="25"
                    value={newStudy.numParts}
                    onChange={(e) => setNewStudy({ ...newStudy, numParts: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 10</p>
                </div>
                <div>
                  <Label htmlFor="numOperators">Number of Operators</Label>
                  <Input
                    id="numOperators"
                    type="number"
                    min="2"
                    max="5"
                    value={newStudy.numOperators}
                    onChange={(e) => setNewStudy({ ...newStudy, numOperators: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 3</p>
                </div>
                <div>
                  <Label htmlFor="trials">Trials per Part</Label>
                  <Input
                    id="trials"
                    type="number"
                    min="2"
                    max="5"
                    value={newStudy.trials}
                    onChange={(e) => setNewStudy({ ...newStudy, trials: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 2-3</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lsl">Lower Spec Limit (LSL)</Label>
                  <Input
                    id="lsl"
                    type="number"
                    step="0.001"
                    value={newStudy.lsl || ''}
                    onChange={(e) => setNewStudy({ ...newStudy, lsl: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="usl">Upper Spec Limit (USL)</Label>
                  <Input
                    id="usl"
                    type="number"
                    step="0.001"
                    value={newStudy.usl || ''}
                    onChange={(e) => setNewStudy({ ...newStudy, usl: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <Button onClick={handleCreateStudy} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Study
              </Button>
            </CardContent>
          </Card>

          {/* Studies List */}
          <Card>
            <CardHeader>
              <CardTitle>My MSA Studies</CardTitle>
            </CardHeader>
            <CardContent>
              {studies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Ruler className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No studies yet. Create one above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studies.map((study) => (
                    <Card 
                      key={study.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedStudy(study)
                        setActiveTab('data')
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{study.studyType.replace('_', ' ')}</Badge>
                              <Badge className={
                                study.status === 'complete' 
                                  ? (study.results?.acceptable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                                  : 'bg-blue-100 text-blue-800'
                              }>
                                {study.status === 'complete' 
                                  ? (study.results?.acceptable ? 'Acceptable' : 'Unacceptable')
                                  : study.status.replace('_', ' ')
                                }
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg">{study.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {study.parts.length} parts × {study.operators.length} operators × {study.trials} trials = {study.measurements.length} measurements
                            </p>
                            {study.results && (
                              <p className="text-sm font-medium mt-2 text-blue-600">
                                R&R: {study.results.rrPercent.toFixed(1)}%
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteStudy(study.id)
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

        {/* Data Entry Tab */}
        <TabsContent value="data" className="mt-6">
          {selectedStudy ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedStudy.name} - Data Entry</CardTitle>
                <CardDescription>
                  Enter measurement values for each part, operator, and trial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Part</th>
                        <th className="text-left p-2">Operator</th>
                        <th className="text-left p-2">Trial</th>
                        <th className="text-left p-2">Measurement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudy.measurements.map((measurement, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{measurement.partId}</td>
                          <td className="p-2">{measurement.operatorId}</td>
                          <td className="p-2">{measurement.trial}</td>
                          <td className="p-2">
                            <Input
                              type="number"
                              step="0.001"
                              value={measurement.value || ''}
                              onChange={(e) => handleUpdateMeasurement(index, Number(e.target.value))}
                              className="w-32"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button onClick={handleCalculate} className="mt-4">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Gage R&R
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Ruler className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select a study to enter measurement data</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="mt-6">
          {selectedStudy && selectedStudy.results ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedStudy.name} - Results</CardTitle>
                  <CardDescription>
                    Gage R&R Analysis Results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall Result */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                      <div>
                        <h3 className="font-semibold text-lg">Measurement System</h3>
                        <p className="text-sm text-gray-600">Gage R&R: {selectedStudy.results.rrPercent.toFixed(1)}%</p>
                      </div>
                      <Badge className={
                        selectedStudy.results.rrPercent < 10 ? 'bg-green-100 text-green-800' :
                        selectedStudy.results.rrPercent < 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedStudy.results.rrPercent < 10 ? 'Excellent' :
                         selectedStudy.results.rrPercent < 30 ? 'Acceptable' :
                         'Unacceptable'}
                      </Badge>
                    </div>

                    {/* Variance Components */}
                    <div>
                      <h3 className="font-semibold mb-4">Variance Components</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Equipment Variation (Repeatability)</span>
                            <span className="font-medium">{selectedStudy.results.equipmentPercent.toFixed(1)}%</span>
                          </div>
                          <Progress value={selectedStudy.results.equipmentPercent} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Appraiser Variation (Reproducibility)</span>
                            <span className="font-medium">{selectedStudy.results.appraiserPercent.toFixed(1)}%</span>
                          </div>
                          <Progress value={selectedStudy.results.appraiserPercent} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Part-to-Part Variation</span>
                            <span className="font-medium">
                              {(100 - selectedStudy.results.rrPercent).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={100 - selectedStudy.results.rrPercent} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Interpretation Guidelines</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• <strong>&lt; 10%:</strong> Excellent measurement system</li>
                        <li>• <strong>10-30%:</strong> Acceptable for some applications</li>
                        <li>• <strong>&gt; 30%:</strong> Unacceptable - system improvement needed</li>
                      </ul>
                    </div>

                    {/* Recommendations */}
                    {!selectedStudy.results.acceptable && (
                      <div className="bg-red-50 p-4 rounded">
                        <h4 className="font-semibold mb-2 text-red-800">Recommendations</h4>
                        <ul className="text-sm space-y-1 text-red-700">
                          <li>• Calibrate measurement equipment</li>
                          <li>• Provide additional operator training</li>
                          <li>• Review measurement procedure</li>
                          <li>• Consider equipment upgrade</li>
                          <li>• Implement better fixtures/work-holding</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Calculate Gage R&R to see results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report" className="mt-6">
          {selectedStudy && selectedStudy.results ? (
            <Card>
              <CardHeader>
                <CardTitle>MSA Report - {selectedStudy.name}</CardTitle>
                <CardDescription>Complete measurement system analysis report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Study Configuration</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Study Type:</span>
                        <span className="ml-2 font-medium">{selectedStudy.studyType.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Parts:</span>
                        <span className="ml-2 font-medium">{selectedStudy.parts.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Operators:</span>
                        <span className="ml-2 font-medium">{selectedStudy.operators.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Trials:</span>
                        <span className="ml-2 font-medium">{selectedStudy.trials}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Summary Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Variation:</span>
                        <span className="ml-2 font-medium">{selectedStudy.results.totalVariation.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">R&R Variation:</span>
                        <span className="ml-2 font-medium">{Math.sqrt(
                          Math.pow(selectedStudy.results.equipmentVariation, 2) + 
                          Math.pow(selectedStudy.results.appraiserVariation, 2)
                        ).toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Equipment (EV):</span>
                        <span className="ml-2 font-medium">{selectedStudy.results.equipmentVariation.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Appraiser (AV):</span>
                        <span className="ml-2 font-medium">{selectedStudy.results.appraiserVariation.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Part-to-Part (PV):</span>
                        <span className="ml-2 font-medium">{selectedStudy.results.partToPartVariation.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Conclusion</h3>
                    <div className={`p-4 rounded ${
                      selectedStudy.results.acceptable ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <p className={
                        selectedStudy.results.acceptable ? 'text-green-800' : 'text-red-800'
                      }>
                        {selectedStudy.results.acceptable 
                          ? `The measurement system is ACCEPTABLE with a Gage R&R of ${selectedStudy.results.rrPercent.toFixed(1)}%.`
                          : `The measurement system is UNACCEPTABLE with a Gage R&R of ${selectedStudy.results.rrPercent.toFixed(1)}%. Improvement is required before using this system for production measurements.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Ruler className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Complete a study to generate report</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
