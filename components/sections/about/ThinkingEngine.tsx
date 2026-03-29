'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Layers, Code2, Zap, ChevronRight } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 'understand',
    icon: Search,
    label: 'Understand',
    sublabel: 'Define the real problem',
    color: '#00d4ff',
    detail: 'Before touching code, I ask: what is the actual problem? Not the stated one. I map user flows, identify edge cases, and clarify constraints. Most bugs are requirements misunderstood.',
    example: 'For Tesla Academy: the problem wasn\'t "build a course platform" — it was "how do admins manage content without breaking student progress?"',
  },
  {
    id: 'design',
    icon: Layers,
    label: 'Design',
    sublabel: 'Architecture before code',
    color: '#7c3aed',
    detail: 'I sketch data flow, identify bottlenecks, and choose the right abstractions. A bad architecture is 10× harder to fix than a bad implementation. I design for the failure modes that matter.',
    example: 'Chose MongoDB over SQL for Tesla Academy because course content schema is flexible and nested — SQL would require 5+ joins per dashboard load.',
  },
  {
    id: 'build',
    icon: Code2,
    label: 'Build',
    sublabel: 'Readable, modular code',
    color: '#00ff88',
    detail: 'I write code that the next engineer can understand without asking me. Functions do one thing. Names explain intent. Comments explain why, not what. I optimize for maintainability first.',
    example: 'FastAPI dependency injection for auth — every protected route uses `Depends(get_current_user)` instead of repeating auth logic.',
  },
  {
    id: 'optimize',
    icon: Zap,
    label: 'Optimize',
    sublabel: 'Measure, then improve',
    color: '#ff9900',
    detail: 'I don\'t optimize prematurely. I ship, measure, then fix the actual bottleneck. Caching, lazy loading, and query optimization are applied where profiling shows they matter.',
    example: 'Pre-signed S3 URLs eliminated the API as an upload proxy — reduced media upload latency by ~60% without changing the frontend.',
  },
]

export function ThinkingEngine() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="mb-20">
      <div className="mb-8">
        <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Process</p>
        <h3 className="text-xl font-bold text-foreground">
          How I Think
          <span className="block text-xs font-normal text-muted-foreground mt-1 font-mono">
            Click any step to see the reasoning
          </span>
        </h3>
      </div>

      {/* Flow steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = active === step.id
          return (
            <div key={step.id} className="flex items-stretch gap-2">
              <motion.button
                onClick={() => setActive(isActive ? null : step.id)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'flex-1 text-left glass rounded-xl p-4 transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
                  isActive ? 'border-white/20' : 'border-white/10 hover:border-white/15'
                )}
                style={isActive ? { boxShadow: `0 0 20px ${step.color}15` } : {}}
                aria-expanded={isActive}
                aria-label={`${step.label} — ${step.sublabel}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-transform"
                  style={{ backgroundColor: `${step.color}15`, color: step.color }}
                >
                  <Icon size={16} aria-hidden="true" />
                </div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-mono text-muted-foreground/50">{String(i + 1).padStart(2, '0')}</span>
                  <ChevronRight
                    size={12}
                    className={cn('transition-transform duration-200', isActive && 'rotate-90')}
                    style={{ color: step.color }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="text-2xs text-muted-foreground mt-0.5">{step.sublabel}</p>
              </motion.button>

              {/* Arrow connector — not after last */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center text-muted-foreground/20 shrink-0 -mx-1" aria-hidden="true">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (() => {
          const step = steps.find((s) => s.id === active)!
          return (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-xl p-5 border border-white/10"
              style={{ borderLeftColor: `${step.color}50`, borderLeftWidth: 2 }}
              role="region"
              aria-label={`${step.label} detail`}
            >
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: step.color }}>
                {step.label} — reasoning
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.detail}</p>
              <div className="rounded-lg p-3 bg-white/[0.03] border border-white/5">
                <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-1">Real example</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.example}</p>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
