'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { MotionSection, MotionDiv, fadeUp } from '@/components/animations/motion'
import { skills } from '@/data/skills'
import { SkillCategory } from '@/types'
import { cn } from '@/lib/utils'
import { Activity } from '@/components/ui/Icons'

const categories: { key: SkillCategory | 'all'; label: string; color: string }[] = [
  { key: 'all',      label: 'All',      color: '#00d4ff' },
  { key: 'frontend', label: 'Frontend', color: '#61dafb' },
  { key: 'backend',  label: 'Backend',  color: '#009688' },
  { key: 'database', label: 'Database', color: '#47a248' },
  { key: 'devops',   label: 'DevOps',   color: '#f05032' },
  { key: 'cloud',    label: 'Cloud',    color: '#ff9900' },
  { key: 'ai-ml',    label: 'AI / ML',  color: '#7c3aed' },
]

const proficiencyLabel = (level: number) =>
  level >= 85 ? 'Expert' : level >= 75 ? 'Advanced' : level >= 65 ? 'Proficient' : 'Learning'

const proficiencyColor = (level: number) =>
  level >= 85 ? '#4ade80' : level >= 75 ? '#00d4ff' : level >= 65 ? '#facc15' : '#f87171'

function SkillCard({ name, level, color }: { name: string; level: number; color?: string }) {
  const c = color || '#00d4ff'
  const label = proficiencyLabel(level)
  const labelColor = proficiencyColor(level)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group glass rounded-xl p-4 hover:border-white/20 transition-all duration-200 relative overflow-hidden"
    >
      {/* Subtle color wash on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{ background: `radial-gradient(ellipse at top left, ${c}08, transparent 70%)` }}
      />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono text-foreground/90 font-medium">{name}</span>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
            style={{ color: labelColor, borderColor: `${labelColor}30`, backgroundColor: `${labelColor}10` }}
          >
            {label}
          </span>
        </div>

        {/* Bar */}
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: c,
              boxShadow: `0 0 8px ${c}60`,
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map((threshold) => (
              <div
                key={threshold}
                className="w-1 h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: level >= threshold ? c : 'rgba(255,255,255,0.1)',
                  boxShadow: level >= threshold ? `0 0 4px ${c}` : 'none',
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono" style={{ color: c }}>{level}%</span>
        </div>
      </div>
    </motion.div>
  )
}

// Scanning animation on first load
function ScanLine() {
  const [visible, setVisible] = useState(true)
  useEffect(() => { setTimeout(() => setVisible(false), 1800) }, [])
  if (!visible) return null
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-20"
      style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
      initial={{ top: 0, opacity: 1 }}
      animate={{ top: '100%', opacity: [1, 1, 0] }}
      transition={{ duration: 1.6, ease: 'linear' }}
    />
  )
}

export function SkillsSection() {
  const [active, setActive] = useState<SkillCategory | 'all'>('all')
  const [scanning, setScanning] = useState(true)

  useEffect(() => { setTimeout(() => setScanning(false), 1800) }, [])

  const filtered = active === 'all' ? skills : skills.filter((s) => s.category === active)
  const activeCat = categories.find((c) => c.key === active)!
  const expertCount = skills.filter((s) => s.level >= 85).length
  const avgLevel = Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length)

  return (
    <Section id="skills" className="bg-muted/10">
      <MotionSection>
        <SectionHeader
          command="scan_skills"
          description="Technologies I use to build production-grade software"
          status={scanning ? 'SCANNING...' : 'INDEXED'}
        />

        {/* ── Category tabs ── */}
        <MotionDiv variants={fadeUp} className="mb-8">
          {/* Tab bar — terminal style */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-white/[0.07] pb-0">
            {categories.map((cat) => {
              const count = cat.key === 'all' ? skills.length : skills.filter((s) => s.category === cat.key).length
              const isActive = active === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono whitespace-nowrap transition-all shrink-0',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue rounded-t-lg',
                    isActive
                      ? 'text-foreground bg-white/[0.04] border border-b-0 border-white/[0.08]'
                      : 'text-muted-foreground/50 hover:text-muted-foreground'
                  )}
                  aria-pressed={isActive}
                >
                  {/* Active dot */}
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
                    />
                  )}
                  {cat.label}
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-all',
                      isActive ? 'text-foreground/70' : 'text-muted-foreground/30'
                    )}
                    style={isActive ? { backgroundColor: `${cat.color}15`, color: cat.color } : {}}
                  >
                    {count}
                  </span>
                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ backgroundColor: cat.color }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </MotionDiv>

        {/* ── Skills grid ── */}
        <div className="relative">
          <ScanLine />
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
              role="list"
              aria-label={`${active} skills`}
            >
              {filtered.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  role="listitem"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SkillCard {...skill} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Stats footer ── */}
        <MotionDiv variants={fadeUp} className="mt-10">
          <div className="glass rounded-2xl p-5 border border-white/[0.07]">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={12} className="text-neon-blue" />
              <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Stack Overview</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/40">indexed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Skills',   value: skills.length,                                    suffix: '',   color: '#00d4ff' },
                { label: 'Expert Level',   value: expertCount,                                      suffix: '',   color: '#4ade80' },
                { label: 'Avg Proficiency',value: avgLevel,                                         suffix: '%',  color: '#facc15' },
                { label: 'Domains',        value: new Set(skills.map((s) => s.category)).size,      suffix: '',   color: '#7c3aed' },
              ].map(({ label, value, suffix, color }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold font-mono" style={{ color }}>{value}{suffix}</span>
                  <span className="text-[10px] text-muted-foreground/50 font-mono">{label}</span>
                  <div className="h-px bg-white/[0.05] rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((value / skills.length) * 100 * 3, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Category breakdown bar */}
            <div className="mt-5">
              <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-2">Distribution</p>
              <div className="flex h-2 rounded-full overflow-hidden gap-px">
                {categories.filter((c) => c.key !== 'all').map((cat) => {
                  const count = skills.filter((s) => s.category === cat.key).length
                  const pct   = (count / skills.length) * 100
                  return (
                    <motion.div
                      key={cat.key}
                      className="h-full first:rounded-l-full last:rounded-r-full"
                      style={{ backgroundColor: cat.color, width: `${pct}%` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      title={`${cat.label}: ${count}`}
                    />
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {categories.filter((c) => c.key !== 'all').map((cat) => {
                  const count = skills.filter((s) => s.category === cat.key).length
                  return (
                    <span key={cat.key} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/40">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.label} ({count})
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </MotionDiv>
      </MotionSection>
    </Section>
  )
}
