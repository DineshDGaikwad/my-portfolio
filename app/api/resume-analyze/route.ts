import { NextRequest, NextResponse } from 'next/server'
import { parseResume } from '@/lib/resume/parser'
import { analyzeResume } from '@/lib/resume/analyzer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const VALID_ROLES = ['Backend Developer', 'Full Stack Developer', 'SDE']

// Simple in-memory rate limit: max 10 requests per IP per 10 minutes
const rateMap = new Map<string, { count: number; reset: number }>()

function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 10 * 60 * 1000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!checkRate(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again in 10 minutes.' }, { status: 429 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const role = formData.get('role') as string | null

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (!role || !VALID_ROLES.includes(role))
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 })
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: 'File too large. Max 5MB allowed.' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: 'Only PDF and DOCX files are supported.' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = await parseResume(buffer, file.name)

    if (parsed.wordCount < 50)
      return NextResponse.json({ error: 'Resume too short to analyze. Please upload a complete resume.' }, { status: 400 })

    const analysis = await analyzeResume(parsed.text, role)
    return NextResponse.json({ success: true, analysis, meta: { wordCount: parsed.wordCount, fileType: parsed.fileType } })
  } catch (err: any) {
    console.error('Resume analyze error:', err)
    if (err.message?.includes('JSON')) {
      return NextResponse.json({ error: 'AI returned invalid response. Please try again.' }, { status: 500 })
    }
    return NextResponse.json({ error: err.message ?? 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
