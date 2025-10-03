/**
 * ExampleModal Component
 * Modal for displaying and selecting examples
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Search, Lightbulb, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { QuestionExample } from '@/types/guided-tools'

interface ExampleModalProps {
  open: boolean
  onClose: () => void
  examples: QuestionExample[]
  onUseExample: (example: QuestionExample) => void
  title?: string
}

export const ExampleModal: React.FC<ExampleModalProps> = ({
  open,
  onClose,
  examples,
  onUseExample,
  title = 'Example Library'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  // Filter examples based on search and difficulty
  const filteredExamples = useMemo(() => {
    let filtered = examples

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (example) =>
          example.title.toLowerCase().includes(query) ||
          example.description.toLowerCase().includes(query) ||
          example.useCase.toLowerCase().includes(query) ||
          (example.industry && example.industry.toLowerCase().includes(query))
      )
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter((example) => example.difficulty === selectedDifficulty)
    }

    return filtered
  }, [examples, searchQuery, selectedDifficulty])

  // Get unique difficulties
  const difficulties = useMemo(() => {
    return Array.from(new Set(examples.map((e) => e.difficulty)))
  }, [examples])

  const handleUseExample = (example: QuestionExample) => {
    onUseExample(example)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Browse examples to help you get started. Click &quot;Use This&quot; to apply an example.
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search examples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Difficulty Filter */}
          {difficulties.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Difficulty:</span>
              <Button
                variant={selectedDifficulty === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(null)}
                className="h-7 text-xs"
              >
                All
              </Button>
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                  className="h-7 text-xs capitalize"
                >
                  {diff}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Examples List */}
        <div className="flex-1 pr-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          {filteredExamples.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No examples found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExamples.map((example) => (
                <div
                  key={example.id}
                  className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title and Description */}
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{example.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{example.description}</p>
                        </div>
                      </div>

                      {/* Example Value */}
                      <div className="mt-2 p-3 bg-gray-50 rounded border text-sm font-mono overflow-x-auto">
                        {typeof example.value === 'string'
                          ? example.value
                          : JSON.stringify(example.value, null, 2)}
                      </div>

                      {/* Metadata */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge variant="outline" className="text-xs capitalize">
                          {example.difficulty}
                        </Badge>
                        {example.industry && (
                          <Badge variant="outline" className="text-xs">
                            {example.industry}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {example.useCase}
                        </Badge>
                        {example.isTemplate && (
                          <Badge className="text-xs bg-purple-100 text-purple-700">
                            Template
                          </Badge>
                        )}
                      </div>

                      {/* Scenario */}
                      {example.scenario && (
                        <div className="mt-2 text-xs text-gray-600">
                          <strong>Scenario:</strong> {example.scenario}
                        </div>
                      )}
                    </div>

                    {/* Use Button */}
                    <Button
                      onClick={() => handleUseExample(example)}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Use This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Showing {filteredExamples.length} of {examples.length} examples
        </div>
      </DialogContent>
    </Dialog>
  )
}
