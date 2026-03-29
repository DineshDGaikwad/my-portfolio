import { cn } from '@/lib/utils'

interface FilterButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

export function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue',
        active
          ? 'bg-neon-blue text-black border-neon-blue'
          : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}
