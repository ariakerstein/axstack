'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { upload } from '@vercel/blob/client'
import { getShuffledQuotes } from '@/lib/quotes'

interface CategoryDetails {
  key: string
  label: string
  score: number
  max: number
  note: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface SourceIssue {
  slide: number
  claim: string
  suggestion: string
}

interface Objection {
  objection: string
  whyTheyAsk: string
  suggestedAnswer: string
}

interface RedFlag {
  dontSay: string
  whyItHurts: string
  sayInstead: string
}

interface ObjectionsData {
  tier1: Objection[]
  tier2: Objection[]
  tier3: Objection[]
  whyNow: string
  redFlags: RedFlag[]
}

interface SavedDeck {
  id: string
  name: string
  html: string
  timestamp: number
}

export default function AuditPage() {
  const router = useRouter()
  const [deckUrl, setDeckUrl] = useState('')
  const [deckContent, setDeckContent] = useState('')
  const [auditedContent, setAuditedContent] = useState('')
  const [isAuditing, setIsAuditing] = useState(false)
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([])
  const [result, setResult] = useState<{
    score: number
    scoreBreakdown: Record<string, { score: number; max: number; note: string }>
    verdict: string
    topFixes: string[]
    detailedNotes: string
    slideScores?: { slide: number; score: number; status: 'green' | 'yellow' | 'red'; issue: string | null }[]
  } | null>(null)
  const [error, setError] = useState('')
  const [inputMode, setInputMode] = useState<'url' | 'paste' | 'upload' | 'saved'>('url')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const quotes = useMemo(() => getShuffledQuotes(), [])

  // Rotate quotes while auditing
  useEffect(() => {
    if (!isAuditing) return
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAuditing, quotes.length])

  // Load saved decks from localStorage
  useEffect(() => {
    const loadSavedDecks = () => {
      const decks: SavedDeck[] = []

      // Load current deck
      const currentDeck = localStorage.getItem('generatedDeck')
      if (currentDeck) {
        try {
          const data = JSON.parse(currentDeck)
          if (data.html) {
            decks.push({
              id: 'current',
              name: 'Current Deck',
              html: data.html,
              timestamp: Date.now()
            })
          }
        } catch { /* ignore */ }
      }

      // Load saved versions
      const versions = localStorage.getItem('deckVersions')
      if (versions) {
        try {
          const parsed = JSON.parse(versions)
          parsed.forEach((v: { id: string; name: string; html: string; timestamp: number }) => {
            decks.push({
              id: v.id,
              name: v.name,
              html: v.html,
              timestamp: v.timestamp
            })
          })
        } catch { /* ignore */ }
      }

      setSavedDecks(decks)
    }

    loadSavedDecks()
  }, [])

  const auditSavedDeck = (deck: SavedDeck) => {
    setDeckContent(deck.html)
    handleAuditWithContent(deck.html)
  }

  const handleAuditWithContent = async (content: string) => {
    setIsAuditing(true)
    setError('')
    setResult(null)
    setAuditedContent(content)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to audit deck')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to audit deck'
      setError(message)
    } finally {
      setIsAuditing(false)
    }
  }

  const openInEditor = () => {
    if (!auditedContent) return
    // Save to localStorage and navigate to editor
    const existingData = localStorage.getItem('generatedDeck')
    const parsed = existingData ? JSON.parse(existingData) : {}
    localStorage.setItem('generatedDeck', JSON.stringify({
      ...parsed,
      html: auditedContent,
      score: result?.score,
      scoreBreakdown: result?.scoreBreakdown,
      gaps: result?.topFixes,
      slideScores: result?.slideScores,
    }))
    router.push('/editor')
  }

  const processFile = async (file: File) => {
    // Check max size (20MB)
    const MAX_SIZE = 20 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum size is 20MB.')
      return
    }

    // Check if it's a PDF
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file.')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      let parseResponse: Response

