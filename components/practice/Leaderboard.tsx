'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Target, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string | null
  avatarColor: string
  solved: number
  points: number
  streak: number
  bestStreak: number
}

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function getName(entry: LeaderboardEntry, isMe: boolean) {
  if (isMe) return 'You'
  return entry.displayName ?? `user_${entry.userId.split('_')[1] ?? entry.userId.slice(0, 6)}`
}

interface Props { currentUserId: string }

export function Leaderboard({ currentUserId }: Props) {
  const [board, setBoard]     = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { if (d.success) setBoard(d.leaderboard) })
      .finally(() => setLoading(false))
  }, [])

  const myEntry = board.find(e => e.userId === currentUserId)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-5 h-5 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
      </div>
    )
  }

  if (board.length === 0) {
    return (
      <div className="h-full flex items-center gap-3 px-4">
        <Crown size={24} className="text-muted-foreground/20 shrink-0" />
        <div>
          <p className="text-xs font-mono text-muted-foreground/50">No entries yet</p>
          <p className="text-[10px] font-mono text-muted-foreground/30 mt-0.5">Solve problems to appear on the leaderboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex items-stretch gap-3 px-4 py-3 overflow-hidden">

      {/* My rank card */}
      {myEntry && (
        <div className="shrink-0 flex flex-col justify-center gap-2 px-4 py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/25 min-w-[140px]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold shrink-0"
              style={{ backgroundColor: myEntry.avatarColor }}
            >
              {(myEntry.displayName ?? 'Y').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono font-semibold text-neon-blue truncate">{myEntry.displayName ?? 'You'}</p>
              <p className="text-[10px] font-mono text-muted-foreground">Rank #{myEntry.rank}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-mono text-neon-green">
              <Target size={9} /> {myEntry.solved}
            </span>
            {myEntry.streak > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-orange-400">
                <Flame size={9} /> {myEntry.streak}d
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-mono text-yellow-400 ml-auto">
              <Zap size={9} /> {myEntry.points}
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      {myEntry && <div className="w-px bg-white/[0.06] shrink-0 self-stretch" />}

      {/* Top entries — horizontal scroll */}
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 h-full">
          {board.slice(0, 10).map((entry, i) => {
            const isMe = entry.userId === currentUserId
            return (
              <motion.div key={entry.userId}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border shrink-0 min-w-[80px] transition-all',
                  isMe ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                )}
              >
                <span className="text-base leading-none">{RANK_MEDAL[entry.rank] ?? `#${entry.rank}`}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black shrink-0"
                  style={{ backgroundColor: entry.avatarColor }}
                >
                  {getName(entry, isMe).charAt(0).toUpperCase()}
                </div>
                <p className={cn('text-[10px] font-mono truncate max-w-[72px] text-center', isMe ? 'text-neon-blue font-semibold' : 'text-foreground')}>
                  {getName(entry, isMe)}
                </p>
                <div className="flex items-center gap-0.5">
                  <Zap size={8} className="text-yellow-400" />
                  <span className="text-[10px] font-bold font-mono text-yellow-400">{entry.points}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Points legend */}
      <div className="shrink-0 flex flex-col justify-end pb-0.5">
        <p className="text-[9px] font-mono text-muted-foreground/30 whitespace-nowrap">
          Easy 10 · Med 25 · Hard 50
        </p>
      </div>

    </div>
  )
}
