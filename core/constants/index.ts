export const SECTIONS = ['hero', 'about', 'projects', 'skills', 'contact'] as const
export type SectionId = typeof SECTIONS[number]

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export const GITHUB_USERNAME = 'DineshDGaikwad'
export const GITHUB_API_BASE = 'https://api.github.com'

export const AI_CONTEXT_KEY = 'portfolio-ai-context'
