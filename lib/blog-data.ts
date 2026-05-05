import fs from 'fs'
import path from 'path'

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
    const { data, content } = parseFrontmatter(fileContents)

    return {
      slug,
      title: getStringValue(data, 'title'),
      date: getStringValue(data, 'date'),
      author: getStringValue(data, 'author'),
      coverImage: getStringValue(data, 'coverImage'),
      ctaHeadline: getStringValue(data, 'ctaHeadline'),
      ctaBody: getStringValue(data, 'ctaBody'),
      ctaButton: getStringValue(data, 'ctaButton'),
      excerpt: getStringValue(data, 'excerpt'),
      category: getStringValue(data, 'category'),
      readingTime: getStringValue(data, 'readingTime'),
      metaDescription: getStringValue(data, 'metaDescription'),
      keywords: getStringArrayValue(data, 'keywords'),
      content,
    }
  } catch {
    return undefined
  }
}

function getStringValue(data: Record<string, string | string[]>, key: string): string {
  const value = data[key]
  return typeof value === 'string' ? value : ''
}

function getStringArrayValue(data: Record<string, string | string[]>, key: string): string[] {
  const value = data[key]
  return Array.isArray(value) ? value : []
}

function parseFrontmatter(fileContents: string): { data: Record<string, string | string[]>; content: string } {
  if (!fileContents.startsWith('---')) {
    return { data: {}, content: fileContents }
  }

  const endIndex = fileContents.indexOf('\n---', 3)
  if (endIndex === -1) {
    return { data: {}, content: fileContents }
  }

  const frontmatter = fileContents.slice(3, endIndex).trim()
  const content = fileContents.slice(endIndex + 4).trimStart()
  const data: Record<string, string | string[]> = {}
  const lines = frontmatter.split(/\r?\n/)

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue

    const key = match[1]
    const rawValue = match[2].trim()

    if (rawValue === '') {
      const values: string[] = []
      while (index + 1 < lines.length && lines[index + 1].trimStart().startsWith('- ')) {
        index += 1
        values.push(unquoteValue(lines[index].trimStart().slice(2).trim()))
      }
      data[key] = values
      continue
    }

    data[key] = unquoteValue(rawValue)
  }

  return { data, content }
}

function unquoteValue(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
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
