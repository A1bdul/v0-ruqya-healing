"use client"

import type React from "react"
import { useCallback } from "react"

import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { useChat } from "@/contexts/chat-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef } from "react"
import { Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminChatPage() {
  const { sessions, getSessionMessages, sendMessage, markMessagesAsRead, closeSession } = useChat()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeSessions = sessions.filter((s) => s.status === "active")
  const selectedSession = sessions.find((s) => s.id === selectedSessionId)
  const sessionMessages = selectedSessionId ? getSessionMessages(selectedSessionId) : []

  const stableMarkMessagesAsRead = useCallback(markMessagesAsRead, [])

  useEffect(() => {
    if (selectedSessionId) {
      stableMarkMessagesAsRead(selectedSessionId)
    }
  }, [selectedSessionId, stableMarkMessagesAsRead])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [sessionMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() && selectedSessionId) {
      sendMessage(messageInput, "admin", selectedSessionId)
      setMessageInput("")
    }
  }

  const handleCloseSession = () => {
    if (selectedSessionId) {
      closeSession(selectedSessionId)
      setSelectedSessionId(null)
    }
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">Support Chat</h1>
            <p className="text-muted-foreground mt-2">Manage customer support conversations</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Sessions list */}
            <Card className="lg:col-span-1 overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Active Chats ({activeSessions.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2 p-4">
                {activeSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center mt-8">No active chats</p>
                ) : (
                  activeSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                        selectedSessionId === session.id && "bg-accent border-primary",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{session.userName}</p>
                          <p className="text-sm text-muted-foreground truncate">{session.userEmail}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(session.lastActivity).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Chat messages */}
            <Card className="lg:col-span-2 overflow-hidden flex flex-col">
              {selectedSession ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedSession.userName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selectedSession.userEmail}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleCloseSession}>
                        <X className="h-4 w-4 mr-2" />
                        Close Chat
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                    {sessionMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn("flex", msg.sender === "admin" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2",
                            msg.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Select a chat to start messaging</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  )
}
