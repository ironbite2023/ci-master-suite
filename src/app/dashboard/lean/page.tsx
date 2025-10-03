/**
 * Dashboard - Lean Tools Category Page
 * Overview and navigation for all Lean Manufacturing tools
 */

'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, BarChart3, CheckSquare, Target, Clock } from 'lucide-react'

const leanTools = [
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Visual workflow management with WIP limits and cycle time tracking',
    icon: BarChart3,
    route: '/dashboard/lean/kanban',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    features: ['Drag & Drop', 'WIP Limits', 'Cycle Time', 'Due Dates'],
    status: 'ready'
  },
  {
    id: 'five-s',
    name: '5S Audit Tool',
    description: 'Comprehensive workplace organization assessment (Sort, Set, Shine, Standardize, Sustain)',
    icon: CheckSquare,
    route: '/dashboard/lean/five-s',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    features: ['25 Questions', 'Real-time Scoring', 'Japanese Terms', 'Export Reports'],
    status: 'ready'
  },
  {
    id: 'oee',
    name: 'OEE Calculator',
    description: 'Overall Equipment Effectiveness analysis (Availability × Performance × Quality)',
    icon: Target,
    route: '/dashboard/lean/oee',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    features: ['Real-time OEE', 'Component Metrics', 'World Class Recognition', 'Recommendations'],
    status: 'ready'
  },
  {
    id: 'vsm',
    name: 'Value Stream Mapping',
    description: 'Process flow analysis with waste identification and future state planning',
    icon: TrendingUp,
    route: '/dashboard/lean/vsm',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    features: ['8 Wastes', 'Lead Time', 'PCE Analysis', 'Future State'],
    status: 'ready'
  },
  {
    id: 'takt-time',
    name: 'Takt Time Calculator',
    description: 'Customer demand rate analysis and production planning',
    icon: Clock,
    route: '/dashboard/lean/takt-time',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    features: ['Demand Analysis', 'Staffing Calculator', 'Line Balance', 'Capacity Planning'],
    status: 'ready'
  },
  {
    id: 'poka-yoke',
    name: 'Poka-Yoke Designer',
    description: 'Mistake-proofing device design and tracking with ROI analysis',
    icon: CheckSquare,
    route: '/dashboard/lean/poka-yoke',
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    features: ['Device Types', 'Cost-Benefit', 'Implementation Tracking', 'ROI Analysis'],
    status: 'ready'
  }
]

export default function LeanDashboardPage() {
  const router = useRouter()

  const handleToolClick = (route: string, status: string) => {
    if (status === 'ready') {
      router.push(route)
    }
  }

  const handleBackClick = () => {
    router.push('/dashboard')
  }

  const readyTools = leanTools.filter(tool => tool.status === 'ready')
  const plannedTools = leanTools.filter(tool => tool.status === 'planned')

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
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Lean Manufacturing Tools
                </h1>
                <p className="text-sm text-gray-600">Eliminate waste and optimize flow</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {readyTools.length} of {leanTools.length} tools ready
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Lean Manufacturing Toolkit
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Eliminate the eight wastes, optimize flow, and create value for your customers using proven Lean methodologies.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{readyTools.length}</div>
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
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-muted-foreground">Waste Types</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">∞</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ready Tools */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-600" />
            Available Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readyTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Card 
                  key={tool.id}
                  className={`cursor-pointer transition-all duration-200 ${tool.color} hover:shadow-lg`}
                  onClick={() => handleToolClick(tool.route, tool.status)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-8 w-8 text-gray-700" />
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            Ready to Use
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Open Tool →
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Coming Soon Tools */}
        {plannedTools.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Coming Soon (Phase 4)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedTools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <Card 
                    key={tool.id}
                    className="opacity-60 cursor-not-allowed"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-8 w-8 text-gray-400" />
                          <div>
                            <CardTitle className="text-lg text-gray-600">{tool.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              Coming Soon
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="mt-2 text-gray-500">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs opacity-50">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full" variant="outline" disabled>
                        Phase 4 Development
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}