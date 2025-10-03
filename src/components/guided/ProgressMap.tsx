/**
 * ProgressMap Component
 * Visual journey map showing progress through guided tool steps
 */

'use client'

import React from 'react'
import { CheckCircle2, Lock, Circle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ProgressMapProps, StepStatus } from '@/types/guided-tools'
import { getStepStatus } from '@/lib/guided-tools/utils'

export const ProgressMap: React.FC<ProgressMapProps> = ({
  steps,
  currentStepIndex,
  completedSteps,
  onStepClick,
  orientation = 'horizontal'
}) => {
  const handleStepClick = (index: number, status: StepStatus) => {
    const isClickable = status === 'completed' || status === 'current'
    if (isClickable && onStepClick) {
      onStepClick(index)
    }
  }

  return (
    <div
      className={cn(
        'progress-map',
        orientation === 'horizontal'
          ? 'flex items-center justify-between w-full'
          : 'flex flex-col space-y-4'
      )}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(step, index, currentStepIndex, completedSteps)
        const isClickable = status === 'completed' || status === 'current'
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div
              className={cn(
                'flex items-center',
                orientation === 'horizontal' ? 'flex-col' : 'flex-row',
                'gap-2'
              )}
            >
              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(index, status)}
                disabled={!isClickable}
                className={cn(
                  'relative flex items-center justify-center rounded-full transition-all',
                  'w-10 h-10 border-2',
                  status === 'completed' && 'bg-green-100 border-green-600 text-green-700 hover:bg-green-200',
                  status === 'current' && 'bg-blue-100 border-blue-600 text-blue-700 ring-4 ring-blue-100',
                  status === 'upcoming' && 'bg-gray-100 border-gray-300 text-gray-500',
                  status === 'locked' && 'bg-gray-50 border-gray-200 text-gray-400',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-not-allowed'
                )}
                aria-label={`${status === 'completed' ? 'Completed' : status === 'current' ? 'Current' : 'Upcoming'} step: ${step.title}`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : status === 'locked' ? (
                  <Lock className="h-5 w-5" />
                ) : status === 'current' ? (
                  <Circle className="h-5 w-5 fill-current" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </button>

              {/* Step Label */}
              <div
                className={cn(
                  'flex flex-col',
                  orientation === 'horizontal' ? 'items-center text-center' : 'items-start',
                  'min-w-0'
                )}
              >
                <p
                  className={cn(
                    'text-sm font-medium',
                    status === 'current' && 'text-blue-700',
                    status === 'completed' && 'text-green-700',
                    (status === 'upcoming' || status === 'locked') && 'text-gray-600',
                    orientation === 'horizontal' && 'max-w-[120px] truncate'
                  )}
                >
                  {step.title}
                </p>
                <Badge
                  variant={status === 'current' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs mt-1',
                    status === 'completed' && 'bg-green-100 text-green-700 border-green-200',
                    status === 'current' && 'bg-blue-100 text-blue-700 border-blue-200',
                    status === 'upcoming' && 'bg-gray-100 text-gray-600 border-gray-200',
                    status === 'locked' && 'bg-gray-50 text-gray-500 border-gray-200'
                  )}
                >
                  {status === 'completed' && '✓ Complete'}
                  {status === 'current' && 'Current'}
                  {status === 'upcoming' && 'Upcoming'}
                  {status === 'locked' && '🔒 Locked'}
                </Badge>
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  'step-connector',
                  orientation === 'horizontal'
                    ? 'flex-1 h-0.5 mx-2'
                    : 'w-0.5 h-8 ml-5',
                  status === 'completed'
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
