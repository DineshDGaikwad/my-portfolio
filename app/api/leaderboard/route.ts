import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { UserProgress } from '@/models/UserProgress'
import { ArenaUser } from '@/models/ArenaUser'

export const dynamic = 'force-dynamic'

const DIFFICULTY_POINTS: Record<string, number> = { Easy: 10, Medium: 25, Hard: 50 }

export async function GET() {
  try {
    await connectDB()

    const rows = await UserProgress.find({ solved: true })
      .populate('problemId', 'difficulty title')
      .lean()

    const map = new Map<string, { solved: number; points: number; dates: string[] }>()

    for (const r of rows) {
      const uid  = r.userId
      const diff = (r.problemId as any)?.difficulty ?? 'Easy'
      const pts  = DIFFICULTY_POINTS[diff] ?? 10
      const date = r.solvedAt
        ? new Date(r.solvedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
        : null

      if (!map.has(uid)) map.set(uid, { solved: 0, points: 0, dates: [] })
      const entry = map.get(uid)!
      entry.solved++
      entry.points += pts
      if (date) entry.dates.push(date)
    }

    const calcStreak = (dates: string[]) => {
      const unique = Array.from(new Set(dates)).sort()
      if (!unique.length) return { current: 0, best: 0 }
      let best = 1, cur = 1
      for (let i = 1; i < unique.length; i++) {
        const diff = (new Date(unique[i]).getTime() - new Date(unique[i - 1]).getTime()) / 86400000
        cur = diff === 1 ? cur + 1 : 1
        best = Math.max(best, cur)
      }
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
      const gap   = (new Date(today).getTime() - new Date(unique[unique.length - 1]).getTime()) / 86400000
      return { current: gap <= 1 ? cur : 0, best }
    }

    const userIds = Array.from(map.keys())
    const profiles = await ArenaUser.find({ userId: { $in: userIds } }).lean()
    const profileMap = new Map(profiles.map(p => [p.userId, p]))

    const leaderboard = Array.from(map.entries())
      .map(([userId, data]) => {
        const { current, best } = calcStreak(data.dates)
        const profile = profileMap.get(userId)
        return {
          userId,
          displayName:  profile?.displayName ?? null,
          avatarColor:  (profile as any)?.avatarColor ?? '#00d4ff',
          solved:       data.solved,
          points:       data.points,
          streak:       current,
          bestStreak:   best,
        }
      })
      .sort((a, b) => b.points - a.points || b.solved - a.solved)
      .slice(0, 20)
      .map((entry, i) => ({ ...entry, rank: i + 1 }))

    return NextResponse.json({ success: true, leaderboard })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
