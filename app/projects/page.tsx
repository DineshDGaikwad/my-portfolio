import { projects } from '@/data/projects'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { FiArrowRight } from 'react-icons/fi'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — Dinesh Gaikwad',
  description: 'A collection of projects built by Dinesh Gaikwad',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">All Projects</h1>
      <p className="text-muted-foreground mb-12">Every project I&apos;ve shipped, documented with case studies.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="glass rounded-xl p-6 hover:border-neon-blue/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-semibold group-hover:text-neon-blue transition-colors">{project.title}</h2>
              <span className="text-xs text-muted-foreground font-mono">{project.year}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{project.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
            <span className="text-xs text-neon-blue font-mono flex items-center gap-1 group-hover:gap-2 transition-all">
              View Case Study <FiArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
