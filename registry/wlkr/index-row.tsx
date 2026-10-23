"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const styles=`
.wlkr-index-row{display:grid;grid-template-columns:3ch minmax(0,1fr) auto;align-items:center;gap:28px;min-height:80px;padding:20px 0;color:inherit;text-decoration:none}
.wlkr-index-number{display:inline-flex;width:3ch;font-size:12px;line-height:1em;font-variant-numeric:tabular-nums;color:var(--muted-foreground,#696969)}
.wlkr-index-wheel{height:1em;width:1ch;overflow:hidden;display:block}
.wlkr-index-strip{display:block;transform:translateY(calc(var(--wlkr-digit)*-1em))}
.wlkr-index-strip>span{display:block;height:1em;line-height:1em}
.wlkr-index-title{display:block;font-size:24px;line-height:1.2;font-weight:500;letter-spacing:-.8px}
.wlkr-index-description{display:block;margin-top:7px;font-size:14px;line-height:1.6;color:var(--muted-foreground,#696969)}
.wlkr-index-meta{display:flex;align-items:center;gap:16px;color:var(--muted-foreground,#696969);font-size:12px}
.wlkr-index-meta>svg{width:16px;height:16px}
.wlkr-index-row:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:6px}
.wlkr-index-row:is(:hover,:focus-visible) .wlkr-index-title{color:var(--muted-foreground,#696969)}
.wlkr-index-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@keyframes wlkr-index-roll{from{transform:translateY(calc(var(--wlkr-digit)*-1em))}to{transform:translateY(calc(var(--wlkr-digit)*-1em - 20em))}}
@media(prefers-reduced-motion:no-preference){.wlkr-index-row:is(:hover,:focus-visible) .wlkr-index-strip{animation:wlkr-index-roll 750ms cubic-bezier(.22,.7,.2,1);animation-delay:var(--wlkr-roll-delay)}.wlkr-index-title{transition:color 130ms ease}}
@media(max-width:620px){.wlkr-index-row{gap:18px}.wlkr-index-title{font-size:21px}.wlkr-index-meta{gap:8px}}
`
export function IndexRow({number,title,description,href,children,className,...props}:Omit<React.ComponentProps<"a">,"title"|"children">&{number:number|string;title:string;description?:string;children?:React.ReactNode}) {
  const digits=String(typeof number==="number"&&Number.isFinite(number)?Math.max(0,Math.min(999,Math.floor(number))):number).replace(/\D/g,"").slice(-3).padStart(3,"0")
  return <a {...props} href={href} className={cn("wlkr-index-row",className)}><style>{styles}</style><span className="wlkr-index-sr">{digits} </span><span className="wlkr-index-number" aria-hidden="true">{[...digits].map((digit,index)=><span className="wlkr-index-wheel" key={index}><span className="wlkr-index-strip" style={{"--wlkr-digit":Number(digit),"--wlkr-roll-delay":`${index*45}ms`} as React.CSSProperties}>{Array.from({length:30},(_,position)=><span key={position}>{position%10}</span>)}</span></span>)}</span><span><span className="wlkr-index-title">{title}</span>{description&&<span className="wlkr-index-description">{description}</span>}</span><span className="wlkr-index-meta">{children}<ArrowUpRight aria-hidden="true"/></span></a>
}
