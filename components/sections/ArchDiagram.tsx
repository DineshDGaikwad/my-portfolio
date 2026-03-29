'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArchNode, ArchEdge, ArchLevel_Data, FlowStep } from '@/data/architectures/types'
import { cn } from '@/lib/utils'

const W = 640
const H = 340
const NODE_W = 118
const NODE_H = 42

function getCenter(node: ArchNode) {
  return { x: (node.x / 100) * W, y: (node.y / 100) * H }
}

interface DiagramProps {
  levelData: ArchLevel_Data
  flowSteps?: FlowStep[]
  isSimulating?: boolean
  activeFlowNodeId?: string | null
  onNodeClick: (node: ArchNode) => void
  selectedNodeId?: string | null
}

export function ArchDiagram({
  levelData,
  isSimulating,
  activeFlowNodeId,
  onNodeClick,
  selectedNodeId,
}: DiagramProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // Determine which edges to highlight based on hover or selection
  const activeId = hoveredNodeId ?? selectedNodeId
  const highlightedEdgeIds = activeId
    ? new Set(
        levelData.edges
          .filter((e) => e.from === activeId || e.to === activeId)
          .map((e) => e.id)
      )
    : new Set<string>()

  const connectedNodeIds = activeId
    ? new Set(
        levelData.edges
          .filter((e) => e.from === activeId || e.to === activeId)
          .flatMap((e) => [e.from, e.to])
      )
    : new Set<string>()

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ minWidth: 300, height: 'auto', aspectRatio: `${W}/${H}` }}
      role="img"
      aria-label={`${levelData.label} architecture diagram`}
    >
      {/* Edges */}
      {levelData.edges.map((edge, i) => {
        const fromNode = levelData.nodes.find((n) => n.id === edge.from)
        const toNode = levelData.nodes.find((n) => n.id === edge.to)
        if (!fromNode || !toNode) return null

        const fc = getCenter(fromNode)
        const tc = getCenter(toNode)
        const mx = (fc.x + tc.x) / 2
        const my = (fc.y + tc.y) / 2
        const isHighlighted = highlightedEdgeIds.has(edge.id)
        const isFlowActive = isSimulating && (
          activeFlowNodeId === edge.from || activeFlowNodeId === edge.to
        )

        return (
          <g key={edge.id}>
            <motion.line
              x1={fc.x} y1={fc.y} x2={tc.x} y2={tc.y}
              stroke={
                isFlowActive
                  ? '#00ff88'
                  : isHighlighted
                  ? fromNode.color
                  : 'rgba(255,255,255,0.1)'
              }
              strokeWidth={isHighlighted || isFlowActive ? 2 : 1.5}
              strokeDasharray={edge.style === 'dashed' ? '5 4' : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            />
            {/* Animated flow dot on active edge */}
            {isFlowActive && (
              <motion.circle
                r={3}
                fill="#00ff88"
                cx={(fc.x + tc.x) / 2}
                cy={(fc.y + tc.y) / 2}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
            {edge.label && (
              <text
                x={mx} y={my - 5}
                textAnchor="middle"
                fontSize={7.5}
                fill={isHighlighted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
                fontFamily="monospace"
              >
                {edge.label}
              </text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {levelData.nodes.map((node, i) => {
        const { x, y } = getCenter(node)
        const isSelected = selectedNodeId === node.id
        const isHovered = hoveredNodeId === node.id
        const isConnected = connectedNodeIds.has(node.id)
        const isFlowActive = activeFlowNodeId === node.id
        const isDimmed = activeId && !isConnected && activeId !== node.id

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: isDimmed ? 0.3 : 1,
              scale: isFlowActive ? 1.08 : 1,
            }}
            transition={{
              opacity: { delay: i * 0.07, duration: 0.4 },
              scale: { duration: 0.3 },
            }}
            style={{ cursor: 'pointer' }}
            onClick={() => onNodeClick(node)}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            role="button"
            aria-label={`${node.label} — click for details`}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNodeClick(node)}
          >
            {/* Glow ring for selected/flow-active */}
            {(isSelected || isFlowActive) && (
              <motion.ellipse
                cx={x} cy={y}
                rx={NODE_W / 2 + 10} ry={NODE_H / 2 + 10}
                fill={`${isFlowActive ? '#00ff88' : node.color}12`}
                stroke={isFlowActive ? '#00ff88' : node.color}
                strokeWidth={1}
                strokeOpacity={0.5}
                animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}

            {/* Node box */}
            <rect
              x={x - NODE_W / 2} y={y - NODE_H / 2}
              width={NODE_W} height={NODE_H}
              rx={8}
              fill={
                isSelected
                  ? `${node.color}22`
                  : isHovered
                  ? `${node.color}14`
                  : 'rgba(255,255,255,0.04)'
              }
              stroke={
                isFlowActive
                  ? '#00ff88'
                  : isSelected || isHovered
                  ? node.color
                  : 'rgba(255,255,255,0.12)'
              }
              strokeWidth={isSelected || isHovered || isFlowActive ? 1.5 : 1}
            />

            {/* Label */}
            <text
              x={x} y={y - 5}
              textAnchor="middle"
              fontSize={10}
              fontWeight="600"
              fill={isSelected || isHovered ? node.color : 'rgba(255,255,255,0.85)'}
              fontFamily="system-ui, sans-serif"
            >
              {node.label}
            </text>
            {node.sublabel && (
              <text
                x={x} y={y + 9}
                textAnchor="middle"
                fontSize={7.5}
                fill="rgba(255,255,255,0.38)"
                fontFamily="monospace"
              >
                {node.sublabel}
              </text>
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}
