import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Instagram's private API is blocked on Vercel (session cookies expire + IP flagged).
// Hardcode your real counts here and update them manually when they change.
export async function GET() {
  return NextResponse.json({ followers: 320, following: 180 })
}
