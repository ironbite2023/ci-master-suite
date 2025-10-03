'use client'

import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Settings, Activity, Users, LogOut, Gamepad2, GraduationCap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

// Tool categories data
const toolCategories = [
  {
    id: 'continuous-improvement',
    name: 'Continuous Improvement',
    description: 'Kaizen, PDCA, A3, 5 Why, and root cause analysis tools',
    icon: TrendingUp,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    tools: ['Kaizen Planner', 'PDCA Manager', 'A3 Problem Solver', '5 Why Analysis'],
    count: 15
  },
  {
    id: 'lean',
    name: 'Lean Tools',
    description: 'Value stream mapping, takt time, kanban, and waste reduction',
    icon: Activity,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    tools: ['Value Stream Map', 'Takt Time Calculator', 'Kanban Designer', '5S Audit'],
    count: 18
  },
  {
    id: 'six-sigma',
    name: 'Six Sigma',
    description: 'Statistical tools, SPC, capability analysis, and DMAIC',
    icon: BarChart3,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    tools: ['Control Charts', 'Process Capability', 'DOE', 'Hypothesis Testing'],
    count: 22
  }
]

// Quick access navigation items
const quickAccessLinks = [
  {
    id: 'games',
    name: 'Interactive Games',
    description: 'Learn Six Sigma and Lean concepts through engaging games and challenges',
    icon: Gamepad2,
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconColor: 'text-orange-600',
    route: '/games',
    badge: 'Play & Learn',
    features: ['Catapult Challenge', 'Lean Flow Master', 'Six Sigma Quest']
  },
  {
    id: 'academy',
    name: 'CI Academy',
    description: 'Comprehensive training courses, certifications, and learning paths',
    icon: GraduationCap,
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    iconColor: 'text-indigo-600',
    route: '/academy',
    badge: 'Training',
    features: ['Foundation Belt', 'Green Belt', 'Black Belt']
  }
]

const recentProjects = [
  { id: 1, name: 'Assembly Line Improvement', type: 'Lean', lastAccessed: '2 hours ago' },
  { id: 2, name: 'Quality Control Analysis', type: 'Six Sigma', lastAccessed: '1 day ago' },
  { id: 3, name: 'Kaizen Event Planning', type: 'CI', lastAccessed: '3 days ago' },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/dashboard/${categoryId}`)
  }

  const handleQuickAccessClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CI Master Suite</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Lean Six Sigma toolkit
          </h2>
          <p className="text-lg text-gray-600">
            Choose a category to start analyzing your processes and driving improvements.
          </p>
        </div>

        {/* Quick Access - Learning & Development */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Learning & Development</h3>
            <p className="text-sm text-gray-600">Enhance your CI skills through games and training</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickAccessLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Card 
                  key={link.id}
                  className={`cursor-pointer transition-all duration-200 ${link.color} border-2`}
                  onClick={() => handleQuickAccessClick(link.route)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                          <IconComponent className={`h-6 w-6 ${link.iconColor}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{link.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {link.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Available:</p>
                      <div className="flex flex-wrap gap-1">
                        {link.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tool Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {toolCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-200 ${category.color}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8 text-gray-700" />
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {category.count} tools
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Featured Tools:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.tools.slice(0, 3).map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                      {category.tools.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.tools.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Projects
            </CardTitle>
            <CardDescription>
              Continue working on your improvement initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.type} • {project.lastAccessed}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full">
                    View All Projects
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No recent projects</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start by selecting a tool category above
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
