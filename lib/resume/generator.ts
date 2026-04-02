import Groq from 'groq-sdk'
import type { AnalysisResult } from './analyzer'

export interface GeneratedResume {
  name: string
  title: string
  contact: {
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  summary: string
  experience: {
    company: string
    role: string
    duration: string
    location: string
    bullets: string[]
  }[]
  education: {
    institution: string
    degree: string
    duration: string
    gpa?: string
    highlights?: string[]
  }[]
  skills: {
    category: string
    items: string[]
  }[]
  projects?: {
    name: string
    description: string
    tech: string[]
    bullets: string[]
    link?: string
  }[]
  certifications?: string[]
  achievements?: string[]
}

export interface ResumeInput {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
  targetRole: string
  summary?: string
  experience: string
  education: string
  skills: string
  projects?: string
  certifications?: string
  achievements?: string
}

function groqClient() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')
  return new Groq({ apiKey })
}

function parseJSON(raw: string): GeneratedResume {
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned) as GeneratedResume
}

export async function generateResumeFromInput(input: ResumeInput): Promise<GeneratedResume> {
  const prompt = `You are an expert resume writer. Create a professional ATS-optimized resume for a "${input.targetRole}" position.

CANDIDATE INFO:
Name: ${input.fullName}
Email: ${input.email}
Phone: ${input.phone}
Location: ${input.location}
${input.linkedin ? `LinkedIn: ${input.linkedin}` : ''}
${input.github ? `GitHub: ${input.github}` : ''}
${input.portfolio ? `Portfolio: ${input.portfolio}` : ''}

TARGET ROLE: ${input.targetRole}

EXPERIENCE:
${input.experience}

EDUCATION:
${input.education}

SKILLS:
${input.skills}

${input.projects ? `PROJECTS:\n${input.projects}` : ''}
${input.certifications ? `CERTIFICATIONS:\n${input.certifications}` : ''}
${input.achievements ? `ACHIEVEMENTS:\n${input.achievements}` : ''}
${input.summary ? `SUMMARY HINT:\n${input.summary}` : ''}

RULES:
1. Use strong action verbs (Built, Designed, Optimized, Led, Implemented, Reduced, Increased)
2. Add metrics wherever possible — infer reasonable ones from context
3. Write a punchy 2-3 sentence summary tailored to ${input.targetRole}
4. Use CAR format for bullets (Context, Action, Result)
5. Remove filler words (responsible for, worked on, helped with)
6. Never fabricate companies, roles, or dates
7. Categorize skills into: Languages, Frameworks, Tools & Platforms, Databases

Return ONLY valid JSON, no markdown, no explanation:
{
  "name": "${input.fullName}",
  "title": "<professional title for ${input.targetRole}>",
  "contact": {
    "email": "${input.email}",
    "phone": "${input.phone}",
    "location": "${input.location}",
    "linkedin": "${input.linkedin || ''}",
    "github": "${input.github || ''}",
    "portfolio": "${input.portfolio || ''}"
  },
  "summary": "<2-3 sentence punchy professional summary>",
  "experience": [
    {
      "company": "<company name>",
      "role": "<role title>",
      "duration": "<dates>",
      "location": "<location>",
      "bullets": ["<strong bullet with metric>"]
    }
  ],
  "education": [
    {
      "institution": "<institution>",
      "degree": "<degree>",
      "duration": "<dates>",
      "gpa": "",
      "highlights": []
    }
  ],
  "skills": [
    { "category": "Languages", "items": [] },
    { "category": "Frameworks", "items": [] },
    { "category": "Tools & Platforms", "items": [] },
    { "category": "Databases", "items": [] }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<one line>",
      "tech": ["<tech>"],
      "bullets": ["<achievement bullet>"],
      "link": ""
    }
  ],
  "certifications": [],
  "achievements": []
}`

  const completion = await groqClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 4000,
  })

  return parseJSON(completion.choices?.[0]?.message?.content ?? '')
}

