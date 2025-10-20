import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api-client"
import type { Article, PaginatedResponse } from "@/lib/api-types"
import { ArticlesClient } from "@/components/articles-client"

export const metadata: Metadata = {
  title: "Articles & Resources - Islamic Spiritual Healing",
  description:
    "Educational articles about Islamic spiritual healing, Ruqya practices, protection from evil eye, black magic, jinn possession, and spiritual wellness guidance.",
  keywords: [
    "Ruqya articles",
    "Islamic healing guide",
    "evil eye protection",
    "black magic cure",
    "jinn possession",
    "spiritual wellness",
    "Islamic resources",
  ],
  openGraph: {
    title: "Articles & Resources - Islamic Spiritual Healing",
    description:
      "Educational articles about Islamic spiritual healing, Ruqya practices, and protection from spiritual harm.",
    url: "/articles",
  },
}

async function getArticles(): Promise<Article[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Article>>("/articles?skip=0&limit=100")
    return response.items.filter((article) => article.is_published)
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return []
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="min-h-screen py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-5 mb-16 md:mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground text-balance tracking-tight">
            Articles & Resources
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Educational content about Islamic spiritual healing, Ruqya practices, and protection from spiritual harm.
          </p>
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <p className="text-muted-foreground text-lg">No articles available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <ArticlesClient articles={articles} />
        )}

        {/* Newsletter */}
        <section className="mt-20 md:mt-24 bg-primary text-primary-foreground rounded-2xl p-10 md:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 islamic-pattern"></div>
          </div>
          <div className="max-w-2xl mx-auto text-center space-y-7 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight">Stay Updated</h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed text-pretty">
              Subscribe to our newsletter for the latest articles, Ruqya tips, and Islamic spiritual wellness guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-lg text-foreground bg-background border-0 focus:ring-2 focus:ring-accent shadow-md"
              />
              <button className="px-7 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
