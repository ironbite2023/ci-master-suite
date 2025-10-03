'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ProgressTrackerProps } from '@/types/academy';

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  current,
  total,
  type = 'linear',
  showLabel = true,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  if (type === 'circular') {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90" width="120" height="120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-600 transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </div>
          {showLabel && (
            <div className="text-xs text-gray-600">
              {current}/{total}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Linear type
  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-3" />
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{current} of {total} completed</span>
          <span className="font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
