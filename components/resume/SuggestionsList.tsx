'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight, ChevronDown, Sparkles, Zap } from 'lucide-react'
import type { AnalysisResult } from '@/lib/resume/analyzer'

const ISSUE_LABELS: Record<string, string> = {
  'weak-bullet': 'Weak Bullet',
  'no-metrics': 'No Metrics',
  'repetition': 'Repetition',
  'too-long': 'Too Long',
  'missing-section': 'Missing Section',
}

const ISSUE_COLORS: Record<string, string> = {
  'weak-bullet': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'no-metrics': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'repetition': 'text-red-400 bg-red-400/10 border-red-400/20',
  'too-long': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'missing-section': 'text-red-400 bg-red-400/10 border-red-400/20',
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={14} className="text-neon-blue" />
          <span className="text-sm font-mono font-medium text-foreground">{title}</span>
        </div>
        <ChevronDown size={14} className={cn('text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/[0.06]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SuggestionsList({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-4">

      {/* Summary */}
      <div className="glass rounded-2xl p-5 border border-neon-blue/20 bg-neon-blue/[0.03]">
        <div className="flex items-start gap-3">
          <Sparkles size={16} className="text-neon-blue mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Strengths */}
      <Section title="Strengths" icon={CheckCircle2}>
        <ul className="mt-3 space-y-2">
          {analysis.strengths.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5 text-sm text-foreground/80"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 shrink-0" />
              {s}
            </motion.li>
          ))}
        </ul>
      </Section>

      {/* Skill Gap */}
      <Section title="Skill Gap Analysis" icon={Zap}>
        <div className="mt-3 space-y-4">
          <div>
            <p className="text-[10px] font-mono text-neon-green uppercase tracking-widest mb-2">Present</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillGap.present.map((s) => (
                <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-2">Missing</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillGap.missing.map((s) => (
                <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-400">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-2">Recommended to Add</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skillGap.recommended.map((s) => (
                <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Content Issues */}
      {analysis.contentIssues.length > 0 && (
        <Section title="Content Issues" icon={AlertCircle}>
          <div className="mt-3 space-y-3">
            {analysis.contentIssues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border', ISSUE_COLORS[issue.type])}>
                    {ISSUE_LABELS[issue.type]}
                  </span>
                </div>
                {issue.text && (
                  <p className="text-xs text-muted-foreground font-mono bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05] line-clamp-2">
                    "{issue.text}"
                  </p>
                )}
                <div className="flex items-start gap-2">
                  <Lightbulb size={11} className="text-neon-blue mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground/70">{issue.suggestion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Rewrites */}
      {analysis.rewrites.length > 0 && (
        <Section title="AI Rewrite Suggestions" icon={Sparkles}>
          <div className="mt-3 space-y-4">
            {analysis.rewrites.map((rw, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
              >
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Before</p>
                  <p className="text-xs text-muted-foreground bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">{rw.original}</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight size={14} className="text-neon-blue" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-neon-green uppercase tracking-widest">After</p>
                  <p className="text-xs text-foreground bg-neon-green/5 border border-neon-green/10 rounded-lg px-3 py-2">{rw.improved}</p>
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-mono border-t border-white/[0.05] pt-2">{rw.reason}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

    </div>
  )
}
