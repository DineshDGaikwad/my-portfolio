'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, ChevronRight } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { suggestedQuestions } from '@/ai/lib/context'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function BotIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-black font-bold text-xs shrink-0">
      AI
    </div>
  )
}

function formatMessage(content: string): string {
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-neon-blue underline">$1</a>'
    )
    .replace(/\n/g, '<br/>')
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-2', isUser && 'flex-row-reverse')}>
      {!isUser && <BotIcon />}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-neon-blue text-black rounded-tr-sm'
            : 'glass rounded-tl-sm text-foreground'
        )}
        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
      />
    </div>
  )
}

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Dinesh's AI assistant. Ask me anything about his projects, skills, or experience.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    setShowSuggestions(false)

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messagesRef.current, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const contentType = res.headers.get('content-type') ?? ''

      // ── Streaming response ──
      if (contentType.includes('text/plain') && res.body) {
        setLoading(false)
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + chunk }
            }
            return updated
          })
        }
      } else {
        // ── JSON fallback (rule-based) ──
        const data = await res.json()
        const content = typeof data.content === 'string' && data.content.trim()
          ? data.content
          : 'Sorry, I could not generate a response. Please try again.'
        setMessages((prev) => [...prev, { role: 'assistant', content }])
        setLoading(false)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again or email dineshgaikwad.skn.comp@gmail.com directly.' },
      ])
      setLoading(false)
    }
  }, [loading])

  // Listen for open-ai-assistant events dispatched by AIEntry section
  useEffect(() => {
    const handler = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail?.question
      setOpen(true)
      if (question) {
        setTimeout(() => sendMessage(question), 450)
      }
    }
    window.addEventListener('open-ai-assistant', handler)
    return () => window.removeEventListener('open-ai-assistant', handler)
  }, [sendMessage])

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full',
          'bg-gradient-to-br from-neon-blue to-neon-purple',
          'flex items-center justify-center text-black font-bold text-sm',
          'shadow-lg shadow-neon-blue/30 hover:shadow-neon-blue/50',
          'transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
          open && 'hidden'
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI assistant"
      >
        <span className="text-lg">AI</span>
        <span className="absolute inset-0 rounded-full animate-ping bg-neon-blue/20" aria-hidden="true" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col"
            style={{ height: '520px' }}
            role="dialog"
            aria-label="AI Assistant"
            aria-modal="true"
          >
            <div className="flex flex-col h-full glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <BotIcon />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dinesh&apos;s AI</p>
                    <p className="text-2xs text-neon-green flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-neon-green rounded-full inline-block" aria-hidden="true" />
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
                  aria-label="Close AI assistant"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}

                {loading && (
                  <div className="flex gap-2">
                    <BotIcon />
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-neon-blue rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {showSuggestions && messages.length === 1 && (
                  <div className="space-y-2">
                    <p className="text-2xs text-muted-foreground font-mono uppercase tracking-wider">Suggested</p>
                    {suggestedQuestions.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg glass hover:border-neon-blue/30 transition-all flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight size={12} className="text-neon-blue shrink-0" aria-hidden="true" />
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/10">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Dinesh..."
                    disabled={loading}
                    maxLength={500}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all disabled:opacity-50"
                    aria-label="Message input"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2 rounded-lg bg-neon-blue text-black hover:bg-neon-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
                    aria-label="Send message"
                  >
                    {loading
                      ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      : <Send size={16} aria-hidden="true" />
                    }
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
