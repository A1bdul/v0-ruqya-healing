import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Nunito } from "next/font/google"
import "./globals.css"
import { LayoutContent } from "@/components/layout-content"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { AdminAuthProvider } from "@/contexts/admin-auth-context"
import { ChatProvider } from "@/contexts/chat-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ruqyahub.vercel.app"),
  title: {
    default: "Ruqya Healing - Healing through Qur'an and Sunnah",
    template: "%s | Ruqya Healing",
  },
  description:
    "Authentic Islamic Ruqya services, consultations, and spiritual healing resources. Expert guidance for protection against evil eye, black magic, and jinn possession through Qur'an and Sunnah.",
  keywords: [
    "Ruqya",
    "Islamic healing",
    "spiritual healing",
    "Quran healing",
    "evil eye",
    "black magic",
    "jinn possession",
    "Islamic consultation",
    "Ruqya services",
  ],
  authors: [{ name: "Ruqya Healing" }],
  creator: "Ruqya Healing",
  publisher: "Ruqya Healing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ruqyahub.vercel.app",
    siteName: "Ruqya Healing",
    title: "Ruqya Healing - Healing through Qur'an and Sunnah",
    description:
      "Authentic Islamic Ruqya services, consultations, and spiritual healing resources. Expert guidance for protection against evil eye, black magic, and jinn possession.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ruqya Healing - Islamic Spiritual Healing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruqya Healing - Healing through Qur'an and Sunnah",
    description: "Authentic Islamic Ruqya services, consultations, and spiritual healing resources.",
    images: ["/og-image.jpg"],
    creator: "@ruqyahealinghub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <AdminAuthProvider>
            <ChatProvider>
              <CartProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <LayoutContent>{children}</LayoutContent>
                </Suspense>
                <Toaster />
              </CartProvider>
            </ChatProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
