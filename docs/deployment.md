# Static release to ui.wlkrlabs.com

**Live release:** `6c34da775eb20b62b4352a360586d100b62399df` (five originals plus theme), published and publicly verified on 2026-10-23. Cloudflare deployment `1c3eee64-3e17-4f1b-92f3-8a3145b7a7a4` serves Worker version `600ac8d3-8fe7-4d69-b529-4f88cc9b8168` at 100%. See [verification](verification.md) for exact public acceptance evidence. The commands below describe repeat releases; later publishing still requires its own authorization.

The local checkout now contains an unpublished 13-item page-component draft and PixelObject morphing. Those additions are local review work; the live release below remains unchanged.

The site is a Next.js static export. Server components read original source at build time; all browser interactions run in the exported client assets. No Next.js server, adapter, Worker script, secret, runtime binding, or component service is required.

## Deployment boundary

- Cloudflare account: `78085b86e0696bb88ab5c8d376402ea2`.
- New standalone Worker: `wlkr-ui`.
- Only custom domain: `ui.wlkrlabs.com`.
- Asset directory: `out/`, produced by `pnpm build`.
- Unknown paths return the exported 404 page; HTML paths drop trailing slashes.
- `workers.dev` and version preview URLs are disabled.
- Compatibility date `2026-10-07` matches the runtime bundled with the pinned Wrangler version; assets require no later runtime behavior.

The existing `wlkrlabs-com` Worker, `wlkrlabs.com`, and `www.wlkrlabs.com` are separate. Do not change their routes or assets as part of this release. This checkout retains the official starter as its Git `origin`; publishing assets does not push source to that remote.

## Prepare

Use the authenticated Wrangler CLI in this checkout. The pinned dev dependency is Wrangler 4.145.0. Authentication stays in Wrangler's existing local OAuth storage; do not copy credentials into the repository.

```sh
pnpm install --frozen-lockfile
pnpm deploy:check
```

This rebuilds the current catalog and static website (13 entries in the local page-component draft; six in the current public release), then runs `wrangler deploy --dry-run`. It does not publish. Preview the exported output locally with `pnpm start --port 3100`.

Before publishing, inspect the Cloudflare account, existing Worker custom domains, and DNS for `ui.wlkrlabs.com` to establish that the new domain does not displace another service. Review and commit source, configuration, lockfile, and generated registry JSON. Local `.wrangler/`, `out/`, `.next/`, and screenshots remain ignored.

## Publish

```sh
pnpm run deploy
```

The release check requires a clean committed checkout, rebuilds, runs lint and TypeScript checks, confirms generation leaves Git clean, and checks the expected static files. It prints the Git revision that produced the output. `out/build-info.json` records that source revision, the build time, and SHA-256 hashes of both registry catalogs and every item endpoint in the corresponding catalog. This receipt is generated only in the ignored export directory, avoiding a committed self-reference. Wrangler then publishes the asset-only Worker and configured custom domain. Record the revision and Cloudflare deployment/version identifiers in the verification record.

## Verify the public release

1. Open `https://ui.wlkrlabs.com` over HTTPS and confirm the gallery and interactive previews render.
2. Confirm `/registry.json`, `/r/registry.json`, and every `/r/{name}.json` endpoint listed in that catalog return valid JSON. Compare their bytes with the generated files in this committed checkout and the SHA-256 values at `/build-info.json`. Registry and build-info responses use revalidation headers.
3. In a fresh React/Tailwind/shadcn consumer, configure `"@wlkr": "https://ui.wlkrlabs.com/r/{name}.json"`. Install the five originals and optional theme using `pnpm dlx shadcn@latest add @wlkr/copy-command @wlkr/async-action @wlkr/filter-list @wlkr/pixel-object @wlkr/wlkr-loader @wlkr/theme`.
4. Mount the installed components, build the consumer, and inspect browser rendering. Check both the registry and the existing apex website; no website migration is part of this release.
5. Only after successful public verification, update README release status and append exact release evidence to `docs/verification.md`.

## Recovery

For a later release, use Cloudflare's previous deployment/version to roll back **only** `wlkr-ui`, then verify the public registry artifacts again. The first release has no earlier Worker version to restore. If its custom domain must be withdrawn, remove only the `ui.wlkrlabs.com` association; preserve the main website and its DNS. Never use the starter Git remote as a deployment destination.

References: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Cloudflare static assets](https://developers.cloudflare.com/workers/static-assets/), and [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).

## Source repository

The public source repository is [wlkr-labs/ui](https://github.com/wlkr-labs/ui). Local `origin` uses the configured `github-scwlkr` SSH alias; `upstream` preserves the official registry starter. Pushing reviewed source is separate from deployment and does not authorize a Worker or website release.
