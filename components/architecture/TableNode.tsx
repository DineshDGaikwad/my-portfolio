'use client'

import { motion } from 'framer-motion'
import { DBTable, Column } from '@/data/databaseSchemas'

export const ROW_H    = 22
export const HEADER_H = 44
export const TABLE_W  = 214

// ── Column layout zones (x relative to row-group translate origin) ────────────
const NUM_X   = 10   // row-number right edge
const BADGE_X = 14   // badges start here
const NAME_X  = 72   // column name starts here (after max 2 badges)
const TYPE_X  = TABLE_W - 8  // type right-aligned to here

export function tableHeight(table: DBTable) {
  return HEADER_H + table.columns.length * ROW_H + 8
}

// ── Badge pill ────────────────────────────────────────────────────────────────
function Pill({ label, color, x }: { label: string; color: string; x: number }) {
  const w = label === 'IDX' ? 23 : label === 'UQ' ? 19 : 17
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={x} y={-6} width={w} height={12} rx={2.5}
        fill={`${color}1e`} stroke={`${color}60`} strokeWidth={0.7} />
      <text x={x + w / 2} y={0} textAnchor="middle" dominantBaseline="middle"
        fontSize={6} fontWeight="700" fontFamily="monospace" fill={color}>
        {label}
      </text>
    </g>
  )
}

// ── Column row ────────────────────────────────────────────────────────────────
function ColumnRow({ col, tableColor, rowIndex }: {
  col: Column; tableColor: string; rowIndex: number
}) {
  const badges: { label: string; color: string }[] = []
  if (col.isPK)                                    badges.push({ label: 'PK',  color: '#fbbf24' })
  if (col.isFK)                                    badges.push({ label: 'FK',  color: tableColor })
  if (col.isUnique && !col.isPK)                   badges.push({ label: 'UQ',  color: '#a78bfa' })
  if (col.isIndex  && !col.isPK && !col.isUnique)  badges.push({ label: 'IDX', color: '#34d399' })
  const shown = badges.slice(0, 2)

  // Pre-compute pill x positions imperatively before JSX
  const pillW = (l: string) => l === 'IDX' ? 23 : l === 'UQ' ? 19 : 17
  const pills: { label: string; color: string; x: number }[] = []
  let bx = BADGE_X
  for (const b of shown) {
    pills.push({ ...b, x: bx })
    bx += pillW(b.label) + 3
  }

  const typeLabel = col.length ? `${col.type}(${col.length})` : col.type

  return (
    <g>
      {/* Row number */}
      <text x={NUM_X} y={0} textAnchor="end" dominantBaseline="middle"
        fontSize={6} fontFamily="monospace" fill="rgba(255,255,255,0.18)"
        style={{ pointerEvents: 'none' }}>
        {rowIndex + 1}
      </text>

      {/* Badges */}
      {pills.map((p) => <Pill key={p.label} label={p.label} color={p.color} x={p.x} />)}

      {/* Column name */}
      <text x={NAME_X} y={0} dominantBaseline="middle"
        fontSize={8.5} fontFamily="monospace"
        fill={col.isPK ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.72)'}
        fontWeight={col.isPK ? '600' : '400'}
        style={{ pointerEvents: 'none' }}>
        {col.name}
        {col.isNullable && (
          <tspan fill="rgba(255,255,255,0.28)" fontSize={7}> ?</tspan>
        )}
      </text>

      {/* Type */}
      <text x={TYPE_X} y={0} textAnchor="end" dominantBaseline="middle"
        fontSize={7} fontFamily="monospace" fill="rgba(255,255,255,0.26)"
        style={{ pointerEvents: 'none' }}>
        {typeLabel}
      </text>
    </g>
  )
}

// ── Table Node ────────────────────────────────────────────────────────────────
interface TableNodeProps {
  table: DBTable
  x: number; y: number
  isSelected: boolean; isHighlighted: boolean
  isDimmed: boolean;   isDragging: boolean
  index: number
  onClick: () => void
  onHover: (id: string | null) => void
  onPointerDown: (e: React.PointerEvent<Element>) => void
}

