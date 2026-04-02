'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Upload, FileText, X, AlertCircle, ChevronRight } from 'lucide-react'

const ROLES = ['Backend Developer', 'Full Stack Developer', 'SDE'] as const
type Role = typeof ROLES[number]

interface Props {
  onAnalyze: (file: File, role: Role) => void
  loading: boolean
}

export function ResumeUpload({ onAnalyze, loading }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [role, setRole] = useState<Role>('Full Stack Developer')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (f: File): string | null => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(f.type)) return 'Only PDF and DOCX files are supported.'
    if (f.size > 5 * 1024 * 1024) return 'File too large. Max 5MB allowed.'
    return null
  }

  const handleFile = useCallback((f: File) => {
    const err = validate(f)
    if (err) { setError(err); return }
    setError(null)
    setFile(f)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const fmt = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`

  return (
    <div className="space-y-6">
      {/* Role selector */}
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
          Target Role
        </p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-mono border transition-all',
                role === r
                  ? 'bg-neon-blue/15 border-neon-blue/50 text-neon-blue'
                  : 'border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current?.click()}
        animate={{ borderColor: dragOver ? 'rgba(0,212,255,0.6)' : file ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)' }}
        className={cn(
          'relative rounded-2xl border-2 border-dashed transition-all duration-200',
          file ? 'p-6' : 'p-12 cursor-pointer hover:border-white/25',
          dragOver && 'bg-neon-blue/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center shrink-0">
                <FileText size={22} className="text-neon-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{fmt(file.size)} · {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
                dragOver ? 'bg-neon-blue/20 border border-neon-blue/40' : 'bg-white/[0.04] border border-white/10'
              )}>
                <Upload size={28} className={dragOver ? 'text-neon-blue' : 'text-muted-foreground'} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dragOver ? 'Drop it here' : 'Drag & drop your resume'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or <span className="text-neon-blue">browse files</span> · PDF or DOCX · Max 5MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          >
            <AlertCircle size={13} /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        onClick={() => file && onAnalyze(file, role)}
        disabled={!file || loading}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl',
          'text-sm font-semibold font-mono transition-all duration-200',
          'bg-gradient-to-r from-neon-blue to-neon-purple text-black',
          'hover:opacity-90 hover:shadow-lg hover:shadow-neon-blue/20',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Analyze Resume
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  )
}