export async function updateResumeWithChat(
  currentResume: GeneratedResume,
  userInstruction: string
): Promise<GeneratedResume> {
  const prompt = `You are an expert resume editor. The user has a generated resume and wants specific changes.

CURRENT RESUME (JSON):
${JSON.stringify(currentResume, null, 2)}

USER INSTRUCTION:
"${userInstruction}"

RULES:
- Apply ONLY what the user asked for — do not change anything else
- Keep all existing data intact unless explicitly asked to change it
- Maintain strong action verbs and metrics in any rewritten bullets
- If user asks to add something, add it in the most appropriate section
- If user asks to remove something, remove only that
- If user asks to improve/rewrite something, make it stronger with CAR format
- Never fabricate companies, roles, dates, or credentials

Return ONLY the complete updated resume as a valid JSON object with the exact same structure. No markdown, no explanation.`

  const completion = await groqClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.15,
    max_tokens: 4000,
  })

  return parseJSON(completion.choices?.[0]?.message?.content ?? '')
}

export async function generateEnhancedResume(
  originalText: string,
  analysis: AnalysisResult,
  additionalInfo: string,
  referenceText: string
): Promise<GeneratedResume> {
  const prompt = `You are an expert resume writer with 15+ years of experience crafting resumes that get interviews at top tech companies.

Your task: Rewrite and ENHANCE the following resume for a "${analysis.role}" position.

ORIGINAL RESUME:
---
${originalText.slice(0, 5000)}
---

AI ANALYSIS FINDINGS (use these to fix issues):
- ATS Score: ${analysis.atsScore}/100
- Key Issues: ${analysis.contentIssues.slice(0, 3).map(i => i.suggestion).join('; ')}
- Missing Skills to incorporate if mentioned anywhere: ${analysis.skillGap.missing.slice(0, 5).join(', ')}

${additionalInfo ? `ADDITIONAL INFO FROM CANDIDATE:\n---\n${additionalInfo}\n---` : ''}

${referenceText ? `REFERENCE DOCUMENT (use relevant context from this):\n---\n${referenceText.slice(0, 2000)}\n---` : ''}

ENHANCEMENT RULES:
1. Use strong action verbs (Built, Designed, Optimized, Led, Implemented, Reduced, Increased)
2. Add metrics wherever possible (%, numbers, scale) — infer reasonable ones from context
3. Fix all weak bullet points identified in the analysis
4. Make the summary punchy and role-specific (3 sentences max)
5. Keep ALL real experience — never fabricate companies, roles, or dates
6. Only add skills that are mentioned somewhere in the resume or additional info
7. Rewrite bullets using the CAR format (Context, Action, Result)
8. Remove filler words (responsible for, worked on, helped with)
9. Keep it to 1 page worth of content (concise)

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "name": "<full name from resume>",
  "title": "<professional title for ${analysis.role}>",
  "contact": {
    "email": "<from resume>",
    "phone": "<from resume>",
    "location": "<from resume>",
    "linkedin": "<if present>",
    "github": "<if present>",
    "portfolio": "<if present>"
  },
  "summary": "<3 sentence punchy professional summary tailored to ${analysis.role}>",
  "experience": [
    {
      "company": "<exact company name>",
      "role": "<exact role title>",
      "duration": "<exact dates>",
      "location": "<location>",
      "bullets": ["<rewritten strong bullet with metric>", "<rewritten strong bullet>"]
    }
  ],
  "education": [
    {
      "institution": "<exact institution>",
      "degree": "<exact degree>",
      "duration": "<dates>",
      "gpa": "<if present>",
      "highlights": ["<relevant coursework or achievement if present>"]
    }
  ],
  "skills": [
    { "category": "Languages", "items": ["<skill>"] },
    { "category": "Frameworks", "items": ["<skill>"] },
    { "category": "Tools & Platforms", "items": ["<skill>"] },
    { "category": "Databases", "items": ["<skill>"] }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<one line description>",
      "tech": ["<tech used>"],
      "bullets": ["<strong achievement bullet>"],
      "link": "<if present>"
    }
  ],
  "certifications": ["<if any>"],
  "achievements": ["<awards, publications, notable achievements if any>"]
}`

  const completion = await groqClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 4000,
  })

  return parseJSON(completion.choices?.[0]?.message?.content ?? '')
}
