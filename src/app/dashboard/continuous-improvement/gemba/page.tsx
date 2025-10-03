'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Trash2, Download, Calendar, Users, CheckCircle, AlertTriangle, Lightbulb, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

/**
 * Gemba Walk Tracker - Phase 4 Week 3 Implementation
 * Document observations and insights from Gemba walks (go and see)
 * Gemba = "the actual place" in Japanese - where work happens
 */

interface Observation {
  id: string
  type: 'positive' | 'issue' | 'opportunity' | 'question'
  description: string
  location: string
  timestamp: string
}

interface Issue {
  id: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  location: string
  impact: string
}

interface ActionItem {
  id: string
  description: string
  responsible: string
  dueDate: string
  status: 'open' | 'in_progress' | 'completed'
  relatedObservation?: string
}

interface Participant {
  id: string
  name: string
  role: string
}

interface GembaWalk {
  location: string
  area: string
  walkDate: string
  startTime: string
  endTime: string
  duration: number
  participants: Participant[]
  objectives: string
  observations: Observation[]
  issues: Issue[]
  actionItems: ActionItem[]
  positiveFindings: string[]
  lessonsLearned: string
  followUpDate: string
  status: 'planned' | 'in_progress' | 'completed'
  createdDate: string
}

const initialWalk: GembaWalk = {
  location: '',
  area: '',
  walkDate: new Date().toISOString().split('T')[0],
  startTime: '',
  endTime: '',
  duration: 0,
  participants: [],
  objectives: '',
  observations: [],
  issues: [],
  actionItems: [],
  positiveFindings: [],
  lessonsLearned: '',
  followUpDate: '',
  status: 'planned',
  createdDate: new Date().toISOString().split('T')[0]
}

