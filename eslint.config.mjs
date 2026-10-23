import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
export default defineConfig([...nextVitals, ...nextTs, { files: ["registry/wlkr/text-link.tsx"], rules: { "@next/next/no-img-element": "off" } }, globalIgnores([".next/**", ".wrangler/**", "out/**", "output/**", "next-env.d.ts"])])
