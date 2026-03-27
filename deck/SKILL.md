---
name: deck
description: >-
  Generate investor-ready pitch decks from guided discovery. HTML + Tailwind output with
  presentation controls, multiple themes, and print-to-PDF. Use when: "make me a deck",
  "create a pitch deck", "build slides", "investor presentation", "/deck", or when
  referencing pitch files. Generates to public/pitches/ or ./pitches/.
argument-hint: new | from <file> | iterate | retheme <file> | list-themes
---

# Deck Skill

A guided deck generator that asks forcing questions, then outputs a complete HTML + Tailwind pitch deck with presentation controls, themes, and auto-review.

## Commands

- `/deck` or `/deck new` - Start guided discovery flow
- `/deck from <file>` - Generate from existing brief/notes
- `/deck iterate` - Refine existing deck based on feedback
- `/deck retheme <file>` - Swap the theme of an existing deck
- `/deck list-themes` - Show available themes

---

## Operating Philosophy

1. **Questions before slides.** No deck without understanding the business first.
2. **Specificity over polish.** "Jane, VP Ops at Stripe" beats "enterprise customers."
3. **One answer per question.** Sequential flow, no batching.
4. **Pushback is caring.** Vague answers get re-asked.
5. **Complete > perfect.** Ship a full deck, iterate later.
6. **Self-review built in.** Every deck runs through fundraise framework.
7. **Hard content limits.** If it doesn't fit, split the slide.

---

## Phase 0: Context Check

Before asking questions, check for existing context:

1. Read CLAUDE.md, README.md for product context
2. Check for existing decks in ./pitches/ or ./public/pitches/
3. Look for investor materials, one-pagers, briefs
4. Pre-fill what can be inferred

If context exists, confirm: "I found [X]. Should I build from this or start fresh?"

If user provides detailed outline with content, collapse Phase 1 into a quick confirmation.

---

## Phase 1: Discovery (6 Forcing Questions)

Ask ONE question at a time. Wait for response. No batching.

### Question Flow

| # | Question | What You're Looking For |
|---|----------|------------------------|
| 1 | **What do you do in one sentence?** | "We help [X] do [Y] by [Z]" format. No jargon. |
| 2 | **Who is desperate for this? Name a real person or title.** | Specific role + context. Not "enterprises" or "SMBs." |
| 3 | **What are they doing today without you?** | Current workaround reveals pain intensity. |
| 4 | **What's your unfair advantage?** | Ex-[company], domain expert, existing traction, unique insight. |
| 5 | **How do you make money? Pick ONE model.** | SaaS, usage, marketplace, transaction fee. No "exploring." |
| 6 | **How much are you raising, and what milestone does it unlock?** | $X to achieve Y (not a shopping list). |

After Q6, ask: **Which theme?** (dark-modern, light-clean, warm-editorial, bold-dark) — default to `dark-modern` if no preference.

### Pushback Patterns

If answer is vague, re-ask with specificity prompt:

| Vague Answer | Pushback |
|--------------|----------|
| "Enterprise customers" | "Name one person at one company who would buy this." |
| "We're exploring revenue models" | "Gun to your head, which one would you ship tomorrow?" |
| "Huge market" | "What's your SOM? How many can you actually reach in year 1?" |
| "No competitors" | "What do people use today? Excel? Manual process? Competitor X?" |
| "Various use cases" | "Which ONE use case would you bet the company on?" |

### Escape Hatch

If user signals impatience ("just build it"), allow max 2 more critical questions, then proceed with available info. Flag gaps in output.

---

## Phase 2: Deck Generation

Generate a complete 10-slide HTML deck using the reference files.

### Assembly Steps

1. Read `boilerplate.html` from this skill directory — use it **verbatim** as the outer shell
2. Read `themes.md` — apply the chosen theme's classes to each slide
3. Read `slide-types.md` — use the appropriate type for each slide
4. Assemble the full HTML file with slides inside the `<!-- SLIDES GO HERE -->` comment
5. Replace DECK_TITLE, TOTAL_SLIDES in the boilerplate
6. Write to `public/pitches/<filename>.html` or `./pitches/<filename>.html`

