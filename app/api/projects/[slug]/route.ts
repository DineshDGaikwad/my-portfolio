import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { ProjectModel } from '@/models/Project'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const project = await ProjectModel.findOne({ slug: params.slug }).lean()
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    return NextResponse.json({ success: true, project })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch project' }, { status: 500 })
  }
}
