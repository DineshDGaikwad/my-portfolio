import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        'bg-white/5 border-white/10 text-muted-foreground',
        className
      )}
      style={color ? { borderColor: `${color}40`, color, backgroundColor: `${color}10` } : {}}
    >
      {children}
    </span>
  )
}
