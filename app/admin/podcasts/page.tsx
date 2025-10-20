"use client"

import type React from "react"

import { useState } from "react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Plus, Edit, Trash2, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Podcast {
  id: string
  title: string
  description: string
  duration: string
  date: string
  audioUrl: string
  coverImage?: string
}

export default function AdminPodcastsPage() {
  const { toast } = useToast()
  const [podcasts, setPodcasts] = useState<Podcast[]>([
    {
      id: "1",
      title: "Understanding Spiritual Wellness",
      description: "A deep dive into maintaining spiritual health",
      duration: "45:30",
      date: "2024-01-20",
      audioUrl: "/placeholder-audio.mp3",
    },
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!audioFile && !editingId) {
      toast({ title: "Please upload an audio file", variant: "destructive" })
      return
    }

    const audioUrl = audioFile ? URL.createObjectURL(audioFile) : ""
    const coverImage = coverFile ? URL.createObjectURL(coverFile) : undefined

    if (editingId) {
      setPodcasts(
        podcasts.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...formData,
                audioUrl: audioUrl || p.audioUrl,
                coverImage: coverImage || p.coverImage,
              }
            : p,
        ),
      )
      toast({ title: "Podcast updated successfully" })
    } else {
      const newPodcast = {
        id: Date.now().toString(),
        ...formData,
        audioUrl,
        coverImage,
        date: new Date().toISOString().split("T")[0],
      }
      setPodcasts([...podcasts, newPodcast])
      toast({ title: "Podcast uploaded successfully" })
    }

    setFormData({ title: "", description: "", duration: "" })
    setAudioFile(null)
    setCoverFile(null)
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (podcast: Podcast) => {
    setFormData({
      title: podcast.title,
      description: podcast.description,
      duration: podcast.duration,
    })
    setEditingId(podcast.id)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setPodcasts(podcasts.filter((p) => p.id !== id))
    toast({ title: "Podcast deleted successfully" })
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold">Podcasts Management</h1>
              <p className="text-muted-foreground mt-2">Upload and manage podcast episodes</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Podcast
            </Button>
          </div>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Podcast" : "Upload New Podcast"}</CardTitle>
                <CardDescription>Fill in the podcast details and upload audio file</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Episode Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter episode title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 45:30"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the episode"
                      rows={3}
                      required
                    />
                  </div>
                  <FileUpload label="Audio File (MP3)" accept="audio/*" onFileSelect={setAudioFile} value={audioFile} />
                  <FileUpload
                    label="Cover Image (Optional)"
                    accept="image/*"
                    onFileSelect={setCoverFile}
                    value={coverFile}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">{editingId ? "Update" : "Upload"} Podcast</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingId(null)
                        setFormData({ title: "", description: "", duration: "" })
                        setAudioFile(null)
                        setCoverFile(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {podcasts.map((podcast) => (
              <Card key={podcast.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {podcast.coverImage && (
                        <img
                          src={podcast.coverImage || "/placeholder.svg"}
                          alt={podcast.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">{podcast.date}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{podcast.duration}</span>
                        </div>
                        <CardTitle>{podcast.title}</CardTitle>
                        <CardDescription className="mt-2">{podcast.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" title="Play">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(podcast)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(podcast.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  )
}
