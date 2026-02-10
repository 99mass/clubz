"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Ticket, ShoppingBag } from "lucide-react"
import Image from "next/image"

function StadiumIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7 5L3 7V21H21V7L17 5H7ZM5 9L7 8V19H5V9ZM9 7H15V19H9V7ZM17 8L19 9V19H17V8ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3Z" />
    </svg>
  )
}

function JerseyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.24 3L15 5.4L12 3L9 5.4L7.76 3L3 5V11L5 13V21H19V13L21 11V5L16.24 3ZM7 19V12.5L5 10.5V6.5L6.76 5.5L8 8H16L17.24 5.5L19 6.5V10.5L17 12.5V19H7Z" />
    </svg>
  )
}

interface OnboardingSlide {
  id: number
  image: string
  icon: React.ReactNode
  title: string
  description: string
  accent: string
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    image: "/images/onboarding-1.jpg",
    icon: <StadiumIcon className="h-6 w-6" />,
    title: "Tous les clubs, une seule app",
    description:
      "Du club de quartier aux pros. ASC, Navétanes, Ligue 1... Retrouvez votre club de coeur sur CLUBZ.",
    accent: "Multi-clubs",
  },
  {
    id: 2,
    image: "/images/onboarding-2.jpg",
    icon: <Ticket className="h-6 w-6" />,
    title: "Réservez vos places",
    description:
      "Billets en quelques clics. Choisissez votre tribune, payez via Wave ou Orange Money.",
    accent: "Billetterie digitale",
  },
  {
    id: 3,
    image: "/images/onboarding-3.jpg",
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Vivez votre passion",
    description:
      "Actu, boutique, adhésion... Tout pour supporter votre équipe, même sans compte.",
    accent: "100% Football",
  },
]

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Image section - takes up top portion */}
      <div className="relative h-[55%] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image || "/placeholder.svg"}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Skip button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-foreground/80 bg-background/30 backdrop-blur-sm hover:bg-background/50"
          >
            Passer
          </Button>
        </div>

        {/* Accent badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute bottom-20 left-6 z-10"
          >
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground shadow-lg">
              {slides[currentSlide].icon}
              <span className="text-sm font-semibold">{slides[currentSlide].accent}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col px-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            {/* Title */}
            <h2 className="mb-3 text-2xl font-bold text-foreground text-balance">
              {slides[currentSlide].title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-pretty">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Bottom section */}
        <div className="pb-8 pt-4">
          {/* Progress indicator with football theme */}
          <div className="mb-6 flex items-center justify-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className="relative"
                aria-label={`Aller à la slide ${index + 1}`}
              >
                <motion.div
                  className={`h-2 rounded-full transition-colors duration-300 ${
                    index === currentSlide
                      ? "w-10 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  layout
                />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleNext}
            className="w-full gap-2 bg-primary py-6 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
            size="lg"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <JerseyIcon className="h-5 w-5" />
                Commencer
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
