import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Download } from "lucide-react"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api-client"
import type { Podcast, PaginatedResponse } from "@/lib/api-types"

export const metadata: Metadata = {
  title: "Spiritual Wellness Podcasts - Islamic Healing Discussions",
  description:
    "Listen to insightful podcasts about Islamic spiritual healing, Ruqya practices, and maintaining spiritual wellness. Expert discussions on faith, healing, and spiritual protection.",
  keywords: [
    "Islamic podcasts",
    "Ruqya podcast",
    "spiritual wellness",
    "Islamic healing discussions",
    "faith and healing",
  ],
  openGraph: {
    title: "Spiritual Wellness Podcasts - Islamic Healing Discussions",
    description:
      "Listen to insightful discussions about Islamic spiritual healing, Ruqya practices, and maintaining spiritual wellness.",
    url: "/podcasts",
  },
}

async function getPodcasts(): Promise<Podcast[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Podcast>>("/podcasts?skip=0&limit=100")
    return response.items.filter((podcast) => podcast.is_published)
  } catch (error) {
    console.error("Failed to fetch podcasts:", error)
    return []
  }
}

export default async function PodcastsPage() {
  const podcasts = await getPodcasts()

  return (
    <div className="min-h-screen py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground text-balance">
            Spiritual Wellness Podcasts
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Listen to insightful discussions about Islamic spiritual healing, Ruqya practices, and maintaining spiritual
            wellness in daily life.
          </p>
        </div>

        {/* Podcasts List */}
        {podcasts.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No podcasts available at the moment.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {podcasts.map((podcast) => (
              <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Podcast Image */}
                  {podcast.cover_image_url && (
                    <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={podcast.cover_image_url || "/placeholder.svg"}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Podcast Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <CardTitle className="text-2xl font-serif mb-2">{podcast.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{podcast.description}</CardDescription>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{new Date(podcast.published_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{Math.floor(podcast.duration / 60)} min</span>
                    </div>

                    <div className="flex gap-3">
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        Play Episode
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Subscribe Section */}
        <section className="mt-16 md:mt-20 bg-card rounded-lg p-8 md:p-12 border border-border">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">Subscribe to Our Podcast</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Never miss an episode. Subscribe on your favorite podcast platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button variant="outline" size="lg">
                Apple Podcasts
              </Button>
              <Button variant="outline" size="lg">
                Spotify
              </Button>
              <Button variant="outline" size="lg">
                Google Podcasts
              </Button>
              <Button variant="outline" size="lg">
                RSS Feed
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
