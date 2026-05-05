# OpenNext Cloudflare Migration Plan

This document is the working playbook for moving this app from `@cloudflare/next-on-pages` to the official OpenNext Cloudflare adapter while keeping the Cloudflare Free tier Worker bundle below 3 MiB after gzip compression.

## Goals

- Replace deprecated `@cloudflare/next-on-pages` with `@opennextjs/cloudflare`.
- Keep the app on Next.js 16 unless the adapter requires a patch update.
- Preserve every existing local route under `app/api/**`.
- Add an explicit proxy namespace without intercepting existing app APIs.
- Remove route-level Edge runtime declarations because the OpenNext Cloudflare adapter currently targets the Next.js Node.js runtime.
- Add repeatable local and CI checks for linting, build output, OpenNext output, and compressed Worker size.

## References

- OpenNext Cloudflare adapter: https://opennext.js.org/cloudflare
- Existing app migration guide: https://opennext.js.org/cloudflare/get-started
- OpenNext Cloudflare CLI: https://opennext.js.org/cloudflare/cli
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Pages Functions pricing: https://developers.cloudflare.com/pages/functions/pricing/

## Current Repo Findings

- The app is already on `next@16.2.0`, `react@19.2.4`, and `react-dom@19.2.4`.
- `@cloudflare/next-on-pages` was installed as a dev dependency and has been replaced with `@opennextjs/cloudflare` plus `wrangler`.
- The app owns many API routes under `app/api/**`, including auth, health, outreach, lead updates, email generation, and `app/api/webhooks/brevo/route.ts`.
- A blanket `/api/*` proxy would break existing app behavior, so proxying must be limited to a dedicated namespace.
- `middleware.ts` is small and dependency-free; it should stay that way because middleware is part of the Worker execution path.
- Next.js 16 prefers `proxy.ts`, but `proxy.ts` uses Node.js middleware/proxy today. OpenNext Cloudflare 1.19.6 does not support Node.js middleware yet, so this repo must temporarily keep `middleware.ts` until adapter support lands.
- `functions/_middleware.ts` currently injects CSP nonces into HTML with Cloudflare `HTMLRewriter`. Keep it isolated and verify it under OpenNext preview before moving it.
- Several app files exported `runtime = 'edge'`, and `add-edge.js` / `remove-edge.js` existed to toggle those declarations. OpenNext Cloudflare does not support source-level Edge runtime exports, so those declarations and scripts should be removed.
- Local Windows OpenNext builds can fail while creating symlinks for traced `node_modules`. If that happens, validate OpenNext builds in WSL, Linux, macOS, or GitHub Actions.

## Adapter Setup

- Use `@opennextjs/cloudflare` and `wrangler` as dev dependencies.
- Keep `build` as `next build`; OpenNext calls this script during `opennextjs-cloudflare build`.
- Add scripts:
  - `cf:build`: builds and adapts the app for Cloudflare.
  - `cf:preview`: runs the production build locally in the Cloudflare runtime.
  - `cf:deploy`: builds and deploys through the OpenNext CLI.
  - `cf:upload`: builds and uploads a version without serving it immediately.
  - `cf:typegen`: generates Cloudflare binding types when bindings are introduced.
  - `cf:size`: validates the gzip Worker budget.
- Add `open-next.config.ts` with minimal adapter config. Do not enable R2 incremental cache until the account has a real R2 bucket.
- Add `wrangler.worker.jsonc` with:
  - `main` set to `.open-next/worker.js`.
  - `assets.directory` set to `.open-next/assets`.
  - `nodejs_compat` and `global_fetch_strictly_public`.
  - A self-reference service binding named `WORKER_SELF_REFERENCE`.
- Do not keep this Workers config at root as `wrangler.jsonc` while using the Cloudflare Pages Git integration. Pages reads root Wrangler config as Pages config and expects `pages_build_output_dir`, while OpenNext needs Workers-only fields such as `main`, `assets`, and service bindings.
- Add `.dev.vars` with `NEXTJS_ENV=development` for local Cloudflare preview.
- Add `public/_headers` for long-lived static caching of `/_next/static/*`.
- Add `.open-next/` to `.gitignore`.

## Proxy Policy

- Proxy namespace: `/api/external/:path*`.
- Upstream env var: `PROXY_ORIGIN`.
- Do not forward all `/api/*`; existing Next route handlers remain authoritative.
- Preserve request method and body for proxied requests.
- Strip hop-by-hop headers before forwarding.
- Add `x-forwarded-host`, `x-forwarded-proto`, and `x-forwarded-for`.
- Do not forward cookies to the external origin by default. If a future upstream requires cookies, add an explicit allowlist instead of forwarding all cookies.
- Return a clear `500` when `PROXY_ORIGIN` is missing.
- Return a clear `502` when the upstream fetch fails.

