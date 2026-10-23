# Verification — 2026-10-23

Chronological acceptance for the standalone `wlkr/ui` checkout. Initial local checks preceded the public release recorded below.

## Initial registry and consumer acceptance

- Registry schema validation passed with four items: three original components and the optional theme.
- `pnpm registry:build` passed and produced four static item endpoints under `/r/`, plus the registry catalog.
- A clean Vite React consumer installed all three originals and the theme through the `@wlkr` namespace, mapped to a local Python static server on port 3101. Stock dependencies came directly from shadcn.
- The consumer was refreshed with the final generated sources. Its `App.tsx` mounted all three originals, and its production build passed.
- Browser rendering showed all three installed components in the consumer. Filtering returned one matching result. Consumer async-action interaction was not separately confirmed because the final browser click dispatch was unreliable; async behavior was verified in the showcase.

## Showcase browser acceptance

- Search, clipboard copy, keyboard-operated preview tabs, source disclosure, filter-list empty state, async failure and retry, and dark/light theme controls passed.
- Desktop at 1320 px and mobile at 390 px rendered without horizontal overflow.
- Keyboard focus had a computed 2 px outline after the explicit focus styling fix.
- Browser console errors: none.
- Local screenshots: `output/playwright/desktop-light.png` and `output/playwright/mobile-light.png`. These are intentionally ignored by Git.

## Final checks and scope

Production build, lint, TypeScript check, and `git diff --check` passed after the focus fix. The existing Astro website remained Git-clean and unchanged. No DNS, hosting, external repository, or website migration occurred.

## Interaction refinements

The refined collection has five registry entries: four original components plus the theme. Copy feedback now occupies one stable icon slot; async feedback shares one reserved control slot with pixel-mask pending text. Filter inputs use native block-caret progressive enhancement and a short focus marker. The new `pixel-object` accepts a point cloud or mask, with a rotating sphere demo and pause/off-screen/reduced-motion controls.

Production build, five-item registry build, lint, and TypeScript checks passed for this refinement. Updated clean-consumer installation and browser interaction acceptance are recorded separately once completed. The initial acceptance above remains a record of the earlier three-component version.

### Refinement browser and consumer acceptance — 2026-10-23

- Clean namespace installation passed for all four originals plus the theme. The consumer fixture mounted all four installed components and its production build passed.
- Copy command section height was identical before and after copying: 552.984375 px.
- Async section height stayed 552.984375 px across idle, pending, success, and failure; the button width stayed 162.3828125 px. Pending text used `wlkr-action-reconstruct`. Success icon color was `rgb(8, 125, 61)`; failure icon color was `rgb(180, 35, 24)`. Failure showed only “Try again” in the existing control. The detailed status remained absolutely positioned and hidden from visual layout.
- Input computed styles confirmed native `caret-shape: block`, no outline, and no box shadow. Searching for “weather” returned one result.
- PixelObject rendered 350 SVG rectangles while running on desktop. User pause changed `data-motion` to `paused`. Reduced motion paused the object and disabled pending-text animation. Moving the object off-screen by navigating to installation also paused it.
- At 390 px mobile width, document scroll width remained 390 px. Local captures: `output/playwright/pixel-object-mobile.png` and `output/playwright/async-inline-failure.png`.
- Browser console errors and warnings: none.

No public deployment, DNS change, or existing website modification was performed.

## Public release — 2026-10-23

Published source revision: `8f87ab3313e943653dfd113d3912160d830cd0f4`. Separate Cloudflare Worker `wlkr-ui`, version `3b5c8346-a7d5-4894-90f3-ae396520dc01`, serves `https://ui.wlkrlabs.com` at 100%. The public build receipt reported the exact source revision.