export function TableNode({
  table, x, y, isSelected, isHighlighted, isDimmed, isDragging,
  index, onClick, onHover, onPointerDown,
}: TableNodeProps) {
  const h      = tableHeight(table)
  const active = isSelected || isHighlighted || isDragging

  // Unique gradient id — combine table.id with x,y to avoid collisions across schemas
  const gradId = `hg-${table.id}-${Math.round(x)}`

  const fkCount  = table.columns.filter((c) => c.isFK).length
  const idxCount = table.columns.filter((c) => c.isIndex || c.isUnique).length

  // Build stats string cleanly
  const statParts = [`${table.columns.length} cols`]
  if (fkCount  > 0) statParts.push(`${fkCount} FK`)
  if (idxCount > 0) statParts.push(`${idxCount} IDX`)
  const statsStr = statParts.join('  ·  ')

  // Header vertical centers
  const nameCY  = y + HEADER_H * 0.38   // table name — upper 38%
  const statsCY = y + HEADER_H * 0.72   // stats row  — lower 72%

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDimmed ? 0.15 : 1 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHover(table.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* ── Drag outer glow ── */}
      {isDragging && (
        <rect x={x - 8} y={y - 8} width={TABLE_W + 16} height={h + 16} rx={14}
          fill={`${table.color}07`} stroke={table.color} strokeWidth={2} strokeOpacity={0.7}
          style={{ pointerEvents: 'none' }} />
      )}

      {/* ── Hover / selected pulse ring ── */}
      {(isSelected || isHighlighted) && !isDragging && (
        <motion.rect x={x - 4} y={y - 4} width={TABLE_W + 8} height={h + 8} rx={12}
          fill="none" stroke={table.color} strokeWidth={1.2}
          animate={{ strokeOpacity: [0.2, 0.65, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ pointerEvents: 'none' }} />
      )}

      {/* ── Drop shadow ── */}
      <rect x={x + 2} y={y + 4} width={TABLE_W} height={h} rx={9}
        fill="rgba(0,0,0,0.45)" style={{ pointerEvents: 'none' }} />

      {/* ── Card body ── */}
      <rect x={x} y={y} width={TABLE_W} height={h} rx={9}
        fill={
          isDragging  ? `${table.color}14` :
          isSelected  ? `${table.color}0d` :
          'rgba(8,10,16,0.96)'
        }
        stroke={active ? table.color : 'rgba(255,255,255,0.07)'}
        strokeWidth={active ? 1.6 : 0.8}
        onClick={onClick}
        style={{ cursor: 'pointer' }} />

      {/* ── Header gradient ── */}
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={table.color} stopOpacity={isDragging ? 0.28 : 0.18} />
          <stop offset="100%" stopColor={table.color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Header fill — rounded top, square bottom */}
      <rect x={x} y={y} width={TABLE_W} height={HEADER_H} rx={9}
        fill={`url(#${gradId})`}
        onPointerDown={onPointerDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }} />
      <rect x={x} y={y + HEADER_H - 9} width={TABLE_W} height={9}
        fill={`url(#${gradId})`} style={{ pointerEvents: 'none' }} />

      {/* ── Left accent bar ── */}
      {/* Sits on top of card, inset 0px from left edge, full header height */}
      <rect x={x} y={y} width={3} height={HEADER_H} rx={0}
        fill={table.color} opacity={0.9} style={{ pointerEvents: 'none' }} />
      {/* Round only the top-left corner of the bar to match card rx */}
      <rect x={x} y={y} width={3} height={9} rx={0}
        fill={table.color} opacity={0.9} style={{ pointerEvents: 'none' }} />

      {/* ── Table name ── */}
      <text
        x={x + 11}
        y={nameCY}
        dominantBaseline="middle"
        fontSize={10.5}
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill={active ? table.color : 'rgba(255,255,255,0.92)'}
        style={{ pointerEvents: 'none', userSelect: 'none' }}>
        {table.name}
      </text>

      {/* ── Stats row ── */}
      <text
        x={x + 11}
        y={statsCY}
        dominantBaseline="middle"
        fontSize={6.5}
        fontFamily="monospace"
        fill={`${table.color}80`}
        style={{ pointerEvents: 'none', userSelect: 'none' }}>
        {statsStr}
      </text>

      {/* ── Header / body divider ── */}
      <line
        x1={x + 3} y1={y + HEADER_H}
        x2={x + TABLE_W} y2={y + HEADER_H}
        stroke={`${table.color}22`} strokeWidth={1}
        style={{ pointerEvents: 'none' }} />

      {/* ── Column rows ── */}
      {table.columns.map((col, i) => {
        const rowY = y + HEADER_H + i * ROW_H + ROW_H / 2 + 4
        return (
          <g key={col.name}
            transform={`translate(${x}, ${rowY})`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}>

            {/* Alternating row tint */}
            {i % 2 === 1 && (
              <rect x={0} y={-ROW_H / 2} width={TABLE_W} height={ROW_H}
                fill="rgba(255,255,255,0.014)" style={{ pointerEvents: 'none' }} />
            )}

            {/* Row separator */}
            {i > 0 && (
              <line x1={6} y1={-ROW_H / 2} x2={TABLE_W - 6} y2={-ROW_H / 2}
                stroke="rgba(255,255,255,0.045)" strokeWidth={0.7}
                style={{ pointerEvents: 'none' }} />
            )}

            {/* Clip so nothing escapes card bounds */}
            <clipPath id={`cp-${table.id}-${i}`}>
              <rect x={0} y={-ROW_H / 2} width={TABLE_W} height={ROW_H} />
            </clipPath>
            <g clipPath={`url(#cp-${table.id}-${i})`}>
              <ColumnRow col={col} tableColor={table.color} rowIndex={i} />
            </g>
          </g>
        )
      })}
    </motion.g>
  )
}
