'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Target, TrendingUp, DollarSign, CheckCircle, Clock, Award, Download, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

/**
 * Kaizen Event Planner - Phase 4 Week 5-6 Implementation
 * Plan and manage rapid improvement events (Kaizen Blitz)
 * Typically 3-5 days focused improvement workshops
 */

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
}

interface PreEventMetric {
  id: string
  name: string
  baseline: number
  unit: string
  target: number
}

interface Activity {
  id: string
  day: number
  time: string
  activity: string
  responsible: string
  completed: boolean
}

interface Deliverable {
  id: string
  name: string
  description: string
  dueDay: number
  status: 'pending' | 'in_progress' | 'completed'
  completionNotes: string
}

interface PostEventResult {
  metric: string
  baseline: number
  achieved: number
  improvement: number
  unit: string
}

interface KaizenEvent {
  name: string
  objective: string
  scope: string
  location: string
  startDate: string
  durationDays: number
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled'
  
  // Team
  teamLead: string
  teamMembers: TeamMember[]
  sponsor: string
  
  // Pre-Event
  preEventMetrics: PreEventMetric[]
  currentState: string
  problemStatement: string
  
  // During Event
  agenda: Activity[]
  deliverables: Deliverable[]
  observations: string[]
  
  // Post-Event
  results: PostEventResult[]
  savingsTarget: number
  savingsActual: number
  lessonsLearned: string
  followUpActions: string[]
  
  createdDate: string
}

const initialEvent: KaizenEvent = {
  name: '',
  objective: '',
  scope: '',
  location: '',
  startDate: new Date().toISOString().split('T')[0],
  durationDays: 5,
  status: 'planning',
  teamLead: '',
  teamMembers: [],
  sponsor: '',
  preEventMetrics: [],
  currentState: '',
  problemStatement: '',
  agenda: [],
  deliverables: [],
  observations: [],
  results: [],
  savingsTarget: 0,
  savingsActual: 0,
  lessonsLearned: '',
  followUpActions: [],
  createdDate: new Date().toISOString().split('T')[0]
}

