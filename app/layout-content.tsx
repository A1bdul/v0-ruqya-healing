"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CustomerChatWidget } from "@/components/customer-chat-widget"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Navigation />}
      {children}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <CustomerChatWidget />}
    </>
  )
}
