import { NextResponse } from 'next/server'
import https from 'https'

export const dynamic = 'force-dynamic'

const ALLOWED_HOST = 'api.github.com'

function httpsGet(url: string, headers: Record<string, string>): Promise<any> {
  const parsed = new URL(url)
  if (parsed.hostname !== ALLOWED_HOST) throw new Error('Disallowed host')
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { reject(new Error('JSON parse failed')) }
      })
    }).on('error', reject)
  })
}

export async function GET() {
  try {
    const username = 'DineshDGaikwad'
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'portfolio-app',
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    }

    const [user, repos] = await Promise.all([
      httpsGet(`https://api.github.com/users/${username}`, headers),
      httpsGet(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, headers),
    ])

    const repoList = Array.isArray(repos) ? repos : []
    const totalStars = repoList.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0)

    const topRepos = repoList
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
      }))

    return NextResponse.json({
      totalRepos: user.public_repos ?? 0,
      totalStars,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      topRepos,
    })
  } catch (err) {
    console.error('GitHub route error:', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
