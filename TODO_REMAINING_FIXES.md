# Cloudflare Worker Deployment: Remaining Fixes

The core deployment to Cloudflare Workers is successful, but the following issues need to be addressed in the next session:

## 1. Google Reviews Missing
- **Symptoms:** The reviews section on the homepage/landing page is empty or hidden.
- **Likely Cause:** The reviews logic might be attempting to read `reviews.json` from the filesystem at runtime, or the data fetching script hasn't been integrated into the static build process.
- **Action:** Convert the reviews data into a static registry (similar to how we fixed the blogs).

## 2. Missing Blog Posts (6/8 Visible)
- **Symptoms:** Only 6 out of 8 MDX files in `content/blog` are appearing in the registry.
- **Likely Cause:** File extension mismatch (e.g., `.md` vs `.mdx`) or a parsing error in `scripts/build-blog-data.mjs` that silently skips certain files.
- **Action:** Audit the `content/blog` folder and improve the logging in the build script to see which files are failing.

## 3. Admin Login "Internal Server Error"
- **Symptoms:** After entering the "secret" code on the admin login page, the top-left displays an Internal Server Error.
- **Likely Cause:** Missing **Cloudflare Secrets** for the `adwalididi-website-preview` Worker. Specifically, environment variables like `GEMINI_API_KEY`, `RESEND_API_KEY`, and Supabase credentials need to be manually added.
- **Action:** Sync local `.env.local` secrets to Cloudflare using `npx wrangler secret put`.

## 4. Production Cutover Plan
- **Goal:** Once the preview is 100% verified, merge `experimental` into `main` and switch the primary domain to the Worker.
