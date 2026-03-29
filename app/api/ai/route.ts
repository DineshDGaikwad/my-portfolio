import { NextRequest, NextResponse } from 'next/server'
import { portfolioContext } from '@/ai/lib/context'

export const runtime = 'edge'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── Updated rule-based fallback ─────────────────────────────────────────────
function getRuleBasedResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hi! I'm Dinesh's AI assistant. Ask me about his projects, skills, experience at KANINI, or anything else on his portfolio."
  }
  if (q.includes('kanini') || q.includes('current') || q.includes('working') || q.includes('job')) {
    return "Dinesh is a **Software Engineer at KANINI**, Pune (Feb 2026 – Present). He was previously an intern at KANINI Bangalore (May 2025 – Jan 2026) where he built 4 enterprise systems using **.NET 8, Angular, and MS SQL Server**."
  }
  if (q.includes('booknow') || q.includes('booking')) {
    return "**BookNow** is a BookMyShow-style appointment platform built at KANINI. It uses **.NET 8 + Angular + MS SQL Server** with row-level SQL locking to prevent double-booking, a waitlist engine, payment gateway (Razorpay/Stripe), and 3 roles: Admin, Customer, Provider."
  }
  if (q.includes('property') || q.includes('registry')) {
    return "**Property Registry Portal** is a government-style system built at KANINI for property ownership transfers. It features a multi-step approval workflow (Citizen → Officer → Admin), a state machine pattern, immutable audit trail, and fraud detection — built with **.NET 8 + Angular + MS SQL Server**."
  }
  if (q.includes('ticket') || q.includes('kanban') || q.includes('jira')) {
    return "**Ticket Raising Platform** is a Jira-like issue tracker built at KANINI. It has a Kanban board with drag-drop, server-side workflow validation, optimistic concurrency control (RowVersion tokens), and threaded comments — built with **.NET 8 + Angular**."
  }
  if (q.includes('analytics') || q.includes('dashboard') || q.includes('kpi')) {
    return "**Admin Analytics Dashboard** aggregates real-time KPIs from all 3 KANINI enterprise systems. It uses materialized views, columnstore indexes, and role-based data visibility — built with **.NET 8 + Angular + MS SQL Server**."
  }
  if (q.includes('tesla') || q.includes('academy') || q.includes('elearning') || q.includes('e-learning')) {
    return "**Tesla Academy** is an adaptive e-learning platform Dinesh built personally. It uses **React + FastAPI + MongoDB + AWS S3** with 20+ REST endpoints, JWT role auth, and pre-signed S3 URLs that reduced upload latency by ~60%."
  }
  if (q.includes('project') || q.includes('built') || q.includes('work')) {
    return "Dinesh has built **9 projects** total: 4 enterprise systems at KANINI (BookNow, Property Registry, Ticket Platform, Analytics Dashboard) and 5 personal projects (Tesla Academy, FitClub, CVFS in C++, Transport Management System, Car Rental System in Java)."
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
    return "Dinesh's current stack: **.NET 8 (C#) · Angular · MS SQL Server** at KANINI. Personal stack: **React · FastAPI · Python · MongoDB · AWS**. Also proficient in Java, C++, Django, Docker, and Firebase."
  }
  if (q.includes('.net') || q.includes('dotnet') || q.includes('angular') || q.includes('csharp') || q.includes('c#')) {
    return "Dinesh uses **.NET 8 (C#) and Angular** daily at KANINI for enterprise systems. He implements Clean Architecture (Controller → Service → Repository → DB), JWT auth, Entity Framework Core, and MS SQL Server."
  }
  if (q.includes('certif') || q.includes('azure') || q.includes('az-900')) {
    return "Dinesh holds **Microsoft Azure Fundamentals (AZ-900)** with a score of **940/1000**, and **Advanced Python and Django** with 89/100."
  }
  if (q.includes('education') || q.includes('college') || q.includes('cgpa') || q.includes('degree') || q.includes('skncoe')) {
    return "Dinesh graduated with **B.E. Computer Science & Engineering** from **SKNCOE, Pune** (SPPU) in April 2025 with a CGPA of **8.13/10**. He pursued Data Science as his Honour subject."
  }
  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire')) {
    return "Reach Dinesh at **dineshgaikwad.skn.comp@gmail.com** or **+91-7083892863**. Connect on [LinkedIn](https://www.linkedin.com/in/dinesh-gaikwad-777917269) or [GitHub](https://github.com/DineshDGaikwad)."
  }
  if (q.includes('location') || q.includes('where') || q.includes('pune') || q.includes('bangalore')) {
    return "Dinesh is based in **Pune, Maharashtra, India**. He worked at KANINI's Bangalore office during his internship and is relocating to the Pune office from April 2026."
  }
  if (q.includes('linkedin') || q.includes('social') || q.includes('instagram') || q.includes('github')) {
    return "Find Dinesh on [GitHub](https://github.com/DineshDGaikwad) · [LinkedIn](https://www.linkedin.com/in/dinesh-gaikwad-777917269) (1,550 followers) · Instagram @dinesh._.gaikwad · Snapchat dineshgaikwad07."
  }

  return "I can answer questions about Dinesh's projects, skills, experience at KANINI, education, and certifications. Try: *'What is Dinesh working on at KANINI?'* or *'Tell me about BookNow'*."
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content ?? ''

    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: portfolioContext },
            ...messages.slice(-8),
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: true,
        }),
      })

      if (response.ok && response.body) {
        // Stream the response back to the client
        const stream = new ReadableStream({
          async start(controller) {
            const reader = response.body!.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() ?? ''

              for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed || trimmed === 'data: [DONE]') continue
                if (!trimmed.startsWith('data: ')) continue

                try {
                  const json = JSON.parse(trimmed.slice(6))
                  const delta = json.choices?.[0]?.delta?.content
                  if (delta) controller.enqueue(new TextEncoder().encode(delta))
                } catch {
                  // skip malformed chunks
                }
              }
            }
            controller.close()
          },
        })

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'X-Content-Type-Options': 'nosniff',
          },
        })
      }
    }

    // Fallback: rule-based
    const content = getRuleBasedResponse(lastMessage)
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({
      content: "I'm having trouble connecting right now. Please try again or contact Dinesh at dineshgaikwad.skn.comp@gmail.com",
    })
  }
}
