'use client'

import dynamic from 'next/dynamic'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AboutIntro } from '@/components/sections/about/AboutIntro'
import { Timeline } from '@/components/sections/about/Timeline'
import { ThinkingEngine } from '@/components/sections/about/ThinkingEngine'
import { Metrics } from '@/components/sections/about/Metrics'
import { Workflow } from '@/components/sections/about/Workflow'
import { Evolution } from '@/components/sections/about/Evolution'

const SkillsGraph = dynamic(
  () => import('@/components/sections/about/SkillsGraph').then((m) => ({ default: m.SkillsGraph })),
  {
    ssr: false,
    loading: () => (
      <div className="mb-20 glass rounded-2xl h-48 animate-pulse flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-mono">Loading skill network...</span>
      </div>
    ),
  }
)

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeader
        command="load_identity"
        description="How I think, work, and grow — not just what I know"
        status="ACTIVE"
      />
      <AboutIntro />
      <Metrics />
      <Timeline />
      <ThinkingEngine />
      <SkillsGraph />
      <Workflow />
      <Evolution />
    </Section>
  )
}
