"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showMenuHint, setShowMenuHint] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/shop", label: "Shop" },
    { href: "/articles", label: "Articles" },
    { href: "/podcasts", label: "Podcasts" },
    { href: "/ruqya-audio", label: "Ruqya Audio" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore")
    const isMobile = window.innerWidth < 1024

    if (!hasVisited && isMobile) {
      setShowMenuHint(true)
      // Hide hint after 8 seconds
      const timer = setTimeout(() => {
        setShowMenuHint(false)
        localStorage.setItem("hasVisitedBefore", "true")
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleMenuClick = () => {
    setIsOpen(!isOpen)
    if (showMenuHint) {
      setShowMenuHint(false)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Only apply on mobile screens (less than 1024px)
      if (window.innerWidth >= 1024) {
        setIsVisible(true)
        return
      }

      // Show nav when scrolling up or at top, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false)
        setIsOpen(false) // Close mobile menu when hiding
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="Ruqya Healing Logo"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain mix-blend-multiply dark:mix-blend-screen"
              priority
            />
            <div className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-primary">
              <span className="hidden sm:inline">Ruqya Healing</span>
              <span className="sm:hidden">RH</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap relative ${
                  isActive(link.href) ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
                {isActive(link.href) && <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild className="hidden sm:flex text-sm px-3 md:px-4">
              <Link href="/services">
                <span className="hidden lg:inline">Book Appointment</span>
                <span className="lg:hidden">Book</span>
              </Link>
            </Button>

            {/* Mobile menu button */}
            <div className="relative lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={handleMenuClick}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              {showMenuHint && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-primary"></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive(link.href) ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                {isActive(link.href) && <span className="inline-block ml-2 w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            ))}
            <Button asChild className="w-full mt-4">
              <Link href="/services">Book Appointment</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
