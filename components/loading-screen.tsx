"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide loading screen after a short delay
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-out">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative animate-scale-in">
            <Image
              src="/icon.png"
              alt="Ruqya Healing Logo"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
              priority
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-sm text-muted-foreground font-medium tracking-wide animate-fade-in-delay">
          Ruqya Healing
        </div>

        {/* Spinner */}
        <div className="flex gap-1.5 animate-fade-in-delay-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )
}