      // For large files (> 4MB), use client-side blob upload (bypasses serverless limits)
      if (file.size > 4 * 1024 * 1024) {
        // Step 1: Upload directly to Vercel Blob from browser
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload-pdf',
        })

        // Step 2: Parse from blob URL
        parseResponse = await fetch('/api/parse-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: blob.url }),
        })
      } else {
        // For small files, direct upload (faster)
        const formData = new FormData()
        formData.append('file', file)

        parseResponse = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        })
      }

      if (!parseResponse.ok) {
        const contentType = parseResponse.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const data = await parseResponse.json()
          throw new Error(data.error || 'Failed to parse PDF')
        } else {
          throw new Error(`Server error: ${parseResponse.status}`)
        }
      }

      const data = await parseResponse.json()
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('Could not extract text from PDF. Try pasting the content instead.')
      }
      setDeckContent(data.text)
      setAuditedContent(data.text)
      // Auto-trigger audit
      handleAuditWithContent(data.text)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload PDF'
      setError(message)
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  // Side panel state
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetails | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatting, setIsChatting] = useState(false)

  // Sources and Objections state
  const [activeTab, setActiveTab] = useState<'scorecard' | 'sources' | 'objections'>('scorecard')
  const [sourceIssues, setSourceIssues] = useState<SourceIssue[]>([])
  const [isLoadingSources, setIsLoadingSources] = useState(false)
  const [objectionsData, setObjectionsData] = useState<ObjectionsData | null>(null)
  const [isLoadingObjections, setIsLoadingObjections] = useState(false)

  const handleAudit = async () => {
    if (!deckUrl && !deckContent) {
      setError('Please provide a deck URL or paste your deck content')
      return
    }

    setIsAuditing(true)
    setError('')
    setResult(null)
    // Save content for potential editing later
    if (deckContent) {
      setAuditedContent(deckContent)
    }

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: deckUrl || undefined,
          content: deckContent || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to audit deck')
      }

      const data = await response.json()
      setResult(data)
      // Save the content for editing (works for URL mode too now)
      if (data.deckContent) {
        setAuditedContent(data.deckContent)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to audit deck'
      setError(message)
    } finally {
      setIsAuditing(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('Ready')) return 'text-emerald-500'
    if (verdict.includes('Almost')) return 'text-amber-500'
    if (verdict.includes('Needs')) return 'text-orange-500'
    return 'text-red-500'
  }

  const openCategoryPanel = (key: string, value: { score: number; max: number; note: string }) => {
    const label = key.replace(/([A-Z])/g, ' $1').trim()
    setSelectedCategory({ key, label, ...value })
    setChatMessages([{
      role: 'assistant',
      content: `**${label}**: ${value.score}/${value.max}\n\n${value.note}\n\nAsk me how to improve this score.`
    }])
    setChatInput('')
  }

  const handleCategoryChat = async () => {
    if (!chatInput.trim() || !selectedCategory) return

    const userMessage = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatInput('')
    setIsChatting(true)

    try {
      const response = await fetch('/api/audit-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory.label,
          currentScore: selectedCategory.score,
          maxScore: selectedCategory.max,
          currentNote: selectedCategory.note,
          deckContent: deckContent || deckUrl,
          question: userMessage,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }])
    } finally {
      setIsChatting(false)
    }
  }

  const handleLoadSources = async () => {
    if (!auditedContent || isLoadingSources) return
    setIsLoadingSources(true)
    try {
      const response = await fetch('/api/check-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: auditedContent }),
      })
      if (response.ok) {
        const data = await response.json()
        setSourceIssues(data.issues || [])
      }
    } catch (err) {
      console.error('Failed to load sources:', err)
    } finally {
      setIsLoadingSources(false)
    }
  }

  const handleLoadObjections = async () => {
    if (!auditedContent || isLoadingObjections) return
    setIsLoadingObjections(true)
    try {
      const response = await fetch('/api/objections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: auditedContent }),
      })
      if (response.ok) {
        const data = await response.json()
        setObjectionsData(data)
      }
    } catch (err) {
      console.error('Failed to load objections:', err)
    } finally {
      setIsLoadingObjections(false)
    }
  }

  if (isAuditing) {
    const quote = quotes[quoteIndex]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-fuchsia-300/20 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mb-8 mx-auto" style={{ borderTopColor: 'rgb(139, 92, 246)', borderBottomColor: 'rgb(20, 184, 166)' }}></div>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">Auditing your deck...</h2>
          <p className="text-slate-500 mb-12">Analyzing against investor framework</p>

          <div className="max-w-lg text-center transition-opacity duration-500">
            <p className="text-lg text-slate-600 italic mb-2">&ldquo;{quote.text}&rdquo;</p>
            <p className="text-sm text-slate-400">— {quote.author}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen px-8 py-16 bg-white relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-40 right-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-fuchsia-300/15 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        {/* Back link */}
        <Link href="/" className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 hover:opacity-80 text-sm font-medium mb-8 inline-block">
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold mb-4 text-slate-900">Audit Your Deck</h1>
        <p className="text-slate-500 mb-8">
          Get a detailed scorecard based on Kawasaki 10/20/30, YC, and a16z best practices.
          We'll tell you exactly what to fix.
        </p>

        {!result ? (
          <>
            {/* Input mode toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setInputMode('url')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'url'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                URL
              </button>
              <button
                onClick={() => setInputMode('paste')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'paste'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                Paste
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'upload'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                Upload PDF
              </button>
              <button
                onClick={() => setInputMode('saved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'saved'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                Saved Decks {savedDecks.length > 0 && <span className="ml-1 bg-violet-500 text-white text-xs px-1.5 rounded-full">{savedDecks.length}</span>}
              </button>
            </div>

            {/* URL input */}
            {inputMode === 'url' && (
              <div className="mb-6">
                <label className="block text-sm text-slate-500 mb-2">
                  Deck URL (HTML, PDF, or public link)
                </label>
                <input
                  type="url"
                  value={deckUrl}
                  onChange={(e) => setDeckUrl(e.target.value)}
                  placeholder="https://example.com/my-deck.html"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm"
                />
              </div>
            )}

            {/* Paste content */}
            {inputMode === 'paste' && (
              <div className="mb-6">
                <label className="block text-sm text-slate-500 mb-2">
                  Paste your deck content (text, markdown, or HTML)
                </label>
                <textarea
                  value={deckContent}
                  onChange={(e) => setDeckContent(e.target.value)}
                  placeholder="Paste your deck content here..."
                  rows={10}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none font-mono text-sm shadow-sm"
                />
              </div>
            )}

            {/* Upload PDF */}
            {inputMode === 'upload' && (
              <div className="mb-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer bg-white ${
                    isDragging
                      ? 'border-violet-400 bg-violet-50'
                      : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50/50'
                  }`}
                  onClick={() => document.getElementById('pdf-input')?.click()}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderTopColor: 'rgb(139, 92, 246)', borderBottomColor: 'rgb(20, 184, 166)' }}></div>
                      <p className="text-slate-600">Extracting text from PDF...</p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-4">{isDragging ? '📥' : '📄'}</div>
                      <p className="text-lg text-slate-700 mb-2">
                        {isDragging ? 'Drop it here!' : 'Drop your PDF here or click to upload'}
                      </p>
                      <p className="text-sm text-slate-500">We&apos;ll extract the text and audit it</p>
                    </>
                  )}
                </div>
                <input
                  id="pdf-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            )}

            {/* Saved decks */}
            {inputMode === 'saved' && (
              <div className="mb-6">
                {savedDecks.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-slate-500 mb-4">No saved decks found</p>
                    <Link href="/create" className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 font-medium hover:opacity-80">
                      Create a deck first →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500 mb-4">
                      Click any deck to audit it
                    </p>
                    {savedDecks.map((deck) => (
                      <button
                        key={deck.id}
                        onClick={() => auditSavedDeck(deck)}
                        className="w-full text-left p-4 bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-400 rounded-xl transition-all group shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                              {deck.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {deck.id === 'current' ? 'Your working deck' : `Saved ${new Date(deck.timestamp).toLocaleDateString()}`}
                            </p>
                          </div>
                          <span className="text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            Audit →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {inputMode !== 'saved' && (
              <button
                onClick={handleAudit}
                disabled={!deckUrl && !deckContent}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  deckUrl || deckContent
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Audit My Deck
              </button>
            )}

            {/* What we check */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-xl font-semibold mb-6 text-slate-900">What we evaluate</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Premise (15 pts)</p>
                  <p className="text-sm text-slate-500">Clarity, urgency, believability, upside, contrarian insight</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-orange-500">Content (10 pts)</p>
                  <p className="text-sm text-slate-500">GTM clarity, traction, business model, the ask</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Structure (5 pts)</p>
                  <p className="text-sm text-slate-500">Kawasaki 10/20/30, visual hierarchy</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-semibold text-red-500">Red Flags</p>
                  <p className="text-sm text-slate-500">"No competitors", vague GTM, metrics without timeframes</p>
                </div>
              </div>
            </div>

            {/* Scoring philosophy */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-xl font-semibold mb-4 text-slate-900">Why we score this way</h2>
              <p className="text-slate-600 mb-6">
                We studied the actual seed decks that closed: Intercom (8 slides, $600K),
                Tinder (10 slides), Airbnb (12 slides). The pattern is clear.
              </p>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-violet-50 to-white border border-slate-200 p-5 rounded-xl">
                  <p className="font-semibold text-slate-900 mb-2">Short beats comprehensive</p>
                  <p className="text-sm text-slate-600">
                    The decks that try to cover everything end up saying nothing. The ones that pick
                    one insight and hammer it home are the ones that closed. We penalize clutter.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-white border border-slate-200 p-5 rounded-xl">
                  <p className="font-semibold text-slate-900 mb-2">Narrative over numbers</p>
                  <p className="text-sm text-slate-600">
                    Coinbase pitched Bitcoin at $6.25. Airbnb&apos;s revenue projections were wrong.
                    Facebook&apos;s deck was barely a fundraising document. We weight conviction and
                    clarity higher than precision at seed stage.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white border border-slate-200 p-5 rounded-xl">
                  <p className="font-semibold text-slate-900 mb-2">Substance over storytelling</p>
                  <p className="text-sm text-slate-600">
                    WeWork&apos;s deck read like a masterclass in narrative. The fundamentals were hollow.
                    We check that your story is backed by real insight, not just polished words.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Score header */}
            <div className="bg-gradient-to-br from-violet-50 to-teal-50 border border-slate-200 rounded-xl p-8 text-center shadow-lg">
              <p className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">{result.score}<span className="text-slate-400 text-3xl">/30</span></p>
              <p className={`text-xl font-semibold ${getVerdictColor(result.verdict)}`}>
                {result.verdict}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('scorecard')}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === 'scorecard'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                Scorecard
              </button>
              <button
                onClick={() => {
                  setActiveTab('sources')
                  if (sourceIssues.length === 0 && !isLoadingSources) {
                    handleLoadSources()
                  }
                }}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === 'sources'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                Sources {sourceIssues.length > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 rounded-full">{sourceIssues.length}</span>}
              </button>
              <button
                onClick={() => {
                  setActiveTab('objections')
                  if (!objectionsData && !isLoadingObjections) {
                    handleLoadObjections()
                  }
                }}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === 'objections'
                    ? 'bg-gradient-to-r from-violet-600 to-teal-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                Objections Prep
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'scorecard' && (
              <>
            {/* Score breakdown */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-900">Scorecard</h2>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Category</th>
                      <th className="text-center py-3 px-4 text-slate-600 font-medium">Score</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.scoreBreakdown).map(([key, value]) => (
                      <tr
                        key={key}
                        className="border-b border-slate-100 hover:bg-violet-50 cursor-pointer transition-colors"
                        onClick={() => openCategoryPanel(key, value)}
                      >
                        <td className="py-3 px-4 capitalize text-slate-900">{key.replace(/([A-Z])/g, ' $1')}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-semibold ${value.score >= value.max * 0.8 ? 'text-emerald-500' : value.score >= value.max * 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                            {value.score}/{value.max}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-sm">{value.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top fixes */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-900">Top 3 Fixes</h2>
              <div className="space-y-3">
                {result.topFixes.map((fix, i) => (
                  <div key={i} className="flex gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <span className="bg-gradient-to-r from-violet-600 to-teal-500 text-transparent bg-clip-text font-bold text-lg">{i + 1}</span>
                    <p className="text-slate-700">{fix}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed notes */}
            {result.detailedNotes && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Detailed Notes</h2>
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-slate-600 whitespace-pre-wrap shadow-sm">
                  {result.detailedNotes}
                </div>
              </div>
            )}
              </>
            )}

            {/* Sources Tab */}
            {activeTab === 'sources' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Source Audit</h2>
                <p className="text-slate-500 mb-6">Claims that need citations for credibility.</p>

                {isLoadingSources ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderTopColor: 'rgb(139, 92, 246)', borderBottomColor: 'rgb(20, 184, 166)' }}></div>
                    <span className="ml-3 text-slate-500">Analyzing sources...</span>
                  </div>
                ) : sourceIssues.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                    <p className="text-emerald-600 font-medium">No unsourced claims found!</p>
                    <p className="text-slate-500 text-sm mt-1">Your deck appears to have proper citations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sourceIssues.map((issue, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 border-l-4 border-l-orange-400 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">
                            Slide {issue.slide}
                          </span>
                          <div className="flex-1">
                            <p className="text-slate-900 font-medium mb-2">&ldquo;{issue.claim}&rdquo;</p>
                            <p className="text-slate-500 text-sm">
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 font-medium">Suggested source:</span> {issue.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Objections Tab */}
            {activeTab === 'objections' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Investor Q&A Prep</h2>
                <p className="text-slate-500 mb-6">Likely objections and how to handle them.</p>

                {isLoadingObjections ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderTopColor: 'rgb(139, 92, 246)', borderBottomColor: 'rgb(20, 184, 166)' }}></div>
                    <span className="ml-3 text-slate-500">Generating objections prep...</span>
                  </div>
                ) : !objectionsData ? (
                  <div className="text-center py-12 text-slate-500">
                    Failed to load objections. Try refreshing.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Why Now */}
                    {objectionsData.whyNow && (
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-6">
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold mb-2">Your &ldquo;Why Now?&rdquo; Answer</h3>
                        <p className="text-slate-700">{objectionsData.whyNow}</p>
                      </div>
                    )}

                    {/* Tier 1 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-red-500">Tier 1: Expect Every Pitch</h3>
                      <div className="space-y-3">
                        {objectionsData.tier1?.map((obj, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <p className="font-medium text-slate-900 mb-2">&ldquo;{obj.objection}&rdquo;</p>
                            <p className="text-xs text-slate-500 mb-2">Why they ask: {obj.whyTheyAsk}</p>
                            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 font-medium">Answer:</span> {obj.suggestedAnswer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tier 2 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-amber-500">Tier 2: Likely Follow-Ups</h3>
                      <div className="space-y-3">
                        {objectionsData.tier2?.map((obj, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <p className="font-medium text-slate-900 mb-2">&ldquo;{obj.objection}&rdquo;</p>
                            <p className="text-xs text-slate-500 mb-2">Why they ask: {obj.whyTheyAsk}</p>
                            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 font-medium">Answer:</span> {obj.suggestedAnswer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tier 3 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-orange-500">Tier 3: Harder Questions</h3>
                      <div className="space-y-3">
                        {objectionsData.tier3?.map((obj, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <p className="font-medium text-slate-900 mb-2">&ldquo;{obj.objection}&rdquo;</p>
                            <p className="text-xs text-slate-500 mb-2">Why they ask: {obj.whyTheyAsk}</p>
                            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 font-medium">Answer:</span> {obj.suggestedAnswer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Red Flags */}
                    {objectionsData.redFlags && objectionsData.redFlags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-red-500">Red Flags to Avoid</h3>
                        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-red-200 bg-red-100/50">
                                <th className="text-left py-3 px-4 text-red-600 font-medium">Don&apos;t Say</th>
                                <th className="text-left py-3 px-4 text-red-600 font-medium">Why It Hurts</th>
                                <th className="text-left py-3 px-4 text-emerald-600 font-medium">Say Instead</th>
                              </tr>
                            </thead>
                            <tbody>
                              {objectionsData.redFlags.map((flag, i) => (
                                <tr key={i} className="border-b border-red-100 last:border-0">
                                  <td className="py-3 px-4 text-slate-700">{flag.dontSay}</td>
                                  <td className="py-3 px-4 text-slate-500 text-sm">{flag.whyItHurts}</td>
                                  <td className="py-3 px-4 text-slate-700">{flag.sayInstead}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {auditedContent && (
                <button
                  onClick={openInEditor}
                  className="w-full bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
                >
                  Edit This Deck →
                </button>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 border border-slate-200 hover:border-violet-300 text-slate-700 hover:text-violet-600 py-3 rounded-xl transition-all bg-white shadow-sm hover:shadow-md"
                >
                  Audit Another Deck
                </button>
                <Link
                  href="/create"
                  className="flex-1 border border-slate-200 hover:border-violet-300 text-slate-700 hover:text-violet-600 text-center py-3 rounded-xl transition-all bg-white shadow-sm hover:shadow-md"
                >
                  Create New Deck
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      {selectedCategory && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedCategory(null)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-br from-violet-50 to-teal-50">
              <div>
                <h3 className="font-semibold capitalize text-slate-900">{selectedCategory.label}</h3>
                <p className={`text-sm font-semibold ${selectedCategory.score >= selectedCategory.max * 0.8 ? 'text-emerald-500' : selectedCategory.score >= selectedCategory.max * 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                  {selectedCategory.score}/{selectedCategory.max}
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-100 to-teal-100 ml-8 border border-violet-200'
                      : 'bg-white mr-8 border border-slate-200 shadow-sm'
                  } p-3 rounded-xl text-sm whitespace-pre-wrap text-slate-700`}
                >
                  {msg.content}
                </div>
              ))}
              {isChatting && (
                <div className="bg-white mr-8 p-3 rounded-xl text-sm text-slate-400 border border-slate-200 shadow-sm">
                  Thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryChat()}
                  placeholder="Ask how to improve..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <button
                  onClick={handleCategoryChat}
                  disabled={!chatInput.trim() || isChatting}
                  className="bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 disabled:bg-slate-200 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white px-4 py-2 rounded-xl text-sm transition-all shadow-md"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
