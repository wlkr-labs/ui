"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown, SlidersHorizontal, type LucideIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import styles from "./disclosure.module.css"

/** Radix owns disclosure state, keyboard semantics, presence, and measured content height. */
export function Disclosure({ title, children, description, icon: Icon = SlidersHorizontal, defaultOpen = false, className }: {
  title: string
  children: ReactNode
  description?: string
  icon?: LucideIcon
  defaultOpen?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return <Collapsible open={open} onOpenChange={setOpen} className={cn(styles.root, className)}>
    <CollapsibleTrigger className={styles.trigger}>
      <Icon className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>{title}</span>
      {description && <span className={styles.description}>{description}</span>}
      <ChevronDown className={styles.chevron} aria-hidden="true" />
    </CollapsibleTrigger>
    <CollapsibleContent className={styles.content} inert={!open}><div className={styles.inner}>{children}</div></CollapsibleContent>
  </Collapsible>
}
