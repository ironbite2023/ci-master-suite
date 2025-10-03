'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Target, TrendingUp, Search, Wrench, Shield, CheckCircle, Users, DollarSign, Download, Plus, Trash2, ArrowLeft } from 'lucide-react'
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
 * DMAIC Project Manager - Phase 4 Week 9-10 Implementation
 * Complete Six Sigma project management following DMAIC methodology
 * Define → Measure → Analyze → Improve → Control
 */

type DMAICPhase = 'define' | 'measure' | 'analyze' | 'improve' | 'control'

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
}

interface ProjectCharter {
  businessCase: string
  problemStatement: string
  projectScope: string
  goalStatement: string
  projectPlan: string
  teamRoles: string
}

interface Deliverable {
  id: string
  phase: DMAICPhase
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'approved'
  dueDate: string
  completionDate?: string
  owner: string
  notes: string
}

interface Metric {
  id: string
  name: string
  baseline: number
  target: number
  current: number
  unit: string
  phase: DMAICPhase
}

interface FinancialImpact {
  hardSavings: number
  softSavings: number
  implementationCost: number
  roi: number
}

interface PhaseData {
  define: {
    voiceOfCustomer: string[]
    criticalToQuality: string[]
    processMap: string
  }
  measure: {
    dataCollectionPlan: string
    measurementSystem: string
    capabilityAnalysis: string
  }
  analyze: {
    rootCauses: string[]
    hypothesisTesting: string
    paretoAnalysis: string
  }
  improve: {
    solutions: string[]
    pilotResults: string
    implementationPlan: string
  }
  control: {
    controlPlan: string
    standardization: string[]
    documentation: string[]
  }
}

interface DMAICProject {
  name: string
  description: string
  currentPhase: DMAICPhase
  status: 'active' | 'on_hold' | 'completed' | 'cancelled'
  
  // Team & Charter
  champion: string
  blackBelt: string
  teamMembers: TeamMember[]
  charter: ProjectCharter
  
  // Dates
  startDate: string
  targetDate: string
  completionDate: string
  
  // Tracking
  deliverables: Deliverable[]
  metrics: Metric[]
  phaseData: PhaseData
  
  // Financial
  financial: FinancialImpact
  
  // Progress
  lessonsLearned: string
  nextSteps: string[]
  
  createdDate: string
}

const initialProject: DMAICProject = {
  name: '',
  description: '',
  currentPhase: 'define',
  status: 'active',
  champion: '',
  blackBelt: '',
  teamMembers: [],
  charter: {
    businessCase: '',
    problemStatement: '',
    projectScope: '',
    goalStatement: '',
    projectPlan: '',
    teamRoles: ''
  },
  startDate: new Date().toISOString().split('T')[0],
  targetDate: '',
  completionDate: '',
  deliverables: [],
  metrics: [],
  phaseData: {
    define: { voiceOfCustomer: [], criticalToQuality: [], processMap: '' },
    measure: { dataCollectionPlan: '', measurementSystem: '', capabilityAnalysis: '' },
    analyze: { rootCauses: [], hypothesisTesting: '', paretoAnalysis: '' },
    improve: { solutions: [], pilotResults: '', implementationPlan: '' },
    control: { controlPlan: '', standardization: [], documentation: [] }
  },
  financial: {
    hardSavings: 0,
    softSavings: 0,
    implementationCost: 0,
    roi: 0
  },
  lessonsLearned: '',
  nextSteps: [],
  createdDate: new Date().toISOString().split('T')[0]
}

