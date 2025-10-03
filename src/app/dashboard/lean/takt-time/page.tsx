'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trash2, Download, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

/**
 * Takt Time Calculator - Phase 4 Sprint 4
 * Customer demand rate analysis and production planning
 */

interface TaktTimeCalculation {
  id: string
  name: string
  shiftHours: number
  breaksMinutes: number
  lunchMinutes: number
  maintenanceMinutes: number
  customerDemandPerDay: number
  cycleTimeSeconds: number
  availableTimeSeconds: number
  taktTimeSeconds: number
  requiredStations: number
  lineBalanceEfficiency: number
  operatorsRequired: number
  status: 'meeting_demand' | 'below_demand' | 'above_capacity'
}

const initialCalculations: TaktTimeCalculation[] = []

export default function TaktTimePage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/lean');
  };

  const [calculations, setCalculations] = useState<TaktTimeCalculation[]>(initialCalculations)
  
  const [newCalc, setNewCalc] = useState({
    name: '',
    shiftHours: 8,
    breaksMinutes: 30,
    lunchMinutes: 30,
    maintenanceMinutes: 15,
    customerDemandPerDay: 480,
    cycleTimeSeconds: 45,
    operatorsPerStation: 1
  })

  const handleCalculate = () => {
    if (!newCalc.name.trim()) {
      toast.error('Please provide calculation name')
      return
    }

    if (newCalc.customerDemandPerDay <= 0) {
      toast.error('Customer demand must be greater than 0')
      return
    }

    // Calculate available time (seconds)
    const totalShiftSeconds = newCalc.shiftHours * 3600
    const totalBreakSeconds = (newCalc.breaksMinutes + newCalc.lunchMinutes + newCalc.maintenanceMinutes) * 60
    const availableTimeSeconds = totalShiftSeconds - totalBreakSeconds

    // Calculate takt time (available time / customer demand)
    const taktTimeSeconds = availableTimeSeconds / newCalc.customerDemandPerDay

    // Calculate required stations (cycle time / takt time, rounded up)
    const requiredStations = Math.ceil(newCalc.cycleTimeSeconds / taktTimeSeconds)

    // Calculate line balance efficiency
    const lineBalanceEfficiency = (newCalc.cycleTimeSeconds / (requiredStations * taktTimeSeconds)) * 100

    // Calculate operators required
    const operatorsRequired = requiredStations * newCalc.operatorsPerStation

    // Determine status
    let status: 'meeting_demand' | 'below_demand' | 'above_capacity'
    if (newCalc.cycleTimeSeconds <= taktTimeSeconds) {
      status = 'meeting_demand'
    } else if (newCalc.cycleTimeSeconds > taktTimeSeconds * 1.2) {
      status = 'above_capacity'
    } else {
      status = 'below_demand'
    }

    const calculation: TaktTimeCalculation = {
      id: Date.now().toString(),
      name: newCalc.name,
      shiftHours: newCalc.shiftHours,
      breaksMinutes: newCalc.breaksMinutes,
      lunchMinutes: newCalc.lunchMinutes,
      maintenanceMinutes: newCalc.maintenanceMinutes,
      customerDemandPerDay: newCalc.customerDemandPerDay,
      cycleTimeSeconds: newCalc.cycleTimeSeconds,
      availableTimeSeconds,
      taktTimeSeconds,
      requiredStations,
      lineBalanceEfficiency,
      operatorsRequired,
      status
    }

    setCalculations([calculation, ...calculations])
    setNewCalc({
      ...newCalc,
      name: ''
    })
    toast.success('Takt time calculated!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this calculation?')) {
      setCalculations(calculations.filter(c => c.id !== id))
      toast.success('Calculation deleted')
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ calculations, exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `takt-time-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Calculations exported')
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`
    return `${(seconds / 3600).toFixed(1)}h`
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lean Tools
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-8 w-8 text-indigo-600" />
              Takt Time Calculator
            </h1>
            <p className="text-gray-600 mt-1">Customer demand rate and production planning</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">{calculations.length}</div>
              <p className="text-sm text-gray-600">Total Calculations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {calculations.filter(c => c.status === 'meeting_demand').length}
              </div>
              <p className="text-sm text-gray-600">Meeting Demand</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {calculations.filter(c => c.status === 'below_demand').length}
              </div>
              <p className="text-sm text-gray-600">Below Demand</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {calculations.filter(c => c.status === 'above_capacity').length}
              </div>
              <p className="text-sm text-gray-600">Above Capacity</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Calculate Takt Time</CardTitle>
            <CardDescription>Define your production parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Calculation Name *</Label>
              <Input
                id="name"
                value={newCalc.name}
                onChange={(e) => setNewCalc({ ...newCalc, name: e.target.value })}
                placeholder="Assembly Line A"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Available Time</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shiftHours">Shift Duration (hours)</Label>
                  <Input
                    id="shiftHours"
                    type="number"
                    step="0.5"
                    value={newCalc.shiftHours}
                    onChange={(e) => setNewCalc({ ...newCalc, shiftHours: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="breaks">Breaks (minutes)</Label>
                  <Input
                    id="breaks"
                    type="number"
                    value={newCalc.breaksMinutes}
                    onChange={(e) => setNewCalc({ ...newCalc, breaksMinutes: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="lunch">Lunch (minutes)</Label>
                  <Input
                    id="lunch"
                    type="number"
                    value={newCalc.lunchMinutes}
                    onChange={(e) => setNewCalc({ ...newCalc, lunchMinutes: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="maintenance">Maintenance (minutes)</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={newCalc.maintenanceMinutes}
                    onChange={(e) => setNewCalc({ ...newCalc, maintenanceMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded">
                <p className="text-sm font-medium text-blue-900">
                  Net Available Time: {formatTime(
                    (newCalc.shiftHours * 3600) - 
                    ((newCalc.breaksMinutes + newCalc.lunchMinutes + newCalc.maintenanceMinutes) * 60)
                  )}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Demand & Capacity</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="demand">Customer Demand (units/day) *</Label>
                  <Input
                    id="demand"
                    type="number"
                    value={newCalc.customerDemandPerDay}
                    onChange={(e) => setNewCalc({ ...newCalc, customerDemandPerDay: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">How many units customers need per day</p>
                </div>

                <div>
                  <Label htmlFor="cycleTime">Cycle Time (seconds)</Label>
                  <Input
                    id="cycleTime"
                    type="number"
                    value={newCalc.cycleTimeSeconds}
                    onChange={(e) => setNewCalc({ ...newCalc, cycleTimeSeconds: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Time to complete one unit</p>
                </div>

                <div>
                  <Label htmlFor="operators">Operators per Station</Label>
                  <Input
                    id="operators"
                    type="number"
                    min="1"
                    value={newCalc.operatorsPerStation}
                    onChange={(e) => setNewCalc({ ...newCalc, operatorsPerStation: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Calculate Takt Time
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Calculations ({calculations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {calculations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No calculations yet. Start one!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {calculations.map((calc) => (
                  <Card key={calc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={
                              calc.status === 'meeting_demand' ? 'bg-green-100 text-green-800' :
                              calc.status === 'below_demand' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {calc.status === 'meeting_demand' ? '✓ Meeting Demand' :
                               calc.status === 'below_demand' ? '⚠ Below Demand' :
                               '✗ Above Capacity'}
                            </Badge>
                            <Badge variant="outline">
                              {calc.lineBalanceEfficiency.toFixed(0)}% balanced
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{calc.name}</h3>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(calc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Takt Time</p>
                          <p className="font-semibold text-lg text-indigo-600">
                            {formatTime(calc.taktTimeSeconds)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cycle Time</p>
                          <p className="font-semibold text-lg">
                            {formatTime(calc.cycleTimeSeconds)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Demand</p>
                          <p className="font-semibold">{calc.customerDemandPerDay} units/day</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Available Time</p>
                          <p className="font-semibold">{formatTime(calc.availableTimeSeconds)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Required Stations</p>
                          <p className="font-semibold">{calc.requiredStations}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Operators Needed</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {calc.operatorsRequired}
                          </p>
                        </div>
                      </div>

                      {calc.cycleTimeSeconds > calc.taktTimeSeconds && (
                        <div className="mt-3 p-3 bg-orange-50 rounded">
                          <p className="text-sm text-orange-800">
                            <strong>Action Required:</strong> Cycle time exceeds takt time. 
                            {calc.requiredStations > 1 
                              ? ` Add ${calc.requiredStations - 1} more station(s) or reduce cycle time.`
                              : ' Reduce cycle time to meet demand.'
                            }
                          </p>
                        </div>
                      )}

                      {calc.cycleTimeSeconds <= calc.taktTimeSeconds && (
                        <div className="mt-3 p-3 bg-green-50 rounded">
                          <p className="text-sm text-green-800">
                            <strong>Capacity Available:</strong> You can produce faster than demand. 
                            Spare capacity: {formatTime(calc.taktTimeSeconds - calc.cycleTimeSeconds)} per unit.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formula Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Takt Time Formula Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Key Formulas</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-mono text-indigo-600">Takt Time = Available Time / Customer Demand</p>
                  <p className="text-xs text-gray-600 mt-1">Rate at which products must be produced</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-mono text-indigo-600">Required Stations = Cycle Time / Takt Time</p>
                  <p className="text-xs text-gray-600 mt-1">Number of workstations needed (rounded up)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-mono text-indigo-600">Line Balance = Cycle Time / (Stations × Takt Time)</p>
                  <p className="text-xs text-gray-600 mt-1">Efficiency of workload distribution</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Interpretation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                  <p><strong>Cycle Time ≤ Takt Time:</strong> Meeting demand, spare capacity available</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-orange-100 text-orange-800">⚠</Badge>
                  <p><strong>Cycle Time &gt; Takt Time:</strong> Not meeting demand, additional capacity needed</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800">i</Badge>
                  <p><strong>Line Balance &gt; 90%:</strong> Well-balanced production line</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-purple-100 text-purple-800">→</Badge>
                  <p><strong>Actions:</strong> Add stations, reduce cycle time, or extend available time</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
