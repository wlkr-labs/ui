import { readFile } from "node:fs/promises"
import { Showcase } from "@/components/showcase"
export default async function Home() {
  const names = ["copy-command", "async-action", "filter-list", "pixel-object", "wlkr-loader", "page-intro", "index-row", "text-link", "theme-toggle", "typography", "footer-controls", "github-star"]
  const sources = Object.fromEntries(await Promise.all(names.map(async name => [name, await readFile(`${process.cwd()}/registry/wlkr/${name}.${name === "typography" ? "css" : "tsx"}`, "utf8")])))
  return <Showcase sources={sources} />
}
