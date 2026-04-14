import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  coverImage: string
  ctaHeadline: string
  ctaBody: string
  ctaButton: string
  excerpt: string
  category: string
  readingTime: string
  metaDescription: string
  keywords: string[]
  content: string
}

const blogsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDirectory)) {
    return []
  }
  const fileNames = fs.readdirSync(blogsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => fileName.replace(/\.mdx$/, ''))
}

export function getBlogPost(slug: string): BlogPost | undefined {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      author: data.author || '',
      coverImage: data.coverImage || '',
      ctaHeadline: data.ctaHeadline || '',
      ctaBody: data.ctaBody || '',
      ctaButton: data.ctaButton || '',
      excerpt: data.excerpt || '',
      category: data.category || '',
      readingTime: data.readingTime || '',
      metaDescription: data.metaDescription || '',
      keywords: data.keywords || [],
      content,
    }
  } catch {
    return undefined
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getAllBlogSlugs()
  const posts = slugs
    .map(slug => getBlogPost(slug))
    .filter((post): post is BlogPost => post !== undefined)
    // Sort posts by date descending
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
