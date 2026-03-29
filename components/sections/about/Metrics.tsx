'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { useCounter } from '@/hooks/useCounter'
import { metrics } from '@/data/skills'
import { Package, GraduationCap, Award, Zap } from '@/components/ui/Icons'
import { Metric } from '@/types'

const iconMap: Record<string, React.ElementType> = {
  '📦': Package,
  '🎓': GraduationCap,
  '☁️': Award,
  '🚀': Zap,
}

const colors = ['#00d4ff', '#7c3aed', '#ff9900', '#00ff88']

function MetricCard({ label, value, suffix, description, icon }: Metric & { colorIndex: number }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const count = useCounter(value, 1800, inView)
  const Icon = iconMap[icon] ?? Zap
  const display = label === 'CGPA' ? (count / 100).toFixed(2) : `${count}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-xl p-5 text-center hover:border-white/20 transition-all group"
      role="figure"
      aria-label={`${label}: ${display}${suffix}`}
    >
      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
        <Icon size={20} className="text-neon-blue" />
      </div>
      <div className="text-2xl font-bold font-mono text-foreground">{display}{suffix}</div>
      <div className="text-xs font-medium text-neon-blue mt-1">{label}</div>
      <div className="text-2xs text-muted-foreground mt-0.5">{description}</div>
    </motion.div>
  )
}

export function Metrics() {
  return (
    <div className="mb-20">
      <div className="mb-6">
        <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Numbers</p>
        <h3 className="text-xl font-bold text-foreground">Engineering Metrics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} colorIndex={i} />
        ))}
      </div>
    </div>
  )
}
