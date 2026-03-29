'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const dimensions = [
  {
    label: 'Thinking',
    before: { year: '2021', text: 'Write code that works', level: 28 },
    after:  { year: 'Now',  text: 'Design systems that scale and survive production', level: 85 },
    color: '#00d4ff',
  },
  {
    label: 'Stack',
    before: { year: '2021', text: 'HTML, CSS, basic JavaScript', level: 18 },
    after:  { year: 'Now',  text: '.NET · Angular · React · MongoDB · AWS · Docker', level: 82 },
    color: '#7c3aed',
  },
  {
    label: 'Process',
    before: { year: '2021', text: 'Code first, fix later', level: 22 },
    after:  { year: 'Now',  text: 'Understand → Design → Build → Optimize → Ship', level: 84 },
    color: '#00ff88',
  },
  {
    label: 'Mindset',
    before: { year: '2021', text: 'Make it work', level: 30 },
    after:  { year: 'Now',  text: 'Make it right, maintainable, and production-ready', level: 88 },
    color: '#ff9900',
  },
  {
    label: 'Collaboration',
    before: { year: '2021', text: 'Solo projects, self-taught', level: 25 },
    after:  { year: 'Now',  text: 'Enterprise teams, code reviews, stakeholder sync', level: 80 },
    color: '#f472b6',
  },
  {
    label: 'Ownership',
    before: { year: '2021', text: 'Complete assigned tasks', level: 35 },
    after:  { year: 'Now',  text: 'Own features end-to-end from design to deployment', level: 86 },
    color: '#4ade80',
  },
]

export function Evolution() {
  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Growth</p>
          <h3 className="text-xl font-bold text-foreground">
            Evolution
            <span className="block text-xs font-normal text-muted-foreground mt-1 font-mono">
              2021 → Now · from student to engineer
            </span>
          </h3>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/20" /> 2021
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-blue" /> Now
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {dimensions.map((dim, i) => (
          <motion.div
            key={dim.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-xl p-5 hover:border-white/20 transition-all group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                {dim.label}
              </span>
              <span
                className="text-2xs font-mono px-2 py-0.5 rounded-full border"
                style={{ color: dim.color, borderColor: `${dim.color}30`, backgroundColor: `${dim.color}10` }}
              >
                +{dim.after.level - dim.before.level}%
              </span>
            </div>

            {/* Before → After side by side */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-2.5">
                <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-1">2021</p>
                <p className="text-xs text-muted-foreground/70 leading-snug">{dim.before.text}</p>
              </div>
              <div
                className="rounded-lg p-2.5 border"
                style={{ backgroundColor: `${dim.color}08`, borderColor: `${dim.color}25` }}
              >
                <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: `${dim.color}80` }}>Now</p>
                <p className="text-xs text-foreground/90 leading-snug">{dim.after.text}</p>
              </div>
            </div>

            {/* Dual progress bar */}
            <div className="space-y-1.5">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/20"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${dim.before.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.06 }}
                />
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: dim.color, boxShadow: `0 0 8px ${dim.color}60` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${dim.after.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.06 + 0.15 }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-mono text-muted-foreground/30">{dim.before.level}%</span>
                <span className="text-[9px] font-mono" style={{ color: dim.color }}>{dim.after.level}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
