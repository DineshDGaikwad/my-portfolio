'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  once?: boolean
}

export function TextReveal({ text, className, delay = 0, once = true }: TextRevealProps) {
  const words = text.split(' ')

  return (
    <motion.span
      className={cn('inline-flex flex-wrap gap-x-[0.25em]', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="overflow-hidden inline-block"
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: delay + i * 0.06,
                },
              },
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </motion.span>
  )
}
