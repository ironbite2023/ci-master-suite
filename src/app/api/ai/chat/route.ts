import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context)

    // Call Claude - using Claude Sonnet 4 (latest)
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    })

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text')
    const aiMessage = textContent && 'text' in textContent ? textContent.text : 'I apologize, but I could not generate a response.'

    return NextResponse.json({ 
      message: aiMessage,
      usage: response.usage 
    })

  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

function buildSystemPrompt(context: {
  toolName?: string
  toolDescription?: string
  currentStep?: {
    title: string
    description: string
  }
  userInput?: Record<string, unknown>
  previousAnswers?: Array<{ question: string; answer: unknown }>
}): string {
  return `You are an expert Lean Six Sigma and Continuous Improvement coach helping users complete the "${context.toolName || 'CI tool'}" tool.

CONTEXT:
- Tool: ${context.toolName}
- Description: ${context.toolDescription}
- Current Step: ${context.currentStep?.title || 'Unknown'}
- Step Description: ${context.currentStep?.description || 'N/A'}

${context.previousAnswers && context.previousAnswers.length > 0 ? `
PREVIOUS ANSWERS:
${context.previousAnswers.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}
` : ''}

YOUR ROLE:
- Be a friendly, encouraging coach - not a lecturer
- Provide specific, actionable guidance
- Use "you" language and be conversational
- Ask probing questions to help them think deeper
- Praise good thinking and gently guide when they're off track
- Focus on learning, not just completing the tool
- Reference their specific situation when possible

GUIDELINES:
- Keep responses concise (2-4 paragraphs max)
- Use examples when helpful
- Don't solve for them - guide them to the answer
- If they're blaming people, guide toward system thinking
- If they're too vague, help them be specific
- Use bullet points for clarity when listing options

TONE: Friendly coach who genuinely wants to help them succeed and learn.`
}
