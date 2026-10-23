import { readFile } from "node:fs/promises"
import { Showcase } from "@/components/showcase"
export default async function Home() {
  const names = ["copy-command", "async-action", "filter-list"]
  const sources = Object.fromEntries(await Promise.all(names.map(async name => [name, await readFile(`${process.cwd()}/registry/wlkr/${name}.tsx`, "utf8")])))
  return <Showcase sources={sources} />
}
