"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { SoftCombobox } from "@/components/soft-combobox"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PixelObject, type PixelObjectProps } from "@/registry/wlkr/pixel-object"
import { cn } from "@/lib/utils"
import styles from "./combobox-prototypes.module.css"

const presets = [
  { value:"sphere", label:"Pixel sphere", detail:"Steady rotation", settings:{} },
  { value:"disco", label:"Disco", detail:"Scattered light", settings:{dotShape:"square",dotSize:4,gap:2,rotationSpeed:.3,flickerAmount:.65,flickerSpeed:.45,pattern:"scatter",seed:7} },
  { value:"wave", label:"Wave", detail:"A passing rhythm", settings:{dotShape:"circle",dotSize:4,gap:3,rotating:false,flickerAmount:.8,flickerSpeed:.35,pattern:"wave",seed:3,randomness:.2} },
  { value:"still", label:"Still", detail:"Nothing in motion", settings:{rotating:false,pattern:"steady"} },
] satisfies {value:string;label:string;detail:string;settings:Partial<PixelObjectProps>}[]
const treatments = [
  {id:"inline",name:"Inline",description:"A sentence, with a choice inside it."},
  {id:"underline",name:"Underline",description:"One baseline. Nothing around it."},
  {id:"soft",name:"Soft",description:"A compact tonal touchpoint."},
  {id:"inset",name:"Inset",description:"A quiet field with its label inside."},
  {id:"editorial",name:"Editorial",description:"The selected value becomes the headline."},
] as const
type Treatment = typeof treatments[number]["id"]
function PresetCombobox({treatment,value,onChange}:{treatment:Treatment;value:string;onChange:(value:string)=>void}) {
  const [open,setOpen]=React.useState(false)
  const selected=presets.find(preset=>preset.value===value)??presets[0]
  if(treatment==="soft")return <SoftCombobox label="Soft preset" value={value} onChange={onChange} options={presets} searchPlaceholder="Find a preset…" emptyMessage="No presets found."/>
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><Button variant="ghost" role="combobox" aria-expanded={open} aria-label={`${treatment} preset: ${selected.label}`} className={cn(styles.trigger,styles[treatment])} onKeyDown={event=>{if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();setOpen(true)}}}>
      {treatment==="inline"&&<span className={styles.triggerLead}>Render as</span>}
      {treatment==="inset"&&<span className={styles.insetLabel}>Object preset</span>}
      {treatment==="editorial"&&<span className={styles.editorialNumber}>{String(presets.indexOf(selected)+1).padStart(2,"0")}</span>}
      <span className={styles.value}>{selected.label}</span><ChevronDown aria-hidden="true" className={styles.chevron}/>
    </Button></PopoverTrigger>
    <PopoverContent align="start" sideOffset={treatment==="inline"?0:6} className={cn(styles.popup,styles[`${treatment}Popup`])} aria-label={`${treatment} presets`}>
      <Command className={styles.command}>
        <CommandInput aria-label={`Search ${treatment} presets`} placeholder="Find a preset…" className={styles.search}/>
        <CommandList className={styles.list}><CommandEmpty className={styles.empty}>No presets found.</CommandEmpty><CommandGroup className={styles.group}>
          {presets.map((preset,index)=><CommandItem key={preset.value} value={preset.label} keywords={[preset.value,preset.detail]} className={styles.option} onSelect={()=>{onChange(preset.value);setOpen(false)}}>
            {(treatment==="underline"||treatment==="editorial")&&<span className={styles.optionNumber}>{String(index+1).padStart(2,"0")}</span>}
            <span className={styles.optionText}><span>{preset.label}</span>{(treatment==="inset"||treatment==="editorial")&&<span className={styles.detail}>{preset.detail}</span>}</span>
            {value===preset.value?<Check aria-hidden="true" className={styles.check}/>:<span className={styles.checkSpace}/>}
            {value===preset.value&&<span className={styles.srOnly}>Current preset</span>}
          </CommandItem>)}
        </CommandGroup></CommandList>
      </Command>
    </PopoverContent>
  </Popover>
}
const subscribe = () => () => {}
export function ComboboxPrototypes() {
  const mounted=React.useSyncExternalStore(subscribe,()=>true,()=>false)
  const [value,setValue]=React.useState("sphere")
  const selected=presets.find(preset=>preset.value===value)??presets[0]
  return <section className={styles.section} aria-labelledby="combobox-heading">
    <div className={styles.introduction}><p className={styles.eyebrow}>01 / Selection</p><h2 id="combobox-heading">Five ways to choose.</h2><p>Same presets. Different emphasis. Every choice updates the shared object.</p></div>
    <div className={styles.comparison}><div className={styles.samples}>{treatments.map((treatment,index)=><article className={styles.sample} key={treatment.id}><div className={styles.sampleHeading}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{treatment.name}</h3><p>{treatment.description}</p></div></div><PresetCombobox treatment={treatment.id} value={value} onChange={setValue}/></article>)}</div>
    <div className={styles.objectColumn}><div className={styles.objectStage}>{mounted?<PixelObject restartKey={value} label={`${selected.label} preset preview`} {...selected.settings}/>:<div aria-hidden="true" style={{width:260,height:260}}/>}</div><p className={styles.objectLabel} role="status">{selected.label}<span>{selected.detail}</span></p><p className={styles.instructions}>Click a selector, then type to search.<br/>↑ ↓ to explore · Enter to choose · Esc to close</p></div></div>
  </section>
}
