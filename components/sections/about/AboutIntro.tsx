'use client'

import { motion } from 'framer-motion'
import { Github, ChevronRight, MapPin, Briefcase } from '@/components/ui/Icons'
import { siteConfig } from '@/config/site'

const words = ['engineer', 'builder', 'problem-solver', 'learner']

export function AboutIntro() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
      {/* Left — identity statement */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-4">
          Who I am
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-5">
          A system-focused{' '}
          <span className="text-gradient">full-stack engineer</span>{' '}
          building enterprise-grade systems at scale.
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
          Software Engineer at{' '}
          <a
            href="https://www.kanini.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue hover:underline"
          >
            KANINI
          </a>
          , Pune — building enterprise .NET and Angular systems.
          Azure certified (AZ-900 · 940/1000) · 5+ production projects · passionate about
          clean architecture, AI/ML, and open source.
        </p>

        {/* Quick facts */}
        <div className="space-y-2 mb-6">
          {[
            { icon: MapPin,     text: siteConfig.author.location },
            { icon: Briefcase,  text: 'Software Engineer · KANINI, Pune' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon size={13} className="text-neon-blue shrink-0" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <a
            href={siteConfig.author.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neon-blue hover:underline"
          >
            <Github size={12} aria-hidden="true" />
            GitHub
          </a>
          <a
            href="/resume.pdf"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-neon-blue transition-colors"
          >
            Resume <ChevronRight size={12} aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      {/* Right — rotating identity words */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex flex-col gap-3"
        aria-label="Engineering identity traits"
      >
        {words.map((word, i) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-xl px-5 py-3.5 flex items-center justify-between group hover:border-neon-blue/30 transition-all"
          >
            <span className="text-sm font-mono text-foreground">
              <span className="text-neon-blue mr-2 text-xs">0{i + 1}</span>
              {word}
            </span>
            <div className="w-16 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neon-blue rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - i * 15}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
