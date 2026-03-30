'use client'

import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { MotionSection, MotionDiv, slideLeft, slideRight } from '@/components/animations/motion'
import { ContactFormData } from '@/types'
import { siteConfig } from '@/config/site'
import {
  Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle,
  Clock, MessageSquare, ArrowUpRight, Phone,
  Briefcase, Users, Smile,
} from '@/components/ui/Icons'
import { Github, Linkedin, Instagram, Snapchat, Twitter } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

// ─── Quick subject chips ──────────────────────────────────────────────────────
const CHIPS: { icon: React.ElementType; label: string; value: string }[] = [
  { icon: Briefcase,     label: 'Work Together',   value: 'Working Together'        },
  { icon: MessageSquare, label: 'Tech Discussion',  value: 'Tech Discussion'         },
  { icon: Users,         label: 'Collaboration',    value: 'Project Collaboration'   },
  { icon: Smile,         label: 'Just saying hi',   value: 'Just saying hi!'         },
]

// ─── Floating label input ─────────────────────────────────────────────────────
function FloatingInput({
  id, label, type = 'text', error, registration, autoComplete,
}: {
  id: string; label: string; type?: string; error?: string
  registration: object; autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value) }}
        onChange={(e) => setHasValue(!!e.target.value)}
        aria-invalid={!!error}
        className={cn(
          'peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/[0.04] border text-sm text-foreground',
          'focus:outline-none transition-all duration-200',
          'placeholder-transparent',
          error
            ? 'border-red-500/50 focus:border-red-400'
            : 'border-white/10 hover:border-white/20 focus:border-neon-blue/60'
        )}
        placeholder={label}
        {...registration}
      />
      <label
        htmlFor={id}
        className={cn(
          'absolute left-4 transition-all duration-200 pointer-events-none select-none',
          focused || hasValue
            ? 'top-1.5 text-2xs font-mono tracking-wider'
            : 'top-1/2 -translate-y-1/2 text-sm',
          focused
            ? 'text-neon-blue'
            : hasValue
            ? 'text-muted-foreground/60'
            : 'text-muted-foreground/50'
        )}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-2xs text-red-400 font-mono flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  )
}

