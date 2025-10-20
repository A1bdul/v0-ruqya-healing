"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Product, PaginatedResponse } from "@/lib/api-types"
import { formatPrice } from "@/lib/utils"

export default function ShopPage() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>("/products?skip=0&limit=100")
      setProducts(response.items.filter((p) => p.is_active && p.stock_quantity > 0))
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({ title: "Failed to load products", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: Number.parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-5 mb-16 md:mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground text-balance tracking-tight">
            Spiritual Healing Shop
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Authentic Islamic healing products to support your spiritual wellness journey. All products are prepared
            with care and blessed intentions.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <p className="text-muted-foreground text-lg">No products available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col h-full card-hover border-border/50 hover:border-primary/30 overflow-hidden bg-card/50 backdrop-blur-sm"
              >
                {product.image && (
                  <CardHeader className="p-0">
                    <div className="product-image">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                )}
                <CardContent className="flex-1 p-6 space-y-3">
                  <CardTitle className="text-xl font-serif leading-tight">{product.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-pretty">
                    {product.description}
                  </CardDescription>
                  {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <p className="text-sm text-amber-600 font-medium">Only {product.stock_quantity} left in stock</p>
                  )}
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className="shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <section className="mt-20 md:mt-24 bg-muted/50 rounded-2xl p-10 md:p-14 border border-border/50 shadow-lg">
          <div className="max-w-3xl mx-auto space-y-7">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground text-center tracking-tight">
              About Our Products
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed text-lg prose-enhanced">
              <p>
                All our products are carefully selected and prepared according to Islamic guidelines. We ensure
                authenticity and quality in everything we offer.
              </p>
              <p>
                Many of our products are recited upon with authentic Qur'anic verses and supplications, following the
                Sunnah of the Prophet Muhammad ﷺ.
              </p>
              <p>
                We source our products from trusted suppliers and ensure they meet the highest standards of purity and
                authenticity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
