'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { architectures, getArchitectureBySlug } from '@/data/architectures'
import { ArchitectureDiagram, ArchLevel, ArchNode } from '@/data/architectures/types'
import { ArchDiagram } from './ArchDiagram'
import { DatabaseDiagram } from '@/components/architecture/DatabaseDiagram'
import { databaseSchemas } from '@/data/databaseSchemas'
import { cn } from '@/lib/utils'
import {
  Layers, Zap, Code2, X, ChevronRight, ArrowRight,
  Play, Square, Loader2, Database
} from '@/components/ui/Icons'

// ─── Project Selector ─────────────────────────────────────────────────────────
function ProjectSelector({
  selected,
  onSelect,
  compareId,
  onCompareSelect,
  compareMode,
}: {
  selected: ArchitectureDiagram
  onSelect: (a: ArchitectureDiagram) => void
  compareId: string | null
  onCompareSelect: (id: string | null) => void
  compareMode: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {architectures.map((arch) => {
        const isActive = selected.projectId === arch.projectId
        const isCompare = compareId === arch.projectId

        return (
          <button
            key={arch.projectId}
            onClick={() => {
              if (compareMode && !isActive) {
                onCompareSelect(isCompare ? null : arch.projectId)
              } else {
                onSelect(arch)
              }
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
              isActive && !compareMode
                ? 'bg-neon-blue/15 border-neon-blue text-neon-blue'
                : isCompare
                ? 'bg-neon-purple/15 border-neon-purple text-neon-purple'
                : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
            )}
            aria-pressed={isActive}
          >
            {arch.projectTitle}
          </button>
        )
      })}
    </div>
  )
}

