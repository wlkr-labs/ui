"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** A copyable command that reports success only after the clipboard accepts it. */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [state, setState] = React.useState<"idle" | "copying" | "copied" | "error">("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  async function copy() {
    if (timer.current) clearTimeout(timer.current)
    setState("copying")
    try {
      await navigator.clipboard.writeText(command)
      setState("copied")
      timer.current = setTimeout(() => setState("idle"), 2200)
    } catch { setState("error") }
  }
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex min-w-0 items-center gap-4">
        <code className="min-w-0 flex-1 overflow-x-auto py-3 text-sm whitespace-pre">{command}</code>
        <Button type="button" variant="ghost" size="icon" onClick={copy} disabled={state === "copying"} aria-label={state === "copied" ? "Command copied" : "Copy command"}>
          {state === "copied" ? <Check /> : <Copy />}
        </Button>
      </div>
      <span role="status" className={cn("text-xs", state === "error" ? "text-destructive" : "text-muted-foreground")}>
        {state === "error" ? "Clipboard unavailable. Select and copy the command above, or try again." : state === "copied" ? "Copied to clipboard." : ""}
      </span>
    </div>
  )
}
