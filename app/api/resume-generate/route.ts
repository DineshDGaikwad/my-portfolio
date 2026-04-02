import { NextRequest, NextResponse } from 'next/server'
import { parseResume } from '@/lib/resume/parser'
import { generateEnhancedResume } from '@/lib/resume/generator'
import type { AnalysisResult } from '@/lib/resume/analyzer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const originalText  = formData.get('originalText') as string
    const analysisRaw   = formData.get('analysis') as string
    const additionalInfo = (formData.get('additionalInfo') as string) || ''
    const refFile = formData.get('referenceFile') as File | null

    if (!originalText || !analysisRaw)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const analysis = JSON.parse(analysisRaw) as AnalysisResult

    let referenceText = ''
    if (refFile && refFile.size > 0) {
      if (refFile.size > MAX_SIZE)
        return NextResponse.json({ error: 'Reference file too large. Max 5MB.' }, { status: 400 })
      const buffer = Buffer.from(await refFile.arrayBuffer())
      const parsed = await parseResume(buffer, refFile.name)
      referenceText = parsed.text
    }

    const resume = await generateEnhancedResume(originalText, analysis, additionalInfo, referenceText)
    return NextResponse.json({ success: true, resume })
  } catch (err: any) {
    console.error('Resume generate error:', err)
    return NextResponse.json({ error: err.message ?? 'Generation failed. Please try again.' }, { status: 500 })
  }
}