## Runtime And Bundle Hygiene

- Remove every source-level `export const runtime = 'edge'`.
- Keep middleware/proxy code dependency-free.
- Do not import Supabase, Gemini, Resend, MDX, UI components, `framer-motion`, `recharts`, or `gray-matter` from middleware/proxy code.
- Avoid expensive top-level work in server files because Worker startup is limited.
- Keep large static assets and data outside the Worker bundle. Prefer static assets, R2, KV, D1, or external APIs when large data is needed.

## Cloudflare Free Tier Guardrails

- Workers Free tier allows 3 MiB compressed Worker size and 100,000 requests per day.
- The size gate uses gzip size and a 2.9 MiB budget to leave a small safety buffer.
- Static asset requests are free and unlimited when they do not invoke Functions/Workers.
- Every SSR request, middleware request, route handler request, and proxy request can count as a Workers request.
- Proxying high-volume traffic through the Worker can consume the daily Free tier request budget quickly.

## Step-By-Step Implementation

1. Install `@opennextjs/cloudflare` and `wrangler`; remove `@cloudflare/next-on-pages`.
2. Add OpenNext config, Wrangler config, `.dev.vars`, static asset headers, and package scripts.
3. Remove Edge runtime exports from app files.
4. Remove the Edge toggle helper scripts.
5. Keep `middleware.ts` as a temporary OpenNext-compatible Edge middleware, protect `/admin/:path*`, and proxy only `/api/external/:path*`.
6. Add the gzip Worker size check script.
7. Add CI coverage for lint, Next build, OpenNext build, and Worker size.
8. Run lint and build locally.
9. Run `npm run cf:build` and `npm run cf:size`.
10. Run `npm run cf:preview` for runtime verification before deploying.

## Acceptance Tests

- `npm run lint` passes.
- `npm run build` passes.
- `npm run cf:build` creates `.open-next/worker.js` and `.open-next/assets`.
- `npm run cf:size` passes under the gzip budget.
- On Windows, `npm run cf:build` may fail with `EPERM` during symlink creation. Treat that as an environment limitation if the same command passes on Linux CI.
- `/`, `/about`, `/blog`, `/services`, and `/contact` render in preview.
- `/admin/*` redirects unauthenticated requests to `/admin/login`.
- Existing local API routes still respond and are not proxied.
- `/api/webhooks/brevo` remains reachable as a local route.
- `/api/external/*` proxies to `PROXY_ORIGIN` when configured.
- HTML responses keep the CSP header; non-HTML assets and proxied responses are not rewritten.

## Rollback Plan

- Revert adapter config, scripts, and dependency changes together if OpenNext build cannot be stabilized.
- Keep runtime and proxy changes separate in review so route behavior can be isolated.
- If bundle size exceeds budget, first inspect middleware/proxy imports, then route-level server imports, then consider moving heavy functionality out of the Worker.
- Do not run broad dependency repair commands such as `npm audit fix --force` as part of this migration.

## Cloudflare Dashboard Setup

- Do not use the old Pages build command `npx @cloudflare/next-on-pages@1`. That command reinstalls the deprecated adapter and requires every dynamic route to export `runtime = 'edge'`.
- Preferred OpenNext deployment target: Cloudflare Workers with assets, using `npm run cf:deploy` or Workers Builds.
- If continuing to use the existing Cloudflare Pages Git project only as a static Pages project, do not expect it to run the OpenNext Worker unless the deployment flow explicitly uploads `.open-next/worker.js` as a Worker.
- Recommended dashboard action: create or switch to a Cloudflare Workers deployment for this branch/repo and set its build command to `npm run cf:deploy` or use `npm run cf:upload` for staged versions.
- Keep the old Pages project paused or pointed at a static-only fallback until the Worker deployment is verified.
- If Cloudflare logs show `Executing user command: npx @cloudflare/next-on-pages@1`, the build is still coming from the old Pages project settings. GitHub Actions changes do not affect that Pages runner.
- If Cloudflare logs show `Found wrangler.json file` during a Pages build, remove the root Pages-facing `wrangler.json` from the deployed commit or replace it with a real Pages config. The OpenNext Workers config in this repo is intentionally named `wrangler.worker.jsonc`.
- The GitHub Actions workflow should deploy with `wrangler deploy --config wrangler.worker.jsonc`, after `npm run cf:build` and `npm run cf:size` pass.
