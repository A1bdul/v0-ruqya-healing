import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api-client"
import type { Article } from "@/lib/api-types"
import { notFound } from "next/navigation"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const article = await apiClient.get<Article>(`/articles/slug/${slug}`)
    return article
  } catch (error) {
    console.error("Failed to fetch article:", error)
    return null
  }
}

async function getRelatedArticles(articleId: string): Promise<Article[]> {
  try {
    const related = await apiClient.get<Article[]>(`/articles/${articleId}/related?limit=3`)
    return related
  } catch (error) {
    console.error("Failed to fetch related articles:", error)
    return []
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: `${article.title} - RuqyaHub`,
    description: article.excerpt || article.title,
    keywords: [article.category, "Ruqya", "Islamic healing", "spiritual wellness"],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.published_at || article.created_at,
      authors: [article.author],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id)

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/articles">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 space-y-4">
            <Badge variant="secondary" className="mb-4">
              {article.category}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground border-t border-border">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.read_time} min read</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-slate dark:prose-invert max-w-none
                       prose-headings:font-serif prose-headings:font-semibold
                       prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                       prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-foreground prose-strong:font-semibold
                       prose-ul:my-6 prose-ol:my-6
                       prose-li:text-foreground prose-li:my-2
                       prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 
                       prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r
                       prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-muted prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Found this article helpful? Share it with others who might benefit.
            </p>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-6xl mx-auto mt-16 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <Badge variant="secondary" className="mb-3 w-fit">
                        {relatedArticle.category}
                      </Badge>
                      <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </CardTitle>
                      {relatedArticle.excerpt && (
                        <CardDescription className="line-clamp-3">
                          {relatedArticle.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{relatedArticle.author}</span>
                        <span>{relatedArticle.read_time} min</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="max-w-4xl mx-auto mt-16 md:mt-20 bg-primary text-primary-foreground rounded-lg p-8 md:p-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold">Stay Updated</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Subscribe to our newsletter for the latest articles on Islamic spiritual healing and Ruqya guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-foreground bg-background border-0 focus:ring-2 focus:ring-accent"
              />
              <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
