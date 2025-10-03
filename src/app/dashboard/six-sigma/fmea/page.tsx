'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Plus, Trash2, Download, TrendingDown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

/**
 * FMEA (Failure Mode & Effects Analysis) - Phase 4 Sprint 4
 * Risk assessment with S×O×D=RPN, action planning, before/after comparison
 */

interface Action {
  id: string
  description: string
  responsibility: string
  targetDate: string
  status: 'planned' | 'in_progress' | 'completed'
  completedDate: string
}

interface FailureMode {
  id: string
  processStep: string
  potentialFailureMode: string
  potentialEffects: string
  severity: number
  potentialCauses: string
  occurrence: number
  currentControls: string
  detection: number
  rpn: number
  actions: Action[]
  
  // After actions
  severityAfter: number | null
  occurrenceAfter: number | null
  detectionAfter: number | null
  rpnAfter: number | null
}

interface FMEAStudy {
  id: string
  name: string
  fmeaType: 'process' | 'design' | 'system'
  product: string
  team: string
  date: string
  failureModes: FailureMode[]
  rpnThreshold: number
}

const initialStudies: FMEAStudy[] = []

export default function FMEAPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  const [studies, setStudies] = useState<FMEAStudy[]>(initialStudies)
  const [selectedStudy, setSelectedStudy] = useState<FMEAStudy | null>(null)
  const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode | null>(null)
  const [activeTab, setActiveTab] = useState('studies')

  // New study form
  const [newStudy, setNewStudy] = useState({
    name: '',
    fmeaType: 'process' as 'process' | 'design' | 'system',
    product: '',
    team: '',
    rpnThreshold: 100
  })

  // New failure mode form
  const [newFailureMode, setNewFailureMode] = useState({
    processStep: '',
    potentialFailureMode: '',
    potentialEffects: '',
    severity: 5,
    potentialCauses: '',
    occurrence: 5,
    currentControls: '',
    detection: 5
  })

  // New action form
  const [newAction, setNewAction] = useState({
    description: '',
    responsibility: '',
    targetDate: ''
  })

  // Create new study
  const handleCreateStudy = () => {
    if (!newStudy.name.trim() || !newStudy.product.trim()) {
      toast.error('Please provide study name and product')
      return
    }

    const study: FMEAStudy = {
      id: Date.now().toString(),
      ...newStudy,
      date: new Date().toISOString().split('T')[0],
      failureModes: []
    }

    setStudies([study, ...studies])
    setSelectedStudy(study)
    setNewStudy({
      name: '',
      fmeaType: 'process',
      product: '',
      team: '',
      rpnThreshold: 100
    })
    setActiveTab('failure-modes')
    toast.success('FMEA study created!')
  }

  // Add failure mode
  const handleAddFailureMode = () => {
    if (!selectedStudy) return

    if (!newFailureMode.processStep.trim() || !newFailureMode.potentialFailureMode.trim()) {
      toast.error('Please provide process step and failure mode')
      return
    }

    const rpn = newFailureMode.severity * newFailureMode.occurrence * newFailureMode.detection

    const failureMode: FailureMode = {
      id: Date.now().toString(),
      ...newFailureMode,
      rpn,
      actions: [],
      severityAfter: null,
      occurrenceAfter: null,
      detectionAfter: null,
      rpnAfter: null
    }

    const updatedStudy = {
      ...selectedStudy,
      failureModes: [...selectedStudy.failureModes, failureMode]
    }

    setSelectedStudy(updatedStudy)
    setStudies(studies.map(s => s.id === selectedStudy.id ? updatedStudy : s))
    setSelectedFailureMode(failureMode)
    setNewFailureMode({
      processStep: '',
      potentialFailureMode: '',
      potentialEffects: '',
      severity: 5,
      potentialCauses: '',
      occurrence: 5,
      currentControls: '',
      detection: 5
    })
    toast.success('Failure mode added')
  }

  // Add action to failure mode
  const handleAddAction = (failureModeId: string) => {
    if (!selectedStudy) return

    if (!newAction.description.trim() || !newAction.responsibility.trim()) {
      toast.error('Please provide action description and responsibility')
      return
    }

    const action: Action = {
      id: Date.now().toString(),
      ...newAction,
      status: 'planned',
      completedDate: ''
    }

    const updatedFailureModes = selectedStudy.failureModes.map(fm =>
      fm.id === failureModeId
        ? { ...fm, actions: [...fm.actions, action] }
        : fm
    )

    const updatedStudy = {
      ...selectedStudy,
      failureModes: updatedFailureModes
    }

    setSelectedStudy(updatedStudy)
    setStudies(studies.map(s => s.id === selectedStudy.id ? updatedStudy : s))
    setNewAction({ description: '', responsibility: '', targetDate: '' })
    toast.success('Action added')
  }

  // Update after-action ratings
  const handleUpdateAfterRatings = (failureModeId: string, field: 'severityAfter' | 'occurrenceAfter' | 'detectionAfter', value: number) => {
    if (!selectedStudy) return

    const updatedFailureModes = selectedStudy.failureModes.map(fm => {
      if (fm.id === failureModeId) {
        const updated = { ...fm, [field]: value }
        // Recalculate RPN After if all three are filled
        if (updated.severityAfter !== null && updated.occurrenceAfter !== null && updated.detectionAfter !== null) {
          updated.rpnAfter = updated.severityAfter * updated.occurrenceAfter * updated.detectionAfter
        }
        return updated
      }
      return fm
    })

    const updatedStudy = {
      ...selectedStudy,
      failureModes: updatedFailureModes
    }

    setSelectedStudy(updatedStudy)
    setStudies(studies.map(s => s.id === selectedStudy.id ? updatedStudy : s))
  }

  // Get RPN color
  const getRPNColor = (rpn: number, threshold: number) => {
    if (rpn >= threshold * 2) return 'bg-red-100 text-red-800'
    if (rpn >= threshold) return 'bg-orange-100 text-orange-800'
    if (rpn >= threshold / 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  // Delete failure mode
  const handleDeleteFailureMode = (id: string) => {
    if (!selectedStudy) return
    if (confirm('Are you sure you want to delete this failure mode?')) {
      const updatedFailureModes = selectedStudy.failureModes.filter(fm => fm.id !== id)
      const updatedStudy = {
        ...selectedStudy,
        failureModes: updatedFailureModes
      }
      setSelectedStudy(updatedStudy)
      setStudies(studies.map(s => s.id === selectedStudy.id ? updatedStudy : s))
      if (selectedFailureMode?.id === id) {
        setSelectedFailureMode(null)
      }
      toast.success('Failure mode deleted')
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
    a.download = `fmea-studies-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('FMEA studies exported')
  }

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!selectedStudy) return null

    const fms = selectedStudy.failureModes
    const highRisk = fms.filter(fm => fm.rpn >= selectedStudy.rpnThreshold * 2).length
    const mediumRisk = fms.filter(fm => fm.rpn >= selectedStudy.rpnThreshold && fm.rpn < selectedStudy.rpnThreshold * 2).length
    const lowRisk = fms.filter(fm => fm.rpn < selectedStudy.rpnThreshold).length
    const totalActions = fms.reduce((sum, fm) => sum + fm.actions.length, 0)
    const completedActions = fms.reduce((sum, fm) => 
      sum + fm.actions.filter(a => a.status === 'completed').length, 0
    )
    const avgRPNBefore = fms.length > 0 ? fms.reduce((sum, fm) => sum + fm.rpn, 0) / fms.length : 0
    const fmsWithAfter = fms.filter(fm => fm.rpnAfter !== null)
    const avgRPNAfter = fmsWithAfter.length > 0 
      ? fmsWithAfter.reduce((sum, fm) => sum + (fm.rpnAfter || 0), 0) / fmsWithAfter.length 
      : null

    return {
      highRisk,
      mediumRisk,
      lowRisk,
      totalActions,
      completedActions,
      avgRPNBefore,
      avgRPNAfter,
      improvement: avgRPNAfter !== null ? ((avgRPNBefore - avgRPNAfter) / avgRPNBefore) * 100 : null
    }
  }, [selectedStudy])

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
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              FMEA Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              Failure Mode & Effects Analysis - Risk Assessment
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Statistics */}
        {selectedStudy && statistics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{statistics.highRisk}</div>
                <p className="text-sm text-gray-600">High Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">{statistics.mediumRisk}</div>
                <p className="text-sm text-gray-600">Medium Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{statistics.lowRisk}</div>
                <p className="text-sm text-gray-600">Low Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{statistics.avgRPNBefore.toFixed(0)}</div>
                <p className="text-sm text-gray-600">Avg RPN</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.completedActions}/{statistics.totalActions}
                </div>
                <p className="text-sm text-gray-600">Actions</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="studies">Studies</TabsTrigger>
          <TabsTrigger value="failure-modes">Failure Modes</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
        </TabsList>

        {/* Studies Tab */}
        <TabsContent value="studies" className="mt-6 space-y-6">
          {/* Create New Study */}
          <Card>
            <CardHeader>
              <CardTitle>Create New FMEA Study</CardTitle>
              <CardDescription>Define your failure mode analysis parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studyName">Study Name *</Label>
                  <Input
                    id="studyName"
                    value={newStudy.name}
                    onChange={(e) => setNewStudy({ ...newStudy, name: e.target.value })}
                    placeholder="Assembly Process FMEA"
                  />
                </div>
                <div>
                  <Label htmlFor="fmeaType">FMEA Type</Label>
                  <Select
                    value={newStudy.fmeaType}
                    onValueChange={(value: 'process' | 'design' | 'system') => 
                      setNewStudy({ ...newStudy, fmeaType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">Process FMEA</SelectItem>
                      <SelectItem value="design">Design FMEA</SelectItem>
                      <SelectItem value="system">System FMEA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product">Product/Process *</Label>
                  <Input
                    id="product"
                    value={newStudy.product}
                    onChange={(e) => setNewStudy({ ...newStudy, product: e.target.value })}
                    placeholder="Widget Assembly Line"
                  />
                </div>
                <div>
                  <Label htmlFor="team">Team</Label>
                  <Input
                    id="team"
                    value={newStudy.team}
                    onChange={(e) => setNewStudy({ ...newStudy, team: e.target.value })}
                    placeholder="Quality Engineering Team"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rpnThreshold">RPN Threshold</Label>
                <Input
                  id="rpnThreshold"
                  type="number"
                  value={newStudy.rpnThreshold}
                  onChange={(e) => setNewStudy({ ...newStudy, rpnThreshold: Number(e.target.value) })}
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-1">RPNs above this require action</p>
              </div>

              <Button onClick={handleCreateStudy} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create FMEA Study
              </Button>
            </CardContent>
          </Card>

          {/* Studies List */}
          <Card>
            <CardHeader>
              <CardTitle>My FMEA Studies</CardTitle>
            </CardHeader>
            <CardContent>
              {studies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No FMEA studies yet. Create one above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studies.map((study) => {
                    const highRisk = study.failureModes.filter(fm => fm.rpn >= study.rpnThreshold * 2).length

                    return (
                      <Card 
                        key={study.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedStudy(study)
                          setActiveTab('failure-modes')
                        }}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{study.fmeaType} FMEA</Badge>
                                {highRisk > 0 && (
                                  <Badge className="bg-red-100 text-red-800">
                                    {highRisk} High Risk
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-lg">{study.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {study.product} • {study.failureModes.length} failure modes
                              </p>
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
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failure Modes Tab */}
        <TabsContent value="failure-modes" className="mt-6">
          {selectedStudy ? (
            <div className="space-y-6">
              {/* Add Failure Mode */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Failure Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="processStep">Process Step *</Label>
                      <Input
                        id="processStep"
                        value={newFailureMode.processStep}
                        onChange={(e) => setNewFailureMode({ ...newFailureMode, processStep: e.target.value })}
                        placeholder="Welding Operation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="potentialFailureMode">Potential Failure Mode *</Label>
                      <Input
                        id="potentialFailureMode"
                        value={newFailureMode.potentialFailureMode}
                        onChange={(e) => setNewFailureMode({ ...newFailureMode, potentialFailureMode: e.target.value })}
                        placeholder="Incomplete weld"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="potentialEffects">Potential Effects</Label>
                    <Textarea
                      id="potentialEffects"
                      value={newFailureMode.potentialEffects}
                      onChange={(e) => setNewFailureMode({ ...newFailureMode, potentialEffects: e.target.value })}
                      placeholder="Part failure in field, customer returns"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="severity">Severity (1-10)</Label>
                      <Input
                        id="severity"
                        type="number"
                        min="1"
                        max="10"
                        value={newFailureMode.severity}
                        onChange={(e) => setNewFailureMode({ ...newFailureMode, severity: Number(e.target.value) })}
                      />
                      <p className="text-xs text-gray-500 mt-1">10 = Catastrophic</p>
                    </div>
                    <div>
                      <Label htmlFor="occurrence">Occurrence (1-10)</Label>
                      <Input
                        id="occurrence"
                        type="number"
                        min="1"
                        max="10"
                        value={newFailureMode.occurrence}
                        onChange={(e) => setNewFailureMode({ ...newFailureMode, occurrence: Number(e.target.value) })}
                      />
                      <p className="text-xs text-gray-500 mt-1">10 = Very Frequent</p>
                    </div>
                    <div>
                      <Label htmlFor="detection">Detection (1-10)</Label>
                      <Input
                        id="detection"
                        type="number"
                        min="1"
                        max="10"
                        value={newFailureMode.detection}
                        onChange={(e) => setNewFailureMode({ ...newFailureMode, detection: Number(e.target.value) })}
                      />
                      <p className="text-xs text-gray-500 mt-1">10 = Cannot Detect</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="potentialCauses">Potential Causes</Label>
                    <Textarea
                      id="potentialCauses"
                      value={newFailureMode.potentialCauses}
                      onChange={(e) => setNewFailureMode({ ...newFailureMode, potentialCauses: e.target.value })}
                      placeholder="Operator error, equipment malfunction"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentControls">Current Controls</Label>
                    <Textarea
                      id="currentControls"
                      value={newFailureMode.currentControls}
                      onChange={(e) => setNewFailureMode({ ...newFailureMode, currentControls: e.target.value })}
                      placeholder="Visual inspection, work instructions"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <span className="font-semibold">Estimated RPN:</span>
                    <Badge className={getRPNColor(
                      newFailureMode.severity * newFailureMode.occurrence * newFailureMode.detection,
                      selectedStudy.rpnThreshold
                    )}>
                      {newFailureMode.severity} × {newFailureMode.occurrence} × {newFailureMode.detection} = {newFailureMode.severity * newFailureMode.occurrence * newFailureMode.detection}
                    </Badge>
                  </div>

                  <Button onClick={handleAddFailureMode} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Failure Mode
                  </Button>
                </CardContent>
              </Card>

              {/* Failure Modes List */}
              <Card>
                <CardHeader>
                  <CardTitle>Failure Modes ({selectedStudy.failureModes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStudy.failureModes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No failure modes added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedStudy.failureModes
                        .sort((a, b) => b.rpn - a.rpn)
                        .map((fm) => (
                          <Card key={fm.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={getRPNColor(fm.rpn, selectedStudy.rpnThreshold)}>
                                      RPN: {fm.rpn}
                                    </Badge>
                                    {fm.rpnAfter && (
                                      <Badge className="bg-blue-100 text-blue-800">
                                        After: {fm.rpnAfter} ({((fm.rpn - fm.rpnAfter) / fm.rpn * 100).toFixed(0)}% ↓)
                                      </Badge>
                                    )}
                                    <Badge variant="outline">{fm.actions.length} actions</Badge>
                                  </div>
                                  <h3 className="font-semibold">{fm.processStep}: {fm.potentialFailureMode}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{fm.potentialEffects}</p>
                                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                                    <span>S: {fm.severity}</span>
                                    <span>O: {fm.occurrence}</span>
                                    <span>D: {fm.detection}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedFailureMode(fm)
                                      setActiveTab('actions')
                                    }}
                                  >
                                    Actions
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteFailureMode(fm.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select a study to add failure modes</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="mt-6">
          {selectedFailureMode ? (
            <div className="space-y-6">
              <Card>
                                 <CardHeader>
                   <CardTitle>Failure Mode: {selectedFailureMode.potentialFailureMode}</CardTitle>
                   <CardDescription>
                     Current RPN: {selectedFailureMode.rpn} (S:{selectedFailureMode.severity} × O:{selectedFailureMode.occurrence} × D:{selectedFailureMode.detection})
                   </CardDescription>
                 </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Action */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Add Corrective Action</h3>
                    <Input
                      placeholder="Action description"
                      value={newAction.description}
                      onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Responsibility"
                        value={newAction.responsibility}
                        onChange={(e) => setNewAction({ ...newAction, responsibility: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newAction.targetDate}
                        onChange={(e) => setNewAction({ ...newAction, targetDate: e.target.value })}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddAction(selectedFailureMode.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Action
                    </Button>
                  </div>

                  {/* Actions List */}
                  {selectedFailureMode.actions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Actions ({selectedFailureMode.actions.length})</h3>
                      <div className="space-y-2">
                        {selectedFailureMode.actions.map((action) => (
                          <div key={action.id} className="p-3 bg-gray-50 rounded">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{action.description}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {action.responsibility} • Due: {action.targetDate}
                                </p>
                              </div>
                              <Badge variant="outline">{action.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* After Action Ratings */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">After Actions - Expected Ratings</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Severity After</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedFailureMode.severityAfter || ''}
                          onChange={(e) => handleUpdateAfterRatings(
                            selectedFailureMode.id,
                            'severityAfter',
                            Number(e.target.value)
                          )}
                        />
                      </div>
                      <div>
                        <Label>Occurrence After</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedFailureMode.occurrenceAfter || ''}
                          onChange={(e) => handleUpdateAfterRatings(
                            selectedFailureMode.id,
                            'occurrenceAfter',
                            Number(e.target.value)
                          )}
                        />
                      </div>
                      <div>
                        <Label>Detection After</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedFailureMode.detectionAfter || ''}
                          onChange={(e) => handleUpdateAfterRatings(
                            selectedFailureMode.id,
                            'detectionAfter',
                            Number(e.target.value)
                          )}
                        />
                      </div>
                    </div>

                    {selectedFailureMode.rpnAfter && (
                      <div className="mt-4 p-4 bg-blue-50 rounded">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Expected RPN After Actions:</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gray-100 text-gray-800">
                              Before: {selectedFailureMode.rpn}
                            </Badge>
                            <span>→</span>
                            <Badge className={getRPNColor(selectedFailureMode.rpnAfter, selectedStudy?.rpnThreshold || 100)}>
                              After: {selectedFailureMode.rpnAfter}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800">
                              {((selectedFailureMode.rpn - selectedFailureMode.rpnAfter) / selectedFailureMode.rpn * 100).toFixed(0)}% reduction
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select a failure mode to manage actions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Risk Matrix Tab */}
        <TabsContent value="matrix" className="mt-6">
          {selectedStudy && selectedStudy.failureModes.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Risk Priority Matrix</CardTitle>
                <CardDescription>
                  Failure modes sorted by RPN (Risk Priority Number)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Rank</th>
                        <th className="text-left p-2">Process Step</th>
                        <th className="text-left p-2">Failure Mode</th>
                        <th className="text-center p-2">S</th>
                        <th className="text-center p-2">O</th>
                        <th className="text-center p-2">D</th>
                        <th className="text-center p-2">RPN</th>
                        <th className="text-center p-2">RPN After</th>
                        <th className="text-center p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudy.failureModes
                        .sort((a, b) => b.rpn - a.rpn)
                        .map((fm, index) => (
                          <tr key={fm.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{index + 1}</td>
                            <td className="p-2">{fm.processStep}</td>
                            <td className="p-2">{fm.potentialFailureMode}</td>
                            <td className="text-center p-2">{fm.severity}</td>
                            <td className="text-center p-2">{fm.occurrence}</td>
                            <td className="text-center p-2">{fm.detection}</td>
                            <td className="text-center p-2">
                              <Badge className={getRPNColor(fm.rpn, selectedStudy.rpnThreshold)}>
                                {fm.rpn}
                              </Badge>
                            </td>
                            <td className="text-center p-2">
                              {fm.rpnAfter ? (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {fm.rpnAfter}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="text-center p-2">{fm.actions.length}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {statistics && statistics.improvement !== null && (
                  <div className="mt-6 p-4 bg-green-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Overall Risk Reduction:</span>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {statistics.improvement.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Add failure modes to see risk matrix</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
