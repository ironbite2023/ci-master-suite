/**
 * Control Mode Controls for Catapult Game
 * Manages subgroup collection, progress tracking, and control chart analysis
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Users,
  TrendingUp,
  Download
} from 'lucide-react'
import { CatapultSettings } from '@/types/catapult'

// ============================================================================
// TYPES
// ============================================================================

interface ControlModeControlsProps {
  // Subgroup configuration
  subgroupSize: number
  onSubgroupSizeChange: (size: number) => void
  
  // Current subgroup being collected
  currentSubgroupShots: number
  totalSubgroups: number
  
  // Control limits status
  hasControlLimits: boolean
  minimumSubgroupsNeeded: number
  
  // Actions
  onCollectShot: () => void
  onAnalyze: () => void
  onReset: () => void
  onExport?: () => void
  
  // State
  isLaunching: boolean
  canLaunch: boolean
  settings: CatapultSettings
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ControlModeControls({
  subgroupSize,
  onSubgroupSizeChange,
  currentSubgroupShots,
  totalSubgroups,
  hasControlLimits,
  minimumSubgroupsNeeded,
  onCollectShot,
  onAnalyze,
  onReset,
  onExport,
  isLaunching,
  canLaunch,
  settings
}: ControlModeControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  // Calculate progress
  const subgroupProgress = (currentSubgroupShots / subgroupSize) * 100
  const overallProgress = (totalSubgroups / minimumSubgroupsNeeded) * 100
  const isSubgroupComplete = currentSubgroupShots === subgroupSize
  const canCalculateLimits = totalSubgroups >= minimumSubgroupsNeeded

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Control Phase</h3>
          </div>
          <Badge variant={hasControlLimits ? 'default' : 'secondary'}>
            {hasControlLimits ? 'Limits Calculated' : 'Collecting Data'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor process stability using X-bar and R control charts
        </p>
      </Card>

      {/* Subgroup Size Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subgroup Size
          </label>
          <span className="text-sm text-muted-foreground">
            {subgroupSize} shots per subgroup
          </span>
        </div>
        
        <div className="grid grid-cols-9 gap-2 mb-2">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
            <Button
              key={size}
              variant={subgroupSize === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSubgroupSizeChange(size)}
              disabled={totalSubgroups > 0}
              className="h-9"
            >
              {size}
            </Button>
          ))}
        </div>
        
        {totalSubgroups > 0 && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Cannot change subgroup size after data collection starts
          </p>
        )}
      </Card>

      {/* Current Subgroup Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Current Subgroup</span>
          <span className="text-sm font-mono">
            {currentSubgroupShots} / {subgroupSize} shots
          </span>
        </div>
        
        <Progress value={subgroupProgress} className="h-2 mb-2" />
        
        {isSubgroupComplete ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Subgroup complete! Launch next shot to start new subgroup.
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {subgroupSize - currentSubgroupShots} more shot(s) needed to complete subgroup
          </p>
        )}
      </Card>

      {/* Overall Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-mono">
            {totalSubgroups} / {minimumSubgroupsNeeded} subgroups
          </span>
        </div>
        
        <Progress 
          value={overallProgress} 
          className="h-2 mb-2"
        />
        
        {canCalculateLimits ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Ready to calculate control limits!
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {minimumSubgroupsNeeded - totalSubgroups} more subgroup(s) needed for reliable control limits
          </p>
        )}
      </Card>

      {/* Current Settings Display */}
      <Card className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span className="text-sm font-medium">Current Settings</span>
          <Button variant="ghost" size="sm">
            {showSettings ? 'Hide' : 'Show'}
          </Button>
        </div>
        
        {showSettings && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-xs text-muted-foreground mb-1">Angle</div>
              <div className="font-semibold">{settings.angle}°</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-xs text-muted-foreground mb-1">Force</div>
              <div className="font-semibold">{settings.force}%</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-xs text-muted-foreground mb-1">Weight</div>
              <div className="font-semibold">{settings.weight}</div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          Keep settings consistent throughout data collection
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Launch Shot */}
        <Button
          onClick={onCollectShot}
          disabled={!canLaunch || isLaunching}
          className="w-full"
          size="lg"
        >
          {isLaunching ? (
            <>
              <Target className="mr-2 h-5 w-5 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Launch Shot ({currentSubgroupShots + 1} of {subgroupSize})
            </>
          )}
        </Button>

        {/* Analyze */}
        <Button
          onClick={onAnalyze}
          disabled={!canCalculateLimits}
          variant={hasControlLimits ? 'default' : 'secondary'}
          className="w-full"
          size="lg"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          {hasControlLimits ? 'Update Analysis' : 'Calculate Control Limits'}
        </Button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          {onExport && (
            <Button
              onClick={onExport}
              disabled={totalSubgroups === 0}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
          
          <Button
            onClick={onReset}
            disabled={totalSubgroups === 0}
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Educational Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          Control Phase Tips
        </h4>
        <ul className="text-xs space-y-1 text-blue-900">
          <li>• Keep catapult settings constant during data collection</li>
          <li>• Subgroup size: 2-5 is typical for most processes</li>
          <li>• Need ≥20 subgroups for reliable control limits</li>
          <li>• X-bar chart monitors process mean (centering)</li>
          <li>• R chart monitors process variation (consistency)</li>
        </ul>
      </Card>
    </div>
  )
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface CompactControlModeControlsProps {
  subgroupSize: number
  currentSubgroupShots: number
  totalSubgroups: number
  minimumSubgroupsNeeded: number
  hasControlLimits: boolean
  onLaunch: () => void
  isLaunching: boolean
  canLaunch: boolean
}

export function CompactControlModeControls({
  subgroupSize,
  currentSubgroupShots,
  totalSubgroups,
  minimumSubgroupsNeeded,
  hasControlLimits,
  onLaunch,
  isLaunching,
  canLaunch
}: CompactControlModeControlsProps) {
  const subgroupProgress = (currentSubgroupShots / subgroupSize) * 100
  const overallProgress = (totalSubgroups / minimumSubgroupsNeeded) * 100

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Control Phase</span>
        </div>
        <Badge variant={hasControlLimits ? 'default' : 'secondary'} className="text-xs">
          {totalSubgroups} / {minimumSubgroupsNeeded}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Subgroup</span>
            <span>{currentSubgroupShots}/{subgroupSize}</span>
          </div>
          <Progress value={subgroupProgress} className="h-1" />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Overall</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-1" />
        </div>
      </div>

      <Button
        onClick={onLaunch}
        disabled={!canLaunch || isLaunching}
        className="w-full"
        size="sm"
      >
        {isLaunching ? (
          <>
            <Target className="mr-2 h-4 w-4 animate-spin" />
            Launching...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Launch Shot
          </>
        )}
      </Button>
    </Card>
  )
}
