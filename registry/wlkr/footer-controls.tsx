"use client"

import { Computer, MoonStar, PanelTop, Sun } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useDisplayTheme, type DisplayTheme } from "@/hooks/use-display-theme"
import { cn } from "@/lib/utils"

const styles=`
.wlkr-footer-controls{display:inline-flex;align-items:center;gap:8px;color:var(--muted-foreground,#696969)}
.wlkr-footer-controls [data-slot=toggle-group]{display:inline-flex;gap:3px;padding:0;background:none;border:0;border-radius:0;box-shadow:none}
.wlkr-footer-controls [data-slot=toggle-group-item],.wlkr-footer-agent{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0;border:0;border-radius:3px;box-shadow:none;background:transparent;color:inherit;cursor:pointer;text-decoration:none}
.wlkr-footer-controls [data-slot=toggle-group-item][data-state=on]{background:var(--muted,#f3f3f3);color:var(--foreground,#010101)}
.wlkr-footer-controls [data-slot=toggle-group-item]:focus-visible,.wlkr-footer-agent:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:4px}
.wlkr-footer-controls svg{width:17px;height:17px}
.wlkr-footer-agent:hover{color:var(--foreground,currentColor)}
`
/** System/light/dark display preferences and an actual app-owned Markdown/plain-text destination. */
export function FooterControls({agentHref,className,storageKey="wlkr-theme"}:{agentHref:string;className?:string;storageKey?:string}) {
  const {mode,setMode}=useDisplayTheme(storageKey)
  return <div className={cn("wlkr-footer-controls",className)}><style>{styles}</style><ToggleGroup type="single" value={mode} onValueChange={value=>{if(value)setMode(value as DisplayTheme)}} aria-label="Color theme">
    <ToggleGroupItem value="system" aria-label="System theme" title="System theme"><Computer aria-hidden="true"/></ToggleGroupItem>
    <ToggleGroupItem value="light" aria-label="Light theme" title="Light theme"><Sun aria-hidden="true"/></ToggleGroupItem>
    <ToggleGroupItem value="dark" aria-label="Dark theme" title="Dark theme"><MoonStar aria-hidden="true"/></ToggleGroupItem>
  </ToggleGroup><a className="wlkr-footer-agent" href={agentHref} target="_blank" rel="noopener noreferrer" aria-label="View as agent" title="View as agent"><PanelTop aria-hidden="true"/></a></div>
}
