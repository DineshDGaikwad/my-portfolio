'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight, ChevronDown, Sparkles, Zap, Rocket } from 'lucide-react'
import type { AnalysisResult } from '@/lib/resume/analyzer'

const ISSUE_LABELS: Record<string, string> = {
  'weak-bullet':       'Weak Bullet',
  'no-metrics':        'No Metrics',
  'repetition':        'Repetition',
  'too-long':          'Too Long',
  'missing-section':   'Missing Section',
  'passive-voice':     'Passive Voice',
  'vague-language':    'Vague Language',
}

const SEVERITY_COLORS: Record<string, string> = {
  high:   'text-red-400 bg-red-400/10 border-red-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  low:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
}

const VERDICT_STYLES: Record<string, string> = {
  'Strong':     'text-neon-green border-neon-green/30 bg-neon-green/10',
  'Good':       'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
  'Needs Work': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'Weak':       'text-red-400 border-red-400/30 bg-red-400/10',
}

function Section({ title, icon: Icon, children, defaultOpen = true, count }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  count?: number
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
          {count !== undefined && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.06] text-muted-foreground">{count}</span>
          )}
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
            <div className="px-5 pb-5 border-t border-white/[0.06]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SuggestionsList({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-4">

      {/* Summary + Verdict */}
      <div className="glass rounded-2xl p-5 border border-neon-blue/20 bg-neon-blue/[0.03]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Sparkles size={16} className="text-neon-blue mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/80 leading-relaxed">{analysis.summary}</p>
          </div>
          {analysis.overallVerdict && (
            <span className={cn('text-xs font-mono font-bold px-3 py-1.5 rounded-full border shrink-0', VERDICT_STYLES[analysis.overallVerdict])}>
              {analysis.overallVerdict}
            </span>
          )}
        </div>
      </div>

      {/* Quick Wins */}
      {analysis.quickWins?.length > 0 && (
        <Section title="Quick Wins" icon={Rocket} count={analysis.quickWins.length}>
          <ul className="mt-3 space-y-2">
            {analysis.quickWins.map((win, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 text-sm text-foreground/80"
              >
                <span className="text-[10px] font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/20 rounded-full px-1.5 py-0.5 shrink-0 mt-0.5">{i + 1}</span>
                {win}
              </motion.li>
            ))}
          </ul>
        </Section>
      )}

      {/* Strengths */}
      <Section title="Strengths" icon={CheckCircle2} count={analysis.strengths.length}>
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
          {analysis.skillGap.present.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-neon-green uppercase tracking-widest mb-2">✓ Present ({analysis.skillGap.present.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillGap.present.map((s) => (
                  <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green">{s}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.skillGap.missing.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-2">✗ Missing ({analysis.skillGap.missing.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillGap.missing.map((s) => (
                  <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-400">{s}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.skillGap.recommended.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-2">→ Natural Next Steps (based on your stack)</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillGap.recommended.map((s) => (
                  <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Content Issues */}
      {analysis.contentIssues.length > 0 && (
        <Section title="Content Issues" icon={AlertCircle} count={analysis.contentIssues.length}>
          <div className="mt-3 space-y-3">
            {analysis.contentIssues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border', SEVERITY_COLORS[issue.severity ?? 'medium'])}>
                    {issue.severity?.toUpperCase() ?? 'MEDIUM'}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/60 border border-white/10 px-2 py-0.5 rounded-full">
                    {ISSUE_LABELS[issue.type] ?? issue.type}
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

      {/* AI Rewrites */}
      {analysis.rewrites.length > 0 && (
        <Section title="AI Rewrite Suggestions" icon={Sparkles} count={analysis.rewrites.length}>
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
                <div className="border-t border-white/[0.05] pt-2 space-y-1">
                  <p className="text-[10px] text-muted-foreground/60 font-mono">Why: {rw.reason}</p>
                  {rw.impact && <p className="text-[10px] text-neon-blue/60 font-mono">Impact: {rw.impact}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

    </div>
  )
}
