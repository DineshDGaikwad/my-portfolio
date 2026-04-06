import type { Metadata } from 'next'
import { PracticePage } from '@/components/practice/PracticePage'

export const metadata: Metadata = {
  title: 'Coding Practice',
  description: 'Practice coding problems with AI-powered code review. Daily challenges, multiple languages, instant feedback.',
}

export default function Practice() {
  return <PracticePage />
}
