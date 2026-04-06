import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { DailyProblem } from '@/models/DailyProblem'
import { UserProgress } from '@/models/UserProgress'
import { ArenaUser } from '@/models/ArenaUser'

export const dynamic    = 'force-dynamic'
export const maxDuration = 15

function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') ?? ''
    const today  = todayIST()

    await connectDB()

    // Parallel queries — sidebar list is stripped (no starterCode/testCases)
    const [problemList, dailyDoc, progress, profile] = await Promise.all([
      Problem.find({}, 'slug title difficulty tags isDaily dailyDate').lean(),
      DailyProblem.findOne({ date: today }).populate('problemId').lean(),
      userId ? UserProgress.find({ userId }, 'problemId solved attempts').lean() : Promise.resolve([]),
      userId ? ArenaUser.findOne({ userId }).lean() : Promise.resolve(null),
    ])

    // Resolve daily — already a full doc from populate
    let dailyProblem: any = dailyDoc ? (dailyDoc as any).problemId : null

    // Auto-assign daily if missing — fire-and-forget
    if (!dailyProblem && problemList.length > 0) {
      const random = problemList[Math.floor(Math.random() * problemList.length)] as any
      dailyProblem = random
      // Fetch full doc for the daily
      const full = await Problem.findById(random._id).lean()
      if (full) dailyProblem = full
      DailyProblem.create({ date: today, problemId: random._id }).catch(() => {})
    }

    return NextResponse.json({
      success:  true,
      problems: problemList,
      daily:    dailyProblem ?? null,
      progress: (progress as any[]).map(p => ({
        problemId: p.problemId?.toString() ?? String(p.problemId),
        solved:    p.solved,
        attempts:  p.attempts,
      })),
      profile: profile ?? null,
    })
  } catch (err: any) {
    console.error('[arena/init]', err.message)
    return NextResponse.json({ error: err.message ?? 'Init failed' }, { status: 500 })
  }
}
