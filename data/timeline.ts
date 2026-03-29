export type TimelineCategory = 'education' | 'career'

export type TimelineType =
  | 'school'
  | 'higher-secondary'
  | 'engineering'
  | 'certification'
  | 'internship'
  | 'full-time'
  | 'relocation'

export interface TimelineEntry {
  id: string
  title: string
  organization: string
  location?: string
  period: string
  startYear: number
  category: TimelineCategory
  type: TimelineType
  description?: string
  achievements?: string[]
  highlight?: string
  techStack?: string[]
  learned?: string
  isMilestone?: boolean
}

export const timelineEntries: TimelineEntry[] = [
  // ─── Education ────────────────────────────────────────────────────────────
  {
    id: 'school-1',
    title: 'Primary Education',
    organization: "St. Mary's School",
    location: 'Newasa, Ahilyanagar',
    period: 'Until 2014',
    startYear: 2008,
    category: 'education',
    type: 'school',
    description: 'Completed primary schooling up to 6th standard.',
    achievements: ['Foundation in English medium education'],
  },
  {
    id: 'school-2',
    title: 'Secondary Education (7th – 10th)',
    organization: 'Alma Malik International School',
    location: 'Kokamthan, Kopargaon',
    period: '2014 – 2019',
    startYear: 2014,
    category: 'education',
    type: 'school',
    description: 'Joined from 7th standard and completed 10th standard (SSC). Maharashtra State Board.',
    achievements: [
      'SSC Score: 85.80%',
      'Strong foundation in Mathematics and Science',
    ],
    highlight: '85.80% — SSC',
    learned: 'Developed discipline, consistency, and a strong base in logical thinking.',
  },
  {
    id: 'hsc',
    title: 'Higher Secondary (11th – 12th)',
    organization: 'Residential Junior College',
    location: 'Ahmednagar',
    period: '2019 – 2021',
    startYear: 2019,
    category: 'education',
    type: 'higher-secondary',
    description: 'Completed HSC (Science stream) with focus on JEE preparation. Maharashtra State Board.',
    achievements: [
      'HSC Score: 70.83%',
      'JEE Mains Percentile: 83.50',
      'Qualified for JEE Advanced',
    ],
    highlight: 'JEE Mains — 83.50 percentile',
    isMilestone: true,
    learned: 'Learned to handle pressure, manage time across subjects, and think analytically under constraints.',
  },
  {
    id: 'engineering',
    title: 'B.E. Computer Science & Engineering',
    organization: 'Shrimati Kashibai Navale College of Engineering (SKNCOE)',
    location: 'Pune, Maharashtra',
    period: 'Aug 2021 – Apr 2025',
    startYear: 2021,
    category: 'education',
    type: 'engineering',
    description: 'Affiliated with Savitribai Phule Pune University (SPPU). Pursued Data Science as Honour subject. Graduated April 2025. Built 5+ projects including Tesla Academy (full-stack e-learning platform).',
    achievements: [
      'CGPA: 8.13 / 10',
      'Honour subject: Data Science',
      'International Level Data Science Workshop — Feb 2024',
      'Built Tesla Academy — full-stack e-learning platform with FastAPI + AWS S3',
      'Built Transport Management System, Car Rental System, CVFS (C++)',
      'Microsoft Azure AZ-900 Certified — 940/1000',
    ],
    highlight: 'CGPA 8.13 · Graduated Apr 2025',
    isMilestone: true,
    techStack: ['Python', 'Java', 'C++', 'ReactJS', 'Django', 'FastAPI', 'AWS'],
    learned: 'Learned to think in systems — architecture, data structures, algorithms, and how software scales in the real world.',
  },

  // ─── Career ───────────────────────────────────────────────────────────────
  {
    id: 'kanini-intern',
    title: 'Software Engineer Intern',
    organization: 'KANINI',
    location: 'Bangalore, Karnataka',
    period: 'May 2025 – Jan 2026',
    startYear: 2025,
    category: 'career',
    type: 'internship',
    description: 'Joined KANINI as a Software Engineer Intern after graduation. Built 4 production-grade enterprise systems using .NET 8, ReactJS, and MS SQL Server.',
    achievements: [
      'Built BookNow — real-time booking platform with slot conflict resolution',
      'Built Property Registry Portal — ownership transfer & document verification system',
      'Built Ticket Raising Platform — Jira-like Kanban board with lifecycle management',
      'Built Admin Analytics Dashboard — KPI tracking across all systems',
      'Implemented JWT auth, clean architecture (Controller → Service → Repository → DB)',
      'Designed normalized MS SQL schemas with indexing and stored procedures',
      'Internship concluded: 28 January 2026',
    ],
    highlight: 'Post-graduation · 4 enterprise systems · Bangalore',
    isMilestone: true,
    techStack: ['.NET 8 Web API', 'ReactJS', 'MS SQL Server', 'Entity Framework Core', 'JWT', 'Swagger', 'Git'],
    learned: 'Learned enterprise engineering — clean architecture, sprint cycles, code reviews, and building systems that handle real business workflows.',
  },
  {
    id: 'kanini-fulltime',
    title: 'Software Engineer',
    organization: 'KANINI',
    location: 'Bangalore → Pune',
    period: 'Feb 2026 – Present',
    startYear: 2026,
    category: 'career',
    type: 'full-time',
    description: 'Converted to full-time Software Engineer at KANINI after successful internship. Relocating to Pune office effective 1 April 2026.',
    achievements: [
      'Promoted from intern to full-time engineer',
      'Continuing enterprise product development',
      'Relocating to Pune office from 1 April 2026',
    ],
    highlight: 'Full-time · Relocating to Pune Apr 2026',
    isMilestone: true,
    techStack: ['.NET 8', 'ReactJS', 'MS SQL Server', 'Azure'],
  },
]

export const educationEntries = timelineEntries.filter((e) => e.category === 'education')
export const careerEntries = timelineEntries.filter((e) => e.category === 'career')
