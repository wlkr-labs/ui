"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type WlkrLoaderProps = {
  variant?: "bars" | "dots"
  size?: number
  /** Milliseconds per beat, clamped to 800–10000. */
  duration?: number
  /** Milliseconds between the six cells, clamped to 0–2000. */
  stagger?: number
  label?: string
  decorative?: boolean
  paused?: boolean
  className?: string
}
const clamp=(value:number,min:number,max:number,fallback:number)=>Math.max(min,Math.min(max,Number.isFinite(value)?value:fallback))
// Exact six rectangles from the approved WLKR mark, in its original coordinate system.
const cells = [
  {x:545,y:10.5,width:242.5,height:242.5,green:true},
  {x:277.5,y:279,width:243.5,height:243},
  {x:545,y:279,width:242.5,height:243},
  {x:10,y:548.5,width:243.5,height:243},
  {x:277.5,y:548.5,width:243.5,height:243},
  {x:545,y:548.5,width:242.5,height:243},
]
const styles=`
.wlkr-loader{display:inline-flex;position:relative;flex-shrink:0;vertical-align:middle;line-height:0}
.wlkr-loader>svg{display:block;width:100%;height:100%;overflow:hidden}
.wlkr-loader-cell{transform-box:fill-box;transform-origin:center bottom;animation-duration:var(--wlkr-duration);animation-delay:var(--wlkr-delay);animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-play-state:paused}
.wlkr-loader[data-motion=running] .wlkr-loader-cell{animation-play-state:running}
.wlkr-loader[data-variant=bars] .wlkr-loader-cell{animation-name:wlkr-loader-bars}
.wlkr-loader[data-variant=dots] .wlkr-loader-cell{animation-name:wlkr-loader-dots;transform-origin:center}
@keyframes wlkr-loader-bars{0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(.62);opacity:.65}}
@keyframes wlkr-loader-dots{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.76);opacity:.55}}
@media(prefers-reduced-motion:reduce){.wlkr-loader .wlkr-loader-cell{animation:none;transform:none;opacity:1}}
`

/** A single loading announcement, with motion applied to the original WLKR mark. */
export function WlkrLoader({variant="bars",size=48,duration=1800,stagger=120,label="Loading",decorative=false,paused=false,className}:WlkrLoaderProps) {
  const root=React.useRef<HTMLSpanElement>(null)
  const [motion,setMotion]=React.useState(false)
  const dimension=clamp(size,16,240,48)
  const beat=clamp(duration,800,10000,1800)
  const offset=clamp(stagger,0,2000,120)
  const mode=variant==="dots"?"dots":"bars"
  React.useEffect(()=>{
    const preference=window.matchMedia("(prefers-reduced-motion: reduce)")
    let intersecting=false
    function sync(){setMotion(!paused&&!preference.matches&&intersecting&&!document.hidden)}
    const observer=new IntersectionObserver(entries=>{intersecting=entries[0]?.isIntersecting??false;sync()},{threshold:.05})
    if(root.current)observer.observe(root.current)
    preference.addEventListener("change",sync)
    document.addEventListener("visibilitychange",sync)
    sync()
    return()=>{observer.disconnect();preference.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync)}
  },[paused])
  return <span ref={root} className={cn("wlkr-loader",className)} style={{width:dimension,height:dimension}} role={decorative?undefined:"status"} aria-hidden={decorative?true:undefined} data-motion={motion?"running":"paused"} data-variant={mode}>
    <style>{styles}</style>
    <svg viewBox="0 0 904 904" aria-hidden="true" focusable="false"><g transform="translate(0 0) scale(1)"><g transform="translate(53.25 51)">
      {cells.map((cell,index)=><rect key={index} className="wlkr-loader-cell" x={cell.x} y={cell.y} width={cell.width} height={cell.height} rx="33" fill={cell.green?"var(--brand, #33F282)":"currentColor"} style={{"--wlkr-duration":`${beat}ms`,"--wlkr-delay":`${index*offset}ms`} as React.CSSProperties}/>)}
    </g></g></svg>
    {!decorative&&<span style={{position:"absolute",width:1,height:1,padding:0,margin:-1,overflow:"hidden",clipPath:"inset(50%)",whiteSpace:"nowrap",border:0}}>{label}</span>}
  </span>
}
