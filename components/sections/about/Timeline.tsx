'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  timelineEntries,
  educationEntries,
  careerEntries,
  TimelineEntry,
  TimelineCategory,
} from '@/data/timeline'
import { ChevronRight, GraduationCap, Briefcase, Star, MapPin, Code2 } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

// ─── Config ───────────────────────────────────────────────────────────────────

const typeConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  'school':           { color: '#00d4ff', icon: GraduationCap, label: 'School'       },
  'higher-secondary': { color: '#7c3aed', icon: GraduationCap, label: 'HSC / JEE'    },
  'engineering':      { color: '#00d4ff', icon: GraduationCap, label: 'Engineering'  },
  'certification':    { color: '#ff9900', icon: Star,          label: 'Certification'},
  'project':          { color: '#00ff88', icon: Code2,         label: 'Project'      },
  'internship':       { color: '#ff9900', icon: Briefcase,     label: 'Internship'   },
  'full-time':        { color: '#00d4ff', icon: Briefcase,     label: 'Full-Time'    },
  'relocation':       { color: '#7c3aed', icon: MapPin,        label: 'Relocation'   },
}

// ─── Single node ──────────────────────────────────────────────────────────────

function TimelineNode({
  entry,
  index,
  isLast,
}: {
  entry: TimelineEntry
  index: number
  isLast: boolean
}) {
  const [open, setOpen] = useState(false)
  const cfg = typeConfig[entry.type] ?? typeConfig['school']
  const Icon = cfg.icon

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4"
    >
      {/* Spine */}
      <div className="flex flex-col items-center shrink-0">
        {/* Icon node — larger + glowing for milestones */}
        <div
          className={cn(
            'rounded-xl flex items-center justify-center z-10 shrink-0 transition-all',
            entry.isMilestone ? 'w-10 h-10' : 'w-8 h-8'
          )}
          style={{
            backgroundColor: `${cfg.color}18`,
            border: `${entry.isMilestone ? '2px' : '1.5px'} solid ${cfg.color}${entry.isMilestone ? '60' : '35'}`,
            boxShadow: entry.isMilestone ? `0 0 12px ${cfg.color}20` : undefined,
          }}
          aria-hidden="true"
        >
          <Icon size={entry.isMilestone ? 17 : 14} style={{ color: cfg.color }} />
        </div>
        {/* Connector */}
        {!isLast && (
          <div
            className="w-px flex-1 mt-1.5"
            style={{ background: `linear-gradient(to bottom, ${cfg.color}25, transparent)` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'w-full text-left rounded-xl p-4 transition-all group',
            'glass hover:border-white/20',
            entry.isMilestone && 'border-white/15'
          )}
          aria-expanded={open}
          aria-label={`${entry.title} at ${entry.organization} — click to ${open ? 'collapse' : 'expand'}`}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Type badge */}
              <span
                className="text-2xs font-mono px-2 py-0.5 rounded-full border mb-1.5 inline-block"
                style={{
                  color: cfg.color,
                  borderColor: `${cfg.color}30`,
                  backgroundColor: `${cfg.color}10`,
                }}
              >
                {cfg.label}
              </span>

              <h4 className={cn(
                'font-semibold text-foreground leading-tight',
                entry.isMilestone ? 'text-sm' : 'text-xs'
              )}>
                {entry.title}
              </h4>
              <p className="text-xs font-mono mt-0.5" style={{ color: cfg.color }}>
                {entry.organization}
              </p>

              {/* Highlight badge — key stat */}
              {entry.highlight && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-2xs font-mono text-foreground/70 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  <Star size={9} className="text-neon-blue" aria-hidden="true" />
                  {entry.highlight}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-2xs text-muted-foreground font-mono">{entry.period}</p>
                {entry.location && (
                  <p className="text-2xs text-muted-foreground/50 font-mono flex items-center gap-0.5 justify-end mt-0.5">
                    <MapPin size={9} aria-hidden="true" />
                    {entry.location}
                  </p>
                )}
              </div>
              <ChevronRight
                size={13}
                className={cn(
                  'text-muted-foreground transition-transform duration-200 shrink-0',
                  open && 'rotate-90'
                )}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  {/* Period + location on mobile */}
                  <p className="text-2xs text-muted-foreground font-mono sm:hidden">
                    {entry.period}{entry.location ? ` · ${entry.location}` : ''}
                  </p>

                  {entry.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {entry.description}
                    </p>
                  )}

                  {/* Achievements */}
                  {entry.achievements && entry.achievements.length > 0 && (
                    <div>
                      <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-2">
                        Highlights
                      </p>
                      <ul className="space-y-1.5">
                        {entry.achievements.map((a, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex gap-2">
                            <ChevronRight
                              size={10}
                              className="mt-0.5 shrink-0"
                              style={{ color: cfg.color }}
                              aria-hidden="true"
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What I learned */}
                  {entry.learned && (
                    <div
                      className="rounded-lg p-3 text-xs leading-relaxed"
                      style={{
                        backgroundColor: `${cfg.color}08`,
                        borderLeft: `2px solid ${cfg.color}40`,
                      }}
                    >
                      <span
                        className="font-mono text-2xs uppercase tracking-wider block mb-1"
                        style={{ color: cfg.color }}
                      >
                        What I learned
                      </span>
                      {entry.learned}
                    </div>
                  )}

                  {/* Tech stack */}
                  {entry.techStack && entry.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.techStack.map((t) => (
                        <span
                          key={t}
                          className="text-2xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.li>
  )
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({
  label,
  icon: Icon,
  color,
  entries,
}: {
  label: string
  icon: React.ElementType
  color: string
  entries: TimelineEntry[]
}) {
  return (
    <div>
      {/* Category header */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
          aria-hidden="true"
        >
          <Icon size={14} />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color }}>
          {label}
        </span>
        <div className="flex-1 h-px bg-white/5" aria-hidden="true" />
        <span className="text-2xs font-mono text-muted-foreground/40">{entries.length} entries</span>
      </div>

      <ol className="space-y-0" aria-label={`${label} timeline`}>
        {entries.map((entry, i) => (
          <TimelineNode
            key={entry.id}
            entry={entry}
            index={i}
            isLast={i === entries.length - 1}
          />
        ))}
      </ol>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type ViewMode = 'all' | 'education' | 'career'

export function Timeline() {
  const [view, setView] = useState<ViewMode>('all')

  const tabs: { key: ViewMode; label: string; count: number }[] = [
    { key: 'all',       label: 'All',       count: timelineEntries.length },
    { key: 'education', label: 'Education', count: educationEntries.length },
    { key: 'career',    label: 'Career',    count: careerEntries.length },
  ]

  return (
    <div className="mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Timeline</p>
          <h3 className="text-xl font-bold text-foreground">
            Journey &amp; Growth
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Click any milestone to expand details
          </p>
        </div>

        {/* View filter */}
        <div
          className="flex gap-1 glass rounded-xl p-1 self-start sm:self-auto"
          role="group"
          aria-label="Filter timeline by category"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
                view === tab.key
                  ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={view === tab.key}
            >
              {tab.label}
              <span className="text-2xs opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {view === 'all' ? (
            <div className="space-y-10">
              <CategorySection
                label="Education"
                icon={GraduationCap}
                color="#00d4ff"
                entries={educationEntries}
              />
              <CategorySection
                label="Career"
                icon={Briefcase}
                color="#00ff88"
                entries={careerEntries}
              />
            </div>
          ) : view === 'education' ? (
            <CategorySection
              label="Education"
              icon={GraduationCap}
              color="#00d4ff"
              entries={educationEntries}
            />
          ) : (
            <CategorySection
              label="Career"
              icon={Briefcase}
              color="#00ff88"
              entries={careerEntries}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
