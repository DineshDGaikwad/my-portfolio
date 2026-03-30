import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Visitor } from '@/models/Visitor'

export const dynamic = 'force-dynamic'

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

async function getGeoFromIP(ip: string) {
  try {
    // ip-api.com — free, no key needed, 45 req/min
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=city,regionName,country,countryCode`, {
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const data = await res.json()
    if (data.status === 'fail') return {}
    return {
      city:        data.city        || '',
      region:      data.regionName  || '',
      country:     data.country     || '',
      countryCode: data.countryCode || '',
    }
  } catch {
    return {}
  }
}

// POST — called on each new visit, saves to MongoDB
export async function POST(req: NextRequest) {
  try {
    const ip        = getIP(req)
    const userAgent = req.headers.get('user-agent') || ''

    await connectDB()

    // Save immediately without waiting for geo — geo enriches async
    const doc = await Visitor.create({ ip, userAgent })
    getGeoFromIP(ip).then((geo) => {
      if (Object.keys(geo).length) Visitor.updateOne({ _id: doc._id }, { $set: geo }).catch(() => {})
    })

    const count = await Visitor.countDocuments()
    return NextResponse.json({ count })
  } catch (err) {
    console.error('Visitor POST error:', err)
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}

// GET — returns total visitor count
export async function GET() {
  try {
    await connectDB()
    const count = await Visitor.countDocuments()
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}
