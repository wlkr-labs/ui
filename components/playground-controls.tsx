"use client"

import * as React from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { SoftCombobox } from "@/components/soft-combobox"

export function RangeControl({label,value,onChange,min,max,step=1,unit=""}:{label:string;value:number;onChange:(value:number)=>void;min:number;max:number;step?:number;unit?:string}) {
  const id=React.useId()
  return <Field className="playground-field"><div className="flex items-center justify-between gap-3"><FieldLabel id={`${id}-label`} htmlFor={id}>{label}</FieldLabel><output className="text-xs text-muted-foreground" htmlFor={id}>{Number(value.toFixed(2))}{unit}</output></div><Slider id={id} min={min} max={max} step={step} value={[value]} onValueChange={values=>onChange(values[0])} ref={node=>{const thumb=node?.querySelector('[role="slider"]');thumb?.setAttribute("aria-labelledby",`${id}-label`);thumb?.setAttribute("aria-valuetext",`${Number(value.toFixed(2))}${unit}`)}} /></Field>
}
export function ChoiceControl({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:{value:string;label:string}[]}) {
  const id=React.useId()
  return <Field className="playground-field"><FieldLabel htmlFor={id}>{label}</FieldLabel><SoftCombobox id={id} label={label} value={value} onChange={onChange} options={options}/></Field>
}