### Slide Structure

| # | Slide | Content Formula | Slide Type |
|---|-------|-----------------|------------|
| 1 | **Title** | Company name + one-line positioning | Cover |
| 2 | **Problem** | Pain with DATA (stat, cost, time lost). Not emotion. | Statement |
| 3 | **Why Now** | Market timing + wedge (what changed?) | Statement or Flow |
| 4 | **Solution** | How you fix it. Outcome, not features. | Flow |
| 5 | **How It Works** | 3-step process or demo screenshot | Flow or Feature Cards |
| 6 | **Business Model** | ONE clear revenue model + pricing | Big Metrics or Two-Column |
| 7 | **Traction** | Metrics WITH timeframes. Velocity > size. | Quotes or Big Metrics |
| 8 | **Competition** | Honest 2x2 or comparison table. Never "none." | Table or Checklist |
| 9 | **Team** | Why YOU win. Credentials + unfair advantages. | Team Grid |
| 10 | **Ask** | $ amount + use of funds + milestone unlocked | Two-Column |

### Content Density Limits (HARD RULES)

These are non-negotiable. If content doesn't fit, split into two slides.

| Slide Type | Max Items | Max Words Per Item |
|------------|-----------|-------------------|
| Cover | 1 title + 1 subtitle + date | 10 words title, 8 subtitle |
| Statement | 1 headline + 3 cards OR 1 image | 8 words headline, 20 words/card |
| Flow | 3-5 steps + 1 callout box | 5 words/step, 30 words callout |
| Team | 3-6 people | Name + title + 2 credential lines |
| Big Metrics | 2-5 metric cards + 2 detail blocks | 3 words/metric label |
| Feature Cards | 3 cards with 3 bullets each | 8 words/bullet |
| Quotes | 2-4 metrics + 2-3 quotes | 20 words/quote |
| Table | Max 6 rows, max 4 columns | 15 words/cell |
| Two-Column | 4 key-value pairs + 3 action items | 20 words/action item |

---

## Anti-Generic Directives

When generating slide content and layout:

**NEVER:**
- Use the same layout for consecutive slides (vary between types)
- Put more than one idea per slide
- Use generic filler ("In today's world...", "As we all know...")
- Generate walls of text — if it needs a paragraph, it's too much
- Use identical card structures on every slide (3 cards, 3 cards, 3 cards)
- Invent statistics, quotes, or metrics the user didn't provide
- Claim "no competitors"
- Show metrics without timeframes

**ALWAYS:**
- Alternate dark/light backgrounds for visual rhythm (dark-modern theme)
- Lead with the most important number or insight, not the label
- Use whitespace generously — empty space is a design choice
- Make one element per slide visually dominant (the "hero" element)
- Vary visual patterns: cards on one slide, table on next, flow on next
- Include header bar on every slide except cover (section label + logo)
- Include slide number in bottom-right of every slide

---

## Phase 3: Verify

Run this self-check before delivering:

- [ ] Slide count matches outline (max 10)
- [ ] Every slide has a header bar (except cover) with section label + logo
- [ ] Every slide has a slide-number div in bottom-right
- [ ] All slides use `slide-centered` class
- [ ] Dark/light backgrounds alternate for visual rhythm
- [ ] Nav hint shows correct total slide count
- [ ] No slide exceeds content density limits
- [ ] No placeholder text or `{{variables}}` remain
- [ ] All image paths are valid relative paths or URLs the user provided
- [ ] Font sizes: headlines text-4xl+, body text-base+, metrics text-5xl+

---

## Phase 4: Self-Review via Fundraise

After generating, automatically evaluate against fundraise framework.

### Quick Scorecard

| Category | Check |
|----------|-------|
| **Clarity** | Can explain in 30 seconds? |
| **Problem** | Painkiller or vitamin? |
| **Believability** | Team credentials + traction? |
| **GTM** | How acquire customers? |
| **Ask** | Specific amount + use? |

### Flag Gaps

If discovery had weak answers, flag in output:

