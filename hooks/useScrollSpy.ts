'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useScrollSpy(sectionIds: string[]) {
  const setActiveSection = useAppStore((s) => s.setActiveSection)
  // Stable ref so the effect doesn't re-run when setActiveSection identity changes
  const setActiveSectionRef = useRef(setActiveSection)
  setActiveSectionRef.current = setActiveSection

  // Join to a string so the effect only re-runs when the actual IDs change,
  // not when the caller passes a new array reference each render
  const idsKey = sectionIds.join(',')

  useEffect(() => {
    const ids = idsKey.split(',').filter(Boolean)
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSectionRef.current(id)
        },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
      )
      observer.observe(el)
      return observer
    })

    return () => observers.forEach((o) => o?.disconnect())
  }, [idsKey])
}
