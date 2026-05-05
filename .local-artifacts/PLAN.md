# OpenNext Cloudflare Migration Playbook

## Summary
Migrate this Next.js 16 app from deprecated `@cloudflare/next-on-pages` to `@opennextjs/cloudflare`, preserve existing local `app/api/**` route handlers, replace broad proxy assumptions with an explicit proxy namespace, remove Edge-runtime hacks, and enforce Cloudflare Free tier limits with a gzip bundle-size gate.

Target document to create during implementation: `docs/opennext-cloudflare-migration-plan.md`.

Sources to cite in the document:
- OpenNext Cloudflare adapter: https://opennext.js.org/cloudflare
- OpenNext existing app guide: https://opennext.js.org/cloudflare/get-started
- OpenNext CLI guide: https://opennext.js.org/cloudflare/cli
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Pages Functions pricing: https://developers.cloudflare.com/pages/functions/pricing/

## Current Repo Findings
- The app is already on `next@16.2.0`, `react@19.2.4`, and `react-dom@19.2.4`, so a major framework bump is not required unless the adapter version demands a newer patch.
- `@cloudflare/next-on-pages` is still present in `devDependencies` and should be removed after OpenNext is wired.
- `middleware.ts` currently protects `/admin/:path*` using `NextRequest`/`NextResponse`; it is small and can remain as Next middleware if OpenNext compatibility is confirmed.
- `functions/_middleware.ts` currently handles CSP nonce injection with `HTMLRewriter`; this is Cloudflare-specific and should be reviewed once OpenNext output structure is introduced.
- The repo has many local API route handlers under `app/api/**`, so proxying all `/api/*` would bypass real app behavior.
- Multiple route files explicitly export `runtime = 'edge'`, and `add-edge.js` / `remove-edge.js` exist to toggle this. OpenNext Cloudflare recommends the Node.js runtime, so these scripts should be retired.

## Implementation Steps
- Create the migration document first at `docs/opennext-cloudflare-migration-plan.md` with the findings, decisions, commands, rollback notes, and source links.
- Install migration dependencies: add `@opennextjs/cloudflare` and `wrangler`; remove `@cloudflare/next-on-pages` once builds work.
- Run `opennextjs-cloudflare migrate` as an inspection step only; review the generated recommendations before accepting changes.
- Add `open-next.config.ts` using the minimal adapter configuration needed for this app.
- Add `wrangler.jsonc` or `wrangler.toml` with the app name, compatibility date, `nodejs_compat`, assets binding/output settings, and environment variable placeholders.
- Update `package.json` scripts to include `cf:build`, `cf:preview`, `cf:deploy`, and `cf:size`; keep `build` as plain `next build`.
- Add `.open-next/` and OpenNext local output directories to `.gitignore`.
- Remove `export const runtime = 'edge'` from app routes unless a specific route proves it must stay Edge-compatible.
- Delete or deprecate `add-edge.js` and `remove-edge.js` so future work does not reintroduce Edge runtime globally.
- Keep `middleware.ts` focused on `/admin/:path*` auth only; do not import app libraries, Supabase, UI code, MDX helpers, or validation schemas into middleware.
- Replace the broad `/api/*` proxy proposal with a dedicated namespace such as `/proxy/:path*` or `/api/external/:path*`; preserve all existing `app/api/**` handlers.
- Implement proxy behavior with an explicit `PROXY_ORIGIN` env var, allowlisted path prefix, forwarded method/body, stripped hop-by-hop headers, and clear error responses when the origin is missing.
- Decide whether the proxy belongs in Next middleware, a route handler, or Cloudflare middleware after OpenNext preview confirms which path produces the smallest and clearest bundle.
- Keep CSP nonce injection only for HTML responses; verify whether the current `functions/_middleware.ts` remains valid under OpenNext or should move into the OpenNext worker customization point.
- Audit runtime imports for bundle size risk: avoid `framer-motion`, `recharts`, `gray-matter`, `next-mdx-remote`, Supabase client, and UI libraries in middleware/proxy/server bootstrap paths.
- Add a size script that checks the real compressed upload size from the Cloudflare/OpenNext build output; fail above 2.9 MiB to leave buffer under the 3 MiB Free tier limit.
- Prefer `opennextjs-cloudflare preview` for runtime testing; use raw `wrangler` commands only where OpenNext docs recommend them.
- Add CI workflow coverage for install, lint, Next build, OpenNext build, and size gate.

