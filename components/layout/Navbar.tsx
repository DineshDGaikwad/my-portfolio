'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { navItems, siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Sun, Moon, Terminal, Search, User, Briefcase, Zap, Mail, Sparkles, Code2 } from '@/components/ui/Icons'

// Icons for both desktop and mobile
const navIcons: Record<string, React.ElementType> = {
  about:    User,
  projects: Briefcase,
  skills:   Zap,
  contact:  Mail,
  resume:   Sparkles,
  practice: Code2,
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme, activeSection, devMode, toggleDevMode } = useAppStore()

  const pathname = usePathname()
  const isHome = pathname === '/'

  const navHref = (href: string) => {
    if (href.startsWith('/')) return href
    return isHome ? href : `/${href}`
  }
  const logoHref = isHome ? '#hero' : '/'

  // Determine active state — page routes use pathname, hash anchors use activeSection
  const isActive = (href: string) =>
    href.startsWith('/') ? pathname === href : activeSection === href.replace('#', '')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const glassStyle = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  }

  return (
    <>
      {/* ── DESKTOP Navbar (md+) ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center px-4 pt-4 pointer-events-none"
        role="banner"
      >
        <motion.div
          animate={{
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
              : '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={glassStyle}
          className={cn(
            'pointer-events-auto w-full max-w-4xl rounded-full ring-1 ring-white/[0.08] transition-colors duration-300',
            scrolled ? 'bg-white/[0.08]' : 'bg-white/[0.05]'
          )}
        >
          <nav className="px-4 py-2.5 flex items-center justify-between gap-2" aria-label="Main navigation">

            {/* Logo */}
            <motion.a
              href={logoHref}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono text-neon-blue font-bold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue rounded-full shrink-0"
              aria-label="Dinesh Gaikwad — home"
            >
              DG<span className="text-foreground">.</span>
            </motion.a>

            {/* Nav links with icons — centered */}
            <ul className="flex items-center gap-0.5 flex-1 justify-center" role="list">
              {navItems.map((item) => {
                const key = item.href.replace('#', '').replace(/^\//,'').replace(/\//g, '-')
                const active = isActive(item.href)
                const Icon = navIcons[key]
                return (
                  <li key={item.href}>
                    <motion.a
                      href={navHref(item.href)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'relative flex items-center gap-1 text-sm font-medium px-2.5 py-1.5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue whitespace-nowrap',
                        active ? 'text-neon-blue' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="desktop-nav-pill"
                          className="absolute inset-0 rounded-full bg-neon-blue/10 border border-neon-blue/20"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      {Icon && (
                        <span className="relative z-10 opacity-70">
                          <Icon size={11} aria-hidden="true" />
                        </span>
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </motion.a>
                  </li>
                )
              })}
            </ul>

            {/* Actions — shrink-0 so they never get squeezed */}
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
                className="p-2 rounded-full border border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground transition-all"
                aria-label="Open command palette"
              >
                <Search size={13} aria-hidden="true" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleDevMode}
                aria-label={devMode ? 'Disable developer mode' : 'Enable developer mode'}
                aria-pressed={devMode}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
                  devMode ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-white/10 text-muted-foreground hover:border-white/20'
                )}
              >
                <Terminal size={11} className={cn(devMode && 'animate-pulse')} aria-hidden="true" />
                {devMode ? 'DEV ON' : 'DEV'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              </motion.button>
            </div>
          </nav>
        </motion.div>
      </motion.header>

      {/* ── MOBILE Top bar ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex justify-center px-4 pt-3 pointer-events-none"
        role="banner"
      >
        <div
          className="pointer-events-auto w-full rounded-full ring-1 ring-white/[0.08] px-4 py-2 flex items-center justify-between"
          style={glassStyle}
        >
          <motion.a
            href={logoHref}
            whileTap={{ scale: 0.95 }}
            className="font-mono text-neon-blue font-bold text-base tracking-tight"
            aria-label="Dinesh Gaikwad — home"
          >
            DG<span className="text-foreground">.</span>
          </motion.a>

          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="Open command palette"
            >
              <Search size={15} aria-hidden="true" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE Bottom dock ── */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="fixed bottom-5 left-0 right-0 z-50 md:hidden flex justify-center px-6 pointer-events-none"
        aria-label="Mobile navigation"
      >
        <div
          className="pointer-events-auto flex items-center gap-0.5 px-3 py-2 rounded-full ring-1 ring-white/[0.08]"
          style={glassStyle}
        >
          {navItems.map((item) => {
            const key = item.href.replace('#', '').replace(/^\//, '').replace(/\//g, '-')
            const active = isActive(item.href)
            const Icon = navIcons[key]
            return (
              <motion.a
                key={item.href}
                href={navHref(item.href)}
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
                aria-label={item.label}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-dock-pill"
                    className="absolute inset-0 rounded-full bg-neon-blue/10 border border-neon-blue/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn('relative z-10 transition-colors duration-200', active ? 'text-neon-blue' : 'text-muted-foreground')}>
                  {Icon && <Icon size={18} aria-hidden="true" />}
                </span>
                <span className={cn('relative z-10 text-[10px] font-medium leading-none transition-colors duration-200', active ? 'text-neon-blue' : 'text-muted-foreground')}>
                  {item.label}
                </span>
              </motion.a>
            )
          })}

          <span className="w-px h-6 bg-white/10 mx-1" aria-hidden="true" />

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={toggleDevMode}
            aria-label={devMode ? 'Disable developer mode' : 'Enable developer mode'}
            aria-pressed={devMode}
            className={cn(
              'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors duration-200',
              devMode ? 'text-neon-green' : 'text-muted-foreground'
            )}
          >
            {devMode && (
              <motion.span
                layoutId="mobile-dock-dev"
                className="absolute inset-0 rounded-full bg-neon-green/10 border border-neon-green/20"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">
              <Terminal size={18} className={cn(devMode && 'animate-pulse')} aria-hidden="true" />
            </span>
            <span className="relative z-10 text-[10px] font-medium leading-none font-mono">
              {devMode ? 'ON' : 'DEV'}
            </span>
          </motion.button>
        </div>
      </motion.nav>
    </>
  )
}
