import { readFile, writeFile, copyFile } from 'node:fs/promises'
const registry = JSON.parse(await readFile('registry.json', 'utf8'))
await writeFile('public/r/registry.json', JSON.stringify(registry, null, 2) + '\n')
await copyFile('registry.json', 'public/registry.json')
