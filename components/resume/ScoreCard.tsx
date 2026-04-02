'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  score: number
  breakdown: {
    formatting: number
    keywords: number
    experience: number
    education: number
    skills: number
  }
}

function Arc({ score }: { score: number }) {
  const SIZE = 180
  const CX = SIZE / 2
  const CY = SIZE / 2 + 10
  const R = 70
  const START = 200
  const SWEEP = 140

  const toRad = (d: number) => (d * Math.PI) / 180
  const arc = (start: number, sweep: number) => {
    const s = toRad(start)
    const e = toRad(start + sweep)
    const x1 = CX + R * Math.cos(s), y1 = CY + R * Math.sin(s)
    const x2 = CX + R * Math.cos(e), y2 = CY + R * Math.sin(e)
    return `M ${x1} ${y1} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2}`
  }

  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(t)
  }, [score])

  const valueSweep = (animated / 100) * SWEEP
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#00d4ff' : score >= 40 ? '#facc15' : '#f87171'

  return (
    <svg width={SIZE} height={SIZE * 0.75} viewBox={`0 0 ${SIZE} ${SIZE * 0.75}`}>
      <path d={arc(START, SWEEP)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} strokeLinecap="round" />
      <motion.path
        d={arc(START, Math.max(0.01, valueSweep))}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <text x={CX} y={CY - 8} textAnchor="middle" fontSize={32} fontWeight="700" fontFamily="monospace" fill={color}>
        {score}
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="rgba(255,255,255,0.4)">
        / 100
      </text>
    </svg>
  )
}

export function ScoreCard({ score, breakdown }: Props) {
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor'
  const labelColor = score >= 80 ? 'text-neon-green' : score >= 60 ? 'text-neon-blue' : score >= 40 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">ATS Score</p>

      <div className="flex flex-col items-center mb-6">
        <Arc score={score} />
        <span className={cn('text-sm font-mono font-bold mt-1', labelColor)}>{label}</span>
      </div>

      <div className="space-y-3">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground w-20 capitalize">{key}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', val >= 80 ? 'bg-neon-green' : val >= 60 ? 'bg-neon-blue' : val >= 40 ? 'bg-yellow-400' : 'bg-red-400')}
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
            <span className="text-[10px] font-mono text-foreground w-6 text-right">{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
