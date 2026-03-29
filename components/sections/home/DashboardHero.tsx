'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { siteConfig } from '@/config/site'
import {
  Activity, Cpu, Wifi, MonitorDot, Terminal, GitBranch, Users, MapPin,
  Linkedin, Instagram, Snapchat,
} from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
interface NetworkSpeed { down: number; color: 'green' | 'yellow' | 'red'; testing: boolean }

// ─── Hooks ────────────────────────────────────────────────────────────────────
// Measures real download speed by fetching a ~500 KB payload and timing it.
// Falls back gracefully if fetch fails or is blocked.
function useNetworkSpeed(): NetworkSpeed {
  const [speed, setSpeed] = useState<NetworkSpeed>({ down: 0, color: 'green', testing: true })
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let cancelled = false

    const measure = async () => {
      // Abort any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        setSpeed((p) => ({ ...p, testing: true }))

        // ~500 KB public image — cache-busted so browser always re-fetches
        const url = `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Bikesgray.jpg/1280px-Bikesgray.jpg?_=${Date.now()}`
        const t0 = performance.now()
        const res = await fetch(url, { signal: controller.signal, cache: 'no-store' })
        const blob = await res.blob()
        const t1 = performance.now()

        if (cancelled) return

        const bytes = blob.size
        const seconds = (t1 - t0) / 1000
        const mbps = parseFloat(((bytes * 8) / seconds / 1_000_000).toFixed(1))

        setSpeed({
          down: mbps,
          color: mbps > 60 ? 'green' : mbps > 30 ? 'yellow' : 'red',
          testing: false,
        })
      } catch {
        // Fetch blocked (CORS / offline) — show 0 without crashing
        if (!cancelled) setSpeed({ down: 0, color: 'red', testing: false })
      }
    }

    measure()
    const id = setInterval(measure, 8000) // re-measure every 8 s
    return () => {
      cancelled = true
      clearInterval(id)
      abortRef.current?.abort()
    }
  }, [])

  return speed
}

