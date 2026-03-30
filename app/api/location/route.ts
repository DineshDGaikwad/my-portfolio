import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 })
  }

  try {
    // BigDataCloud — free, no API key needed, 10k req/day
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { cache: 'no-store' }
    )
    if (!res.ok) throw new Error(`BigDataCloud responded ${res.status}`)
    const data = await res.json()

    return NextResponse.json({
      city: data.city || data.locality || data.principalSubdivision || '',
      state: data.principalSubdivision || '',
      country: data.countryName || '',
      countryCode: data.countryCode || '',
    })
  } catch (err) {
    console.error('Geocoding error:', err)
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
  }
}
