import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

let cache: { followers: number; following: number; ts: number } | null = null
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ followers: cache.followers, following: cache.following })
  }

  const sessionId = process.env.INSTAGRAM_SESSION_ID
  if (!sessionId) {
    return NextResponse.json({ error: 'INSTAGRAM_SESSION_ID not set' }, { status: 500 })
  }

  try {
    const res = await fetch(
      'https://i.instagram.com/api/v1/users/web_profile_info/?username=dinesh._.gaikwad',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Referer': 'https://www.instagram.com/',
          'x-ig-app-id': '936619743392459',
          'Cookie': `sessionid=${sessionId}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) throw new Error(`Instagram responded ${res.status}`)

    const data = await res.json()
    const user = data?.data?.user
    const followers: number = user?.edge_followed_by?.count ?? null
    const following: number = user?.edge_follow?.count ?? null

    if (followers === null || following === null) throw new Error('Counts not found in response')

    cache = { followers, following, ts: Date.now() }
    return NextResponse.json({ followers, following })
  } catch (err) {
    console.error('Instagram route error:', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
