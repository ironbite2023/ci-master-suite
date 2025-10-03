/**
 * GuidedWizard Component
 * Main orchestrator for guided tool experiences
 * Handles step navigation, validation, auto-save, and progress tracking
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Bot, Sparkles, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { GuidedWizardProps } from '@/types/guided-tools'
import { ProgressMap } from './ProgressMap'
import { QuestionCard } from './QuestionCard'
import { GuidePanel } from './GuidePanel'
import { CompletionSummary } from './CompletionSummary'
import { AIAssistant } from './AIAssistant'
import { validateQuestion } from '@/lib/guided-tools/validation'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/guided-tools/storage'
import { calculateProgress } from '@/lib/guided-tools/utils'
import { trackStepViewed, trackStepCompleted, calculateTimeSpent } from '@/lib/guided-tools/analytics'
import { cn } from '@/lib/utils'

export const GuidedWizard: React.FC<GuidedWizardProps> = ({
  toolId,
  config,
  onComplete,
  onSave,
  initialData
}) => {
  const router = useRouter()
  
  // State management
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepData, setStepData] = useState<Record<string, unknown>>(initialData || {})
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime] = useState(new Date())
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)

  const currentStep = config.steps[currentStepIndex]
  const isLastStep = currentStepIndex === config.steps.length - 1
  const isFirstStep = currentStepIndex === 0

  // Calculate progress
  const progressPercent = useMemo(() => {
    return calculateProgress(config.steps.length, completedSteps)
  }, [config.steps.length, completedSteps])

  // Load saved data on mount
  useEffect(() => {
    const saved = loadFromLocalStorage(toolId)
    if (saved && typeof saved === 'object') {
      setStepData((saved as Record<string, Record<string, unknown>>).stepData || {})
      setCurrentStepIndex((saved as { currentStepIndex?: number }).currentStepIndex || 0)
      const completedArray = (saved as { completedSteps?: string[] }).completedSteps || []
      setCompletedSteps(new Set(completedArray))
    }
  }, [toolId])

  // Save progress
  const handleSave = useCallback(() => {
    setIsSaving(true)
    const dataToSave = {
      toolId,
      currentStepIndex,
      stepData,
      completedSteps: Array.from(completedSteps),
      lastSaved: new Date().toISOString()
    }

    saveToLocalStorage(toolId, dataToSave)
    
    if (onSave) {
      onSave(dataToSave)
    }

    setLastSaved(new Date())
    setTimeout(() => setIsSaving(false), 500)
  }, [toolId, currentStepIndex, stepData, completedSteps, onSave])

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(autoSaveTimer)
  }, [stepData, currentStepIndex, completedSteps, handleSave])

  // Track step viewed
  useEffect(() => {
    if (currentStep) {
      trackStepViewed('user-id', toolId, currentStep.id)
    }
  }, [currentStep, toolId])

  // Handle question value change
  const handleQuestionChange = useCallback((questionId: string, value: unknown) => {
    setStepData(prev => ({
      ...prev,
      [questionId]: value
    }))

    // Clear validation error for this question
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[questionId]
      return newErrors
    })
  }, [])

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStep) return false

    const errors: Record<string, string[]> = {}
    let hasErrors = false

    // Validate each required question
    for (const questionId of currentStep.validation.requiredQuestions) {
      const question = currentStep.questions.find(q => q.id === questionId)
      if (!question) continue

      const value = stepData[questionId]
      const result = validateQuestion(question, value, stepData)

      if (!result.isValid && result.errors) {
        errors[questionId] = result.errors
        hasErrors = true
      }
    }

    setValidationErrors(errors)

    if (hasErrors) {
      toast.error('Please fix the errors before continuing')
    }

    return !hasErrors
  }, [currentStep, stepData])

  // Navigate to next step
  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return
    }

    // Mark current step as completed
    const newCompletedSteps = new Set(completedSteps)
    newCompletedSteps.add(currentStep.id)
    setCompletedSteps(newCompletedSteps)

    // Track completion
    const timeSpent = calculateTimeSpent(startTime)
    trackStepCompleted('user-id', toolId, currentStep.id, timeSpent)

    if (isLastStep) {
      // Complete the wizard
      setIsCompleted(true)
      onComplete(stepData)
      toast.success('Tool completed successfully!')
    } else {
      // Move to next step
      setCurrentStepIndex(prev => prev + 1)
      toast.success('Step completed!')
    }
  }, [validateCurrentStep, completedSteps, currentStep, isLastStep, startTime, toolId, stepData, onComplete])

  // Navigate to previous step
  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [isFirstStep])

  // Jump to a specific step
  const handleStepClick = useCallback((stepIndex: number) => {
    const targetStep = config.steps[stepIndex]
    const targetStepId = targetStep.id

    // Allow navigation to completed steps or current step
    if (completedSteps.has(targetStepId) || stepIndex === currentStepIndex) {
      setCurrentStepIndex(stepIndex)
    }
  }, [config.steps, completedSteps, currentStepIndex])

  // Show completion screen
  if (isCompleted) {
    return (
      <CompletionSummary
        toolConfig={config}
        completedData={stepData}
        timeSpent={calculateTimeSpent(startTime)}
        onExport={() => {
          const json = JSON.stringify(stepData, null, 2)
          const blob = new Blob([json], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${toolId}_results.json`
          a.click()
          URL.revokeObjectURL(url)
        }}
        onClose={() => window.history.back()}
      />
    )
  }

  return (
    <div className="guided-wizard max-w-7xl mx-auto space-y-6 py-8 px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* Header with Gradient Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-6 shadow-lg overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="relative z-10">
          {/* Back Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 hover:bg-white/50 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {config.name}
              </h1>
              <p className="text-sm text-gray-700 mt-2">{config.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsAIOpen(!isAIOpen)}
                variant={isAIOpen ? "default" : "outline"}
                className={cn(
                  "gap-2 font-semibold shadow-md transition-all duration-300",
                  isAIOpen 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white scale-105 shadow-purple-500/50" 
                    : "bg-white hover:bg-purple-50 border-2 border-purple-300 text-purple-700 hover:scale-105"
                )}
              >
                <Bot className={cn("h-4 w-4", isAIOpen && "animate-pulse")} />
                AI Coach
                <Sparkles className="h-3 w-3" />
              </Button>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold px-3 py-1 capitalize",
                  config.difficulty === 'beginner' && "bg-green-50 border-green-300 text-green-700",
                  config.difficulty === 'intermediate' && "bg-yellow-50 border-yellow-300 text-yellow-700",
                  config.difficulty === 'advanced' && "bg-red-50 border-red-300 text-red-700"
                )}
              >
                {config.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-blue-50 border-blue-300 text-blue-700">
                ⏱️ {config.estimatedTime}
              </Badge>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">Your Progress</span>
              <span className="font-bold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="relative">
              <Progress value={progressPercent} className="h-3 bg-gray-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75" 
                   style={{ width: `${progressPercent}%`, transition: 'width 0.5s ease' }} />
            </div>
            {progressPercent > 0 && (
              <p className="text-xs text-gray-600 text-center">
                {progressPercent < 25 && "🚀 Great start! Keep going!"}
                {progressPercent >= 25 && progressPercent < 50 && "💪 You're making progress!"}
                {progressPercent >= 50 && progressPercent < 75 && "🔥 Halfway there! Stay focused!"}
                {progressPercent >= 75 && progressPercent < 100 && "⭐ Almost done! Finish strong!"}
                {progressPercent === 100 && "🎉 Complete! Amazing work!"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Map with Gradient Border */}
      <div className="relative bg-white border-2 border-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-xl p-[2px] shadow-md overflow-hidden">
        <div className="bg-white rounded-[10px] p-4 overflow-x-auto">
          <ProgressMap
            steps={config.steps}
            currentStepIndex={currentStepIndex}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            orientation="horizontal"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Header Card - Redesigned */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 shadow-xl bg-white">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
            
            <div className="relative z-10 p-6">
              <div className="flex items-start gap-4">
                {/* Step Number Circle - Larger & More Prominent */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <span className="text-2xl font-bold text-white">{currentStep.stepNumber}</span>
                  </div>
                </div>
                
                {/* Title & Description */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-2">
                    {currentStep.title}
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
                
                {currentStep.optional && (
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-2 border-amber-300 px-3 py-1 text-sm font-semibold">
                    Optional
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Guidance Box - Completely Redesigned */}
          {currentStep.guidance.introduction && (
            <div className="relative rounded-xl overflow-hidden border-2 border-blue-200 shadow-lg">
              {/* Animated gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 animate-pulse" />
              
              <div className="relative bg-white m-[2px] rounded-[10px]">
                <div className="flex gap-4 p-5">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                      <span className="text-2xl">💡</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Key Insight
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {currentStep.guidance.introduction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions - Professional Card Design */}
          <div className="space-y-5">
            {currentStep.questions.map((question, index) => (
              <div key={question.id} className="group">
                <div className="relative">
                  {/* Connecting Line (except for first item) */}
                  {index > 0 && (
                    <div className="absolute left-[19px] -top-5 w-0.5 h-5 bg-gradient-to-b from-transparent via-blue-300 to-blue-400" />
                  )}
                  
                  {/* Question Card */}
                  <div className="relative bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    
                    <div className="flex gap-4 p-6">
                      {/* Question Number - Integrated Design */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                          <span className="text-lg font-bold text-white">{index + 1}</span>
                        </div>
                      </div>
                      
                      {/* Question Content */}
                      <div className="flex-1 min-w-0">
                        <QuestionCard
                          question={question}
                          value={stepData[question.id]}
                          onChange={(value) => handleQuestionChange(question.id, value)}
                          onValidate={(value) => validateQuestion(question, value, stepData)}
                          error={validationErrors[question.id]?.[0]}
                          showHints={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <Card className="border-2 border-gradient-to-r from-blue-100 to-purple-100 shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                {/* Previous Button */}
                <Button
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "font-semibold border-2 transition-all duration-300 hover:scale-105 px-6 py-6",
                    isFirstStep 
                      ? "opacity-50 cursor-not-allowed" 
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                  )}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                {/* Save Status */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  {isSaving ? (
                    <span className="flex items-center gap-2 text-blue-600">
                      <Save className="h-4 w-4 animate-pulse" />
                      Saving...
                    </span>
                  ) : lastSaved ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Auto-saved
                    </span>
                  ) : (
                    <span className="text-gray-500">💾 Progress saved automatically</span>
                  )}
                </div>

                {/* Next/Complete Button */}
                <Button
                  onClick={handleNext}
                  size="lg"
                  className={cn(
                    "font-semibold shadow-lg transition-all duration-300 hover:scale-105 px-8 py-6 text-base",
                    isLastStep 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/50' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/50'
                  )}
                >
                  {isLastStep ? (
                    <>
                      Complete Analysis
                      <CheckCircle2 className="h-5 w-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guide Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="border-2 border-purple-100 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  💡 Guidance & Tips
                </h3>
              </div>
              <div className="bg-white">
                <GuidePanel
                  guidance={currentStep.guidance}
                  position="right"
                  collapsible={true}
                  defaultExpanded={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        context={{
          toolName: config.name,
          toolDescription: config.description,
          currentStep: {
            title: currentStep.title,
            description: currentStep.description
          },
          userInput: stepData,
          previousAnswers: Object.entries(stepData).map(([key, value]) => ({
            question: config.steps.flatMap(s => s.questions).find(q => q.id === key)?.text || key,
            answer: value
          }))
        }}
      />
    </div>
  )
}
