# Verification — 2026-10-23

Local acceptance for the standalone `wlkr/ui` checkout. The public domain remains a deployment target; no deployment was performed.

## Registry and consumer

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
