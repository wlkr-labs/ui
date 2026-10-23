"use client"

import { Moon, Sun } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { useDisplayTheme } from "@/hooks/use-display-theme"

const styles=`
.wlkr-theme-toggle[data-slot=toggle]{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:0;box-shadow:none;background:transparent;color:inherit;cursor:pointer}
.wlkr-theme-toggle:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:5px}
.wlkr-theme-toggle svg{width:17px;height:17px}
.wlkr-theme-sun{display:none}.dark .wlkr-theme-sun{display:block}.dark .wlkr-theme-moon{display:none}
`
/** A basic shadcn Toggle. Follows the system until an explicit light/dark selection is stored. */
export function ThemeToggle({showLabel=false,className,storageKey="wlkr-theme"}:{showLabel?:boolean;className?:string;storageKey?:string}) {
  const {dark,setMode}=useDisplayTheme(storageKey)
  return <><style>{styles}</style><Toggle className={cn("wlkr-theme-toggle",className)} pressed={dark??false} onPressedChange={next=>setMode(next?"dark":"light")} aria-label={dark===null?"Toggle color theme":dark?"Switch to light mode":"Switch to dark mode"}><Sun className="wlkr-theme-sun" aria-hidden="true"/><Moon className="wlkr-theme-moon" aria-hidden="true"/>{showLabel&&<span>{dark===null?"Theme":dark?"Dark mode":"Light mode"}</span>}</Toggle></>
}
