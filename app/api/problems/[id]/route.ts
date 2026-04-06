import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params

    const problem = mongoose.isValidObjectId(id)
      ? await Problem.findById(id).lean()
      : await Problem.findOne({ slug: id }).lean()

    if (!problem) return NextResponse.json({ error: 'Problem not found' }, { status: 404 })

    return NextResponse.json({ success: true, problem })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to fetch problem' }, { status: 500 })
  }
}
