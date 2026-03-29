'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Layers, Code2, Zap, CheckCircle2, ChevronRight } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const steps = [
  {
    icon: Search,
    label: 'Understand',
    description: 'Clarify requirements with stakeholders, map user flows, identify edge cases and system constraints before touching code.',
    detail: 'Requirement docs · Stakeholder sync · Edge case mapping',
    color: '#00d4ff',
    duration: '~20%',
  },
  {
    icon: Layers,
    label: 'Design',
    description: 'Sketch architecture, define DB schemas, plan API contracts and component hierarchy. Design for the next engineer.',
    detail: 'System design · DB schema · API contracts · Component tree',
    color: '#7c3aed',
    duration: '~25%',
  },
  {
    icon: Code2,
    label: 'Build',
    description: 'Implement in small, testable increments using .NET, Angular or React. Clean, readable code over clever code.',
    detail: '.NET · Angular · React · Clean architecture · SOLID',
    color: '#00ff88',
    duration: '~40%',
  },
  {
    icon: Zap,
    label: 'Optimize',
    description: 'Profile first, then fix real bottlenecks — query optimization, lazy loading, caching. No premature optimization.',
    detail: 'SQL tuning · Lazy loading · Caching · Bundle analysis',
    color: '#ff9900',
    duration: '~10%',
  },
  {
    icon: CheckCircle2,
    label: 'Ship',
    description: 'Deploy via CI/CD pipelines, monitor with logs and alerts, iterate based on real usage and feedback.',
    detail: 'CI/CD · Azure DevOps · Monitoring · Hotfixes',
    color: '#4ade80',
    duration: '~5%',
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
          How I Work
          <span className="block text-xs font-normal text-muted-foreground mt-1 font-mono">
            From requirement to production
          </span>
        </h3>
      </div>

      {/* Timeline connector + step tabs */}
      <div className="relative mb-6">
        {/* Connecting line */}
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
                {/* Step circle */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-background',
                    isActive ? 'border-current scale-110' : isPast ? 'border-current/40' : 'border-white/10'
                  )}
                  style={{ color: isActive || isPast ? s.color : undefined, borderColor: isActive ? s.color : isPast ? `${s.color}50` : undefined }}
                >
                  <Icon size={15} aria-hidden="true" />
                </div>
                <span style={{ color: isActive ? s.color : undefined }}>{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active step detail */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-xl p-6"
        style={{ borderLeftColor: `${step.color}60`, borderLeftWidth: 2 }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${step.color}15`, color: step.color }}
          >
            <step.icon size={22} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h4 className="font-semibold text-foreground">{step.label}</h4>
              <span
                className="text-2xs font-mono px-2 py-0.5 rounded-full border"
                style={{ color: step.color, borderColor: `${step.color}30`, backgroundColor: `${step.color}10` }}
              >
                {step.duration} of time
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>
            {/* Detail tags */}
            <div className="flex flex-wrap gap-1.5">
              {step.detail.split(' · ').map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.07] text-muted-foreground/50 bg-white/[0.02]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center gap-1.5 mt-5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <button
                onClick={() => setActive(i)}
                className={cn('rounded-full transition-all duration-300', i === active ? 'w-4 h-2' : 'w-2 h-2')}
                style={{ backgroundColor: i <= active ? s.color : 'rgba(255,255,255,0.15)' }}
                aria-label={`Go to step ${s.label}`}
              />
              {i < steps.length - 1 && (
                <ChevronRight size={10} className="text-muted-foreground/20" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