// ─── Floating label textarea ──────────────────────────────────────────────────
function FloatingTextarea({
  id, label, error, registration, maxLength,
}: {
  id: string; label: string; error?: string
  registration: object; maxLength: number
}) {
  const [focused, setFocused] = useState(false)
  const [count, setCount] = useState(0)

  return (
    <div className="relative">
      <textarea
        id={id}
        rows={5}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setCount(e.target.value.length)}
        aria-invalid={!!error}
        className={cn(
          'peer w-full px-4 pt-6 pb-2 rounded-xl bg-white/[0.04] border text-sm text-foreground',
          'focus:outline-none transition-all duration-200 resize-none',
          'placeholder-transparent',
          error
            ? 'border-red-500/50 focus:border-red-400'
            : 'border-white/10 hover:border-white/20 focus:border-neon-blue/60'
        )}
        placeholder={label}
        {...registration}
      />
      <label
        htmlFor={id}
        className={cn(
          'absolute left-4 top-2 text-2xs font-mono tracking-wider pointer-events-none select-none transition-colors duration-200',
          focused ? 'text-neon-blue' : 'text-muted-foreground/50'
        )}
      >
        {label}
      </label>
      <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
        <span className={cn(
          'text-2xs font-mono transition-colors',
          count > maxLength * 0.9 ? 'text-red-400' : 'text-muted-foreground/30'
        )}>
          {count}/{maxLength}
        </span>
      </div>
      {error && (
        <p className="mt-1 text-2xs text-red-400 font-mono flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [activeChip, setActiveChip] = useState<string | null>(null)
  const subjectRef = useRef<HTMLInputElement | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContactFormData>()

  const { ref: subjectFormRef, ...subjectRest } = register('subject', { required: 'Subject is required' })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        reply_to: data.email,
      }

      // Main notification email — must succeed
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      // Auto-reply + DB save — fire and forget, don't block success
      emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      ).catch(() => {})

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {})

      setStatus('success')
      reset()
      setActiveChip(null)
    } catch {
      setStatus('error')
    }
  }

  const handleChip = (chip: typeof CHIPS[0]) => {
    setActiveChip(chip.value)
    setValue('subject', chip.value)
  }

  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <MotionSection>
        <SectionHeader
          command="open_channel"
          description="Have a project in mind? Let's build something great together."
          status="LISTENING"
        />

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── Left panel ── */}
          <MotionDiv variants={slideLeft} className="lg:col-span-2 space-y-4">

            {/* ── Availability card ── */}
            <div className="glass rounded-2xl overflow-hidden border border-white/10">
              {/* Top bar */}
              <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
                </span>
                <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest">Available for opportunities</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-foreground mb-1">Let's build something</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Software Engineer at{' '}
                  <a href="https://www.kanini.com" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">KANINI</a>
                  . Open to collaborations, side projects, and interesting technical conversations.
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['.NET', 'Angular', 'React', 'Full-Stack', 'AI/ML'].map((t) => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-neon-blue/20 text-neon-blue/70 bg-neon-blue/5">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Contact info ── */}
            <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">Direct contact</p>
              {[
                { href: `mailto:${siteConfig.author.email}`, icon: Mail,   label: 'Email',    value: siteConfig.author.email,    color: '#00d4ff',  hoverBg: 'hover:bg-neon-blue/10' },
                { href: `tel:${siteConfig.author.phone}`,    icon: Phone,  label: 'Phone',    value: siteConfig.author.phone,    color: '#7c3aed',  hoverBg: 'hover:bg-purple-500/10' },
              ].map(({ href, icon: Icon, label, value, color, hoverBg }) => (
                <a
                  key={label}
                  href={href}
                  className={cn('flex items-center gap-3 p-2.5 rounded-xl transition-all group', hoverBg)}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-mono text-foreground/80 group-hover:text-foreground transition-colors truncate">{value}</p>
                  </div>
                  <ArrowUpRight size={12} className="text-muted-foreground/20 group-hover:text-foreground/60 transition-colors shrink-0" />
                </a>
              ))}
              <div className="flex items-center gap-3 p-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5">
                  <MapPin size={14} className="text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-wider">Location</p>
                  <p className="text-xs font-mono text-foreground/80">{siteConfig.author.location}</p>
                </div>
              </div>
            </div>

            {/* ── Socials ── */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-3">Find me on</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: siteConfig.author.social.github,    Icon: Github,    label: 'GitHub',    sub: '@DineshDGaikwad',      color: '#ffffff' },
                  { href: siteConfig.author.social.linkedin,  Icon: Linkedin,  label: 'LinkedIn',  sub: '1.5k followers',        color: '#0077b5' },
                  { href: siteConfig.author.social.instagram, Icon: Instagram, label: 'Instagram', sub: '@dinesh._.gaikwad',     color: '#e1306c' },
                  { href: siteConfig.author.social.snapchat,  Icon: Snapchat,  label: 'Snapchat',  sub: 'dineshgaikwad07',       color: '#FFFC00' },
                  { href: siteConfig.author.social.twitter,   Icon: Twitter,   label: 'Twitter',   sub: '@dineshgaikwad',        color: '#1da1f2' },
                ].map(({ href, Icon, label, sub, color }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/20 transition-all group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono text-foreground/80 leading-none mb-0.5">{label}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40 truncate">{sub}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

          </MotionDiv>

          {/* ── Form ── */}
          <MotionDiv variants={slideRight} className="lg:col-span-3">

            {/* Response time bar — above form */}
            <div className="glass rounded-xl px-5 py-3 border border-white/10 flex items-center gap-3 mb-3">
              <Clock size={12} className="text-muted-foreground/40 shrink-0" />
              <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest shrink-0">Avg response</span>
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 h-1.5 rounded-sm"
                    style={{ backgroundColor: i < 10 ? (i < 4 ? '#4ade80' : i < 8 ? '#00d4ff' : '#facc15') : 'rgba(255,255,255,0.06)' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-neon-green font-bold shrink-0">~24 hrs</span>
            </div>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">

              {/* Form header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
                <MessageSquare size={14} className="text-neon-blue" />
                <span className="text-sm font-mono text-foreground">new_message.ts</span>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>

              <div className="p-6">
                {/* Quick chips */}
                <div className="mb-5">
                  <p className="text-2xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-2.5">
                    Quick select
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CHIPS.map((chip) => (
                      <button
                        key={chip.value}
                        type="button"
                        onClick={() => handleChip(chip)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all',
                          activeChip === chip.value
                            ? 'bg-neon-blue/15 border-neon-blue/50 text-neon-blue'
                            : 'border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground'
                        )}
                      >
                        <chip.icon size={12} aria-hidden="true" />
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-16 flex flex-col items-center justify-center text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-neon-green" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground mb-1">Message sent!</p>
                        <p className="text-sm text-muted-foreground">I'll get back to you within 24 hours.</p>
                      </div>
                      <button
                        onClick={() => setStatus('idle')}
                        className="text-xs font-mono text-neon-blue hover:underline mt-2"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                      noValidate
                      aria-label="Contact form"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FloatingInput
                          id="contact-name"
                          label="Your name"
                          autoComplete="name"
                          error={errors.name?.message}
                          registration={register('name', { required: 'Name is required' })}
                        />
                        <FloatingInput
                          id="contact-email"
                          label="Email address"
                          type="email"
                          autoComplete="email"
                          error={errors.email?.message}
                          registration={register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                          })}
                        />
                      </div>

                      {/* Subject — controlled by chips or free text */}
                      <div className="relative">
                        <input
                          id="contact-subject"
                          type="text"
                          placeholder=" "
                          aria-invalid={!!errors.subject}
                          ref={(e) => { subjectFormRef(e); subjectRef.current = e }}
                          {...subjectRest}
                          className={cn(
                            'peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/[0.04] border text-sm text-foreground',
                            'focus:outline-none transition-all duration-200 placeholder-transparent',
                            errors.subject
                              ? 'border-red-500/50 focus:border-red-400'
                              : 'border-white/10 hover:border-white/20 focus:border-neon-blue/60'
                          )}
                        />
                        <label
                          htmlFor="contact-subject"
                          className="absolute left-4 top-1.5 text-2xs font-mono tracking-wider text-muted-foreground/50 pointer-events-none select-none peer-focus:text-neon-blue transition-colors"
                        >
                          Subject
                        </label>
                        {errors.subject && (
                          <p className="mt-1 text-2xs text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle size={10} /> {errors.subject.message}
                          </p>
                        )}
                      </div>

                      <FloatingTextarea
                        id="contact-message"
                        label="Message"
                        maxLength={1000}
                        error={errors.message?.message}
                        registration={register('message', {
                          required: 'Message is required',
                          minLength: { value: 20, message: 'At least 20 characters' },
                        })}
                      />

                      {/* Error state */}
                      {status === 'error' && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                          role="alert"
                        >
                          <AlertCircle size={13} />
                          Something went wrong. Email me directly at{' '}
                          <a href={`mailto:${siteConfig.author.email}`} className="underline">
                            {siteConfig.author.email}
                          </a>
                        </motion.p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={cn(
                          'w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl',
                          'text-sm font-semibold transition-all duration-200',
                          'bg-gradient-to-r from-neon-blue to-neon-purple text-black',
                          'hover:opacity-90 hover:shadow-lg hover:shadow-neon-blue/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue'
                        )}
                        aria-busy={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            Send Message
                          </>
                        )}
                      </button>

                      <p className="text-center text-2xs text-muted-foreground/40 font-mono">
                        No spam. No newsletters. Just a direct reply from me.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>
    </Section>
  )
}
