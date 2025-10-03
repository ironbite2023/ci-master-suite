/**
 * GuidePanel Component
 * Contextual help sidebar with tips, warnings, best practices, and resources
 */

'use client'

import React, { useState } from 'react'
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  X,
  PlayCircle,
  FileText,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { GuidePanelProps } from '@/types/guided-tools'

type TabValue = 'tips' | 'warnings' | 'practices' | 'mistakes' | 'resources'

export const GuidePanel: React.FC<GuidePanelProps> = ({
  guidance,
  position = 'right',
  collapsible = true,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [activeTab, setActiveTab] = useState<TabValue>('tips')

  // Count items for each tab (with safe defaults)
  const counts = {
    tips: guidance.tips?.length || 0,
    warnings: guidance.warnings?.length || 0,
    practices: guidance.bestPractices?.length || 0,
    mistakes: guidance.commonMistakes?.length || 0,
    resources: guidance.resources?.length || 0
  }

  if (!isExpanded && collapsible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="guide-panel-toggle fixed right-4 top-24 z-10 shadow-lg"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Show Guide
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        'guide-panel',
        position === 'right' && 'w-full lg:w-80',
        position === 'bottom' && 'w-full',
        'shadow-md'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Guidance & Tips
          </CardTitle>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="tips" className="flex-col py-2 px-1">
              <Lightbulb className="h-3 w-3 mb-1" />
              <span className="text-xs">Tips</span>
              {counts.tips > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 h-4 min-w-4 mt-1">
                  {counts.tips}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="warnings" className="flex-col py-2 px-1">
              <AlertTriangle className="h-3 w-3 mb-1" />
              <span className="text-xs">Warns</span>
              {counts.warnings > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 h-4 min-w-4 mt-1">
                  {counts.warnings}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="practices" className="flex-col py-2 px-1">
              <CheckCircle2 className="h-3 w-3 mb-1" />
              <span className="text-xs">Best</span>
              {counts.practices > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 h-4 min-w-4 mt-1">
                  {counts.practices}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="flex-col py-2 px-1">
              <X className="h-3 w-3 mb-1" />
              <span className="text-xs">Avoid</span>
              {counts.mistakes > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 h-4 min-w-4 mt-1">
                  {counts.mistakes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex-col py-2 px-1">
              <BookOpen className="h-3 w-3 mb-1" />
              <span className="text-xs">More</span>
              {counts.resources > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1 h-4 min-w-4 mt-1">
                  {counts.resources}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {!guidance.tips || guidance.tips.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tips available for this step
              </p>
            ) : (
              guidance.tips.map((tip, index) => {
                // Handle both string and object formats
                const isString = typeof tip === 'string'
                const tipKey = isString ? `tip-${index}` : tip.id || `tip-${index}`
                
                return (
                  <div
                    key={tipKey}
                    className={cn(
                      'flex gap-2 p-3 rounded-lg border',
                      !isString && tip.priority === 'high' && 'bg-blue-50 border-blue-200',
                      !isString && tip.priority === 'medium' && 'bg-indigo-50 border-indigo-200',
                      !isString && tip.priority === 'low' && 'bg-gray-50 border-gray-200',
                      isString && 'bg-blue-50 border-blue-200'
                    )}
                  >
                    <span className="text-lg flex-shrink-0">
                      {isString ? '💡' : tip.icon || '💡'}
                    </span>
                    <div className="flex-1 min-w-0">
                      {isString ? (
                        <p className="text-sm text-gray-900">{tip}</p>
                      ) : (
                        <>
                          <p className="font-medium text-sm text-gray-900">{tip.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{tip.content}</p>
                          {tip.audience && tip.audience !== 'all' && (
                            <Badge variant="outline" className="text-[10px] mt-2">
                              {tip.audience}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </TabsContent>

          {/* Warnings Tab */}
          <TabsContent value="warnings" className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {!guidance.warnings || guidance.warnings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No warnings for this step
              </p>
            ) : (
              guidance.warnings.map(warning => (
                <Alert
                  key={warning.id}
                  variant={warning.type === 'error' ? 'destructive' : 'default'}
                  className={cn(
                    warning.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-900',
                    warning.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-900'
                  )}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">{warning.title}</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    {warning.content}
                  </AlertDescription>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] mt-2',
                      warning.severity === 'high' && 'border-red-300',
                      warning.severity === 'medium' && 'border-yellow-300',
                      warning.severity === 'low' && 'border-blue-300'
                    )}
                  >
                    {warning.severity} severity
                  </Badge>
                </Alert>
              ))
            )}
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="practices" className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {!guidance.bestPractices || guidance.bestPractices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No best practices for this step
              </p>
            ) : (
              guidance.bestPractices.map((practice, index) => {
                // Handle both string and object formats
                const isString = typeof practice === 'string'
                const practiceKey = isString ? `practice-${index}` : practice.id || `practice-${index}`
                
                return (
                  <div key={practiceKey} className="p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {isString ? (
                          <p className="text-sm text-gray-900">{practice}</p>
                        ) : (
                          <>
                            <p className="font-medium text-sm text-gray-900">{practice.practice}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              <strong className="text-gray-700">Why:</strong> {practice.rationale}
                            </p>
                            {practice.example && (
                              <div className="mt-2 p-2 bg-white rounded text-xs border border-green-100">
                                <strong className="text-gray-700">Example:</strong> {practice.example}
                              </div>
                            )}
                            {practice.source && (
                              <p className="text-[10px] text-gray-500 mt-1 italic">
                                Source: {practice.source}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </TabsContent>

          {/* Common Mistakes Tab */}
          <TabsContent value="mistakes" className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {!guidance.commonMistakes || guidance.commonMistakes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No common mistakes documented for this step
              </p>
            ) : (
              guidance.commonMistakes.map((mistake, index) => (
                <div key={mistake.id || `mistake-${index}`} className="p-3 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">{mistake.mistake}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong className="text-red-700">Why it&apos;s wrong:</strong> {mistake.whyItsWrong}
                      </p>
                      <div className="mt-2 p-2 bg-white rounded text-xs border border-green-100">
                        <strong className="text-green-700">✓ Correction:</strong> {mistake.correction}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-2 mt-4 max-h-96 overflow-y-auto">
            {!guidance.resources || guidance.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No additional resources for this step
              </p>
            ) : (
              guidance.resources.map(resource => {
                const Icon = 
                  resource.type === 'video' ? PlayCircle :
                  resource.type === 'article' ? FileText :
                  resource.type === 'template' ? Download :
                  BookOpen

                return (
                  <button
                    key={resource.id}
                    className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    onClick={() => {
                      if (resource.url) {
                        window.open(resource.url, '_blank')
                      }
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn(
                        'h-4 w-4 mt-0.5 flex-shrink-0',
                        resource.type === 'video' && 'text-red-600',
                        resource.type === 'article' && 'text-blue-600',
                        resource.type === 'template' && 'text-green-600',
                        !['video', 'article', 'template'].includes(resource.type) && 'text-gray-600'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">{resource.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{resource.description}</p>
                        <div className="flex gap-2 mt-2">
                          {resource.duration && (
                            <Badge variant="secondary" className="text-[10px]">
                              {resource.duration}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px]">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}

            {/* Related Concepts */}
            {guidance.relatedConcepts && guidance.relatedConcepts.length > 0 && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-xs font-semibold text-gray-700 mb-2">Related Concepts</p>
                <div className="space-y-2">
                  {guidance.relatedConcepts.map(concept => (
                    <div key={concept.id} className="p-2 bg-gray-50 rounded text-xs">
                      <p className="font-medium text-gray-900">{concept.name}</p>
                      <p className="text-gray-600 mt-0.5">{concept.description}</p>
                      {concept.learnMoreUrl && (
                        <a
                          href={concept.learnMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-[10px] mt-1 inline-block"
                        >
                          Learn more →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