Immutable release identity: Cloudflare deployment `14b2cdfb-b58c-466d-a01d-c232ae5efdec`, created `2026-10-23T15:26:39.475628Z` (10:26:39 a.m. America/Chicago). The Cloudflare API confirmed the custom domain belongs to service `wlkr-ui`, is enabled, and has a certificate assigned. The main website’s deployment `50111ab6-fa2d-4295-883a-db215a29550c` and its domain/service mapping remained unchanged.

- Public HTTPS passed for both registry catalogs and all five item endpoints: seven valid JSON responses, HTTP 200, with bytes and SHA-256 hashes matching the exported release and revalidation headers. A missing registry item returned 404.
- The apex website’s build-info bytes stayed unchanged. Its separate Worker, routes, and source were not migrated or modified.
- Public browser acceptance passed for copy and async geometry across success/failure, filter matching (one result), PixelObject pause and reduced motion, and mobile width 390 px without overflow. Browser console errors: none. Local screenshots: `output/playwright/live-desktop.png`, `output/playwright/live-pixel-object.png`, and `output/playwright/live-mobile.png`.
- At verification time the Mac’s normal resolver still retained an earlier negative lookup; authoritative DNS and Cloudflare’s 1.1.1.1 resolver returned positive records. Public acceptance ran from an isolated existing Playwright image container using DNS 1.1.1.1 and ordinary public HTTPS, with no hostname mappings or mocked responses.
- In a fresh Vite/React/Radix consumer inside that disposable container, the standard shadcn CLI listed all five `@wlkr` entries and installed all four original components plus the theme from the public namespace. Stock dependencies came from upstream. The fixture mounted all four originals and passed TypeScript and Vite production build checks. Bundled Chromium rendered the installed copy control, async action, filter list, and pixel object. Searching “weather” returned one result; the async action reached “Changes saved”; PixelObject reported `data-motion="running"`. Browser page errors: none. Screenshot: `output/playwright/public-installed-consumer.png`. The owned disposable container was scheduled for removal after the screenshot was saved.

Public configuration remains restricted to `ui.wlkrlabs.com`; `workers.dev` and preview URLs are disabled. The source receipt is generated in the exported output rather than committed into public source. This documentation update does not change the deployed application revision.

## Motion playground expansion — historical local review, 2026-10-23

The local draft expands PixelObject with physical dot size/gap, shape, independent rotation/flicker timing, four seeded smooth patterns, delay/stagger, opacity, and presets with a copyable live Usage example. It adds WlkrLoader as a fifth original, retaining the exact six-cell brand geometry with bars/dots beat variants. The local registry contains six items including the theme.

The source registry validation passed for all six items. Production static export, registry build, lint, TypeScript, and diff checks passed. Native shadcn control files were installed with the CLI and remain unchanged; they are not WLKR registry items. The release guard now derives required item paths from the catalog. The stock shadcn CLI installed the updated PixelObject and new WlkrLoader into `/tmp/wlkr-ui-consumer-acceptance`. The consumer passed TypeScript and Vite production build checks. Browser acceptance rendered both loader variants, confirmed that the extreme `size={64}`, `dotSize={40}`, `gap={40}` case produces one 40 px rectangle at x/y 12, and confirmed identical seeded static objects match.

Local static-browser acceptance passed presets, custom controls, matching Usage examples, Reset, pause, and reduced motion. With Customize open, all four preset section heights were identical at 1551.68 px. The 390 px mobile layout had no horizontal overflow, sliders had 44 px touch targets, and a fresh browser run had no console warnings or errors. Local screenshots: `output/playwright/local-pixel-customizer.png`, `output/playwright/local-wlkr-loader.png`, and `output/playwright/local-motion-mobile.png`.

At this historical review stage, no deployment or other public mutation had been authorized or performed for the expansion. The public release then remained source `8f87ab3313e943653dfd113d3912160d830cd0f4`, deployment `14b2cdfb-b58c-466d-a01d-c232ae5efdec`. The subsequent authorized release is recorded below.

## Public motion release — 2026-10-23

