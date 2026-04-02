import Groq from 'groq-sdk'

export interface AnalysisResult {
  atsScore: number
  scoreBreakdown: {
    formatting: number
    keywords: number
    experience: number
    education: number
    skills: number
  }
  summary: string
  overallVerdict: 'Strong' | 'Good' | 'Needs Work' | 'Weak'
  skillGap: {
    present: string[]
    missing: string[]
    recommended: string[]
  }
  contentIssues: {
    type: 'weak-bullet' | 'no-metrics' | 'repetition' | 'too-long' | 'missing-section' | 'passive-voice' | 'vague-language'
    severity: 'high' | 'medium' | 'low'
    text: string
    suggestion: string
  }[]
  rewrites: {
    original: string
    improved: string
    reason: string
    impact: string
  }[]
  strengths: string[]
  quickWins: string[]
  role: string
}

const ROLE_SKILLS: Record<string, string[]> = {
  'Backend Developer': [
    'Node.js', 'Python', 'Java', '.NET', 'C#', 'REST APIs', 'GraphQL', 'PostgreSQL',
    'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'CI/CD',
    'Microservices', 'System Design', 'Data Structures', 'Algorithms', 'Unit Testing',
    'Message Queues', 'Kafka', 'RabbitMQ', 'gRPC', 'OAuth', 'JWT',
  ],
  'Full Stack Developer': [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs',
    'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'CI/CD', 'Git', 'Tailwind CSS',
    'GraphQL', 'Redux', 'Testing', 'System Design', 'Agile', 'HTML', 'CSS',
    'Webpack', 'Vite', 'Authentication', 'Deployment',
  ],
  'SDE': [
    'Data Structures', 'Algorithms', 'System Design', 'OOP', 'Design Patterns',
    'Git', 'SQL', 'Problem Solving', 'Java', 'Python', 'C++', 'Unit Testing',
    'Code Review', 'Agile', 'CI/CD', 'Cloud', 'Microservices', 'Debugging',
    'Performance Optimization', 'Scalability', 'Low Level Design',
  ],
}

export async function analyzeResume(resumeText: string, role: string): Promise<AnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')

  const roleSkills = ROLE_SKILLS[role] ?? ROLE_SKILLS['SDE']

  const prompt = `You are a world-class ATS resume expert, senior hiring manager, and career coach with 15+ years of experience reviewing thousands of resumes at top tech companies like Google, Microsoft, Amazon, and startups.

Perform a DEEP, SPECIFIC, and ACTIONABLE analysis of this resume for a "${role}" position.

RESUME TEXT:
---
${resumeText.slice(0, 7000)}
---

REQUIRED SKILLS FOR ${role.toUpperCase()}:
${roleSkills.join(', ')}

ANALYSIS INSTRUCTIONS:
1. ATS Score: Score 0-100 based on keyword density, formatting, section structure, quantified achievements, and role alignment. Be honest — most resumes score 40-70.
2. Score Breakdown: Score each dimension independently and critically.
3. Content Issues: Find REAL issues from the actual resume text. Quote exact phrases. Be specific.
4. Rewrites: Take ACTUAL weak sentences from the resume and rewrite them with strong action verbs, metrics, and impact. Don't make up content.
5. Skill Gap: Only list skills that are genuinely present/missing based on the resume text.
6. Quick Wins: Give 3-5 specific, immediately actionable improvements the person can make TODAY.
7. Overall Verdict: Be honest — Strong (80+), Good (60-79), Needs Work (40-59), Weak (<40).

Return ONLY a valid JSON object (no markdown, no explanation, no code fences):
{
  "atsScore": <number 0-100>,
  "scoreBreakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>
  },
  "summary": "<3-4 sentence honest assessment covering strengths, weaknesses, and fit for the role>",
  "overallVerdict": "<Strong|Good|Needs Work|Weak>",
  "skillGap": {
    "present": ["<skills actually found in resume — be accurate>"],
    "missing": ["<required skills genuinely not found>"],
    "recommended": ["<high-value skills to add for this role>"]
  },
  "contentIssues": [
    {
      "type": "<weak-bullet|no-metrics|repetition|too-long|missing-section|passive-voice|vague-language>",
      "severity": "<high|medium|low>",
      "text": "<exact quote from resume that has the issue>",
      "suggestion": "<specific actionable fix with example if possible>"
    }
  ],
  "rewrites": [
    {
      "original": "<exact weak sentence from resume>",
      "improved": "<rewritten with strong action verb + metric + impact>",
      "reason": "<why the original is weak>",
      "impact": "<what this change achieves for the reader>"
    }
  ],
  "strengths": ["<specific strength with evidence from resume>"],
  "quickWins": ["<specific, actionable improvement doable in under 1 hour>"]
}

Rules:
- contentIssues: find 3-6 real issues, ordered by severity (high first)
- rewrites: provide 3-4 rewrites of ACTUAL resume content only
- strengths: 3-5 items with specific evidence
- quickWins: 3-5 items, each starting with an action verb
- Never be generic — every point must reference the actual resume content
- If resume is strong, say so honestly — don't invent problems`

  const groq = new Groq({ apiKey })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 3000,
  })

  const content = completion.choices?.[0]?.message?.content ?? ''
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const result = JSON.parse(cleaned) as AnalysisResult
  result.role = role
  return result
}
