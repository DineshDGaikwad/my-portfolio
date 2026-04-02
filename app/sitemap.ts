import type { MetadataRoute } from 'next'

const BASE_URL = 'https://dineshgaikwad.vercel.app'

// Add real page routes here as they are created (e.g. /about, /projects, /contact)
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',        priority: 1,   changeFrequency: 'monthly' },
  { path: '/resume', priority: 0.7, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
