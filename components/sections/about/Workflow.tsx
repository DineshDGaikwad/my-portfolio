'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Layers, Code2, Zap, CheckCircle2, ChevronRight } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const steps = [
  {
    num: '01',
    icon: Search,
    label: 'Understand',
    sublabel: 'Define the real problem',
    duration: '~20%',
    color: '#00d4ff',
    description: 'Clarify requirements with stakeholders, map user flows, identify edge cases and system constraints before touching code. The goal is to solve the right problem, not just the stated one.',
    reasoning: 'Most bugs are requirements bugs. Spending time here prevents rework later — a misunderstood requirement costs 10x more to fix after code is written than before.',
    tags: ['Requirement docs', 'Stakeholder sync', 'User flow mapping', 'Edge case analysis', 'Constraint identification'],
  },
  {
    num: '02',
    icon: Layers,
    label: 'Design',
    sublabel: 'Architecture before code',
    duration: '~25%',
    color: '#7c3aed',
    description: 'Sketch system architecture, define DB schemas, plan API contracts and component hierarchy. Design for the next engineer who reads this — not just for today.',
    reasoning: 'Architecture decisions are the hardest to reverse. A 30-minute whiteboard session on schema design prevents weeks of migration pain. I design for change, not just for now.',
    tags: ['System design', 'DB schema', 'API contracts', 'Component tree', 'Data flow diagrams'],
  },
  {
    num: '03',
    icon: Code2,
    label: 'Build',
    sublabel: 'Readable, modular code',
    duration: '~40%',
    color: '#00ff88',
    description: 'Implement in small, testable increments using .NET, Angular, or React. Clean, readable code over clever code. Every function does one thing. Every module has a clear boundary.',
    reasoning: 'Code is read 10x more than it is written. I optimize for the reader, not the writer. SOLID principles and Clean Architecture are not overhead — they are the foundation that makes features fast to add.',
    tags: ['.NET 8', 'AngularJS', 'React', 'Clean Architecture', 'SOLID', 'Repository Pattern'],
  },
  {
    num: '04',
    icon: Zap,
    label: 'Optimize',
    sublabel: 'Measure, then improve',
    duration: '~10%',
    color: '#ff9900',
    description: 'Profile first, then fix real bottlenecks — query optimization, lazy loading, caching strategies. No premature optimization. Fix what the data says is slow, not what feels slow.',
    reasoning: 'Premature optimization is the root of all evil. I measure with profilers and query analyzers before touching anything. A composite index often beats a rewrite. Cache what is expensive, not everything.',
    tags: ['SQL query tuning', 'Composite indexes', 'Lazy loading', 'Response caching', 'Bundle analysis'],
  },
  {
    num: '05',
    icon: CheckCircle2,
    label: 'Ship',
    sublabel: 'Deploy with confidence',
    duration: '~5%',
    color: '#4ade80',
    description: 'Deploy via CI/CD pipelines, monitor with structured logs and alerts, iterate based on real usage. Shipping is not the end — it is the beginning of the feedback loop.',
    reasoning: 'A feature that is not in production has zero value. I automate deployment to remove fear from shipping. Monitoring is not optional — you cannot improve what you cannot observe.',
    tags: ['CI/CD pipelines', 'Azure DevOps', 'Structured logging', 'Alerting', 'Hotfix process'],
  },
]

export function Workflow() {
  const [active, setActive] = useState(0)
  const step = steps[active]

  return (
    <div className="mb-20">
      <div className="mb-8">
        <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Process</p>
        <h3 className="text-xl font-bold text-foreground">
          How I Think & Build
          <span className="block text-xs font-normal text-muted-foreground mt-1 font-mono">
            From requirement to production — click any step
          </span>
        </h3>
      </div>

      {/* Step tabs with connecting line */}
      <div className="relative mb-6">
        <div className="absolute top-5 left-0 right-0 h-px bg-white/[0.06] hidden md:block" aria-hidden="true" />
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 md:justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive = active === i
            const isPast = i < active
            return (
              <button
                key={s.label}
                onClick={() => setActive(i)}
                className={cn(
                  'relative flex flex-col items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all shrink-0',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
                  isActive ? 'text-foreground' : isPast ? 'text-muted-foreground/60' : 'text-muted-foreground/40 hover:text-muted-foreground'
                )}
                aria-pressed={isActive}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-background',
                    isActive ? 'scale-110' : ''
                  )}
                  style={{
                    color: isActive || isPast ? s.color : undefined,
                    borderColor: isActive ? s.color : isPast ? `${s.color}50` : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Icon size={15} aria-hidden="true" />
                </div>
                <span style={{ color: isActive ? s.color : undefined }}>{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-xl overflow-hidden"
          style={{ borderLeftColor: `${step.color}60`, borderLeftWidth: 2 }}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${step.color}15`, color: step.color }}
            >
              <step.icon size={22} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-mono text-muted-foreground/40">{step.num}</span>
                <h4 className="font-semibold text-foreground">{step.label}</h4>
                <span className="text-[10px] font-mono text-muted-foreground/50">— {step.sublabel}</span>
                <span
                  className="text-2xs font-mono px-2 py-0.5 rounded-full border ml-auto"
                  style={{ color: step.color, borderColor: `${step.color}30`, backgroundColor: `${step.color}10` }}
                >
                  {step.duration} of time
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>

          {/* Reasoning block */}
          <div
            className="mx-6 mb-4 rounded-lg px-4 py-3"
            style={{ backgroundColor: `${step.color}08`, borderLeft: `2px solid ${step.color}30` }}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: `${step.color}80` }}>
              Why this matters
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.reasoning}</p>
          </div>

          {/* Tags */}
          <div className="px-6 pb-5 flex flex-wrap gap-1.5">
            {step.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.07] text-muted-foreground/50 bg-white/[0.02]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Progress dots */}
          <div className="px-6 pb-4 flex items-center gap-1.5">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <button
                  onClick={() => setActive(i)}
                  className={cn('rounded-full transition-all duration-300', i === active ? 'w-4 h-2' : 'w-2 h-2')}
                  style={{ backgroundColor: i <= active ? s.color : 'rgba(255,255,255,0.12)' }}
                  aria-label={`Go to ${s.label}`}
                />
                {i < steps.length - 1 && (
                  <ChevronRight size={10} className="text-muted-foreground/20" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
