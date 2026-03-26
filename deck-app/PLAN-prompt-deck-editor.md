# Prompt Deck: Split-View Editor Implementation Plan

**Date:** 2026-03-26
**Status:** PLANNED
**Effort:** M (4-6h CC time)

---

## Overview

Transform the deck generator into "Prompt Deck" — a split-view editor where users generate a deck, then iterate with natural language prompts.

## Current State → Target State

```
CURRENT:
  /create → 6 questions → /preview → download HTML

TARGET:
  /create → 6 questions → /editor (split-view) → iterate → download HTML
```

---

## Scope

### In Scope (v1)
- [ ] Rebrand to "Prompt Deck" (all pages)
- [ ] New `/editor` page with split layout
- [ ] Left panel: slide preview with navigation
- [ ] Right panel: chat-style prompt input with history
- [ ] Each prompt → full deck regeneration with edit instruction
- [ ] Slide navigation (prev/next, dot indicators, click to jump)
- [ ] Download HTML button
- [ ] Session-only state (no persistence)

### Out of Scope (v2+)
- PDF export
- Undo/redo
- Version history
- Persistent save
- Image/logo upload
- Per-slide surgical edits
- Live score display
- Collaborative editing

---

## Technical Design

### New Files

```
src/app/editor/page.tsx       # Split-view editor page
src/components/Editor.tsx     # Main editor component
src/components/SlidePreview.tsx   # Left panel: slide viewer
src/components/PromptChat.tsx     # Right panel: chat interface
src/app/api/edit/route.ts     # API route for deck edits
```

### Data Flow

```
[User types prompt]
       ↓
[POST /api/edit]
  - currentHtml: string
  - prompt: string (e.g., "make problem slide more urgent")
       ↓
[Claude API]
  - System: "You are editing a pitch deck. Given the current HTML and an edit instruction, output the complete updated HTML."
  - User: "Current deck:\n{html}\n\nEdit instruction: {prompt}\n\nOutput the complete updated HTML deck."
       ↓
[Return new HTML]
       ↓
[Update preview + add to chat history]
```

### State Shape (session only)

```typescript
interface EditorState {
  html: string              // Current deck HTML
  chatHistory: ChatMessage[] // Edit history
  currentSlide: number      // Active slide index (0-9)
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
```

### Slide Navigation

Parse slides from HTML by looking for section elements or slide markers. Display current slide in an iframe or dangerouslySetInnerHTML with scroll position.

---

## Implementation Steps

### Phase 1: Rebrand (30 min)
1. Update page titles to "Prompt Deck"
2. Update homepage hero copy
3. Update meta tags
4. Update footer

### Phase 2: Editor Page Shell (1 hour)
1. Create `/editor/page.tsx` with split layout
2. 60/40 split (preview/chat) on desktop
3. Stacked on mobile (preview above)
4. Read initial HTML from localStorage (passed from /preview)

### Phase 3: Slide Preview Component (1 hour)
1. Parse slides from HTML (section elements)
2. Display current slide in contained view
3. Prev/Next navigation
4. Dot indicators (clickable)
5. Slide counter "3 / 10"

### Phase 4: Prompt Chat Component (1.5 hours)
1. Chat history display (scrollable)
2. Input field at bottom (always visible)
3. Submit button / Enter to send
4. Loading state while AI processes
5. Display AI confirmation after edit

### Phase 5: Edit API Route (1 hour)
1. Create `/api/edit/route.ts`
2. Accept currentHtml + prompt
3. Call Claude with edit instruction
4. Return updated HTML
5. Handle errors gracefully

### Phase 6: Integration (1 hour)
1. Wire up prompt submission → API → state update
2. Update preview after each edit
3. Add to chat history
4. Download HTML button
5. "Start Over" link back to /create

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Prompt Deck                    [Download HTML] [Start Over]│
├────────────────────────────┬────────────────────────────────┤
│                            │                                │
│  ┌──────────────────────┐  │  Edit History                  │
│  │                      │  │                                │
│  │    [SLIDE CONTENT]   │  │  You: Make the problem slide   │
│  │                      │  │       more urgent              │
│  │                      │  │                                │
│  │                      │  │  ✓ Updated problem slide       │
│  │                      │  │                                │
│  └──────────────────────┘  │  You: Add pricing comparison   │
│                            │       to competition slide     │
│  [◀ Prev]  3/10  [Next ▶]  │                                │
│                            │  ⏳ Updating...                 │
│  ○ ○ ● ○ ○ ○ ○ ○ ○ ○       │                                │
│                            ├────────────────────────────────┤
│                            │  [What would you like to edit?]│
│                            │                             [→]│
└────────────────────────────┴────────────────────────────────┘
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| User navigates away | Session lost (expected) |
| API error | Show error in chat, keep last good state |
| Empty prompt | Disable submit button |
| Very long prompt | Truncate at 1000 chars |
| Malformed HTML returned | Show error, keep previous HTML |

---

## Migration Path

1. `/preview` page becomes redirect to `/editor`
2. Or: keep `/preview` for quick view, `/editor` for iteration
3. Recommend: replace `/preview` entirely with `/editor`

---

## Success Criteria

- [ ] User can generate deck → land in editor
- [ ] User can type edit prompt → see updated deck
- [ ] User can navigate between slides
- [ ] User can download final HTML
- [ ] Chat history shows all edits in session
- [ ] Works on mobile (stacked layout)
