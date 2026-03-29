'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { databaseSchemas, DatabaseSchema, DBTable } from '@/data/databaseSchemas'
import { TableNode, TABLE_W, tableHeight } from './TableNode'
import { RelationshipEdge } from './RelationshipEdge'
import { cn } from '@/lib/utils'
import { X, ZoomIn, ZoomOut, Maximize2 } from '@/components/ui/Icons'

const VW = 860
const VH = 560

type Pos = { x: number; y: number }
type Positions = Record<string, Pos>

function initPositions(tables: DBTable[]): Positions {
  const p: Positions = {}
  tables.forEach((t) => { p[t.id] = { x: (t.x / 100) * VW, y: (t.y / 100) * VH } })
  return p
}

// ─── Project Selector ─────────────────────────────────────────────────────────
function SchemaSelector({ selected, onSelect }: { selected: DatabaseSchema; onSelect: (s: DatabaseSchema) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {databaseSchemas.map((s) => {
        const isActive = selected.projectId === s.projectId
        return (
          <button key={s.projectId} onClick={() => onSelect(s)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border',
              isActive
                ? 'bg-neon-blue/15 border-neon-blue text-neon-blue'
                : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
            )}
            aria-pressed={isActive}
          >
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" style={{ boxShadow: '0 0 6px #00d4ff' }} />}
            {s.projectTitle}
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full font-mono',
              isActive ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/5 text-muted-foreground/40'
            )}>
              {s.tables.length}t
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Table Detail Panel ───────────────────────────────────────────────────────
function TableDetailPanel({ table, onClose }: { table: DBTable; onClose: () => void }) {
  const pkCols  = table.columns.filter((c) => c.isPK)
  const fkCols  = table.columns.filter((c) => c.isFK)
  const idxCols = table.columns.filter((c) => c.isIndex || c.isUnique)
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-white/10 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-sm" style={{ color: table.color }}>{table.name}</h4>
            {table.description && <p className="text-2xs font-mono text-muted-foreground/60 mt-0.5">{table.description}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors ml-3 shrink-0"><X size={13} /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-2">Columns ({table.columns.length})</p>
            <div className="space-y-1">
              {table.columns.map((col) => (
                <div key={col.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    {col.isPK     && <span className="text-2xs font-mono px-1 rounded" style={{background:'rgba(251,191,36,0.15)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.3)'}}>PK</span>}
                    {col.isFK     && <span className="text-2xs font-mono px-1 rounded border" style={{ color: table.color, borderColor: `${table.color}30`, backgroundColor: `${table.color}10` }}>FK</span>}
                    {col.isUnique && !col.isPK && <span className="text-2xs font-mono px-1 rounded" style={{background:'rgba(167,139,250,0.12)',color:'#a78bfa',border:'1px solid rgba(167,139,250,0.3)'}}>UQ</span>}
                    {col.isIndex  && !col.isUnique && <span className="text-2xs font-mono px-1 rounded" style={{background:'rgba(52,211,153,0.12)',color:'#34d399',border:'1px solid rgba(52,211,153,0.3)'}}>IDX</span>}
                    <span className="text-xs text-foreground/80 font-mono">{col.name}</span>
                    {col.isNullable && <span className="text-2xs text-muted-foreground/40">nullable</span>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {col.defaultValue && <span className="text-2xs font-mono text-muted-foreground/40">{col.defaultValue}</span>}
                    <span className="text-2xs font-mono text-muted-foreground/50">{col.length ? `${col.type}(${col.length})` : col.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {pkCols.length > 0 && (
              <div>
                <p className="text-2xs font-mono text-yellow-400/70 uppercase tracking-wider mb-1.5">Primary Key</p>
                {pkCols.map((c) => <span key={c.name} className="text-xs font-mono text-yellow-400 block">{c.name}</span>)}
              </div>
            )}
            {fkCols.length > 0 && (
              <div>
                <p className="text-2xs font-mono uppercase tracking-wider mb-1.5" style={{ color: `${table.color}99` }}>Foreign Keys</p>
                <div className="space-y-1">
                  {fkCols.map((c) => (
                    <div key={c.name} className="text-xs font-mono">
                      <span style={{ color: table.color }}>{c.name}</span>
                      {c.references && <span className="text-muted-foreground/50"> → {c.references.table}.{c.references.column}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {idxCols.length > 0 && (
              <div>
                <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-1.5">Indexes</p>
                <div className="space-y-1">
                  {idxCols.map((c) => (
                    <div key={c.name} className="text-xs font-mono text-muted-foreground/70">
                      {c.name} <span className="text-2xs" style={{color: c.isUnique ? '#a78bfa' : '#34d399'}}>{c.isUnique ? 'UNIQUE' : 'INDEX'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex items-center gap-3 flex-wrap text-2xs font-mono text-muted-foreground/50">
      <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-white/25 inline-block" />1:N</span>
      <span className="flex items-center gap-1"><span className="w-4 h-0.5 border-t border-dashed border-white/25 inline-block" />N:M</span>
      <span className="flex items-center gap-1.5"><span className="px-1 rounded text-2xs font-bold" style={{background:'rgba(251,191,36,0.15)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.4)'}}>PK</span>Primary</span>
      <span className="flex items-center gap-1.5"><span className="px-1 rounded text-2xs font-bold" style={{background:'rgba(0,212,255,0.12)',color:'#00d4ff',border:'1px solid rgba(0,212,255,0.35)'}}>FK</span>Foreign</span>
      <span className="flex items-center gap-1.5"><span className="px-1 rounded text-2xs font-bold" style={{background:'rgba(167,139,250,0.12)',color:'#a78bfa',border:'1px solid rgba(167,139,250,0.35)'}}>UQ</span>Unique</span>
      <span className="flex items-center gap-1.5"><span className="px-1 rounded text-2xs font-bold" style={{background:'rgba(52,211,153,0.12)',color:'#34d399',border:'1px solid rgba(52,211,153,0.35)'}}>IDX</span>Index</span>
    </div>
  )
}

// ─── Main Diagram ─────────────────────────────────────────────────────────────
export function DatabaseDiagram({ projectSlug }: { projectSlug?: string } = {}) {
  const locked = projectSlug ? databaseSchemas.find((s) => s.projectSlug === projectSlug) ?? null : null
  const initial = locked ?? databaseSchemas[0]

  const [schema, setSchema] = useState<DatabaseSchema>(initial)
  const [positions, setPositions] = useState<Positions>(() => initPositions(initial.tables))
  const [selectedTable, setSelectedTable] = useState<DBTable | null>(null)
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const svgRef = useRef<SVGSVGElement>(null)

  // All drag state lives here — never in React state to avoid stale closures
  const drag = useRef<{
    id: string
    lastClientX: number
    lastClientY: number
  } | null>(null)

  const handleSchemaSelect = useCallback((s: DatabaseSchema) => {
    setSchema(s)
    setPositions(initPositions(s.tables))
    setSelectedTable(null)
    setHoveredTableId(null)
    setDraggingId(null)
    drag.current = null
  }, [])

  const startDrag = useCallback((e: React.PointerEvent<Element>, tableId: string) => {
    e.preventDefault()
    e.stopPropagation()

    drag.current = {
      id: tableId,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
    }
    setDraggingId(tableId)

    const onMove = (ev: PointerEvent) => {
      if (!drag.current || !svgRef.current) return

      const svg = svgRef.current
      const rect = svg.getBoundingClientRect()

      // How many SVG viewBox units per screen pixel
      const ratioX = VW / rect.width
      const ratioY = VH / rect.height

      const dxPx = ev.clientX - drag.current.lastClientX
      const dyPx = ev.clientY - drag.current.lastClientY

      drag.current.lastClientX = ev.clientX
      drag.current.lastClientY = ev.clientY

      const dxSVG = dxPx * ratioX
      const dySVG = dyPx * ratioY

      setPositions((prev) => {
        const cur = prev[drag.current!.id]
        if (!cur) return prev
        return {
          ...prev,
          [drag.current!.id]: {
            x: Math.max(0, Math.min(VW - TABLE_W, cur.x + dxSVG)),
            y: Math.max(0, Math.min(VH - 50, cur.y + dySVG)),
          },
        }
      })
    }

    const onUp = () => {
      drag.current = null
      setDraggingId(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [])

  // ── Highlight ──────────────────────────────────────────────────────────────
  const activeId = draggingId ?? hoveredTableId ?? selectedTable?.id ?? null

  const connectedIds = activeId
    ? new Set(schema.relationships.filter((r) => r.fromTable === activeId || r.toTable === activeId).flatMap((r) => [r.fromTable, r.toTable]))
    : new Set<string>()

  const highlightedRelIds = activeId
    ? new Set(schema.relationships.filter((r) => r.fromTable === activeId || r.toTable === activeId).map((r) => r.id))
    : new Set<string>()

  const handleTableClick = useCallback((table: DBTable) => {
    if (drag.current) return
    setSelectedTable((prev) => prev?.id === table.id ? null : table)
  }, [])

  if (locked === null && projectSlug) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-2xs font-mono text-muted-foreground/40 uppercase tracking-widest mb-2">No DB Schema</span>
        <p className="text-xs text-muted-foreground/60">This project does not use a relational database schema.</p>
      </div>
    )
  }

  const zoomControls = (
    <div className="flex items-center gap-1">
      <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all" aria-label="Zoom out"><ZoomOut size={13} /></button>
      <span className="text-2xs font-mono text-muted-foreground/50 w-8 text-center">{Math.round(zoom * 100)}%</span>
      <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all" aria-label="Zoom in"><ZoomIn size={13} /></button>
      <button onClick={() => setZoom(1)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all" aria-label="Reset zoom"><Maximize2 size={13} /></button>
    </div>
  )

  return (
    <div className={cn(!projectSlug && 'glass rounded-2xl overflow-hidden border border-white/10')}>

      {/* Standalone header */}
      {!projectSlug && (
        <div className="px-5 py-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-foreground">Schema Explorer</span>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
                  {schema.tables.length} tables
                </span>
                <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground/60">
                  {schema.relationships.length} relations
                </span>
                <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground/60">
                  {schema.tables.reduce((a, t) => a + t.columns.length, 0)} columns
                </span>
              </div>
            </div>
            {zoomControls}
          </div>
          <SchemaSelector selected={schema} onSelect={handleSchemaSelect} />
        </div>
      )}

      {/* Inline header */}
      {projectSlug && (
        <div className="px-4 pt-3 pb-1 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-2xs font-mono text-muted-foreground/60 truncate">{schema.description}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
              {schema.tables.length} tables · {schema.relationships.length} relations
            </span>
            {zoomControls}
          </div>
        </div>
      )}

      {/* Standalone description */}
      {!projectSlug && (
        <div className="px-5 py-2 border-b border-white/10">
          <p className="text-2xs text-muted-foreground font-mono">{schema.description}</p>
        </div>
      )}

      {/* SVG canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={schema.projectId}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-2 py-3"
          style={{ overflow: 'hidden' }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VW} ${VH}`}
            width="100%"
            style={{
              display: 'block',
              cursor: draggingId ? 'grabbing' : 'default',
              userSelect: 'none',
              touchAction: 'none',
              // zoom via viewBox scaling — no CSS transform
              height: `${Math.round(VH * zoom * (100 / VW))}vw`,
              maxHeight: `${VH * zoom}px`,
              minHeight: 300,
            }}
            aria-label={`${schema.projectTitle} database schema diagram`}
          >
            {/* Relationships */}
            {schema.relationships.map((rel, i) => {
              const ft = schema.tables.find((t) => t.id === rel.fromTable)
              const tt = schema.tables.find((t) => t.id === rel.toTable)
              if (!ft || !tt) return null
              const fp = positions[rel.fromTable]
              const tp = positions[rel.toTable]
              return (
                <RelationshipEdge
                  key={rel.id}
                  rel={rel}
                  fromTable={{ ...ft, x: (fp.x / VW) * 100, y: (fp.y / VH) * 100 }}
                  toTable={{ ...tt, x: (tp.x / VW) * 100, y: (tp.y / VH) * 100 }}
                  isHighlighted={highlightedRelIds.has(rel.id)}
                  isDimmed={!!activeId && !highlightedRelIds.has(rel.id)}
                  index={i}
                  vw={VW}
                  vh={VH}
                />
              )
            })}

            {/* Tables */}
            {schema.tables.map((table, i) => {
              const pos = positions[table.id]
              return (
                <TableNode
                  key={table.id}
                  table={table}
                  x={pos.x}
                  y={pos.y}
                  isSelected={selectedTable?.id === table.id}
                  isHighlighted={connectedIds.has(table.id)}
                  isDimmed={!!activeId && !connectedIds.has(table.id) && activeId !== table.id}
                  isDragging={draggingId === table.id}
                  index={i}
                  onClick={() => handleTableClick(table)}
                  onHover={setHoveredTableId}
                  onPointerDown={(e) => startDrag(e, table.id)}
                />
              )
            })}
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedTable && <TableDetailPanel table={selectedTable} onClose={() => setSelectedTable(null)} />}
      </AnimatePresence>

      {/* Footer */}
      <div className={cn('px-5 py-2.5 flex items-center justify-between gap-4', !projectSlug && 'border-t border-white/10')}>
        <Legend />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setPositions(initPositions(schema.tables))}
            className="text-[10px] font-mono text-muted-foreground/40 hover:text-neon-blue transition-colors"
          >
            reset layout
          </button>
          <span className="text-2xs text-muted-foreground/30 font-mono hidden sm:block">
            drag · click · hover
          </span>
        </div>
      </div>
    </div>
  )
}
