import { ProjectCardSkeleton, SkillBarSkeleton, Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto space-y-20" aria-label="Loading content">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-4 py-20">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-16 w-96 max-w-full" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-12 w-80 max-w-full" />
      </div>

      {/* Projects skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>

      {/* Skills skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkillBarSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
