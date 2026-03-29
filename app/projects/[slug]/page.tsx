import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { CaseStudyClient } from './CaseStudyClient'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
  }
}

export default function CaseStudyPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()
  return <CaseStudyClient project={project} />
}
