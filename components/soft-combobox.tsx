"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import styles from "./soft-combobox.module.css"

export type SoftComboboxOption={value:string;label:string;description?:string;keywords?:string[];disabled?:boolean}
export type SoftComboboxProps={
  label:string
  value:string
  onChange:(value:string)=>void
  options:SoftComboboxOption[]
  id?:string
  className?:string
  placeholder?:string
  searchPlaceholder?:string
  emptyMessage?:string
  disabled?:boolean
}
/** Site control: unchanged shadcn Command + Radix Popover own search and keyboard behavior. */
export function SoftCombobox({label,value,onChange,options,id,className,placeholder="Choose…",searchPlaceholder="Find an option…",emptyMessage="No options found.",disabled=false}:SoftComboboxProps){
  const [open,setOpen]=React.useState(false)
  const selected=options.find(option=>option.value===value)
  return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button id={id} type="button" variant="ghost" role="combobox" aria-expanded={open} aria-label={`${label}: ${selected?.label??placeholder}`} disabled={disabled} className={cn(styles.trigger,className)} onKeyDown={event=>{if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();setOpen(true)}}}><span className={styles.value}>{selected?.label??placeholder}</span><ChevronDown aria-hidden="true" className={styles.chevron}/></Button></PopoverTrigger>
    <PopoverContent align="start" sideOffset={6} className={styles.popup} aria-label={`${label} options`}><Command className={styles.command}><CommandInput aria-label={`Search ${label.toLowerCase()}`} placeholder={searchPlaceholder} className={styles.search}/><CommandList className={styles.list}><CommandEmpty className={styles.empty}>{emptyMessage}</CommandEmpty><CommandGroup className={styles.group}>{options.map(option=><CommandItem key={option.value} value={option.value} keywords={[option.label,...option.keywords??[]]} disabled={option.disabled} className={styles.option} onSelect={()=>{onChange(option.value);setOpen(false)}}><span className={styles.optionText}><span>{option.label}</span>{option.description&&<span className={styles.description}>{option.description}</span>}</span>{value===option.value?<><Check aria-hidden="true" className={styles.check}/><span className={styles.srOnly}>Current selection</span></>:<span className={styles.checkSpace}/>}</CommandItem>)}</CommandGroup></CommandList></Command></PopoverContent>
  </Popover>
}
