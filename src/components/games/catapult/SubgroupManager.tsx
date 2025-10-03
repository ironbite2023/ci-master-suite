/**
 * Subgroup Manager Component
 * Table view for managing and inspecting subgroups
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react'
import { Subgroup, ControlLimits } from '@/lib/games/catapult/controlCharts'
import { NelsonAnalysis } from '@/lib/games/catapult/nelsonRules'

// ============================================================================
// TYPES
// ============================================================================

interface SubgroupManagerProps {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  analysis: NelsonAnalysis | null
  onDeleteSubgroup?: (subgroupId: string) => void
  onExport?: () => void
}

type SortField = 'number' | 'mean' | 'range' | 'timestamp'
type SortDirection = 'asc' | 'desc'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function hasViolation(subgroupIndex: number, analysis: NelsonAnalysis | null): boolean {
  if (!analysis) return false
  return analysis.violations.some(v => v.subgroupIndex === subgroupIndex)
}

function getViolationCount(subgroupIndex: number, analysis: NelsonAnalysis | null): number {
  if (!analysis) return 0
  return analysis.violations.filter(v => v.subgroupIndex === subgroupIndex).length
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SubgroupManager({
  subgroups,
  controlLimits,
  analysis,
  onDeleteSubgroup,
  onExport
}: SubgroupManagerProps) {
  const [sortField, setSortField] = useState<SortField>('number')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expandedSubgroup, setExpandedSubgroup] = useState<string | null>(null)

  // Handle sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort subgroups
  const sortedSubgroups = [...subgroups].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case 'number':
        comparison = a.subgroupNumber - b.subgroupNumber
        break
      case 'mean':
        comparison = a.mean - b.mean
        break
      case 'range':
        comparison = a.range - b.range
        break
      case 'timestamp':
        comparison = a.timestamp.getTime() - b.timestamp.getTime()
        break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Render sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    )
  }

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Subgroup Data</h3>
          <p className="text-sm text-muted-foreground">
            {subgroups.length} subgroup{subgroups.length !== 1 ? 's' : ''} collected
          </p>
        </div>
        {onExport && subgroups.length > 0 && (
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Table */}
      {subgroups.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">
                  <button
                    onClick={() => handleSort('number')}
                    className="flex items-center gap-1 font-semibold hover:text-primary"
                  >
                    # <SortIcon field="number" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('mean')}
                    className="flex items-center gap-1 font-semibold hover:text-primary"
                  >
                    Mean (x̄) <SortIcon field="mean" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('range')}
                    className="flex items-center gap-1 font-semibold hover:text-primary"
                  >
                    Range (R) <SortIcon field="range" />
                  </button>
                </TableHead>
                <TableHead>Shots</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center gap-1 font-semibold hover:text-primary"
                  >
                    Time <SortIcon field="timestamp" />
                  </button>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubgroups.map((subgroup) => {
                const subgroupIndex = subgroups.findIndex(sg => sg.id === subgroup.id)
                const hasViolations = hasViolation(subgroupIndex, analysis)
                const violationCount = getViolationCount(subgroupIndex, analysis)
                const isExpanded = expandedSubgroup === subgroup.id

                return (
                  <>
                    <TableRow key={subgroup.id} className={hasViolations ? 'bg-red-50' : ''}>
                      <TableCell className="font-medium">
                        {subgroup.subgroupNumber}
                      </TableCell>
                      <TableCell className="font-mono">
                        {subgroup.mean.toFixed(2)} m
                      </TableCell>
                      <TableCell className="font-mono">
                        {subgroup.range.toFixed(2)} m
                      </TableCell>
                      <TableCell>
                        {subgroup.shots.length} shots
                      </TableCell>
                      <TableCell>
                        {hasViolations ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {violationCount} violation{violationCount > 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-xs">
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {subgroup.timestamp.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedSubgroup(isExpanded ? null : subgroup.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {onDeleteSubgroup && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteSubgroup(subgroup.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/50">
                          <div className="p-4 space-y-3">
                            <h4 className="font-semibold text-sm">Individual Shots:</h4>
                            <div className="grid grid-cols-5 gap-2">
                              {subgroup.shots.map((shot, shotIndex) => (
                                <div
                                  key={shot.id}
                                  className="p-2 bg-white rounded border text-center"
                                >
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Shot {shotIndex + 1}
                                  </div>
                                  <div className="font-mono font-semibold">
                                    {shot.distance.toFixed(2)} m
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-2">
                              <div>
                                <div className="text-xs text-muted-foreground">Min</div>
                                <div className="font-semibold">
                                  {Math.min(...subgroup.shots.map(s => s.distance)).toFixed(2)} m
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Mean</div>
                                <div className="font-semibold text-blue-600">
                                  {subgroup.mean.toFixed(2)} m
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Max</div>
                                <div className="font-semibold">
                                  {Math.max(...subgroup.shots.map(s => s.distance)).toFixed(2)} m
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No subgroups collected yet.</p>
          <p className="text-sm mt-2">Start launching shots to collect data.</p>
        </div>
      )}

      {/* Summary Statistics */}
      {controlLimits && subgroups.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Grand Mean (X̿)</div>
              <div className="font-semibold text-blue-600">
                {controlLimits.xBarCL.toFixed(2)} m
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Avg Range (R̄)</div>
              <div className="font-semibold text-green-600">
                {controlLimits.rBarCL.toFixed(2)} m
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Total Shots</div>
              <div className="font-semibold">
                {subgroups.reduce((sum, sg) => sum + sg.shots.length, 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Violations</div>
              <div className="font-semibold text-red-600">
                {analysis?.totalViolations || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
