import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('py-24 px-4 md:px-8 max-w-6xl mx-auto', className)}>
      {children}
    </section>
  )
}

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ label, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-16 text-center', className)}>
      <span className="text-neon-blue text-sm font-mono tracking-widest uppercase mb-3 block">
        {label}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  )
}
