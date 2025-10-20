"use client"

import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { useChat } from "@/contexts/chat-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Headphones, Mic, Briefcase, MessageCircle, Package } from "lucide-react"

export default function AdminDashboardPage() {
  const { sessions } = useChat()
  const activeChatCount = sessions.filter((s) => s.status === "active").length

  const stats = [
    {
      title: "Services",
      value: "7",
      description: "Active services",
      icon: Briefcase,
    },
    {
      title: "Products",
      value: "12",
      description: "Shop products",
      icon: Package,
    },
    {
      title: "Articles",
      value: "24",
      description: "Published articles",
      icon: FileText,
    },
    {
      title: "Podcasts",
      value: "12",
      description: "Episodes available",
      icon: Mic,
    },
    {
      title: "Audio Files",
      value: "18",
      description: "Ruqya recordings",
      icon: Headphones,
    },
    {
      title: "Support Chats",
      value: activeChatCount.toString(),
      description: "Active conversations",
      icon: MessageCircle,
    },
  ]

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome to the Ruqya Healing Hub admin panel</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Add New Service</h3>
                  <p className="text-sm text-muted-foreground">Create a new service offering</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Add Product</h3>
                  <p className="text-sm text-muted-foreground">Add a new product to the shop</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Write Article</h3>
                  <p className="text-sm text-muted-foreground">Publish a new article or blog post</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Upload Podcast</h3>
                  <p className="text-sm text-muted-foreground">Add a new podcast episode</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Upload Audio</h3>
                  <p className="text-sm text-muted-foreground">Add new Ruqya audio recording</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  )
}
