"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const styles=`
.wlkr-page-intro{display:flex;flex-direction:column;gap:28px}
:where(.wlkr-page-intro-title){font-family:var(--font-sans,var(--font-geist-sans,Geist,Arial,Helvetica,sans-serif));font-size:clamp(64px,8.3vw,124px);line-height:.96;font-weight:620;letter-spacing:-.078em;white-space:pre-wrap;margin:0}
.wlkr-page-intro-copy{max-width:34rem;font-size:16px;line-height:1.6;color:var(--muted-foreground,#696969);margin:0}
.wlkr-intro-word{position:relative;display:inline-block;white-space:nowrap}
.wlkr-intro-real{display:inline-block}
.wlkr-intro-bit{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-around;font-family:monospace;font-size:.64em;letter-spacing:0;line-height:1;pointer-events:none}
.wlkr-intro-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
@media(max-width:620px){:where(.wlkr-page-intro-title){font-size:68px}.wlkr-page-intro-copy{font-size:15px}}
@media(prefers-reduced-motion:reduce){.wlkr-intro-bit{display:none}.wlkr-intro-real{visibility:visible!important;clip-path:none!important}}
`
/** Final text is present in SSR and accessibility APIs; binary glyphs occupy the final glyph's exact width. */
export function PageIntro({title,description,as="h1",className,titleClassName,reveal=true,duration=1100}:{title:string;description?:React.ReactNode;as?:"h1"|"h2";className?:string;titleClassName?:string;reveal?:boolean;duration?:number}) {
  const root=React.useRef<HTMLElement>(null)
  const [frame,setFrame]=React.useState({active:false,progress:1,tick:0})
  const timing=Math.max(400,Math.min(3000,Number.isFinite(duration)?duration:1100))
  React.useEffect(()=>{
    function reset(){setFrame({active:false,progress:1,tick:0})}
    if(!reveal){reset();return}
    const preference=window.matchMedia("(prefers-reduced-motion: reduce)")
    let request=0, started=0, drawn=0, played=false
    function finish(){if(request)cancelAnimationFrame(request);request=0;setFrame({active:false,progress:1,tick:0})}
    function tick(time:number){if(!started)started=time;const elapsed=time-started;if(elapsed>=timing){finish();return}if(time-drawn>=50){setFrame({active:true,progress:elapsed/timing,tick:Math.floor(elapsed/250)});drawn=time}request=requestAnimationFrame(tick)}
    const observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting&&!played&&!preference.matches){played=true;request=requestAnimationFrame(tick);observer.disconnect()}},{threshold:.15})
    if(root.current)observer.observe(root.current)
    function stopForPreference(){if(preference.matches||document.hidden)finish()}
    preference.addEventListener("change",stopForPreference)
    document.addEventListener("visibilitychange",stopForPreference)
    return()=>{if(request)cancelAnimationFrame(request);observer.disconnect();preference.removeEventListener("change",stopForPreference);document.removeEventListener("visibilitychange",stopForPreference)}
  },[title,reveal,timing])
  const Heading=as
  const words=React.useMemo(()=>{const chunks=title.split(/(\s+)/);return chunks.map((word,index)=>({word,position:[...chunks.slice(0,index).join("")].filter(character=>! /\s/.test(character)).length}))},[title])
  const length=[...title].filter(character=>! /\s/.test(character)).length
  const decoded=frame.progress*length
  return <header ref={root} className={cn("wlkr-page-intro",className)}><style>{styles}</style><Heading className={cn("wlkr-page-intro-title",titleClassName)}><span className="wlkr-intro-sr">{title}</span><span aria-hidden="true">{words.map(({word,position},wordIndex)=>{
    if(/\s/.test(word))return word
    const progress=frame.active?Math.max(0,Math.min(1,(decoded-position)/[...word].length)):1
    return <span className="wlkr-intro-word" key={wordIndex}><span className="wlkr-intro-real" style={progress<1?{clipPath:`inset(0 ${(1-progress)*100}% 0 0)`}:undefined}>{word}</span>{progress<1&&<span className="wlkr-intro-bit" style={{clipPath:`inset(0 0 0 ${progress*100}%)`}}>{[...word].map((_,characterIndex)=><span key={characterIndex}>{(position+characterIndex+frame.tick)%2}</span>)}</span>}</span>
  })}</span></Heading>{description&&<div className="wlkr-page-intro-copy">{description}</div>}</header>
}
