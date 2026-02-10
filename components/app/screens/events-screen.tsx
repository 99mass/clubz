"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Clock, Ticket, X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  type: "match" | "event"
  title: string
  date: string
  time: string
  location: string
  image: string
  clubHome?: string
  clubAway?: string
  price?: number
  availableTickets?: number
}

const mockEvents: Event[] = [
  {
    id: "1",
    type: "match",
    title: "ASC Jaraaf vs AS Pikine",
    date: "Sam 15 Fev",
    time: "17:00",
    location: "Stade Leopold Senghor",
    image: "/images/event-match.jpg",
    clubHome: "ASC Jaraaf",
    clubAway: "AS Pikine",
    price: 2000,
    availableTickets: 450,
  },
  {
    id: "2",
    type: "match",
    title: "Casa Sports vs Teungueth FC",
    date: "Dim 16 Fev",
    time: "16:00",
    location: "Stade Aline Sitoe Diatta",
    image: "/images/event-match.jpg",
    clubHome: "Casa Sports",
    clubAway: "Teungueth FC",
    price: 1500,
    availableTickets: 320,
  },
  {
    id: "3",
    type: "event",
    title: "Assemblee generale ASC Jaraaf",
    date: "Mer 19 Fev",
    time: "10:00",
    location: "Siege du club",
    image: "/images/club-hero.jpg",
  },
]

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

function OrangeMoneyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
    </svg>
  )
}

export function EventsScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [ticketCount, setTicketCount] = useState(1)

  const handleBuyTicket = (event: Event) => {
    setSelectedEvent(event)
    setTicketCount(1)
  }

  const closeModal = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">Matchs et evenements a venir</p>
        </div>
      </header>

      {/* Events list */}
      <div className="px-4 py-4 space-y-4">
        {mockEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            {/* Event image */}
            <div className="relative h-36">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              {/* Event type badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.type === "match" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {event.type === "match" ? "Match" : "Evenement"}
                </span>
              </div>

              {/* Date badge */}
              <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                <span className="block text-xs text-muted-foreground">{event.date.split(" ")[0]}</span>
                <span className="block text-lg font-bold text-foreground">{event.date.split(" ")[1]}</span>
                <span className="block text-xs text-muted-foreground">{event.date.split(" ")[2]}</span>
              </div>
            </div>

            {/* Event info */}
            <div className="p-4">
              <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
              
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
              </div>

              {/* Action button */}
              {event.type === "match" && event.price && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">{event.price.toLocaleString()} FCFA</span>
                    <span className="text-xs text-muted-foreground block">
                      {event.availableTickets} places disponibles
                    </span>
                  </div>
                  <Button 
                    onClick={() => handleBuyTicket(event)}
                    className="gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    Acheter
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Billetterie</h2>
                <button
                  onClick={closeModal}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Event summary */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-2">{selectedEvent.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedEvent.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedEvent.time}
                  </span>
                </div>
              </div>

              {/* Ticket quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Nombre de billets
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-foreground w-12 text-center">
                    {ticketCount}
                  </span>
                  <button
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                    className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4 border-t border-border mb-6">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {((selectedEvent.price || 0) * ticketCount).toLocaleString()} FCFA
                </span>
              </div>

              {/* Payment methods */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Mode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-primary bg-primary/5">
                    <WaveIcon className="h-6 w-6 text-[#1BA8F0]" />
                    <span className="font-medium">Wave</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <OrangeMoneyIcon className="h-6 w-6 text-[#FF6600]" />
                    <span className="font-medium">Orange Money</span>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full py-6 text-base font-semibold gap-2">
                <CreditCard className="h-5 w-5" />
                Confirmer le paiement
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
