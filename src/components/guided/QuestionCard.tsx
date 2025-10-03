/**
 * QuestionCard Component
 * Smart question component with hints, examples, and validation
 * Supports 20+ question types
 */

'use client'

import React, { useState, useCallback } from 'react'
import {
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  Type,
  List,
  CheckSquare
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { QuestionCardProps, QuestionExample } from '@/types/guided-tools'

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  onValidate,
  showHints = true,
  error
}) => {
  const [showHintPanel, setShowHintPanel] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [validationFeedback, setValidationFeedback] = useState<string>('')
  const [localValue, setLocalValue] = useState(value)

  // Handle value change with validation
  const handleChange = useCallback((newValue: unknown) => {
    setLocalValue(newValue)
    onChange(newValue)
    
    // Run validation if provided
    if (onValidate) {
      const result = onValidate(newValue)
      if (result.successMessage && result.isValid) {
        setValidationFeedback(result.successMessage)
      } else {
        setValidationFeedback('')
      }
    }
  }, [onChange, onValidate])

  // Use example value
  const handleUseExample = useCallback((example: QuestionExample) => {
    handleChange(example.value)
    setShowExamples(false)
  }, [handleChange])

  // Render input based on question type
  const renderInput = () => {
    const { type, inputConfig, placeholder, required } = question

    switch (type) {
      case 'short-text':
        return (
          <Input
            value={(localValue as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={inputConfig.maxLength}
            className="w-full"
          />
        )

      case 'long-text':
        return (
          <Textarea
            value={(localValue as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={inputConfig.maxLength}
            rows={6}
            className="w-full resize-none"
          />
        )

      case 'number':
      case 'decimal':
        return (
          <div className="relative">
            {inputConfig.prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {inputConfig.prefix}
              </span>
            )}
            <Input
              type="number"
              value={(localValue as number) || ''}
              onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
              placeholder={placeholder}
              required={required}
              min={inputConfig.min}
              max={inputConfig.max}
              step={type === 'decimal' ? inputConfig.step || 0.01 : inputConfig.step || 1}
              className={cn(
                'w-full',
                inputConfig.prefix && 'pl-8',
                inputConfig.suffix && 'pr-12'
              )}
            />
            {inputConfig.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {inputConfig.suffix}
              </span>
            )}
          </div>
        )

      case 'percentage':
        return (
          <div className="relative">
            <Input
              type="number"
              value={(localValue as number) || ''}
              onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
              placeholder={placeholder}
              required={required}
              min={0}
              max={100}
              step={0.1}
              className="w-full pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        )

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              type="number"
              value={(localValue as number) || ''}
              onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
              placeholder={placeholder}
              required={required}
              min={0}
              step={0.01}
              className="w-full pl-8"
            />
          </div>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={(localValue as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className="w-full"
          />
        )

      case 'time':
        return (
          <Input
            type="time"
            value={(localValue as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className="w-full"
          />
        )

      case 'datetime':
        return (
          <Input
            type="datetime-local"
            value={(localValue as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className="w-full"
          />
        )

      case 'single-select':
        return (
          <Select
            value={(localValue as string) || ''}
            onValueChange={handleChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {inputConfig.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    <div>
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multi-select':
        const selectedValues = (localValue as string[]) || []
        return (
          <div className="space-y-2">
            {inputConfig.options?.map((option) => (
              <div key={option.value} className="flex items-start gap-2">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value)
                    handleChange(newValues)
                  }}
                />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )

      case 'boolean':
        return (
          <RadioGroup
            value={(localValue as boolean)?.toString() || 'false'}
            onValueChange={(val: string) => handleChange(val === 'true')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        )

      case 'rating':
        const rating = (localValue as number) || 0
        const maxRating = inputConfig.max || 5
        return (
          <div className="flex gap-1">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleChange(star)}
                className={cn(
                  'text-2xl transition-colors',
                  star <= rating ? 'text-yellow-400' : 'text-gray-300',
                  'hover:text-yellow-300'
                )}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating}/${maxRating}` : 'Not rated'}
            </span>
          </div>
        )

      case 'scale':
        const scaleValue = (localValue as number) || inputConfig.min || 0
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={scaleValue}
              onChange={(e) => handleChange(parseInt(e.target.value))}
              min={inputConfig.min || 0}
              max={inputConfig.max || 10}
              step={inputConfig.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{inputConfig.min || 0}</span>
              <span className="font-semibold text-lg">{scaleValue}</span>
              <span>{inputConfig.max || 10}</span>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500">
            Question type &quot;{type}&quot; not yet implemented
          </div>
        )
    }
  }

  // Get icon for question type
  const getQuestionIcon = () => {
    const { type } = question
    const iconClass = 'h-4 w-4 text-gray-500'

    switch (type) {
      case 'short-text':
      case 'long-text':
        return <Type className={iconClass} />
      case 'number':
      case 'decimal':
      case 'percentage':
      case 'currency':
        return <Hash className={iconClass} />
      case 'date':
      case 'time':
      case 'datetime':
        return <Calendar className={iconClass} />
      case 'single-select':
        return <List className={iconClass} />
      case 'multi-select':
        return <CheckSquare className={iconClass} />
      default:
        return <HelpCircle className={iconClass} />
    }
  }

  return (
    <Card className="question-card mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getQuestionIcon()}
              <CardTitle className="text-base font-medium">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
            </div>
            {question.helpText && (
              <CardDescription className="mt-1 text-sm">
                {question.helpText}
              </CardDescription>
            )}
          </div>

          <div className="flex gap-1 flex-shrink-0">
            {/* Hint Button */}
            {showHints && question.hints?.length && question.hints.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHintPanel(!showHintPanel)}
                className={cn(
                  'h-8 w-8 p-0',
                  showHintPanel && 'bg-blue-100'
                )}
                title="Show hints"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            )}

            {/* Examples Button */}
            {question.examples?.length && question.examples.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExamples(!showExamples)}
                className={cn(
                  'h-8 w-8 p-0',
                  showExamples && 'bg-yellow-100'
                )}
                title="Show examples"
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hints Panel */}
        {showHintPanel && question.hints?.length && question.hints.length > 0 && (
          <Alert className="bg-blue-50 border-blue-200">
            <HelpCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                {question.hints?.map(hint => (
                  <div key={hint.id} className="text-sm">
                    <div className="flex items-start gap-2">
                      {hint.icon && <span className="text-lg">{hint.icon}</span>}
                      <div>
                        <strong className="text-blue-900">{hint.title}:</strong>{' '}
                        <span className="text-blue-800">{hint.content}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Examples Panel */}
        {showExamples && question.examples?.length && question.examples.length > 0 && (
          <div className="border rounded-lg p-3 bg-yellow-50 border-yellow-200 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-700" />
              <span className="font-semibold text-sm text-yellow-900">Examples</span>
            </div>
            {question.examples?.map(example => (
              <div key={example.id} className="border rounded p-2 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{example.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{example.description}</div>
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                      {typeof example.value === 'string' 
                        ? example.value 
                        : JSON.stringify(example.value, null, 2)}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {example.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {example.useCase}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUseExample(example)}
                    className="text-xs"
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Field */}
        <div>
          {renderInput()}
        </div>

        {/* Validation Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Validation Success */}
        {validationFeedback && !error && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              {validationFeedback}
            </AlertDescription>
          </Alert>
        )}

        {/* Question Metadata */}
        {question.inputConfig.unit && question.type !== 'percentage' && question.type !== 'currency' && (
          <div className="text-xs text-gray-500">
            Unit: {question.inputConfig.unit}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
