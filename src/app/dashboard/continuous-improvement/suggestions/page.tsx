'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Lightbulb, Plus, Trash2, Download, ThumbsUp, MessageSquare, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

/**
 * Suggestion System - Phase 4 Week 4 Implementation
 * Employee idea submission, review workflow, implementation tracking, and recognition
 */

type SuggestionStatus = 'submitted' | 'under_review' | 'approved' | 'implemented' | 'rejected' | 'on_hold'
type SuggestionCategory = 'safety' | 'quality' | 'cost_reduction' | 'productivity' | 'environment' | 'ergonomics' | 'other'

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
}

interface Suggestion {
  id: string
  title: string
  description: string
  category: SuggestionCategory
  submittedBy: string
  submittedDate: string
  department: string
  
  // Review
  status: SuggestionStatus
  reviewer: string
  reviewDate: string
  reviewNotes: string
  
  // Implementation
  implementationPlan: string
  implementationDate: string
  implementedBy: string
  
  // Impact
  estimatedSavings: number
  actualSavings: number
  benefitDescription: string
  
  // Engagement
  votes: number
  comments: Comment[]
  
  // Recognition
  rewardAmount: number
  recognitionLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum'
}

const initialSuggestions: Suggestion[] = []

const categoryColors: Record<SuggestionCategory, string> = {
  safety: 'bg-red-50 border-red-200 text-red-700',
  quality: 'bg-blue-50 border-blue-200 text-blue-700',
  cost_reduction: 'bg-green-50 border-green-200 text-green-700',
  productivity: 'bg-purple-50 border-purple-200 text-purple-700',
  environment: 'bg-teal-50 border-teal-200 text-teal-700',
  ergonomics: 'bg-orange-50 border-orange-200 text-orange-700',
  other: 'bg-gray-50 border-gray-200 text-gray-700'
}

const statusColors: Record<SuggestionStatus, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  implemented: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  on_hold: 'bg-gray-100 text-gray-800'
}

