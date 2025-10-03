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
  TableRow,
} from '@/components/ui/table'
import { 
  CheckCircle2, 
  Circle, 
  Loader2,
  Download,
  RotateCcw,
  ArrowUpDown,
  PlayCircle
} from 'lucide-react'
import type { DOEExperiment, CatapultSettings } from '@/types/catapult'
import { 
  sortExperiments, 
  exportToCSV,
  getExperimentShortLabel,
  loadExperimentSettings
} from '@/lib/games/catapult/doeEngine'
import { formatDistance } from '@/lib/games/catapult/scoring'

// ============================================================================
// TYPES
// ============================================================================

interface ExperimentMatrixProps {
  experiments: DOEExperiment[]
  currentExperiment?: DOEExperiment | null
  onLoadExperiment: (settings: CatapultSettings) => void
  onReset: () => void
  onClose?: () => void
}

type SortBy = 'runNumber' | 'distance' | 'score' | 'completion'

// ============================================================================
// EXPERIMENT MATRIX COMPONENT
// ============================================================================

export function ExperimentMatrix({
  experiments,
  currentExperiment,
  onLoadExperiment,
  onReset,
  onClose
}: ExperimentMatrixProps) {
  const [sortBy, setSortBy] = useState<SortBy>('runNumber')
  
  const sortedExperiments = sortExperiments(experiments, sortBy)
  const completedCount = experiments.filter(exp => exp.completed).length
  
  // Handle row click
  const handleRowClick = (experiment: DOEExperiment) => {
    const settings = loadExperimentSettings(experiment)
    onLoadExperiment(settings)
  }
  
  // Handle CSV export
  const handleExport = () => {
    const csv = exportToCSV(experiments)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `doe-experiments-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  
  // Toggle sort
  const handleSort = (column: SortBy) => {
    setSortBy(column)
  }
  
  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Experiment Matrix</h3>
          <p className="text-sm text-gray-400">
            2³ Factorial Design • {completedCount}/8 Complete
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={completedCount === 0}
          >
            <Download className="mr-2 h-3 w-3" />
            Export CSV
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            disabled={completedCount === 0}
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Reset All
          </Button>
          
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead 
                className="cursor-pointer select-none text-white"
                onClick={() => handleSort('runNumber')}
              >
                <div className="flex items-center gap-1">
                  Run
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white">Angle</TableHead>
              <TableHead className="text-white">Force</TableHead>
              <TableHead className="text-white">Weight</TableHead>
              <TableHead 
                className="cursor-pointer select-none text-white"
                onClick={() => handleSort('distance')}
              >
                <div className="flex items-center gap-1">
                  Distance
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white">Accuracy</TableHead>
              <TableHead 
                className="cursor-pointer select-none text-white"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center gap-1">
                  Score
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center text-white">Status</TableHead>
              <TableHead className="text-center text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExperiments.map((experiment) => {
              const isCurrent = currentExperiment?.runNumber === experiment.runNumber
              const rowClass = isCurrent
                ? 'bg-purple-500/10 border-purple-500/30'
                : experiment.completed
                ? 'hover:bg-slate-700/50'
                : 'hover:bg-slate-700/50'
              
              return (
                <TableRow 
                  key={experiment.runNumber}
                  className={`border-white/10 ${rowClass} cursor-pointer transition-colors`}
                  onClick={() => handleRowClick(experiment)}
                >
                  {/* Run Number */}
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                      )}
                      {experiment.runNumber}
                    </div>
                  </TableCell>
                  
                  {/* Angle */}
                  <TableCell>
                    <LevelBadge 
                      level={experiment.angle}
                      value={experiment.angleValue}
                      unit="°"
                      color="blue"
                    />
                  </TableCell>
                  
                  {/* Force */}
                  <TableCell>
                    <LevelBadge 
                      level={experiment.force}
                      value={experiment.forceValue}
                      unit="N"
                      color="green"
                    />
                  </TableCell>
                  
                  {/* Weight */}
                  <TableCell>
                    <LevelBadge 
                      level={experiment.weight}
                      value={experiment.weightValue}
                      unit=""
                      color="orange"
                    />
                  </TableCell>
                  
                  {/* Distance */}
                  <TableCell className="font-mono text-white">
                    {experiment.result 
                      ? formatDistance(experiment.result.distance)
                      : '-'}
                  </TableCell>
                  
                  {/* Accuracy */}
                  <TableCell className="font-mono text-white">
                    {experiment.result 
                      ? `${experiment.result.accuracy.toFixed(0)}%`
                      : '-'}
                  </TableCell>
                  
                  {/* Score */}
                  <TableCell className="font-mono text-white">
                    {experiment.result 
                      ? experiment.result.score.toLocaleString()
                      : '-'}
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell>
                    <div className="flex justify-center">
                      {experiment.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : isCurrent ? (
                        <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Action */}
                  <TableCell>
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(experiment)
                        }}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg bg-slate-700/30 p-4 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-purple-500" />
          <span className="text-gray-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 text-gray-600" />
          <span className="text-gray-400">Pending</span>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          Click any row to load that experiment
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// LEVEL BADGE COMPONENT
// ============================================================================

interface LevelBadgeProps {
  level: 'low' | 'high'
  value: number | string
  unit: string
  color: 'blue' | 'green' | 'orange'
}

function LevelBadge({ level, value, unit, color }: LevelBadgeProps) {
  const colorClasses = {
    blue: level === 'high'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-slate-700/50 text-gray-400 border-white/10',
    green: level === 'high'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-slate-700/50 text-gray-400 border-white/10',
    orange: level === 'high'
      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      : 'bg-slate-700/50 text-gray-400 border-white/10'
  }
  
  return (
    <Badge 
      variant="outline" 
      className={`border ${colorClasses[color]} font-mono text-xs`}
    >
      {level === 'high' ? 'H' : 'L'}: {value}{unit}
    </Badge>
  )
}

// ============================================================================
// COMPACT EXPERIMENT MATRIX (modal or drawer version)
// ============================================================================

export function CompactExperimentMatrix({
  experiments,
  onLoadExperiment
}: {
  experiments: DOEExperiment[]
  onLoadExperiment: (settings: CatapultSettings) => void
}) {
  const completedCount = experiments.filter(exp => exp.completed).length
  
  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h4 className="font-semibold text-white">Quick Select</h4>
        <p className="text-sm text-gray-400">{completedCount}/8 Complete</p>
      </div>
      
      <div className="grid gap-2">
        {experiments.map((experiment) => (
          <button
            key={experiment.runNumber}
            onClick={() => onLoadExperiment(loadExperimentSettings(experiment))}
            className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
              experiment.completed
                ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
                : 'border-white/10 bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {experiment.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-600" />
              )}
              
              <div>
                <div className="text-sm font-medium text-white">
                  Run {experiment.runNumber}
                </div>
                <div className="text-xs text-gray-400">
                  {getExperimentShortLabel(experiment)}
                </div>
              </div>
            </div>
            
            {experiment.result && (
              <div className="text-right">
                <div className="text-sm font-mono text-white">
                  {formatDistance(experiment.result.distance)}
                </div>
                <div className="text-xs text-gray-400">
                  {experiment.result.score.toLocaleString()}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
