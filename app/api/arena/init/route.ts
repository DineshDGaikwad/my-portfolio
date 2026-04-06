import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { DailyProblem } from '@/models/DailyProblem'
import { UserProgress } from '@/models/UserProgress'
import { ArenaUser } from '@/models/ArenaUser'

export const dynamic = 'force-dynamic'

function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') ?? ''
    const today  = todayIST()

    await connectDB()

    // All queries in parallel on the same connection
    const [allProblems, dailyDoc, progress, profile] = await Promise.all([
      // Full docs — needed for starterCode, description, examples, testCases
      Problem.find({}).lean(),

      DailyProblem.findOne({ date: today }).populate('problemId').lean(),

      userId
        ? UserProgress.find({ userId }, 'problemId solved attempts').lean()
        : Promise.resolve([]),

      userId
        ? ArenaUser.findOne({ userId }).lean()
        : Promise.resolve(null),
    ])

    // Resolve daily problem
    let dailyProblem: any = dailyDoc ? (dailyDoc as any).problemId : null

    // If no daily set yet, pick a random one and assign (fire-and-forget)
    if (!dailyProblem && allProblems.length > 0) {
      dailyProblem = allProblems[Math.floor(Math.random() * allProblems.length)]
      DailyProblem.create({ date: today, problemId: (dailyProblem as any)._id }).catch(() => {})
    }

    // Build a stripped list for the sidebar (no starterCode/testCases to keep payload small)
    const problemList = allProblems.map((p: any) => ({
      _id:       p._id,
      slug:      p.slug,
      title:     p.title,
      difficulty:p.difficulty,
      tags:      p.tags,
      isDaily:   p.isDaily,
      dailyDate: p.dailyDate,
    }))

    return NextResponse.json({
      success:  true,
      problems: problemList,       // sidebar list (stripped)
      daily:    dailyProblem,      // full problem doc
      progress: (progress as any[]).map(p => ({
        problemId: p.problemId?.toString() ?? String(p.problemId),
        solved:    p.solved,
        attempts:  p.attempts,
      })),
      profile: profile ?? null,
    })
  } catch (err: any) {
    console.error('[arena/init]', err)
    return NextResponse.json({ error: err.message ?? 'Init failed' }, { status: 500 })
  }
}
