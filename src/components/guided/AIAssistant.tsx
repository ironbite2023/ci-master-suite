/**
 * AI Assistant Component
 * Chat interface for Claude AI assistance
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Loader2, Copy, Check, Download, Lightbulb, HelpCircle, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  context: {
    toolName: string
    toolDescription: string
    currentStep?: {
      title: string
      description: string
    }
    userInput?: Record<string, unknown>
    previousAnswers?: Array<{ question: string; answer: unknown }>
  }
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  context
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI coach for the ${context.toolName}. I'm here to help you think through this step and create a high-quality analysis. What would you like help with?`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Quick Action Prompts
  const quickActions = [
    {
      icon: Lightbulb,
      label: 'Give me an example',
      prompt: `Can you give me a concrete example for this step based on a real-world scenario?`,
      color: 'amber'
    },
    {
      icon: HelpCircle,
      label: 'What if I\'m stuck?',
      prompt: `I'm having trouble with this question. Can you help me think through it step by step?`,
      color: 'blue'
    },
    {
      icon: Target,
      label: 'Best practices',
      prompt: `What are the best practices and common pitfalls I should be aware of for this step?`,
      color: 'green'
    },
    {
      icon: Zap,
      label: 'Quick tips',
      prompt: `Give me 3 quick tips to make my answer stronger and more effective.`,
      color: 'purple'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Copy message to clipboard
  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageIndex(index)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedMessageIndex(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  // Export conversation
  const handleExport = () => {
    const conversationText = messages
      .map((msg) => `${msg.role === 'user' ? 'You' : 'AI Coach'}: ${msg.content}`)
      .join('\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-conversation-${context.toolName}-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Conversation exported!')
  }

  // Send quick action
  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSend(prompt)
    }, 100)
  }

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = { role: 'user', content: messageToSend }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
        }
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSendClick = () => {
    handleSend()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-lg z-50 flex flex-col">
      {/* Header */}
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Coach</CardTitle>
              <p className="text-xs text-gray-600">Powered by Claude</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-8 w-8 p-0"
              title="Export conversation"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={cn(
                    'rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {/* Copy Button */}
                {message.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(message.content, index)}
                    className="h-6 w-fit px-2 text-xs self-start"
                  >
                    {copiedMessageIndex === index ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions - Show after first AI message */}
            {index === 0 && message.role === 'assistant' && (
              <div className="mt-4 space-y-2 px-10">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, actionIndex) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={actionIndex}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.prompt)}
                        disabled={isLoading}
                        className={cn(
                          "h-auto py-2 px-3 flex flex-col items-start gap-1 hover:scale-105 transition-transform",
                          action.color === 'amber' && "hover:border-amber-500 hover:bg-amber-50",
                          action.color === 'blue' && "hover:border-blue-500 hover:bg-blue-50",
                          action.color === 'green' && "hover:border-green-500 hover:bg-green-50",
                          action.color === 'purple' && "hover:border-purple-500 hover:bg-purple-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-medium text-left">
                          {action.label}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-purple-600" />
            </div>
            <div className="rounded-lg px-4 py-3 bg-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about this step..."
            rows={2}
            className="flex-1 resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendClick}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
