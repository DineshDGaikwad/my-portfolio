import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { UserProgress } from '@/models/UserProgress'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB()
    const { userId } = params

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

    const progress = await UserProgress.find({ userId })
      .populate('problemId', 'slug title difficulty tags')
      .sort({ updatedAt: -1 })
      .lean()

    const stats = {
      total:    progress.length,
      solved:   progress.filter((p) => p.solved).length,
      attempts: progress.reduce((sum, p) => sum + p.attempts, 0),
    }

    return NextResponse.json({ success: true, progress, stats })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch progress' }, { status: 500 })
  }
}