// ─── Level Tabs ───────────────────────────────────────────────────────────────
function LevelTabs({
  levels,
  active,
  onSelect,
}: {
  levels: ArchitectureDiagram['levels']
  active: ArchLevel
  onSelect: (l: ArchLevel) => void
}) {
  const icons: Record<ArchLevel, React.ElementType> = {
    overview: Layers,
    service: Zap,
    detail: Code2,
  }

  return (
    <div className="flex gap-1" role="tablist">
      {levels.map((l) => {
        const Icon = icons[l.level]
        const isActive = active === l.level
        return (
          <button
            key={l.level}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(l.level)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
              isActive
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            <Icon size={11} aria-hidden="true" />
            {l.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Node Detail Panel ────────────────────────────────────────────────────────
function NodeDetailPanel({
  node,
  onClose,
}: {
  node: ArchNode
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-white/10 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm" style={{ color: node.color }}>
              {node.details.title}
            </h4>
            {node.details.role && (
              <p className="text-2xs font-mono text-muted-foreground/60 mt-0.5 uppercase tracking-wider">
                {node.details.role}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors ml-3 shrink-0"
            aria-label="Close detail panel"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 max-w-2xl">
          {node.details.description}
        </p>

        {node.details.decisions && node.details.decisions.length > 0 && (
          <div className="mb-3">
            <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-1.5">
              Design Decisions
            </p>
            {node.details.decisions.map((d, i) => (
              <div key={i} className="flex gap-2 text-xs text-muted-foreground mb-1">
                <ChevronRight size={11} className="mt-0.5 shrink-0" style={{ color: node.color }} aria-hidden="true" />
                {d}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {node.details.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-2xs font-mono border"
              style={{
                borderColor: `${node.color}30`,
                color: node.color,
                backgroundColor: `${node.color}10`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── AI Explanation Panel ─────────────────────────────────────────────────────
function AIExplanationPanel({
  arch,
  onClose,
}: {
  arch: ArchitectureDiagram
  onClose: () => void
}) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setText('')
    setLoading(true)

    const prompt = `Explain this system architecture in 3-4 concise sentences for a technical recruiter. Focus on: what it does, key design decisions, and why the tech choices make sense.\n\nContext: ${arch.aiContext}`

    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setText(d.content ?? arch.summary)
        setLoading(false)
      })
      .catch(() => {
        setText(arch.summary)
        setLoading(false)
      })
  }, [arch.projectId])

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-white/10 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xs font-bold text-black">
              AI
            </div>
            <span className="text-xs font-mono text-neon-blue">Architecture Explanation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close AI explanation"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            Analyzing architecture...
          </div>
        ) : (
          <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Compare Panel ────────────────────────────────────────────────────────────
function ComparePanel({
  archA,
  archB,
}: {
  archA: ArchitectureDiagram
  archB: ArchitectureDiagram
}) {
  const levelA = archA.levels[0]
  const levelB = archB.levels[0]

  const techA = new Set(levelA.nodes.flatMap((n) => n.details.tech))
  const techB = new Set(levelB.nodes.flatMap((n) => n.details.tech))
  const shared = Array.from(techA).filter((t) => techB.has(t))
  const onlyA = Array.from(techA).filter((t) => !techB.has(t))
  const onlyB = Array.from(techB).filter((t) => !techA.has(t))

  return (
    <div className="grid md:grid-cols-2 gap-4 p-5 border-t border-white/10">
      {/* Diagrams side by side */}
      <div>
        <p className="text-xs font-mono text-neon-blue mb-2">{archA.projectTitle}</p>
        <div className="glass rounded-xl overflow-hidden">
          <ArchDiagram
            levelData={levelA}
            onNodeClick={() => {}}
          />
        </div>
        <p className="text-2xs text-muted-foreground mt-2">{levelA.nodes.length} components · {levelA.edges.length} connections</p>
      </div>
      <div>
        <p className="text-xs font-mono text-neon-purple mb-2">{archB.projectTitle}</p>
        <div className="glass rounded-xl overflow-hidden">
          <ArchDiagram
            levelData={levelB}
            onNodeClick={() => {}}
          />
        </div>
        <p className="text-2xs text-muted-foreground mt-2">{levelB.nodes.length} components · {levelB.edges.length} connections</p>
      </div>

      {/* Tech diff */}
      <div className="md:col-span-2 grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4">
          <p className="text-2xs font-mono text-neon-green uppercase tracking-wider mb-2">Shared Tech</p>
          <div className="flex flex-wrap gap-1">
            {shared.length > 0
              ? shared.map((t) => (
                  <span key={t} className="text-2xs px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/20 text-neon-green font-mono">{t}</span>
                ))
              : <span className="text-2xs text-muted-foreground">None</span>
            }
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-2xs font-mono text-neon-blue uppercase tracking-wider mb-2">Only in {archA.projectTitle}</p>
          <div className="flex flex-wrap gap-1">
            {onlyA.slice(0, 8).map((t) => (
              <span key={t} className="text-2xs px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20 text-neon-blue font-mono">{t}</span>
            ))}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-2xs font-mono text-neon-purple uppercase tracking-wider mb-2">Only in {archB.projectTitle}</p>
          <div className="flex flex-wrap gap-1">
            {onlyB.slice(0, 8).map((t) => (
              <span key={t} className="text-2xs px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/20 text-neon-purple font-mono">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Engine ──────────────────────────────────────────────────────────────
export function SystemDesignEngine({ initialSlug }: { initialSlug?: string } = {}) {
  const initial = (initialSlug ? architectures.find((a) => a.projectSlug === initialSlug) : null) ?? architectures[0]
  const [selected, setSelected] = useState<ArchitectureDiagram>(initial)
  const [activeLevel, setActiveLevel] = useState<ArchLevel>('overview')
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null)
  const [showAI, setShowAI] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [compareId, setCompareId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [activeFlowNodeId, setActiveFlowNodeId] = useState<string | null>(null)
  const [showDB, setShowDB] = useState(false)
  const simRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentLevelData = selected.levels.find((l) => l.level === activeLevel)
    ?? selected.levels[0]

  const compareArch = compareId ? architectures.find((a) => a.projectId === compareId) : null

  // Reset state when project changes
  const handleProjectSelect = useCallback((arch: ArchitectureDiagram) => {
    setSelected(arch)
    setSelectedNode(null)
    setShowAI(false)
    setIsSimulating(false)
    setActiveFlowNodeId(null)
    setShowDB(false)
    setActiveLevel(arch.levels[0]?.level ?? 'overview')
    if (simRef.current) clearTimeout(simRef.current)
  }, [])

  // Flow simulation
  const runSimulation = useCallback(() => {
    if (!selected.flowSteps || selected.flowSteps.length === 0) return
    setIsSimulating(true)
    setSelectedNode(null)
    setShowAI(false)

    let delay = 0
    selected.flowSteps.forEach((step, i) => {
      simRef.current = setTimeout(() => {
        setActiveFlowNodeId(step.nodeId)
        if (i === selected.flowSteps!.length - 1) {
          setTimeout(() => {
            setIsSimulating(false)
            setActiveFlowNodeId(null)
          }, step.duration)
        }
      }, delay)
      delay += step.duration
    })
  }, [selected])

  const stopSimulation = useCallback(() => {
    if (simRef.current) clearTimeout(simRef.current)
    setIsSimulating(false)
    setActiveFlowNodeId(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (simRef.current) clearTimeout(simRef.current) }
  }, [])

  const hasFlowSteps = (selected.flowSteps?.length ?? 0) > 0
  const hasDBSchema = databaseSchemas.some((s) => s.projectSlug === selected.projectSlug)

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10">
      {/* ── Header ── */}
      <div className="px-5 py-3 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-neon-blue" aria-hidden="true" />
            <span className="text-sm font-mono text-foreground">System Design Explorer</span>
            {isSimulating && (
              <span className="flex items-center gap-1 text-2xs font-mono text-neon-green">
                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" aria-hidden="true" />
                Simulating
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* AI Explain */}
            <button
              onClick={() => { setShowAI((v) => !v); setSelectedNode(null) }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-2xs font-mono border transition-all',
                showAI
                  ? 'border-neon-blue/50 text-neon-blue bg-neon-blue/10'
                  : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
              )}
              aria-pressed={showAI}
            >
              <span className="text-2xs">AI</span>
              Explain
            </button>

            {/* Compare */}
            <button
              onClick={() => {
                setCompareMode((v) => !v)
                setCompareId(null)
              }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-2xs font-mono border transition-all',
                compareMode
                  ? 'border-neon-purple/50 text-neon-purple bg-neon-purple/10'
                  : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
              )}
              aria-pressed={compareMode}
            >
              Compare
            </button>

            {/* Simulate */}
            {hasFlowSteps && (
              <button
                disabled={compareMode}
                onClick={isSimulating ? stopSimulation : runSimulation}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-2xs font-mono border transition-all',
                  compareMode
                    ? 'border-white/5 text-muted-foreground/30 cursor-not-allowed'
                    : isSimulating
                    ? 'border-neon-green/50 text-neon-green bg-neon-green/10'
                    : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
                )}
                aria-label={isSimulating ? 'Stop simulation' : 'Run flow simulation'}
              >
                {isSimulating
                  ? <><Square size={10} aria-hidden="true" /> Stop</>
                  : <><Play size={10} aria-hidden="true" /> Simulate</>
                }
              </button>
            )}
          </div>
        </div>

        {/* Project selector */}
        <ProjectSelector
          selected={selected}
          onSelect={handleProjectSelect}
          compareId={compareId}
          onCompareSelect={setCompareId}
          compareMode={compareMode}
        />
      </div>

      {/* ── Compare mode ── */}
      {compareMode && compareArch ? (
        <ComparePanel archA={selected} archB={compareArch} />
      ) : (
        <>
          {/* ── Level tabs + summary ── */}
          <div className="px-5 py-2.5 border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-2xs text-muted-foreground truncate">
                {showDB ? 'Entity-relationship schema for this project' : currentLevelData.description}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <LevelTabs
                levels={selected.levels}
                active={showDB ? ('' as ArchLevel) : activeLevel}
                onSelect={(l) => { setActiveLevel(l); setSelectedNode(null); setShowDB(false) }}
              />
              {/* DB Schema toggle */}
              <button
                onClick={() => {
                  setShowDB((v) => !v)
                  setSelectedNode(null)
                  setShowAI(false)
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
                  showDB
                    ? 'bg-neon-blue/15 border border-neon-blue text-neon-blue'
                    : hasDBSchema
                    ? 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                    : 'text-muted-foreground/30 cursor-not-allowed border border-transparent'
                )}
                disabled={!hasDBSchema}
                aria-pressed={showDB}
                title={hasDBSchema ? 'View database schema' : 'No DB schema for this project'}
              >
                <Database size={11} aria-hidden="true" />
                DB Schema
              </button>
            </div>
          </div>

          {/* ── Diagram or DB Schema ── */}
          <AnimatePresence mode="wait">
            {showDB ? (
              <motion.div
                key={`db-${selected.projectId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DatabaseDiagram projectSlug={selected.projectSlug} />
              </motion.div>
            ) : (
              <motion.div
                key={`${selected.projectId}-${activeLevel}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-3"
              >
                <ArchDiagram
                  levelData={currentLevelData}
                  flowSteps={selected.flowSteps}
                  isSimulating={isSimulating}
                  activeFlowNodeId={activeFlowNodeId}
                  onNodeClick={(node) => {
                    if (!isSimulating) {
                      setSelectedNode((prev) => prev?.id === node.id ? null : node)
                      setShowAI(false)
                    }
                  }}
                  selectedNodeId={selectedNode?.id ?? null}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Flow step indicator ── */}
          {!showDB && isSimulating && selected.flowSteps && (
            <div className="px-5 pb-3">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {selected.flowSteps.map((step, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-2xs font-mono whitespace-nowrap transition-all',
                      activeFlowNodeId === step.nodeId
                        ? 'bg-neon-green/15 text-neon-green border border-neon-green/30'
                        : 'text-muted-foreground/40'
                    )}
                  >
                    <span className="font-bold">{i + 1}.</span>
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Compare hint ── */}
          {compareMode && !compareArch && (
            <div className="px-5 pb-4 text-center">
              <p className="text-xs text-muted-foreground font-mono">
                Select a second project above to compare architectures
              </p>
            </div>
          )}

          {/* ── Node detail panel ── */}
          <AnimatePresence>
            {!showDB && selectedNode && !showAI && (
              <NodeDetailPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </AnimatePresence>

          {/* ── AI explanation panel ── */}
          <AnimatePresence>
            {!showDB && showAI && (
              <AIExplanationPanel
                arch={selected}
                onClose={() => setShowAI(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── Footer ── */}
      <div className="px-5 py-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-2xs text-muted-foreground/40 font-mono">
          {compareMode
            ? 'Select a second project to compare'
            : isSimulating
            ? 'Watching request flow...'
            : 'Click nodes to explore · Hover to highlight connections'
          }
        </span>
        <a
          href={`/projects/${selected.projectSlug}`}
          className="inline-flex items-center gap-1 text-2xs text-neon-blue hover:underline font-mono"
        >
          Full case study <ArrowRight size={10} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
