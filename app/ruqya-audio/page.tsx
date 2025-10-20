import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Download, Volume2 } from "lucide-react"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api-client"
import type { Audio, PaginatedResponse } from "@/lib/api-types"

export const metadata: Metadata = {
  title: "Ruqya Audio Library - Authentic Islamic Recitations",
  description:
    "Authentic Ruqya recitations by renowned scholars. Listen to Quranic verses for protection against evil eye, black magic, and jinn possession. Download for personal use.",
  keywords: [
    "Ruqya audio",
    "Islamic recitation",
    "Quran healing",
    "Ruqya MP3",
    "Islamic protection audio",
    "Ayat Al-Kursi",
    "Surah Al-Baqarah",
  ],
  openGraph: {
    title: "Ruqya Audio Library - Authentic Islamic Recitations",
    description: "Authentic Ruqya recitations by renowned scholars. Listen online or download for personal use.",
    url: "/ruqya-audio",
  },
}

async function getAudio(): Promise<Audio[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Audio>>("/audio?skip=0&limit=100")
    return response.items.filter((audio) => audio.is_published)
  } catch (error) {
    console.error("Failed to fetch audio:", error)
    return []
  }
}

export default async function RuqyaAudioPage() {
  const audioCategories = await getAudio()

  return (
    <div className="min-h-screen py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground text-balance">
            Ruqya Audio Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Authentic Ruqya recitations by renowned scholars. Listen online or download for personal use. All
            recitations are based on Qur'an and authentic Sunnah.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-12 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <Volume2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">How to Use Ruqya Audio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Listen with intention and focus. You can play these recitations in your home for protection, listen
                while sleeping, or use them during personal Ruqya sessions. It's recommended to be in a state of wudu
                (ablution) when listening.
              </p>
            </div>
          </div>
        </div>

        {/* Audio Grid */}
        {audioCategories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No audio recitations available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {audioCategories.map((audio) => (
              <Card key={audio.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">{audio.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{audio.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Reciter:</span>
                      <span className="font-medium text-foreground">{audio.reciter}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium text-foreground">{Math.floor(audio.duration / 60)} min</span>
                    </div>
                    {audio.category && (
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium text-foreground">{audio.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Guidelines Section */}
        <section className="mt-16 md:mt-20 bg-card rounded-lg p-8 md:p-12 border border-border">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground text-center">
              Guidelines for Listening
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Intention:</strong> Make the intention to seek healing and
                protection through the words of Allah. Ruqya is a means, and Allah is the ultimate Healer.
              </p>
              <p>
                <strong className="text-foreground">Consistency:</strong> Listen regularly, especially Surah Al-Baqarah
                in your home. The Prophet ﷺ said that Shaytan flees from a house where Surah Al-Baqarah is recited.
              </p>
              <p>
                <strong className="text-foreground">Environment:</strong> Ensure your environment is clean and free from
                prohibited items. Remove images, music instruments, and anything that may prevent angels from entering.
              </p>
              <p>
                <strong className="text-foreground">Belief:</strong> Have firm belief in the power of Allah's words. The
                Qur'an is a healing and mercy for the believers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
