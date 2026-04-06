import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Problem } from '@/models/Problem'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const problems = await Problem.find({}, 'slug title difficulty tags isDaily dailyDate').lean()
    return NextResponse.json({ success: true, problems })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch problems' }, { status: 500 })
  }
}
