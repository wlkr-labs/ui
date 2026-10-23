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