export default function KaizenEventPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/continuous-improvement');
  };

  const [event, setEvent] = useState<KaizenEvent>(initialEvent)
  const [newMember, setNewMember] = useState({ name: '', role: '', department: '' })
  const [newMetric, setNewMetric] = useState({ name: '', baseline: 0, unit: '', target: 0 })
  const [newActivity, setNewActivity] = useState({ day: 1, time: '', activity: '', responsible: '' })
  const [newDeliverable, setNewDeliverable] = useState({ name: '', description: '', dueDay: 1 })
  const [newResult, setNewResult] = useState({ metric: '', baseline: 0, achieved: 0, unit: '' })

  // Calculate event end date
  const endDate = useMemo(() => {
    if (!event.startDate) return ''
    const start = new Date(event.startDate)
    start.setDate(start.getDate() + event.durationDays - 1)
    return start.toISOString().split('T')[0]
  }, [event.startDate, event.durationDays])

  // Calculate progress
  const progress = useMemo(() => {
    if (event.status === 'completed') return 100
    if (event.status === 'planning') return 0
    
    const totalActivities = event.agenda.length
    const completedActivities = event.agenda.filter(a => a.completed).length
    return totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0
  }, [event.agenda, event.status])

  // Calculate actual savings (for future use in summary cards)
  // const calculateSavings = useMemo(() => {
  //   return event.results.reduce((sum, result) => {
  //     const improvementPercent = ((result.achieved - result.baseline) / result.baseline) * 100
  //     return sum + improvementPercent
  //   }, 0)
  // }, [event.results])

  // Team member management
  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      toast.error('Please provide team member name')
      return
    }
    
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      role: newMember.role.trim() || 'Team Member',
      department: newMember.department.trim()
    }
    
    setEvent({ ...event, teamMembers: [...event.teamMembers, member] })
    setNewMember({ name: '', role: '', department: '' })
    toast.success('Team member added')
  }

  const handleDeleteMember = (id: string) => {
    setEvent({ ...event, teamMembers: event.teamMembers.filter(m => m.id !== id) })
  }

  // Metric management
  const handleAddMetric = () => {
    if (!newMetric.name.trim() || !newMetric.unit.trim()) {
      toast.error('Please provide metric name and unit')
      return
    }
    
    const metric: PreEventMetric = {
      id: Date.now().toString(),
      ...newMetric
    }
    
    setEvent({ ...event, preEventMetrics: [...event.preEventMetrics, metric] })
    setNewMetric({ name: '', baseline: 0, unit: '', target: 0 })
    toast.success('Metric added')
  }

  const handleDeleteMetric = (id: string) => {
    setEvent({ ...event, preEventMetrics: event.preEventMetrics.filter(m => m.id !== id) })
  }

  // Activity management
  const handleAddActivity = () => {
    if (!newActivity.activity.trim()) {
      toast.error('Please provide activity description')
      return
    }
    
    const activity: Activity = {
      id: Date.now().toString(),
      ...newActivity,
      completed: false
    }
    
    setEvent({ ...event, agenda: [...event.agenda, activity].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)) })
    setNewActivity({ day: 1, time: '', activity: '', responsible: '' })
    toast.success('Activity added')
  }

  const handleToggleActivity = (id: string) => {
    setEvent({
      ...event,
      agenda: event.agenda.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    })
  }

  const handleDeleteActivity = (id: string) => {
    setEvent({ ...event, agenda: event.agenda.filter(a => a.id !== id) })
  }

  // Deliverable management
  const handleAddDeliverable = () => {
    if (!newDeliverable.name.trim()) {
      toast.error('Please provide deliverable name')
      return
    }
    
    const deliverable: Deliverable = {
      id: Date.now().toString(),
      ...newDeliverable,
      status: 'pending',
      completionNotes: ''
    }
    
    setEvent({ ...event, deliverables: [...event.deliverables, deliverable] })
    setNewDeliverable({ name: '', description: '', dueDay: 1 })
    toast.success('Deliverable added')
  }

  const handleUpdateDeliverableStatus = (id: string, status: Deliverable['status']) => {
    setEvent({
      ...event,
      deliverables: event.deliverables.map(d => d.id === id ? { ...d, status } : d)
    })
  }

  const handleDeleteDeliverable = (id: string) => {
    setEvent({ ...event, deliverables: event.deliverables.filter(d => d.id !== id) })
  }

  // Results management
  const handleAddResult = () => {
    if (!newResult.metric.trim()) {
      toast.error('Please provide result metric')
      return
    }
    
    const improvement = ((newResult.achieved - newResult.baseline) / newResult.baseline) * 100
    
    const result: PostEventResult = {
      ...newResult,
      improvement
    }
    
    setEvent({ ...event, results: [...event.results, result] })
    setNewResult({ metric: '', baseline: 0, achieved: 0, unit: '' })
    toast.success('Result added')
  }

  // Export
  const handleExport = () => {
    const exportData = {
      ...event,
      endDate,
      progress,
      exportDate: new Date().toISOString(),
      summary: {
        teamSize: event.teamMembers.length,
        metricsTracked: event.preEventMetrics.length,
        activitiesPlanned: event.agenda.length,
        activitiesCompleted: event.agenda.filter(a => a.completed).length,
        deliverablesCompleted: event.deliverables.filter(d => d.status === 'completed').length,
        savingsAchieved: event.savingsActual
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kaizen-event-${event.name.replace(/\s+/g, '-')}-${event.startDate}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Kaizen event exported')
  }

  // Reset
  const handleReset = () => {
    if (confirm('Start a new Kaizen event? Current data will be cleared.')) {
      setEvent(initialEvent)
      toast.success('New event started')
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
            <h1 className="text-3xl font-bold text-gray-900">Kaizen Event Planner</h1>
            <p className="text-gray-600 mt-1">
              Plan and manage rapid improvement workshops (Kaizen Blitz)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline">
              New Event
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Status & Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Select value={event.status} onValueChange={(value: KaizenEvent['status']) => setEvent({ ...event, status: value })}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.durationDays} days
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.teamMembers.length} members
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Event Progress</span>
                  <span className="font-semibold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>
            Define the event scope and objectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={event.name}
                onChange={(e) => setEvent({ ...event, name: e.target.value })}
                placeholder="e.g., Assembly Line Setup Time Reduction"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="objective">Primary Objective *</Label>
              <Textarea
                id="objective"
                value={event.objective}
                onChange={(e) => setEvent({ ...event, objective: e.target.value })}
                placeholder="What is the main goal of this Kaizen event?"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                placeholder="e.g., Production Floor, Building A"
              />
            </div>
            <div>
              <Label htmlFor="scope">Scope</Label>
              <Input
                id="scope"
                value={event.scope}
                onChange={(e) => setEvent({ ...event, scope: e.target.value })}
                placeholder="e.g., Work Cell 3, Packaging Line"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={event.startDate}
                onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="durationDays">Duration (days)</Label>
              <Input
                id="durationDays"
                type="number"
                value={event.durationDays}
                onChange={(e) => setEvent({ ...event, durationDays: parseInt(e.target.value) || 5 })}
                min="1"
                max="10"
              />
              {endDate && (
                <p className="text-xs text-gray-600 mt-1">End date: {endDate}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team
            </div>
            <Badge variant="outline">{event.teamMembers.length} members</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamLead">Team Lead</Label>
              <Input
                id="teamLead"
                value={event.teamLead}
                onChange={(e) => setEvent({ ...event, teamLead: e.target.value })}
                placeholder="Team facilitator name"
              />
            </div>
            <div>
              <Label htmlFor="sponsor">Executive Sponsor</Label>
              <Input
                id="sponsor"
                value={event.sponsor}
                onChange={(e) => setEvent({ ...event, sponsor: e.target.value })}
                placeholder="Sponsor name"
              />
            </div>
          </div>

          {event.teamMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {event.teamMembers.map((member) => (
                <div key={member.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      {member.department && (
                        <p className="text-xs text-gray-500">{member.department}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Name *"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
              <Input
                placeholder="Role"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              />
              <Input
                placeholder="Department"
                value={newMember.department}
                onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
              />
            </div>
            <Button onClick={handleAddMember} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Team Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Event Metrics & Problem Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Pre-Event Metrics
            </CardTitle>
            <CardDescription>
              Baseline measurements before the event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.preEventMetrics.length > 0 && (
              <div className="space-y-2 mb-3">
                {event.preEventMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{metric.name}</p>
                      <p className="text-xs text-gray-600">
                        Baseline: {metric.baseline} {metric.unit} → Target: {metric.target} {metric.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMetric(metric.id)}
                      className="text-gray-400 hover:text-red-600 ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Input
                placeholder="Metric name *"
                value={newMetric.name}
                onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                className="text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Baseline"
                  value={newMetric.baseline || ''}
                  onChange={(e) => setNewMetric({ ...newMetric, baseline: Number(e.target.value) })}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="Target"
                  value={newMetric.target || ''}
                  onChange={(e) => setNewMetric({ ...newMetric, target: Number(e.target.value) })}
                  className="text-sm"
                />
                <Input
                  placeholder="Unit"
                  value={newMetric.unit}
                  onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
                  className="text-sm"
                />
              </div>
              <Button onClick={handleAddMetric} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Metric
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem Statement</CardTitle>
            <CardDescription>
              Current state and issues to address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea
                id="problemStatement"
                value={event.problemStatement}
                onChange={(e) => setEvent({ ...event, problemStatement: e.target.value })}
                placeholder="Describe the problem this event will address..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="currentState">Current State Description</Label>
              <Textarea
                id="currentState"
                value={event.currentState}
                onChange={(e) => setEvent({ ...event, currentState: e.target.value })}
                placeholder="What is happening now? What are the pain points?"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Agenda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Event Agenda
            </div>
            <Badge variant="outline">
              {event.agenda.filter(a => a.completed).length} / {event.agenda.length} Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            Detailed schedule of activities across all event days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.agenda.length > 0 && (
            <div className="space-y-3 mb-4">
              {Array.from({ length: event.durationDays }, (_, i) => i + 1).map(day => {
                const dayActivities = event.agenda.filter(a => a.day === day)
                if (dayActivities.length === 0) return null

                return (
                  <div key={day} className="border rounded-lg p-3 bg-gray-50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Day {day}
                    </h4>
                    <div className="space-y-2">
                      {dayActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 bg-white rounded">
                          <input
                            type="checkbox"
                            checked={activity.completed}
                            onChange={() => handleToggleActivity(activity.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {activity.time && (
                                <Badge variant="outline" className="text-xs">{activity.time}</Badge>
                              )}
                              <p className={`text-sm ${activity.completed ? 'line-through text-gray-500' : ''}`}>
                                {activity.activity}
                              </p>
                            </div>
                            {activity.responsible && (
                              <p className="text-xs text-gray-600 mt-1">
                                Responsible: {activity.responsible}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Select 
                value={newActivity.day.toString()} 
                onValueChange={(value) => setNewActivity({ ...newActivity, day: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: event.durationDays }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>Day {day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
              />
              <Input
                placeholder="Responsible"
                value={newActivity.responsible}
                onChange={(e) => setNewActivity({ ...newActivity, responsible: e.target.value })}
              />
              <Button onClick={handleAddActivity}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <Textarea
              placeholder="Activity description *"
              value={newActivity.activity}
              onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Deliverables
          </CardTitle>
          <CardDescription>
            Key outputs and documentation from the event
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.deliverables.length > 0 && (
            <div className="space-y-2 mb-4">
              {event.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          deliverable.status === 'completed' ? 'default' :
                          deliverable.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {deliverable.status.replace('_', ' ')}
                        </Badge>
                        <p className="font-medium">{deliverable.name}</p>
                        <Badge variant="outline" className="text-xs">Day {deliverable.dueDay}</Badge>
                      </div>
                      {deliverable.description && (
                        <p className="text-sm text-gray-600">{deliverable.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={deliverable.status}
                        onValueChange={(value: Deliverable['status']) => handleUpdateDeliverableStatus(deliverable.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDeliverable(deliverable.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Deliverable name *"
                value={newDeliverable.name}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, name: e.target.value })}
              />
              <Select 
                value={newDeliverable.dueDay.toString()} 
                onValueChange={(value) => setNewDeliverable({ ...newDeliverable, dueDay: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Due day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: event.durationDays }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>Day {day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Description (optional)"
              value={newDeliverable.description}
              onChange={(e) => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
              rows={2}
            />
            <Button onClick={handleAddDeliverable} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Deliverable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Post-Event Results & Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Results
            </CardTitle>
            <CardDescription>
              Achievements and improvements from the event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.results.length > 0 && (
              <div className="space-y-3 mb-4">
                {event.results.map((result, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium mb-1">{result.metric}</p>
                    <div className="text-sm text-gray-700">
                      <p>Baseline: {result.baseline} {result.unit}</p>
                      <p>Achieved: {result.achieved} {result.unit}</p>
                      <p className={`font-semibold ${result.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Improvement: {result.improvement.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <Input
                placeholder="Metric name *"
                value={newResult.metric}
                onChange={(e) => setNewResult({ ...newResult, metric: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Baseline"
                  value={newResult.baseline || ''}
                  onChange={(e) => setNewResult({ ...newResult, baseline: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Achieved"
                  value={newResult.achieved || ''}
                  onChange={(e) => setNewResult({ ...newResult, achieved: Number(e.target.value) })}
                />
                <Input
                  placeholder="Unit"
                  value={newResult.unit}
                  onChange={(e) => setNewResult({ ...newResult, unit: e.target.value })}
                />
              </div>
              <Button onClick={handleAddResult} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Result
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Financial Impact
            </CardTitle>
            <CardDescription>
              Cost savings and ROI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="savingsTarget">Target Savings ($)</Label>
              <Input
                id="savingsTarget"
                type="number"
                value={event.savingsTarget || ''}
                onChange={(e) => setEvent({ ...event, savingsTarget: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="savingsActual">Actual Savings ($)</Label>
              <Input
                id="savingsActual"
                type="number"
                value={event.savingsActual || ''}
                onChange={(e) => setEvent({ ...event, savingsActual: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            {event.savingsTarget > 0 && event.savingsActual > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Performance vs. Target:</p>
                <div className="text-2xl font-bold text-green-600">
                  {((event.savingsActual / event.savingsTarget) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  ${event.savingsActual.toLocaleString()} / ${event.savingsTarget.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lessons Learned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Lessons Learned
          </CardTitle>
          <CardDescription>
            Key takeaways and insights from the event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={event.lessonsLearned}
            onChange={(e) => setEvent({ ...event, lessonsLearned: e.target.value })}
            placeholder="What worked well? What could be improved? What should be replicated in future events?"
            rows={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}
