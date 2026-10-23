# Motion components

The customizer and WLKR loader are live at [ui.wlkrlabs.com](https://ui.wlkrlabs.com), source release `6c34da775eb20b62b4352a360586d100b62399df`. Configure `@wlkr` as `https://ui.wlkrlabs.com/r/{name}.json`, then install `@wlkr/pixel-object` and `@wlkr/wlkr-loader` with the standard shadcn CLI. Clean-consumer installation, TypeScript/Vite build, and browser rendering were verified. For local development, run `pnpm dev --port 3100` and optionally map a disposable consumer to the local namespace.

## PixelObject

The original props and appearance are preserved. With no new props, the component uses the original 36-cell rounded-square grid, 260 px size, sphere, .15 rad/s rotation, and no extra flicker.

| Prop | Default | Meaning and bounds |
| --- | --- | --- |
| `points` | `spherePoints(420)` | Up to 2,000 finite normalized x/y/z points. z defaults to 0. |
| `mask` | unset | `#`/space rows; takes precedence over points. Maximum 80 rows and 80 columns. |
| `resolution` | 36 | Legacy raster cells per side, clamped 8–80. |
| `size` | 260 | Nominal SVG size in px, clamped 64–1,000; scales down responsively. |
| `dotShape` | `rounded` | `square`, `rounded`, or `circle`. |
| `dotSize` | unset | Nominal dot width/height in SVG px, clamped .5–40 when provided. |
| `gap` | unset | Nominal empty spacing between dots in SVG px, clamped 0–40 when provided. |
| `rotating` | true | Enables rotation; flicker can still run when rotation is disabled. |
| `rotationSpeed` | .15 | Radians per second, clamped 0–3. Independent of flicker speed. |
| `flickerAmount` | 0 | Pattern depth from 0–1; even full depth dims cells to at least 35% of their depth shading. |
| `flickerSpeed` | .5 | Smooth cycles per second, clamped 0–2. Zero freezes the pattern phase. |
| `pattern` | `steady` | `steady`, `scatter`, `wave`, or `scan`. Steady never flickers. |
| `delay` | 0 | Active milliseconds before motion starts, clamped 0–30,000. |
| `stagger` | 0 | Milliseconds of pattern phase spread across the object, clamped 0–10,000. Does not multiply by point count. |
| `seed` | 1 | Number or string for deterministic scatter phases. Stable on server and client. |
| `randomness` | 1 | Seeded phase variation, clamped 0–1. Zero synchronizes scatter. |
| `opacity` | 1 | Overall opacity multiplier, clamped 0–1. |
| `restartKey` | 0 | Change the number/string to restart rotation and timing without remounting. |
| `label` | “Rotating pixel sphere” | Accessible SVG description; use a label that describes your object. |
| `className` | unset | Application layout/color composition. |

### Size and gap precedence

When **neither** dotSize nor gap is supplied, resolution controls the legacy grid and each cell retains its original .72 fill ratio. Setting **either** opts into physical pitch: `pitch = dotSize + gap`, and the number of raster cells comes from size and pitch. Thus dotSize changes the dots themselves and gap changes spacing/density; these are not two names for the same fill ratio.

When one value is omitted in physical mode, its fallback comes from the legacy size/resolution ratio: dot size `size / resolution × .72`, gap `size / resolution × .28`. Resolution supplies that omitted default, then no longer determines density. The projected cloud is centered; an extreme pitch that fits only one cell produces one centered dot, with no bounds overflow. The nominal px measurements scale with the SVG on narrow layouts.

### Patterns and controls

Scatter varies seeded cell phases; wave moves a diagonal phase front; scan moves a row-aligned brightness band. All use smooth sinusoidal changes rather than hard flashing, with a 500 ms onset ramp after delay/stagger. Rotation has its own clock rate. The gallery’s Pixel sphere, Disco, Wave, and Still presets update every control together; later edits show Custom. Reset restores the original sphere, clears user pause, and restarts the timeline using restartKey. Editing Delay also restarts the preview timeline so the selected delay can be observed. Its Usage tab generates a copyable example from the current settings.

Motion stops on explicit pause, off-screen intersection, hidden document, or reduced-motion preference. Observers, media listeners, and animation frames clean up on unmount. Paused time does not advance; resuming continues without a wall-clock jump. No animation frame loop runs for a still preset or a zero-speed, non-flickering object. Pattern and rotation updates are sampled around 12 fps; opacity and geometry remain ordinary native SVG.

## WlkrLoader

The loader embeds the exact approved WLKR mark: original 904×904 viewBox, group transform, six rectangle positions/sizes, and radius 33. It inherits ink from currentColor and keeps the top cell WLKR green. Bars compress each cell vertically within its bounds; dots apply a gentle scale/opacity beat to the original rounded squares. Neither variant changes the logo into circles or moves its bounds.

| Prop | Default | Meaning and bounds |
| --- | --- | --- |
| `variant` | `bars` | `bars` or `dots`. |
| `size` | 48 | Fixed square bounds in px, clamped 16–240. |
| `duration` | 1,800 | Milliseconds per smooth beat, clamped 800–10,000. |
| `stagger` | 120 | Milliseconds between cells, clamped 0–2,000. |
| `label` | “Loading” | One accessible loading announcement. |
| `decorative` | false | Hides the loader from accessibility APIs when another control already announces loading. |
| `paused` | false | Pauses the beat without changing geometry. |
| `className` | unset | Inherited color/layout composition. |

The component uses CSS animation and no JavaScript frame loop. Intersection, visibility, and reduced-motion state control animation play state. Reduced motion shows the original static mark. Animation updates do not rewrite live-region text. The gallery provides variant, size, beat duration, cell stagger, Reset, and Pause controls with a matching copyable Usage example.

## Provenance

All motion/projection code is authored for WLKR. The geometry comes from the approved local brand master `public/wlkr-mark.svg`. Motion references are [Loading UI Bars](https://www.loading-ui.com/docs/components/bars) for staggered vertical pulses and [Loading UI Dots](https://www.loading-ui.com/docs/components/dots) for soft scale/opacity beats. Those reference implementations were not copied. The earlier pixel-field interaction reference is [Magic UI’s Flickering Grid](https://magicui.design/docs/components/flickering-grid). The gallery controls use CLI-installed, unchanged shadcn Slider, NativeSelect, and Field primitives; none are republished as WLKR registry entries.
