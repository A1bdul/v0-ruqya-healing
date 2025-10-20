"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Play, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Audio, PaginatedResponse } from "@/lib/api-types"

const categories = [
  "Surah Recitation",
  "Ruqya for Evil Eye",
  "Ruqya for Black Magic",
  "Ruqya for Jinn",
  "General Ruqya",
]

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function parseDuration(duration: string): number {
  const parts = duration.split(":")
  if (parts.length === 2) {
    const mins = Number.parseInt(parts[0]) || 0
    const secs = Number.parseInt(parts[1]) || 0
    return mins * 60 + secs
  }
  return 0
}

export default function AdminAudioPage() {
  const { toast } = useToast()
  const [audioFiles, setAudioFiles] = useState<Audio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    reciter: "",
    description: "",
    category: "",
    duration: "", // Keep as string for form input
    audio_url: "",
    is_published: true,
  })

  useEffect(() => {
    fetchAudioFiles()
  }, [])

  const fetchAudioFiles = async () => {
    try {
      const response = await apiClient.get<PaginatedResponse<Audio>>("/audio?skip=0&limit=100", true)
      setAudioFiles(response.items)
    } catch (error) {
      console.error("Failed to fetch audio files:", error)
      toast({ title: "Failed to load audio files", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const durationInSeconds = parseDuration(formData.duration)

    if (durationInSeconds === 0) {
      toast({ title: "Please enter a valid duration (MM:SS)", variant: "destructive" })
      return
    }

    const apiData = {
      title: formData.title,
      reciter: formData.reciter,
      description: formData.description || undefined,
      category: formData.category,
      duration: durationInSeconds,
      audio_url: formData.audio_url,
      is_published: formData.is_published,
    }

    try {
      if (editingId) {
        const updated = await apiClient.patch<Audio>(`/audio/${editingId}`, apiData, true)
        setAudioFiles(audioFiles.map((a) => (a.id === editingId ? updated : a)))
        toast({ title: "Audio updated successfully" })
      } else {
        const newAudio = await apiClient.post<Audio>("/audio", apiData, true)
        setAudioFiles([newAudio, ...audioFiles])
        toast({ title: "Audio uploaded successfully" })
      }

      setFormData({
        title: "",
        reciter: "",
        description: "",
        category: "",
        duration: "",
        audio_url: "",
        is_published: true,
      })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error("Failed to save audio:", error)
      toast({ title: "Failed to save audio", variant: "destructive" })
    }
  }

  const handleEdit = (audio: Audio) => {
    setFormData({
      title: audio.title,
      reciter: audio.reciter,
      description: audio.description || "",
      category: audio.category,
      duration: formatDuration(audio.duration), // Convert seconds to MM:SS
      audio_url: audio.audio_url,
      is_published: audio.is_published,
    })
    setEditingId(audio.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this audio file?")) return

    try {
      await apiClient.delete(`/audio/${id}`, true)
      setAudioFiles(audioFiles.filter((a) => a.id !== id))
      toast({ title: "Audio deleted successfully" })
    } catch (error) {
      console.error("Failed to delete audio:", error)
      toast({ title: "Failed to delete audio", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading audio files...</p>
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
              <h1 className="text-3xl font-serif font-semibold">Ruqya Audio Management</h1>
              <p className="text-muted-foreground mt-2">Upload and manage Ruqya audio recitations</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Audio
            </Button>
          </div>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Audio" : "Upload New Audio"}</CardTitle>
                <CardDescription>Fill in the audio details and upload file</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Audio Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Ayat Al-Kursi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reciter">Reciter Name</Label>
                      <Input
                        id="reciter"
                        value={formData.reciter}
                        onChange={(e) => setFormData({ ...formData, reciter: e.target.value })}
                        placeholder="e.g., Sheikh Mishary Rashid"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (MM:SS)</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 3:45"
                        pattern="[0-9]+:[0-5][0-9]"
                        required
                      />
                      <p className="text-xs text-muted-foreground">Format: minutes:seconds (e.g., 3:45)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the audio"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audio_url">Audio URL</Label>
                    <Input
                      id="audio_url"
                      value={formData.audio_url}
                      onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                      placeholder="/uploads/audio/file.mp3 or https://example.com/audio.mp3"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the path or URL to the audio file (upload via file upload endpoint first)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published">Published (visible to users)</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editingId ? "Update" : "Upload"} Audio</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingId(null)
                        setFormData({
                          title: "",
                          reciter: "",
                          description: "",
                          category: "",
                          duration: "",
                          audio_url: "",
                          is_published: true,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {audioFiles.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No audio files yet. Upload your first audio!</p>
                </CardContent>
              </Card>
            ) : (
              audioFiles.map((audio) => (
                <Card key={audio.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {audio.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatDuration(audio.duration)}</span>
                          {!audio.is_published && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                              Draft
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg">{audio.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">by {audio.reciter}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" title="Play" asChild>
                          <a href={audio.audio_url} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(audio)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(audio.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {audio.description && <p className="text-sm text-muted-foreground mb-3">{audio.description}</p>}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{audio.downloads} downloads</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  )
}
