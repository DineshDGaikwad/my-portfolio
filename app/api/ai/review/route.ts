import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { connectDB } from '@/lib/mongodb'
import { UserProgress } from '@/models/UserProgress'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { userId, problemId, code, language, problemTitle, problemDescription } = await req.json()

    if (!code?.trim()) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })

    const ALLOWED_LANGS = new Set(['javascript', 'typescript', 'python', 'java', 'cpp', 'go'])
    const safeLanguage = ALLOWED_LANGS.has(language) ? language : 'code'
    const safeTitle    = String(problemTitle ?? 'Unknown').slice(0, 200).replace(/[\x00-\x1f\x7f]/g, '')
    const safeDesc     = String(problemDescription ?? 'N/A').slice(0, 1000).replace(/[\x00-\x1f\x7f]/g, '')
    const safeCode     = code.slice(0, 3000)

    const groq = new Groq({ apiKey })

    const prompt = `You are an expert software engineer and coding interview coach. Review the following ${safeLanguage} solution for the problem "${safeTitle}".

PROBLEM:
${safeDesc}

SUBMITTED CODE (${safeLanguage}):
\`\`\`${safeLanguage}
${safeCode}
\`\`\`

Provide a concise review covering:
1. **Correctness** — Does it solve the problem? Edge cases missed?
2. **Time Complexity** — Big-O analysis
3. **Space Complexity** — Big-O analysis
4. **Code Quality** — Readability, naming, structure
5. **Improvements** — 2-3 specific suggestions to make it better

Keep the review under 300 words. Be direct and actionable.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    })

    const review = completion.choices?.[0]?.message?.content ?? 'No review generated.'

    if (userId && problemId) {
      await connectDB()
      await UserProgress.findOneAndUpdate(
        { userId, problemId },
        { aiReview: review },
        { upsert: false }
      )
    }

    return NextResponse.json({ success: true, review })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'AI review failed' }, { status: 500 })
  }
}
