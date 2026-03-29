'use client'

import { motion, Variants, HTMLMotionProps } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode
  className?: string
}

export function MotionSection({ children, className, ...props }: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}

interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  variants?: Variants
  delay?: number
}

export function MotionDiv({ children, className, variants = fadeUp, delay, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={delay ? { ...variants, visible: { ...(variants.visible as object), transition: { ...(typeof variants.visible === 'object' && 'transition' in variants.visible ? (variants.visible as { transition?: object }).transition : {}), delay } } } : variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
