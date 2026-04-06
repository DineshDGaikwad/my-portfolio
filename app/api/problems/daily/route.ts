import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { DailyProblem } from '@/models/DailyProblem'

export const dynamic = 'force-dynamic'

function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) // 'YYYY-MM-DD'
}

export async function GET() {
  try {
    await connectDB()
    const today = todayIST()

    let daily = await DailyProblem.findOne({ date: today }).populate('problemId').lean()

    if (!daily) {
      // Auto-assign a random problem for today
      const count = await Problem.countDocuments()
      if (count === 0) return NextResponse.json({ error: 'No problems in database' }, { status: 404 })

      const random = await Problem.findOne().skip(Math.floor(Math.random() * count)).lean()
      if (!random) return NextResponse.json({ error: 'No problems found' }, { status: 404 })

      daily = await DailyProblem.create({ date: today, problemId: (random as any)._id })
      daily = await DailyProblem.findOne({ date: today }).populate('problemId').lean()
    }

    return NextResponse.json({ success: true, problem: (daily as any).problemId, date: today })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch daily problem' }, { status: 500 })
  }
}
