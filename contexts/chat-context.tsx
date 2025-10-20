"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface ChatMessage {
  id: string
  sessionId: string
  sender: "user" | "admin"
  message: string
  timestamp: number
  read: boolean
}

export interface ChatSession {
  id: string
  userName: string
  userEmail: string
  startTime: number
  lastActivity: number
  status: "active" | "closed"
  unreadCount: number
}

interface ChatContextType {
  sessions: ChatSession[]
  messages: ChatMessage[]
  currentSessionId: string | null
  sendMessage: (message: string, sender: "user" | "admin", sessionId?: string) => void
  createSession: (userName: string, userEmail: string) => string
  closeSession: (sessionId: string) => void
  markMessagesAsRead: (sessionId: string) => void
  getSessionMessages: (sessionId: string) => ChatMessage[]
  getTotalUnreadCount: () => number
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const SESSION_LIFETIME = 30 * 60 * 1000 // 30 minutes

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Load data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("ruqya-chat-sessions")
    const savedMessages = localStorage.getItem("ruqya-chat-messages")
    const savedCurrentSession = localStorage.getItem("ruqya-current-session")

    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions))
      } catch (error) {
        console.error("Failed to load sessions:", error)
      }
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to load messages:", error)
      }
    }

    if (savedCurrentSession) {
      setCurrentSessionId(savedCurrentSession)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ruqya-chat-sessions", JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem("ruqya-chat-messages", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("ruqya-current-session", currentSessionId)
    }
  }, [currentSessionId])

  // Clean up expired sessions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setSessions((prev) =>
        prev.map((session) => {
          if (session.status === "active" && now - session.lastActivity > SESSION_LIFETIME) {
            return { ...session, status: "closed" }
          }
          return session
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const createSession = useCallback((userName: string, userEmail: string): string => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newSession: ChatSession = {
      id: sessionId,
      userName,
      userEmail,
      startTime: Date.now(),
      lastActivity: Date.now(),
      status: "active",
      unreadCount: 0,
    }

    setSessions((prev) => [...prev, newSession])
    setCurrentSessionId(sessionId)
    return sessionId
  }, [])

  const sendMessage = useCallback(
    (message: string, sender: "user" | "admin", sessionId?: string) => {
      const targetSessionId = sessionId || currentSessionId
      if (!targetSessionId) return

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId: targetSessionId,
        sender,
        message,
        timestamp: Date.now(),
        read: sender === "user" ? false : true,
      }

      setMessages((prev) => [...prev, newMessage])

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === targetSessionId) {
            return {
              ...session,
              lastActivity: Date.now(),
              unreadCount: sender === "user" ? session.unreadCount + 1 : session.unreadCount,
            }
          }
          return session
        }),
      )
    },
    [currentSessionId],
  )

  const closeSession = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, status: "closed" } : session)),
    )
  }, [])

  const markMessagesAsRead = useCallback((sessionId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.sessionId === sessionId && msg.sender === "user" ? { ...msg, read: true } : msg)),
    )

    setSessions((prev) => prev.map((session) => (session.id === sessionId ? { ...session, unreadCount: 0 } : session)))
  }, [])

  const getSessionMessages = useCallback(
    (sessionId: string): ChatMessage[] => {
      return messages.filter((msg) => msg.sessionId === sessionId).sort((a, b) => a.timestamp - b.timestamp)
    },
    [messages],
  )

  const getTotalUnreadCount = useCallback((): number => {
    return sessions.reduce((sum, session) => sum + session.unreadCount, 0)
  }, [sessions])

  return (
    <ChatContext.Provider
      value={{
        sessions,
        messages,
        currentSessionId,
        sendMessage,
        createSession,
        closeSession,
        markMessagesAsRead,
        getSessionMessages,
        getTotalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
