import fs from 'node:fs';
import path from 'node:path';

const reviewsFile = path.join(process.cwd(), 'data/reviews.json');
const outputFile = path.join(process.cwd(), 'lib/reviews-registry.ts');

function generateRegistry() {
  if (!fs.existsSync(reviewsFile)) {
    console.warn('Reviews file not found:', reviewsFile);
    // Create an empty registry if file doesn't exist to avoid build errors
    const emptyRegistry = `// This file is auto-generated during build. Do not edit manually.
export const REVIEWS_DATA = {
  placeRating: 0,
  totalReviews: 0,
  lastFetchedAt: "",
  reviews: []
} as const;

export type Review = typeof REVIEWS_DATA.reviews[number];
`;
    fs.writeFileSync(outputFile, emptyRegistry);
    return;
  }

  const reviewsData = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));

  const registryContent = `// This file is auto-generated during build. Do not edit manually.
export const REVIEWS_DATA = ${JSON.stringify(reviewsData, null, 2)} as const;

export type Review = typeof REVIEWS_DATA.reviews[number];
`;

  fs.writeFileSync(outputFile, registryContent);
  console.log(`Generated reviews registry from ${reviewsData.reviews.length} reviews.`);
}

generateRegistry();