export default function DMAICProjectPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  const [project, setProject] = useState<DMAICProject>(initialProject)
  const [newMember, setNewMember] = useState({ name: '', role: '', department: '' })
  const [newDeliverable, setNewDeliverable] = useState({ name: '', description: '', owner: '', dueDate: '' })
  const [newMetric, setNewMetric] = useState({ name: '', baseline: 0, target: 0, current: 0, unit: '' })

  // Calculate progress
  const progress = useMemo(() => {
    const phases: DMAICPhase[] = ['define', 'measure', 'analyze', 'improve', 'control']
    const currentIndex = phases.indexOf(project.currentPhase)
    return ((currentIndex + 1) / 5) * 100
  }, [project.currentPhase])

  // Calculate deliverable completion
  const deliverableStats = useMemo(() => {
    const total = project.deliverables.length
    const completed = project.deliverables.filter(d => d.status === 'completed' || d.status === 'approved').length
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 }
  }, [project.deliverables])

  // Calculate ROI
  useMemo(() => {
    const totalSavings = project.financial.hardSavings + project.financial.softSavings
    const roi = project.financial.implementationCost > 0 
      ? ((totalSavings - project.financial.implementationCost) / project.financial.implementationCost) * 100 
      : 0
    setProject(prev => ({ ...prev, financial: { ...prev.financial, roi } }))
  }, [project.financial.hardSavings, project.financial.softSavings, project.financial.implementationCost])

  // Phase navigation
  const handleAdvancePhase = () => {
    const phases: DMAICPhase[] = ['define', 'measure', 'analyze', 'improve', 'control']
    const currentIndex = phases.indexOf(project.currentPhase)
    if (currentIndex < phases.length - 1) {
      setProject({ ...project, currentPhase: phases[currentIndex + 1] })
      toast.success(`Advanced to ${phases[currentIndex + 1].toUpperCase()} phase`)
    } else {
      toast.success('All phases complete! Consider marking project as completed.')
    }
  }

  // Team management
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
    
    setProject({ ...project, teamMembers: [...project.teamMembers, member] })
    setNewMember({ name: '', role: '', department: '' })
    toast.success('Team member added')
  }

  const handleDeleteMember = (id: string) => {
    setProject({ ...project, teamMembers: project.teamMembers.filter(m => m.id !== id) })
  }

  // Deliverable management
  const handleAddDeliverable = () => {
    if (!newDeliverable.name.trim()) {
      toast.error('Please provide deliverable name')
      return
    }
    
    const deliverable: Deliverable = {
      id: Date.now().toString(),
      phase: project.currentPhase,
      ...newDeliverable,
      status: 'pending',
      notes: ''
    }
    
    setProject({ ...project, deliverables: [...project.deliverables, deliverable] })
    setNewDeliverable({ name: '', description: '', owner: '', dueDate: '' })
    toast.success('Deliverable added')
  }

  const handleUpdateDeliverableStatus = (id: string, status: Deliverable['status']) => {
    setProject({
      ...project,
      deliverables: project.deliverables.map(d => 
        d.id === id 
          ? { ...d, status, completionDate: status === 'completed' || status === 'approved' ? new Date().toISOString().split('T')[0] : d.completionDate }
          : d
      )
    })
  }

  const handleDeleteDeliverable = (id: string) => {
    setProject({ ...project, deliverables: project.deliverables.filter(d => d.id !== id) })
  }

  // Metric management
  const handleAddMetric = () => {
    if (!newMetric.name.trim() || !newMetric.unit.trim()) {
      toast.error('Please provide metric name and unit')
      return
    }
    
    const metric: Metric = {
      id: Date.now().toString(),
      ...newMetric,
      phase: project.currentPhase
    }
    
    setProject({ ...project, metrics: [...project.metrics, metric] })
    setNewMetric({ name: '', baseline: 0, target: 0, current: 0, unit: '' })
    toast.success('Metric added')
  }

  const handleUpdateMetric = (id: string, current: number) => {
    setProject({
      ...project,
      metrics: project.metrics.map(m => m.id === id ? { ...m, current } : m)
    })
  }

  const handleDeleteMetric = (id: string) => {
    setProject({ ...project, metrics: project.metrics.filter(m => m.id !== id) })
  }

  // Export
  const handleExport = () => {
    const exportData = {
      ...project,
      exportDate: new Date().toISOString(),
      summary: {
        progress: Math.round(progress),
        deliverablesCompleted: deliverableStats.completed,
        deliverablesTotal: deliverableStats.total,
        roi: project.financial.roi.toFixed(2),
        netSavings: project.financial.hardSavings + project.financial.softSavings - project.financial.implementationCost
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dmaic-project-${project.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('DMAIC project exported')
  }

  // Phase indicator
  const PhaseIndicator = ({ phase, active }: { phase: DMAICPhase; active: boolean }) => {
    const icons = {
      define: Target,
      measure: TrendingUp,
      analyze: Search,
      improve: Wrench,
      control: Shield
    }
    const Icon = icons[phase]
    
    return (
      <div className={`flex flex-col items-center ${active ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          active ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="mt-2 text-sm font-medium capitalize">{phase}</span>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">DMAIC Project Manager</h1>
            <p className="text-gray-600 mt-1">
              Define → Measure → Analyze → Improve → Control
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={project.status} onValueChange={(value: DMAICProject['status']) => setProject({ ...project, status: value })}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <PhaseIndicator phase="define" active={project.currentPhase === 'define'} />
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                  <div className="h-full bg-blue-600" style={{ width: progress >= 20 ? '100%' : '0%' }} />
                </div>
                <PhaseIndicator phase="measure" active={project.currentPhase === 'measure'} />
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                  <div className="h-full bg-blue-600" style={{ width: progress >= 40 ? '100%' : '0%' }} />
                </div>
                <PhaseIndicator phase="analyze" active={project.currentPhase === 'analyze'} />
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                  <div className="h-full bg-blue-600" style={{ width: progress >= 60 ? '100%' : '0%' }} />
                </div>
                <PhaseIndicator phase="improve" active={project.currentPhase === 'improve'} />
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                  <div className="h-full bg-blue-600" style={{ width: progress >= 80 ? '100%' : '0%' }} />
                </div>
                <PhaseIndicator phase="control" active={project.currentPhase === 'control'} />
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Current Phase: <Badge>{project.currentPhase.toUpperCase()}</Badge></span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
                placeholder="e.g., Reduce Cycle Time in Manufacturing"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                placeholder="Brief project overview..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={project.startDate}
                onChange={(e) => setProject({ ...project, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Completion</Label>
              <Input
                id="targetDate"
                type="date"
                value={project.targetDate}
                onChange={(e) => setProject({ ...project, targetDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="champion">Executive Champion</Label>
              <Input
                id="champion"
                value={project.champion}
                onChange={(e) => setProject({ ...project, champion: e.target.value })}
                placeholder="Sponsor name"
              />
            </div>
            <div>
              <Label htmlFor="blackBelt">Black Belt / Lead</Label>
              <Input
                id="blackBelt"
                value={project.blackBelt}
                onChange={(e) => setProject({ ...project, blackBelt: e.target.value })}
                placeholder="Project lead"
              />
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
              Project Team
            </div>
            <Badge variant="outline">{project.teamMembers.length} members</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.teamMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {project.teamMembers.map((member) => (
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

      {/* Charter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Charter</CardTitle>
          <CardDescription>
            Define the foundation and scope of your Six Sigma project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessCase">Business Case</Label>
            <Textarea
              id="businessCase"
              value={project.charter.businessCase}
              onChange={(e) => setProject({ 
                ...project, 
                charter: { ...project.charter, businessCase: e.target.value } 
              })}
              placeholder="Why is this project important? What is the business impact?"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="problemStatement">Problem Statement</Label>
            <Textarea
              id="problemStatement"
              value={project.charter.problemStatement}
              onChange={(e) => setProject({ 
                ...project, 
                charter: { ...project.charter, problemStatement: e.target.value } 
              })}
              placeholder="Specific, measurable problem description..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="goalStatement">Goal Statement</Label>
            <Textarea
              id="goalStatement"
              value={project.charter.goalStatement}
              onChange={(e) => setProject({ 
                ...project, 
                charter: { ...project.charter, goalStatement: e.target.value } 
              })}
              placeholder="What will success look like? (SMART goals)"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="projectScope">Project Scope</Label>
            <Textarea
              id="projectScope"
              value={project.charter.projectScope}
              onChange={(e) => setProject({ 
                ...project, 
                charter: { ...project.charter, projectScope: e.target.value } 
              })}
              placeholder="What is in-scope and out-of-scope?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Project Metrics
          </CardTitle>
          <CardDescription>
            Track key performance indicators throughout the project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.metrics.length > 0 && (
            <div className="space-y-3 mb-4">
              {project.metrics.map((metric) => {
                const improvement = metric.baseline > 0 
                  ? ((metric.current - metric.baseline) / metric.baseline) * 100 
                  : 0
                const targetMet = metric.target > metric.baseline 
                  ? metric.current >= metric.target 
                  : metric.current <= metric.target

                return (
                  <Card key={metric.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{metric.name}</h4>
                            <Badge variant="outline" className="text-xs">{metric.phase}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                            <div>
                              <p className="text-gray-600">Baseline</p>
                              <p className="font-semibold">{metric.baseline} {metric.unit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Target</p>
                              <p className="font-semibold">{metric.target} {metric.unit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Current</p>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={metric.current}
                                  onChange={(e) => handleUpdateMetric(metric.id, Number(e.target.value))}
                                  className="w-24 h-8"
                                />
                                <span>{metric.unit}</span>
                              </div>
                            </div>
                          </div>
                          {metric.current > 0 && (
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${targetMet ? 'text-green-600' : 'text-orange-600'}`}>
                                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}% change
                              </span>
                              {targetMet && <CheckCircle className="h-4 w-4 text-green-600" />}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteMetric(metric.id)}
                          className="text-gray-400 hover:text-red-600 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Input
              placeholder="Metric name *"
              value={newMetric.name}
              onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
            />
            <div className="grid grid-cols-4 gap-2">
              <Input
                type="number"
                placeholder="Baseline"
                value={newMetric.baseline || ''}
                onChange={(e) => setNewMetric({ ...newMetric, baseline: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Target"
                value={newMetric.target || ''}
                onChange={(e) => setNewMetric({ ...newMetric, target: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Current"
                value={newMetric.current || ''}
                onChange={(e) => setNewMetric({ ...newMetric, current: Number(e.target.value) })}
              />
              <Input
                placeholder="Unit"
                value={newMetric.unit}
                onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
              />
            </div>
            <Button onClick={handleAddMetric} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Metric
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Phase Deliverables</span>
            <Badge variant="outline">
              {deliverableStats.completed} / {deliverableStats.total} Complete ({Math.round(deliverableStats.percentage)}%)
            </Badge>
          </CardTitle>
          <CardDescription>
            Track key deliverables for each DMAIC phase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.deliverables.length > 0 && (
            <div className="space-y-2 mb-4">
              {project.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          deliverable.status === 'approved' ? 'default' :
                          deliverable.status === 'completed' ? 'default' :
                          deliverable.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {deliverable.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{deliverable.phase}</Badge>
                        <p className="font-medium">{deliverable.name}</p>
                      </div>
                      {deliverable.description && (
                        <p className="text-sm text-gray-600 mb-1">{deliverable.description}</p>
                      )}
                      <div className="text-xs text-gray-600">
                        {deliverable.owner && <span>Owner: {deliverable.owner} | </span>}
                        {deliverable.dueDate && <span>Due: {deliverable.dueDate}</span>}
                        {deliverable.completionDate && <span> | Completed: {deliverable.completionDate}</span>}
                      </div>
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
                          <SelectItem value="approved">Approved</SelectItem>
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
              <Input
                placeholder="Owner"
                value={newDeliverable.owner}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, owner: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Description (optional)"
              value={newDeliverable.description}
              onChange={(e) => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
              rows={2}
            />
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Due date"
                value={newDeliverable.dueDate}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, dueDate: e.target.value })}
                className="w-48"
              />
              <Button onClick={handleAddDeliverable} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Deliverable ({project.currentPhase} phase)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Impact */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Financial Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hardSavings">Hard Savings ($)</Label>
              <Input
                id="hardSavings"
                type="number"
                value={project.financial.hardSavings || ''}
                onChange={(e) => setProject({ 
                  ...project, 
                  financial: { ...project.financial, hardSavings: Number(e.target.value) } 
                })}
              />
            </div>
            <div>
              <Label htmlFor="softSavings">Soft Savings ($)</Label>
              <Input
                id="softSavings"
                type="number"
                value={project.financial.softSavings || ''}
                onChange={(e) => setProject({ 
                  ...project, 
                  financial: { ...project.financial, softSavings: Number(e.target.value) } 
                })}
              />
            </div>
            <div>
              <Label htmlFor="implementationCost">Implementation Cost ($)</Label>
              <Input
                id="implementationCost"
                type="number"
                value={project.financial.implementationCost || ''}
                onChange={(e) => setProject({ 
                  ...project, 
                  financial: { ...project.financial, implementationCost: Number(e.target.value) } 
                })}
              />
            </div>
          </div>

          {(project.financial.hardSavings > 0 || project.financial.softSavings > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-1">Total Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(project.financial.hardSavings + project.financial.softSavings).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-1">Net Benefit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(project.financial.hardSavings + project.financial.softSavings - project.financial.implementationCost).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-1">ROI</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {project.financial.roi.toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phase Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => {
            const phases: DMAICPhase[] = ['define', 'measure', 'analyze', 'improve', 'control']
            const currentIndex = phases.indexOf(project.currentPhase)
            if (currentIndex > 0) {
              setProject({ ...project, currentPhase: phases[currentIndex - 1] })
            }
          }}
          disabled={project.currentPhase === 'define'}
        >
          Previous Phase
        </Button>
        <Button
          onClick={handleAdvancePhase}
          disabled={project.currentPhase === 'control'}
        >
          {project.currentPhase === 'control' ? 'All Phases Complete' : 'Next Phase'}
        </Button>
      </div>
    </div>
  )
}