// ─── Ping hook ───────────────────────────────────────────────────────────────
function usePing() {
  const [ping, setPing] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const measure = async () => {
      try {
        const t0 = performance.now()
        await fetch('https://www.cloudflare.com/cdn-cgi/trace', { cache: 'no-store', mode: 'no-cors' })
        const ms = Math.round(performance.now() - t0)
        if (!cancelled) setPing(ms)
      } catch {
        if (!cancelled) setPing(null)
      }
    }

    measure()
    const id = setInterval(measure, 3000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return ping
}

function useCountUp(target: number, duration = 1.4) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, duration])

  return { val, ref }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function GlassCard({ className, children, delay = 0 }: {
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
      className={cn(
        'rounded-2xl p-4 ring-1 ring-white/[0.08] h-full flex flex-col',
        'bg-white/[0.04] backdrop-blur-md',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
      {children}
    </p>
  )
}

// 1. System Status
function SystemStatus() {
  const [uptime, setUptime] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <GlassCard delay={0.1}>
      <CardLabel><MonitorDot size={10} /> System Status</CardLabel>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-neon-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
            </span>
            ONLINE
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Mode</span>
          <span className="text-xs font-mono text-neon-blue">.NET · Angular</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Focus</span>
          <span className="text-xs font-mono text-foreground">@ KANINI</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Uptime</span>
          <span className="text-xs font-mono text-muted-foreground">{fmt(uptime)}</span>
        </div>
      </div>
    </GlassCard>
  )
}

// 2. Network Speed — Speedometer
function Speedometer({ value, max = 200, testing, size = 120 }: { value: number; max?: number; testing: boolean; size?: number }) {
  const SIZE = size
  const CX = SIZE / 2
  const CY = SIZE / 2 + 8
  const R = Math.round(SIZE * 0.38)  // scales with size
  const START_DEG = 195
  const SWEEP = 210

  const toRad = (deg: number) => (deg * Math.PI) / 180

  const arcPath = (startDeg: number, sweep: number, r: number) => {
    const s = toRad(startDeg)
    const e = toRad(startDeg + sweep)
    const x1 = CX + r * Math.cos(s)
    const y1 = CY + r * Math.sin(s)
    const x2 = CX + r * Math.cos(e)
    const y2 = CY + r * Math.sin(e)
    const large = sweep > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  const pct = Math.min(value / max, 1)
  const valueSweep = SWEEP * pct
  const needleDeg = START_DEG + valueSweep
  const needleRad = toRad(needleDeg)
  const needleLen = R - Math.round(SIZE * 0.05)
  const nx = CX + needleLen * Math.cos(needleRad)
  const ny = CY + needleLen * Math.sin(needleRad)

  const stroke = value > 100 ? '#4ade80' : value > 40 ? '#facc15' : value === 0 && testing ? '#ffffff22' : '#f87171'
  const glowColor = value > 100 ? 'rgba(74,222,128,0.5)' : value > 40 ? 'rgba(250,204,21,0.5)' : 'rgba(248,113,113,0.5)'
  const ticks = [0, 50, 100, 150, 200]
  const strokeW = Math.max(4, Math.round(SIZE * 0.05))

  return (
    <svg width={SIZE} height={SIZE * 0.72} viewBox={`0 0 ${SIZE} ${SIZE * 0.72}`} aria-hidden="true">
      <defs>
        <filter id="needle-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path d={arcPath(START_DEG, SWEEP, R)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} strokeLinecap="round" />

      {/* Value arc */}
      {(!testing || value > 0) && (
        <motion.path
          d={arcPath(START_DEG, valueSweep || 0.01, R)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeW}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {/* Ticks */}
      {ticks.map((t) => {
        const deg = START_DEG + (t / max) * SWEEP
        const r1 = R + SIZE * 0.04
        const r2 = R + SIZE * 0.08
        const rad = toRad(deg)
        return (
          <line key={t}
            x1={CX + r1 * Math.cos(rad)} y1={CY + r1 * Math.sin(rad)}
            x2={CX + r2 * Math.cos(rad)} y2={CY + r2 * Math.sin(rad)}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1"
          />
        )
      })}

      {/* Needle — only render when coordinates are valid */}
      {!isNaN(nx) && !isNaN(ny) && isFinite(nx) && isFinite(ny) && (
        <motion.line
          x1={CX} y1={CY}
          x2={nx} y2={ny}
          stroke={stroke} strokeWidth="1.5" strokeLinecap="round"
          filter="url(#needle-glow)"
          initial={{ x2: nx, y2: ny }}
          animate={{ x2: nx, y2: ny }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={SIZE * 0.025} fill={stroke}
        style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }} />

      {/* Center speed label inside dial */}
      <text
        x={CX} y={CY - R * 0.3}
        textAnchor="middle"
        fontSize={SIZE * 0.1}
        fontWeight="700"
        fontFamily="monospace"
        fill={testing && value === 0 ? 'rgba(255,255,255,0.3)' : stroke}
      >
        {testing && value === 0 ? '—' : value.toFixed(1)}
      </text>
      <text x={CX} y={CY - R * 0.1} textAnchor="middle"
        fontSize={SIZE * 0.055} fontFamily="monospace" fill="rgba(255,255,255,0.35)">Mbps</text>

      {/* Min / Max labels only */}
      <text x={CX - R + SIZE * 0.02} y={CY + SIZE * 0.14} textAnchor="middle"
        fontSize={SIZE * 0.055} fontFamily="monospace" fill="rgba(255,255,255,0.25)">0</text>
      <text x={CX + R - SIZE * 0.02} y={CY + SIZE * 0.14} textAnchor="middle"
        fontSize={SIZE * 0.055} fontFamily="monospace" fill="rgba(255,255,255,0.25)">{max}</text>
    </svg>
  )
}

function NetworkCard() {
  const { down, color, testing } = useNetworkSpeed()
  const ping = usePing()
  const label = down > 60 ? 'Excellent' : down > 30 ? 'Good' : down === 0 && testing ? 'Measuring…' : 'Slow'
  const labelColor = { green: 'text-neon-green', yellow: 'text-yellow-400', red: 'text-red-400' }[color]
  const pingColor = ping === null ? 'text-muted-foreground'
    : ping < 50 ? 'text-neon-green'
    : ping < 120 ? 'text-yellow-400'
    : 'text-red-400'

  return (
    <GlassCard delay={0.15}>
      <CardLabel>
        <Wifi size={10} /> Network
        {testing && <span className="ml-auto text-[9px] font-mono text-muted-foreground/50 animate-pulse">live</span>}
      </CardLabel>

      <div className="flex items-center gap-3">
        {/* Left — Speedometer */}
        <div className="shrink-0">
          <Speedometer value={Math.min(down, 100)} testing={testing} size={150} max={100} />
        </div>

        {/* Right — stats */}
        <div className="flex flex-col justify-between h-full gap-3 flex-1 min-w-0">

          {/* Ping */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Ping</p>
              <p className={cn('text-sm font-bold font-mono', pingColor)}>
                {ping === null ? '—' : `${ping}ms`}
              </p>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', ping === null ? 'bg-white/10'
                  : ping < 50 ? 'bg-neon-green' : ping < 120 ? 'bg-yellow-400' : 'bg-red-400')}
                animate={{ width: ping === null ? '0%' : `${Math.max(5, 100 - (ping / 200) * 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[9px] font-mono text-muted-foreground">
              {ping === null ? 'measuring…' : ping < 50 ? 'Low latency' : ping < 120 ? 'Moderate' : 'High latency'}
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Status</p>
            <p className={cn('text-sm font-bold font-mono', labelColor)}>{label}</p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-blue" />
            </span>
            <span className="text-[9px] font-mono text-muted-foreground">live monitoring</span>
          </div>

        </div>
      </div>
    </GlassCard>
  )
}

// 3. Metrics
function MetricItem({ label, value, suffix = '+' }: { label: string; value: number; suffix?: string }) {
  const { val, ref } = useCountUp(value)
  return (
    <div className="flex flex-col gap-0.5">
      <span ref={ref} className="text-xl font-bold font-mono text-foreground">
        {val}{suffix}
      </span>
      <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
    </div>
  )
}

function useGitHubRepos() {
  const [repos, setRepos] = useState<number | null>(null)
  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((d) => setRepos(d.totalRepos ?? null))
      .catch(() => setRepos(null))
  }, [])
  return repos
}

function MetricsCard() {
  return (
    <GlassCard delay={0.2}>
      <CardLabel><Activity size={10} /> Engineering Metrics</CardLabel>
      <div className="grid grid-cols-5 gap-3">
        <MetricItem label="Projects" value={5} />
        <MetricItem label="APIs" value={12} />
        <MetricItem label="Systems" value={8} />
        <MetricItem label="Experience" value={1} />
        <MetricItem label="Commits" value={100} />
      </div>
    </GlassCard>
  )
}

function GitHubCard() {
  const repos = useGitHubRepos()
  const { val, ref } = useCountUp(repos ?? 0)

  return (
    <GlassCard delay={0.45}>
      <CardLabel><GitBranch size={10} /> Open Source</CardLabel>
      <a
        href="https://github.com/DineshDGaikwad"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 group"
      >
        <span className="text-[10px] font-mono text-muted-foreground group-hover:text-neon-blue transition-colors">
          @DineshDGaikwad ↗
        </span>
        <div className="flex items-end gap-1.5">
          <span ref={ref} className="text-3xl font-bold font-mono text-neon-blue leading-none">
            {repos === null ? <span className="text-muted-foreground/40 animate-pulse text-2xl">—</span> : val}
          </span>
          {repos !== null && <span className="text-xs text-muted-foreground mb-1">repos</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">live · public repos</span>
        </div>
      </a>
    </GlassCard>
  )
}

// 4. Current Activity
const activities = [
  'Building REST APIs',
  'Designing DB schemas',
  'Optimising React perf',
  'Learning new tech',
  'Shipping features',
  'Writing clean code',
]

function ActivityCard() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % activities.length), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <GlassCard delay={0.25}>
      <CardLabel><Terminal size={10} /> Current Activity</CardLabel>
      <div className="flex items-center gap-2 h-7 overflow-hidden">
        <span className="text-neon-green font-mono text-xs shrink-0">›</span>
        <div className="relative overflow-hidden flex-1 h-full">
          <motion.span
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute text-sm font-mono text-foreground whitespace-nowrap"
          >
            {activities[idx]}
          </motion.span>
        </div>
        <span className="animate-cursor-blink text-neon-blue font-mono text-xs">_</span>
      </div>
    </GlassCard>
  )
}

// ─── Battery hook ─────────────────────────────────────────────────────────────
interface BatteryState {
  supported: boolean
  level: number        // 0–100
  charging: boolean
  loading: boolean
}

function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    supported: false, level: 100, charging: false, loading: true,
  })

  useEffect(() => {
    // Battery API is not available in all browsers (Firefox, Safari desktop)
    if (!('getBattery' in navigator)) {
      setState({ supported: false, level: 100, charging: false, loading: false })
      return
    }

    let battery: any = null

    const update = (b: any) => {
      setState({
        supported: true,
        level: Math.round(b.level * 100),
        charging: b.charging,
        loading: false,
      })
    }

    ;(navigator as any).getBattery().then((b: any) => {
      battery = b
      update(b)
      b.addEventListener('levelchange', () => update(b))
      b.addEventListener('chargingchange', () => update(b))
    }).catch(() => {
      setState({ supported: false, level: 100, charging: false, loading: false })
    })

    return () => {
      if (!battery) return
      battery.removeEventListener('levelchange', () => update(battery))
      battery.removeEventListener('chargingchange', () => update(battery))
    }
  }, [])

  return state
}

// 7. System Health
function SystemHealth() {
  const battery = useBattery()

  // Simulated CPU / load — used as fallback row and always shown
  const [cpu, setCpu] = useState(42)
  useEffect(() => {
    const id = setInterval(() =>
      setCpu((v) => Math.min(95, Math.max(15, v + (Math.random() - 0.5) * 10))), 2000)
    return () => clearInterval(id)
  }, [])

  const bar = (val: number, override?: string) => (
    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className={cn(
          'h-full rounded-full',
          override ?? (val > 75 ? 'bg-red-400' : val > 50 ? 'bg-yellow-400' : 'bg-neon-green')
        )}
        animate={{ width: `${val}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )

  // Battery color logic
  const battColor = battery.level < 20 ? 'text-red-400'
    : battery.level < 50 ? 'text-yellow-400'
    : 'text-neon-green'

  const battBarColor = battery.level < 20 ? 'bg-red-400'
    : battery.level < 50 ? 'bg-yellow-400'
    : 'bg-neon-green'

  const battStatus = battery.level < 20 ? 'Critical'
    : battery.level < 50 ? 'Moderate'
    : 'Healthy'

  return (
    <GlassCard delay={0.4}>
      <CardLabel><Cpu size={10} /> System Health</CardLabel>
      <div className="space-y-2.5">

        {/* CPU — always shown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground w-8">CPU</span>
          {bar(cpu)}
          <span className="text-[10px] font-mono text-foreground w-7 text-right">{Math.round(cpu)}%</span>
        </div>

        {/* Battery — real if supported, fallback row if not */}
        {battery.loading ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground w-8">BAT</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground/50 w-7 text-right">…</span>
          </div>
        ) : battery.supported ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground w-8">BAT</span>
              {bar(battery.level, battBarColor)}
              <span className={cn('text-[10px] font-mono w-7 text-right', battColor)}>
                {battery.level}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">
                {battery.charging ? 'Charging' : 'On battery'}
              </span>
              <span className={cn('text-[10px] font-mono', battColor)}>
                {battStatus}
              </span>
            </div>
          </>
        ) : (
          // Fallback — battery API not available
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">System</span>
            <span className="text-[10px] font-mono text-neon-green">Optimal</span>
          </div>
        )}

      </div>
    </GlassCard>
  )
}

// ─── Location hook ───────────────────────────────────────────────────────────────
type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; city: string; country: string; countryCode: string }
  | { status: 'error'; message: string }

const CACHE_KEY = 'portfolio:location'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

function useLocation() {
  const [loc, setLoc] = useState<LocationState>({ status: 'idle' })

  // Load from cache on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return
      const { data, ts } = JSON.parse(raw)
      if (Date.now() - ts < CACHE_TTL) setLoc({ status: 'success', ...data })
    } catch {}
  }, [])

  const detect = useCallback(async () => {
    if (loc.status === 'loading' || loc.status === 'success') return
    setLoc({ status: 'loading' })

    if (!('geolocation' in navigator)) {
      setLoc({ status: 'error', message: 'Not supported' })
      return
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const res = await fetch(
              `/api/location?lat=${coords.latitude}&lng=${coords.longitude}`
            )
            if (!res.ok) throw new Error('API error')
            const data = await res.json()
            const result = {
              city: data.city,
              country: data.country,
              countryCode: data.countryCode,
            }
            setLoc({ status: 'success', ...result })
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() }))
          } catch {
            setLoc({ status: 'error', message: 'Geocoding failed' })
          }
        },
        (err) => {
          const msg = err.code === 1 ? 'Permission denied'
            : err.code === 2 ? 'Position unavailable'
            : 'Request timed out'
          setLoc({ status: 'error', message: msg })
        },
        { timeout: 8000, maximumAge: 60000 }
      )
    } catch {
      // Permissions policy blocks geolocation in some iframe/browser contexts
      setLoc({ status: 'error', message: 'Blocked by browser' })
    }
  }, [loc.status])

  return { loc, detect }
}

