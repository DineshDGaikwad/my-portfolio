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
  skillGap: {
    present: string[]
    missing: string[]
    recommended: string[]
  }
  contentIssues: {
    type: 'weak-bullet' | 'no-metrics' | 'repetition' | 'too-long' | 'missing-section'
    text: string
    suggestion: string
  }[]
  rewrites: {
    original: string
    improved: string
    reason: string
  }[]
  strengths: string[]
  role: string
}

const ROLE_SKILLS: Record<string, string[]> = {
  'Backend Developer': [
    'Node.js', 'Python', 'Java', '.NET', 'REST APIs', 'GraphQL', 'PostgreSQL',
    'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'CI/CD',
    'Microservices', 'System Design', 'Data Structures', 'Algorithms',
  ],
  'Full Stack Developer': [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL',
    'MongoDB', 'Docker', 'AWS', 'CI/CD', 'Git', 'Tailwind CSS', 'GraphQL',
    'Redux', 'Testing', 'System Design', 'Agile',
  ],
  'SDE': [
    'Data Structures', 'Algorithms', 'System Design', 'OOP', 'Design Patterns',
    'Git', 'SQL', 'Problem Solving', 'Java', 'Python', 'C++', 'Testing',
    'Code Review', 'Agile', 'CI/CD', 'Cloud', 'Microservices',
  ],
}

export async function analyzeResume(resumeText: string, role: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured')

  const roleSkills = ROLE_SKILLS[role] ?? ROLE_SKILLS['SDE']

  const prompt = `You are an expert ATS resume analyzer and career coach. Analyze the following resume for a "${role}" position.

RESUME TEXT:
---
${resumeText.slice(0, 6000)}
---

REQUIRED SKILLS FOR ${role.toUpperCase()}:
${roleSkills.join(', ')}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "atsScore": <number 0-100>,
  "scoreBreakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>
  },
  "summary": "<2-3 sentence overall assessment>",
  "skillGap": {
    "present": ["<skills found in resume>"],
    "missing": ["<required skills not found>"],
    "recommended": ["<additional skills to add>"]
  },
  "contentIssues": [
    {
      "type": "weak-bullet|no-metrics|repetition|too-long|missing-section",
      "text": "<problematic text from resume>",
      "suggestion": "<how to fix it>"
    }
  ],
  "rewrites": [
    {
      "original": "<original weak statement>",
      "improved": "<stronger rewritten version with metrics and impact>",
      "reason": "<why this is better>"
    }
  ],
  "strengths": ["<what the resume does well>"]
}

Rules:
- atsScore must reflect real ATS compatibility
- Find at least 3 contentIssues if they exist
- Provide at least 2 rewrites of actual resume content
- Be specific, not generic
- strengths should have 3-5 items`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI error: ${err}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const result = JSON.parse(cleaned) as AnalysisResult
  result.role = role
  return result
}
