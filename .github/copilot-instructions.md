## Copilot instructions

- Leanish is a SvelteKit client for Lemmy; `lemmy-js-client` is the API client. Routes for a particular Lemmy instance live under `src/routes/[site]`, whose matcher is defined in `src/params/site.ts`.
- The `[site]` server layout reads the instance-specific `${site}_jwt` cookie. Its universal layout creates a `LemmyHttp` client and provides it through Svelte context. Page loaders call `parent()` to reuse site and auth data; use `src/lib/utils/requests.ts` for Lemmy-compatible authentication and headers.
- `src/lib` groups reusable components, API-view rendering and utilities by feature. Barrel files expose shared exports through the `#lib` alias.
- `vite.config.ts` selects Node, static or IPFS output from `BUILD_ADAPTER` and `BUILD_IPFS`. `pnpm run build:csr` is used for static web and Capacitor builds; GitHub Pages sets `BUILD_BASE=/Leanish`.

## Commands

- Install and run locally: `pnpm install`, then `pnpm run dev`.
- Production builds: `BUILD_ADAPTER=node pnpm run build` for Node or `pnpm run build:csr` for static/client-rendered output.
- Full tests: `pnpm run test`; unit tests only: `pnpm run test:unit`.
- Run one unit test file or named test: `pnpm exec vitest run src/lib/utils/requests.test.ts` or `pnpm exec vitest run src/lib/utils/requests.test.ts -t "headers"`.
- Integration tests: `pnpm run test:integration`; run one file with `pnpm exec playwright test tests/index.test.ts`.
- Type/Svelte checks and lint: `pnpm run lint:fix`. `pnpm run lint` is reserved for CI.

## Conventions

- Type route loaders with generated SvelteKit types and use `satisfies` (see `src/routes/[site]/+layout.ts`).
- Authentication and home-site preferences are per Lemmy instance; JWTs are stored in instance-specific cookies and home-site data uses Capacitor Preferences.
- `pnpm run build:csr` temporarily removes `+*.server.*` route files and restores them with `git checkout`; avoid it while those files have uncommitted edits.
- For Svelte work, follow `.github/agents/svelte-file-editor.agent.md` and applicable skills under `.github/skills/`. Use Svelte MCP `list-sections` before fetching relevant docs with `get-documentation`, then validate edited components with `svelte-autofixer`.