export default function GembaWalkPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/continuous-improvement');
  };

  const [walk, setWalk] = useState<GembaWalk>(initialWalk)
  const [newParticipant, setNewParticipant] = useState({ name: '', role: '' })
  const [newObservation, setNewObservation] = useState({ 
    type: 'positive' as Observation['type'], 
    description: '', 
    location: '' 
  })
  const [newIssue, setNewIssue] = useState({ 
    description: '', 
    severity: 'medium' as Issue['severity'], 
    category: '', 
    location: '', 
    impact: '' 
  })
  const [newAction, setNewAction] = useState({ description: '', responsible: '', dueDate: '' })
  const [newPositive, setNewPositive] = useState('')

  // Calculate duration when times change
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const updated = { ...walk, [field]: value }
    
    if (updated.startTime && updated.endTime) {
      const start = new Date(`2000-01-01T${updated.startTime}`)
      const end = new Date(`2000-01-01T${updated.endTime}`)
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
      updated.duration = durationMinutes > 0 ? durationMinutes : 0
    }
    
    setWalk(updated)
  }

  // Participant management
  const handleAddParticipant = () => {
    if (!newParticipant.name.trim()) {
      toast.error('Please provide participant name')
      return
    }
    
    const participant: Participant = {
      id: Date.now().toString(),
      name: newParticipant.name.trim(),
      role: newParticipant.role.trim() || 'Participant'
    }
    
    setWalk({ ...walk, participants: [...walk.participants, participant] })
    setNewParticipant({ name: '', role: '' })
    toast.success('Participant added')
  }

  const handleDeleteParticipant = (id: string) => {
    setWalk({ ...walk, participants: walk.participants.filter(p => p.id !== id) })
  }

  // Observation management
  const handleAddObservation = () => {
    if (!newObservation.description.trim()) {
      toast.error('Please provide observation description')
      return
    }
    
    const observation: Observation = {
      id: Date.now().toString(),
      type: newObservation.type,
      description: newObservation.description.trim(),
      location: newObservation.location.trim() || walk.location,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    
    setWalk({ ...walk, observations: [...walk.observations, observation] })
    setNewObservation({ type: 'positive', description: '', location: '' })
    toast.success('Observation added')
  }

  const handleDeleteObservation = (id: string) => {
    setWalk({ ...walk, observations: walk.observations.filter(o => o.id !== id) })
  }

  // Issue management
  const handleAddIssue = () => {
    if (!newIssue.description.trim()) {
      toast.error('Please provide issue description')
      return
    }
    
    const issue: Issue = {
      id: Date.now().toString(),
      description: newIssue.description.trim(),
      severity: newIssue.severity,
      category: newIssue.category.trim() || 'General',
      location: newIssue.location.trim() || walk.location,
      impact: newIssue.impact.trim()
    }
    
    setWalk({ ...walk, issues: [...walk.issues, issue] })
    setNewIssue({ description: '', severity: 'medium', category: '', location: '', impact: '' })
    toast.success('Issue added')
  }

  const handleDeleteIssue = (id: string) => {
    setWalk({ ...walk, issues: walk.issues.filter(i => i.id !== id) })
  }

  // Action item management
  const handleAddAction = () => {
    if (!newAction.description.trim() || !newAction.responsible.trim()) {
      toast.error('Please provide action description and responsible person')
      return
    }
    
    const action: ActionItem = {
      id: Date.now().toString(),
      description: newAction.description.trim(),
      responsible: newAction.responsible.trim(),
      dueDate: newAction.dueDate,
      status: 'open'
    }
    
    setWalk({ ...walk, actionItems: [...walk.actionItems, action] })
    setNewAction({ description: '', responsible: '', dueDate: '' })
    toast.success('Action item added')
  }

  const handleUpdateActionStatus = (id: string, status: ActionItem['status']) => {
    setWalk({
      ...walk,
      actionItems: walk.actionItems.map(a => a.id === id ? { ...a, status } : a)
    })
  }

  const handleDeleteAction = (id: string) => {
    setWalk({ ...walk, actionItems: walk.actionItems.filter(a => a.id !== id) })
  }

  // Positive findings
  const handleAddPositive = () => {
    if (!newPositive.trim()) return
    setWalk({ ...walk, positiveFindings: [...walk.positiveFindings, newPositive.trim()] })
    setNewPositive('')
    toast.success('Positive finding added')
  }

  // Export
  const handleExport = () => {
    const exportData = {
      ...walk,
      exportDate: new Date().toISOString(),
      summary: {
        totalObservations: walk.observations.length,
        totalIssues: walk.issues.length,
        totalActions: walk.actionItems.length,
        openActions: walk.actionItems.filter(a => a.status === 'open').length
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gemba-walk-${walk.location.replace(/\s+/g, '-')}-${walk.walkDate}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Gemba walk exported')
  }

  // Reset
  const handleReset = () => {
    if (confirm('Start a new Gemba walk? Current data will be cleared.')) {
      setWalk(initialWalk)
      toast.success('New Gemba walk started')
    }
  }

  // Get observation icon and color
  const getObservationStyle = (type: Observation['type']) => {
    switch (type) {
      case 'positive':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
      case 'issue':
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' }
      case 'opportunity':
        return { icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' }
      case 'question':
        return { icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' }
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Gemba Walk Tracker</h1>
            <p className="text-gray-600 mt-1">
              Go and see - Document observations from the actual workplace
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline">
              New Walk
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <Select value={walk.status} onValueChange={(value: GembaWalk['status']) => setWalk({ ...walk, status: value })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {walk.duration > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {walk.duration} minutes
            </Badge>
          )}
        </div>
      </div>

      {/* Walk Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Walk Information
          </CardTitle>
          <CardDescription>
            Define where and when the Gemba walk took place
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location / Line *</Label>
              <Input
                id="location"
                value={walk.location}
                onChange={(e) => setWalk({ ...walk, location: e.target.value })}
                placeholder="e.g., Assembly Line 3, Warehouse A"
              />
            </div>
            <div>
              <Label htmlFor="area">Area / Department</Label>
              <Input
                id="area"
                value={walk.area}
                onChange={(e) => setWalk({ ...walk, area: e.target.value })}
                placeholder="e.g., Production, Quality Control"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="walkDate">Date</Label>
              <Input
                id="walkDate"
                type="date"
                value={walk.walkDate}
                onChange={(e) => setWalk({ ...walk, walkDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={walk.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={walk.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={walk.duration || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="objectives">Walk Objectives</Label>
            <Textarea
              id="objectives"
              value={walk.objectives}
              onChange={(e) => setWalk({ ...walk, objectives: e.target.value })}
              placeholder="What are you looking to observe or verify during this Gemba walk?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Participants
            </div>
            <Badge variant="outline">{walk.participants.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {walk.participants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {walk.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{participant.name}</p>
                    <p className="text-xs text-gray-600">{participant.role}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteParticipant(participant.id)}
                    className="ml-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Participant name"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Role"
              value={newParticipant.role}
              onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
              className="w-48"
            />
            <Button onClick={handleAddParticipant}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{walk.observations.length}</div>
            <p className="text-sm text-gray-600">Observations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{walk.issues.length}</div>
            <p className="text-sm text-gray-600">Issues Found</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{walk.actionItems.length}</div>
            <p className="text-sm text-gray-600">Action Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{walk.positiveFindings.length}</div>
            <p className="text-sm text-gray-600">Positives</p>
          </CardContent>
        </Card>
      </div>

      {/* Observations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Observations</CardTitle>
          <CardDescription>
            Document what you see, hear, and learn during the walk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {walk.observations.length > 0 && (
            <div className="space-y-2 mb-4">
              {walk.observations.map((obs) => {
                const style = getObservationStyle(obs.type)
                const Icon = style.icon

                return (
                  <div key={obs.id} className={`p-3 border rounded-lg ${style.bg}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className={`h-5 w-5 mt-0.5 ${style.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {obs.type}
                            </Badge>
                            <span className="text-xs text-gray-600">{obs.timestamp}</span>
                            {obs.location && (
                              <span className="text-xs text-gray-600">@ {obs.location}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-900">{obs.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteObservation(obs.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Select 
                value={newObservation.type} 
                onValueChange={(value: Observation['type']) => setNewObservation({ ...newObservation, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">✓ Positive</SelectItem>
                  <SelectItem value="issue">⚠ Issue</SelectItem>
                  <SelectItem value="opportunity">💡 Opportunity</SelectItem>
                  <SelectItem value="question">❓ Question</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Specific location (optional)"
                value={newObservation.location}
                onChange={(e) => setNewObservation({ ...newObservation, location: e.target.value })}
                className="md:col-span-2"
              />
            </div>
            <Textarea
              placeholder="Describe what you observed..."
              value={newObservation.description}
              onChange={(e) => setNewObservation({ ...newObservation, description: e.target.value })}
              rows={2}
            />
            <Button onClick={handleAddObservation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Observation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues Identified */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Issues Identified
          </CardTitle>
          <CardDescription>
            Problems or concerns that require attention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {walk.issues.length > 0 && (
            <div className="space-y-3 mb-4">
              {walk.issues.map((issue) => (
                <Card key={issue.id} className="border-l-4 border-l-red-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            issue.severity === 'critical' ? 'destructive' :
                            issue.severity === 'high' ? 'destructive' :
                            issue.severity === 'medium' ? 'secondary' : 'outline'
                          }>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.category}</Badge>
                          {issue.location && (
                            <span className="text-xs text-gray-600">@ {issue.location}</span>
                          )}
                        </div>
                        <p className="font-medium mb-1">{issue.description}</p>
                        {issue.impact && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Impact:</span> {issue.impact}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteIssue(issue.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Textarea
              placeholder="Issue description *"
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Select 
                value={newIssue.severity} 
                onValueChange={(value: Issue['severity']) => setNewIssue({ ...newIssue, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Category"
                value={newIssue.category}
                onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newIssue.location}
                onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
              />
            </div>
            <Input
              placeholder="Impact / Consequences"
              value={newIssue.impact}
              onChange={(e) => setNewIssue({ ...newIssue, impact: e.target.value })}
            />
            <Button onClick={handleAddIssue}>
              <Plus className="h-4 w-4 mr-2" />
              Add Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Action Items</span>
            <Badge variant="outline">
              {walk.actionItems.filter(a => a.status === 'completed').length} / {walk.actionItems.length} Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            Follow-up actions to address findings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {walk.actionItems.length > 0 && (
            <div className="space-y-2 mb-4">
              {walk.actionItems.map((action) => (
                <div key={action.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          action.status === 'completed' ? 'default' :
                          action.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {action.status.replace('_', ' ')}
                        </Badge>
                        <p className="font-medium">{action.description}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Responsible: {action.responsible}
                        {action.dueDate && ` | Due: ${action.dueDate}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={action.status}
                        onValueChange={(value: ActionItem['status']) => handleUpdateActionStatus(action.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAction(action.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Textarea
              placeholder="Action description *"
              value={newAction.description}
              onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              rows={2}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Responsible person *"
                value={newAction.responsible}
                onChange={(e) => setNewAction({ ...newAction, responsible: e.target.value })}
                className="flex-1"
              />
              <Input
                type="date"
                value={newAction.dueDate}
                onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                className="w-48"
              />
              <Button onClick={handleAddAction}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positive Findings & Lessons Learned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Positive Findings
            </CardTitle>
            <CardDescription>
              Good practices and things worth celebrating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {walk.positiveFindings.length > 0 && (
              <ul className="space-y-2 mb-3">
                {walk.positiveFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{finding}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add positive finding..."
                value={newPositive}
                onChange={(e) => setNewPositive(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPositive()}
              />
              <Button onClick={handleAddPositive}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lessons Learned</CardTitle>
            <CardDescription>
              Key takeaways and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={walk.lessonsLearned}
              onChange={(e) => setWalk({ ...walk, lessonsLearned: e.target.value })}
              placeholder="What did you learn from this Gemba walk? What surprised you? What should be shared with the team?"
              rows={6}
            />
          </CardContent>
        </Card>
      </div>

      {/* Follow-up */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Follow-up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="followUpDate">Next Follow-up Date</Label>
            <Input
              id="followUpDate"
              type="date"
              value={walk.followUpDate}
              onChange={(e) => setWalk({ ...walk, followUpDate: e.target.value })}
              className="max-w-xs"
            />
            <p className="text-xs text-gray-600 mt-1">
              Schedule a follow-up to verify improvements and action item completion
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