function LocationCard() {
  const { loc, detect } = useLocation()

  return (
    <GlassCard delay={0.5}>
      <CardLabel><MapPin size={10} /> Visitor Location</CardLabel>

      <div className="flex flex-col gap-2.5">
        {loc.status === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={detect}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 hover:border-neon-blue/40 hover:bg-neon-blue/5 transition-all text-[10px] font-mono text-muted-foreground hover:text-neon-blue w-fit"
          >
            <MapPin size={9} />
            Enable location
          </motion.button>
        )}

        {loc.status === 'loading' && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground">Fetching…</span>
          </div>
        )}

        {loc.status === 'success' && (
          <>
            <div>
              <p className="text-sm font-bold font-mono text-foreground leading-tight">
                {loc.city || loc.country}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                {loc.country} · {loc.countryCode}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
              </span>
              <span className="text-[9px] font-mono text-muted-foreground">location detected</span>
            </div>
          </>
        )}

        {loc.status === 'error' && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-red-400">{loc.message}</span>
            <button
              onClick={detect}
              className="text-[9px] font-mono text-neon-blue hover:underline w-fit"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// ─── Visitor hook ───────────────────────────────────────────────────────────────
function useVisitors() {
  const [count, setCount] = useState<number | null>(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    // Increment on first mount (new visit), then poll GET every 30s
    const increment = async () => {
      try {
        const res = await fetch('/api/visitors', { method: 'POST' })
        const data = await res.json()
        setCount(data.count)
        setIsNew(true)
        setTimeout(() => setIsNew(false), 2000)
      } catch {
        setCount(null)
      }
    }

    const poll = async () => {
      try {
        const res = await fetch('/api/visitors')
        const data = await res.json()
        setCount(data.count)
      } catch {}
    }

    increment()
    const id = setInterval(poll, 30_000)
    return () => clearInterval(id)
  }, [])

  return { count, isNew }
}

