'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skills } from '@/data/skills'
import { SkillCategory } from '@/types'
import { cn } from '@/lib/utils'

interface GraphNode {
  id: SkillCategory | 'core'
  label: string
  x: number
  y: number
  color: string
  size: number
  isCenter?: boolean
}

const nodes: GraphNode[] = [
  { id: 'core',     label: 'Dinesh',   x: 50, y: 50, color: '#00d4ff', size: 42, isCenter: true },
  { id: 'frontend', label: 'Frontend', x: 50, y: 10, color: '#61dafb', size: 30 },
  { id: 'backend',  label: 'Backend',  x: 87, y: 32, color: '#009688', size: 30 },
  { id: 'database', label: 'Database', x: 80, y: 76, color: '#47a248', size: 26 },
  { id: 'cloud',    label: 'Cloud',    x: 20, y: 76, color: '#ff9900', size: 26 },
  { id: 'devops',   label: 'DevOps',   x: 13, y: 32, color: '#f05032', size: 24 },
  { id: 'ai-ml',    label: 'AI / ML',  x: 50, y: 88, color: '#7c3aed', size: 24 },
]

const edges = [
  { from: 'core', to: 'frontend' },
  { from: 'core', to: 'backend' },
  { from: 'core', to: 'database' },
  { from: 'core', to: 'cloud' },
  { from: 'core', to: 'devops' },
  { from: 'core', to: 'ai-ml' },
  { from: 'frontend', to: 'backend' },
  { from: 'backend', to: 'database' },
  { from: 'backend', to: 'cloud' },
  { from: 'cloud', to: 'devops' },
  { from: 'database', to: 'ai-ml' },
]

const W = 480
const H = 340

function getPos(node: GraphNode) {
  return { x: (node.x / 100) * W, y: (node.y / 100) * H }
}

