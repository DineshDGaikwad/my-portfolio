'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { MotionSection, MotionDiv, fadeUp } from '@/components/animations/motion'
import { Badge } from '@/components/ui/Badge'
import { projects } from '@/data/projects'
import { Project, ProjectCategory } from '@/types'
import { Github, ExternalLink, ArrowRight, Star, Briefcase, GraduationCap } from '@/components/ui/Icons'
import { FilterButton } from '@/components/ui/FilterButton'
import { cn } from '@/lib/utils'

// ─── Filter definitions ───────────────────────────────────────────────────────

type SourceFilter = 'all' | 'internship' | 'college'
type CategoryFilter = 'all' | ProjectCategory

const sourceFilters: { key: SourceFilter; label: string; icon?: React.ElementType }[] = [
  { key: 'all', label: 'All' },
  { key: 'internship', label: 'Internship', icon: Briefcase },
  { key: 'college', label: 'College', icon: GraduationCap },
]

const categoryFilters: { key: CategoryFilter; label: string }[] = [
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'backend', label: 'Backend' },
  { key: 'frontend', label: 'Frontend' },
]

// fullstack projects also appear under frontend and backend filters
const categoryOverlap: Record<string, ProjectCategory[]> = {
  fullstack: ['fullstack', 'frontend', 'backend'],
  frontend: ['frontend', 'fullstack'],
  backend: ['backend', 'fullstack'],
  'ai-ml': ['ai-ml'],
  devops: ['devops'],
}

function matchesCategory(category: ProjectCategory, filter: CategoryFilter): boolean {
  if (filter === 'all') return true
  return (categoryOverlap[category] ?? [category]).includes(filter)
}

function filterProjects(list: Project[], source: SourceFilter, category: CategoryFilter): Project[] {
  return list.filter((p) => {
    const sourceMatch =
      source === 'all' ||
      (source === 'internship' && p.source === 'internship') ||
      (source === 'college' && p.source === 'personal')
    const categoryMatch = matchesCategory(p.category, category)
    return sourceMatch && categoryMatch
  })
}

// ─── Impact bar ───────────────────────────────────────────────────────────────

function getImpact(tagCount: number, hasMetrics: boolean) {
  const score = tagCount + (hasMetrics ? 3 : 0)
  if (score >= 8) return { label: 'High Impact', color: '#00ff88', width: '100%' }
  if (score >= 5) return { label: 'Mid Scale', color: '#00d4ff', width: '66%' }
  return { label: 'Focused', color: '#7c3aed', width: '33%' }
}

function ImpactBar({ color, width, delay }: { color: string; width: string; delay: number }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  return (
    <div ref={ref} className="h-full w-full">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: inView ? width : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay }}
      />
    </div>
  )
}

// ─── Category colors ──────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  fullstack: '#00d4ff',
  'ai-ml': '#7c3aed',
  backend: '#00ff88',
  frontend: '#ff0080',
  devops: '#ff9900',
}