function VisitorCard() {
  const { count, isNew } = useVisitors()

  return (
    <GlassCard delay={0.5}>
      <CardLabel><Users size={10} /> Visitors</CardLabel>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-1.5">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              'text-3xl font-bold font-mono leading-none transition-colors duration-300',
              isNew ? 'text-neon-green' : 'text-foreground'
            )}
          >
            {count === null ? (
              <span className="text-muted-foreground/40 animate-pulse text-2xl">—</span>
            ) : count.toLocaleString()}
          </motion.span>
          {count !== null && (
            <span className="text-xs text-muted-foreground mb-1">total</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">live · updates every 30s</span>
        </div>
      </div>
    </GlassCard>
  )
}

// ─── LinkedIn Card ───────────────────────────────────────────────────────────
function LinkedInCard() {
  const { val: followerVal, ref: followerRef } = useCountUp(1550)
  const { val: connVal, ref: connRef } = useCountUp(500)
  return (
    <GlassCard delay={0.5}>
      <CardLabel><Linkedin size={10} /> LinkedIn</CardLabel>
      <a
        href={siteConfig.author.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 group"
      >
        <span className="text-[10px] font-mono text-muted-foreground group-hover:text-[#0077b5] transition-colors">
          @dinesh-gaikwad ↗
        </span>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col">
            <div className="flex items-end gap-1">
              <span ref={followerRef} className="text-2xl font-bold font-mono text-[#0077b5] leading-none">{followerVal}</span>
              <span className="text-xs text-muted-foreground mb-0.5">followers</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-end gap-1">
              <span ref={connRef} className="text-2xl font-bold font-mono text-[#0077b5] leading-none">{connVal}+</span>
              <span className="text-xs text-muted-foreground mb-0.5">connections</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0077b5] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0077b5]" />
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">professional network</span>
        </div>
      </a>
    </GlassCard>
  )
}

