"use client"

import type React from "react"

import { useAdminAuth } from "@/contexts/admin-auth-context"
import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mic,
  Headphones,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Package,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "Podcasts", href: "/admin/podcasts", icon: Mic },
  { name: "Audio", href: "/admin/audio", icon: Headphones },
  { name: "Support Chat", href: "/admin/chat", icon: MessageCircle },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminAuth()
  const { getTotalUnreadCount } = useChat()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const unreadCount = getTotalUnreadCount()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-serif font-semibold">Admin Panel</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const showBadge = item.href === "/admin/chat" && unreadCount > 0
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {showBadge && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 border-r bg-card">
          <div className="flex items-center h-16 px-6 border-b">
            <h2 className="text-lg font-serif font-semibold">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const showBadge = item.href === "/admin/chat" && unreadCount > 0
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {showBadge && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={logout}>
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-serif font-semibold">Admin Panel</h2>
        </div>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