## Proxy Policy
- Do not proxy all `/api/*` in v1 because this repo already owns `/api/auth/*`, `/api/health`, `/api/generate-email`, `/api/outreach-leads`, `/api/webhooks/brevo`, and other local handlers.
- Default proxy path: `/api/external/:path*`.
- Required env var: `PROXY_ORIGIN`, with no trailing slash.
- Preserve request method and body.
- Forward safe headers; remove hop-by-hop headers like `connection`, `transfer-encoding`, `upgrade`, `keep-alive`, and `proxy-*`.
- Add `x-forwarded-host`, `x-forwarded-proto`, and `x-forwarded-for` when useful.
- Do not forward admin cookies to third-party upstreams unless explicitly required.
- Return `502` for upstream failures and `500` for missing server configuration; avoid leaking secret origin details in client responses.

## Cloudflare Free Tier Guardrails
- Enforce worker compressed size under 3 MiB; use 2.9 MiB as the project budget.
- Track raw and gzip sizes in CI output so regressions are visible.
- Remember Pages Functions/Workers requests count toward the Workers Free quota; proxying high-volume traffic through the worker can consume the daily 100k request allowance.
- Keep static assets static whenever possible so they do not invoke the worker.
- Avoid bundling large config/data/assets into server code; move large static data to public assets, KV, R2, D1, or external APIs if needed.
- Watch CPU time on Free tier because SSR, auth, AI calls, and proxy transforms can become expensive if they run on every request.

## Testing And Acceptance
- `npm run lint` passes before and after migration.
- `npm run build` passes with Next 16.
- `npm run cf:build` produces OpenNext Cloudflare output.
- `npm run cf:size` fails if gzip worker size exceeds the project budget.
- `npm run cf:preview` serves the site locally in the Cloudflare runtime.
- Public pages render: `/`, `/about`, `/blog`, `/services`, `/contact`.
- Admin auth still redirects unauthenticated users from `/admin/*` to `/admin/login`.
- Existing local API routes still work and are not swallowed by the proxy.
- Proxy namespace forwards requests to `PROXY_ORIGIN` and handles missing origin/upstream failure cleanly.
- CSP header appears on HTML responses and does not break scripts, preloads, styles, Turnstile, Google Analytics, or static assets.
- Webhook route `/api/webhooks/brevo` remains reachable and is not proxied.
- Health page and health API still validate Supabase, Brevo, Resend, and Gemini checks.

## Rollback Plan
- Keep the migration in one branch and avoid mixing unrelated refactors.
- Preserve the old `package-lock.json` state until the OpenNext preview passes.
- If OpenNext build fails, revert only adapter/config/script changes while keeping any separately useful documentation.
- If worker size exceeds budget, first remove accidental runtime imports, then split proxy behavior, then consider moving heavy server routes behind external services.
- If Cloudflare runtime behavior differs from `next dev`, trust `opennextjs-cloudflare preview` and adjust implementation there first.

## Assumptions
- Use official `@opennextjs/cloudflare`.
- Keep Next 16 unless adapter peer requirements force a patch update.
- Preserve all existing local `app/api/**` routes.
- Use `/api/external/:path*` as the proxy namespace unless the product decision changes.
- Keep admin protection in `middleware.ts` if OpenNext preview confirms it works and remains small.
- Enforce the 3 MiB Cloudflare Free tier worker limit using compressed gzip size, not raw file size.
