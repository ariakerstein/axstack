import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an elite pitch deck designer. Generate a VISUALLY STUNNING 10-slide HTML pitch deck using Tailwind CSS.

## KAWASAKI 10/20/30 RULES
- Exactly 10 slides
- 30pt+ fonts (text-3xl minimum body, text-6xl+ headlines)
- One idea per slide

Output ONLY valid HTML starting with <!DOCTYPE html>. No markdown, no explanation.

## SLIDE STRUCTURE
1. Title - Company name + one-line positioning
2. Problem - Pain with DATA (stats, not emotion)
3. Why Now - Market timing + wedge
4. Solution - How you fix it (outcome, not features)
5. How It Works - 3-step process
6. Business Model - ONE clear revenue model
7. Traction - Metrics WITH timeframes
8. Competition - Honest comparison table
9. Team - Why YOU win
10. Ask - $ amount + use + milestone

## VISUAL DESIGN SYSTEM (CRITICAL)

### Color Variables (use CSS custom properties)
Use these CSS variables so themes can be applied:
- var(--deck-bg) for backgrounds
- var(--deck-surface) for cards
- var(--deck-text) for headlines
- var(--deck-muted) for body text
- var(--deck-accent) for CTAs and highlights
- var(--deck-border) for borders

Include this in <head>:
<style>
:root {
  --deck-bg: #0f172a;
  --deck-surface: #1e293b;
  --deck-text: #f8fafc;
  --deck-muted: #94a3b8;
  --deck-accent: #38bdf8;
  --deck-border: #334155;
}
</style>

### Card Components (USE THESE)
Wrap key content in cards:
<div class="bg-[var(--deck-surface)] rounded-2xl p-8 shadow-xl border border-[var(--deck-border)]/50">
  <!-- content -->
</div>

### Stat Cards (for metrics)
<div class="bg-[var(--deck-surface)] rounded-xl p-6 text-center">
  <div class="text-5xl font-bold text-[var(--deck-accent)]">$2.4M</div>
  <div class="text-[var(--deck-muted)] mt-2">Annual Revenue</div>
</div>

### Gradient Accents
Use subtle gradients for visual interest:
- Background: bg-gradient-to-br from-[var(--deck-bg)] to-[var(--deck-surface)]
- Accent line: <div class="w-24 h-1 bg-gradient-to-r from-[var(--deck-accent)] to-transparent rounded-full"></div>

### Visual Icons (use emoji sparingly, 1-2 per slide max)
Use emoji icons to add personality:
- Problem: ⚠️ 💸 ❌
- Solution: ✨ 🎯 💡
- Traction: 📈 🚀 ✅
- Team: 👤 🏆 💪
- Money: 💰 📊 🎯

### Typography Hierarchy
- Slide headline: text-6xl font-bold text-[var(--deck-text)]
- Subheadline: text-2xl text-[var(--deck-muted)]
- Body: text-xl text-[var(--deck-muted)] leading-relaxed
- Stat numbers: text-5xl font-bold text-[var(--deck-accent)]
- Labels: text-sm uppercase tracking-wider text-[var(--deck-muted)]

### Layout Patterns
1. **Hero slide**: Large centered text with gradient accent line below
2. **Stats slide**: 3-4 stat cards in a grid (grid-cols-3 gap-6)
3. **Process slide**: 3 numbered steps with cards and arrows
4. **Comparison**: Styled table with alternating rows
5. **Team**: Photo placeholders with name/title cards

### Section Styling
<section class="min-h-screen flex items-center justify-center p-12 bg-[var(--deck-bg)] relative">
  <!-- Company badge -->
  <div class="absolute top-8 left-8 text-sm font-medium text-[var(--deck-muted)]">{Company}</div>
  <!-- Slide number -->
  <div class="absolute bottom-8 right-8 text-sm text-[var(--deck-muted)]">{n}/10</div>
  <!-- Content -->
  <div class="max-w-5xl w-full">
    ...
  </div>
