'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, X, ChevronLeft, Loader2, FileText, RotateCcw } from 'lucide-react'
import type { AnalysisResult } from '@/lib/resume/analyzer'
import type { GeneratedResume } from '@/lib/resume/generator'
import { ResumeCard } from '@/components/resume/builder/ResumeCard'
import { ChatPanel } from '@/components/resume/builder/ChatPanel'
import type { ChatMessage } from '@/components/resume/builder/ChatPanel'

async function downloadAsPDF(resume: GeneratedResume) {
  const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, padding: 36, color: '#1a1a1a', backgroundColor: '#ffffff' },
    name: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    title: { fontSize: 10, color: '#4f46e5', marginBottom: 6 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, fontSize: 8, color: '#555' },
    divider: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 8 },
    sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.2, color: '#4f46e5', marginBottom: 5 },
    summary: { fontSize: 9, lineHeight: 1.5, color: '#374151', marginBottom: 12 },
    expBlock: { marginBottom: 8 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    expRole: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
    expMeta: { fontSize: 8, color: '#6b7280' },
    bullet: { flexDirection: 'row', gap: 4, marginBottom: 2 },
    bulletDot: { color: '#4f46e5', marginTop: 1 },
    bulletText: { flex: 1, lineHeight: 1.4, color: '#374151' },
    skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
    skillCat: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, marginBottom: 3 },
    skillPill: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontSize: 8, color: '#374151' },
    section: { marginBottom: 12 },
  })

  const Doc = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{resume.name}</Text>
        <Text style={styles.title}>{resume.title}</Text>
        <View style={styles.contactRow}>
          {resume.contact.email && <Text>{resume.contact.email}</Text>}
          {resume.contact.phone && <Text>{resume.contact.phone}</Text>}
          {resume.contact.location && <Text>{resume.contact.location}</Text>}
          {resume.contact.linkedin && <Text>{resume.contact.linkedin}</Text>}
          {resume.contact.github && <Text>{resume.contact.github}</Text>}
          {resume.contact.portfolio && <Text>{resume.contact.portfolio}</Text>}
        </View>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{resume.summary}</Text>
        </View>

        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.expHeader}>
                  <Text style={styles.expRole}>{exp.role} · {exp.company}</Text>
                  <Text style={styles.expMeta}>{exp.duration}</Text>
                </View>
                <Text style={[styles.expMeta, { marginBottom: 3 }]}>{exp.location}</Text>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>▸</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {resume.skills.filter(s => s.items.length > 0).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {resume.skills.filter(s => s.items.length > 0).map((s, i) => (
              <View key={i} style={{ marginBottom: 5 }}>
                <Text style={styles.skillCat}>{s.category}</Text>
                <View style={styles.skillRow}>
                  {s.items.map((item, j) => <Text key={j} style={styles.skillPill}>{item}</Text>)}
                </View>
              </View>
            ))}
          </View>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((p, i) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.expHeader}>
                  <Text style={styles.expRole}>{p.name}</Text>
                  <Text style={styles.expMeta}>{p.tech.slice(0, 4).join(', ')}</Text>
                </View>
                <Text style={[styles.expMeta, { marginBottom: 3 }]}>{p.description}</Text>
                {p.bullets.map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>▸</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((e, i) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.expHeader}>
                  <Text style={styles.expRole}>{e.degree}</Text>
                  <Text style={styles.expMeta}>{e.duration}</Text>
                </View>
                <Text style={styles.expMeta}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {resume.certifications?.filter(Boolean).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications!.filter(Boolean).map((c, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>▸</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {resume.achievements?.filter(Boolean).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {resume.achievements!.filter(Boolean).map((a, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>▸</Text>
                <Text style={styles.bulletText}>{a}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  )

  const blob = await pdf(<Doc />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${resume.name.replace(/\s+/g, '_')}_Enhanced_Resume.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Input Panel ──────────────────────────────────────────────────────────────
function GeneratorInputPanel({
  onGenerate,
  loading,
}: {
  onGenerate: (additionalInfo: string, refFile: File | null) => void
  loading: boolean
}) {
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [refFile, setRefFile] = useState<File | null>(null)

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">
          Additional Info <span className="text-white/20">(optional)</span>
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Add certifications, new projects, links, achievements, or anything you want included in the enhanced resume..."
          rows={5}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-neon-blue/40 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">
          Reference Document <span className="text-white/20">(optional — PDF or DOCX)</span>
        </label>
        {refFile ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-neon-blue/5 border border-neon-blue/20 rounded-xl">
            <FileText size={14} className="text-neon-blue shrink-0" />
            <span className="text-xs font-mono text-foreground flex-1 truncate">{refFile.name}</span>
            <button onClick={() => setRefFile(null)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.pdf,.docx'
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0]
                if (f) setRefFile(f)
              }
              input.click()
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-white/15 rounded-xl text-xs font-mono text-muted-foreground hover:border-neon-blue/30 hover:text-foreground transition-all"
          >
            <Upload size={13} /> Upload reference doc (job description, old resume, etc.)
          </button>
        )}
      </div>

      <button
        onClick={() => onGenerate(additionalInfo, refFile)}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 text-sm font-mono text-foreground hover:from-neon-blue/30 hover:to-neon-purple/30 hover:border-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> Generating your resume...</>
        ) : (
          <><Sparkles size={14} className="text-neon-blue" /> Generate Enhanced Resume</>
        )}
      </button>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function ResumeGenerator({
  originalText,
  analysis,
  onBack,
}: {
  originalText: string
  analysis: AnalysisResult
  onBack: () => void
}) {
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [isLoading, setIsLoading] = useState(false)
  const [resume, setResume] = useState<GeneratedResume | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const LOADING_STEPS = [
    'Reading your resume content...',
    'Applying AI enhancement rules...',
    'Rewriting bullet points with metrics...',
    'Optimizing for ATS compatibility...',
    'Structuring final resume...',
  ]
  const [loadStep, setLoadStep] = useState(0)

  const handleGenerate = async (additionalInfo: string, refFile: File | null) => {
    setIsLoading(true)
    setError(null)
    setLoadStep(0)

    const interval = setInterval(() =>
      setLoadStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 2000)

    try {
      const form = new FormData()
      form.append('originalText', originalText)
      form.append('analysis', JSON.stringify(analysis))
      form.append('additionalInfo', additionalInfo)
      if (refFile) form.append('referenceFile', refFile)

      const res = await fetch('/api/resume-generate', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Generation failed. Please try again.')
        setIsLoading(false)
        return
      }

      setResume(data.resume)
      setMessages([])
      setStep('result')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      clearInterval(interval)
      setIsLoading(false)
    }
  }

  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim() || !resume || chatLoading) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput.trim() }
    setMessages((m) => [...m, userMsg])
    setChatInput('')
    setChatLoading(true)

    try {
      const res = await fetch('/api/resume-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentResume: resume, instruction: userMsg.content }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setMessages((m) => [...m, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.error ?? 'Something went wrong. Please try again.',
        }])
        return
      }

      setResume(data.resume)
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Done! I've updated your resume based on your request. You can see the changes in the preview.",
      }])
    } catch {
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.',
      }])
    } finally {
      setChatLoading(false)
    }
  }, [chatInput, resume, chatLoading])

  const handleDownload = useCallback(async () => {
    if (!resume) return
    setDownloading(true)
    try { await downloadAsPDF(resume) }
    finally { setDownloading(false) }
  }, [resume])

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={step === 'result' ? () => { setStep('input'); setResume(null); setMessages([]) } : onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {step === 'result'
            ? <><RotateCcw size={12} /> Regenerate</>
            : <><ChevronLeft size={13} /> Back to Analysis</>
          }
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-blue/20 bg-neon-blue/5 text-neon-blue text-xs font-mono">
          <Sparkles size={10} /> Generate Enhanced Resume
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-8"
          >
            <div className="relative w-24 h-24">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-neon-purple/30"
                  animate={{ scale: [1, 1.4 + i * 0.2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
                  <Sparkles size={20} className="text-neon-purple" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-mono text-foreground">Crafting your enhanced resume</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-neon-purple"
                >
                  {LOADING_STEPS[loadStep]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full"
                animate={{ width: `${((loadStep + 1) / LOADING_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ) : step === 'result' && resume ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Split panel */}
            <div className="grid lg:grid-cols-[1fr_380px] gap-4 h-[calc(100vh-320px)] min-h-[560px]">
              {/* LEFT — Resume Preview */}
              <div className="glass rounded-2xl border border-white/10 p-4 overflow-hidden flex flex-col">
                <ResumeCard resume={resume} onDownload={handleDownload} downloading={downloading} />
              </div>

              {/* RIGHT — Chat Panel */}
              <div className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                <ChatPanel
                  messages={messages}
                  input={chatInput}
                  loading={chatLoading}
                  onInputChange={setChatInput}
                  onSend={handleChatSend}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}
            <div className="mb-5 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                AI will rewrite your resume for <span className="text-foreground">{analysis.role}</span> using strong action verbs,
                quantified metrics, and ATS-optimized formatting — based on your analysis results.
              </p>
            </div>
            <GeneratorInputPanel onGenerate={handleGenerate} loading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
