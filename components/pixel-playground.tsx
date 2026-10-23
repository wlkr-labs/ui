"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodePanel } from "@/components/code-panel"
import { Disclosure } from "@/components/disclosure"
import { PixelObject, type PixelObjectProps } from "@/registry/wlkr/pixel-object"
import { ChoiceControl, RangeControl } from "@/components/playground-controls"

type Settings=Required<Pick<PixelObjectProps,"dotShape"|"rotationSpeed"|"flickerAmount"|"flickerSpeed"|"pattern"|"delay"|"stagger"|"seed"|"randomness"|"opacity"|"rotating">>&Pick<PixelObjectProps,"dotSize"|"gap">
const defaults:Settings={dotShape:"rounded",dotSize:undefined,gap:undefined,rotationSpeed:.15,flickerAmount:0,flickerSpeed:.5,pattern:"steady",delay:0,stagger:0,seed:1,randomness:1,opacity:1,rotating:true}
const presets:Record<string,Settings>={
  sphere:defaults,
  disco:{...defaults,dotShape:"square",dotSize:4,gap:2,rotationSpeed:.3,flickerAmount:.65,flickerSpeed:.45,pattern:"scatter",stagger:900,seed:7},
  wave:{...defaults,dotShape:"circle",dotSize:4,gap:3,rotating:false,rotationSpeed:0,flickerAmount:.8,flickerSpeed:.35,pattern:"wave",stagger:600,seed:3,randomness:.2},
  still:{...defaults,rotating:false,rotationSpeed:0,pattern:"steady"},
}
const presetOptions=[{value:"sphere",label:"Pixel sphere"},{value:"disco",label:"Disco"},{value:"wave",label:"Wave"},{value:"still",label:"Still"}]
export function PixelPlayground() {
  const [settings,setSettings]=React.useState<Settings>({...defaults})
  const [preset,setPreset]=React.useState("sphere")
  const [restart,setRestart]=React.useState(0)
  const [morph,setMorph]=React.useState(false)
  function update<K extends keyof Settings>(key:K,value:Settings[K]) {setSettings(current=>({...current,[key]:value}));setPreset("custom");if(key==="delay")setRestart(value=>value+1)}
  function apply(name:string){setSettings({...presets[name]??defaults});setPreset(name);setMorph(false);setRestart(value=>value+1)}
  const code=`import { PixelObject } from "@/components/wlkr/pixel-object"\n\n<PixelObject\n  label="Pixel sphere"\n${morph?'  morph={{ shapes: ["sphere", "cube", "torus"], duration: 8 }}\n':""}${Object.entries(settings).filter(([key,value])=>value!==undefined&&value!==defaults[key as keyof Settings]).map(([key,value])=>`  ${key}=${typeof value==="string"?JSON.stringify(value):`{${value}}`}\n`).join("")}/>`
  return <Tabs defaultValue="preview" className="docs-tabs mt-6"><TabsList aria-label="Pixel object view"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="usage">Usage</TabsTrigger></TabsList><TabsContent value="preview"><div className="preview"><div className="preview-content pixel-stage"><PixelObject {...settings} restartKey={restart} morph={morph?{shapes:["sphere","cube","torus"],duration:8}:undefined}/></div></div><Disclosure title="Customize" description="Shape, movement, and light" className="customize"><div className="customize-heading"><ChoiceControl label="Preset" value={preset} onChange={apply} options={preset==="custom"?[{value:"custom",label:"Custom"},...presetOptions]:presetOptions}/><Button type="button" variant="ghost" onClick={()=>apply("sphere")}>Reset</Button></div><label className="demo-option mb-6"><Switch checked={morph} onCheckedChange={value=>{setMorph(value);setPreset("custom")}}/>Morph sphere, cube, and torus</label><FieldGroup className="customize-grid">
    <ChoiceControl label="Dot shape" value={settings.dotShape} onChange={value=>update("dotShape",value as Settings["dotShape"])} options={[{value:"square",label:"Square"},{value:"rounded",label:"Rounded"},{value:"circle",label:"Circle"}]}/>
    <ChoiceControl label="Pattern" value={settings.pattern} onChange={value=>update("pattern",value as Settings["pattern"])} options={[{value:"steady",label:"Steady"},{value:"scatter",label:"Scatter"},{value:"wave",label:"Wave"},{value:"scan",label:"Scan"}]}/>
    <RangeControl label="Dot size" value={settings.dotSize??5.2} min={1} max={12} step={.2} unit="px" onChange={value=>update("dotSize",value)}/>
    <RangeControl label="Gap" value={settings.gap??260/36*.28} min={0} max={10} step={.2} unit="px" onChange={value=>update("gap",value)}/>
    <RangeControl label="Rotation speed" value={settings.rotationSpeed} min={0} max={1} step={.05} unit=" rad/s" onChange={value=>{setSettings(current=>({...current,rotationSpeed:value,rotating:value>0}));setPreset("custom")}}/>
    <RangeControl label="Flicker amount" value={settings.flickerAmount} min={0} max={1} step={.05} onChange={value=>update("flickerAmount",value)}/>
    <RangeControl label="Flicker speed" value={settings.flickerSpeed} min={0} max={2} step={.05} unit=" Hz" onChange={value=>update("flickerSpeed",value)}/>
    <RangeControl label="Opacity" value={settings.opacity} min={0} max={1} step={.05} onChange={value=>update("opacity",value)}/>
    <RangeControl label="Delay" value={settings.delay} min={0} max={3000} step={100} unit="ms" onChange={value=>update("delay",value)}/>
    <RangeControl label="Stagger" value={settings.stagger} min={0} max={3000} step={100} unit="ms" onChange={value=>update("stagger",value)}/>
    <RangeControl label="Randomness" value={settings.randomness} min={0} max={1} step={.05} onChange={value=>update("randomness",value)}/>
    <RangeControl label="Seed" value={Number(settings.seed)} min={1} max={20} onChange={value=>update("seed",value)}/>
  </FieldGroup><p className="customize-note">Size and gap use pixels and determine density. Before either is adjusted, the original 36-cell grid is preserved. Steady does not flicker; choose another pattern to use the flicker controls. Reset also restarts the timeline.</p></Disclosure></TabsContent><TabsContent value="usage"><div className="playground-code"><CodePanel code={code} filename="pixel-object-preview.tsx" language="tsx" /></div><p className="customize-note">This example follows the current controls. Custom point clouds and masks are also supported; see the source types.</p></TabsContent></Tabs>
}