</section>

## ANTI-PATTERNS (NEVER DO)
- Plain text without cards or visual structure
- Gray-on-gray low contrast
- Walls of text
- More than 6 bullet points
- Tiny fonts (nothing under text-xl)
- Missing visual hierarchy
- Slides without at least one visual element (card, stat, icon, or image placeholder)

Include Tailwind CDN and the CSS variables in the HTML head.`

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    const userPrompt = `Generate a pitch deck based on these answers:

Company Name: ${answers.companyName}
1. What they do: ${answers.oneLiner}
2. Who's desperate: ${answers.desperatePerson}
3. Current solution: ${answers.currentSolution}
4. Unfair advantage: ${answers.unfairAdvantage}
5. Business model: ${answers.businessModel}
6. Raising: ${answers.raiseAmount} to achieve: ${answers.raiseMilestone}

Generate the complete HTML deck now. Remember to include "${answers.companyName}" in the top-left of every slide.`

    // Call Anthropic API directly with fetch
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
            content: userPrompt,
          },
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text()
      return NextResponse.json(
        { error: `Anthropic API error: ${anthropicResponse.status} - ${errorData}` },
        { status: 500 }
      )
    }

    const message = await anthropicResponse.json()

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const html = content.text

    // Basic scoring based on content presence
    const score = calculateScore(html, answers)

    return NextResponse.json({
      html,
      score: score.total,
      scoreBreakdown: score.breakdown,
      gaps: score.gaps,
    })
  } catch (error) {
    console.error('Generation error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to generate deck: ${message}` },
      { status: 500 }
    )
  }
}

function calculateScore(html: string, answers: Record<string, string>) {
  const breakdown: Record<string, number> = {}
  const gaps: string[] = []

  // Clarity (3 pts) - one-liner is specific
  const hasSpecificOneLiner = answers.oneLiner && answers.oneLiner.length > 20
  breakdown.clarity = hasSpecificOneLiner ? 3 : 2
  if (!hasSpecificOneLiner) gaps.push('One-liner could be more specific')

  // Problem Urgency (3 pts) - current solution is painful
  const hasPainfulProblem = answers.currentSolution && answers.currentSolution.length > 50
  breakdown.problemUrgency = hasPainfulProblem ? 3 : 2
  if (!hasPainfulProblem) gaps.push('Describe the current pain more vividly')

  // Believability (3 pts) - unfair advantage is credible
  const hasCredentials = answers.unfairAdvantage &&
    (answers.unfairAdvantage.toLowerCase().includes('ex-') ||
     answers.unfairAdvantage.toLowerCase().includes('built') ||
     answers.unfairAdvantage.toLowerCase().includes('led'))
  breakdown.believability = hasCredentials ? 3 : 2
  if (!hasCredentials) gaps.push('Add specific credentials (ex-Company, built X)')

  // GTM (3 pts) - business model is clear
  breakdown.gtm = answers.businessModel ? 3 : 1
  if (!answers.businessModel) gaps.push('Specify how you acquire customers')

  // Traction (3 pts) - hard to assess without data
  breakdown.traction = 2
  gaps.push('Add specific traction numbers with timeframes')

  // Business Model (2 pts)
  breakdown.businessModel = answers.businessModel ? 2 : 1

  // The Ask (2 pts)
  const hasSpecificAsk = answers.raiseAmount && answers.raiseMilestone
  breakdown.theAsk = hasSpecificAsk ? 2 : 1
  if (!hasSpecificAsk) gaps.push('Be more specific about raise amount and milestone')

  // Kawasaki (3 pts) - HTML has proper structure
  const hasProperStructure = html.includes('slide') && html.includes('text-2xl')
  breakdown.kawasaki = hasProperStructure ? 3 : 2

  // Visual (2 pts)
  breakdown.visual = 2

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0)

  return { total, breakdown, gaps: gaps.slice(0, 3) }
}
