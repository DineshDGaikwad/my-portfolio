'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Loader2, Bot } from 'lucide-react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  messages: ChatMessage[]
  input: string
  loading: boolean
  onInputChange: (val: string) => void
  onSend: () => void
}

const SUGGESTIONS = [
  'Add more impact to my experience bullets',
  'Make my summary more compelling',
  'Add quantified metrics to achievements',
  'Strengthen my skills section',
  'Rewrite projects with better results',
]

export function ChatPanel({ messages, input, loading, onInputChange, onSend }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!loading && input.trim()) onSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
        <div className="w-7 h-7 rounded-full bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
          <Sparkles size={13} className="text-neon-purple" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Resume Editor</p>
          <p className="text-[10px] font-mono text-muted-foreground">Chat to update your resume in real-time</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-neon-green"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-neon-green">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={11} className="text-neon-purple" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                <p className="text-xs text-foreground leading-relaxed">
                  Your resume is ready! Tell me what you'd like to improve — I'll update it instantly.
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pl-8">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Try asking:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { onInputChange(s); inputRef.current?.focus() }}
                  className="block w-full text-left text-[11px] font-mono text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03] transition-all"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === 'user'
                  ? 'bg-neon-blue/10 border border-neon-blue/20'
                  : 'bg-neon-purple/10 border border-neon-purple/20'
              }`}>
                {msg.role === 'user'
                  ? <User size={11} className="text-neon-blue" />
                  : <Bot size={11} className="text-neon-purple" />
                }
              </div>
              <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-neon-blue/10 border border-neon-blue/20 text-foreground rounded-tr-sm'
                  : 'bg-white/[0.04] border border-white/[0.07] text-foreground rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <div className="w-6 h-6 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={11} className="text-neon-purple" />
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-3.5 py-3">
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="text-[10px] font-mono text-neon-purple"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  AI thinking
                </motion.span>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-neon-purple"
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-white/[0.07]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. Add more impact to my experience..."
            rows={2}
            disabled={loading}
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-purple/40 resize-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground/40 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
