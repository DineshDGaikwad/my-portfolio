'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-neon-blue font-mono text-sm mb-4">404</p>
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">This page doesn&apos;t exist or was moved.</p>
        <Button href="/">Go Home</Button>
      </motion.div>
    </div>
  )
}
