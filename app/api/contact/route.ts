import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Contact } from '@/models/Contact'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = { name: 100, email: 254, subject: 200, message: 5000 }

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    if (typeof name !== 'string' || typeof email !== 'string' ||
        typeof subject !== 'string' || typeof message !== 'string')
      return NextResponse.json({ error: 'Invalid field types' }, { status: 400 })

    if (name.length > LIMITS.name)       return NextResponse.json({ error: 'Name too long' }, { status: 400 })
    if (email.length > LIMITS.email)     return NextResponse.json({ error: 'Email too long' }, { status: 400 })
    if (subject.length > LIMITS.subject) return NextResponse.json({ error: 'Subject too long' }, { status: 400 })
    if (message.length > LIMITS.message) return NextResponse.json({ error: 'Message too long' }, { status: 400 })

    if (!EMAIL_REGEX.test(email))
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })

    await connectDB()
    await Contact.create({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim() })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
