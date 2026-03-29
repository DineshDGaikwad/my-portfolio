import { Skill, Experience, Metric } from '@/types'

export const skills: Skill[] = [
  // Frontend
  { name: 'ReactJS', level: 88, category: 'frontend', color: '#61dafb' },
  { name: 'JavaScript', level: 85, category: 'frontend', color: '#f7df1e' },
  { name: 'TailwindCSS', level: 87, category: 'frontend', color: '#06b6d4' },
  { name: 'HTML5 / CSS3', level: 90, category: 'frontend', color: '#e34f26' },
  { name: 'AngularJS', level: 75, category: 'frontend', color: '#dd0031' },
  // Backend
  { name: 'Python', level: 85, category: 'backend', color: '#3776ab' },
  { name: 'FastAPI', level: 80, category: 'backend', color: '#009688' },
  { name: 'Django', level: 78, category: 'backend', color: '#092e20' },
  { name: 'Node.js', level: 75, category: 'backend', color: '#339933' },
  { name: 'Java', level: 80, category: 'backend', color: '#f89820' },
  { name: 'C / C++', level: 78, category: 'backend', color: '#00599c' },
  { name: '.NET (C#)', level: 72, category: 'backend', color: '#512bd4' },
  // Database
  { name: 'MongoDB', level: 80, category: 'database', color: '#47a248' },
  { name: 'MySQL / SQL', level: 78, category: 'database', color: '#336791' },
  { name: 'PL/SQL (Oracle)', level: 65, category: 'database', color: '#f80000' },
  // DevOps & Tools
  { name: 'Git / GitHub', level: 85, category: 'devops', color: '#f05032' },
  { name: 'Docker', level: 68, category: 'devops', color: '#2496ed' },
  // Cloud
  { name: 'AWS', level: 75, category: 'cloud', color: '#ff9900' },
  { name: 'Firebase', level: 70, category: 'cloud', color: '#ffca28' },
  // AI/ML
  { name: 'Data Science (Python)', level: 72, category: 'ai-ml', color: '#412991' },
  { name: 'Machine Learning', level: 65, category: 'ai-ml', color: '#ff6b35' },
]

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'KANINI',
    role: 'Software Engineer',
    type: 'full-time',
    startDate: '2025-01',
    endDate: 'Present',
    description:
      'Building enterprise-grade systems at KANINI, Pune. Working on .NET and Angular-based solutions for large-scale clients.',
    achievements: [
      'Developing full-stack features using .NET (C#) and Angular',
      'Working on enterprise-level architecture and REST APIs',
      'Collaborating with cross-functional teams on client deliverables',
    ],
    techStack: ['.NET', 'C#', 'Angular', 'SQL Server', 'Azure'],
    location: 'Pune, Maharashtra, India',
    remote: false,
  },
  {
    id: '2',
    company: 'Shrimati Kashibai Navale College of Engineering',
    role: 'B.E. Computer Science & Engineering',
    type: 'full-time',
    startDate: '2021-08',
    endDate: '2025-05',
    description:
      'Graduated with B.E. in Computer Engineering from SKNCOE, affiliated with Savitribai Phule Pune University (SPPU). Pursued Data Science as Honour subject.',
    achievements: [
      'CGPA: 8.13 / 10',
      'Honour subject: Data Science',
      'Participated in International Level Data Science Workshop (Feb 2024)',
      'Built 5+ full-stack projects across web, systems, and AI domains',
    ],
    techStack: ['Python', 'Java', 'C++', 'ReactJS', 'Django', 'FastAPI', 'AWS'],
    location: 'Pune, Maharashtra, India',
    remote: false,
  },
  {
    id: '2',
    company: 'Tesla Academy (Personal Project)',
    role: 'Full-Stack Developer',
    type: 'freelance',
    startDate: '2024-10',
    endDate: 'Present',
    description:
      'Independently designed and developed Tesla Academy — an adaptive e-learning platform with course management, progress tracking, and AWS S3 media storage.',
    achievements: [
      'Built complete admin + student dashboards with role-based auth',
      'Integrated AWS S3 for scalable media storage',
      'Designed RESTful API with 20+ endpoints using FastAPI',
      'Deployed frontend on cloud with CI/CD pipeline',
    ],
    techStack: ['ReactJS', 'FastAPI', 'Python', 'MongoDB', 'TailwindCSS', 'AWS S3'],
    location: 'Remote',
    remote: true,
  },
  {
    id: '3',
    company: 'FitClub (Mentored Project)',
    role: 'Frontend Developer',
    type: 'contract',
    startDate: '2024-03',
    endDate: '2024-06',
    description:
      'Developed FitClub fitness management platform under mentorship of Yuvraj Kale (Senior Software Developer, CYBAGE).',
    achievements: [
      'Delivered full project in 3 months with 2-person team',
      'Integrated EmailJS for backend-free contact functionality',
      'Built separate admin and user dashboards',
    ],
    techStack: ['ReactJS', 'JavaScript', 'CSS', 'NodeJS', 'EmailJS'],
    location: 'Pune, India',
    remote: false,
  },
  {
    id: '4',
    company: 'Microsoft',
    role: 'Azure Fundamentals Certified (AZ-900)',
    type: 'contract',
    startDate: '2023-01',
    endDate: '2023-06',
    description:
      'Earned Microsoft Azure Fundamentals certification with a score of 940/1000, covering cloud concepts, core Azure services, and cloud computing principles.',
    achievements: [
      'Score: 940 / 1000',
      'Covered cloud computing principles, Azure VMs, storage, databases, and networking',
      'Hands-on with Azure portal and core infrastructure services',
    ],
    techStack: ['Microsoft Azure', 'Cloud Computing', 'Networking', 'Storage'],
    location: 'Remote',
    remote: true,
  },
]

export const metrics: Metric[] = [
  { label: 'Projects Built', value: 5, suffix: '+', description: 'Full-stack & systems projects', icon: '📦' },
  { label: 'CGPA', value: 813, suffix: '', prefix: '', description: 'B.E. Computer Engineering, SPPU', icon: '🎓' },
  { label: 'Azure Score', value: 940, suffix: '/1000', description: 'AZ-900 Certification', icon: '☁️' },
  { label: 'Tech Skills', value: 20, suffix: '+', description: 'Languages, frameworks & tools', icon: '🚀' },
]