// ─── Tilt card ────────────────────────────────────────────────────────────────

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')

  const filtered = filterProjects(projects, sourceFilter, categoryFilter)
  const filterKey = `${sourceFilter}-${categoryFilter}`

  return (
    <Section id="projects">
      <MotionSection>
        <SectionHeader
          command="fetch_projects"
          description="Production-grade systems with real architecture decisions"
          status="LOADED"
        />

        {/* Single filter row — source + category combined */}
        <MotionDiv variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filter projects">
          {sourceFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setSourceFilter(f.key)}
              aria-pressed={sourceFilter === f.key}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
                sourceFilter === f.key
                  ? 'bg-neon-blue text-black border-neon-blue'
                  : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
              )}
            >
              {f.icon && <f.icon size={13} aria-hidden="true" />}
              {f.label}
              <span className={cn(
                'text-2xs px-1.5 py-0.5 rounded-full font-mono',
                sourceFilter === f.key ? 'bg-black/20' : 'bg-white/10'
              )}>
                {f.key === 'all'
                  ? projects.length
                  : f.key === 'internship'
                  ? projects.filter(p => p.source === 'internship').length
                  : projects.filter(p => p.source === 'personal').length}
              </span>
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 self-center mx-1" aria-hidden="true" />

          {categoryFilters.map((f) => (
            <FilterButton
              key={f.key}
              label={f.label}
              active={categoryFilter === f.key}
              onClick={() => setCategoryFilter(f.key)}
            />
          ))}
        </MotionDiv>

        <AnimatePresence mode="wait">
          <motion.div
            key={filterKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.length === 0 ? (
              <div className="text-center py-20 glass rounded-2xl">
                <p className="text-muted-foreground text-sm">No projects match this filter.</p>
              </div>
            ) : (
              <ul
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                role="list"
                aria-label="Projects list"
              >
                {filtered.map((project, i) => {
                  const impact = getImpact(project.tags.length, !!project.metrics)
                  const catColor = categoryColors[project.category] ?? '#00d4ff'
                  const isInternship = project.source === 'internship'

                  return (
                    <motion.li
                      key={project.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col"
                    >
                      <TiltCard className="flex flex-col h-full">
                        <div
                          className={cn(
                            'group relative flex flex-col h-full glass rounded-2xl overflow-hidden',
                            'border border-white/10 hover:border-white/20 transition-all duration-300',
                          )}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Top color bar */}
                          <div
                            className="h-0.5 w-full"
                            style={{ background: `linear-gradient(90deg, ${catColor}80, transparent)` }}
                            aria-hidden="true"
                          />

                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                {/* Badges row */}
                                <div className="flex flex-wrap gap-1.5 mb-1.5">
                                  {project.featured && (
                                    <span
                                      className="inline-flex items-center gap-1 text-2xs font-mono px-2 py-0.5 rounded-full border"
                                      style={{ color: '#00ff88', borderColor: '#00ff8830', backgroundColor: '#00ff8808' }}
                                    >
                                      <Star size={9} aria-hidden="true" />
                                      Featured
                                    </span>
                                  )}
                                  {isInternship && (
                                    <span
                                      className="inline-flex items-center gap-1 text-2xs font-mono px-2 py-0.5 rounded-full border"
                                      style={{ color: '#ff9900', borderColor: '#ff990030', backgroundColor: '#ff990008' }}
                                    >
                                      <Briefcase size={9} aria-hidden="true" />
                                      Internship
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-semibold text-foreground group-hover:text-neon-blue transition-colors duration-200 leading-tight">
                                  {project.title}
                                </h3>
                              </div>
                              <span
                                className="text-2xs font-mono px-2 py-1 rounded-md ml-3 shrink-0"
                                style={{ color: catColor, backgroundColor: `${catColor}12` }}
                              >
                                {project.year}
                              </span>
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                              {project.tagline}
                            </p>

                            {/* Impact indicator */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-2xs font-mono text-muted-foreground/60 uppercase tracking-wider">Impact</span>
                                <span className="text-2xs font-mono" style={{ color: impact.color }}>{impact.label}</span>
                              </div>
                              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                                <ImpactBar color={impact.color} width={impact.width} delay={i * 0.05} />
                              </div>
                            </div>

                            {/* Metrics */}
                            {project.metrics && (
                              <dl className="flex gap-4 mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                {project.metrics.slice(0, 3).map((m) => (
                                  <div key={m.label} className="text-center flex-1">
                                    <dd className="text-sm font-bold font-mono" style={{ color: catColor }}>{m.value}</dd>
                                    <dt className="text-2xs text-muted-foreground mt-0.5">{m.label}</dt>
                                  </div>
                                ))}
                              </dl>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.slice(0, 4).map((tag) => (
                                <Badge key={tag}>{tag}</Badge>
                              ))}
                              {project.tags.length > 4 && (
                                <span className="text-2xs text-muted-foreground/50 self-center">
                                  +{project.tags.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="px-6 py-3.5 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex gap-3">
                              {project.links.github && (
                                <a
                                  href={project.links.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`${project.title} GitHub`}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Github size={15} aria-hidden="true" />
                                </a>
                              )}
                              {project.links.live && (
                                <a
                                  href={project.links.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`${project.title} live demo`}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink size={15} aria-hidden="true" />
                                </a>
                              )}
                            </div>
                            <Link
                              href={`/projects/${project.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-mono transition-all group/link"
                              style={{ color: catColor }}
                              aria-label={`${project.title} case study`}
                            >
                              Case Study
                              <ArrowRight size={11} className="transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </TiltCard>
                    </motion.li>
                  )
                })}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </MotionSection>
    </Section>
  )
}
