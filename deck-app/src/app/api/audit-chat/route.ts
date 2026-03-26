import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a pitch deck coach specializing in helping founders improve specific aspects of their deck. You give direct, actionable advice.

Rules:
- Be concise and specific
- Give 2-3 concrete suggestions max
- Reference what's in their current deck when possible
- Don't be preachy or generic
- Focus on the specific category they're asking about`

export async function POST(request: NextRequest) {
  try {
    const { category, currentScore, maxScore, currentNote, deckContent, question } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    const userPrompt = `Category: ${category}
Current Score: ${currentScore}/${maxScore}
Assessment: ${currentNote}

Deck context: ${typeof deckContent === 'string' ? deckContent.slice(0, 10000) : 'Not provided'}

User question: ${question}

Give specific, actionable advice for improving this category.`

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      return NextResponse.json(
        { error: `API error: ${anthropicResponse.status}` },
        { status: 500 }
      )
    }

    const message = await anthropicResponse.json()
    const content = message.content[0]

    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return NextResponse.json({ response: content.text })
  } catch (error) {
    console.error('Audit chat error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to get advice: ${message}` },
      { status: 500 }
    )
  }
}
