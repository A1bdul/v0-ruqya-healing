"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "admin"
  timestamp: Date
}

export function CustomerChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (window.innerWidth >= 1024) {
        setIsVisible(true)
        return
      }

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false)
        setIsOpen(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const connectWebSocket = (name: string, email: string) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/chat"

    try {
      const ws = new WebSocket(`${wsUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`)

      ws.onopen = () => {
        console.log("[v0] Customer WebSocket connected")
        setIsConnected(true)
      }

      ws.onmessage = (event) => {
        console.log("[v0] WebSocket message received:", event.data)
        const data = JSON.parse(event.data)

        if (data.type === "message") {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: data.content,
            sender: data.sender === "admin" ? "admin" : "user",
            timestamp: new Date(data.timestamp),
          }
          setMessages((prev) => [...prev, newMessage])
        } else if (data.type === "history") {
          const historyMessages: Message[] = data.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sender: msg.is_admin ? "admin" : "user",
            timestamp: new Date(msg.created_at),
          }))
          setMessages(historyMessages)
        }
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setIsConnected(false)
        wsRef.current = null
      }

      wsRef.current = ws
    } catch (error) {
      console.error("[v0] Failed to connect WebSocket:", error)
      setIsConnected(false)
    }
  }

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim() && userEmail.trim()) {
      connectWebSocket(userName, userEmail)
      setIsStarted(true)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return
    }

    const message = {
      type: "message",
      content: messageInput.trim(),
    }

    wsRef.current.send(JSON.stringify(message))

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
  }

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        }`}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat widget */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-96 max-w-96 h-[500px] max-h-[calc(100vh-8rem)] shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Customer Support</h3>
              <p className="text-sm opacity-90">We're here to help</p>
            </div>
            {isStarted && (
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <span className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-xs opacity-70">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    Offline
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          {!isStarted ? (
            // Start chat form
            <form onSubmit={handleStartChat} className="flex-1 p-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Email</label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Start Chat
              </Button>
            </form>
          ) : (
            // Chat messages
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm mt-8">
                    <p>Welcome! How can we help you today?</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={!isConnected}
                />
                <Button type="submit" size="icon" disabled={!isConnected || !messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </Card>
      )}
    </>
  )
}
