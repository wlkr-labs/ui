# Verification — 2026-10-23

Local acceptance for the standalone `wlkr/ui` checkout. The public domain remains a deployment target; no deployment was performed.

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
