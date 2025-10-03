/**
 * CompletionSummary Component
 * Displays completion celebration and summary
 */

'use client'

import React from 'react'
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Trophy,
  Clock,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ToolConfiguration, NextStep } from '@/types/guided-tools'
import { formatDuration } from '@/lib/guided-tools/utils'

interface CompletionSummaryProps {
  toolConfig: ToolConfiguration
  completedData: Record<string, unknown>
  timeSpent?: number
  onExport?: () => void
  onNavigate?: (route: string) => void
  onClose?: () => void
}

export const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  toolConfig,
  timeSpent,
  onExport,
  onNavigate,
  onClose
}) => {
  const handleNextStepClick = (nextStep: NextStep) => {
    if (nextStep.route && onNavigate) {
      onNavigate(nextStep.route)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Celebration Header */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle2 className="h-20 w-20 text-green-600 animate-in zoom-in-50 duration-500" />
                <Trophy className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-in zoom-in duration-700" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Congratulations! 🎉
              </h1>
              <p className="text-lg text-gray-700">
                You&apos;ve successfully completed the <strong>{toolConfig.name}</strong>
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 justify-center flex-wrap mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border">
                <Target className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Steps Completed</div>
                  <div className="font-semibold">{toolConfig.steps.length}</div>
                </div>
              </div>
              
              {timeSpent && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Time Spent</div>
                    <div className="font-semibold">{formatDuration(timeSpent)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Outcomes */}
      {toolConfig.introduction.expectedOutcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              What You&apos;ve Accomplished
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {toolConfig.introduction.expectedOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {toolConfig.nextSteps && toolConfig.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              Recommended Next Steps
            </CardTitle>
            <CardDescription>
              Continue your journey with these suggested actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {toolConfig.nextSteps.map((nextStep) => (
              <div
                key={nextStep.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{nextStep.title}</h4>
                    <Badge
                      variant={nextStep.priority === 'recommended' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {nextStep.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{nextStep.description}</p>
                </div>
                {nextStep.route && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNextStepClick(nextStep)}
                    className="ml-4 flex-shrink-0"
                  >
                    Go
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What would you like to do?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {onExport && (
              <Button
                variant="outline"
                onClick={onExport}
                className="h-auto py-4 flex-col gap-2"
              >
                <Download className="h-6 w-6" />
                <div className="text-sm font-medium">Export Results</div>
                <div className="text-xs text-gray-600">Download as PDF/JSON</div>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.print()}
              className="h-auto py-4 flex-col gap-2"
            >
              <CheckCircle2 className="h-6 w-6" />
              <div className="text-sm font-medium">Print Summary</div>
              <div className="text-xs text-gray-600">Save or print this page</div>
            </Button>

            {onClose && (
              <Button
                onClick={onClose}
                className="h-auto py-4 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="h-6 w-6" />
                <div className="text-sm font-medium">Continue</div>
                <div className="text-xs">Return to dashboard</div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Tools */}
      {toolConfig.relatedTools && toolConfig.relatedTools.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-lg">Related Tools</CardTitle>
            <CardDescription>
              These tools complement what you&apos;ve just completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {toolConfig.relatedTools.map((toolId) => (
                <Badge key={toolId} variant="outline" className="text-sm">
                  {toolId}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* Footer Message */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Great work! You&apos;ve taken an important step in your continuous improvement journey.
        </p>
        <p className="mt-1">
          Remember: The real impact comes from implementing what you&apos;ve learned.
        </p>
      </div>
    </div>
  )
}