Published source revision: `6c34da775eb20b62b4352a360586d100b62399df`. Cloudflare deployment `1c3eee64-3e17-4f1b-92f3-8a3145b7a7a4`, created `2026-10-23T16:27:22.596983Z` (11:27:22 a.m. America/Chicago), serves `wlkr-ui` version `600ac8d3-8fe7-4d69-b529-4f88cc9b8168` at 100%. The release includes five original components and the theme, with the expanded PixelObject and WLKR loader now public.

- Public build-info reported the exact source revision. All eight JSON endpoints (both catalogs and six items) returned HTTP 200 with bytes and SHA-256 hashes matching the exported release receipt. A missing registry item returned 404.
- Normal Mac DNS resolution and public HTTPS worked for this verification; no hostname overrides, localhost registry URLs, or mocked responses were used for public installation. The earlier negative DNS cache issue is no longer present at this check.
- The apex website’s build-info bytes stayed unchanged. This release updated only the separate `ui.wlkrlabs.com` service.
- Live gallery browser acceptance selected Disco (`data-pattern="scatter"`) and the Dots loader variant (six cells, running), with no console warnings or errors. Screenshot: `output/playwright/public-wlkr-loader-release.png`.
- A fresh consumer was scaffolded at `/tmp/wlkr-ui-release-consumer-20261023` using `pnpm dlx shadcn@latest init --template vite --base radix --preset nova --no-monorepo --name wlkr-ui-release-consumer-20261023 -y`. The WLKR source directory was confirmed absent before installing. Its `@wlkr` namespace used `https://ui.wlkrlabs.com/r/{name}.json`.
- The normal command `pnpm dlx shadcn@latest add @wlkr/pixel-object @wlkr/wlkr-loader -y` installed both originals directly from the public registry, reusing the identical stock shadcn button. The fixture mounted a customized PixelObject and both loader variants. `pnpm build` passed TypeScript and Vite production build checks.
- Browser acceptance of that installed consumer confirmed the customized pixel object using the Wave pattern and running, with Bars and Dots loaders each rendering six running cells. Console warnings and errors: none. Screenshot: `output/playwright/public-motion-installed-consumer.png`. The owned production preview on port 3102 was stopped gracefully after acceptance.

These documentation updates record the immutable published application revision; they do not require another application deployment.

## Page composition additions — local draft, 2026-10-23

Local-only additions: typography/layout styles matching the existing gallery; PageIntro with final SSR text and a width-stable binary overlay; IndexRow with fixed three-digit hover/focus rolling; TextLink composing the unchanged stock Radix HoverCard; and ThemeToggle composing the unchanged basic shadcn Toggle. PixelObject additionally supports continuous same-point sphere/cube/torus morphing with the existing pause/off-screen/hidden/reduced-motion guards. Existing default behavior remains unchanged.

The local catalog contains nine original components, typography styles, and the theme (11 entries). Registry build and source validation passed for all 11; static production build, lint, TypeScript, and diff checks passed. Source, live previews, Usage examples, and search are present in the local gallery. The existing Wrangler preview serves the exported local site at port 3100. Stock HoverCard and Toggle were installed through the official CLI and remain unchanged; no stock source was republished.

These additions and the parallel website adoption are for local review. No publication or deployment was performed for this draft. Public release `6c34da775eb20b62b4352a360586d100b62399df` remains unchanged. Browser, consumer, and website integration acceptance are recorded separately once completed.

### Local page-composition acceptance — 2026-10-23

