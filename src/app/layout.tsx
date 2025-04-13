import "@/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { MapProvider } from "@/contexts/MapContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SWM Eats - 소마 맛집 공유 서비스",
  description: "소프트웨어 마에스트로 구성원들을 위한 맛집 공유 플랫폼",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <MapProvider>
          <Providers>
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-gray-100 p-6 text-center text-gray-500">
              <p>© {new Date().getFullYear()} SWM Eats. All rights reserved.</p>
            </footer>
          </Providers>
        </MapProvider>
        <Toaster />
      </body>
    </html>
  )
} 