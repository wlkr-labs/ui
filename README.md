# wlkr/ui

Standalone React, TypeScript, Tailwind 4, and shadcn registry, live at [ui.wlkrlabs.com](https://ui.wlkrlabs.com). The public release at `8f87ab3313e943653dfd113d3912160d830cd0f4` contains four original components plus the theme; public HTTPS, registry artifacts, gallery interactions, and standard `@wlkr` CLI installation were verified. **The expanded PixelObject controls and new WLKR loader in this checkout are local review work only and have not been deployed.** The existing `wlkrlabs.com` website has not been changed or migrated.

Created from the official [shadcn registry starter](https://github.com/shadcn-ui/registry-template), linked by the [current getting-started guide](https://ui.shadcn.com/docs/registry/getting-started), at upstream commit `906f859db0125965cba71c51da1707c0a4c6d045`. Full upstream history remains in Git. `origin` points to that starter for provenance, not a WLKR publishing destination. Work is on `codex/wlkr-ui`. Local checkout: `/Users/shanewalker/Desktop/dev/wlkr-ui`.

## Develop and verify

```sh
pnpm install --frozen-lockfile
pnpm registry:build
pnpm lint
pnpm typecheck
pnpm build
pnpm start --port 3100
```

`pnpm build` rebuilds the registry before Next.js and exports the entire site to `out/`. `pnpm dev --port 3100` runs Next.js development mode. `pnpm start --port 3100` previews the exported assets through the local Cloudflare runtime; build first. The `public/r/` files and `public/registry.json` are generated and committed for static hosting. Rebuild whenever registry sources change. Source preview reads the same original files at build time; there is no component renderer or installer service.

## Install into another React project

Use a React/TypeScript app configured for Tailwind and shadcn. For a new consumer, run `pnpm dlx shadcn@latest init` in that app first. Merge this into **that app’s** `components.json`:

```json
{
  "registries": {
    "@wlkr": "https://ui.wlkrlabs.com/r/{name}.json"
  }
}
```

Install from the public registry:

```sh
pnpm dlx shadcn@latest add @wlkr/copy-command
pnpm dlx shadcn@latest add @wlkr/async-action
pnpm dlx shadcn@latest add @wlkr/filter-list
pnpm dlx shadcn@latest add @wlkr/pixel-object
# Optional; review and merge any existing theme tokens before applying.
pnpm dlx shadcn@latest add @wlkr/theme
```

For local acceptance use `http://localhost:3100/r/{name}.json` instead. Direct URLs also work: `pnpm dlx shadcn@latest add http://localhost:3100/r/copy-command.json`.

Original source lands in your configured components directory under `wlkr/`. The CLI resolves your aliases and installs npm and official shadcn dependencies. Import using your own alias:

```tsx
import { CopyCommand } from "@/components/wlkr/copy-command"
import { AsyncAction } from "@/components/wlkr/async-action"
import { FilterList } from "@/components/wlkr/filter-list"
import { PixelObject } from "@/components/wlkr/pixel-object"

<CopyCommand command="pnpm build" />
<AsyncAction action={async () => {
  const response = await fetch("/api/settings", { method: "POST" })
  if (!response.ok) throw new Error("Save failed")
}}>Save changes</AsyncAction>
<FilterList label="Search projects" items={[
  { id: "studio", label: "Brand Studio", description: "Design assets", keywords: ["identity"] },
]} />
<PixelObject label="Pixel sphere" />
```

The current `wlkrlabs.com` site uses Astro. Its future adoption needs the official `@astrojs/react` integration, compatible Tailwind/shadcn setup, and interactive React islands (for example `<CopyCommand client:load command="pnpm build" />` in an `.astro` page). Apply the registry setup in that separate website checkout only after acceptance and an explicit adoption change. Review generated files, existing token conflicts, and imports before committing. No runtime component package, custom installer, renderer, or additional MCP server is required.

## Collection and behavior

| Item | Purpose | API |
| --- | --- | --- |
| `copy-command` | Fixed copy icon slot with animated green check/red X and hidden announcements | `command: string`, optional `className` |
| `async-action` | One promise at a time, accessible pending/success/error, retry on next click | `action: () => Promise<unknown>`, `children`, optional `pendingLabel`, `successLabel`, `failureLabel` (visible), `errorLabel` (announcement), `disabled` |
| `filter-list` | Search labels, descriptions and keywords; case/accent insensitive multiword match, live count, clear and empty feedback | `items: { id, label, description?, keywords? }[]`, optional `label`, `placeholder` |
| `pixel-object` | Project a rotating sphere, normalized 3D point cloud, or #/space mask into an SVG pixel grid | optional `points: PixelPoint[]`, `mask: string[]`, `resolution`, `size`, `label`, `rotating`, `className`; exported `spherePoints(count?)` |
| `wlkr-loader` (local only) | Original six-cell WLKR mark with bars/dots beats, fixed SVG bounds, and a single loading announcement | `variant`, `size`, `duration`, `stagger`, `label`, `decorative`, `paused`, `className` |
| `theme` | Semantic light/dark tokens; app-controlled typography | Apply `.dark` to document root for dark mode |

The local collection contains five original components plus the optional theme. The public release still has four originals; `wlkr-loader` and the PixelObject expansion are local only. See [the motion component API](docs/motion-components.md) for controls, presets, timing, and input precedence. Their interaction styles travel with their source; no site-only stylesheet is required.

Clipboard requires a secure context (HTTPS or localhost). On failure the selectable command remains available. Async actions require rejected promises for failures: throw when a fetch response is not OK. The preview’s “Simulate a failed save” switch exercises retry. Filter item IDs must be unique; results preserve input ordering.

Copy feedback stays in the same 44 px icon slot; screen-reader status remains off-screen. Failure leaves the command selectable. Async labels share one grid slot sized to the widest concise state, so the control does not resize. Its pending label remains fully readable under a slowly moving pixel mask. The failure label stays concise while `errorLabel` announces the reason without another visible line. Success uses `--success` (`#087d3d` on white, `#33f282` in dark mode), with local fallbacks when the optional theme is absent.

Filter inputs use the browser’s native text editing and a short focus marker by the search icon. Native `caret-shape: block` is enabled where supported; other browsers retain their native caret. Selection, IME, touch editing, and browser caret behavior remain native.

`PixelObject` accepts `points` with x/y/z coordinates normalized to [-1, 1], or a flat `mask` array where `#` means filled and spaces/dots mean empty. `mask` takes precedence over `points`. Set `rotating={false}` for static logos, symbols, or masks. The default sphere uses `spherePoints(420)`; you can supply another point cloud. Point clouds are capped at 2,000 points; mask rows and columns at 80, legacy resolution at 8–80, and display size at 64–1,000 px. Explicit `dotSize`/`gap` derive density from their pixel pitch instead of resolution; see the motion API for details. Give every object a meaningful `label`.

Rotation pauses off-screen and in hidden browser tabs, and has an explicit Pause/Resume control. Reduced-motion preferences keep the object static and disable copy/text animation. Pending pixel motion is a 2.8-second, low-amplitude reconstruction; it has no hard flashing. The object rotates slowly (about 42 seconds per revolution), sampled around 12 fps. Effects clean up animation frames and observers on unmount. The interaction reference is [Magic UI’s flickering grid](https://magicui.design/docs/components/flickering-grid); the text mask and object projection here are original WLKR implementations.

The site uses installed, unchanged stock `Button`, `Input`, `Switch`, `Tabs`, `Slider`, `NativeSelect`, and `Field` (plus their upstream helper components). Those files are **not** registry entries. Original components declare stock dependencies by official shadcn item name; consumers receive them directly from upstream. The site presentation layer removes visual chrome without altering upstream source. Installed components inherit the consumer’s stock primitives and local styling, so appearance can differ from this showcase. WLKR theme changes tokens, not stock source or font imports.

## Design

Paper white `#ffffff`, ink `#010101`, neutral secondary text, and WLKR green `#33f282`. Oversized Geist typography anchors a quiet editorial layout. Open specimens replace bordered cards. Focus indicators remain explicit; motion respects reduced-motion preferences. Theme is selected from system preferences on first load, then persists an explicit selection when storage is available. Light and dark semantic values live in `app/globals.css`; registry theme tokens must stay synchronized.

## Attribution and licenses

- Official starter and stock component source: [shadcn/ui](https://ui.shadcn.com), MIT. Stock files were installed with CLI 4.22.1 and remain unchanged.
- Accessible primitives: [Radix UI](https://www.radix-ui.com), MIT.
- Icons: [Lucide](https://lucide.dev), ISC.
- Typeface: [Geist](https://vercel.com/font), SIL Open Font License, bundled with `public/fonts/OFL.txt`.
- WLKR’s existing mark, favicon, and licensed Geist font are reused from the WLKR Labs brand masters. Branding remains WLKR Labs property; no rights to its marks are granted by the source license.
- Original component code: MIT, see `LICENSE`.

The public site runs on its own Cloudflare static Worker, `wlkr-ui`, at `ui.wlkrlabs.com`. The main website and its Worker remain unchanged. See [release verification](docs/verification.md) for the exact published source revision and acceptance evidence. No external source repository was created or pushed.

## Static Cloudflare release

See [the deployment runbook](docs/deployment.md). `pnpm deploy:check` builds and validates the upload without publishing. `pnpm run deploy` requires a clean committed checkout, rebuilds and checks it, then publishes only the separate `wlkr-ui` static Worker at `ui.wlkrlabs.com`. The main `wlkrlabs-com` Worker and apex/`www` routes are outside this configuration.
