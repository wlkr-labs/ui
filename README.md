# wlkr/ui

Standalone React, TypeScript, Tailwind 4, and shadcn registry for the intended `https://ui.wlkrlabs.com` address. **Local implementation; not deployed.** The existing `wlkrlabs.com` website has not been changed or migrated.

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

`pnpm build` rebuilds the registry before Next.js. `pnpm dev --port 3100` runs development mode. The `public/r/` files and `public/registry.json` are generated and committed for static hosting. Rebuild whenever registry sources change. Source preview reads the same original files at build time; there is no component renderer or installer service.

## Install into another React project

Use a React/TypeScript app configured for Tailwind and shadcn. For a new consumer, run `pnpm dlx shadcn@latest init` in that app first. Merge this into **that app’s** `components.json`:

```json
{
  "registries": {
    "@wlkr": "https://ui.wlkrlabs.com/r/{name}.json"
  }
}
```

After deployment:

```sh
pnpm dlx shadcn@latest add @wlkr/copy-command
pnpm dlx shadcn@latest add @wlkr/async-action
pnpm dlx shadcn@latest add @wlkr/filter-list
# Optional; review and merge any existing theme tokens before applying.
pnpm dlx shadcn@latest add @wlkr/theme
```

For local acceptance use `http://localhost:3100/r/{name}.json` instead. Direct URLs also work: `pnpm dlx shadcn@latest add http://localhost:3100/r/copy-command.json`.

Original source lands in your configured components directory under `wlkr/`. The CLI resolves your aliases and installs npm and official shadcn dependencies. Import using your own alias:

```tsx
import { CopyCommand } from "@/components/wlkr/copy-command"
import { AsyncAction } from "@/components/wlkr/async-action"
import { FilterList } from "@/components/wlkr/filter-list"

<CopyCommand command="pnpm build" />
<AsyncAction action={async () => {
  const response = await fetch("/api/settings", { method: "POST" })
  if (!response.ok) throw new Error("Save failed")
}}>Save changes</AsyncAction>
<FilterList label="Search projects" items={[
  { id: "studio", label: "Brand Studio", description: "Design assets", keywords: ["identity"] },
]} />
```

The current `wlkrlabs.com` site uses Astro. Its future adoption needs the official `@astrojs/react` integration, compatible Tailwind/shadcn setup, and interactive React islands (for example `<CopyCommand client:load command="pnpm build" />` in an `.astro` page). Apply the registry setup in that separate website checkout only after acceptance and an explicit adoption change. Review generated files, existing token conflicts, and imports before committing. No runtime component package, custom installer, renderer, or additional MCP server is required.

## Collection and behavior

| Item | Purpose | API |
| --- | --- | --- |
| `copy-command` | Clipboard command with confirmed success and manual fallback on failure | `command: string`, optional `className` |
| `async-action` | One promise at a time, accessible pending/success/error, retry on next click | `action: () => Promise<unknown>`, `children`, optional `pendingLabel`, `successLabel`, `errorLabel`, `disabled` |
| `filter-list` | Search labels, descriptions and keywords; case/accent insensitive multiword match, live count, clear and empty feedback | `items: { id, label, description?, keywords? }[]`, optional `label`, `placeholder` |
| `theme` | Semantic light/dark tokens; app-controlled typography | Apply `.dark` to document root for dark mode |

Clipboard requires a secure context (HTTPS or localhost). On failure the selectable command remains available. Async actions require rejected promises for failures: throw when a fetch response is not OK. The preview’s “Simulate a failed save” switch exercises retry. Filter item IDs must be unique; results preserve input ordering.

The site uses installed, unchanged stock `Button`, `Input`, `Switch`, and `Tabs`. Those files are **not** registry entries. Original components declare stock dependencies by official shadcn item name; consumers receive them directly from upstream. The site presentation layer removes visual chrome without altering upstream source. Installed components inherit the consumer’s stock primitives and local styling, so appearance can differ from this showcase. WLKR theme changes tokens, not stock source or font imports.

## Design

Paper white `#ffffff`, ink `#010101`, neutral secondary text, and WLKR green `#33f282`. Oversized Geist typography anchors a quiet editorial layout. Open specimens replace bordered cards. Focus indicators remain explicit; motion respects reduced-motion preferences. Theme is selected from system preferences on first load, then persists an explicit selection when storage is available. Light and dark semantic values live in `app/globals.css`; registry theme tokens must stay synchronized.

## Attribution and licenses

- Official starter and stock component source: [shadcn/ui](https://ui.shadcn.com), MIT. Stock files were installed with CLI 4.22.1 and remain unchanged.
- Accessible primitives: [Radix UI](https://www.radix-ui.com), MIT.
- Icons: [Lucide](https://lucide.dev), ISC.
- Typeface: [Geist](https://vercel.com/font), SIL Open Font License, bundled with `public/fonts/OFL.txt`.
- WLKR’s existing mark, favicon, and licensed Geist font are reused from the WLKR Labs brand masters. Branding remains WLKR Labs property; no rights to its marks are granted by the source license.
- Original component code: MIT, see `LICENSE`.

The public domain is a deployment target. No DNS, hosting, external repository, or existing website was changed by this implementation.
