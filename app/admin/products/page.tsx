"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Product, PaginatedResponse } from "@/lib/api-types"
import { formatPrice } from "@/lib/utils"

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    stock_quantity: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>("/products?skip=0&limit=100", true)
      setProducts(response.items)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({ title: "Failed to load products", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const updated = await apiClient.patch<Product>(`/products/${editingId}`, formData, true)
        setProducts(products.map((p) => (p.id === editingId ? updated : p)))
        toast({ title: "Product updated successfully" })
      } else {
        const newProduct = await apiClient.post<Product>("/products", formData, true)
        setProducts([newProduct, ...products])
        toast({ title: "Product added successfully" })
      }

      setFormData({ name: "", description: "", price: 0, image: "", stock_quantity: 0, is_active: true })
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error("Failed to save product:", error)
      toast({ title: "Failed to save product", variant: "destructive" })
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || "",
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
    })
    setEditingId(product.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await apiClient.delete(`/products/${id}`, true)
      setProducts(products.filter((p) => p.id !== id))
      toast({ title: "Product deleted successfully" })
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({ title: "Failed to delete product", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading products...</p>
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
              <h1 className="text-3xl font-serif font-semibold">Products Management</h1>
              <p className="text-muted-foreground mt-2">Manage your shop products and inventory</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
                <CardDescription>Fill in the product details below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Black Seed Oil"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <RichTextEditor
                      label="Description"
                      value={formData.description}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use the toolbar to format text, add bullet points, and create structured descriptions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg or /uploads/products/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">Enter the full URL or path to the product image</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₦)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                        placeholder="29.99"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Quantity</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.stock_quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, stock_quantity: Number.parseInt(e.target.value) || 0 })
                        }
                        placeholder="100"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active (visible in shop)</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editingId ? "Update" : "Add"} Product</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingId(null)
                        setFormData({
                          name: "",
                          description: "",
                          price: 0,
                          image: "",
                          stock_quantity: 0,
                          is_active: true,
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No products yet. Add your first product!</p>
                </CardContent>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  {product.image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            Stock: {product.stock_quantity}
                          </span>
                          {!product.is_active && (
                            <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                              Inactive
                            </span>
                          )}
                          {product.stock_quantity === 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-sm text-muted-foreground line-clamp-3 product-description"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
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
