"use client"

import * as React from "react"
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Runs one promise at a time, with accessible pending, success and retry feedback. */
export function AsyncAction({ action, children, pendingLabel = "Saving…", successLabel = "Saved", errorLabel = "Could not save. Try again.", disabled = false }: {
  action: () => Promise<unknown>
  children: React.ReactNode
  pendingLabel?: string
  successLabel?: string
  errorLabel?: string
  disabled?: boolean
}) {
  const [state, setState] = React.useState<"idle" | "pending" | "success" | "error">("idle")
  const locked = React.useRef(false)
  const mounted = React.useRef(true)
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  async function run() {
    if (locked.current) return
    locked.current = true
    setState("pending")
    try { await action(); if (mounted.current) setState("success") }
    catch { if (mounted.current) setState("error") }
    finally { locked.current = false }
  }
  return (
    <div className="flex flex-col items-start gap-3">
      <Button type="button" variant="ghost" onClick={run} disabled={disabled || state === "pending"} aria-busy={state === "pending"}>
        {state === "pending" ? <LoaderCircle data-icon="inline-start" className="motion-safe:animate-spin" /> : state === "success" ? <Check data-icon="inline-start" /> : <ArrowUpRight data-icon="inline-start" />}
        {state === "pending" ? pendingLabel : state === "success" ? successLabel : children}
      </Button>
      <span role="status" className={state === "error" ? "text-sm text-destructive" : "sr-only"}>
        {state === "error" ? errorLabel : state === "success" ? successLabel : state === "pending" ? pendingLabel : ""}
      </span>
    </div>
  )
}
