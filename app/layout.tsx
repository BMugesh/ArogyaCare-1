import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import ErrorBoundary from "@/components/error-boundary"
import { AuthProvider, SafeContextProvider } from "@/components/providers"
import { LanguageProvider } from "@/hooks/useLanguagePreferences"
import { LanguageSetupRedirect } from "@/components/LanguageSetupRedirect"
import { RouteGuard } from "@/components/RouteGuard"
import { FirebaseDebug } from "@/components/FirebaseDebug"
import "leaflet/dist/leaflet.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ArogyaCare - Quality Healthcare for All",
  description: "ArogyaCare leverages technology to make quality healthcare accessible to everyone, everywhere.",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
          <SafeContextProvider>
            <AuthProvider>
              <LanguageProvider>
                <LanguageSetupRedirect>
                  <RouteGuard>
                    <MouseMoveEffect />
                    {children}
                    <FirebaseDebug />
                  </RouteGuard>
                </LanguageSetupRedirect>
              </LanguageProvider>
            </AuthProvider>
          </SafeContextProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}