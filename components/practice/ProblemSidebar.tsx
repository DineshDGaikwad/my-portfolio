'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, CheckCircle2, Circle, Search, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Problem } from './PracticePage'

const DIFF_DOT = { Easy: 'bg-neon-green', Medium: 'bg-yellow-400', Hard: 'bg-red-400' }
const DIFF_FILTER = ['All', 'Easy', 'Medium', 'Hard'] as const

interface Props {
  problems: Problem[]
  daily: Problem | null
  selected: Problem | null
  onSelect: (p: Problem) => void
  isSolved: (id: string) => boolean
}

export function ProblemSidebar({ problems, daily, selected, onSelect, isSolved }: Props) {
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [search, setSearch]   = useState('')

  const filtered = problems.filter(p => {
    const matchDiff   = filter === 'All' || p.difficulty === filter
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchDiff && matchSearch
  })

  const solvedCount = problems.filter(p => isSolved(p._id)).length

  return (
    <div className="relative h-full group/sidebar">
      {/* ── Collapsed rail (always visible) ── */}
      <div className="absolute inset-0 flex flex-col glass rounded-2xl border border-white/[0.06] overflow-hidden group-hover/sidebar:opacity-0 transition-opacity duration-200 pointer-events-none">
        <div className="flex flex-col items-center py-3 gap-1.5 px-1.5">
          <div className="w-7 h-7 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-1">
            <Code2 size={12} className="text-neon-blue" />
          </div>
          {/* Difficulty dots for each problem */}
          {problems.slice(0, 18).map(p => (
            <div key={p._id} title={p.title}
              className={cn('w-2 h-2 rounded-full shrink-0 transition-all', DIFF_DOT[p.difficulty],
                selected?._id === p._id ? 'scale-150 ring-1 ring-white/40' : 'opacity-60'
              )}
            />
          ))}
          {problems.length > 18 && (
            <span className="text-[9px] font-mono text-muted-foreground/50 mt-1">+{problems.length - 18}</span>
          )}
        </div>
        <div className="mt-auto px-1.5 pb-3 text-center">
          <span className="text-[9px] font-mono text-neon-green block">{solvedCount}</span>
          <span className="text-[8px] font-mono text-muted-foreground/40 block">done</span>
        </div>
      </div>

      {/* ── Expanded panel (on hover) ── */}
      <div className="absolute inset-0 flex flex-col glass rounded-2xl border border-neon-blue/20 overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 z-20 shadow-2xl shadow-neon-blue/10">
        {/* Header */}
        <div className="shrink-0 px-3 pt-3 pb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Problems</p>
            <span className="text-[10px] font-mono text-neon-green">{solvedCount}/{problems.length}</span>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-7 pr-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-blue/40 transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-1">
            {DIFF_FILTER.map(d => (
              <button key={d} onClick={() => setFilter(d)}
                className={cn('flex-1 text-[9px] font-mono py-1 rounded-lg border transition-all',
                  filter === d ? 'bg-neon-blue/15 border-neon-blue/30 text-neon-blue' : 'border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/20'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Daily */}
        {daily && (
          <div className="shrink-0 px-2 py-1.5 border-b border-white/[0.06]">
            <button onClick={() => onSelect(daily)}
              className={cn('w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border transition-all text-left',
                selected?._id === daily._id ? 'bg-neon-blue/10 border-neon-blue/30' : 'border-yellow-400/20 bg-yellow-400/5 hover:bg-yellow-400/10'
              )}
            >
              <Flame size={11} className="text-yellow-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-mono text-yellow-400 uppercase tracking-widest leading-none mb-0.5">Daily</p>
                <p className="text-[11px] font-medium text-foreground truncate">{daily.title}</p>
              </div>
              {isSolved(daily._id) && <CheckCircle2 size={10} className="text-neon-green shrink-0" />}
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-2 py-1.5 space-y-0.5">
          {filtered.length === 0 && (
            <p className="text-xs font-mono text-muted-foreground/50 text-center py-6">No problems found</p>
          )}
          {filtered.map((p, i) => (
            <motion.button key={p._id}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.015 }}
              onClick={() => onSelect(p)}
              className={cn('w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border transition-all text-left group',
                selected?._id === p._id ? 'bg-neon-blue/10 border-neon-blue/30' : 'border-transparent hover:border-white/[0.08] hover:bg-white/[0.03]'
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', DIFF_DOT[p.difficulty])} />
              <span className="flex-1 text-[11px] font-mono text-foreground truncate">{p.title}</span>
              {isSolved(p._id)
                ? <CheckCircle2 size={10} className="text-neon-green shrink-0" />
                : <Circle size={10} className="text-muted-foreground/20 shrink-0" />
              }
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
