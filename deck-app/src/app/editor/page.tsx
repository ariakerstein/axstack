'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function EditorPage() {
  const [html, setHtml] = useState<string>('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [slides, setSlides] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Load initial deck from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('generatedDeck')
    if (stored) {
      const data = JSON.parse(stored)
      setHtml(data.html)
    }
  }, [])

  // Parse slides from HTML
  useEffect(() => {
    if (!html) return
    // Look for sections with slide class or section elements
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const sections = doc.querySelectorAll('section')
    if (sections.length > 0) {
      setSlides(Array.from(sections).map(s => s.outerHTML))
    } else {
      // Fallback: treat whole doc as one slide
      setSlides([html])
    }
  }, [html])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    const userMessage = prompt.trim()
    setPrompt('')
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, prompt: userMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to edit deck')
      }

      const data = await response.json()
      setHtml(data.html)
      setChatHistory(prev => [...prev, { role: 'assistant', content: '✓ Updated deck' }])

      // Save to localStorage
      localStorage.setItem('generatedDeck', JSON.stringify({ html: data.html }))
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: '✗ Error updating deck. Try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-deck-${new Date().toISOString().split('T')[0]}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalSlides = slides.length || 10

  if (!html) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-semibold mb-4">No deck found</h2>
        <p className="text-slate-400 mb-8">Create a deck first to edit it.</p>
        <Link href="/create" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg">
          Create Deck
        </Link>
      </div>
    )
  }

  // Build single-slide HTML for preview
  const slideHtml = slides[currentSlide] ? `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { margin: 0; background: #0f172a; }
        section { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
      </style>
    </head>
    <body>${slides[currentSlide]}</body>
    </html>
  ` : html

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-teal-400 hover:underline text-sm">← Home</Link>
          <h1 className="text-lg font-semibold">Prompt Deck</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Download HTML
          </button>
          <Link
            href="/create"
            className="text-slate-400 hover:text-white text-sm"
          >
            Start Over
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left: Slide Preview */}
        <div className="flex-1 md:w-3/5 flex flex-col bg-slate-900">
          {/* Slide Display */}
          <div className="flex-1 relative">
            <iframe
              srcDoc={slideHtml}
              className="w-full h-full border-0"
              title="Slide Preview"
            />
          </div>

          {/* Slide Navigation */}
          <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-3 py-1 rounded text-sm disabled:text-slate-600 text-slate-300 hover:text-white"
              >
                ◀ Prev
              </button>

              <span className="text-slate-400 text-sm">
                {currentSlide + 1} / {totalSlides}
              </span>

              <button
                onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="px-3 py-1 rounded text-sm disabled:text-slate-600 text-slate-300 hover:text-white"
              >
                Next ▶
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentSlide ? 'bg-teal-400' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="md:w-2/5 bg-slate-800 border-l border-slate-700 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="font-semibold">Edit Your Deck</h2>
            <p className="text-sm text-slate-400">Type what you want to change</p>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistory.length === 0 && (
              <div className="text-slate-500 text-sm">
                <p className="mb-2">Try prompts like:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>• "Make the problem slide more urgent"</li>
                  <li>• "Add competitor pricing comparison"</li>
                  <li>• "Strengthen the team credentials"</li>
                  <li>• "Make the ask more specific"</li>
                </ul>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`text-sm ${
                  msg.role === 'user'
                    ? 'text-slate-300'
                    : msg.content.startsWith('✓')
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {msg.role === 'user' && <span className="text-slate-500">You: </span>}
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="text-slate-400 text-sm flex items-center gap-2">
                <span className="animate-spin">⏳</span> Updating deck...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to change?"
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-medium"
              >
                →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
