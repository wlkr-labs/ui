"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export type FilterListItem = { id: string; label: string; description?: string; keywords?: string[] }

/** A small searchable list. Matching ignores case and accents, with a live result count. */
export function FilterList({ items, label = "Search items", placeholder = "Find something…" }: { items: FilterListItem[]; label?: string; placeholder?: string }) {
  const [query, setQuery] = React.useState("")
  const id = React.useId()
  const input = React.useRef<HTMLInputElement>(null)
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
  const words = normalize(query).trim().split(/\s+/).filter(Boolean)
  const results = items.filter(item => words.every(word => normalize([item.label, item.description, ...(item.keywords ?? [])].join(" ")).includes(word)))
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center gap-3">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor={id} className="sr-only">{label}</label>
        <Input ref={input} id={id} type="search" placeholder={placeholder} value={query} onChange={event => setQuery(event.target.value)} aria-describedby={`${id}-count`} />
        {query && <Button type="button" variant="ghost" size="icon" aria-label="Clear search" onClick={() => { setQuery(""); input.current?.focus() }}><X /></Button>}
      </div>
      <p id={`${id}-count`} role="status" className="text-xs text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"}</p>
      <ul className="flex flex-col gap-5">
        {results.map(item => <li key={item.id}><p className="text-sm font-medium">{item.label}</p>{item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}</li>)}
      </ul>
      {results.length === 0 && <p className="text-sm text-muted-foreground">No matches. Try another search or clear the filter.</p>}
    </div>
  )
}
