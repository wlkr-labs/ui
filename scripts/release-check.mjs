import { execFileSync, spawnSync } from "node:child_process"
import { access } from "node:fs/promises"

function requireClean() {
  const status = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" })
  if (status.trim()) throw new Error("Release requires committed source and registry outputs. Commit or preserve outstanding changes before retrying.")
}
function run(...args) {
  const result = spawnSync("pnpm", args, { stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

requireClean()
const revision = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim()
run("build")
run("lint")
run("typecheck")
// Registry generation must reproduce the committed static artifacts exactly.
requireClean()
for (const path of ["out/build-info.json", "out/index.html", "out/404.html", "out/registry.json", "out/r/copy-command.json", "out/r/async-action.json", "out/r/filter-list.json", "out/r/pixel-object.json", "out/r/theme.json"]) await access(path)
console.log(`Static release verified from ${revision}.`)
