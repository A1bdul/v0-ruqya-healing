import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Video, Users, BookOpen, GraduationCap, MessageCircle, Eye, Shield, Flame, Home } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api-client"
import type { Service, PaginatedResponse } from "@/lib/api-types"
import { formatPrice } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Ruqya Services - Islamic Spiritual Healing",
  description:
    "Comprehensive Islamic Ruqya services including in-person appointments, online consultations, group sessions, and educational workshops. Authentic healing through Qur'an and Sunnah.",
  keywords: [
    "Ruqya services",
    "Islamic healing",
    "spiritual consultation",
    "Ruqya appointment",
    "online Ruqya",
    "group Ruqya",
    "Ruqya workshop",
  ],
  openGraph: {
    title: "Ruqya Services - Islamic Spiritual Healing",
    description:
      "Comprehensive Islamic Ruqya services including in-person appointments, online consultations, group sessions, and educational workshops.",
    url: "/services",
  },
}

async function getServices(): Promise<Service[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Service>>("/services?skip=0&limit=100")
    return response.items.filter((service) => service.is_active)
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return []
  }
}

// Map icon strings to Lucide components
const iconMap: Record<string, any> = {
  calendar: Calendar,
  video: Video,
  users: Users,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  "message-circle": MessageCircle,
  eye: Eye,
  shield: Shield,
  flame: Flame,
  home: Home,
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-5 mb-16 md:mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground text-balance tracking-tight">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Comprehensive Islamic spiritual healing services tailored to your needs. All services are conducted
            according to authentic Qur'an and Sunnah.
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <p className="text-muted-foreground text-lg">No services available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => {
              const IconComponent = (service.icon && iconMap[service.icon]) || Calendar

              return (
                <Card
                  key={service.id}
                  className="flex flex-col h-full card-hover border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif leading-tight">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-pretty">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{service.duration} minutes</span>
                      <span className="font-bold text-primary text-2xl">{formatPrice(service.price)}</span>
                    </div>
                    <Button className="w-full btn-primary-enhanced shadow-md hover:shadow-lg" asChild>
                      <Link href="#book">Book Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Booking Section */}
        <section
          id="book"
          className="mt-20 md:mt-24 bg-muted/50 rounded-2xl p-10 md:p-14 border border-border/50 shadow-lg"
        >
          <div className="max-w-2xl mx-auto text-center space-y-7">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground tracking-tight">
              Ready to Begin?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              Contact us to schedule your appointment or ask any questions about our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="btn-primary-enhanced shadow-md hover:shadow-lg" asChild>
                <Link href="mailto:info@ruqyahealinghub.com">Email Us</Link>
              </Button>
              <Button size="lg" variant="outline" className="shadow-md hover:shadow-lg bg-background" asChild>
                <Link href="tel:+15551234567">Call Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
