'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Plus, Trash2, Download, TrendingUp, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

/**
 * Poka-Yoke Designer - Phase 4 Sprint 4
 * Mistake-proofing device design and tracking
 */

type DeviceType = 'control' | 'warning' | 'shutdown' | 'sensor' | 'fixture' | 'guide'
type Method = 'contact' | 'fixed_value' | 'motion_step'

interface PokaYokeDevice {
  id: string
  name: string
  processStep: string
  problemType: string
  deviceType: DeviceType
  method: Method
  description: string
  implementation: string
  cost: number
  defectsBeforePerMonth: number
  defectsAfterPerMonth: number
  status: 'designed' | 'implemented' | 'verified'
  implementedDate: string
}

const initialDevices: PokaYokeDevice[] = []

export default function PokaYokePage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/lean');
  };

  const [devices, setDevices] = useState<PokaYokeDevice[]>(initialDevices)
  const [selectedDevice, setSelectedDevice] = useState<PokaYokeDevice | null>(null)

  const [newDevice, setNewDevice] = useState({
    name: '',
    processStep: '',
    problemType: '',
    deviceType: 'control' as DeviceType,
    method: 'contact' as Method,
    description: '',
    implementation: '',
    cost: 0,
    defectsBeforePerMonth: 0,
    defectsAfterPerMonth: 0
  })

  const handleAddDevice = () => {
    if (!newDevice.name.trim() || !newDevice.processStep.trim()) {
      toast.error('Please provide device name and process step')
      return
    }

    const device: PokaYokeDevice = {
      id: Date.now().toString(),
      ...newDevice,
      status: 'designed',
      implementedDate: ''
    }

    setDevices([device, ...devices])
    setSelectedDevice(device)
    setNewDevice({
      name: '',
      processStep: '',
      problemType: '',
      deviceType: 'control',
      method: 'contact',
      description: '',
      implementation: '',
      cost: 0,
      defectsBeforePerMonth: 0,
      defectsAfterPerMonth: 0
    })
    toast.success('Poka-Yoke device added!')
  }

  const handleStatusChange = (id: string, newStatus: 'designed' | 'implemented' | 'verified') => {
    setDevices(devices.map(d => {
      if (d.id === id) {
        const updated = { ...d, status: newStatus }
        if (newStatus === 'implemented' && !d.implementedDate) {
          updated.implementedDate = new Date().toISOString().split('T')[0]
        }
        return updated
      }
      return d
    }))
    toast.success(`Status updated to ${newStatus}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this Poka-Yoke device?')) {
      setDevices(devices.filter(d => d.id !== id))
      if (selectedDevice?.id === id) setSelectedDevice(null)
      toast.success('Device deleted')
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ devices, exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poka-yoke-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Devices exported')
  }

  const totalSavings = devices
    .filter(d => d.status === 'implemented' || d.status === 'verified')
    .reduce((sum, d) => sum + (d.defectsBeforePerMonth - d.defectsAfterPerMonth), 0)

  const totalCost = devices
    .filter(d => d.status === 'implemented' || d.status === 'verified')
    .reduce((sum, d) => sum + d.cost, 0)

  const roi = totalCost > 0 ? ((totalSavings * 10) / totalCost) * 100 : 0 // Assuming $10 per defect

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
              <Shield className="h-8 w-8 text-green-600" />
              Poka-Yoke Designer
            </h1>
            <p className="text-gray-600 mt-1">Mistake-proofing and error prevention</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">{devices.length}</div>
              <p className="text-sm text-gray-600">Total Devices</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {devices.filter(d => d.status === 'implemented' || d.status === 'verified').length}
              </div>
              <p className="text-sm text-gray-600">Implemented</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{totalSavings}/mo</div>
              <p className="text-sm text-gray-600">Defects Prevented</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{roi.toFixed(0)}%</div>
              <p className="text-sm text-gray-600">Est. ROI</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Device Form */}
        <Card>
          <CardHeader>
            <CardTitle>Design New Poka-Yoke</CardTitle>
            <CardDescription>Define your mistake-proofing device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Device Name *</Label>
              <Input
                id="name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                placeholder="Assembly Alignment Jig"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processStep">Process Step *</Label>
                <Input
                  id="processStep"
                  value={newDevice.processStep}
                  onChange={(e) => setNewDevice({ ...newDevice, processStep: e.target.value })}
                  placeholder="Final Assembly"
                />
              </div>
              <div>
                <Label htmlFor="problemType">Problem Type</Label>
                <Input
                  id="problemType"
                  value={newDevice.problemType}
                  onChange={(e) => setNewDevice({ ...newDevice, problemType: e.target.value })}
                  placeholder="Misalignment"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select
                  value={newDevice.deviceType}
                  onValueChange={(value: DeviceType) => setNewDevice({ ...newDevice, deviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="control">Control (Prevents error)</SelectItem>
                    <SelectItem value="warning">Warning (Alerts operator)</SelectItem>
                    <SelectItem value="shutdown">Shutdown (Stops process)</SelectItem>
                    <SelectItem value="sensor">Sensor (Detects error)</SelectItem>
                    <SelectItem value="fixture">Fixture (Physical guide)</SelectItem>
                    <SelectItem value="guide">Guide (Visual/Audio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="method">Detection Method</Label>
                <Select
                  value={newDevice.method}
                  onValueChange={(value: Method) => setNewDevice({ ...newDevice, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contact (Physical touch)</SelectItem>
                    <SelectItem value="fixed_value">Fixed Value (Count/measure)</SelectItem>
                    <SelectItem value="motion_step">Motion Step (Sequence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDevice.description}
                onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                placeholder="Describe the device and how it prevents errors..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="implementation">Implementation Plan</Label>
              <Textarea
                id="implementation"
                value={newDevice.implementation}
                onChange={(e) => setNewDevice({ ...newDevice, implementation: e.target.value })}
                placeholder="Steps to implement this device..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={newDevice.cost}
                  onChange={(e) => setNewDevice({ ...newDevice, cost: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="defectsBefore">Defects Before/mo</Label>
                <Input
                  id="defectsBefore"
                  type="number"
                  value={newDevice.defectsBeforePerMonth}
                  onChange={(e) => setNewDevice({ ...newDevice, defectsBeforePerMonth: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="defectsAfter">Defects After/mo</Label>
                <Input
                  id="defectsAfter"
                  type="number"
                  value={newDevice.defectsAfterPerMonth}
                  onChange={(e) => setNewDevice({ ...newDevice, defectsAfterPerMonth: Number(e.target.value) })}
                />
              </div>
            </div>

            <Button onClick={handleAddDevice} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Poka-Yoke Device
            </Button>
          </CardContent>
        </Card>

        {/* Devices List */}
        <Card>
          <CardHeader>
            <CardTitle>Devices ({devices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No devices yet. Design one!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {devices.map((device) => {
                  const reduction = device.defectsBeforePerMonth > 0
                    ? ((device.defectsBeforePerMonth - device.defectsAfterPerMonth) / device.defectsBeforePerMonth * 100)
                    : 0

                  return (
                    <Card key={device.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{device.deviceType}</Badge>
                              <Badge className={
                                device.status === 'verified' ? 'bg-green-100 text-green-800' :
                                device.status === 'implemented' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {device.status}
                              </Badge>
                              {reduction > 0 && (
                                <Badge className="bg-purple-100 text-purple-800">
                                  -{reduction.toFixed(0)}% defects
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-gray-600">{device.processStep} • {device.method}</p>
                            {device.description && (
                              <p className="text-xs text-gray-500 mt-1">{device.description}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(device.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-2 mt-3">
                          {device.status === 'designed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(device.id, 'implemented')}
                            >
                              Mark Implemented
                            </Button>
                          )}
                          {device.status === 'implemented' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(device.id, 'verified')}
                            >
                              Verify Effectiveness
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {devices.filter(d => d.status !== 'designed').length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Defect Reduction</p>
                <p className="text-2xl font-bold text-green-600">{totalSavings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Value ($10/defect)</p>
                <p className="text-2xl font-bold text-blue-600">${(totalSavings * 10 * 12).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">{roi.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
