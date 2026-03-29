'use client'

import { motion } from 'framer-motion'
import { siteConfig, navItems } from '@/config/site'
import { Github, Linkedin, Twitter, Instagram, Snapchat } from '@/components/ui/Icons'
import { Mail, MapPin, ArrowUpRight, Terminal } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const socials = [
  { href: siteConfig.author.social.github,    Icon: Github,    label: 'GitHub',    color: 'hover:text-white hover:border-white/40' },
  { href: siteConfig.author.social.linkedin,  Icon: Linkedin,  label: 'LinkedIn',  color: 'hover:text-[#0077b5] hover:border-[#0077b5]/50' },
  { href: siteConfig.author.social.instagram, Icon: Instagram, label: 'Instagram', color: 'hover:text-[#e1306c] hover:border-[#e1306c]/50' },
  { href: siteConfig.author.social.snapchat,  Icon: Snapchat,  label: 'Snapchat',  color: 'hover:text-[#FFFC00] hover:border-[#FFFC00]/50' },
  { href: siteConfig.author.social.twitter,   Icon: Twitter,   label: 'Twitter',   color: 'hover:text-sky-400 hover:border-sky-400/50' },
]

const stack = ['.NET', 'Angular', 'React', 'Next.js', 'Python', 'MongoDB', 'AWS']

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className="relative border-t border-white/[0.06] bg-background overflow-hidden"
    >
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-14">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-neon-blue" />
              <span className="text-sm font-bold font-mono text-foreground tracking-tight">
                dinesh.dev
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              Software Engineer at{' '}
              <a
                href="https://www.kanini.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline"
              >
                KANINI
              </a>
              . Building enterprise systems with .NET &amp; Angular.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <MapPin size={11} className="text-neon-blue/60" />
              {siteConfig.author.location}
            </div>
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-neon-blue transition-colors w-fit"
            >
              <Mail size={11} />
              {siteConfig.author.email}
            </a>
          </div>

          {/* Nav col */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {navItems.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-neon-blue transition-colors group w-fit"
                  >
                    <span className="text-neon-blue/30 group-hover:text-neon-blue transition-colors font-mono">›</span>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-neon-blue transition-colors group w-fit"
                >
                  <span className="text-neon-blue/30 group-hover:text-neon-blue transition-colors font-mono">›</span>
                  Resume
                  <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Socials col */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Connect
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ href, Icon, label, color }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10',
                    'text-xs font-mono text-muted-foreground transition-all duration-200',
                    color
                  )}
                >
                  <Icon size={13} aria-hidden="true" />
                  {label}
                </motion.a>
              ))}
            </div>

            {/* Tech stack pills */}
            <div className="pt-2">
              <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-2.5">
                Built with
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stack.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.07] text-muted-foreground/50 bg-white/[0.02]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/[0.06] mb-6" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-muted-foreground/40">
            <span className="text-neon-blue/60">©</span> {year}{' '}
            <span className="text-muted-foreground/60">{siteConfig.author.name}</span>
            {' '}— All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-green" />
            </span>
            <span className="text-[11px] font-mono text-muted-foreground/40">
              All systems operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}
