"use client"

import { useState, useSyncExternalStore } from "react"
import { Code2 } from "lucide-react"
import { Disclosure } from "./disclosure"
import { CodePanel } from "./code-panel"
import { RangeControl } from "./playground-controls"
import { Switch } from "./ui/switch"
import { PixelObject } from "@/registry/wlkr/pixel-object"
import { getPrototypeCode, prototypeCode } from "@/lib/code-samples"

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function DisclosureCodePrototype({ highlightedCode }: { highlightedCode?: string }) {
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
  const [duration, setDuration] = useState(8)
  const [motion, setMotion] = useState(true)
  const code = getPrototypeCode(duration, motion)
  return <section className="mt-24 min-w-0" aria-labelledby="disclosure-prototype-title">
    <p className="text-xs text-muted-foreground">Disclosure & source</p>
    <h2 id="disclosure-prototype-title" className="mt-3 text-3xl font-medium tracking-tight">A little room to adjust.</h2>
    <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">A clearer invitation. Settings unfold in place, and source stays comfortable to read.</p>
    <div className="mt-8 max-w-3xl">
      <Disclosure title="Customize" description="Shape, movement, and light" defaultOpen>
        <div className="grid grid-cols-[minmax(0,1fr)_160px] items-center gap-8 pb-6 max-sm:grid-cols-1"><div className="flex flex-col gap-6">
          <RangeControl label="Transition duration" value={duration} min={2} max={20} unit="s" onChange={setDuration} />
          <label className="flex min-h-11 items-center gap-3 text-sm"><Switch checked={motion} onCheckedChange={setMotion} />Morph shapes</label>
        </div>{ready ? <PixelObject size={160} dotShape="circle" dotSize={3} gap={3} pattern="wave" flickerAmount={.65} rotationSpeed={.2} morph={motion ? {shapes:["sphere","cube","torus"],duration} : undefined} label="An object, taking shape" /> : <div style={{width:160,height:160}} aria-hidden="true" />}</div>
      </Disclosure>
      <Disclosure title="View source" description="A closer look" icon={Code2} defaultOpen>
        <CodePanel code={code} highlightedCode={code === prototypeCode ? highlightedCode : undefined} filename="project-preview.tsx" language="tsx" />
      </Disclosure>
    </div>
  </section>
}
