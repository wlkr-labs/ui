# GitHub star

GitHub star is part of the authorized 13-item release candidate. Exact public release verification is recorded in [verification](verification.md).

```sh
pnpm dlx shadcn@latest add @wlkr/github-star
```

```tsx
import { GithubStar } from "@/components/wlkr/github-star"

<GithubStar repository="your-org/your-repo" count={starCount} />
```

`repository` is an owner/name pair. The application supplies `count: number | null` from its own verified data source. `null`, non-finite values, or unavailable data render a GitHub link with no numeric claim. Valid counts are clamped to whole numbers from zero through 999,999,999. Optional `duration` is milliseconds (default 1,200, bounded 250–5,000), `label` customizes the accessible link name, and `className` handles layout.

The native link opens the repository in a new tab; it never pretends to perform GitHub’s authenticated Star action. There is no client fetching, API token, optimistic increment, runtime animation package, or server. Keep data fetching/caching in the host application, and pass null when it fails.

The final number reserves its full width before animation. Tabular digit strips count up while a green star fills bottom to top; twelve radial particles, including four tiny glints, burst once at completion. First visibility and hover/keyboard focus replay the sequence. Accessible text always contains the final truthful count and does not announce intermediate digits. Reduced motion shows the final number and filled star with no burst. Observers/media listeners disconnect on unmount; finite CSS animations disappear with their elements.

The gallery’s 4,530, zero, large-count, and unavailable examples are explicitly labeled example data and link to the real shadcn repository. They are not live star counts.

## Attribution

Interaction inspired by [Animate UI’s GitHub Stars button](https://animate-ui.com/docs/components/buttons/github-stars), inspected through the official shadcn CLI. WLKR implementation is independently authored React/CSS/SVG; no Animate UI or Motion runtime/source is installed or republished. The star outline uses the existing [Lucide](https://lucide.dev) dependency. The GitHub outline is embedded from Lucide v0.487.0 (ISC) so newer Lucide releases that omit brand icons remain compatible.
