"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PixelPoint = { x: number; y: number; z?: number }

/** A sphere point cloud; pass your own points or a #/space mask to display an object. */
export function spherePoints(count = 420): PixelPoint[] {
  const total = Math.max(12, Math.min(2000, Math.round(count)))
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
.wlkr-pixel-object svg{display:block;width:100%;height:auto;max-width:320px;overflow:visible}
.wlkr-pixel-toggle{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:44px;min-height:44px;padding:0 12px;cursor:pointer}
.wlkr-pixel-toggle svg{width:14px;height:14px}
.wlkr-pixel-toggle:focus-visible{outline:2px solid var(--ring,currentColor);outline-offset:4px}
.wlkr-pixel-note{font-size:12px;color:var(--muted-foreground,#696969)}
`

/**
 * A projected pixel object, not a video or canvas. Coordinates are normalized to [-1, 1].
 * A mask uses # for filled pixels and spaces/dots for empty pixels; rows need not be equal.
 * Motion pauses off-screen, in hidden tabs, on user pause, and for reduced motion.
 */
export function PixelObject({ points, mask, resolution = 36, size = 260, label = "Rotating pixel sphere", rotating = true, className }: {
  points?: PixelPoint[]
  mask?: string[]
  resolution?: number
  size?: number
  label?: string
  rotating?: boolean
  className?: string
}) {
  const root = React.useRef<HTMLDivElement>(null)
  const angle = React.useRef(0)
  const [rotation, setRotation] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [motion, setMotion] = React.useState(false)
  const grid = Math.max(8, Math.min(80, Math.round(Number.isFinite(resolution) ? resolution : 36)))
  const dimension = Math.max(64, Math.min(1000, Number.isFinite(size) ? size : 260))
  const cloud = React.useMemo(() => {
    if (mask) {
      const rows = mask.slice(0, 80)
      const width = Math.max(1, ...rows.map(row => row.slice(0, 80).length))
      return rows.flatMap((row, y) => [...row.slice(0, 80)].flatMap((pixel, x) => pixel === "#" ? [{ x: width === 1 ? 0 : (x / (width - 1)) * 2 - 1, y: rows.length === 1 ? 0 : 1 - (y / (rows.length - 1)) * 2, z: 0 }] : []))
    }
    return (points ?? sphere).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z ?? 0)).slice(0, 2000)
  }, [points, mask])

  React.useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let intersecting = false
    let frame = 0
    let last = 0
    let drawn = 0
    function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0 }
    function tick(time: number) {
      const elapsed = last ? Math.min(time - last, 80) : 0
      last = time
      angle.current += elapsed * .00015
      // Slow rotation sampled at 12 fps keeps the discrete pixels deliberate.
      if (time - drawn >= 80) { setRotation(angle.current); drawn = time }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      const active = rotating && !paused && !preference.matches && intersecting && !document.hidden
      setMotion(active)
      if (active && !frame) frame = requestAnimationFrame(tick)
      if (!active) stop()
    }
    const observer = new IntersectionObserver(entries => { intersecting = entries[0]?.isIntersecting ?? false; sync() }, { threshold: .05 })
    if (root.current) observer.observe(root.current)
    preference.addEventListener("change", sync)
    document.addEventListener("visibilitychange", sync)
    sync()
    return () => { stop(); observer.disconnect(); preference.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync) }
  }, [rotating, paused])

  const pixels = new Map<string, { x: number; y: number; opacity: number }>()
  const cosine = Math.cos(rotation)
  const sine = Math.sin(rotation)
  for (const point of cloud) {
    const z = point.z ?? 0
    const x = point.x * cosine + z * sine
    const depth = -point.x * sine + z * cosine
    const column = Math.round((x * .43 + .5) * (grid - 1))
    const row = Math.round((-point.y * .43 + .5) * (grid - 1))
    if (column < 0 || column >= grid || row < 0 || row >= grid) continue
    const opacity = .22 + Math.max(0, Math.min(1, (depth + 1) / 2)) * .73
    const key = `${column},${row}`
    if (!pixels.has(key) || pixels.get(key)!.opacity < opacity) pixels.set(key, {x:column,y:row,opacity})
  }
  return <div ref={root} className={cn("wlkr-pixel-object", className)} style={{width:dimension}} data-motion={motion ? "running" : "paused"}>
    <style>{styles}</style>
    <svg viewBox={`0 0 ${grid} ${grid}`} role="img" aria-label={label}>
      {[...pixels.entries()].map(([key, pixel]) => <rect key={key} x={pixel.x} y={pixel.y} width=".72" height=".72" rx=".06" fill="currentColor" opacity={pixel.opacity} />)}
    </svg>
    {rotating && <Button type="button" className="wlkr-pixel-toggle" variant="ghost" aria-label={paused ? "Resume object rotation" : "Pause object rotation"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}<span>{paused ? "Resume" : "Pause"}</span></Button>}
    <span role="status" className="sr-only">{motion ? "Object rotation active." : "Object is still."}</span>
  </div>
}
