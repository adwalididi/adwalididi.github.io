import { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/lib/blog-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adwalididi.com/'

  // Define the core pages of the website
  const coreRoutes = [
    '',
    'services/',
    'portfolio/',
    'about/',
    'contact/',
    'blog/',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Define blog post routes
  const blogRoutes = getAllBlogSlugs().map((slug) => ({
    url: `${baseUrl}blog/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...coreRoutes, ...blogRoutes]
}
