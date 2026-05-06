import { REVIEWS_DATA, type Review } from './reviews-registry';

export type { Review };

export function getReviewsData() {
  return REVIEWS_DATA;
}

export function getAllReviews(): Review[] {
  return [...REVIEWS_DATA.reviews];
}
