"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

const styles=`
.wlkr-theme-toggle[data-slot=toggle]{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:0;box-shadow:none;background:transparent;color:inherit;cursor:pointer}
.wlkr-theme-toggle:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:5px}
.wlkr-theme-toggle svg{width:17px;height:17px}
.wlkr-theme-sun{display:none}.dark .wlkr-theme-sun{display:block}.dark .wlkr-theme-moon{display:none}
`
/** A basic shadcn Toggle. Follows the system until an explicit light/dark selection is stored. */
export function ThemeToggle({showLabel=false,className,storageKey="wlkr-theme"}:{showLabel?:boolean;className?:string;storageKey?:string}) {
  const preferenceRef=React.useRef<string|null>(null)
  const [dark,setDark]=React.useState<boolean|null>(null)
  React.useEffect(()=>{
    const preference=window.matchMedia("(prefers-color-scheme: dark)")
    function sync(){let selected:string|null=preferenceRef.current;try{selected=localStorage.getItem(storageKey)}catch{/* In-memory preference still works when storage is unavailable. */}const next=selected==="dark"||selected!=="light"&&preference.matches;document.documentElement.classList.toggle("dark",next);document.documentElement.style.colorScheme=next?"dark":"light";setDark(next)}
    function storage(event:StorageEvent){if(event.key===storageKey||event.key===null)sync()}
    function shared(event:Event){const detail=(event as CustomEvent<{key:string;value:string}>).detail;if(detail?.key===storageKey){preferenceRef.current=detail.value;sync()}}
    sync();window.addEventListener("wlkr-theme-change",shared);preference.addEventListener("change",sync);window.addEventListener("storage",storage)
    return()=>{window.removeEventListener("wlkr-theme-change",shared);preference.removeEventListener("change",sync);window.removeEventListener("storage",storage)}
  },[storageKey])
  function toggle(next:boolean){document.documentElement.classList.toggle("dark",next);document.documentElement.style.colorScheme=next?"dark":"light";setDark(next);preferenceRef.current=next?"dark":"light";try{localStorage.setItem(storageKey,next?"dark":"light")}catch{/* The selected theme remains available in memory. */}window.dispatchEvent(new CustomEvent("wlkr-theme-change",{detail:{key:storageKey,value:next?"dark":"light"}}))}
  return <><style>{styles}</style><Toggle className={cn("wlkr-theme-toggle",className)} pressed={dark??false} onPressedChange={toggle} aria-label={dark===null?"Toggle color theme":dark?"Switch to light mode":"Switch to dark mode"}><Sun className="wlkr-theme-sun" aria-hidden="true"/><Moon className="wlkr-theme-moon" aria-hidden="true"/>{showLabel&&<span>{dark===null?"Theme":dark?"Dark mode":"Light mode"}</span>}</Toggle></>
}
