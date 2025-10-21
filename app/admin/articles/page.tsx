"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Article, PaginatedResponse } from "@/lib/api-types"

const categories = ["About", "Jinn Possession", "Black Magic", "Evil Eyes & Envy"]

export default function AdminArticlesPage() {
  const { toast } = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    excerpt: "",
    read_time: 5,
    author: "",
    is_published: true,
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      // Fetch all articles including drafts for admin view
      // Don't pass is_published parameter to get both published and draft articles
      const response = await apiClient.get<PaginatedResponse<Article>>("/articles?skip=0&limit=100", true)
      setArticles(response.items)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
      toast({ title: "Failed to load articles", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const updated = await apiClient.patch<Article>(`/articles/${editingId}`, formData, true)
        setArticles(articles.map((a) => (a.id === editingId ? updated : a)))
        toast({ title: "Article updated successfully" })
      } else {
        const newArticle = await apiClient.post<Article>("/articles", formData, true)
        setArticles([newArticle, ...articles])
        toast({ title: "Article created successfully" })
      }

      // Reset form
      setFormData({
        title: "",
        category: "",
        content: "",
        excerpt: "",
        read_time: 5,
        author: "",
        is_published: true,
      })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error("Failed to save article:", error)
      toast({ title: "Failed to save article", variant: "destructive" })
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      category: article.category,
      content: article.content,
      excerpt: article.excerpt || "",
      read_time: article.read_time,
      author: article.author,
      is_published: article.is_published,
    })
    setEditingId(article.id)
    setIsEditing(true)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      await apiClient.delete(`/articles/${id}`, true)
      setArticles(articles.filter((a) => a.id !== id))
      toast({ title: "Article deleted successfully" })
    } catch (error) {
      console.error("Failed to delete article:", error)
      toast({ title: "Failed to delete article", variant: "destructive" })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      title: "",
      category: "",
      content: "",
      excerpt: "",
      read_time: 5,
      author: "",
      is_published: true,
    })
  }

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        </AdminLayout>
      </AdminAuthGuard>
    )
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold">Articles Management</h1>
              <p className="text-muted-foreground mt-2">Create and manage your articles</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            )}
          </div>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Article" : "Create New Article"}</CardTitle>
                <CardDescription>Write your article content below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title and Category */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Article Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter article title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Author and Read Time */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Author name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="read_time">Read Time (minutes) *</Label>
                      <Input
                        id="read_time"
                        type="number"
                        min="1"
                        value={formData.read_time}
                        onChange={(e) => setFormData({ ...formData, read_time: Number.parseInt(e.target.value) || 5 })}
                        placeholder="e.g., 5"
                        required
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief summary of the article (optional)"
                    />
                    <p className="text-xs text-muted-foreground">
                      A short description that appears in article listings and previews
                    </p>
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-2">
                    <RichTextEditor
                      label="Article Content *"
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                    />
                  </div>

                  {/* Publish Toggle */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_published" className="text-base">
                        Publish Article
                      </Label>
                      <p className="text-sm text-muted-foreground">Make this article visible to the public</p>
                    </div>
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" size="lg">
                      {editingId ? "Update Article" : "Create Article"}
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Articles List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {articles.length} {articles.length === 1 ? "Article" : "Articles"}
            </h2>
            {articles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No articles yet. Create your first article!</p>
                </CardContent>
              </Card>
            ) : (
              articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                          {!article.is_published && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                              Draft
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl">{article.title}</CardTitle>
                        {article.excerpt && <CardDescription className="mt-2">{article.excerpt}</CardDescription>}
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{article.read_time} min read</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {article.is_published && (
                          <Link href={`/articles/${article.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" title="Preview article">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(article)} title="Edit article">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(article.id)}
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  )
}
