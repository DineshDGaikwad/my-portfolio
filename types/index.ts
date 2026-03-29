// ─── Project Types ────────────────────────────────────────────────────────────

export interface Project {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  thumbnail: string
  images: string[]
  tags: string[]
  category: ProjectCategory          // primary category (for color/icon)
  categories?: ProjectCategory[]     // optional multi-tag
  featured: boolean
  status: 'completed' | 'in-progress' | 'archived'
  year: number
  source: 'personal' | 'internship'  // origin badge
  links: {
    live?: string
    github?: string
    case_study?: string
  }
  caseStudy: CaseStudy
  metrics?: ProjectMetric[]
}

export type ProjectCategory =
  | 'fullstack'
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'devops'
  | 'ai-ml'
  | 'open-source'

export interface CaseStudy {
  problem: string
  problemDetailed?: string           // expanded problem with context & constraints
  approach: string
  architecture: string
  techStack: TechItem[]
  challenges: Challenge[]
  results: Result[]
  contributions?: string[]
  features?: string[]
  featuresExtended?: FeatureGroup[]  // grouped advanced features
  challengesExtended?: Challenge[]   // detailed challenges with impact
  designDecisions?: string[]         // why this architecture was chosen
  performanceNotes?: string[]        // query optimization, indexing, etc.
  securityNotes?: string[]           // security considerations
  edgeCases?: string[]               // edge case handling
  learnings?: string[]               // what was learned
  futureImprovements?: string[]      // what would be improved next
  codeSnippets?: CodeSnippet[]
}

export interface FeatureGroup {
  category: string
  icon: string
  items: string[]
}

export interface Challenge {
  title: string
  description: string
  solution: string
}

export interface Result {
  metric: string
  value: string
  description: string
}

export interface CodeSnippet {
  title: string
  language: string
  code: string
  description?: string
}

export interface ProjectMetric {
  label: string
  value: string
  icon?: string
}

// ─── Skill Types ──────────────────────────────────────────────────────────────

export interface Skill {
  name: string
  level: number // 0-100
  category: SkillCategory
  icon?: string
  color?: string
  yearsOfExperience?: number
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'languages'
  | 'cloud'
  | 'ai-ml'

export interface TechItem {
  name: string
  icon?: string
  color?: string
}

// ─── Experience Types ─────────────────────────────────────────────────────────

export interface Experience {
  id: string
  company: string
  role: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  startDate: string
  endDate: string | 'Present'
  description: string
  achievements: string[]
  techStack: string[]
  logo?: string
  location: string
  remote: boolean
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  category: string
  publishedAt: string
  updatedAt?: string
  readingTime: number
  featured: boolean
  author: Author
}

export interface Author {
  name: string
  avatar: string
  bio: string
  social: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

// ─── Contact Types ────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  budget?: string
  projectType?: string
}

export interface ContactFormState {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

// ─── GitHub Types ─────────────────────────────────────────────────────────────

export interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  totalCommits: number
  followers: number
  following: number
  contributions: number
  topLanguages: { name: string; percentage: number; color: string }[]
}

export interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  topics: string[]
  updated_at: string
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  external?: boolean
}

// ─── Animation Types ──────────────────────────────────────────────────────────

export interface AnimationVariants {
  hidden: object
  visible: object
  exit?: object
}

// ─── Theme Types ──────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light'

// ─── Metric Types ─────────────────────────────────────────────────────────────

export interface Metric {
  label: string
  value: number
  suffix: string
  prefix?: string
  description: string
  icon: string
}