// ─── Instagram Card ───────────────────────────────────────────────────────────
function useInstagramStats() {
  const [stats, setStats] = useState<{ followers: number; following: number } | null>(null)
  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((d) => {
        if (d.followers != null && d.following != null)
          setStats({ followers: d.followers, following: d.following })
      })
      .catch(() => {})
  }, [])
  return stats
}

function InstagramCard() {
  const stats = useInstagramStats()
  const { val: followerVal, ref: followerRef } = useCountUp(stats?.followers ?? 0)
  const { val: followingVal, ref: followingRef } = useCountUp(stats?.following ?? 0)

  return (
    <GlassCard delay={0.55}>
      <CardLabel><Instagram size={10} /> Instagram</CardLabel>
      <a
        href={siteConfig.author.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 group"
      >
        <span className="text-[10px] font-mono text-muted-foreground group-hover:text-[#e1306c] transition-colors">
          @dinesh._.gaikwad ↗
        </span>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col">
            <div className="flex items-end gap-1">
              <span ref={followerRef} className="text-2xl font-bold font-mono text-[#e1306c] leading-none">
                {stats === null ? <span className="text-muted-foreground/40 animate-pulse">—</span> : followerVal}
              </span>
              {stats !== null && <span className="text-xs text-muted-foreground mb-0.5">followers</span>}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-end gap-1">
              <span ref={followingRef} className="text-2xl font-bold font-mono text-[#e1306c] leading-none">
                {stats === null ? <span className="text-muted-foreground/40 animate-pulse">—</span> : followingVal}
              </span>
              {stats !== null && <span className="text-xs text-muted-foreground mb-0.5">following</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e1306c] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#e1306c]" />
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">social network</span>
        </div>
      </a>
    </GlassCard>
  )
}

// ─── Snapchat Card ───────────────────────────────────────────────────────────
function SnapchatCard() {
  return (
    <GlassCard delay={0.6}>
      <CardLabel><Snapchat size={10} /> Snapchat</CardLabel>
      <a
        href={siteConfig.author.social.snapchat}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group"
      >
        <img
          src="https://app.snapchat.com/web/deeplink/snapcode?username=dineshgaikwad07&type=SVG"
          alt="Snapchat QR code for dineshgaikwad07"
          className="w-16 h-16 rounded-xl"
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold font-mono text-[#FFFC00] leading-none">dineshgaikwad07</span>
          <span className="text-[10px] font-mono text-muted-foreground group-hover:text-[#FFFC00] transition-colors">scan to add ↗</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFFC00] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FFFC00]" />
            </span>
            <span className="text-[9px] font-mono text-muted-foreground">social network</span>
          </div>
        </div>
      </a>
    </GlassCard>
  )
}