// Animated dot travelling along an edge
function EdgeParticle({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <motion.circle
      r={2.5}
      fill={color}
      style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      initial={{ offsetDistance: '0%' }}
      animate={{ offsetDistance: '100%' }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
      // fallback: animate cx/cy
      cx={x1} cy={y1}
    >
      <animateMotion
        dur="1.4s"
        repeatCount="indefinite"
        path={`M ${x1} ${y1} L ${x2} ${y2}`}
      />
    </motion.circle>
  )
}

export function SkillsGraph() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [floatOffset, setFloatOffset] = useState<Record<string, { dx: number; dy: number }>>({})

  // Subtle floating animation for nodes
  useEffect(() => {
    const offsets: Record<string, { dx: number; dy: number }> = {}
    nodes.forEach((n) => {
      offsets[n.id] = {
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
      }
    })
    setFloatOffset(offsets)
  }, [])

  const activeNode = hovered ? nodes.find((n) => n.id === hovered) : null
  const activeSkills = hovered && hovered !== 'core'
    ? skills.filter((s) => s.category === hovered)
    : []

  const connectedIds = hovered
    ? new Set(edges.filter((e) => e.from === hovered || e.to === hovered).flatMap((e) => [e.from, e.to]))
    : new Set<string>()

  const totalSkills = skills.length

  return (
    <div className="mb-20">
      <div className="mb-8">
        <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-1">Skills</p>
        <h3 className="text-xl font-bold text-foreground">
          Skill Network
          <span className="block text-xs font-normal text-muted-foreground mt-1 font-mono">
            Hover nodes to explore · {totalSkills} skills across {nodes.length - 1} domains
          </span>
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">

        {/* ── Graph ── */}
        <div className="glass rounded-2xl p-3 overflow-hidden relative">
          {/* Background grid dots */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-2xl"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full relative z-10"
            style={{ aspectRatio: `${W}/${H}` }}
            role="img"
            aria-label="Skills network diagram"
          >
            <defs>
              {nodes.filter(n => !n.isCenter).map((n) => (
                <linearGradient key={n.id} id={`grad-${n.id}`} gradientUnits="userSpaceOnUse"
                  x1={getPos(nodes.find(x => x.id === 'core')!).x}
                  y1={getPos(nodes.find(x => x.id === 'core')!).y}
                  x2={getPos(n).x} y2={getPos(n).y}
                >
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor={n.color} stopOpacity="0.6" />
                </linearGradient>
              ))}
              <filter id="glow-strong">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-soft">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.id === edge.from)!
              const to   = nodes.find((n) => n.id === edge.to)!
              const fp   = getPos(from)
              const tp   = getPos(to)
              const isHighlighted = hovered && (edge.from === hovered || edge.to === hovered)
              const isCoreEdge = edge.from === 'core' || edge.to === 'core'
              const otherNode = isCoreEdge ? (edge.from === 'core' ? to : from) : null

              return (
                <g key={i}>
                  <motion.line
                    x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                    stroke={
                      isHighlighted
                        ? (isCoreEdge && otherNode ? `url(#grad-${otherNode.id})` : from.color)
                        : 'rgba(255,255,255,0.06)'
                    }
                    strokeWidth={isHighlighted ? 2 : 1}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                  />
                  {/* Travelling particle on highlighted edges */}
                  {isHighlighted && (
                    <EdgeParticle
                      x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                      color={isCoreEdge && otherNode ? otherNode.color : from.color}
                    />
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const { x, y } = getPos(node)
              const isHovered   = hovered === node.id
              const isConnected = connectedIds.has(node.id)
              const isDimmed    = !!hovered && !isConnected && hovered !== node.id
              const r           = node.size / 2
              const skillCount  = node.isCenter ? totalSkills : skills.filter(s => s.category === node.id).length

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isDimmed ? 0.2 : 1,
                    scale: isHovered ? 1.18 : 1,
                  }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ cursor: 'pointer', transformOrigin: `${x}px ${y}px` }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  role="button"
                  aria-label={`${node.label} skills`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setHovered(hovered === node.id ? null : node.id)}
                >
                  {/* Outer pulse ring */}
                  {isHovered && (
                    <motion.circle
                      cx={x} cy={y} r={r + 10}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={1}
                      strokeOpacity={0.3}
                      animate={{ r: [r + 8, r + 14, r + 8], strokeOpacity: [0.4, 0.1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Glow fill */}
                  {(isHovered || isConnected) && (
                    <circle
                      cx={x} cy={y} r={r + 4}
                      fill={`${node.color}10`}
                      filter="url(#glow-soft)"
                    />
                  )}

                  {/* Main circle */}
                  <circle
                    cx={x} cy={y} r={r}
                    fill={isHovered ? `${node.color}22` : node.isCenter ? `${node.color}18` : 'rgba(255,255,255,0.04)'}
                    stroke={isHovered ? node.color : isConnected ? `${node.color}80` : 'rgba(255,255,255,0.12)'}
                    strokeWidth={isHovered ? 2 : 1}
                    filter={isHovered ? 'url(#glow-soft)' : undefined}
                  />

                  {/* Label */}
                  <text
                    x={x} y={node.isCenter ? y - 3 : y - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={node.isCenter ? 9.5 : 8}
                    fontWeight={node.isCenter ? '700' : '600'}
                    fill={isHovered ? node.color : isConnected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'}
                    fontFamily="monospace"
                    filter={isHovered ? 'url(#glow-soft)' : undefined}
                  >
                    {node.label}
                  </text>

                  {/* Skill count badge */}
                  <text
                    x={x} y={node.isCenter ? y + 7 : y + 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6.5}
                    fill={isHovered ? `${node.color}cc` : 'rgba(255,255,255,0.3)'}
                    fontFamily="monospace"
                  >
                    {node.isCenter ? `${skillCount} skills` : `×${skillCount}`}
                  </text>
                </motion.g>
              )
            })}
          </svg>
        </div>

        {/* ── Skill panel ── */}
        <div className="min-h-[240px]">
          <AnimatePresence mode="wait">
            {activeNode && activeNode.id !== 'core' ? (
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: activeNode.color }}>
                    {activeNode.label}
                  </p>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{ color: activeNode.color, borderColor: `${activeNode.color}30`, backgroundColor: `${activeNode.color}10` }}
                  >
                    {activeSkills.length} skills
                  </span>
                </div>

                <div className="space-y-3">
                  {activeSkills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-foreground font-mono">{skill.name}</span>
                        <span className="text-[10px] font-mono" style={{ color: skill.color || activeNode.color }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: skill.color || activeNode.color,
                            boxShadow: `0 0 6px ${skill.color || activeNode.color}80`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.04 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center h-full gap-5"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hover any node to explore skills in that domain and see how they interconnect across the stack.
                </p>

                {/* Category summary */}
                <div className="grid grid-cols-2 gap-2">
                  {nodes.filter((n) => !n.isCenter).map((n) => {
                    const count = skills.filter(s => s.category === n.id).length
                    const avg   = Math.round(skills.filter(s => s.category === n.id).reduce((a, s) => a + s.level, 0) / count)
                    return (
                      <motion.button
                        key={n.id}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => setHovered(n.id)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/20 transition-all text-left"
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: n.color, boxShadow: `0 0 6px ${n.color}` }} />
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono text-foreground/80 truncate">{n.label}</p>
                          <p className="text-[9px] font-mono text-muted-foreground/50">{count} skills · avg {avg}%</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
