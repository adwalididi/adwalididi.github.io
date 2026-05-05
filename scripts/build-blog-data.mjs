import fs from 'node:fs';
import path from 'node:path';

const blogsDirectory = path.join(process.cwd(), 'content/blog');
const outputFile = path.join(process.cwd(), 'lib/blog-registry.ts');

function parseFrontmatter(fileContents) {
  if (!fileContents.startsWith('---')) {
    return { data: {}, content: fileContents };
  }

  const endIndex = fileContents.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { data: {}, content: fileContents };
  }

  const frontmatter = fileContents.slice(3, endIndex).trim();
  const content = fileContents.slice(endIndex + 4).trimStart();
  const data = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    const rawValue = match[2].trim();

    if (rawValue === '') {
      const values = [];
      while (index + 1 < lines.length && lines[index + 1].trimStart().startsWith('- ')) {
        index += 1;
        values.push(unquoteValue(lines[index].trimStart().slice(2).trim()));
      }
      data[key] = values;
      continue;
    }

    data[key] = unquoteValue(rawValue);
  }

  return { data, content };
}

function unquoteValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function getStringValue(data, key) {
  const value = data[key];
  return typeof value === 'string' ? value : '';
}

function getStringArrayValue(data, key) {
  const value = data[key];
  return Array.isArray(value) ? value : [];
}

function generateRegistry() {
  if (!fs.existsSync(blogsDirectory)) {
    console.warn('Blog directory not found:', blogsDirectory);
    return;
  }

  const fileNames = fs.readdirSync(blogsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = parseFrontmatter(fileContents);

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
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const registryContent = `// This file is auto-generated during build. Do not edit manually.
export const BLOG_POSTS = ${JSON.stringify(posts, null, 2)} as const;

export type BlogPost = typeof BLOG_POSTS[number];
`;

  fs.writeFileSync(outputFile, registryContent);
  console.log(`Generated blog registry with ${posts.length} posts.`);
}

generateRegistry();
