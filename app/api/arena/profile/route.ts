import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { ArenaUser } from '@/models/ArenaUser'

export const dynamic = 'force-dynamic'

const AVATAR_COLORS = ['#00d4ff', '#7c3aed', '#00ff88', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16']

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    await connectDB()
    const user = await ArenaUser.findOne({ userId }).lean()
    return NextResponse.json({ success: true, user: user ?? null })
  } catch (err: any) {
    console.error('[arena/profile GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, displayName } = body

    if (!userId?.trim() || !displayName?.trim()) {
      return NextResponse.json({ error: 'userId and displayName are required' }, { status: 400 })
    }

    const ip          = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

    await connectDB()

    // Check if user already has an avatarColor — don't overwrite it on update
    const existing = await ArenaUser.findOne({ userId }).lean() as any

    const user = await ArenaUser.findOneAndUpdate(
      { userId },
      {
        displayName:  displayName.trim().slice(0, 30),
        ip,
        avatarColor:  existing?.avatarColor ?? avatarColor,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ).lean()

    return NextResponse.json({ success: true, user })
  } catch (err: any) {
    console.error('[arena/profile POST]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
