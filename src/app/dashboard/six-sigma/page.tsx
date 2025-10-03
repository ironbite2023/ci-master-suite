/**
 * Dashboard - Six Sigma Tools Category Page
 * Overview and navigation for all Six Sigma statistical tools
 */

'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BarChart3, Target, TrendingUp, CheckSquare, Calculator, FileText, Clock, AlertTriangle } from 'lucide-react'

const sixSigmaTools = [
  {
    id: 'spc',
    name: 'SPC Control Charts',
    description: 'Statistical Process Control charts with Nelson Rules violation detection',
    icon: BarChart3,
    route: '/dashboard/six-sigma/spc',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    features: ['X-bar R Charts', 'Nelson Rules', 'Control Limits', 'Violation Detection'],
    status: 'ready'
  },
  {
    id: 'capability',
    name: 'Process Capability',
    description: 'Calculate Cp, Cpk, Pp, Ppk and analyze process performance vs specifications',
    icon: Target,
    route: '/dashboard/six-sigma/capability',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    features: ['Cp/Cpk Analysis', 'Sigma Level', 'DPMO', 'Histogram'],
    status: 'ready'
  },
  {
    id: 'hypothesis-testing',
    name: 'Hypothesis Testing',
    description: 'Comprehensive statistical testing suite (t-tests, ANOVA, Chi-square)',
    icon: Calculator,
    route: '/dashboard/six-sigma/hypothesis-testing',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    features: ['T-Tests', 'ANOVA', 'Chi-Square', 'Normality Tests'],
    status: 'ready'
  },
  {
    id: 'doe',
    name: 'Design of Experiments',
    description: 'Plan and analyze designed experiments for process optimization',
    icon: TrendingUp,
    route: '/dashboard/six-sigma/doe',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    features: ['Factorial Design', 'Main Effects', 'Interactions', 'ANOVA'],
    status: 'ready'
  },
  {
    id: 'msa',
    name: 'Measurement System Analysis',
    description: 'Evaluate measurement system variation and reliability',
    icon: CheckSquare,
    route: '/dashboard/six-sigma/msa',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    features: ['Gage R&R', 'Variance Components', 'Acceptability', 'Reports'],
    status: 'ready'
  },
  {
    id: 'dmaic',
    name: 'DMAIC Project Manager',
    description: 'Define, Measure, Analyze, Improve, Control project management',
    icon: FileText,
    route: '/dashboard/six-sigma/dmaic',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    features: ['5-Phase Tracking', 'Project Charter', 'Metrics & ROI', 'Deliverables'],
    status: 'ready'
  },
  {
    id: 'fmea',
    name: 'FMEA Analysis',
    description: 'Failure Mode & Effects Analysis with RPN calculation and risk mitigation',
    icon: AlertTriangle,
    route: '/dashboard/six-sigma/fmea',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    features: ['S×O×D=RPN', 'Risk Matrix', 'Action Plans', 'Before/After Comparison'],
    status: 'ready'
  }
]

export default function SixSigmaDashboardPage() {
  const router = useRouter()

  const handleToolClick = (route: string, status: string) => {
    if (status === 'ready') {
      router.push(route)
    }
  }

  const handleBackClick = () => {
    router.push('/dashboard')
  }

  const readyTools = sixSigmaTools.filter(tool => tool.status === 'ready')
  const plannedTools = sixSigmaTools.filter(tool => tool.status === 'planned')

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
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  Six Sigma Tools
                </h1>
                <p className="text-sm text-gray-600">Data-driven quality improvement</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {readyTools.length} of {sixSigmaTools.length} tools ready
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Six Sigma Statistical Toolkit
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Data-driven quality improvement using statistical analysis, control charts, 
            capability studies, and hypothesis testing for process excellence.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{readyTools.length}</div>
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
                <div className="text-2xl font-bold text-blue-600">3.4</div>
                <div className="text-sm text-muted-foreground">DPMO Target</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">6σ</div>
                <div className="text-sm text-muted-foreground">Sigma Level</div>
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
