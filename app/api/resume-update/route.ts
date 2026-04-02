import { NextRequest, NextResponse } from 'next/server'
import { updateResumeWithChat } from '@/lib/resume/generator'
import type { GeneratedResume } from '@/lib/resume/generator'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { currentResume, instruction } = await req.json() as {
      currentResume: GeneratedResume
      instruction: string
    }

    if (!currentResume || !instruction?.trim())
      return NextResponse.json({ error: 'Missing resume or instruction' }, { status: 400 })

    const updated = await updateResumeWithChat(currentResume, instruction)
    return NextResponse.json({ success: true, resume: updated })
  } catch (err: any) {
    console.error('Resume update error:', err)
    return NextResponse.json({ error: err.message ?? 'Update failed. Please try again.' }, { status: 500 })
  }
}