```
## GAPS TO ADDRESS

- [ ] **GTM unclear** - User said "partnerships" but no specific channel
- [ ] **Traction missing** - No metrics provided, using placeholder
- [ ] **Team slide weak** - Need credentials beyond "passionate"
```

---

## Phase 5: Output

### File Location

Save deck to: `./pitches/deck-[date].html` or `public/pitches/deck-[date].html`

### Provide User

1. File path to generated deck
2. Instructions: "Open in browser. Use arrow keys to navigate. Click PDF button to export."
3. Quick scorecard (Phase 4)
4. Top 3 improvements to make
5. Command to iterate: `/deck iterate` or full audit: `/fundraise review <file>`

---

## Themes

Four built-in themes. Ask user preference or default to `dark-modern`.

| Theme | Vibe | Best For |
|-------|------|----------|
| `dark-modern` | Dark slides, vibrant accents, alternating rhythm | Investor meetings, demos |
| `light-clean` | All-white, formal | Board decks, partner updates |
| `warm-editorial` | Warm tones, storytelling feel | Patient-facing, emotional stories |
| `bold-dark` | High contrast black, punchy | Demo day, conference, keynote |

See `themes.md` for full class definitions.

---

## Reference Files

Read these on-demand during Phase 2 (Generate):

| File | When to Read | What It Contains |
|------|--------------|------------------|
| `boilerplate.html` | Always (Phase 2, step 1) | Complete HTML/CSS/JS presentation engine — use verbatim |
| `themes.md` | Always (Phase 2, step 2) | Theme class definitions for all 4 themes |
| `slide-types.md` | Always (Phase 2, step 3) | Complete example for each of the 10 slide types |

---

## Example Flow

```
User: /deck

Claude: I'll help you build a pitch deck. Let me check for existing context...

Found README.md with product description. Should I build from this or start fresh?

User: Start fresh

Claude: Got it. Let's go through 6 questions. One at a time.

**Question 1/6: What do you do in one sentence?**
Format: "We help [X] do [Y] by [Z]"

User: We help cancer patients get second opinions faster

Claude: Good start. Let me push for more specificity.

"Cancer patients" is broad. Which cancer? Which stage of their journey?
And "faster" — faster than what? What's the current timeline?

User: We help newly diagnosed cancer patients get expert second opinions
in 24 hours instead of 2 weeks, for $99 instead of $4,000.

Claude: That's specific. Moving on.

**Question 2/6: Who is desperate for this? Name a real person or title.**

[...continues through all 6 questions...]

**Theme preference?** (dark-modern, light-clean, warm-editorial, bold-dark)

User: dark-modern

Claude: Got what I need. Generating your deck...

## DECK GENERATED

Saved to: ./pitches/deck-2026-03-27.html

**To view:** Open in browser. Use arrow keys or click to navigate.
Click the download button (↓) to save as PDF.

### Quick Score: 24/30 (Almost Ready)

| Category | Score | Note |
|----------|-------|------|
| Clarity | 3/3 | Clear one-liner |
| Problem | 3/3 | Painkiller with data |
| GTM | 2/3 | Need channel specifics |
| Traction | 2/3 | Add timeframes |
| Ask | 3/3 | Clear amount + use |

### Top 3 Improvements

1. **GTM**: Add specific acquisition channel beyond "content marketing"
2. **Traction**: Include timeframes ("50 patients in 8 weeks")
3. **Competition**: Add speed comparison to table

Run `/deck iterate` to refine, or `/fundraise review ./pitches/deck-2026-03-27.html` for full audit.
```

---

## Advanced: Generate from Brief

If user has existing materials:

```
/deck from ./notes/investor-brief.md
```

Read the file, extract answers to the 6 questions, ask for theme preference, generate deck. Flag any missing pieces.

---

## Integration with Fundraise Skill

The deck skill generates; the fundraise skill reviews.

```
/deck               → Generate new deck
/fundraise review   → Full 30-point audit
/fundraise premise  → Quick believability check
/fundraise objections → Investor Q&A prep
/deck iterate       → Apply feedback to deck
/deck retheme       → Change theme without regenerating content
```
