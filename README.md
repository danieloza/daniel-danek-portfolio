# Daniel Danek Portfolio

Minimal static portfolio inspired by the Magic UI portfolio layout. A narrow reading column, light/dark themes, six featured projects with an expandable list of more, and a floating navigation dock. Implemented with HTML, CSS, and small vanilla JavaScript modules; no Next.js runtime is needed.

The website has no work-history section. Employment is described only in tailored CVs, which are shared separately. Independent portfolio and R&D projects have their own section. No confidential client names, internal code, or private infrastructure identifiers are published.

There is no public CV download. Recruitment CVs are tailored and shared separately, not bundled with this website.

## Run locally

Serve over HTTP so that the local SVG icon sprite and clipboard behavior work consistently:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:8766`. The development server binds only to the local computer.

## Validate and build

```sh
npm run assets
npx playwright install chromium
npm run check
```

`npm run assets` assembles the official Tabler icons and self-hosted Geist font, with licenses. The committed public assets allow `npm run build` to stage the website without installing packages. `npm test` checks desktop/mobile layouts, local image loading, the absence of a work-history section, keyboard disclosure controls, theme persistence, absence of a public CV, anchors, clipboard feedback, reduced-motion behavior, and content without JavaScript.

`dist/` contains only the public site and asset credits. Development dependencies, test output, and repository metadata are not deployed.

With the local server running, `npm run audit` writes Lighthouse HTML/JSON reports to `artifacts/`. The validation workflow runs the build and browser tests for pushes and pull requests.

## Content editing

- Profile, education, project descriptions, and contact links: `index.html`.
- Visual tokens, spacing, responsive rules, and animation: `assets/css/styles.css`.
- Theme and copy-email behavior: `assets/js/`.
- Project images and the GitHub avatar: `assets/images/`.

All site assets are served locally; the page makes no third-party requests until a visitor follows an external link.

## Positioning

The site is optimized to present a backend-first profile focused on:

- FastAPI services
- AI governance platforms
- AI runtime control planes
- private, self-hostable AI workspaces with bring-your-own providers
- RAG and agentic AI workflow systems
- secure tool access and MCP governance
- auditability and replay workflows
- observability dashboards and quality gates
- operator-facing internal tools
- practical backend systems around AI
- a company-neutral page: work history stays in the CV

Current project hierarchy starts with Regulated AI Agent Platform and AGIP as the two governance flagships. MeshKeep follows as the strongest end-to-end product, ahead of the narrower gateways, control planes, RAG services, observability, and business workflow tools.

## Deploy

The existing `.github/workflows/deploy-pages.yml` stages `dist/` and publishes it through GitHub Pages after a push to `main` or a manual workflow run. The rebuild has not been pushed or published by the assistant. The same static output can be hosted on Netlify, Vercel, or Cloudflare Pages.

See `THIRD_PARTY_NOTICES.md` for design inspiration and font/icon licenses.
