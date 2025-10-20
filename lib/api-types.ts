// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// User
export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: "admin" | "user"
  is_active: boolean
  created_at: string
  updated_at: string | null
}

// Auth
export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
  phone?: string
}

// Article - matches ArticleResponse schema
export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string
  author: string
  read_time: number // minutes
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string | null
}

export interface ArticleCreate {
  title: string
  content: string
  excerpt?: string
  category: string
  author: string
  read_time: number
}

export interface ArticleUpdate {
  title?: string
  content?: string
  excerpt?: string
  category?: string
  author?: string
  read_time?: number
  is_published?: boolean
}

// Service - matches ServiceResponse schema
export interface Service {
  id: string
  title: string
  description: string
  icon: string | null
  duration: number // minutes
  price: number
  is_active: boolean
  created_at: string
  updated_at: string | null
}

export interface ServiceCreate {
  title: string
  description: string
  icon?: string
  duration: number
  price: number
}

export interface ServiceUpdate {
  title?: string
  description?: string
  icon?: string
  duration?: number
  price?: number
  is_active?: boolean
}

// Product - matches ProductResponse schema
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string | null // Backend uses 'image', not 'image_url'
  stock_quantity: number // Backend uses 'stock_quantity', not 'stock'
  is_active: boolean
  created_at: string
  updated_at: string | null
}

export interface ProductCreate {
  name: string
  description: string
  price: number
  image?: string
  stock_quantity: number
}

export interface ProductUpdate {
  name?: string
  description?: string
  price?: number
  image?: string
  stock_quantity?: number
  is_active?: boolean
}

// Order - matches OrderResponse schema
export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string | null
  items: OrderItem[]
}

export interface OrderItemCreate {
  product_id: string
  quantity: number
}

export interface OrderCreate {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: string
  items: OrderItemCreate[]
}

export interface OrderUpdate {
  shipping_address?: string
  payment_method?: string
}

export interface OrderStatusUpdate {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}

// Appointment - matches AppointmentResponse schema
export interface Appointment {
  id: string
  user_id: string
  service_id: string
  appointment_date: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes: string | null
  user_name: string
  user_email: string
  user_phone: string | null
  created_at: string
  updated_at: string | null
}

export interface AppointmentCreate {
  service_id: string
  appointment_date: string
  user_name: string
  user_email: string
  user_phone?: string
  notes?: string
}

export interface AppointmentUpdate {
  appointment_date?: string
  status?: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
}

// Chat - matches ChatMessageResponse and ChatSessionResponse schemas
export interface ChatMessage {
  id: string
  session_id: string
  sender: "user" | "admin"
  message: string
  read: boolean
  timestamp: string
}

export interface ChatSession {
  id: string
  user_name: string
  user_email: string
  status: "active" | "closed"
  start_time: string
  last_activity: string
  created_at: string
}

export interface ChatSessionCreate {
  user_name: string
  user_email: string
}

export interface ChatMessageCreate {
  message: string
  sender: "user" | "admin"
}

// Podcast - matches PodcastResponse schema
export interface Podcast {
  id: string
  title: string
  description: string
  duration: number // seconds
  audio_url: string
  cover_image: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string | null
}

export interface PodcastCreate {
  title: string
  description: string
  duration: number
  audio_url: string
  cover_image?: string
}

export interface PodcastUpdate {
  title?: string
  description?: string
  duration?: number
  audio_url?: string
  cover_image?: string
  is_published?: boolean
}

// Audio - matches AudioResponse schema
export interface Audio {
  id: string
  title: string
  reciter: string
  description: string | null
  category: string
  duration: number // seconds
  audio_url: string
  downloads: number
  is_published: boolean
  created_at: string
  updated_at: string | null
}

export interface AudioCreate {
  title: string
  reciter: string
  description?: string
  category: string
  duration: number
  audio_url: string
}

export interface AudioUpdate {
  title?: string
  reciter?: string
  description?: string
  category?: string
  duration?: number
  audio_url?: string
  is_published?: boolean
}

// Upload - matches FileUploadResponse schema
export interface UploadResponse {
  url: string
  filename: string
  size: number
  duration?: number
}

// Admin Dashboard - matches DashboardStats schema
export interface DashboardStats {
  total_users: number
  total_appointments: number
  total_orders: number
  total_products: number
  total_articles: number
  pending_appointments: number
  active_chats: number
  recent_orders: Order[]
  recent_appointments: Appointment[]
  revenue: {
    today: number
    this_week: number
    this_month: number
    this_year: number
  }
}
