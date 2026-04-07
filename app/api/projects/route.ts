import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { ProjectModel } from '@/models/Project'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const projects = await ProjectModel
      .find({}, '-caseStudy')
      .sort({ order: 1, year: -1 })
      .lean()
    return NextResponse.json({ success: true, projects })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch projects' }, { status: 500 })
  }
}