// ─── Background (reused from old hero) ────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background" />
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function DashboardHero() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon-blue focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to content
      </a>

      <section
        id="hero"
        aria-label="Introduction"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-24"
      >
        <GridBackground />

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px] bg-neon-blue -top-20 -left-20" />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px] bg-neon-purple bottom-0 right-0" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 leading-tight tracking-tight">
              <span className="text-foreground">Hi, I'm </span>
              <span className="text-gradient">Dinesh Gaikwad</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-mono">
              Software Engineer · .NET · Angular · Full-Stack
            </p>
          </motion.div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-12 gap-3 md:gap-4">

            {/* LEFT COL: Network — spans 2 rows */}
            <div className="col-span-12 md:col-span-4 md:row-span-2">
              <NetworkCard />
            </div>

            {/* RIGHT TOP: Metrics */}
            <div className="col-span-12 md:col-span-8">
              <MetricsCard />
            </div>

            {/* RIGHT BOTTOM: LinkedIn + Instagram */}
            <div className="col-span-6 md:col-span-4">
              <LinkedInCard />
            </div>
            <div className="col-span-6 md:col-span-4">
              <InstagramCard />
            </div>

            {/* ROW 2: System Status + System Health + GitHub + Visitors */}
            <div className="col-span-6 md:col-span-3">
              <SystemStatus />
            </div>
            <div className="col-span-6 md:col-span-3">
              <SystemHealth />
            </div>
            <div className="col-span-6 md:col-span-3">
              <GitHubCard />
            </div>
            <div className="col-span-6 md:col-span-3">
              <VisitorCard />
            </div>

            {/* ROW 3: Activity + Location + Snapchat */}
            <div className="col-span-12 md:col-span-3">
              <ActivityCard />
            </div>
            <div className="col-span-12 md:col-span-4">
              <LocationCard />
            </div>
            <div className="col-span-12 md:col-span-5">
              <SnapchatCard />
            </div>

          </div>

        </div>
      </section>
    </>
  )
}
