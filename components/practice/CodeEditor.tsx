'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, BookOpen, Code2, CheckCircle2, XCircle, ChevronDown, Play, Lock, Pause, RotateCcw, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Problem, Language } from './PracticePage'
import { LANGUAGES } from './PracticePage'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
      <div className="w-6 h-6 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
    </div>
  ),
})

const DIFF_COLOR = {
  Easy:   'text-neon-green border-neon-green/30 bg-neon-green/10',
  Medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  Hard:   'text-red-400 border-red-400/30 bg-red-400/10',
}

// ─── Persistent Timer ─────────────────────────────────────────────────────────
// localStorage keys:
//   arena:timer:{problemId}:elapsed   — seconds elapsed when paused
//   arena:timer:{problemId}:startedAt — epoch ms when last resumed
//   arena:timer:{problemId}:paused    — '1' if paused

function timerKey(problemId: string, field: 'elapsed' | 'startedAt' | 'paused') {
  return `arena:timer:${problemId}:${field}`
}

function getElapsed(problemId: string): number {
  if (typeof window === 'undefined') return 0
  const paused    = localStorage.getItem(timerKey(problemId, 'paused')) === '1'
  const elapsed   = parseInt(localStorage.getItem(timerKey(problemId, 'elapsed')) ?? '0', 10)
  const startedAt = parseInt(localStorage.getItem(timerKey(problemId, 'startedAt')) ?? '0', 10)
  if (paused || !startedAt) return elapsed
  return elapsed + Math.floor((Date.now() - startedAt) / 1000)
}

function isPaused(problemId: string): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(timerKey(problemId, 'paused')) === '1'
}

function resumeTimer(problemId: string) {
  localStorage.setItem(timerKey(problemId, 'startedAt'), String(Date.now()))
  localStorage.removeItem(timerKey(problemId, 'paused'))
}

function pauseTimer(problemId: string) {
  const elapsed = getElapsed(problemId)
  localStorage.setItem(timerKey(problemId, 'elapsed'), String(elapsed))
  localStorage.setItem(timerKey(problemId, 'paused'), '1')
  localStorage.removeItem(timerKey(problemId, 'startedAt'))
}

function initTimer(problemId: string) {
  // Only init if no existing timer for this problem
  const existing = localStorage.getItem(timerKey(problemId, 'startedAt'))
  const paused   = localStorage.getItem(timerKey(problemId, 'paused'))
  if (!existing && !paused) {
    localStorage.setItem(timerKey(problemId, 'elapsed'), '0')
    localStorage.setItem(timerKey(problemId, 'startedAt'), String(Date.now()))
  }
}

// ─── Code persistence ─────────────────────────────────────────────────────────
function codeKey(problemId: string, lang: Language) {
  return `arena:code:${problemId}:${lang}`
}

export function saveCode(problemId: string, lang: Language, code: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(codeKey(problemId, lang), code)
}

export function loadCode(problemId: string, lang: Language): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(codeKey(problemId, lang))
}

// ─── Timer component ──────────────────────────────────────────────────────────
function Timer({ problemId, paused, onPause, onResume }: {
  problemId: string
  paused: boolean
  onPause: () => void
  onResume: () => void
}) {
  const [seconds, setSeconds] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    initTimer(problemId)
    setSeconds(getElapsed(problemId))
    if (!isPaused(problemId)) {
      intervalRef.current = setInterval(() => setSeconds(getElapsed(problemId)), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [problemId])

  // Sync interval with paused prop
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setSeconds(getElapsed(problemId))
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => setSeconds(getElapsed(problemId)), 1000)
    }
  }, [paused, problemId])

  const handlePause = useCallback(() => {
    pauseTimer(problemId)
    onPause()
  }, [problemId, onPause])

  const handleResume = useCallback(() => {
    resumeTimer(problemId)
    onResume()
  }, [problemId, onResume])

  if (seconds === null) return null

  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('flex items-center gap-1 text-[10px] font-mono', paused ? 'text-yellow-400' : 'text-muted-foreground')}>
        <Clock size={10} />
        {m}:{s}
        {paused && <span className="text-[9px] font-mono text-yellow-400/70 ml-0.5">paused</span>}
      </span>
      <button
        onClick={paused ? handleResume : handlePause}
        title={paused ? 'Resume timer' : 'Pause timer'}
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-md border transition-all',
          paused
            ? 'bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20'
            : 'bg-white/[0.04] border-white/[0.10] text-muted-foreground hover:text-foreground hover:border-white/20'
        )}
      >
        {paused ? <Play size={9} /> : <Pause size={9} />}
      </button>
    </div>
  )
}

