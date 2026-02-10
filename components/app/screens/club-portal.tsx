"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Bell, Heart, Share2, Calendar, 
  Ticket, ShoppingBag, Users, Trophy, 
  Newspaper, HandHeart, ChevronRight,
  MapPin, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Club {
  id: string
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  supporters: number
  category: "ligue1" | "ligue2" | "navetane"
  region?: string
  zone?: string
}

interface ClubPortalProps {
  club: Club
  onBack: () => void
  isGuest: boolean
  onLogin: () => void
}

type TabId = "accueil" | "actu" | "agenda" | "boutique" | "effectif"

const tabs = [
  { id: "accueil" as TabId, label: "Accueil", icon: Trophy },
  { id: "actu" as TabId, label: "Actualites", icon: Newspaper },
  { id: "agenda" as TabId, label: "Agenda", icon: Calendar },
  { id: "boutique" as TabId, label: "Boutique", icon: ShoppingBag },
  { id: "effectif" as TabId, label: "Effectif", icon: Users },
]

export function ClubPortal({ club, onBack, isGuest, onLogin }: ClubPortalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("accueil")
  const [isFollowing, setIsFollowing] = useState(false)
  const [showDonation, setShowDonation] = useState(false)

  // Upcoming events mock data
  const upcomingEvents = [
    { id: 1, title: `${club.name} vs Adversaire`, date: "Dim 15 Fev", time: "16:00", type: "match", location: "Stade Leopold Sedar Senghor" },
    { id: 2, title: "Entrainement ouvert", date: "Sam 21 Fev", time: "10:00", type: "event", location: "Centre d'entrainement" },
  ]

  // News mock data
  const news = [
    { id: 1, title: "Victoire eclatante face a l'adversaire", excerpt: "Une performance remarquable de toute l'equipe...", image: "/images/club-hero.jpg", date: "Il y a 2h" },
    { id: 2, title: "Nouveau partenariat signe", excerpt: "Le club annonce un accord strategique...", image: "/images/event-match.jpg", date: "Hier" },
  ]

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(180deg, ${club.primaryColor}15 0%, transparent 30%)` 
      }}
    >
      {/* Header with club colors */}
      <div 
        className="relative"
        style={{ 
          background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}DD)` 
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Club info */}
        <div className="flex flex-col items-center pb-6 px-4">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-24 h-24 rounded-full p-1 mb-4"
            style={{ 
              background: `linear-gradient(135deg, ${club.secondaryColor}, ${club.primaryColor})` 
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <Image
                src={club.logo || "/placeholder.svg"}
                alt={club.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Name and info */}
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white text-center mb-1"
          >
            {club.name}
          </motion.h1>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 text-white/80 text-sm mb-4"
          >
            <Users className="w-4 h-4" />
            <span>{club.supporters.toLocaleString()} supporters</span>
            {club.region && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <MapPin className="w-4 h-4" />
                <span>{club.region}</span>
              </>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Button
              onClick={() => isGuest ? onLogin() : setIsFollowing(!isFollowing)}
              className="rounded-full px-6"
              style={{ 
                background: isFollowing ? "white" : club.secondaryColor,
                color: isFollowing ? club.primaryColor : (club.secondaryColor === "#FFFFFF" || club.secondaryColor === "#FFC107" || club.secondaryColor === "#FFEB3B" || club.secondaryColor === "#FFF176" || club.secondaryColor === "#FFAB00" || club.secondaryColor === "#FDD835" ? club.primaryColor : "white")
              }}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
              {isFollowing ? "Suivi" : "Suivre"}
            </Button>
            <Button
              onClick={() => setShowDonation(true)}
              variant="outline"
              className="rounded-full px-6 border-white/30 text-white hover:bg-white/10"
            >
              <HandHeart className="w-4 h-4 mr-2" />
              Soutenir
            </Button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar px-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all mx-1 ${
                activeTab === tab.id
                  ? "bg-white text-foreground"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "accueil" && (
            <motion.div
              key="accueil"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3"
                  style={{ borderColor: `${club.primaryColor}30` }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${club.primaryColor}15` }}
                  >
                    <Ticket className="w-6 h-6" style={{ color: club.primaryColor }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Billetterie</p>
                    <p className="text-xs text-muted-foreground">Prochain match</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3"
                  style={{ borderColor: `${club.primaryColor}30` }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${club.primaryColor}15` }}
                  >
                    <ShoppingBag className="w-6 h-6" style={{ color: club.primaryColor }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Boutique</p>
                    <p className="text-xs text-muted-foreground">Maillots, goodies</p>
                  </div>
                </motion.button>
              </div>

              {/* Upcoming events */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-foreground">Prochains evenements</h2>
                  <button className="text-sm flex items-center gap-1" style={{ color: club.primaryColor }}>
                    Voir tout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-2xl bg-card border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2"
                            style={{ 
                              background: `${club.primaryColor}15`,
                              color: club.primaryColor
                            }}
                          >
                            {event.type === "match" ? <Trophy className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                            {event.type === "match" ? "Match" : "Evenement"}
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full"
                          style={{ 
                            background: club.primaryColor,
                            color: "white"
                          }}
                        >
                          <Ticket className="w-4 h-4 mr-1" />
                          Billets
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Latest news */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-foreground">Actualites</h2>
                  <button className="text-sm flex items-center gap-1" style={{ color: club.primaryColor }}>
                    Voir tout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {news.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex gap-3 p-3 rounded-2xl bg-card border border-border"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                        <p className="text-xs mt-1" style={{ color: club.primaryColor }}>{item.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "actu" && (
            <motion.div
              key="actu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {news.concat(news).map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl bg-card border border-border overflow-hidden"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
                    <p className="text-xs" style={{ color: club.primaryColor }}>{item.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "agenda" && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-foreground">Calendrier des matchs</h2>
              {upcomingEvents.concat(upcomingEvents).map((event, index) => (
                <motion.div
                  key={`${event.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date} a {event.time}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full"
                      style={{ background: club.primaryColor }}
                    >
                      Reserver
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "boutique" && (
            <motion.div
              key="boutique"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-foreground">Boutique officielle</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Maillot Domicile", price: "25 000 FCFA" },
                  { name: "Maillot Exterieur", price: "25 000 FCFA" },
                  { name: "Echarpe", price: "8 000 FCFA" },
                  { name: "Casquette", price: "5 000 FCFA" },
                ].map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl bg-card border border-border"
                  >
                    <div 
                      className="w-full aspect-square rounded-xl mb-3 flex items-center justify-center"
                      style={{ background: `${club.primaryColor}15` }}
                    >
                      <ShoppingBag className="w-12 h-12" style={{ color: club.primaryColor }} />
                    </div>
                    <p className="font-semibold text-foreground text-sm">{product.name}</p>
                    <p className="text-sm" style={{ color: club.primaryColor }}>{product.price}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "effectif" && (
            <motion.div
              key="effectif"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-foreground">Effectif {club.name}</h2>
              <div className="space-y-3">
                {["Gardiens", "Defenseurs", "Milieux", "Attaquants"].map((position) => (
                  <div key={position}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{position}</h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map((player) => (
                        <div
                          key={player}
                          className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                        >
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: club.primaryColor }}
                          >
                            {player}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">Joueur {position} {player}</p>
                            <p className="text-xs text-muted-foreground">{position.slice(0, -1)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
            onClick={() => setShowDonation(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-t-3xl p-6"
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${club.primaryColor}15` }}
                >
                  <HandHeart className="w-6 h-6" style={{ color: club.primaryColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Soutenir {club.name}</h3>
                  <p className="text-sm text-muted-foreground">Contribuez au developpement du club</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {["1 000", "5 000", "10 000"].map((amount) => (
                  <button
                    key={amount}
                    className="p-4 rounded-xl border-2 text-center font-semibold transition-all hover:border-primary"
                    style={{ borderColor: `${club.primaryColor}30` }}
                  >
                    {amount} FCFA
                  </button>
                ))}
              </div>

              <Button
                className="w-full py-6 rounded-xl text-white"
                style={{ background: club.primaryColor }}
                onClick={() => isGuest ? (setShowDonation(false), onLogin()) : setShowDonation(false)}
              >
                {isGuest ? "Se connecter pour donner" : "Confirmer le don"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
