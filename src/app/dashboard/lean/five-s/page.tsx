'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, Download, TrendingUp, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const auditQuestions = {
  'sort': [
    'Unnecessary items have been removed from the work area',
    'Clear distinction between needed and not-needed items',
    'Red tag system is implemented for questionable items',
    'No broken or unusable tools/equipment present',
    'Materials and supplies are limited to what is necessary'
  ],
  'set-in-order': [
    'Everything has a designated place',
    'Visual controls and labels are clearly visible',
    'Tools and materials are stored in logical locations',
    'Shadow boards or outlines are used for tool placement',
    'Frequently used items are easily accessible'
  ],
  'shine': [
    'Work area is clean and free from dirt/debris',
    'Equipment is clean and well-maintained',
    'Cleaning supplies are readily available',
    'Regular cleaning schedule is established',
    'Inspection during cleaning reveals potential issues'
  ],
  'standardize': [
    'Standard procedures are documented and visible',
    'Visual standards are established for each area',
    'Checklists and procedures are up-to-date',
    'Best practices are shared across teams',
    'Standardized labeling system is implemented'
  ],
  'sustain': [
    'Regular 5S audits are conducted',
    'Management actively supports 5S activities',
    'Training on 5S principles is provided',
    'Continuous improvement mindset is evident',
    'Employees take ownership of their work areas'
  ]
}

