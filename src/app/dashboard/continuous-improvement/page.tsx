/**
 * Dashboard - Continuous Improvement Tools Category Page
 * Overview and navigation for all CI tools (PDCA, Kaizen, A3, etc.)
 */

'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Activity, RotateCcw, FileText, Lightbulb, Users, Network, BarChart3 } from 'lucide-react'

const ciTools = [
  {
    id: 'pdca',
    name: 'PDCA Cycle Manager',
    description: 'Plan-Do-Check-Act cycle management for systematic improvement',
    icon: RotateCcw,
    route: '/dashboard/continuous-improvement/pdca',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    features: ['Cycle Tracking', 'Action Items', 'Progress Monitoring', 'Results Analysis'],
    status: 'ready'
  },
  {
    id: 'a3',
    name: 'A3 Problem Solving',
    description: 'Structured problem-solving using the Toyota A3 methodology',
    icon: FileText,
    route: '/dashboard/continuous-improvement/a3',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    features: ['Problem Definition', 'Root Cause Analysis', 'Countermeasures', 'Follow-up'],
    status: 'ready'
  },
  {
    id: 'five-why',
    name: '5 Why Analysis',
    description: 'Root cause analysis using the iterative questioning technique',
    icon: Lightbulb,
    route: '/dashboard/continuous-improvement/five-why',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    features: ['Interactive Questioning', 'Root Cause Tree', 'Action Planning', 'Verification'],
    status: 'ready'
  },
  {
    id: 'fishbone',
    name: 'Fishbone Diagram',
    description: 'Ishikawa cause & effect analysis using the 6M methodology',
    icon: Network,
    route: '/dashboard/continuous-improvement/fishbone',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    features: ['6M Categories', 'Visual Diagram', 'Sub-Causes', 'Export'],
    status: 'ready'
  },
  {
    id: 'pareto',
    name: 'Pareto Analysis',
    description: '80/20 rule analysis to identify vital few from trivial many',
    icon: BarChart3,
    route: '/dashboard/continuous-improvement/pareto',
    color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
    features: ['Data Entry', 'Visual Charts', '80/20 Calculation', 'Insights'],
    status: 'ready'
  },
  {
    id: 'kaizen',
    name: 'Kaizen Event Planner',
    description: 'Plan and manage continuous improvement events and workshops',
    icon: Users,
    route: '/dashboard/continuous-improvement/kaizen',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    features: ['Event Planning', 'Team Management', 'Savings Tracking', 'Results Analysis'],
    status: 'ready'
  },
  {
    id: 'gemba-walk',
    name: 'Gemba Walk Tracker',
    description: 'Document observations and insights from Gemba walks',
    icon: Activity,
    route: '/dashboard/continuous-improvement/gemba',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    features: ['Observation Logging', 'Issue Tracking', 'Action Items', 'Follow-up'],
    status: 'ready'
  },
  {
    id: 'suggestion-system',
    name: 'Suggestion System',
    description: 'Manage employee suggestions and continuous improvement ideas',
    icon: Lightbulb,
    route: '/dashboard/continuous-improvement/suggestions',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    features: ['Idea Submission', 'Voting & Comments', 'Review Workflow', 'Recognition Badges'],
    status: 'ready'
  }
]

export default function ContinuousImprovementDashboardPage() {
  const router = useRouter()

  const handleToolClick = (route: string, status: string) => {
    if (status === 'ready') {
      router.push(route)
    }
  }

  const handleBackClick = () => {
    router.push('/dashboard')
  }

  const readyTools = ciTools.filter(tool => tool.status === 'ready')
  const plannedTools = ciTools.filter(tool => tool.status === 'planned')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBackClick}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Continuous Improvement Tools
                </h1>
                <p className="text-sm text-gray-600">Systematic problem-solving and improvement</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {readyTools.length} of {ciTools.length} tools ready
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Continuous Improvement Methodology
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Implement systematic problem-solving and improvement processes using proven CI methodologies 
            like PDCA, A3, Kaizen, and root cause analysis.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{readyTools.length}</div>
                <div className="text-sm text-muted-foreground">Ready Tools</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{plannedTools.length}</div>
                <div className="text-sm text-muted-foreground">Coming Soon</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">PDCA</div>
                <div className="text-sm text-muted-foreground">Core Method</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-muted-foreground">Why Analysis</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Tools */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Available Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ciTools.map((tool) => {
              const IconComponent = tool.icon
              const isReady = tool.status === 'ready'
              
              return (
                <Card 
                  key={tool.id}
                  className={`${tool.color} border transition-all duration-200 ${
                    isReady ? 'cursor-pointer hover:shadow-lg' : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => isReady && handleToolClick(tool.route, tool.status)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-8 w-8 ${isReady ? 'text-gray-700' : 'text-gray-400'}`} />
                        <div>
                          <CardTitle className={`text-lg ${isReady ? 'text-gray-900' : 'text-gray-600'}`}>
                            {tool.name}
                          </CardTitle>
                          <Badge 
                            variant={isReady ? 'default' : 'secondary'}
                            className={`mt-1 ${isReady ? 'bg-green-100 text-green-800' : ''}`}
                          >
                            {isReady ? 'Ready' : 'Planned'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className={`mt-2 ${isReady ? 'text-gray-700' : 'text-gray-500'}`}>
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${isReady ? '' : 'opacity-50'}`}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled={!isReady}
                    >
                      {isReady ? 'Open Tool →' : 'Coming Soon'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
