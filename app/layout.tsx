import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import ErrorBoundary from "@/components/error-boundary"
import "leaflet/dist/leaflet.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ArogyaCare - Quality Healthcare for All",
  description: "ArogyaCare leverages technology to make quality healthcare accessible to everyone, everywhere.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ErrorBoundary>
          <MouseMoveEffect />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}