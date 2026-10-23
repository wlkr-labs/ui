/** Server/build-only highlighting. Client code receives escaped HTML, never a highlighter engine. */
import { createHighlighterCore, type ThemeRegistration } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

function theme(name: string, type: "light" | "dark", foreground: string, muted: string, string: string): ThemeRegistration {
  return {
    name, type, colors: { "editor.background": type === "dark" ? "#010101" : "#ffffff", "editor.foreground": foreground },
    tokenColors: [
      { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: muted, fontStyle: "italic" } },
      { scope: ["keyword", "storage", "entity.name.function"], settings: { foreground, fontStyle: "bold" } },
      { scope: ["string", "constant.other.symbol"], settings: { foreground: string } },
      { scope: ["constant.numeric", "constant.language", "punctuation", "keyword.operator"], settings: { foreground: muted } },
    ],
  }
}
const highlighter = createHighlighterCore({
  themes: [theme("wlkr-light", "light", "#010101", "#696969", "#087d3d"), theme("wlkr-dark", "dark", "#f7f7f7", "#a0a0a0", "#83dba7")],
  langs: [import("shiki/langs/tsx.mjs"), import("shiki/langs/css.mjs"), import("shiki/langs/json.mjs")],
  engine: createJavaScriptRegexEngine(),
})
export async function highlightCode(code: string, language: "tsx" | "css" | "json" | "text" = "tsx") {
  return (await highlighter).codeToHtml(code, { lang: language, themes: { light: "wlkr-light", dark: "wlkr-dark" }, defaultColor: false })
}
