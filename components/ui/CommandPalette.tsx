'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Code2, Mail, Github, Briefcase, GraduationCap, X } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { projects } from '@/data/projects'
import { siteConfig } from '@/config/site'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  action: () => void
  category: 'navigation' | 'projects' | 'social' | 'actions'
}

const categoryLabels: Record<string, string> = {
  navigation: 'Navigation',
  projects: 'Projects',
  social: 'Connect',
  actions: 'Actions',
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const scrollTo = (id: string) => {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const commands: Command[] = [
    { id: 'about', label: 'About Dinesh', description: 'Story, education, experience', icon: GraduationCap, action: () => scrollTo('about'), category: 'navigation' },
    { id: 'projects', label: 'Projects', description: 'View all projects', icon: Code2, action: () => scrollTo('projects'), category: 'navigation' },
    { id: 'skills', label: 'Skills', description: 'Technical arsenal', icon: Briefcase, action: () => scrollTo('skills'), category: 'navigation' },
    { id: 'contact', label: 'Contact', description: 'Get in touch', icon: Mail, action: () => scrollTo('contact'), category: 'navigation' },
    ...projects.map((p) => ({
      id: p.slug,
      label: p.title,
      description: p.tagline,
      icon: Code2,
      action: () => { setOpen(false); router.push(`/projects/${p.slug}`) },
      category: 'projects' as const,
    })),
    { id: 'github', label: 'GitHub Profile', description: siteConfig.author.social.github, icon: Github, action: () => { setOpen(false); window.open(siteConfig.author.social.github, '_blank') }, category: 'social' },
    { id: 'email', label: 'Send Email', description: siteConfig.author.email, icon: Mail, action: () => { setOpen(false); window.location.href = `mailto:${siteConfig.author.email}` }, category: 'social' },
  ]

  const filtered = query.trim()
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  // BUG FIX 9: stable flat list — no mutating globalIndex counter
  const flatFiltered = Object.values(grouped).flat()

  // BUG FIX 10: router in deps so navigation commands always use current router
  const execute = useCallback((cmd: Command) => {
    cmd.action()
    setQuery('')
    setSelected(0)
    setOpen(false)
  }, [router])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        setQuery('')
        setSelected(0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && flatFiltered[selected]) {
      execute(flatFiltered[selected])
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-xl px-4"
            role="dialog"
            aria-label="Command palette"
            aria-modal="true"
          >
            <div className="glass rounded-2xl border border-white/15 shadow-2xl shadow-black/60 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands, projects, actions..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded={true}
                  aria-autocomplete="list"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close command palette"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2" role="listbox">
                {Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category}>
                    <p className="px-4 py-1.5 text-2xs font-mono text-muted-foreground/60 uppercase tracking-widest">
                      {categoryLabels[category]}
                    </p>
                    {cmds.map((cmd) => {
                      // BUG FIX 9: stable index from flat array, not a mutating counter
                      const idx = flatFiltered.indexOf(cmd)
                      const isSelected = idx === selected
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelected(idx)}
                          role="option"
                          aria-selected={isSelected}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                            isSelected ? 'bg-neon-blue/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <cmd.icon
                            size={15}
                            className={cn('shrink-0', isSelected ? 'text-neon-blue' : 'text-muted-foreground')}
                            aria-hidden="true"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block">{cmd.label}</span>
                            {cmd.description && (
                              <span className="text-xs text-muted-foreground/70 truncate block">{cmd.description}</span>
                            )}
                          </div>
                          {isSelected && <ArrowRight size={12} className="text-neon-blue shrink-0" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                ))}

                {filtered.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-2xs text-muted-foreground/50 font-mono">
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-2xs">↑↓</kbd> navigate</span>
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-2xs">↵</kbd> select</span>
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-2xs">esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
