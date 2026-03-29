'use client'

import dynamic from 'next/dynamic'
import { PageTransition } from '@/components/animations/PageTransition'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTIONS } from '@/core/constants'
import { HeroSection } from '@/components/sections/HeroSection'

const AboutSection = dynamic(() =>
  import('@/components/sections/AboutSection').then((m) => ({ default: m.AboutSection })),
  { ssr: false }
)
const ProjectsSection = dynamic(() =>
  import('@/components/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
)
const EngineeringSection = dynamic(() =>
  import('@/components/sections/EngineeringSection').then((m) => ({ default: m.EngineeringSection }))
)
const SkillsSection = dynamic(() =>
  import('@/components/sections/SkillsSection').then((m) => ({ default: m.SkillsSection }))
)
const ContactSection = dynamic(() =>
  import('@/components/sections/ContactSection').then((m) => ({ default: m.ContactSection }))
)

export default function HomePage() {
  useScrollSpy([...SECTIONS])

  return (
    <PageTransition>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <EngineeringSection />
      <SkillsSection />
      <ContactSection />
    </PageTransition>
  )
}