export default function SuggestionSystemPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/continuous-improvement');
  };

  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions)
  const [activeTab, setActiveTab] = useState('all')
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    category: 'other' as SuggestionCategory,
    submittedBy: '',
    department: '',
    estimatedSavings: 0,
    benefitDescription: ''
  })
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [newComment, setNewComment] = useState({ author: '', text: '' })

  // Statistics
  const stats = useMemo(() => {
    return {
      total: suggestions.length,
      submitted: suggestions.filter(s => s.status === 'submitted').length,
      underReview: suggestions.filter(s => s.status === 'under_review').length,
      approved: suggestions.filter(s => s.status === 'approved').length,
      implemented: suggestions.filter(s => s.status === 'implemented').length,
      rejected: suggestions.filter(s => s.status === 'rejected').length,
      totalSavings: suggestions.reduce((sum, s) => sum + s.actualSavings, 0),
      estimatedSavings: suggestions.reduce((sum, s) => sum + s.estimatedSavings, 0),
      avgResponseTime: 0 // Could calculate from review dates
    }
  }, [suggestions])

  // Add suggestion
  const handleAddSuggestion = () => {
    if (!newSuggestion.title.trim() || !newSuggestion.description.trim() || !newSuggestion.submittedBy.trim()) {
      toast.error('Please fill in title, description, and your name')
      return
    }

    const suggestion: Suggestion = {
      id: Date.now().toString(),
      ...newSuggestion,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      reviewer: '',
      reviewDate: '',
      reviewNotes: '',
      implementationPlan: '',
      implementationDate: '',
      implementedBy: '',
      actualSavings: 0,
      votes: 0,
      comments: [],
      rewardAmount: 0,
      recognitionLevel: 'none'
    }

    setSuggestions([suggestion, ...suggestions])
    setNewSuggestion({
      title: '',
      description: '',
      category: 'other',
      submittedBy: '',
      department: '',
      estimatedSavings: 0,
      benefitDescription: ''
    })
    toast.success('Suggestion submitted successfully!')
  }

  // Update suggestion status
  const handleUpdateStatus = (id: string, status: SuggestionStatus) => {
    setSuggestions(suggestions.map(s => 
      s.id === id 
        ? { 
            ...s, 
            status,
            reviewDate: (status === 'under_review' || status === 'approved' || status === 'rejected') && !s.reviewDate 
              ? new Date().toISOString().split('T')[0] 
              : s.reviewDate,
            implementationDate: status === 'implemented' && !s.implementationDate 
              ? new Date().toISOString().split('T')[0] 
              : s.implementationDate
          }
        : s
    ))
    toast.success(`Status updated to ${status.replace('_', ' ')}`)
  }

  // Vote on suggestion
  const handleVote = (id: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, votes: s.votes + 1 } : s
    ))
    toast.success('Vote added!')
  }

  // Add comment
  const handleAddComment = (suggestionId: string) => {
    if (!newComment.author.trim() || !newComment.text.trim()) {
      toast.error('Please provide your name and comment')
      return
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: newComment.author.trim(),
      text: newComment.text.trim(),
      timestamp: new Date().toLocaleString()
    }

    setSuggestions(suggestions.map(s => 
      s.id === suggestionId 
        ? { ...s, comments: [...s.comments, comment] }
        : s
    ))
    setNewComment({ author: '', text: '' })
    toast.success('Comment added')
  }

  // Delete suggestion
  const handleDeleteSuggestion = (id: string) => {
    if (confirm('Are you sure you want to delete this suggestion?')) {
      setSuggestions(suggestions.filter(s => s.id !== id))
      if (selectedSuggestion?.id === id) {
        setSelectedSuggestion(null)
      }
      toast.success('Suggestion deleted')
    }
  }

  // Export
  const handleExport = () => {
    const exportData = {
      suggestions,
      statistics: stats,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suggestion-system-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Suggestions exported')
  }

  // Filter suggestions by tab
  const filteredSuggestions = useMemo(() => {
    if (activeTab === 'all') return suggestions
    if (activeTab === 'my_suggestions') return suggestions // Would filter by current user
    return suggestions.filter(s => s.status === activeTab)
  }, [suggestions, activeTab])

  // Get recognition badge
  const getRecognitionBadge = (level: Suggestion['recognitionLevel']) => {
    const badges = {
      none: null,
      bronze: { icon: '🥉', color: 'bg-orange-100 text-orange-800' },
      silver: { icon: '🥈', color: 'bg-gray-100 text-gray-800' },
      gold: { icon: '🥇', color: 'bg-yellow-100 text-yellow-800' },
      platinum: { icon: '💎', color: 'bg-purple-100 text-purple-800' }
    }
    return badges[level]
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
            <h1 className="text-3xl font-bold text-gray-900">Suggestion System</h1>
            <p className="text-gray-600 mt-1">
              Share ideas, drive improvements, get recognized
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Ideas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
              <p className="text-sm text-gray-600">New</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
              <p className="text-sm text-gray-600">Under Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-sm text-gray-600">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{stats.implemented}</div>
              <p className="text-sm text-gray-600">Implemented</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalSavings.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Savings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submit New Suggestion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Submit New Idea
              </CardTitle>
              <CardDescription>
                Share your improvement ideas and help drive positive change
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Idea Title *</Label>
                <Input
                  id="title"
                  value={newSuggestion.title}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                  placeholder="Brief, catchy title for your idea..."
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newSuggestion.description}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                  placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newSuggestion.category} 
                    onValueChange={(value: SuggestionCategory) => setNewSuggestion({ ...newSuggestion, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">🛡️ Safety</SelectItem>
                      <SelectItem value="quality">✓ Quality</SelectItem>
                      <SelectItem value="cost_reduction">💰 Cost Reduction</SelectItem>
                      <SelectItem value="productivity">📈 Productivity</SelectItem>
                      <SelectItem value="environment">🌱 Environment</SelectItem>
                      <SelectItem value="ergonomics">🪑 Ergonomics</SelectItem>
                      <SelectItem value="other">📋 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimatedSavings">Estimated Annual Savings ($)</Label>
                  <Input
                    id="estimatedSavings"
                    type="number"
                    value={newSuggestion.estimatedSavings || ''}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, estimatedSavings: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="submittedBy">Your Name *</Label>
                  <Input
                    id="submittedBy"
                    value={newSuggestion.submittedBy}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, submittedBy: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newSuggestion.department}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, department: e.target.value })}
                    placeholder="Your department"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="benefitDescription">Expected Benefits</Label>
                <Textarea
                  id="benefitDescription"
                  value={newSuggestion.benefitDescription}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, benefitDescription: e.target.value })}
                  placeholder="What positive impacts will this have?"
                  rows={2}
                />
              </div>
              <Button onClick={handleAddSuggestion} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Submit Suggestion
              </Button>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="submitted">New ({stats.submitted})</TabsTrigger>
                  <TabsTrigger value="under_review">Review ({stats.underReview})</TabsTrigger>
                  <TabsTrigger value="implemented">Done ({stats.implemented})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No suggestions yet. Be the first to submit an idea!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSuggestions.map((suggestion) => {
                        const recognitionBadge = getRecognitionBadge(suggestion.recognitionLevel)

                        return (
                          <Card 
                            key={suggestion.id} 
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedSuggestion(suggestion)}
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={statusColors[suggestion.status]}>
                                      {suggestion.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="outline" className={categoryColors[suggestion.category]}>
                                      {suggestion.category.replace('_', ' ')}
                                    </Badge>
                                    {recognitionBadge && (
                                      <Badge className={recognitionBadge.color}>
                                        {recognitionBadge.icon} {suggestion.recognitionLevel}
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-lg mb-1">{suggestion.title}</h3>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {suggestion.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {suggestion.submittedBy}
                                    </span>
                                    <span>{suggestion.submittedDate}</span>
                                    {suggestion.department && (
                                      <span>{suggestion.department}</span>
                                    )}
                                    {suggestion.votes > 0 && (
                                      <span className="flex items-center gap-1">
                                        <ThumbsUp className="h-3 w-3" />
                                        {suggestion.votes}
                                      </span>
                                    )}
                                    {suggestion.comments.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {suggestion.comments.length}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVote(suggestion.id)
                                  }}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Details */}
        <div className="lg:col-span-1">
          {selectedSuggestion ? (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Suggestion Details</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedSuggestion(null)}
                  className="absolute top-4 right-4"
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{selectedSuggestion.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{selectedSuggestion.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={statusColors[selectedSuggestion.status]}>
                      {selectedSuggestion.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={categoryColors[selectedSuggestion.category]}>
                      {selectedSuggestion.category.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Submitted by:</span> {selectedSuggestion.submittedBy}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {selectedSuggestion.submittedDate}
                    </div>
                    {selectedSuggestion.department && (
                      <div>
                        <span className="font-medium">Department:</span> {selectedSuggestion.department}
                      </div>
                    )}
                    {selectedSuggestion.estimatedSavings > 0 && (
                      <div>
                        <span className="font-medium">Est. Savings:</span> ${selectedSuggestion.estimatedSavings.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Management */}
                <div className="pt-4 border-t">
                  <Label>Update Status</Label>
                  <Select 
                    value={selectedSuggestion.status} 
                    onValueChange={(value: SuggestionStatus) => handleUpdateStatus(selectedSuggestion.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comments */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comments ({selectedSuggestion.comments.length})
                  </h4>
                  
                  {selectedSuggestion.comments.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                      {selectedSuggestion.comments.map((comment) => (
                        <div key={comment.id} className="p-2 bg-gray-50 rounded text-sm">
                          <p className="font-medium text-xs text-gray-600 mb-1">
                            {comment.author} • {comment.timestamp}
                          </p>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Input
                      placeholder="Your name"
                      value={newComment.author}
                      onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                      className="text-sm"
                    />
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment.text}
                      onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                      rows={2}
                      className="text-sm"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddComment(selectedSuggestion.id)}
                      className="w-full"
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSuggestion(selectedSuggestion.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Suggestion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Select a suggestion to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
