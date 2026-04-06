import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { UserProgress } from '@/models/UserProgress'
import { Problem } from '@/models/Problem'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { userId, problemId, slug, solved, timeTaken, language, code } = await req.json()

    if (!userId || !problemId) {
      return NextResponse.json({ error: 'userId and problemId are required' }, { status: 400 })
    }

    const problem = await Problem.findById(problemId).lean()
    if (!problem) return NextResponse.json({ error: 'Problem not found' }, { status: 404 })

    const existing = await UserProgress.findOne({ userId, problemId })

    if (existing) {
      existing.attempts += 1
      existing.timeTaken = timeTaken ?? existing.timeTaken
      existing.language  = language  ?? existing.language
      existing.code      = code      ?? existing.code
      if (solved && !existing.solved) {
        existing.solved   = true
        existing.solvedAt = new Date()
      }
      await existing.save()
      return NextResponse.json({ success: true, progress: existing })
    }

    const progress = await UserProgress.create({
      userId, problemId,
      slug:      slug ?? (problem as any).slug,
      solved:    solved ?? false,
      timeTaken: timeTaken ?? 0,
      language:  language ?? 'javascript',
      code:      code ?? '',
      solvedAt:  solved ? new Date() : null,
    })

    return NextResponse.json({ success: true, progress })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to save progress' }, { status: 500 })
  }
}
