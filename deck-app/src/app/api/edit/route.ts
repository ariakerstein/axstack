import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a pitch deck editor. Given a current HTML pitch deck and an edit instruction, output the complete updated HTML deck.

Rules:
- Output ONLY the complete HTML, starting with <!DOCTYPE html>
- Apply the edit instruction to the relevant slide(s)
- Keep all other slides unchanged unless the edit affects them
- Maintain the same styling, structure, and Tailwind classes
- Do not add explanations or markdown - just the HTML`

export async function POST(request: NextRequest) {
  try {
    const { html, prompt } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    if (!html || !prompt) {
      return NextResponse.json(
        { error: 'Missing html or prompt' },
        { status: 400 }
      )
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Current deck:\n\n${html.slice(0, 50000)}\n\nEdit instruction: ${prompt}\n\nOutput the complete updated HTML deck:`,
          },
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text()
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

    // Extract HTML from response (in case there's any wrapper text)
    let newHtml = content.text
    const htmlMatch = newHtml.match(/<!DOCTYPE html>[\s\S]*/i)
    if (htmlMatch) {
      newHtml = htmlMatch[0]
    }

    return NextResponse.json({ html: newHtml })
  } catch (error) {
    console.error('Edit error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to edit deck: ${message}` },
      { status: 500 }
    )
  }
}
