'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProgressEntry } from './PracticePage'

interface Props { userId: string; progress: ProgressEntry[] }

function buildGrid(solvedDates: string[]) {
  const today = new Date()
  const cells: { date: string; count: number }[] = []
  for (let i = 62; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    cells.push({ date: key, count: solvedDates.filter(s => s === key).length })
  }
  return cells
}

function calcStreak(dates: string[]) {
  const unique = Array.from(new Set(dates)).sort()
  if (!unique.length) return { current: 0, best: 0 }
  let best = 1, cur = 1
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i]).getTime() - new Date(unique[i - 1]).getTime()) / 86400000
    cur = diff === 1 ? cur + 1 : 1
    best = Math.max(best, cur)
  }
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const gap = (new Date(today).getTime() - new Date(unique[unique.length - 1]).getTime()) / 86400000
  return { current: gap <= 1 ? cur : 0, best }
}

export function StreakPanel({ userId, progress }: Props) {
  const solvedDates = useMemo(() =>
    progress.filter(p => p.solved).map(() =>
      new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    ), [progress])

  const grid   = useMemo(() => buildGrid(solvedDates), [solvedDates])
  const { current, best } = useMemo(() => calcStreak(solvedDates), [solvedDates])
  const totalSolved   = progress.filter(p => p.solved).length
  const totalAttempts = progress.reduce((s, p) => s + p.attempts, 0)

  // 63 cells → 9 weeks of 7
  const weeks: typeof grid[] = []
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7))

  const cellColor = (count: number) => {
    if (count === 0) return 'bg-white/[0.04] border-white/[0.06]'
    if (count === 1) return 'bg-neon-green/25 border-neon-green/30'
    if (count === 2) return 'bg-neon-green/50 border-neon-green/50'
    return 'bg-neon-green border-neon-green/80'
  }

  const stats = [
    { icon: Flame,      label: 'Streak',    value: `${current}d`, color: 'text-orange-400' },
    { icon: Trophy,     label: 'Best',      value: `${best}d`,    color: 'text-yellow-400' },
    { icon: Target,     label: 'Solved',    value: totalSolved,   color: 'text-neon-green'  },
    { icon: TrendingUp, label: 'Attempts',  value: totalAttempts, color: 'text-neon-blue'   },
  ]

  return (
    <div className="h-full overflow-y-auto scrollbar-none px-4 py-3">
      <div className="flex items-start gap-6 h-full">

        {/* Stats — 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 min-w-[80px]">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={10} className={color} />
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
              </div>
              <p className={cn('text-xl font-bold font-mono leading-none', color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* Activity grid */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Last 9 Weeks</p>
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell, di) => (
                  <motion.div key={cell.date}
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.003 }}
                    title={`${cell.date}: ${cell.count} solved`}
                    className={cn('w-3.5 h-3.5 rounded-sm border transition-all cursor-default', cellColor(cell.count))}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[9px] font-mono text-muted-foreground/40">Less</span>
            {[0, 1, 2, 3].map(n => <div key={n} className={cn('w-2.5 h-2.5 rounded-sm border', cellColor(n))} />)}
            <span className="text-[9px] font-mono text-muted-foreground/40">More</span>
          </div>
        </div>

        {/* Streak status */}
        <div className="shrink-0 flex flex-col items-center justify-center gap-1 text-center min-w-[80px]">
          <span className="text-3xl">{current > 0 ? '🔥' : '💪'}</span>
          <p className="text-xs font-mono text-foreground font-semibold">
            {current > 0 ? `${current} day streak` : 'No streak yet'}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/50 leading-tight">
            {current > 0 ? 'Keep it going!' : 'Solve to start'}
          </p>
        </div>

      </div>
    </div>
  )
}
