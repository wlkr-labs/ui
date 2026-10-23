"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PixelPoint = { x: number; y: number; z?: number }
export type PixelPattern = "steady" | "scatter" | "wave" | "scan"
export type PixelObjectProps = {
  points?: PixelPoint[]; mask?: string[]; resolution?: number; size?: number
  label?: string; rotating?: boolean; className?: string
  dotShape?: "square" | "rounded" | "circle"
  /** Nominal SVG pixels. Setting either dotSize or gap derives density from their pitch, overriding resolution. */
  dotSize?: number; gap?: number
  /** Radians per second. Flicker timing is independent of rotation. */
  rotationSpeed?: number
  flickerAmount?: number; flickerSpeed?: number; pattern?: PixelPattern
  /** Milliseconds before motion starts; stagger spreads the pattern phase across the object. */
  delay?: number; stagger?: number
  seed?: number | string; randomness?: number; opacity?: number
  /** Change this value to restart the timeline without remounting the object. */
  restartKey?: number | string
}
const clamp = (value: number, min: number, max: number, fallback: number) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback))
export function spherePoints(count = 420): PixelPoint[] {
  const total = Math.round(clamp(count, 12, 2000, 420))
  return Array.from({ length: total }, (_, index) => {
    const y = 1 - (index / (total - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = index * Math.PI * (3 - Math.sqrt(5))
    return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius }
  })
}
const sphere = spherePoints()
const styles = `
.wlkr-pixel-object{display:flex;flex-direction:column;align-items:center;gap:12px;max-width:100%}
.wlkr-pixel-object>svg{display:block;width:100%;height:auto;overflow:visible}
.wlkr-pixel-toggle{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:44px;min-height:44px;padding:0 12px;cursor:pointer}
.wlkr-pixel-toggle svg{width:14px;height:14px}
.wlkr-pixel-toggle:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:4px}
`
function seedNumber(seed: string | number) {
  let result = 2166136261
  for (const character of String(seed)) result = Math.imul(result ^ character.charCodeAt(0), 16777619)
  return result >>> 0
}
function noise(x: number, y: number, seed: number) {
  let value = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ seed
  value = Math.imul(value ^ value >>> 13, 1274126177)
  return ((value ^ value >>> 16) >>> 0) / 4294967295
}

/** Native SVG projection; seeded smooth patterns; no work while paused, hidden, off-screen or reduced-motion. */
export function PixelObject({ points, mask, resolution = 36, size = 260, label = "Rotating pixel sphere", rotating = true, className, dotShape = "rounded", dotSize, gap, rotationSpeed = .15, flickerAmount = 0, flickerSpeed = .5, pattern = "steady", delay = 0, stagger = 0, seed = 1, randomness = 1, opacity = 1, restartKey = 0 }: PixelObjectProps) {
  const root = React.useRef<HTMLDivElement>(null)
  const timeline = React.useRef({ time:0, angle:0, key:restartKey })
  const [frame, setFrame] = React.useState({time:0, angle:0})
  const [paused, setPaused] = React.useState(false)
  const [motion, setMotion] = React.useState(false)
  const dimension = clamp(size,64,1000,260)
  const legacyGrid = Math.round(clamp(resolution,8,80,36))
  const explicitPitch = dotSize !== undefined || gap !== undefined
  const dot = explicitPitch ? clamp(dotSize ?? dimension / legacyGrid * .72,.5,40,4) : .72
  const spacing = explicitPitch ? clamp(gap ?? dimension / legacyGrid * .28,0,40,2) : .28
  const pitch = explicitPitch ? dot + spacing : 1
  const extent = explicitPitch ? dimension : legacyGrid
  const grid = explicitPitch ? Math.max(1,Math.floor((extent + spacing) / pitch)) : legacyGrid
  const inset = explicitPitch ? (extent - (grid - 1) * pitch - dot) / 2 : 0
  const speed = clamp(rotationSpeed,0,3,.15)
  const strength = clamp(flickerAmount,0,1,0)
  const frequency = clamp(flickerSpeed,0,2,.5)
  const startDelay = clamp(delay,0,30000,0)
  const spread = clamp(stagger,0,10000,0)
  const random = clamp(randomness,0,1,1)
  const alpha = clamp(opacity,0,1,1)
  const seedValue = seedNumber(seed)
  const shape = ["square","rounded","circle"].includes(dotShape) ? dotShape : "rounded"
  const effect = ["steady","scatter","wave","scan"].includes(pattern) ? pattern : "steady"
  const animated = rotating && speed > 0 || strength > 0 && frequency > 0 && effect !== "steady"
  const cloud = React.useMemo(() => {
    if (mask) {
      const rows = mask.slice(0,80)
      const width = Math.max(1,...rows.map(row => row.slice(0,80).length))
      return rows.flatMap((row,y) => [...row.slice(0,80)].flatMap((pixel,x) => pixel === "#" ? [{x:width === 1 ? 0 : x/(width-1)*2-1,y:rows.length === 1 ? 0 : 1-y/(rows.length-1)*2,z:0}] : []))
    }
    return (points ?? sphere).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z ?? 0)).slice(0,2000)
  },[points,mask])
  React.useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let intersecting = false
    let request = 0
    let last = 0
    let drawn = 0
    function resetTimeline() { timeline.current = {time:0,angle:0,key:restartKey}; setPaused(false) }
    if (timeline.current.key !== restartKey) resetTimeline()
    function stop() { if(request) cancelAnimationFrame(request); request=0; last=0 }
    function tick(time:number) {
      const elapsed = last ? Math.min(time-last,80) : 0
      last=time
      const before = Math.max(0,timeline.current.time-startDelay)
      timeline.current.time += elapsed
      const after = Math.max(0,timeline.current.time-startDelay)
      if(rotating) timeline.current.angle += (after-before)/1000*speed
      if(time-drawn>=80) { setFrame({time:timeline.current.time,angle:timeline.current.angle}); drawn=time }
      request=requestAnimationFrame(tick)
    }
    function sync() {
      const active = animated && !paused && !preference.matches && intersecting && !document.hidden
      setMotion(active)
      if(active && !request) request=requestAnimationFrame(tick)
      if(!active) { stop(); setFrame({time:timeline.current.time,angle:timeline.current.angle}) }
    }
    const observer = new IntersectionObserver(entries => {intersecting=entries[0]?.isIntersecting??false;sync()},{threshold:.05})
    if(root.current) observer.observe(root.current)
    preference.addEventListener("change",sync)
    document.addEventListener("visibilitychange",sync)
    sync()
    return () => {stop();observer.disconnect();preference.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync)}
  },[animated,paused,rotating,speed,startDelay,restartKey])
  const pixels = new Map<string,{x:number;y:number;depth:number}>()
  const cosine=Math.cos(frame.angle), sine=Math.sin(frame.angle)
  for(const point of cloud) {
    const z=point.z??0
    const x=point.x*cosine+z*sine
    const depth=-point.x*sine+z*cosine
    const column=Math.round((x*.43+.5)*(grid-1)), row=Math.round((-point.y*.43+.5)*(grid-1))
    if(column<0||column>=grid||row<0||row>=grid) continue
    const key=`${column},${row}`
    if(!pixels.has(key)||pixels.get(key)!.depth<depth) pixels.set(key,{x:column,y:row,depth})
  }
  function intensity(x:number,y:number) {
    if(!strength||effect==="steady") return 1
    const elapsed=frame.time-startDelay-spread*(x+y)/Math.max(1,2*(grid-1))
    if(elapsed<=0) return 1
    const ramp=Math.min(1,elapsed/500)
    const phase=elapsed/1000*frequency*2*Math.PI
    const offset=noise(x,y,seedValue)*Math.PI*2*random
    const wave=effect==="scatter" ? Math.sin(phase+offset) : effect==="wave" ? Math.sin(phase-(x+y)*.3-offset*.2) : Math.cos(phase-y/Math.max(1,grid-1)*Math.PI*2)
    return 1-strength*ramp*(.65*(1-(wave+1)/2))
  }
  return <div ref={root} className={cn("wlkr-pixel-object",className)} style={{width:dimension}} data-motion={motion?"running":"paused"} data-pattern={effect}>
    <style>{styles}</style>
    <svg viewBox={`0 0 ${extent} ${extent}`} role="img" aria-label={label}>
      {[...pixels.entries()].map(([key,pixel]) => <rect key={key} x={inset+pixel.x*pitch} y={inset+pixel.y*pitch} width={dot} height={dot} rx={shape==="circle"?dot/2:shape==="rounded"?dot/12:0} fill="currentColor" opacity={alpha*(.22+Math.max(0,Math.min(1,(pixel.depth+1)/2))*.73)*intensity(pixel.x,pixel.y)} />)}
    </svg>
    {animated&&<Button type="button" className="wlkr-pixel-toggle" variant="ghost" aria-label={paused?"Resume object motion":"Pause object motion"} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play aria-hidden="true"/>:<Pause aria-hidden="true"/>}<span>{paused?"Resume":"Pause"}</span></Button>}
    <span role="status" className="sr-only">{motion?"Object motion active.":"Object is still."}</span>
  </div>
}
