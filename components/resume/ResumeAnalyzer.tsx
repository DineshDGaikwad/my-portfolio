'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResumeUpload } from './ResumeUpload'
import { ScoreCard } from './ScoreCard'
import { SuggestionsList } from './SuggestionsList'
import { ResumeGenerator } from './ResumeGenerator'
import type { AnalysisResult } from '@/lib/resume/analyzer'
import { AlertCircle, RotateCcw, FileText, Sparkles } from 'lucide-react'

const LOADING_STEPS = [
  'Parsing resume content...',
  'Extracting skills & experience...',
  'Running ATS compatibility check...',
  'Identifying skill gaps...',
  'Generating improvement suggestions...',
  'Finalizing AI analysis...',
]

function LoadingState() {
  const [step, setStep] = useState(0)

  useState(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 1800)
    return () => clearInterval(id)
  })

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Animated rings */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-neon-blue/30"
            animate={{ scale: [1, 1.4 + i * 0.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
            <FileText size={20} className="text-neon-blue" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-mono text-foreground">Analyzing your resume</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-mono text-neon-blue"
          >
            {LOADING_STEPS[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
          animate={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function ResumeAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ wordCount: number; fileType: string } | null>(null)
  const [originalText, setOriginalText] = useState<string>('')
  const [showGenerator, setShowGenerator] = useState(false)

  const handleAnalyze = async (file: File, role: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('role', role)

      const res = await fetch('/api/resume-analyze', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Analysis failed. Please try again.')
        return
      }

      setResult(data.analysis)
      setMeta(data.meta)
      setOriginalText(data.originalText ?? '')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null); setMeta(null); setOriginalText(''); setShowGenerator(false) }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoadingState />
        </motion.div>
      ) : result && showGenerator ? (
        <motion.div key="generator" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <ResumeGenerator
            originalText={originalText}
            analysis={result}
            onBack={() => setShowGenerator(false)}
          />
        </motion.div>
      ) : result ? (
        <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Analysis Complete</p>
              <p className="text-sm font-mono text-foreground mt-0.5">
                {result.role} · {meta?.wordCount} words · {meta?.fileType?.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGenerator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/30 text-xs font-mono text-foreground hover:from-neon-purple/20 hover:to-neon-blue/20 hover:border-neon-purple/50 transition-all"
              >
                <Sparkles size={12} className="text-neon-purple" /> Generate Enhanced Resume
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-white/25 transition-all"
              >
                <RotateCcw size={12} /> Analyze Another
              </button>
            </div>
          </div>

          {/* Results grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ScoreCard score={result.atsScore} breakdown={result.scoreBreakdown} />
            </div>
            <div className="lg:col-span-2">
              <SuggestionsList analysis={result} />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6"
            >
              <AlertCircle size={13} /> {error}
            </motion.div>
          )}
          <ResumeUpload onAnalyze={handleAnalyze} loading={loading} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