export default function FiveSPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/lean');
  };

  const [areaName, setAreaName] = useState('Production Area A')
  const [auditor, setAuditor] = useState('')
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0])
  
  const [scores, setScores] = useState<Record<string, { score: number; comment: string }>>({})

  const handleScoreChange = (category: string, index: number, score: number) => {
    const key = `${category}-${index}`
    setScores(prev => ({
      ...prev,
      [key]: { ...prev[key], score }
    }))
  }

  const handleCommentChange = (category: string, index: number, comment: string) => {
    const key = `${category}-${index}`
    setScores(prev => ({
      ...prev,
      [key]: { ...prev[key], comment }
    }))
  }

  const calculateCategoryScore = useCallback((category: string) => {
    const questions = auditQuestions[category as keyof typeof auditQuestions]
    let total = 0
    let count = 0
    
    questions.forEach((_, index) => {
      const key = `${category}-${index}`
      if (scores[key]?.score !== undefined) {
        total += scores[key].score
        count++
      }
    })
    
    return count > 0 ? (total / count).toFixed(1) : '0.0'
  }, [scores])

  const totalScore = useMemo(() => {
    const categories = ['sort', 'set-in-order', 'shine', 'standardize', 'sustain']
    const categoryScores = categories.map(cat => parseFloat(calculateCategoryScore(cat)))
    const sum = categoryScores.reduce((a, b) => a + b, 0)
    return (sum / categories.length).toFixed(1)
  }, [calculateCategoryScore])

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent'
    if (score >= 4.0) return 'Good'
    if (score >= 3.0) return 'Fair'
    if (score >= 2.0) return 'Needs Improvement'
    return 'Poor'
  }

  const handleExport = () => {
    const report = `5S Audit Report
Generated: ${new Date().toLocaleString()}

=== AUDIT DETAILS ===
Area: ${areaName}
Auditor: ${auditor || 'Not specified'}
Date: ${auditDate}
Total Score: ${totalScore}/5.0 (${getScoreLabel(parseFloat(totalScore))})

=== CATEGORY SCORES ===
Sort: ${calculateCategoryScore('sort')}/5.0
Set in Order: ${calculateCategoryScore('set-in-order')}/5.0
Shine: ${calculateCategoryScore('shine')}/5.0
Standardize: ${calculateCategoryScore('standardize')}/5.0
Sustain: ${calculateCategoryScore('sustain')}/5.0

=== DETAILED RESULTS ===

${Object.keys(auditQuestions).map(category => `
${category.toUpperCase().replace(/-/g, ' ')}
${auditQuestions[category as keyof typeof auditQuestions].map((q, i) => {
  const key = `${category}-${i}`
  const score = scores[key]?.score || 0
  const comment = scores[key]?.comment || ''
  return `  ${i + 1}. ${q}
     Score: ${score}/5
     ${comment ? `Comment: ${comment}` : ''}`
}).join('\n')}
`).join('\n')}
`

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `5s-audit-${areaName.replace(/\s+/g, '-')}-${auditDate}.txt`
    a.click()
    toast.success('Report exported successfully')
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lean Tools
            </Button>
          </div>
          <h1 className="text-3xl font-bold">5S Audit Tool</h1>
          <p className="text-muted-foreground mt-1">
            Sort, Set in Order, Shine, Standardize, Sustain
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Audit Info */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Area Name</Label>
              <Input
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="Enter area name"
              />
            </div>
            <div>
              <Label>Auditor</Label>
              <Input
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                placeholder="Enter auditor name"
              />
            </div>
            <div>
              <Label>Audit Date</Label>
              <Input
                type="date"
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {['Sort', 'Set in Order', 'Shine', 'Standardize', 'Sustain'].map((name, index) => {
          const category = name.toLowerCase().replace(/\s+/g, '-')
          const score = parseFloat(calculateCategoryScore(category))
          
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardDescription>{name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {calculateCategoryScore(category)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">out of 5.0</p>
              </CardContent>
            </Card>
          )
        })}
        
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <CardDescription>Total Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(parseFloat(totalScore))}`}>
              {totalScore}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getScoreLabel(parseFloat(totalScore))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Checklist */}
      <Tabs defaultValue="sort" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sort">1. Sort</TabsTrigger>
          <TabsTrigger value="set-in-order">2. Set in Order</TabsTrigger>
          <TabsTrigger value="shine">3. Shine</TabsTrigger>
          <TabsTrigger value="standardize">4. Standardize</TabsTrigger>
          <TabsTrigger value="sustain">5. Sustain</TabsTrigger>
        </TabsList>

        {Object.entries(auditQuestions).map(([category, questions]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">{category.replace(/-/g, ' ')}</CardTitle>
                    <CardDescription className="mt-2">
                      {category === 'sort' && 'Seiri - Remove unnecessary items'}
                      {category === 'set-in-order' && 'Seiton - Organize and identify'}
                      {category === 'shine' && 'Seiso - Clean and inspect'}
                      {category === 'standardize' && 'Seiketsu - Create standards'}
                      {category === 'sustain' && 'Shitsuke - Maintain and improve'}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(parseFloat(calculateCategoryScore(category)))}`}>
                      {calculateCategoryScore(category)}
                    </div>
                    <p className="text-sm text-muted-foreground">Category Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => {
                  const key = `${category}-${index}`
                  const currentScore = scores[key]?.score || 0
                  const currentComment = scores[key]?.comment || ''
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="font-semibold text-primary">{index + 1}.</span>
                        <p className="flex-1 font-medium">{question}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm mb-2 block">Score (0-5)</Label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange(category, index, score)}
                              className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                                currentScore === score
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-300 hover:border-primary'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          0 = Not Implemented | 5 = Fully Implemented
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Comments / Observations</Label>
                        <Textarea
                          value={currentComment}
                          onChange={(e) => handleCommentChange(category, index, e.target.value)}
                          placeholder="Add notes, observations, or improvement suggestions..."
                          rows={2}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Summary & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Overall Assessment</h3>
            <p className="text-sm text-muted-foreground">
              Total Score: <span className={`font-bold ${getScoreColor(parseFloat(totalScore))}`}>
                {totalScore}/5.0 ({getScoreLabel(parseFloat(totalScore))})
              </span>
            </p>
            <Progress value={parseFloat(totalScore) * 20} className="mt-2" />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Areas Needing Attention</h3>
            <ul className="space-y-1">
              {['sort', 'set-in-order', 'shine', 'standardize', 'sustain'].map(category => {
                const score = parseFloat(calculateCategoryScore(category))
                if (score < 3) {
                  return (
                    <li key={category} className="text-sm flex items-center gap-2">
                      <Circle className="h-3 w-3" />
                      <span className="capitalize">{category.replace(/-/g, ' ')}</span>
                      <Badge variant="destructive">{score}/5.0</Badge>
                    </li>
                  )
                }
                return null
              }).filter(Boolean)}
            </ul>
          </div>

          {parseFloat(totalScore) >= 4.5 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-semibold">Excellent 5S Implementation!</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Continue the great work and maintain these standards.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
