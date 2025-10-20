"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText } from "lucide-react"
import type { Article } from "@/lib/api-types"

interface ArticlesClientProps {
  articles: Article[]
}

export function ArticlesClient({ articles }: ArticlesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(articles.map((article) => article.category)))
    return uniqueCategories.map((category) => ({
      name: category,
      count: articles.filter((a) => a.category === category).length,
    }))
  }, [articles])

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles
    return articles.filter((article) => article.category === selectedCategory)
  }, [articles, selectedCategory])

  return (
    <>
      {/* Categories */}
      <div className="mb-16 md:mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">Browse by Category</h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-5">
          {categories.map((category) => (
            <button key={category.name} onClick={() => setSelectedCategory(category.name)} className="text-left">
              <Card
                className={`h-full card-hover border-border/50 transition-all ${
                  selectedCategory === category.name
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:border-primary/30 bg-card/50"
                } backdrop-blur-sm`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-foreground leading-tight block">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {category.count} {category.count === 1 ? "article" : "articles"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
            {selectedCategory ? `${selectedCategory} Articles` : "Latest Articles"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
          </span>
        </div>
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <p className="text-muted-foreground text-lg">
                {selectedCategory
                  ? `No articles found in "${selectedCategory}" category.`
                  : "No articles available at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="h-full card-hover border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-serif group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      <span className="font-medium">{article.read_time} min read</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
