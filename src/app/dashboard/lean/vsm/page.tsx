'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, Trash2, Download, AlertTriangle, TrendingUp, 
  Clock, Package, Activity, Target, ArrowLeft 
} from 'lucide-react'
import {
  type ProcessStep,
  type InventoryBuffer,
  calculateVSMMetrics,
  identifyWaste,
  generateRecommendations,
  calculateFutureStateImprovements,
  formatTime,
  formatPercentage
} from '@/lib/calculations/vsm'
import { toast } from 'sonner'

export default function VSMPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/lean');
  };

  // Production parameters
  const [customerDemandPerDay, setCustomerDemandPerDay] = useState(480)
  const [shiftsPerDay, setShiftsPerDay] = useState(2)
  const [hoursPerShift, setHoursPerShift] = useState(8)
  const [breaksMinutes, setBreaksMinutes] = useState(60)

  // Process steps
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    {
      id: '1',
      name: 'Receiving',
      cycleTime: 300,
      changeoverTime: 600,
      uptime: 95,
      operators: 2,
      shifts: 2,
      batchSize: 50,
      isValueAdded: false
    },
    {
      id: '2',
      name: 'Assembly',
      cycleTime: 180,
      changeoverTime: 900,
      uptime: 85,
      operators: 3,
      shifts: 2,
      batchSize: 20,
      isValueAdded: true
    },
    {
      id: '3',
      name: 'Quality Check',
      cycleTime: 60,
      changeoverTime: 120,
      uptime: 98,
      operators: 1,
      shifts: 2,
      batchSize: 20,
      isValueAdded: true
    },
    {
      id: '4',
      name: 'Packaging',
      cycleTime: 120,
      changeoverTime: 300,
      uptime: 90,
      operators: 2,
      shifts: 2,
      batchSize: 50,
      isValueAdded: false
    },
    {
      id: '5',
      name: 'Shipping',
      cycleTime: 240,
      changeoverTime: 480,
      uptime: 92,
      operators: 2,
      shifts: 1,
      batchSize: 100,
      isValueAdded: false
    }
  ])

  // Inventory buffers
  const [inventories, setInventories] = useState<InventoryBuffer[]>([
    { id: '1', quantity: 500, location: 'Before Assembly' },
    { id: '2', quantity: 200, location: 'Before Packaging' },
    { id: '3', quantity: 300, location: 'Before Shipping' }
  ])

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateVSMMetrics(
      processSteps,
      inventories,
      customerDemandPerDay,
      shiftsPerDay,
      hoursPerShift,
      breaksMinutes
    )
  }, [processSteps, inventories, customerDemandPerDay, shiftsPerDay, hoursPerShift, breaksMinutes])

  // Identify wastes
  const wastes = useMemo(() => {
    return identifyWaste(
      processSteps,
      inventories,
      metrics.totalLeadTime,
      metrics.valueAddedTime
    )
  }, [processSteps, inventories, metrics])

  // Generate recommendations
  const recommendations = useMemo(() => {
    return generateRecommendations(metrics, wastes)
  }, [metrics, wastes])

  // Future state projections
  const futureState = useMemo(() => {
    return calculateFutureStateImprovements(metrics)
  }, [metrics])

  const handleAddProcessStep = useCallback(() => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      name: `Process ${processSteps.length + 1}`,
      cycleTime: 60,
      changeoverTime: 300,
      uptime: 90,
      operators: 1,
      shifts: 2,
      batchSize: 20,
      isValueAdded: false
    }
    setProcessSteps([...processSteps, newStep])
  }, [processSteps])

  const handleDeleteProcessStep = useCallback((id: string) => {
    setProcessSteps(processSteps.filter(step => step.id !== id))
  }, [processSteps])

  const handleUpdateProcessStep = useCallback((id: string, field: keyof ProcessStep, value: string | number | boolean) => {
    setProcessSteps(processSteps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ))
  }, [processSteps])

  const handleAddInventory = useCallback(() => {
    const newInventory: InventoryBuffer = {
      id: Date.now().toString(),
      quantity: 100,
      location: `Buffer ${inventories.length + 1}`
    }
    setInventories([...inventories, newInventory])
  }, [inventories])

  const handleDeleteInventory = useCallback((id: string) => {
    setInventories(inventories.filter(inv => inv.id !== id))
  }, [inventories])

  const handleUpdateInventory = useCallback((id: string, field: keyof InventoryBuffer, value: string | number) => {
    setInventories(inventories.map(inv =>
      inv.id === id ? { ...inv, [field]: value } : inv
    ))
  }, [inventories])

  const handleExportReport = useCallback(() => {
    const report = `Value Stream Mapping Analysis Report
Generated: ${new Date().toLocaleDateString()}

=== PRODUCTION PARAMETERS ===
Customer Demand: ${customerDemandPerDay} units/day
Shifts: ${shiftsPerDay} × ${hoursPerShift} hours
Takt Time: ${formatTime(metrics.taktTime)}

=== KEY METRICS ===
Total Lead Time: ${metrics.totalLeadTime.toFixed(2)} days
Value-Added Time: ${formatTime(metrics.valueAddedTime)}
Non-Value-Added Time: ${formatTime(metrics.nonValueAddedTime)}
Process Cycle Efficiency: ${formatPercentage(metrics.processCycleEfficiency)}
Inventory Days: ${metrics.inventoryDays.toFixed(2)} days
Process Steps: ${metrics.processSteps}
Touch Points: ${metrics.touchPoints}

=== PROCESS STEPS ===
${processSteps.map((step, i) => `
${i + 1}. ${step.name}
   Cycle Time: ${formatTime(step.cycleTime)}
   Changeover: ${formatTime(step.changeoverTime)}
   Uptime: ${step.uptime}%
   Operators: ${step.operators}
   Batch Size: ${step.batchSize}
   Value-Added: ${step.isValueAdded ? 'Yes' : 'No'}
`).join('\n')}

=== INVENTORY BUFFERS ===
${inventories.map((inv, i) => `
${i + 1}. ${inv.location}
   Quantity: ${inv.quantity} units
`).join('\n')}

=== WASTE IDENTIFICATION ===
${wastes.map((waste, i) => `
${i + 1}. ${waste.type.toUpperCase()} (${waste.impact} impact)
   Location: ${waste.location}
   Description: ${waste.description}
   Recommendation: ${waste.recommendation}
`).join('\n')}

=== RECOMMENDATIONS ===
${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

=== FUTURE STATE TARGETS ===
Target Lead Time: ${futureState.targetLeadTime.toFixed(2)} days
Target Inventory Days: ${futureState.targetInventoryDays.toFixed(2)} days

Potential Improvements:
${futureState.potentialImprovements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}
`

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vsm-analysis.txt'
    a.click()
    toast.success('Report exported successfully')
  }, [metrics, processSteps, inventories, wastes, recommendations, futureState, customerDemandPerDay, shiftsPerDay, hoursPerShift])

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
          <h1 className="text-3xl font-bold">Value Stream Mapping</h1>
          <p className="text-muted-foreground mt-1">
            Analyze and optimize your value stream flow
          </p>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Lead Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeadTime.toFixed(2)} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTime(metrics.valueAddedTime)} VA time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Process Cycle Efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(metrics.processCycleEfficiency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.processCycleEfficiency < 10 ? 'Critical' : metrics.processCycleEfficiency < 25 ? 'Needs Improvement' : 'Good'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.inventoryDays.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventories.reduce((sum, inv) => sum + inv.quantity, 0)} units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Takt Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(metrics.taktTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customerDemandPerDay} units/day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="process" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="process">Process Steps</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="waste">Waste Analysis</TabsTrigger>
          <TabsTrigger value="future">Future State</TabsTrigger>
        </TabsList>

        {/* Process Steps Tab */}
        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Production Parameters</CardTitle>
                  <CardDescription>Define your production environment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Customer Demand (units/day)</Label>
                  <Input
                    type="number"
                    value={customerDemandPerDay}
                    onChange={(e) => setCustomerDemandPerDay(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Shifts per Day</Label>
                  <Input
                    type="number"
                    value={shiftsPerDay}
                    onChange={(e) => setShiftsPerDay(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Hours per Shift</Label>
                  <Input
                    type="number"
                    value={hoursPerShift}
                    onChange={(e) => setHoursPerShift(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Break Time (minutes)</Label>
                  <Input
                    type="number"
                    value={breaksMinutes}
                    onChange={(e) => setBreaksMinutes(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Process Steps</CardTitle>
                  <CardDescription>Define your value stream process steps</CardDescription>
                </div>
                <Button onClick={handleAddProcessStep} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={step.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Step {index + 1}</span>
                        {step.isValueAdded && (
                          <Badge variant="default">Value-Added</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProcessStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <Label>Process Name</Label>
                        <Input
                          value={step.name}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Cycle Time (sec)</Label>
                        <Input
                          type="number"
                          value={step.cycleTime}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'cycleTime', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Changeover (sec)</Label>
                        <Input
                          type="number"
                          value={step.changeoverTime}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'changeoverTime', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      <div>
                        <Label>Uptime (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={step.uptime}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'uptime', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Operators</Label>
                        <Input
                          type="number"
                          value={step.operators}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'operators', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Shifts</Label>
                        <Input
                          type="number"
                          value={step.shifts}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'shifts', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Batch Size</Label>
                        <Input
                          type="number"
                          value={step.batchSize}
                          onChange={(e) => handleUpdateProcessStep(step.id, 'batchSize', Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={step.isValueAdded}
                            onChange={(e) => handleUpdateProcessStep(step.id, 'isValueAdded', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Value-Added</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Buffers</CardTitle>
                  <CardDescription>WIP and finished goods inventory</CardDescription>
                </div>
                <Button onClick={handleAddInventory} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Buffer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventories.map((inv, index) => (
                  <div key={inv.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <span className="font-semibold w-24">Buffer {index + 1}</span>
                    <Input
                      placeholder="Location"
                      value={inv.location}
                      onChange={(e) => handleUpdateInventory(inv.id, 'location', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={inv.quantity}
                      onChange={(e) => handleUpdateInventory(inv.id, 'quantity', Number(e.target.value))}
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteInventory(inv.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Analysis Tab */}
        <TabsContent value="waste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Waste Identification ({wastes.length} Found)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wastes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No major wastes identified. Continue monitoring.
                </p>
              ) : (
                wastes.map((waste, index) => (
                  <Alert
                    key={index}
                    variant={waste.impact === 'high' ? 'destructive' : 'default'}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={waste.impact === 'high' ? 'destructive' : 'secondary'}>
                            {waste.type}
                          </Badge>
                          <Badge variant="outline">{waste.impact} impact</Badge>
                        </div>
                        <p className="font-medium">{waste.location}</p>
                        <p className="text-sm">{waste.description}</p>
                        <p className="text-sm mt-2">
                          <strong>Recommendation:</strong> {waste.recommendation}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Improvement Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-semibold text-primary">{index + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Future State Tab */}
        <TabsContent value="future" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Future State Projections</CardTitle>
              <CardDescription>
                Estimated improvements with Lean implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Current State</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lead Time:</span>
                      <span className="font-semibold">{metrics.totalLeadTime.toFixed(2)} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PCE:</span>
                      <span className="font-semibold">{formatPercentage(metrics.processCycleEfficiency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory:</span>
                      <span className="font-semibold">{metrics.inventoryDays.toFixed(2)} days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Future State Target</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lead Time:</span>
                      <span className="font-semibold text-green-600">
                        {futureState.targetLeadTime.toFixed(2)} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PCE:</span>
                      <span className="font-semibold text-green-600">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory:</span>
                      <span className="font-semibold text-green-600">
                        {futureState.targetInventoryDays.toFixed(2)} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Implementation Plan</h3>
                <ul className="space-y-2">
                  {futureState.potentialImprovements.map((imp, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
