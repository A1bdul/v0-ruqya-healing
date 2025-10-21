"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, ShoppingBag, Headphones, Calendar, Heart, Shield } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

function ExpandableSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-card border border-border/50 rounded-lg hover:border-primary/20 transition-all group"
      >
        <h4 className="text-xl md:text-2xl font-semibold text-foreground text-left">{title}</h4>
        <ChevronDown
          className={`h-6 w-6 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="p-6 bg-muted/20 rounded-lg space-y-4 text-muted-foreground leading-relaxed">{children}</div>
      )}
    </div>
  )
}

function ExpandablePreview({ title, preview, fullContent }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-3xl md:text-4xl font-serif font-semibold text-foreground text-center">{title}</h3>
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8 md:p-10 space-y-6">
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            {isExpanded ? (
              <div className="space-y-4">
                {fullContent.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p>{preview}</p>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors"
          >
            {isExpanded ? "Read Less" : "Read More"}
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HomePage() {
  const quickLinks = [
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Schedule a personal Ruqya session",
      href: "/services",
    },
    {
      icon: ShoppingBag,
      title: "Shop",
      description: "Spiritual healing products",
      href: "/shop",
    },
    {
      icon: Headphones,
      title: "Listen to Ruqya",
      description: "Authentic recitations",
      href: "/ruqya-audio",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Unique & Different Approach",
      description: "Our approach to healing and Ruqyah is very different and unique, focusing on the whole person",
    },
    {
      icon: Heart,
      title: "Multi-Dimensional Healing",
      description:
        "We believe healing is multi-dimensional. All areas of your life must be given attention for true transformation",
    },
    {
      icon: BookOpen,
      title: "Mind, Body & Soul",
      description:
        "We dive into human behaviour, psychology, and emotional wellness to explore how everything is connected",
    },
  ]

  const ruqyahConditions = [
    {
      number: "1",
      title: "Words of Allah",
      description: "It must be with the words of Allah (Qur'an), His names and His attributes",
    },
    {
      number: "2",
      title: "Clear Language",
      description: "It must be in the Arabic language or a language that is clearly understood by the people",
    },
    {
      number: "3",
      title: "Trust in Allah",
      description:
        "To believe that the Ruqyah being done has no benefit by itself, but the benefits and cure are from Allah alone",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative islamic-pattern py-24 md:py-32 lg:py-44">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground leading-[1.1] text-balance tracking-tight">
              Healing through Qur'an and Sunnah
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              Find peace and spiritual wellness through authentic Islamic Ruqya. We offer compassionate guidance rooted
              in the teachings of the Qur'an and Sunnah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild size="lg" className="text-base btn-primary-enhanced shadow-lg hover:shadow-xl">
                <Link href="/services">Book Appointment</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
              >
                <Link href="/articles">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Ruqya Healing */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground text-balance tracking-tight">
              Why Choose Ruqya Healing
            </h2>
            <div className="w-32 h-1.5 bg-primary mx-auto rounded-full"></div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-pretty">
              If you've been following me for a while, you will know that my approach to healing and Ruqyah is very
              different and unique. My philosophy is that healing is multi-dimensional. To truly heal, all areas of your
              life must be given attention. I focus on deep lifestyle change and long-term transformation.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-pretty">
              Most importantly, I look at human behaviour and psychology. I dive into emotional wellness and its impact
              on spiritual progress. Everything is connected, and that's what I like to explore, the mind, body, and
              soul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center space-y-5 group">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-sm">
                  <feature.icon className="h-9 w-9 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Ruqyah */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground text-balance">
                What is Ruqyah?
              </h2>
              <div className="w-32 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 md:p-12 space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  Ruqyah is an Islamic practice of reciting verses from the Qur'an and making supplications to seek
                  healing and protection from ailments, both physical and spiritual.
                </p>
                <p>
                  It is effective against illnesses caused by the evil eye, black magic, and possession by jinn. The
                  practice is rooted in the teachings of the Prophet Muhammad (peace be upon him) and is encouraged in
                  Islamic jurisprudence when performed correctly.
                </p>
                <p className="text-foreground font-semibold text-xl md:text-2xl pt-4">
                  Authentic Ruqyah involves Qur'anic recitation, authentic supplications, and seeking help from Allah
                  alone, free from any form of shirk.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <ExpandablePreview
              title="Our Mission"
              preview="Ruqyah healing is a life mission. I am dedicated to sharing knowledge of the unseen world, raising awareness of the evils of Jinn and black magic, and helping people suffering from affliction. All in accordance with the Qur'an, Sunnah, and authentic teachings of the Prophet (peace be upon him)."
              fullContent={[
                "Ruqyah healing is a life mission. Meaning for the rest of my life I will be sharing knowledge of the unseen world. I will raise awareness of the evils of Jinn and black magic. I will help people that are suffering from affliction in one way or another. All in accordance to the Quran and sunnah and the authentic teachings of the prophet pbuh. Not the nonsense that most people follow due to lack of understanding and knowledge. May Allah accept it from me even when am no more.",
                "My role is to help empower you through knowledge. But help you to understand that your protection and healing requires you to focus on your mind, body and soul.",
                "This takes time. I will be creating much more content and building out Ruqyahhealing teachings over the next few years. With the ultimate goal of having the No. 1 Ruqyah community in the world insha Allah and transforming many more lives.",
                "I want to remind you to always have faith. Do not let fear overcome you. Make dua for those that are afflicted by evil. And keep the people around the world in hard times in your hearts and your duas. Stay away from evil. May Allah make it easy for all those suffering. Ameen",
                "Tell me what you want to see from Ruqyahhealing and how you believe we can help those that are around the world. Give me any suggestions or ideas. This is a spiritual warfare and we must open our eyes to this reality. May Allah protect us all. Ameen",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Understanding Ruqyah - Types & Evidence */}
      <section className="py-24 md:py-32 lg:py-40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">
            {/* Header */}
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground text-balance leading-tight">
                Understanding Ruqyah
              </h2>
              <div className="w-32 h-1.5 bg-primary mx-auto rounded-full"></div>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Learn the difference between legitimate and illegitimate Ruqyah, and how to protect yourself from fake
                healers
              </p>
            </div>

            {/* Ruqyah Shar'iyyah */}
            <div className="space-y-12">
              <div className="text-center space-y-6">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground leading-tight">
                  Ruqyah Shar'iyyah
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
                  Legitimate Islamic Healing
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  This is Ruqyah that is{" "}
                  <span className="text-foreground font-semibold">free from any forms of shirk</span> (associating
                  partners with Allah) and revolves around recitation of the Qur'an, the use of authentic supplications
                  and the seeking of assistance and refuge in Allah (SWT) alone.
                </p>
              </div>

              {/* Three Conditions */}
              <div className="max-w-3xl mx-auto text-center space-y-6 px-4">
                <h4 className="text-2xl md:text-3xl font-serif font-semibold text-foreground leading-tight">
                  Three Essential Conditions
                </h4>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Ruqyah Shar'iyyah should meet 3 conditions as mentioned by the scholars, and it is from their
                  consensus that the legalisation of Ruqyah is achieved when the 3 conditions are met:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 px-4">
                {ruqyahConditions.map((condition) => (
                  <Card
                    key={condition.number}
                    className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                  >
                    <CardContent className="p-10 lg:p-12 space-y-6">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-md mx-auto">
                        {condition.number}
                      </div>
                      <div className="text-center space-y-4">
                        <h4 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">
                          {condition.title}
                        </h4>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                          {condition.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Evidence in Hadith */}
            <div className="max-w-5xl mx-auto space-y-6">
              <ExpandableSection title="Evidence in Hadith">
                <div className="space-y-4">
                  <p>
                    These conditions can be found in 'Fath Al-Bari' and in the sayings of Shaykh al-Islam Ibn Taymiyyah
                    concerning healing the one who is possessed. Evidence can be found in the Sunnah of the Prophet
                    (peace be upon him) in regards to Ruqyah being allowed; this is encouraged in the following Hadith:
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg space-y-3">
                    <p className="text-foreground font-semibold">
                      Awf Ibn Malik al-Ashja'i (RAA) narrated that he said to the Prophet:
                    </p>
                    <p className="italic text-lg">
                      "O Allah's Messenger! We used to do Ruqyah during the days of Jahiliyyah (pre-Islamic era). What
                      do you think of that?"
                    </p>
                    <p className="italic text-lg">
                      He replied: "Present your Ruqyah to me; there is nothing wrong with it as long as it does not
                      involve Shirk." (Sahih Muslim)
                    </p>
                  </div>
                  <p className="font-semibold text-foreground text-lg">
                    Therefore, Ruqyah Shar'iyyah is permissible and legal in Islam.
                  </p>
                </div>
              </ExpandableSection>
            </div>

            {/* Ruqyah Shirk'iyyah */}
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground">
                  Ruqyah Shirk'iyyah
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
                  Illegitimate Ruqyah - Forbidden in Islam
                </p>
              </div>

              <ExpandableSection title="Definition & Dangers" defaultOpen={false}>
                <div className="space-y-4">
                  <p>
                    This type of Ruqyah leads to sin and destruction upon the individual as it involves calling upon
                    other than Allah (SWT). It entails seeking assistance from the Jinn, Magicians, Horoscopes, Charms &
                    Amulets etc.
                  </p>
                  <p className="font-semibold text-foreground">
                    Therefore, it is clear that its practice is completely forbidden in Islam, which is evident from the
                    above Hadeeth of the Prophet (peace be upon him).
                  </p>
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mt-4">
                    <p className="text-foreground font-semibold">
                      Anyone who knows magic has committed shirk. Anyone who believes in their work and accepts their
                      methods has delved into shirk.
                    </p>
                  </div>
                </div>
              </ExpandableSection>
            </div>

            {/* Warning Signs */}
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground">
                  Minor Signs of a Magician/Fake Healer
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Protect yourself by recognizing these warning signs
                </p>
              </div>

              <ExpandableSection title="How to Identify Fraudulent Practitioners" defaultOpen={false}>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-foreground text-lg flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0">1.</span>
                      <span>They tell you to pray salah and recite Quran but then give you a taweez or Amulet</span>
                    </h5>
                    <p className="ml-8">
                      They encourage you to practice this shirk. Because you lack knowledge you blindly follow and you
                      think everything is well because they told you to pray. But you've only been deceived by them
                      making you think what you're doing is good by mixing in Quran with Magic.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold text-foreground text-lg flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0">2.</span>
                      <span>They will slowly get close and get you to trust them</span>
                    </h5>
                    <p className="ml-8">
                      They will listen to your problems and issues and make it seem like they are there to help. Only to
                      use your vulnerability against you until you trust them. That's when they attack and will tell you
                      to practice something not from Islam or the Quran and sunnah. You'll be so deluded in trust that
                      you will follow and listen to anything.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold text-foreground text-lg flex items-start gap-3">
                      <span className="text-primary font-bold shrink-0">3.</span>
                      <span>They will tell you something that no one knows about you</span>
                    </h5>
                    <p className="ml-8">
                      A secret or something extremely private and personal. You've not shared with anyone ever but
                      somehow they know. They use magic and the connection with Jinn to find these kinds of information
                      out. They gain your trust this way.
                    </p>
                  </div>

                  <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg mt-6">
                    <p className="text-foreground font-semibold text-lg text-center">
                      Anyone who knows magic has committed shirk. Anyone who believes in their work and accepts their
                      methods has delved into shirk.
                    </p>
                  </div>

                  <p className="text-lg font-semibold text-foreground pt-4 text-center">
                    Fear Allah and focus on healing through the Quran and sunnah.
                  </p>
                </div>
              </ExpandableSection>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="h-full card-hover border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 islamic-pattern"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-balance tracking-tight">
              Begin Your Healing Journey Today
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed text-pretty">
              Take the first step towards spiritual wellness. Our experienced practitioners are here to guide you with
              authentic Islamic healing.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-base mt-6 shadow-lg hover:shadow-xl">
              <Link href="/services">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
