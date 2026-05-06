import fs from 'fs';
import path from 'path';

async function fetchReviews() {
  // If running locally, we might have loaded .env via Node's --env-file flag
  // or the keys are provided by GitHub Actions secrets.
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID environment variables.');
    process.exit(1);
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  
  console.log(`Fetching reviews for Place ID: ${placeId}...`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Places API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.reviews || !Array.isArray(data.reviews)) {
      console.warn('⚠️ No reviews found or unexpected response format.');
      process.exit(1);
    }

    // Sanitize and map the reviews
    const sanitizedReviews = data.reviews.map((review) => {
      // Strip excessive whitespace and unwanted HTML-like tags if any
      const rawText = review.text?.text || '';
      const cleanText = rawText.replace(/\s+/g, ' ').trim();

      return {
        author: review.authorAttribution?.displayName || 'Anonymous',
        photoUri: review.authorAttribution?.photoUri || null,
        rating: review.rating,
        text: cleanText,
        relativeTime: review.relativePublishTimeDescription || '',
        publishTime: review.publishTime || null,
      };
    });

    // We only keep the fields we care about
    const finalData = {
      placeRating: data.rating || 0,
      totalReviews: data.userRatingCount || 0,
      lastFetchedAt: new Date().toISOString(),
      reviews: sanitizedReviews,
    };

    // Ensure data directory exists
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to data/reviews.json
    const filePath = path.join(dataDir, 'reviews.json');
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf-8');

    console.log(`✅ Successfully fetched and saved ${sanitizedReviews.length} reviews to ${filePath}`);
    
  } catch (error) {
    console.error('❌ Failed to fetch reviews:', error);
    process.exit(1);
  }
}

fetchReviews();
