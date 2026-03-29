'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Project } from '@/types'
import { projects } from '@/data/projects'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import {
  ExternalLink, ChevronRight, Layers, Zap,
  CheckCircle2, AlertCircle, BarChart2, Loader2,
  Briefcase, Star, ArrowRight,
} from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

// Lazy-load the architecture diagram — it's SVG-heavy
const SystemDesignEngine = dynamic(
  () => import('@/components/sections/SystemDesignEngine').then((m) => ({ default: m.SystemDesignEngine })),
  {
    ssr: false,
    loading: () => (
      <div className="glass rounded-2xl h-48 animate-pulse flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-mono">Loading architecture diagram...</span>
      </div>
    ),
  }
)

// ─── Section IDs ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'overview',      label: 'Overview',       icon: Layers },
  { id: 'features',      label: 'Features',        icon: Star },
  { id: 'architecture',  label: 'Architecture',    icon: Zap },
  { id: 'contributions', label: 'Contributions',   icon: Briefcase },
  { id: 'challenges',    label: 'Challenges',      icon: AlertCircle },
  { id: 'impact',        label: 'Impact',          icon: BarChart2 },
] as const

type SectionId = typeof SECTIONS[number]['id']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionBlock({ id, title, children, accent }: {
  id: string
  title: string
  children: React.ReactNode
  accent?: string
}) {
  return (
    <section id={id} className="scroll-mt-32 mb-16" aria-label={title}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-6 rounded-full"
          style={{ backgroundColor: accent || '#00d4ff' }}
          aria-hidden="true"
        />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ─── AI Explain ───────────────────────────────────────────────────────────────

function AIExplainButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const explain = async () => {
    if (text) { setOpen(true); return }
    setOpen(true)
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Explain the "${project.title}" project in 3-4 sentences for a technical recruiter. Cover: what it does, the key technical decisions, and what makes it impressive. Context: ${project.description}. Architecture: ${project.caseStudy.architecture}`,
          }],
        }),
      })
      const data = await res.json()
      setText(data.content ?? project.description)
    } catch {
      setText(project.description)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={explain}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-neon-blue/20 text-xs font-mono text-neon-blue hover:bg-neon-blue/10 transition-all"
      >
        <span className="w-4 h-4 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xs font-bold text-black">AI</span>
        Explain this project
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden mt-3"
          >
            <div className="glass rounded-xl p-4 border border-neon-blue/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xs font-mono text-neon-blue uppercase tracking-wider">AI Explanation</span>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 size={12} className="animate-spin" />
                  Analyzing project...
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Sticky Sidebar ───────────────────────────────────────────────────────────

function Sidebar({ active, currentSlug }: { active: SectionId; currentSlug: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <aside className="hidden lg:block w-44 shrink-0" aria-label="Section navigation">
      <div className="sticky top-28 space-y-0.5">

        {/* Project list */}
        <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-2 px-3">
          Projects
        </p>
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all text-left truncate block',
              p.slug === currentSlug
                ? 'text-neon-blue bg-neon-blue/10 font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: p.source === 'internship' ? '#ff9900' : '#00d4ff' }}
              aria-hidden="true"
            />
            <span className="truncate">{p.title}</span>
          </Link>
        ))}

        {/* Divider */}
        <div className="h-px bg-white/10 my-3 mx-3" aria-hidden="true" />

        {/* Contents */}
        <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-2 px-3">
          Contents
        </p>
        {SECTIONS.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left',
                isActive
                  ? 'text-neon-blue bg-neon-blue/10 font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <s.icon size={12} aria-hidden="true" />
              {s.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CaseStudyClient({ project }: { project: Project }) {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const { caseStudy } = project
  const catColor = project.source === 'internship' ? '#ff9900' : '#00d4ff'

  // Scroll spy
  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id as SectionId) },
        { threshold: 0.3, rootMargin: '-100px 0px 0px 0px' }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <div className="min-h-screen pt-20">

      {/* ── Hero ── */}
      <div className="relative py-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${catColor}08, transparent)` }}
          aria-hidden="true"
        />
        <div className="max-w-5xl mx-auto relative">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors group"
          >
            <ChevronRight size={14} className="rotate-180 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Back to Projects
          </Link>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Badges */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              {project.source === 'internship' && (
                <span
                  className="inline-flex items-center gap-1 text-2xs font-mono px-2.5 py-1 rounded-full border"
                  style={{ color: '#ff9900', borderColor: '#ff990030', backgroundColor: '#ff990010' }}
                >
                  <Briefcase size={10} aria-hidden="true" />
                  Internship @ KANINI
                </span>
              )}
              {project.tags.slice(0, 5).map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="text-4xl md:text-6xl font-bold mb-3 leading-tight"
            >
              {project.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="text-lg text-muted-foreground max-w-2xl mb-6"
            >
              {project.tagline}
            </motion.p>

            {/* CTAs + AI */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center gap-3"
            >
              {project.links.live && (
                <Button href={project.links.live}>
                  <ExternalLink size={14} aria-hidden="true" /> Live Demo
                </Button>
              )}
              <AIExplainButton project={project} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Metrics bar ── */}
      {project.metrics && (
        <div className="border-y border-border py-5 px-4 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-10">
            {project.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-2xl font-bold font-mono" style={{ color: catColor }}>{m.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-5xl mx-auto px-4 py-12 flex gap-12">
        <Sidebar active={activeSection} currentSlug={project.slug} />

        <div className="flex-1 min-w-0">

          {/* 1. Overview */}
          <SectionBlock id="overview" title="Overview" accent={catColor}>
            {/* Description */}
            <ScrollReveal>
              <div className="glass rounded-2xl p-6">
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            </ScrollReveal>

            {/* Detailed problem context */}
            {caseStudy.problemDetailed && (
              <ScrollReveal delay={0.05} className="mt-4">
                <div className="glass rounded-2xl p-6 border-l-2 border-amber-500/40">
                  <p className="text-2xs font-mono text-amber-400 uppercase tracking-wider mb-3">Background & Context</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{caseStudy.problemDetailed}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Tech stack */}
            <ScrollReveal delay={0.1} className="mt-4">
              <div className="glass rounded-2xl p-6">
                <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-4">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.techStack.map((tech) => (
                    <span
                      key={tech.name}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono border hover:scale-105 transition-transform"
                      style={{
                        color: tech.color || catColor,
                        borderColor: `${tech.color || catColor}30`,
                        backgroundColor: `${tech.color || catColor}10`,
                      }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Extended features grouped */}
            {caseStudy.featuresExtended && caseStudy.featuresExtended.length > 0 && (
              <ScrollReveal delay={0.15} className="mt-4">
                <div className="glass rounded-2xl p-6">
                  <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider mb-4">Feature Breakdown</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {caseStudy.featuresExtended.map((group) => (
                      <div key={group.category} className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
                        <p className="text-xs font-semibold text-foreground mb-3" style={{ color: catColor }}>{group.category}</p>
                        <ul className="space-y-1.5">
                          {group.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: catColor }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Performance notes */}
            {caseStudy.performanceNotes && caseStudy.performanceNotes.length > 0 && (
              <ScrollReveal delay={0.2} className="mt-4">
                <div className="glass rounded-2xl p-6 border-l-2 border-neon-green/30">
                  <p className="text-2xs font-mono text-neon-green uppercase tracking-wider mb-3">Performance Optimizations</p>
                  <ul className="space-y-2">
                    {caseStudy.performanceNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-green/60 shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}

            {/* Learnings + Future improvements side by side */}
            {(caseStudy.learnings?.length || caseStudy.futureImprovements?.length) ? (
              <ScrollReveal delay={0.25} className="mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {caseStudy.learnings && caseStudy.learnings.length > 0 && (
                    <div className="glass rounded-2xl p-5">
                      <p className="text-2xs font-mono text-neon-blue uppercase tracking-wider mb-3">Key Learnings</p>
                      <ul className="space-y-2">
                        {caseStudy.learnings.map((l, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-blue/60 shrink-0" />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {caseStudy.futureImprovements && caseStudy.futureImprovements.length > 0 && (
                    <div className="glass rounded-2xl p-5">
                      <p className="text-2xs font-mono text-neon-purple uppercase tracking-wider mb-3">Future Improvements</p>
                      <ul className="space-y-2">
                        {caseStudy.futureImprovements.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-purple/60 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ) : null}
          </SectionBlock>

          {/* 3. Features */}
          {caseStudy.features && caseStudy.features.length > 0 && (
            <SectionBlock id="features" title="Key Features" accent="#7c3aed">
              <div className="grid sm:grid-cols-2 gap-3">
                {caseStudy.features.map((feature, i) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className="glass rounded-xl p-4 flex items-start gap-3 hover:border-white/20 transition-all">
                      <CheckCircle2 size={15} className="text-neon-green shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* 4. Architecture */}
          <SectionBlock id="architecture" title="Architecture" accent="#00ff88">
            <ScrollReveal>
              {/* Flow string */}
              <div className="glass rounded-2xl p-5 mb-4 font-mono text-sm bg-black/20 border border-neon-blue/10">
                <p className="text-2xs text-muted-foreground/50 uppercase tracking-wider font-mono mb-3">System Flow</p>
                <div className="flex flex-wrap items-center gap-2">
                  {caseStudy.architecture.split('→').map((part, i, arr) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="text-foreground text-xs">{part.trim()}</span>
                      {i < arr.length - 1 && (
                        <ArrowRight size={12} className="text-neon-blue/50 shrink-0" aria-hidden="true" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Interactive diagram — only for projects that have one */}
            <ScrollReveal delay={0.1}>
              <div className="mb-2">
                <SystemDesignEngine initialSlug={project.slug} />
              </div>
            </ScrollReveal>
          </SectionBlock>

          {/* 5. Contributions */}
          {caseStudy.contributions && caseStudy.contributions.length > 0 && (
            <SectionBlock id="contributions" title="My Contributions" accent="#ff9900">
              <div className="space-y-2.5">
                {caseStudy.contributions.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className="glass rounded-xl p-4 flex items-start gap-3 hover:border-white/20 transition-all group">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: '#ff990015', color: '#ff9900' }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                        {item}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* 5b. Challenges & Solutions (merged with Problem) */}
          <SectionBlock id="challenges" title="Challenges & Solutions" accent="#00d4ff">
            <div className="space-y-4">
              {/* Problem card — same structure as challenge cards */}
              <ScrollReveal>
                <div className="glass rounded-2xl p-6 border-l-2 border-red-500/30">
                  <h4 className="font-semibold text-sm mb-2" style={{ color: '#f87171' }}>The Problem</h4>
                  <p className="text-muted-foreground text-xs mb-4 leading-relaxed">{caseStudy.problem}</p>
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/20">
                    <span className="text-2xs font-mono text-neon-blue shrink-0 uppercase tracking-wider mt-0.5">Approach</span>
                    <p className="text-xs text-foreground leading-relaxed">{caseStudy.approach}</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Core challenges */}
              {[...caseStudy.challenges, ...(caseStudy.challengesExtended ?? [])].map((c, i) => (
                <ScrollReveal key={i} delay={0.08 + i * 0.06}>
                  <div className="glass rounded-2xl p-6 border-l-2 border-red-500/30">
                    <h4 className="font-semibold text-sm mb-2" style={{ color: '#f87171' }}>{c.title}</h4>
                    <p className="text-muted-foreground text-xs mb-4 leading-relaxed">{c.description}</p>
                    <div className="flex gap-3 items-start p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
                      <span className="text-2xs font-mono text-neon-green shrink-0 uppercase tracking-wider mt-0.5">Solution</span>
                      <p className="text-xs text-foreground leading-relaxed">{c.solution}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              {/* Edge cases */}
              {caseStudy.edgeCases && caseStudy.edgeCases.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <div className="glass rounded-2xl p-6 border-l-2 border-amber-500/30">
                    <p className="text-2xs font-mono text-amber-400 uppercase tracking-wider mb-3">Edge Cases Handled</p>
                    <ul className="space-y-2">
                      {caseStudy.edgeCases.map((e, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Security notes */}
              {caseStudy.securityNotes && caseStudy.securityNotes.length > 0 && (
                <ScrollReveal delay={0.12}>
                  <div className="glass rounded-2xl p-6 border-l-2 border-neon-purple/30">
                    <p className="text-2xs font-mono text-neon-purple uppercase tracking-wider mb-3">Security Considerations</p>
                    <ul className="space-y-2">
                      {caseStudy.securityNotes.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-purple/60 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </SectionBlock>

          {/* 7. Impact / Results */}
          <SectionBlock id="impact" title="Impact & Results" accent="#00ff88">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {caseStudy.results.map((r, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="glass rounded-2xl p-5 text-center hover:border-neon-blue/30 transition-all">
                    <div className="text-2xl font-bold font-mono mb-1" style={{ color: catColor }}>{r.value}</div>
                    <div className="text-xs font-medium text-foreground mb-1">{r.metric}</div>
                    <div className="text-2xs text-muted-foreground">{r.description}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {project.metrics && (
              <ScrollReveal delay={0.2}>
                <div className="glass rounded-2xl p-5">
                  <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-4">Key Metrics</p>
                  <div className="grid grid-cols-3 gap-3">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-xl font-bold font-mono" style={{ color: catColor }}>{m.value}</div>
                        <div className="text-2xs text-muted-foreground mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </SectionBlock>

          {/* Next project link */}
          <div className="pt-8 border-t border-border flex items-center justify-between">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" aria-hidden="true" />
              All Projects
            </Link>
            <span className="text-2xs text-muted-foreground/40 font-mono">{project.year}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
