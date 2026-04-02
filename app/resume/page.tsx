import type { Metadata } from 'next'
import { ResumeAnalyzer } from '@/components/resume/ResumeAnalyzer'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Resume Analyzer',
  description: 'Upload your resume and get instant AI-powered ATS score, skill gap analysis, and improvement suggestions.',
}

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-blue/20 bg-neon-blue/5 text-neon-blue text-xs font-mono mb-4">
            <Sparkles size={11} />
            Powered by GPT-4o mini
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="text-foreground">AI </span>
            <span className="text-gradient">Resume Analyzer</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Upload your resume and get an instant ATS score, skill gap analysis,
            and AI-powered rewrite suggestions tailored to your target role.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['ATS Score', 'Skill Gap', 'Content Issues', 'AI Rewrites', 'Role Matching'].map((f) => (
              <span key={f} className="text-[11px] font-mono px-3 py-1 rounded-full border border-white/10 text-muted-foreground bg-white/[0.02]">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="glass rounded-3xl border border-white/10 p-6 md:p-8">
          <ResumeAnalyzer />
        </div>

        {/* Privacy note */}
        <p className="text-center text-xs font-mono text-muted-foreground/40 mt-6">
          🔒 Your resume is never stored. Processed in memory and discarded immediately.
        </p>

      </div>
    </main>
  )
}
