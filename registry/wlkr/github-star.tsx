"use client"



import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

/* Embedded GitHub outline from Lucide v0.487.0.
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

export type GithubStarProps = {
  /** A public repository, in owner/name form. The app supplies its actual count. */
  repository: string
  count: number | null
  /** Count and star-fill duration in milliseconds. */
  duration?: number
  label?: string
  className?: string
}
const styles = `
.wlkr-github-star{display:inline-flex;position:relative;align-items:center;gap:6px;min-height:32px;color:inherit;text-decoration:none;font-size:13px;line-height:1;white-space:nowrap;isolation:isolate}
.wlkr-github-star:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:5px;border-radius:2px}
.wlkr-github-logo{width:18px;height:18px;flex:none}.wlkr-github-counter{display:inline-grid;font-variant-numeric:tabular-nums;font-feature-settings:"tnum";letter-spacing:0}
.wlkr-github-counter>span{grid-area:1/1;justify-self:end}.wlkr-github-reserve{visibility:hidden}.wlkr-github-digits{display:flex;height:1em;overflow:hidden}.wlkr-github-digit{display:block;width:1ch;height:1em;overflow:hidden}.wlkr-github-strip{display:block;transform:translateY(calc(var(--digit)*-1em))}.wlkr-github-strip>span{display:block;height:1em;line-height:1em}
.wlkr-github-symbol{position:relative;display:block;width:16px;height:16px;flex:none}.wlkr-github-symbol>svg{position:absolute;inset:0;width:16px;height:16px}.wlkr-github-base{color:var(--muted-foreground,#696969)}.wlkr-github-fill{color:var(--brand,#33f282);fill:currentColor;clip-path:inset(0 0 0 0)}
.wlkr-github-burst{position:absolute;inset:0;pointer-events:none;overflow:visible}.wlkr-github-particle{position:absolute;left:6px;top:6px;width:4px;height:4px;border-radius:50%;background:var(--brand,#33f282);opacity:0}.wlkr-github-glint{width:7px;height:7px;left:4.5px;top:4.5px;border-radius:0;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
@keyframes wlkr-github-fill{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes wlkr-github-roll{from{transform:translateY(0)}to{transform:translateY(calc(var(--digit)*-1em - 20em))}}
@keyframes wlkr-github-burst{0%{opacity:0;transform:translate(0,0) scale(.4)}12%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.15)}}
@media(prefers-reduced-motion:no-preference){.wlkr-github-running .wlkr-github-fill{animation:wlkr-github-fill var(--duration) cubic-bezier(.2,.65,.2,1) both}.wlkr-github-running .wlkr-github-strip{animation:wlkr-github-roll var(--duration) cubic-bezier(.15,.7,.15,1) both}.wlkr-github-running .wlkr-github-particle{animation:wlkr-github-burst 620ms cubic-bezier(.15,.6,.3,1) var(--duration) both}}
`
const format = (value:number) => String(Math.min(999999999,Math.max(0,Math.floor(value))))

/** A repository link, never a substitute for GitHub's authenticated Star action. */
export function GithubStar({ repository, count, duration=1200, label, className }:GithubStarProps) {
  const anchor=React.useRef<HTMLAnchorElement>(null)
  const [run,setRun]=React.useState(0)
  const enabled=React.useRef(false)
  const numeric=typeof count==="number"&&Number.isFinite(count)?Number(format(count)):null
  const digits=numeric===null?null:format(numeric)
  const milliseconds=Number.isFinite(duration)?Math.max(250,Math.min(5000,duration)):1200
  const path=repository.split("/").slice(0,2).map(encodeURIComponent).join("/")
  const replay=()=>{if(enabled.current&&numeric!==null)setRun(value=>value+1)}
  React.useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)")
    const update=()=>{enabled.current=!media.matches;if(media.matches)setRun(0)}
    update();media.addEventListener("change",update)
    const element=anchor.current
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){if(enabled.current&&numeric!==null)setRun(value=>value+1);observer.disconnect()}},{threshold:.5})
    if(element)observer.observe(element)
    return()=>{observer.disconnect();media.removeEventListener("change",update)}
  },[numeric])
  return <a ref={anchor} href={`https://github.com/${path}`} target="_blank" rel="noopener noreferrer" className={cn("wlkr-github-star",className)} aria-label={label??(numeric===null?`View ${repository} on GitHub`:`View ${repository} on GitHub, ${digits} stars`)} onPointerEnter={replay} onFocus={replay}>
    <style>{styles}</style>{/* GitHub outline: Lucide v0.487.0, ISC. Embedded for compatibility with brand-free Lucide releases. */}<svg className="wlkr-github-logo" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
    {digits===null?<span>GitHub</span>:<React.Fragment key={`${numeric}-${run}`}><span className={cn("wlkr-github-counter",run>0&&"wlkr-github-running")} aria-hidden="true" style={{"--duration":`${milliseconds}ms`} as React.CSSProperties}><span className="wlkr-github-reserve">{digits}</span><span className="wlkr-github-digits">{[...digits].map((digit,index)=><span className="wlkr-github-digit" key={index}><span className="wlkr-github-strip" style={{"--digit":Number(digit)} as React.CSSProperties}>{Array.from({length:30},(_,i)=><span key={i}>{i%10}</span>)}</span></span>)}</span></span><span aria-hidden="true" className={cn("wlkr-github-symbol",run>0&&"wlkr-github-running")} style={{"--duration":`${milliseconds}ms`} as React.CSSProperties}><Star className="wlkr-github-base"/><Star className="wlkr-github-fill"/><span className="wlkr-github-burst">{Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6;const distance=i%3===0?32:25;return <i className={cn("wlkr-github-particle",i%3===0&&"wlkr-github-glint")} key={i} style={{"--x":`${Math.cos(angle)*distance}px`,"--y":`${Math.sin(angle)*distance}px`} as React.CSSProperties}/>})}</span></span></React.Fragment>}
  </a>
}
