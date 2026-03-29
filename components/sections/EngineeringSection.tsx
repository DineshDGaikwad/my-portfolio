'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Code2, Layers, Zap, ChevronRight } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const DatabaseDiagram = dynamic(
  () => import('@/components/architecture/DatabaseDiagram').then((m) => ({ default: m.DatabaseDiagram })),
  {
    ssr: false,
    loading: () => (
      <div className="glass rounded-2xl h-64 animate-pulse flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-mono">Loading schema explorer...</span>
      </div>
    ),
  }
)

const SystemDesignEngine = dynamic(
  () => import('./SystemDesignEngine').then((m) => ({ default: m.SystemDesignEngine })),
  {
    ssr: false,
    loading: () => (
      <div className="glass rounded-2xl h-64 animate-pulse flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-mono">Loading architecture engine...</span>
      </div>
    ),
  }
)

const principles = [
  {
    icon: Layers,
    title: 'Architecture First',
    description: 'Before writing a line of code, I map data flow, identify bottlenecks, and design for the failure modes that matter.',
    example: 'At KANINI: designed the module boundary between .NET services before implementation — prevented 3 circular dependency issues caught in review.',
    metric: { label: 'Design time saved', value: '~40%' },
    tags: ['.NET', 'System Design', 'API Contracts'],
    color: '#00d4ff',
  },
  {
    icon: Zap,
    title: 'Performance by Default',
    description: 'Lazy loading, caching strategies, and query optimization are not afterthoughts — they are built into the initial design.',
    example: 'Pre-signed S3 URLs removed the API as an upload proxy — reduced media upload latency by ~60% without touching the frontend.',
    metric: { label: 'Latency reduced', value: '~60%' },
    tags: ['SQL Tuning', 'Caching', 'Lazy Loading'],
    color: '#00ff88',
  },
  {
    icon: Code2,
    title: 'Readable over Clever',
    description: 'Code is read 10× more than it is written. I optimize for the next engineer, not the compiler.',
    example: 'FastAPI dependency injection for auth — every protected route uses Depends(get_current_user) instead of repeating auth logic across 20+ endpoints.',
    metric: { label: 'Code reuse', value: '10×' },
    tags: ['Clean Code', 'SOLID', 'DRY'],
    color: '#7c3aed',
  },
]

function PrincipleCard({ principle: p, index }: { principle: typeof principles[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-xl overflow-hidden h-full flex flex-col hover:border-white/20 transition-all cursor-pointer group"
      style={{ borderLeft: `2px solid ${p.color}40` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500/50" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <span className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/40 ml-1">
          principle_{String(index + 1).padStart(2, '0')}.ts
        </span>
        <div className="ml-auto">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
            style={{ color: p.color, borderColor: `${p.color}30`, backgroundColor: `${p.color}10` }}
          >
            {p.metric.value}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${p.color}15`, color: p.color }}
        >
          <p.icon size={18} aria-hidden="true" />
        </div>

        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">{p.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.07] text-muted-foreground/50 bg-white/[0.02]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          className="flex items-center gap-1 text-[10px] font-mono mt-auto w-fit transition-colors"
          style={{ color: expanded ? p.color : 'rgba(255,255,255,0.3)' }}
          aria-expanded={expanded}
        >
          <ChevronRight size={10} className={cn('transition-transform duration-200', expanded && 'rotate-90')} />
          {expanded ? 'hide example' : 'real example'}
        </button>

        {/* Expandable example */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                className="rounded-lg p-3 border text-xs text-muted-foreground leading-relaxed font-mono"
                style={{ backgroundColor: `${p.color}06`, borderColor: `${p.color}20` }}
              >
                <span style={{ color: p.color }} className="text-[10px] uppercase tracking-widest block mb-1">
                  // real example
                </span>
                {p.example}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom metric bar */}
      <div
        className="px-5 py-2.5 border-t border-white/[0.06] flex items-center justify-between"
        style={{ backgroundColor: `${p.color}05` }}
      >
        <span className="text-[10px] font-mono text-muted-foreground/40">{p.metric.label}</span>
        <span className="text-[10px] font-mono font-bold" style={{ color: p.color }}>{p.metric.value}</span>
      </div>
    </motion.div>
  )
}

export function EngineeringSection() {
  return (
    <Section id="engineering" className="bg-muted/5">
      <SectionHeader
        command="analyze_systems"
        description="Architecture decisions, tradeoffs, and the reasoning behind real systems"
        status="RUNNING"
      />

      {/* Principles */}
      <div className="grid md:grid-cols-3 gap-4 mb-16">
        {principles.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.1}>
            <PrincipleCard principle={p} index={i} />
          </ScrollReveal>
        ))}
      </div>

      {/* System Design Engine */}
      <ScrollReveal>
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Interactive</p>
              <h3 className="text-lg font-bold text-foreground">System Design Explorer</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Real architecture diagrams from my projects — click nodes to inspect decisions, simulate request flows, compare designs side by side.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              {[
                { color: '#00d4ff', text: 'Click nodes — inspect tech decisions' },
                { color: '#00ff88', text: 'Simulate — watch live request flows' },
                { color: '#7c3aed', text: 'Compare — diff two architectures' },
                { color: '#ff9900', text: 'DB Schema — explore ER diagrams' },
              ].map(({ color, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-[11px] font-mono text-muted-foreground/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SystemDesignEngine />
      </ScrollReveal>

      {/* Database Schema Explorer */}
      <ScrollReveal delay={0.1}>
        <div className="mt-16 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Interactive</p>
              <h3 className="text-lg font-bold text-foreground">Database Schema Explorer</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Real ER diagrams from every project — drag tables, click to inspect columns, hover to trace foreign key relationships.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              {[
                { color: '#fbbf24', text: 'PK — Primary key columns' },
                { color: '#00d4ff', text: 'FK — Foreign key relationships' },
                { color: '#a78bfa', text: 'UQ — Unique constraints' },
                { color: '#34d399', text: 'IDX — Indexed columns' },
              ].map(({ color, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-[11px] font-mono text-muted-foreground/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DatabaseDiagram />
      </ScrollReveal>
    </Section>
  )
}
