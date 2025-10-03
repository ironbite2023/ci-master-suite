'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import type { NormalityTestResult } from '@/lib/games/catapult/normalityTests'

// ============================================================================
// TYPES
// ============================================================================

interface NormalityResultsProps {
  andersonDarling: NormalityTestResult
  shapiroWilk: NormalityTestResult
  kolmogorovSmirnov: NormalityTestResult
  overallPassed: boolean
  recommendation: string
}

// ============================================================================
// NORMALITY RESULTS COMPONENT
// ============================================================================

export function NormalityResults({
  andersonDarling,
  shapiroWilk,
  kolmogorovSmirnov,
  overallPassed,
  recommendation
}: NormalityResultsProps) {
  const tests = [andersonDarling, shapiroWilk, kolmogorovSmirnov]
  const passedCount = tests.filter(t => t.passed).length

  return (
    <div className="space-y-4">
      {/* Overall Status Card */}
      <Card className={`border p-6 ${
        overallPassed
          ? 'border-green-500/30 bg-green-500/10'
          : 'border-red-500/30 bg-red-500/10'
      }`}>
        <div className="flex items-start gap-4">
          {overallPassed ? (
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400" />
          ) : (
            <XCircle className="h-6 w-6 flex-shrink-0 text-red-400" />
          )}
          <div className="flex-1">
            <h3 className={`mb-2 text-lg font-bold ${
              overallPassed ? 'text-green-400' : 'text-red-400'
            }`}>
              {overallPassed ? 'Data Passes Normality Tests' : 'Data Fails Normality Tests'}
            </h3>
            <p className="mb-3 text-sm text-gray-300">
              {passedCount} of 3 normality tests passed ({Math.round(passedCount / 3 * 100)}%)
            </p>
            <p className={`text-sm ${
              overallPassed ? 'text-green-300' : 'text-red-300'
            }`}>
              {recommendation}
            </p>
          </div>
        </div>
      </Card>

      {/* Individual Test Results */}
      <div className="grid gap-4 md:grid-cols-3">
        <TestResultCard test={andersonDarling} />
        <TestResultCard test={shapiroWilk} />
        <TestResultCard test={kolmogorovSmirnov} />
      </div>

      {/* Statistical Info */}
      <Card className="border-white/10 bg-slate-800/50 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
          <div className="text-sm text-gray-400">
            <strong className="text-blue-400">What This Means:</strong>{' '}
            Normality tests check if your data follows a normal distribution
            (bell curve). This is important because many Six Sigma tools assume
            normal data. We use multiple tests for reliability - if at least 2
            out of 3 pass, your data is considered normal.
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// TEST RESULT CARD
// ============================================================================

interface TestResultCardProps {
  test: NormalityTestResult
}

function TestResultCard({ test }: TestResultCardProps) {
  return (
    <Card className="border-white/10 bg-slate-800/50 p-4">
      {/* Test Name & Status */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-white">{test.testName}</h4>
        {test.passed ? (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Pass
          </Badge>
        ) : (
          <Badge className="bg-red-500/20 text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Fail
          </Badge>
        )}
      </div>

      {/* Statistics */}
      <div className="mb-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Statistic:</span>
          <span className="font-mono text-white">{test.statistic}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Critical Value:</span>
          <span className="font-mono text-white">{test.criticalValue}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">p-value:</span>
          <span className={`font-mono ${
            test.pValue >= 0.05 ? 'text-green-400' : 'text-red-400'
          }`}>
            {test.pValue < 0.01 ? '<0.01' : test.pValue.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Interpretation */}
      <div className={`rounded-lg p-2 text-xs ${
        test.passed
          ? 'bg-green-500/10 text-green-300'
          : 'bg-red-500/10 text-red-300'
      }`}>
        {test.interpretation}
      </div>
    </Card>
  )
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

interface CompactNormalityResultsProps {
  overallPassed: boolean
  passedCount: number
}

export function CompactNormalityResults({
  overallPassed,
  passedCount
}: CompactNormalityResultsProps) {
  return (
    <div className={`rounded-lg border p-3 ${
      overallPassed
        ? 'border-green-500/30 bg-green-500/10'
        : 'border-red-500/30 bg-red-500/10'
    }`}>
      <div className="flex items-center gap-2">
        {overallPassed ? (
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400" />
        )}
        <div>
          <div className={`text-sm font-medium ${
            overallPassed ? 'text-green-400' : 'text-red-400'
          }`}>
            {overallPassed ? 'Normality Confirmed' : 'Normality Failed'}
          </div>
          <div className="text-xs text-gray-400">
            {passedCount}/3 tests passed
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TEST COMPARISON TABLE
// ============================================================================

interface TestComparisonTableProps {
  tests: NormalityTestResult[]
}

export function TestComparisonTable({ tests }: TestComparisonTableProps) {
  return (
    <Card className="border-white/10 bg-slate-800/50 p-4">
      <h4 className="mb-3 font-medium text-white">Test Comparison</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 text-left font-medium text-gray-400">Test</th>
              <th className="pb-2 text-right font-medium text-gray-400">Statistic</th>
              <th className="pb-2 text-right font-medium text-gray-400">p-value</th>
              <th className="pb-2 text-right font-medium text-gray-400">Result</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr
                key={index}
                className="border-b border-white/5 last:border-0"
              >
                <td className="py-2 text-white">{test.testName}</td>
                <td className="py-2 text-right font-mono text-white">
                  {test.statistic}
                </td>
                <td className="py-2 text-right font-mono text-white">
                  {test.pValue < 0.01 ? '<0.01' : test.pValue.toFixed(3)}
                </td>
                <td className="py-2 text-right">
                  {test.passed ? (
                    <span className="text-green-400">Pass</span>
                  ) : (
                    <span className="text-red-400">Fail</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
