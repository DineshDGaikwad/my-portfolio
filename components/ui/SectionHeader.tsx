'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  command: string
  description: string
  status?: string
  className?: string
  align?: 'left' | 'center'
}

function useTypewriter(text: string, enabled: boolean, speed = 38) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, enabled, speed])

  return { displayed, done }
}

export function SectionHeader({
  command,
  description,
  status = 'ACTIVE',
  className,
  align = 'center',
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { displayed, done } = useTypewriter(command, inView)

  const isCenter = align === 'center'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mb-16', isCenter && 'text-center', className)}
    >
      {/* Command line */}
      <div className={cn('flex items-center gap-2 mb-3', isCenter && 'justify-center')}>
        {/* Prompt */}
        <span className="text-neon-green font-mono text-sm select-none" aria-hidden="true">›</span>

        {/* Command text with typewriter */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-foreground tracking-tight"
          aria-label={command}
        >
          <span className="text-neon-blue">{displayed}</span>
          {/* Blinking cursor — shows while typing, stays after */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="inline-block ml-0.5 text-neon-blue"
            aria-hidden="true"
          >
            _
          </motion.span>
        </h2>
      </div>

      {/* Description — fades in after command finishes */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          'text-muted-foreground text-sm md:text-base font-mono max-w-2xl',
          isCenter && 'mx-auto'
        )}
      >
        {description}
      </motion.p>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.25 }}
        className={cn('flex items-center gap-2 mt-4', isCenter && 'justify-center')}
      >
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
        </span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          STATUS: <span className="text-neon-green">{status}</span>
        </span>
      </motion.div>

      {/* Gradient divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={done ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: isCenter ? 0.5 : 0 }}
        className={cn(
          'mt-6 h-px max-w-2xl',
          isCenter && 'mx-auto',
          'bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent'
        )}
        aria-hidden="true"
      />
    </motion.div>
  )
}
