"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient, clearAuthTokens, isAuthenticated } from "@/lib/api-client"
import type { LoginResponse, User } from "@/lib/api-types"

interface AdminAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await apiClient.get<User>("/auth/me", true)
          if (currentUser.role === "admin") {
            setIsAuth(true)
            setUser(currentUser)
          } else {
            // Not an admin, clear tokens
            clearAuthTokens()
            setIsAuth(false)
            setUser(null)
          }
        } catch (error) {
          // Token is invalid, clear it
          clearAuthTokens()
          setIsAuth(false)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      })

      // Check if user is admin
      if (response.user.role !== "admin") {
        return false
      }

      // Store tokens
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("refresh_token", response.refresh_token)

      setIsAuth(true)
      setUser(response.user)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    clearAuthTokens()
    setIsAuth(false)
    setUser(null)
    router.push("/admin/login")
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: isAuth, isLoading, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
