import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
const geist = localFont({ src: "../public/fonts/geist-latin-wght-normal.woff2", variable: "--font-geist-sans", display: "swap" })
export const metadata: Metadata = {
  metadataBase: new URL("https://ui.wlkrlabs.com"),
  title: "wlkr/ui — Interfaces, reduced.",
  description: "Useful React components. Thoughtful defaults. Source you own. The WLKR Labs component collection and shadcn registry.",
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{const t=localStorage.getItem('wlkr-theme');document.documentElement.classList.toggle('dark',t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))}catch{}`}} /></head><body className={`${geist.variable} antialiased`}>{children}</body></html>
}
