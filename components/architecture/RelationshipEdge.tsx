'use client'

import { motion } from 'framer-motion'
import { Relationship, DBTable } from '@/data/databaseSchemas'
import { TABLE_W, tableHeight, HEADER_H } from './TableNode'

interface Port { x: number; y: number; side: 'left' | 'right' | 'top' | 'bottom' }

function getPorts(table: DBTable, vw: number, vh: number): { left: Port; right: Port; top: Port; bottom: Port } {
  const x  = (table.x / 100) * vw
  const y  = (table.y / 100) * vh
  const h  = tableHeight(table)
  const cx = x + TABLE_W / 2
  const cy = y + h / 2
  return {
    left:   { x,              y: cy, side: 'left'   },
    right:  { x: x + TABLE_W, y: cy, side: 'right'  },
    top:    { x: cx,          y,     side: 'top'     },
    bottom: { x: cx,          y: y + h, side: 'bottom' },
  }
}

function bestPorts(from: DBTable, to: DBTable, vw: number, vh: number): { p1: Port; p2: Port } {
  const fp = getPorts(from, vw, vh)
  const tp = getPorts(to,   vw, vh)

  const fx = (from.x / 100) * vw
  const fy = (from.y / 100) * vh
  const tx = (to.x   / 100) * vw
  const ty = (to.y   / 100) * vh
  const fh = tableHeight(from)
  const th = tableHeight(to)

  const fcx = fx + TABLE_W / 2
  const fcy = fy + fh / 2
  const tcx = tx + TABLE_W / 2
  const tcy = ty + th / 2

  const dx = tcx - fcx
  const dy = tcy - fcy

  // Prefer horizontal connection unless tables are mostly above/below each other
  if (Math.abs(dx) >= Math.abs(dy) * 0.6) {
    return dx > 0
      ? { p1: fp.right, p2: tp.left  }
      : { p1: fp.left,  p2: tp.right }
  } else {
    return dy > 0
      ? { p1: fp.bottom, p2: tp.top    }
      : { p1: fp.top,    p2: tp.bottom }
  }
}

function buildPath(p1: Port, p2: Port): string {
  const isH = p1.side === 'left' || p1.side === 'right'
  const bend = isH
    ? Math.abs(p2.x - p1.x) * 0.45
    : Math.abs(p2.y - p1.y) * 0.45

  let cx1: number, cy1: number, cx2: number, cy2: number

  if (p1.side === 'right')  { cx1 = p1.x + bend; cy1 = p1.y }
  else if (p1.side === 'left')   { cx1 = p1.x - bend; cy1 = p1.y }
  else if (p1.side === 'bottom') { cx1 = p1.x; cy1 = p1.y + bend }
  else                           { cx1 = p1.x; cy1 = p1.y - bend }

  if (p2.side === 'left')   { cx2 = p2.x - bend; cy2 = p2.y }
  else if (p2.side === 'right')  { cx2 = p2.x + bend; cy2 = p2.y }
  else if (p2.side === 'top')    { cx2 = p2.x; cy2 = p2.y - bend }
  else                           { cx2 = p2.x; cy2 = p2.y + bend }

  return `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`
}

function Arrowhead({ p, side, color }: { p: Port; side: Port['side']; color: string }) {
  const size = 8
  let pts = ''
  if (side === 'left')   pts = `${p.x},${p.y} ${p.x + size},${p.y - 4} ${p.x + size},${p.y + 4}`
  if (side === 'right')  pts = `${p.x},${p.y} ${p.x - size},${p.y - 4} ${p.x - size},${p.y + 4}`
  if (side === 'top')    pts = `${p.x},${p.y} ${p.x - 4},${p.y + size} ${p.x + 4},${p.y + size}`
  if (side === 'bottom') pts = `${p.x},${p.y} ${p.x - 4},${p.y - size} ${p.x + 4},${p.y - size}`
  return <polygon points={pts} fill={color} />
}

function CardinalityMark({ p, side, symbol, color }: { p: Port; side: Port['side']; symbol: string; color: string }) {
  const offset = 14
  let tx = p.x, ty = p.y
  if (side === 'left')   { tx = p.x - offset; ty = p.y - 8 }
  if (side === 'right')  { tx = p.x + offset; ty = p.y - 8 }
  if (side === 'top')    { tx = p.x + 8;      ty = p.y - offset }
  if (side === 'bottom') { tx = p.x + 8;      ty = p.y + offset }
  return (
    <text x={tx} y={ty} textAnchor="middle" fontSize={9} fontFamily="monospace"
      fontWeight="700" fill={color} style={{ pointerEvents: 'none' }}>
      {symbol}
    </text>
  )
}

interface RelationshipEdgeProps {
  rel: Relationship
  fromTable: DBTable
  toTable: DBTable
  isHighlighted: boolean
  isDimmed: boolean
  index: number
  vw: number
  vh: number
}

export function RelationshipEdge({ rel, fromTable, toTable, isHighlighted, isDimmed, index, vw, vh }: RelationshipEdgeProps) {
  const { p1, p2 } = bestPorts(fromTable, toTable, vw, vh)
  const d = buildPath(p1, p2)
  const color = isHighlighted ? fromTable.color : 'rgba(255,255,255,0.1)'
  const mx = (p1.x + p2.x) / 2
  const my = (p1.y + p2.y) / 2

  const fromSymbol = '1'
  const toSymbol   = rel.type === 'one-to-one' ? '1' : rel.type === 'many-to-many' ? 'N' : 'N'

  return (
    <g>
      {/* Glow layer when highlighted */}
      {isHighlighted && (
        <path d={d} fill="none" stroke={fromTable.color} strokeWidth={6} strokeOpacity={0.08} />
      )}

      {/* Main path */}
      <motion.path
        d={d} fill="none"
        stroke={color}
        strokeWidth={isHighlighted ? 2 : 1.2}
        strokeDasharray={rel.type === 'many-to-many' ? '7 4' : undefined}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: isDimmed ? 0.05 : 1, pathLength: 1 }}
        transition={{ delay: index * 0.04, duration: 0.55, ease: 'easeOut' }}
      />

      {/* Animated flow dot on highlighted */}
      {isHighlighted && (
        <motion.circle r={3.5} fill={fromTable.color}
          animate={{
            offsetDistance: ['0%', '100%'],
            opacity: [0, 1, 1, 0],
          }}
          style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Arrowhead at target */}
      {isHighlighted && <Arrowhead p={p2} side={p2.side} color={fromTable.color} />}

      {/* Relationship label */}
      {isHighlighted && rel.label && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={mx - rel.label.length * 3.2 - 5} y={my - 9} width={rel.label.length * 6.4 + 10} height={14}
            rx={4} fill="rgba(10,12,18,0.85)" stroke={`${fromTable.color}40`} strokeWidth={1} />
          <text x={mx} y={my + 0.5} textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fontFamily="monospace" fill={fromTable.color}>
            {rel.label}
          </text>
        </motion.g>
      )}

      {/* Cardinality marks */}
      {isHighlighted && (
        <>
          <CardinalityMark p={p1} side={p1.side} symbol={fromSymbol} color={fromTable.color} />
          <CardinalityMark p={p2} side={p2.side} symbol={toSymbol}   color={fromTable.color} />
        </>
      )}
    </g>
  )
}
