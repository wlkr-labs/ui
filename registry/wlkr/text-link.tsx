"use client"

import * as React from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

export type TextLinkPreview={title:string;description?:string;image?:string;imageAlt?:string}
const styles=`
.wlkr-text-link{color:inherit;text-decoration:underline;text-decoration-color:var(--muted-foreground,#696969);text-underline-offset:4px;transition:text-decoration-color 130ms ease}
.wlkr-text-link:hover{text-decoration-color:currentColor}
.wlkr-text-link:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:5px}
.wlkr-link-preview[data-slot=hover-card-content]{width:280px;max-width:calc(100vw - 32px);padding:18px;border:0;border-radius:0;box-shadow:none;background:var(--popover,#fff);color:var(--popover-foreground,#010101);font-size:14px;line-height:1.65}
.wlkr-link-preview-title{font-size:15px;font-weight:550;letter-spacing:-.3px}
.wlkr-link-preview-copy{margin-top:6px;color:var(--muted-foreground,#696969)}
.wlkr-link-preview-image{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;margin-bottom:12px}
@media(prefers-reduced-motion:reduce){.wlkr-text-link{transition:none}.wlkr-link-preview{animation:none!important}}
`
/** Optional nonessential preview opens on hover and keyboard focus. The anchor always navigates normally. */
export function TextLink({preview,children,className,onFocus,onBlur,onKeyDown,...props}:React.ComponentProps<"a">&{preview?:TextLinkPreview}) {
  const [open,setOpen]=React.useState(false)
  const id=React.useId()
  const link=<a {...props} className={cn("wlkr-text-link",className)} aria-describedby={open&&preview?id:props["aria-describedby"]} onFocus={event=>{onFocus?.(event);if(!event.defaultPrevented)setOpen(true)}} onBlur={event=>{onBlur?.(event);setOpen(false)}} onKeyDown={event=>{onKeyDown?.(event);if(event.key==="Escape")setOpen(false)}}>{children}</a>
  return <><style>{styles}</style>{preview?<HoverCard open={open} onOpenChange={setOpen} openDelay={180} closeDelay={100}><HoverCardTrigger asChild>{link}</HoverCardTrigger><HoverCardContent id={id} className="wlkr-link-preview" sideOffset={12} align="start">{preview.image&&<img className="wlkr-link-preview-image" src={preview.image} alt={preview.imageAlt??""} loading="lazy"/>}<p className="wlkr-link-preview-title">{preview.title}</p>{preview.description&&<p className="wlkr-link-preview-copy">{preview.description}</p>}</HoverCardContent></HoverCard>:link}</>
}