// ─── Pause Overlay ────────────────────────────────────────────────────────────
function PauseOverlay({ onResume }: { onResume: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 backdrop-blur-md bg-background/60"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
          <Pause size={20} className="text-yellow-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Timer Paused</p>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">Your code is hidden while paused</p>
        </div>
        <button
          onClick={onResume}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-sm font-mono text-neon-green hover:bg-neon-green/20 transition-all"
        >
          <Play size={13} /> Resume
        </button>
      </div>
    </motion.div>
  )
}

export interface TestResult {
  input: string
  expected: string
  actual?: string
  passed: boolean
  hidden: boolean
  index: number
  error?: string
}

interface Props {
  problem: Problem | null
  code: string
  language: Language
  onCodeChange: (c: string) => void
  onLanguageChange: (l: Language) => void
  onRun: () => void
  onSubmit: () => void
  running: boolean
  submitting: boolean
  submitted: boolean
  testResults: TestResult[]
  viewMode?: 'problem' | 'editor' | 'both'
}

// ─── Problem Panel ────────────────────────────────────────────────────────────
function ProblemPanel({ problem, testResults, submitted }: {
  problem: Problem
  testResults: TestResult[]
  submitted: boolean
}) {
  const passed    = testResults.filter(r => r.passed).length
  const total     = testResults.length
  const allPassed = total > 0 && passed === total

  return (
    <div className="flex flex-col h-full glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <BookOpen size={12} className="text-neon-blue" />
          <span className="text-[11px] font-mono text-neon-blue">Problem</span>
        </div>
        <div className="flex items-center gap-2">
          {submitted && <span className="flex items-center gap-1 text-[10px] font-mono text-neon-green"><CheckCircle2 size={10} /> Submitted</span>}
          <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border', DIFF_COLOR[problem.difficulty])}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-4 space-y-5">
        <h2 className="text-base font-bold text-foreground leading-tight">{problem.title}</h2>

        <div className="flex flex-wrap gap-1.5">
          {problem.tags.map(t => (
            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-blue/5 border border-neon-blue/15 text-neon-blue/70">{t}</span>
          ))}
        </div>

        <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{problem.description}</div>

        {problem.examples?.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Examples</p>
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.07] overflow-hidden">
                <div className="px-3 py-1.5 bg-white/[0.02] border-b border-white/[0.05]">
                  <span className="text-[10px] font-mono text-muted-foreground">Example {i + 1}</span>
                </div>
                <div className="p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex gap-2"><span className="text-muted-foreground shrink-0">Input:</span><span className="text-foreground">{ex.input}</span></div>
                  <div className="flex gap-2"><span className="text-muted-foreground shrink-0">Output:</span><span className="text-neon-green font-semibold">{ex.output}</span></div>
                  {ex.explanation && <div className="flex gap-2 pt-1 border-t border-white/[0.05]"><span className="text-muted-foreground shrink-0">Explanation:</span><span className="text-muted-foreground/70">{ex.explanation}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {problem.testCases?.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Test Cases</p>
            {problem.testCases.slice(0, 2).map((tc, i) => (
              <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.07] overflow-hidden">
                <div className="px-3 py-1.5 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">Test {i + 1}</span>
                  {testResults[i] !== undefined && (
                    <span className={cn('flex items-center gap-1 text-[10px] font-mono', testResults[i].passed ? 'text-neon-green' : 'text-red-400')}>
                      {testResults[i].passed ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                      {testResults[i].passed ? 'Passed' : 'Failed'}
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex gap-2"><span className="text-muted-foreground shrink-0">Input:</span><span className="text-foreground">{tc.input}</span></div>
                  <div className="flex gap-2"><span className="text-muted-foreground shrink-0">Expected:</span><span className="text-neon-green">{tc.expected}</span></div>
                </div>
              </div>
            ))}
            {problem.testCases.length > 2 && (
              <div className="rounded-xl bg-white/[0.01] border border-dashed border-white/[0.08] p-3 flex items-center gap-2.5">
                <Lock size={12} className="text-muted-foreground/40 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-mono text-muted-foreground/60">{problem.testCases.length - 2} hidden test cases</p>
                  <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">Verified automatically on submission</p>
                </div>
                {testResults.length > 2 && (
                  <span className={cn('text-[10px] font-mono font-semibold', allPassed ? 'text-neon-green' : 'text-red-400')}>
                    {testResults.slice(2).filter(r => r.passed).length}/{testResults.length - 2} passed
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {problem.constraints?.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Constraints</p>
            <ul className="space-y-1.5">
              {problem.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-mono text-muted-foreground">
                  <span className="text-neon-blue/60 mt-0.5 shrink-0">·</span>{c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Editor Panel ─────────────────────────────────────────────────────────────
function EditorPanel({ problem, code, language, onCodeChange, onLanguageChange, onRun, onSubmit, running, submitting, submitted, testResults }: {
  problem: Problem
  code: string
  language: Language
  onCodeChange: (c: string) => void
  onLanguageChange: (l: Language) => void
  onRun: () => void
  onSubmit: () => void
  running: boolean
  submitting: boolean
  submitted: boolean
  testResults: TestResult[]
}) {
  const [showResults, setShowResults] = useState(false)
  const [paused, setPaused]           = useState(false)

  useEffect(() => { if (testResults.length > 0) setShowResults(true) }, [testResults])

  // Restore paused state on mount
  useEffect(() => {
    setPaused(isPaused(problem._id))
  }, [problem._id])

  const handlePause  = useCallback(() => { pauseTimer(problem._id);  setPaused(true)  }, [problem._id])
  const handleResume = useCallback(() => { resumeTimer(problem._id); setPaused(false) }, [problem._id])

  const monacoLang = LANGUAGES.find(l => l.key === language)?.monaco ?? 'javascript'
  const passed     = testResults.filter(r => r.passed).length
  const total      = testResults.length
  const allPassed  = total > 0 && passed === total

  return (
    <div className="flex flex-col h-full glass rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Code2 size={12} className="text-neon-blue" />
          <span className="text-[11px] font-mono text-neon-blue">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {submitted && <span className="flex items-center gap-1 text-[10px] font-mono text-neon-green"><CheckCircle2 size={10} /> Submitted</span>}
          <Timer problemId={problem._id} paused={paused} onPause={handlePause} onResume={handleResume} />
        </div>
      </div>

      {/* Language selector */}
      <div className="shrink-0 flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.06] overflow-x-auto scrollbar-none">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mr-1 shrink-0">Lang</p>
        {LANGUAGES.map(l => (
          <button key={l.key} onClick={() => onLanguageChange(l.key)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all shrink-0',
              language === l.key
                ? 'bg-neon-blue/15 border-neon-blue/30 text-neon-blue'
                : 'border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/20'
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Monaco + Pause overlay */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <MonacoEditor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={v => onCodeChange(v ?? '')}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
            readOnly: paused,
          }}
        />
        <AnimatePresence>
          {paused && (
            <PauseOverlay onResume={handleResume} />
          )}
        </AnimatePresence>
      </div>

      {/* Action bar — Run + Submit */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-2">
          {testResults.length > 0 && (
            <button onClick={() => setShowResults(v => !v)} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors">
              <span className={cn('font-bold', allPassed ? 'text-neon-green' : 'text-red-400')}>{passed}/{total}</span>
              <span className="text-muted-foreground/50">tests</span>
              {showResults ? <ChevronDown size={10} /> : <ChevronDown size={10} className="rotate-180" />}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={!code.trim() || running || submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.10] text-xs font-mono text-muted-foreground hover:text-foreground hover:border-white/20 transition-all disabled:opacity-40"
          >
            {running
              ? <><RotateCcw size={11} className="animate-spin" /> Running...</>
              : <><Play size={11} /> Run</>}
          </button>
          <button
            onClick={onSubmit}
            disabled={!code.trim() || submitting || running}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all disabled:opacity-40',
              submitted
                ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                : 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20'
            )}
          >
            {submitted
              ? <><CheckCircle2 size={11} /> Solved!</>
              : submitting
              ? <><RotateCcw size={11} className="animate-spin" /> Submitting...</>
              : <><Zap size={11} /> Submit</>}
          </button>
        </div>
      </div>

      {/* Test results */}
      <AnimatePresence>
        {testResults.length > 0 && showResults && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="shrink-0 border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-2.5 space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                {testResults.map((r, i) => (
                  <div key={i} title={r.hidden ? `Hidden test ${i + 1}` : `Test ${i + 1}: ${r.input}`}
                    className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono border',
                      r.passed ? 'bg-neon-green/10 border-neon-green/20 text-neon-green' : 'bg-red-400/10 border-red-400/20 text-red-400'
                    )}
                  >
                    {r.passed ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                    {r.hidden ? <Lock size={8} /> : null}
                    {r.hidden ? `H${i + 1}` : `T${i + 1}`}
                  </div>
                ))}
              </div>
              {(() => {
                const fail = testResults.find(r => !r.passed)
                if (!fail) return null
                return (
                  <div className="rounded-lg bg-red-400/5 border border-red-400/15 p-2.5 space-y-1 text-[10px] font-mono">
                    {fail.error ? (
                      <div className="flex gap-1.5"><span className="text-red-400/60 shrink-0">Error:</span><span className="text-red-400">{fail.error}</span></div>
                    ) : (
                      <>
                        {!fail.hidden && <div className="flex gap-1.5"><span className="text-muted-foreground/60 shrink-0">Input:</span><span className="text-foreground">{fail.input}</span></div>}
                        <div className="flex gap-1.5"><span className="text-muted-foreground/60 shrink-0">Expected:</span><span className="text-neon-green">{fail.expected}</span></div>
                        {fail.actual !== undefined && fail.actual !== '' && <div className="flex gap-1.5"><span className="text-muted-foreground/60 shrink-0">Got:</span><span className="text-red-400">{fail.actual}</span></div>}
                      </>
                    )}
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function CodeEditor({ problem, code, language, onCodeChange, onLanguageChange, onRun, onSubmit, running, submitting, submitted, testResults, viewMode = 'both' }: Props) {
  const [tab, setTab] = useState<'problem' | 'editor'>(viewMode === 'editor' ? 'editor' : 'problem')
  useEffect(() => { if (problem) setTab(viewMode === 'editor' ? 'editor' : 'problem') }, [problem?._id, viewMode])

  if (!problem) {
    return (
      <div className="h-full glass rounded-2xl border border-white/[0.06] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto">
            <Code2 size={24} className="text-neon-blue/50" />
          </div>
          <p className="text-xs font-mono text-muted-foreground/50">Select a problem to start</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'problem') return <ProblemPanel problem={problem} testResults={testResults} submitted={submitted} />
  if (viewMode === 'editor') return <EditorPanel problem={problem} code={code} language={language} onCodeChange={onCodeChange} onLanguageChange={onLanguageChange} onRun={onRun} onSubmit={onSubmit} running={running} submitting={submitting} submitted={submitted} testResults={testResults} />

  // 'both' — tab switcher
  return (
    <div className="flex flex-col h-full glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-1 p-0.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
          {(['problem', 'editor'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono transition-all capitalize',
                tab === t ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/20' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'problem' ? <BookOpen size={10} /> : <Code2 size={10} />} {t}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {tab === 'problem'
          ? <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
              <ProblemPanel problem={problem} testResults={testResults} submitted={submitted} />
            </motion.div>
          : <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
              <EditorPanel problem={problem} code={code} language={language} onCodeChange={onCodeChange} onLanguageChange={onLanguageChange} onRun={onRun} onSubmit={onSubmit} running={running} submitting={submitting} submitted={submitted} testResults={testResults} />
            </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}
