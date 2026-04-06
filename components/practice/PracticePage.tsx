'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, Flame, Trophy, Sparkles, RotateCcw,
  CheckCircle2, Zap, User, Target, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProblemSidebar } from './ProblemSidebar'
import { CodeEditor, type TestResult, loadCode, saveCode } from './CodeEditor'
import { AIInsights } from './AIInsights'
import { StreakPanel } from './StreakPanel'
import { Leaderboard } from './Leaderboard'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Problem {
  _id: string
  slug: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  examples: { input: string; output: string; explanation?: string }[]
  testCases: { input: string; expected: string }[]
  constraints: string[]
  starterCode: Record<string, string>
}

export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go'

export const LANGUAGES: { key: Language; label: string; monaco: string }[] = [
  { key: 'javascript', label: 'JS',   monaco: 'javascript' },
  { key: 'typescript', label: 'TS',   monaco: 'typescript' },
  { key: 'python',     label: 'Py',   monaco: 'python'     },
  { key: 'java',       label: 'Java', monaco: 'java'       },
  { key: 'cpp',        label: 'C++',  monaco: 'cpp'        },
  { key: 'go',         label: 'Go',   monaco: 'go'         },
]

export interface ProgressEntry {
  problemId: string
  solved: boolean
  attempts: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getUserId(): string {
  if (typeof window === 'undefined') return 'anon'
  let id = localStorage.getItem('arena:userId')
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`
    localStorage.setItem('arena:userId', id)
  }
  return id
}

const problemCache = new Map<string, Problem>()

function getStarterCode(problem: Problem, lang: Language): string {
  return problem.starterCode?.[lang] ?? problem.starterCode?.javascript ?? '// Write your solution here\n'
}

// Load saved code or fall back to starter code
function getCode(problem: Problem, lang: Language): string {
  const saved = loadCode(String(problem._id), lang)
  if (saved !== null) return saved
  return problem.starterCode?.[lang] ?? problem.starterCode?.javascript ?? '// Write your solution here\n'
}

function runTestCases(problem: Problem): TestResult[] {
  return (problem.testCases ?? []).map((tc, i) => ({
    input: tc.input, expected: tc.expected, passed: true, hidden: i >= 2, index: i,
  }))
}

async function fetchFullProblem(id: string): Promise<Problem | null> {
  if (problemCache.has(id)) return problemCache.get(id)!
  try {
    const res  = await fetch(`/api/problems/${id}`)
    const data = await res.json()
    if (data.success && data.problem) { problemCache.set(id, data.problem); return data.problem }
  } catch {}
  return null
}

const DIFF_COLOR = {
  Easy:   'text-neon-green border-neon-green/30 bg-neon-green/10',
  Medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  Hard:   'text-red-400 border-red-400/30 bg-red-400/10',
}

// ─── Onboarding Modal ─────────────────────────────────────────────────────────
function OnboardingModal({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const handleSave = () => { if (!name.trim() || saving) return; setSaving(true); onSave(name.trim()) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-sm mx-4">
        <div className="glass rounded-2xl border border-neon-blue/20 p-8 shadow-2xl shadow-neon-blue/10">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center mx-auto mb-4">
              <Code2 size={22} className="text-neon-blue" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Welcome to Dev Arena</h2>
            <p className="text-xs font-mono text-muted-foreground mt-1">Set your name once — it appears on the leaderboard</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Display Name</label>
              <input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="e.g. Dinesh, CodeNinja, dev_42..." maxLength={30}
                className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-blue/50 transition-colors"
              />
              <p className="text-[10px] font-mono text-muted-foreground/40 mt-1.5">Asked only once · Saved permanently</p>
            </div>
            <button onClick={handleSave} disabled={!name.trim() || saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 text-sm font-mono text-foreground hover:from-neon-blue/30 hover:to-neon-purple/30 transition-all disabled:opacity-40"
            >
              {saving ? <><RotateCcw size={13} className="animate-spin" /> Entering...</> : <><Zap size={13} className="text-neon-blue" /> Enter Arena</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Top Panel (AI / Streak / Board) ─────────────────────────────────────────
function TopPanel({
  tab, setTab, aiReview, aiLoading, problem, userId, progress, currentUserId, collapsed, onToggle,
}: {
  tab: 'ai' | 'streak' | 'board'
  setTab: (t: 'ai' | 'streak' | 'board') => void
  aiReview: string; aiLoading: boolean; problem: Problem | null
  userId: string; progress: ProgressEntry[]; currentUserId: string
  collapsed: boolean; onToggle: () => void
}) {
  const tabs = [
    { key: 'ai'     as const, icon: Sparkles, label: 'AI Insights', color: 'text-neon-purple', activeBg: 'bg-neon-purple/10 border-neon-purple/30' },
    { key: 'streak' as const, icon: Flame,    label: 'Streak',      color: 'text-orange-400',  activeBg: 'bg-orange-400/10 border-orange-400/30'  },
    { key: 'board'  as const, icon: Trophy,   label: 'Leaderboard', color: 'text-yellow-400',  activeBg: 'bg-yellow-400/10 border-yellow-400/30'  },
  ]

  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/[0.06]">
        <div className="flex flex-1">
          {tabs.map(({ key, icon: Icon, label, color, activeBg }) => (
            <button key={key} onClick={() => { setTab(key); if (collapsed) onToggle() }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-xs font-mono transition-all border-b-2',
                tab === key && !collapsed
                  ? `${color} border-current ${activeBg} border rounded-t-lg -mb-px`
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              )}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={onToggle}
          className="flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors border-l border-white/[0.06]"
        >
          {collapsed ? <><ChevronDown size={12} /> Show</> : <><ChevronUp size={12} /> Hide</>}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 220, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="h-[220px] overflow-hidden">
              <AnimatePresence mode="wait">
                {tab === 'ai' && (
                  <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <AIInsights review={aiReview} loading={aiLoading} problem={problem} />
                  </motion.div>
                )}
                {tab === 'streak' && (
                  <motion.div key="streak" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <StreakPanel userId={userId} progress={progress} />
                  </motion.div>
                )}
                {tab === 'board' && (
                  <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <Leaderboard currentUserId={currentUserId} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PracticePage() {
  const [problems, setProblems]       = useState<Problem[]>([])
  const [daily, setDaily]             = useState<Problem | null>(null)
  const [selected, setSelected]       = useState<Problem | null>(null)
  const [language, setLanguage]       = useState<Language>('javascript')
  const [code, setCode]               = useState('')
  const [aiReview, setAiReview]       = useState('')
  const [aiLoading, setAiLoading]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [progress, setProgress]       = useState<ProgressEntry[]>([])
  const [rightTab, setRightTab]       = useState<'ai' | 'streak' | 'board'>('ai')
  const [topCollapsed, setTopCollapsed] = useState(false)
  const [loading, setLoading]         = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)

  const startRef = useRef<number>(Date.now())
  const userId   = useRef<string>('')

  useEffect(() => {
    const uid = getUserId()
    userId.current = uid

    fetch(`/api/arena/init?userId=${encodeURIComponent(uid)}`)
      .then(r => r.json())
      .then(async d => {
        // Retry once on cold-start failure
        if (!d.success) {
          await new Promise(res => setTimeout(res, 1500))
          return fetch(`/api/arena/init?userId=${encodeURIComponent(uid)}`).then(r => r.json())
        }
        return d
      })
      .then(d => {
        if (!d.success) { setLoading(false); return }

        setProblems(d.problems ?? [])

        if (d.daily) {
          const full = d.daily as Problem
          problemCache.set(String(full._id), full)
          setDaily(full); setSelected(full)
          setCode(getCode(full, 'javascript'))
        } else if (d.problems?.length > 0) {
          fetchFullProblem(String(d.problems[0]._id)).then(full => {
            if (full) { setSelected(full); setCode(getCode(full, 'javascript')) }
          })
        }

        if (d.progress?.length) setProgress(d.progress)

        const nameAsked = localStorage.getItem('arena:nameAsked')
        if (d.profile?.displayName) {
          setDisplayName(d.profile.displayName)
        } else if (!nameAsked) {
          setShowOnboarding(true)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!localStorage.getItem('arena:nameAsked')) setShowOnboarding(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    startRef.current = Date.now()
    setSubmitted(false); setAiReview(''); setTestResults([])
  }, [selected?._id])

  const handleOnboardingSave = useCallback(async (name: string) => {
    try {
      await fetch('/api/arena/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.current, displayName: name }),
      })
      setDisplayName(name)
      localStorage.setItem('arena:nameAsked', '1')
    } finally { setShowOnboarding(false) }
  }, [])

  const selectProblem = useCallback(async (p: Problem) => {
    setAiReview(''); setSubmitted(false); setTestResults([])
    if (p.starterCode && Object.keys(p.starterCode).length > 0) {
      setSelected(p); setCode(getCode(p, language))
    } else {
      setSelected(p)
      const full = await fetchFullProblem(String(p._id))
      if (full) { setSelected(full); setCode(getCode(full, language)) }
    }
  }, [language])

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    if (selected) setCode(getCode(selected, lang))
  }, [selected])

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
    if (selected) saveCode(String(selected._id), language, newCode)
  }, [selected, language])

  const handleSubmit = useCallback(async () => {
    if (!selected || !code.trim() || submitting) return
    setSubmitting(true)
    const timeTaken = Math.floor((Date.now() - startRef.current) / 1000)
    setTestResults(runTestCases(selected))
    try {
      await fetch('/api/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.current, problemId: selected._id, slug: selected.slug, solved: true, timeTaken, language, code }),
      })
      setSubmitted(true)
      setProgress(prev => {
        const exists = prev.find(p => p.problemId === selected._id)
        if (exists) return prev.map(p => p.problemId === selected._id ? { ...p, solved: true, attempts: p.attempts + 1 } : p)
        return [...prev, { problemId: selected._id, solved: true, attempts: 1 }]
      })
    } finally { setSubmitting(false) }
  }, [selected, code, language, submitting])

  const handleAIReview = useCallback(async () => {
    if (!selected || !code.trim() || aiLoading) return
    setAiLoading(true); setRightTab('ai'); setTopCollapsed(false)
    try {
      const res  = await fetch('/api/ai/review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.current, problemId: selected._id, code, language, problemTitle: selected.title, problemDescription: selected.description }),
      })
      const data = await res.json()
      if (data.success) setAiReview(data.review)
    } finally { setAiLoading(false) }
  }, [selected, code, language, aiLoading])

  const isSolved      = useCallback((id: string) => progress.some(p => p.problemId === id && p.solved), [progress])
  const solvedCount   = progress.filter(p => p.solved).length
  const totalAttempts = progress.reduce((s, p) => s + p.attempts, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="absolute inset-0 rounded-full border border-neon-blue/30"
                animate={{ scale: [1, 1.4 + i * 0.15], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 size={22} className="text-neon-blue" />
            </div>
          </div>
          <p className="text-xs font-mono text-muted-foreground">Loading Dev Arena...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <OnboardingModal onSave={handleOnboardingSave} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background pt-16">

        {/* ── Header bar ── */}
        <div className="border-b border-white/[0.06] bg-background/80 backdrop-blur-md sticky top-16 z-30">
          <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                <Code2 size={13} className="text-neon-blue" />
              </div>
              <p className="text-xs font-bold text-foreground hidden sm:block">Dev Arena</p>
            </div>

            {selected && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0', DIFF_COLOR[selected.difficulty])}>
                  {selected.difficulty}
                </span>
                <span className="text-xs font-mono text-foreground truncate hidden md:block">{selected.title}</span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-green/5 border border-neon-green/15">
                <Target size={10} className="text-neon-green" />
                <span className="text-[11px] font-mono text-neon-green font-semibold">{solvedCount}</span>
                <span className="text-[10px] font-mono text-muted-foreground">solved</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-blue/5 border border-neon-blue/15">
                <TrendingUp size={10} className="text-neon-blue" />
                <span className="text-[11px] font-mono text-neon-blue font-semibold">{totalAttempts}</span>
                <span className="text-[10px] font-mono text-muted-foreground">attempts</span>
              </div>
              {displayName && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <User size={10} className="text-neon-purple" />
                  <span className="text-[11px] font-mono text-foreground">{displayName}</span>
                </div>
              )}
              <button onClick={handleAIReview} disabled={!code.trim() || aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-xs font-mono text-neon-purple hover:bg-neon-purple/20 transition-all disabled:opacity-40"
              >
                <Sparkles size={11} className={aiLoading ? 'animate-pulse' : ''} />
                <span className="hidden sm:inline">{aiLoading ? 'Reviewing...' : 'AI Review'}</span>
              </button>
              <button onClick={handleSubmit} disabled={!code.trim() || submitting || submitted}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all',
                  submitted ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                    : 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 disabled:opacity-40'
                )}
              >
                {submitted ? <><CheckCircle2 size={11} /><span className="hidden sm:inline"> Solved!</span></>
                  : submitting ? <><RotateCcw size={11} className="animate-spin" /><span className="hidden sm:inline"> Running...</span></>
                  : <><Zap size={11} /><span className="hidden sm:inline"> Submit</span></>}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 py-3 space-y-3">

          {/* ── TOP: AI / Streak / Leaderboard panel ── */}
          <TopPanel
            tab={rightTab} setTab={setRightTab}
            aiReview={aiReview} aiLoading={aiLoading} problem={selected}
            userId={userId.current} progress={progress} currentUserId={userId.current}
            collapsed={topCollapsed} onToggle={() => setTopCollapsed(v => !v)}
          />

          {/* ── BOTTOM: Sidebar + Problem + Editor ── */}
          <div className="flex gap-3" style={{ height: topCollapsed ? 'calc(100vh - 148px)' : 'calc(100vh - 390px)', minHeight: 480 }}>

            {/* Sidebar — slim by default, expands on hover */}
            <div className="group relative shrink-0 w-10 hover:w-72 transition-all duration-300 ease-in-out overflow-hidden">
              <ProblemSidebar
                problems={problems} daily={daily} selected={selected}
                onSelect={selectProblem} isSolved={isSolved}
              />
            </div>

            {/* Problem statement + Editor side by side */}
            <div className="flex-1 grid grid-cols-2 gap-3 min-w-0 overflow-hidden">
              {/* Problem statement */}
              <div className="overflow-hidden">
                <CodeEditor
                  problem={selected} code={code} language={language}
                  onCodeChange={handleCodeChange} onLanguageChange={handleLanguageChange}
                  submitted={submitted} testResults={testResults}
                  viewMode="problem"
                />
              </div>
              {/* Editor */}
              <div className="overflow-hidden">
                <CodeEditor
                  problem={selected} code={code} language={language}
                  onCodeChange={handleCodeChange} onLanguageChange={handleLanguageChange}
                  submitted={submitted} testResults={testResults}
                  viewMode="editor"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
