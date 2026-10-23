"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDisplayTheme, type DisplayTheme } from "@/hooks/use-display-theme"
import { cn } from "@/lib/utils"

// Exact 16 px icon paths from the Vercel footer reference supplied by the user.
// Theme behavior, registry composition, and tooltip integration are WLKR code.
const icons:Record<DisplayTheme|"agent",{d:string;fillRule?:"evenodd";clipRule?:"evenodd"}> = {
  "agent": {
    "d": "M13.76 1.01A2.5 2.5 0 0 1 16 3.5v9a2.5 2.5 0 0 1-2.5 2.5h-11a2.5 2.5 0 0 1-2.49-2.24L0 12.5v-9c0-1.3.98-2.36 2.24-2.49L2.5 1h11zM1.5 12.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V5h-13zm5.25-5.57v4.01h-1.5V6.92zm4 4h-1.5v-4h1.5zm-9-8.43a.25.25 0 0 0-.25.25v1c0 .14.11.25.25.25H3V2.5zM4 2.5V4h1.5V2.5zm2.5 0V4h1.25c.14 0 .25-.11.25-.25v-1a.25.25 0 0 0-.25-.25z"
  },
  "dark": {
    "d": "m6.3 3.3.7.25A4.25 4.25 0 0 0 12.45 9l.96.96-.08.2A5.75 5.75 0 1 1 6.04 2.6zM5.25 4.76a4.24 4.24 0 1 0 6 5.99H11a5.75 5.75 0 0 1-5.75-6M12.5 3.5h1.25V5H12.5v1.25H11V5H9.75V3.5H11V2.25h1.5zM7 3.55l-.7-.25-.26-.7z"
  },
  "light": {
    "d": "M8.75 2v-.75h-1.5V3h1.5V2M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.75 1.5v1.75h-1.5V13zM13 7.25h1.75v1.5H13zm-11 0h-.75v1.5H3v-1.5H2m9-3.32.54-.53.17-.17.53-.53 1.06 1.06-.53.53-.17.17-.53.53zm-7.77 7.78-.53.53 1.06 1.06.53-.53.17-.17.53-.53L3.93 11l-.53.53zM3.93 5l-.53-.53-.17-.17-.53-.53L3.76 2.7l.53.53.17.17.53.53zm7.78 7.78.53.53 1.06-1.06-.53-.53-.17-.17-.53-.53L11 12.07l.53.53z",
    "fillRule": "evenodd",
    "clipRule": "evenodd"
  },
  "system": {
    "d": "M2.5 5.25C2.5 3.45 3.96 2 5.75 2h4.5c1.8 0 3.25 1.46 3.25 3.25V14h-11V5.25M5.75 3.5C4.78 3.5 4 4.28 4 5.25v7.25h8V5.25c0-.97-.78-1.75-1.75-1.75zM5 5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V9H5zm3.5 6H11V10H8.5z",
    "fillRule": "evenodd",
    "clipRule": "evenodd"
  }
}
function FooterIcon({name}:{name:DisplayTheme|"agent"}) {
  const icon=icons[name]
  return <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d={icon.d} fill="currentColor" fillRule={icon.fillRule} clipRule={icon.clipRule}/></svg>
}
const styles=`
.wlkr-footer-controls.wlkr-footer-controls{display:inline-flex;align-items:center;gap:8px;color:var(--muted-foreground,#696969)}
.wlkr-footer-controls [data-slot=toggle-group]{display:inline-flex;align-items:center;width:72px;height:24px;gap:0;padding:0;background:none;border:0;outline:1px solid var(--border,#dedede);border-radius:9999px;box-shadow:none}
.wlkr-footer-controls .wlkr-footer-theme,.wlkr-footer-agent{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;min-width:24px;min-height:24px;padding:0;border:0;border-radius:50%;box-shadow:none;background:transparent;color:inherit;cursor:pointer;text-decoration:none}
.wlkr-footer-controls .wlkr-footer-theme[aria-checked=true]{background:var(--muted,#f3f3f3);color:var(--foreground,#010101)}
.wlkr-footer-controls .wlkr-footer-theme:focus-visible,.wlkr-footer-agent:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:3px}
.wlkr-footer-controls svg{display:block;width:16px;height:16px}
.wlkr-footer-agent:hover{color:var(--foreground,currentColor)}
.wlkr-footer-tip[data-slot=tooltip-content]{padding:5px 8px;border:0;border-radius:4px;box-shadow:none;background:var(--foreground,#010101);color:var(--background,#fff);font-size:11px;line-height:1.5}
.wlkr-footer-tip[data-slot=tooltip-content] svg{display:none!important}
@media(prefers-reduced-motion:reduce){.wlkr-footer-tip[data-slot=tooltip-content]{animation:none;transition:none}}
`
/** Compact reference-matched display preferences and a real app-owned plain-text destination. */
export function FooterControls({agentHref,className,storageKey="wlkr-theme"}:{agentHref:string;className?:string;storageKey?:string}) {
  const {mode,setMode}=useDisplayTheme(storageKey)
  return <div className={cn("wlkr-footer-controls",className)}><style>{styles}</style><TooltipProvider delayDuration={250}><ToggleGroup type="single" value={mode} onValueChange={value=>{if(value)setMode(value as DisplayTheme)}} aria-label="Color theme">
    {(["system","light","dark"] as const).map(value=>{const label=value==="system"?"System theme":value==="light"?"Light theme":"Dark theme";return <Tooltip key={value}><TooltipTrigger asChild><ToggleGroupItem className="wlkr-footer-theme" value={value} aria-label={label}><FooterIcon name={value}/></ToggleGroupItem></TooltipTrigger><TooltipContent className="wlkr-footer-tip" sideOffset={8}>{label}</TooltipContent></Tooltip>})}
  </ToggleGroup><Tooltip><TooltipTrigger asChild><a className="wlkr-footer-agent" href={agentHref} target="_blank" rel="noopener noreferrer" aria-label="View as agent"><FooterIcon name="agent"/></a></TooltipTrigger><TooltipContent className="wlkr-footer-tip" sideOffset={8}>View as agent</TooltipContent></Tooltip></TooltipProvider></div>
}
