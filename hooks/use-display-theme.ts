"use client"

import * as React from "react"

export type DisplayTheme = "system" | "light" | "dark"
const eventName="wlkr-theme-change"

/** One persisted preference shared by basic and footer controls; no provider or runtime package. */
export function useDisplayTheme(storageKey="wlkr-theme") {
  const memory=React.useRef<{value:DisplayTheme;override:boolean;key:string}>({value:"system",override:false,key:storageKey})
  const [state,setState]=React.useState<{mode:DisplayTheme;dark:boolean|null}>({mode:"system",dark:null})
  React.useEffect(()=>{
    if(memory.current.key!==storageKey)memory.current={value:"system",override:false,key:storageKey}
    const preference=window.matchMedia("(prefers-color-scheme: dark)")
    function sync(){
      let selected:string|null=memory.current.value
      if(!memory.current.override)try{selected=localStorage.getItem(storageKey)}catch{/* In-memory selection works when browser storage is blocked. */}
      const mode:DisplayTheme=selected==="light"||selected==="dark"?selected:"system"
      const dark=mode==="dark"||mode==="system"&&preference.matches
      document.documentElement.classList.toggle("dark",dark)
      document.documentElement.style.colorScheme=dark?"dark":"light"
      setState({mode,dark})
    }
    function storage(event:StorageEvent){if(event.key===storageKey||event.key===null){const value=event.newValue;memory.current={value:value==="dark"||value==="light"?value:"system",override:true,key:storageKey};sync()}}
    function shared(event:Event){const detail=(event as CustomEvent<{key:string;value:DisplayTheme}>).detail;if(detail?.key===storageKey){memory.current={value:detail.value,override:true,key:storageKey};sync()}}
    sync();window.addEventListener(eventName,shared);window.addEventListener("storage",storage);preference.addEventListener("change",sync)
    return()=>{window.removeEventListener(eventName,shared);window.removeEventListener("storage",storage);preference.removeEventListener("change",sync)}
  },[storageKey])
  function setMode(mode:DisplayTheme){
    memory.current={value:mode,override:true,key:storageKey}
    try{if(mode==="system")localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,mode)}catch{/* Keep the current selection in memory without requiring browser storage. */}
    const dark=mode==="dark"||mode==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.classList.toggle("dark",dark);document.documentElement.style.colorScheme=dark?"dark":"light";setState({mode,dark})
    window.dispatchEvent(new CustomEvent(eventName,{detail:{key:storageKey,value:mode}}))
  }
  return {...state,setMode}
}
