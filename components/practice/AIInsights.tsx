'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Bot, Lightbulb, CheckCircle2, Clock, Code2, TrendingUp } from 'lucide-react'
import type { Problem } from './PracticePage'

interface Props {
  review: string
  loading: boolean
  problem: Problem | null
}

function ReviewContent({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1.5 text-xs text-foreground/80 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return null
        const headerMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*(.*)/)
        if (headerMatch) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/20 rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                {headerMatch[1]}
              </span>
              <div>
                <span className="font-semibold text-foreground">{headerMatch[2]}</span>
                {headerMatch[3] && <span className="text-foreground/70">{headerMatch[3]}</span>}
              </div>
            </div>
          )
        }
        const parts = line.split(/\*\*(.+?)\*\*/)
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} className="text-foreground font-semibold">{part}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        )
      })}
    </div>
  )
}

export function AIInsights({ review, loading, problem }: Props) {
  return (
    <div className="h-full overflow-y-auto scrollbar-none px-4 py-3">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-4 h-full"
          >
            <div className="relative w-10 h-10 shrink-0">
              {[0, 1].map(i => (
                <motion.div key={i} className="absolute inset-0 rounded-full border border-neon-purple/30"
                  animate={{ scale: [1, 1.6 + i * 0.2], opacity: [0.5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot size={16} className="text-neon-purple" />
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-foreground">Analyzing your code...</p>
              <motion.p className="text-[10px] font-mono text-neon-purple mt-0.5"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
              >
                Checking complexity, correctness & style
              </motion.p>
            </div>
          </motion.div>
        ) : review ? (
          <motion.div key="review" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ReviewContent text={review} />
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!problem ? (
              <div className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0">
                  <Lightbulb size={16} className="text-neon-purple/60" />
                </div>
                <p className="text-xs font-mono text-muted-foreground/60">Select a problem to get started</p>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={15} className="text-neon-purple/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-foreground mb-2">Write your solution, then click <span className="text-neon-purple">AI Review</span></p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { icon: CheckCircle2, label: 'Correctness & edge cases' },
                      { icon: Clock,        label: 'Time & space complexity'  },
                      { icon: Code2,        label: 'Code quality & style'     },
                      { icon: TrendingUp,   label: 'Improvement suggestions'  },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/60">
                        <Icon size={10} className="text-neon-purple/50 shrink-0" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