- Gallery browser acceptance passed synchronized header/demo theme toggles in light and dark, keyboard focus opening the TextLink preview, component search filtering to PageIntro and clearing back to the collection, and valid import/Usage examples. Wave plus the opt-in morph switch reported `data-morph="continuous"`; generated Usage included sphere/cube/torus and duration 8. Browser console errors and warnings: none.
- The gallery PageIntro specimen uses h2, leaving the main editorial hero as the only primary h1; distributed PageIntro source and consumers were unchanged by that gallery fix.
- The parallel Astro website integration passed its full npm verify command and a dependency audit with zero vulnerabilities. Parent browser acceptance passed at desktop width 1280, mobile widths 390 and 320, and reduced motion. The installed typography and four page components came through standard CLI installation from the local registry; public namespace configuration was retained.
- Registry static export, lint, TypeScript, source validation for 11 items, and diff checks passed. Final public build-info bytes match the pre-work receipts: ui.wlkrlabs.com remains `6c34da775eb20b62b4352a360586d100b62399df`, and wlkrlabs.com remains `51fc3d16f13e2be37e4ccc4fbc27fc62145153c7`.

The reviewed draft is saved in local Git commits for owner review. No deploy or push was performed.

## Direct animation and footer feedback — local draft, 2026-10-23

The local catalog now contains 12 entries: ten original components, typography, and theme. FooterControls adds system/light/dark preferences and a real app-owned agent-view link. Both footer and basic theme controls include the same portable display-theme hook as source, with no unpublished registry dependency. The generated gallery `/llms.txt` contains installation, component, source JSON, and documentation links. IndexRow no longer renders a trailing arrow. PixelObject canvases and loader playground marks toggle pause directly; the reusable loading-status component remains noninteractive by default.

Registry build/source validation for 12 entries, static production build, lint, TypeScript, and diff checks passed. Parent local browser acceptance confirmed:

- Footer controls and the basic theme example synchronize their selected Light state; the gallery header theme control is absent.
- There are no visible Pause/Resume transport buttons or words, no IndexRow SVG arrow, and the gallery agent link targets the real `/llms.txt` destination. Browser console warnings/errors: none.
- The parallel website’s home title retains exactly three lines at widths 1280, 1099, 752, 390, and 320. Clicking the animation pauses without moving the SVG; Space resumes it.
- System selection follows OS light/dark preference. All four footer targets measure 44×44 px, and the 390 px mobile layout has no horizontal overflow.

This feedback remains local-only. Neither public application was deployed or pushed, and no commit was created by this implementation worker. The previously published source remains `6c34da775eb20b62b4352a360586d100b62399df`.

## Compact footer correction — local draft, 2026-10-23

The earlier 44 px footer layout is superseded by the user’s explicit reference correction: 24 px action cells, a 72×24 px outlined theme capsule, an 8 px gap, and a separate 24 px agent action (104×24 px total). Exact user-supplied Vercel footer SVG paths replace Lucide approximations, retaining their filled 16 px geometry and rules. Stock shadcn Tooltip adds concise hover/focus labels; native titles are removed. Stable choice classes and aria-checked styling avoid Tooltip’s asChild slot/state attribute collisions.

The existing theme actions, real agent destination, keyboard navigation, and reduced-motion behavior remain intact. No public deployment or push was performed. Browser measurements and final checks are recorded after acceptance.

### Compact footer acceptance — local, 2026-10-23

The website footer measured 104×24 px, with four 24×24 px controls and 16×16 px SVGs. Exact supplied reference icons rendered, and selected theme styling remained stable despite Tooltip’s slot/state attributes. Hover showed one readable “Light theme” stock tooltip at 11 px and full opacity. A nested stock arrow wrapper was identified and its descendant SVG hidden through footer-scoped CSS; stock Tooltip source stayed unchanged.

The compact control is still a local draft. No public deployment or push was performed.

Final compact-control checks: gallery demo and footer both measure 104 × 24 px, with all icons 16 × 16 px. Website theme selection updates both the document class and accessible selected state; System was restored after testing. At a 390 px viewport, the document width remains 390 px and the control remains 104 × 24 px. The scoped tooltip arrow rule uses `!important` to override Radix’s inline SVG display style while leaving the stock Tooltip source unchanged.
