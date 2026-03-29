import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 })
  }

  const apiKey = process.env.OPENCAGE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&limit=1&no_annotations=1`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    const result = data.results?.[0]?.components

    if (!result) {
      return NextResponse.json({ error: 'No results' }, { status: 404 })
    }

    return NextResponse.json({
      city: result.city || result.town || result.village || result.county || '',
      state: result.state || '',
      country: result.country || '',
      countryCode: result.country_code?.toUpperCase() || '',
    })
  } catch (err) {
    console.error('Geocoding error:', err)
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
  }
}
