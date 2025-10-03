/**
 * Control Chart Violations Component
 * Displays all Nelson Rules violations with recommendations
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  TrendingUp,
  Download
} from 'lucide-react'
import { NelsonAnalysis, getViolationsByRule } from '@/lib/games/catapult/nelsonRules'

// ============================================================================
// TYPES
// ============================================================================

interface ControlChartViolationsProps {
  analysis: NelsonAnalysis | null
  onExport?: () => void
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSeverityIcon(severity: 'high' | 'medium' | 'low') {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="h-4 w-4" />
    case 'medium':
      return <AlertCircle className="h-4 w-4" />
    case 'low':
      return <Info className="h-4 w-4" />
  }
}

function getSeverityColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'low':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ControlChartViolations({
  analysis,
  onExport
}: ControlChartViolationsProps) {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-center py-12 text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No analysis available yet.</p>
          <p className="text-sm mt-2">Run control limits analysis to detect violations.</p>
        </div>
      </Card>
    )
  }

  // Group violations by rule
  const violationsByRule = [1, 2, 3, 4, 5, 6, 7, 8, 0].map(ruleNum => ({
    ruleNumber: ruleNum,
    violations: getViolationsByRule(ruleNum, analysis)
  })).filter(group => group.violations.length > 0)

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Violations & Recommendations
            {analysis.isStable ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>
        </div>
        {onExport && analysis.totalViolations > 0 && (
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 border rounded-lg text-center">
          <div className="text-2xl font-bold">{analysis.totalViolations}</div>
          <div className="text-xs text-muted-foreground mt-1">Total</div>
        </div>
        <div className="p-3 border rounded-lg text-center border-red-200 bg-red-50">
          <div className="text-2xl font-bold text-red-600">{analysis.highSeverityCount}</div>
          <div className="text-xs text-red-700 mt-1">High Severity</div>
        </div>
        <div className="p-3 border rounded-lg text-center border-amber-200 bg-amber-50">
          <div className="text-2xl font-bold text-amber-600">{analysis.mediumSeverityCount}</div>
          <div className="text-xs text-amber-700 mt-1">Medium Severity</div>
        </div>
        <div className="p-3 border rounded-lg text-center border-yellow-200 bg-yellow-50">
          <div className="text-2xl font-bold text-yellow-600">{analysis.lowSeverityCount}</div>
          <div className="text-xs text-yellow-700 mt-1">Low Severity</div>
        </div>
      </div>

      {/* Violations List */}
      {analysis.totalViolations > 0 ? (
        <Accordion type="single" collapsible className="space-y-2">
          {violationsByRule.map((group) => {
            const firstViolation = group.violations[0]
            const ruleLabel = group.ruleNumber === 0 ? 'Range Chart' : `Rule ${group.ruleNumber}`
            
            return (
              <AccordionItem
                key={group.ruleNumber}
                value={`rule-${group.ruleNumber}`}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={firstViolation.severity === 'high' ? 'destructive' : 'secondary'}
                        className="min-w-[80px]"
                      >
                        {ruleLabel}
                      </Badge>
                      <span className="font-semibold text-left">{firstViolation.rule}</span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {group.violations.length} point{group.violations.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Description */}
                    <div className={`p-3 rounded-lg border ${getSeverityColor(firstViolation.severity)}`}>
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(firstViolation.severity)}
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">Description:</div>
                          <p className="text-sm">{firstViolation.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Affected Subgroups */}
                    <div>
                      <div className="font-semibold text-sm mb-2">Affected Subgroups:</div>
                      <div className="flex flex-wrap gap-2">
                        {group.violations.map(violation => (
                          <Badge key={violation.id} variant="outline">
                            #{violation.subgroupNumber}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-blue-900 mb-1">
                            Recommendation:
                          </div>
                          <p className="text-sm text-blue-800">{firstViolation.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-green-50 border-green-200">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-600" />
          <p className="font-semibold text-green-900">Process is in Statistical Control!</p>
          <p className="text-sm text-green-700 mt-2">
            No violations detected. Your process is stable and predictable.
          </p>
        </div>
      )}

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Understanding Violations
        </h4>
        <ul className="text-xs space-y-1 text-blue-800">
          <li>• <strong>High Severity:</strong> Immediate investigation required (points outside limits)</li>
          <li>• <strong>Medium Severity:</strong> Process shows patterns of instability (trends, shifts)</li>
          <li>• <strong>Low Severity:</strong> Minor patterns that warrant monitoring</li>
          <li>• <strong>Action:</strong> Identify and eliminate special causes before capability analysis</li>
        </ul>
      </div>
    </Card>
  )
}
