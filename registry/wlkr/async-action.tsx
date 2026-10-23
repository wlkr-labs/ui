"use client"

import * as React from "react"
import { ArrowUpRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const styles = `
.wlkr-action{display:inline-grid!important;grid-template-areas:'state';height:44px;min-height:44px;max-width:100%;padding:0 12px!important}
.wlkr-action-state{grid-area:state;display:inline-flex;align-items:center;justify-content:flex-start;gap:10px;min-height:24px;white-space:normal;text-align:left}
.wlkr-action-state[aria-hidden=true]{visibility:hidden;pointer-events:none}
.wlkr-action-state svg{width:16px;height:16px;flex-shrink:0}
.wlkr-action-success{color:var(--success,#087d3d)}
.dark .wlkr-action-success{color:var(--success,#33f282)}
.wlkr-action-error{color:var(--destructive,#b42318)}
.wlkr-action[aria-busy=true]{opacity:1!important}
.wlkr-action-pending-label{position:relative;display:inline-block}
.wlkr-action-pending-base{opacity:.72}
.wlkr-action-pending-pixels{position:absolute;inset:0;pointer-events:none;mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='3' height='3' fill='white'/%3E%3Crect x='4' y='4' width='3' height='3' fill='white'/%3E%3C/svg%3E");mask-size:8px 8px;mask-repeat:repeat}
@keyframes wlkr-action-reconstruct{0%,100%{mask-position:0 0;opacity:.35}50%{mask-position:4px 4px;opacity:1}}
@media(prefers-reduced-motion:no-preference){.wlkr-action-pending-pixels{animation:wlkr-action-reconstruct 2800ms ease-in-out infinite}}
@media(prefers-reduced-motion:reduce){.wlkr-action-pending-base{opacity:1}.wlkr-action-pending-pixels{display:none}}

`

/** One promise at a time. All labels share a reserved slot, so feedback never moves the page. */
export function AsyncAction({ action, children, pendingLabel = "Saving…", successLabel = "Saved", errorLabel = "Could not save. Try again.", failureLabel = "Try again", disabled = false }: {
  action: () => Promise<unknown>
  children: React.ReactNode
  pendingLabel?: string
  successLabel?: string
  errorLabel?: string
  failureLabel?: string
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
    <span className="relative inline-flex max-w-full align-middle">
      <style>{styles}</style>
      <Button className="wlkr-action" type="button" variant="ghost" onClick={run} disabled={disabled || state === "pending"} aria-busy={state === "pending"}>
        <span className="wlkr-action-state" aria-hidden={state !== "idle"}><ArrowUpRight aria-hidden="true" />{children}</span>
        <span className="wlkr-action-state" aria-hidden={state !== "pending"}><ArrowUpRight aria-hidden="true" style={{visibility:"hidden"}} /><span className="wlkr-action-pending-label"><span className="wlkr-action-pending-base">{pendingLabel}</span><span className="wlkr-action-pending-pixels" aria-hidden="true">{pendingLabel}</span></span></span>
        <span className="wlkr-action-state" aria-hidden={state !== "success"}><Check className="wlkr-action-success" aria-hidden="true" />{successLabel}</span>
        <span className="wlkr-action-state" aria-hidden={state !== "error"}><X className="wlkr-action-error" aria-hidden="true" />{failureLabel}</span>
      </Button>
      <span role="status" className="sr-only">{state === "error" ? errorLabel : state === "success" ? successLabel : state === "pending" ? pendingLabel : ""}</span>
    </span>
  )
}
