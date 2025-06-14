import type React from "react"
import type { Metadata } from "next"
import { Manrope, DM_Sans } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/contexts/AppContext"
import { Toaster } from "@/components/ui/toaster"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "KidsBank - Smart Debit Card for Teens",
  description: "Financial freedom and literacy for Pakistani teens with KidsBank.",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-brand-lightPink font-sans text-brand-navy">
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}
