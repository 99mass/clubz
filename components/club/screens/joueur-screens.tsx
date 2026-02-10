"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Bell, Calendar, ChevronRight, Clock, MapPin,
  Trophy, Users, Activity, Target, Flame, Shield,
  Megaphone, Check, X, Dumbbell, Shirt, Heart,
  TrendingUp, Star, Zap, User, AlertCircle
} from "lucide-react"
import Image from "next/image"
import type { Club, UserRole } from "../club-app"

// ============ TYPES ============
interface PlayerStats {
  matchesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
  rating: number
}

interface TrainingSession {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: "training" | "match" | "recovery" | "meeting"
  status: "upcoming" | "done" | "cancelled"
  isConvocation?: boolean
  convocationStatus?: "convoque" | "reserve" | "absent"
}

interface Teammate {
  id: number
  name: string
  position: string
  number: number
  avatar: string
  isCapitain?: boolean
  isSelf?: boolean
}

interface StaffMember {
  id: number
  name: string
  role: string
  avatar: string
}

interface InternalAnnouncement {
  id: number
  title: string
  message: string
  date: string
  from: string
  type: "convocation" | "info" | "urgent" | "training"
  read: boolean
}

// ============ MOCK DATA ============
const playerStats: PlayerStats = {
  matchesPlayed: 18,
  goals: 7,
  assists: 4,
  yellowCards: 2,
  redCards: 0,
  minutesPlayed: 1420,
  rating: 7.2,
}

const calendarEvents: TrainingSession[] = [
  { id: 1, title: "Entrainement tactique", date: "Lun 10 Fev", time: "09:00", location: "Terrain annexe", type: "training", status: "upcoming" },
  { id: 2, title: "Seance video", date: "Mar 11 Fev", time: "10:00", location: "Salle conference", type: "meeting", status: "upcoming" },
  { id: 3, title: "Entrainement physique", date: "Mer 12 Fev", time: "08:30", location: "Terrain principal", type: "training", status: "upcoming" },
  { id: 4, title: "Match Ligue 1 - Journee 16", date: "Dim 16 Fev", time: "16:00", location: "Stade Leopold Sedar Senghor", type: "match", status: "upcoming", isConvocation: true, convocationStatus: "convoque" },
  { id: 5, title: "Recuperation", date: "Lun 17 Fev", time: "10:00", location: "Centre medical", type: "recovery", status: "upcoming" },
  { id: 6, title: "Entrainement collectif", date: "Mar 18 Fev", time: "09:00", location: "Terrain principal", type: "training", status: "upcoming" },
  { id: 7, title: "Match Coupe du Senegal", date: "Sam 22 Fev", time: "17:00", location: "Stade Demba Diop", type: "match", status: "upcoming", isConvocation: true, convocationStatus: "reserve" },
  { id: 8, title: "Entrainement technique", date: "Jeu 6 Fev", time: "09:00", location: "Terrain principal", type: "training", status: "done" },
  { id: 9, title: "Match Ligue 1 - Journee 15", date: "Dim 2 Fev", time: "16:00", location: "Stade Iba Mar Diop", type: "match", status: "done", isConvocation: true, convocationStatus: "convoque" },
]

const teammates: Teammate[] = [
  { id: 1, name: "Moussa Diallo", position: "Milieu offensif", number: 10, avatar: "MD", isSelf: true },
  { id: 2, name: "Abdoulaye Sow", position: "Gardien", number: 1, avatar: "AS", isCapitain: true },
  { id: 3, name: "Ibrahima Ndiaye", position: "Defenseur central", number: 4, avatar: "IN" },
  { id: 4, name: "Cheikh Mbaye", position: "Defenseur central", number: 5, avatar: "CM" },
  { id: 5, name: "Pape Diop", position: "Lateral droit", number: 2, avatar: "PD" },
  { id: 6, name: "Mamadou Fall", position: "Lateral gauche", number: 3, avatar: "MF" },
  { id: 7, name: "Ousmane Ba", position: "Milieu defensif", number: 6, avatar: "OB" },
  { id: 8, name: "Aliou Cisse", position: "Milieu central", number: 8, avatar: "AC" },
  { id: 9, name: "Babacar Gueye", position: "Ailier droit", number: 7, avatar: "BG" },
  { id: 10, name: "Modou Sarr", position: "Ailier gauche", number: 11, avatar: "MS" },
  { id: 11, name: "El Hadj Diouf", position: "Attaquant", number: 9, avatar: "ED" },
  { id: 12, name: "Seydou Niang", position: "Milieu central", number: 14, avatar: "SN" },
  { id: 13, name: "Amadou Diagne", position: "Defenseur", number: 15, avatar: "AD" },
  { id: 14, name: "Lamine Toure", position: "Attaquant", number: 17, avatar: "LT" },
  { id: 15, name: "Khadim Faye", position: "Gardien", number: 16, avatar: "KF" },
]

const staffMembers: StaffMember[] = [
  { id: 1, name: "Coach Malick Daf", role: "Entraineur principal", avatar: "MD" },
  { id: 2, name: "Lamine Diatta", role: "Entraineur adjoint", avatar: "LD" },
  { id: 3, name: "Dr. Souleymane Ba", role: "Medecin du club", avatar: "SB" },
  { id: 4, name: "Pape Samba Ndiaye", role: "Preparateur physique", avatar: "PN" },
  { id: 5, name: "Ibou Kebe", role: "Entraineur des gardiens", avatar: "IK" },
]

const internalAnnouncements: InternalAnnouncement[] = [
  { id: 1, title: "Convocation - Match vs Casa Sports", message: "Vous etes convoque pour le match de dimanche. Rendez-vous a 13h au stade.", date: "Il y a 2h", from: "Coach Malick Daf", type: "convocation", read: false },
  { id: 2, title: "Changement horaire entrainement", message: "L'entrainement de mercredi est deplace a 08h30 au lieu de 09h00. Terrain principal.", date: "Il y a 5h", from: "Staff technique", type: "training", read: false },
  { id: 3, title: "Reunion d'equipe obligatoire", message: "Reunion importante mardi a 10h en salle de conference. Presence obligatoire de tous les joueurs.", date: "Hier", from: "Direction sportive", type: "urgent", read: true },
  { id: 4, title: "Seance de recuperation", message: "Seance de recuperation prevue lundi matin au centre medical pour les titulaires du dernier match.", date: "Hier", from: "Dr. Souleymane Ba", type: "info", read: true },
  { id: 5, title: "Photos officielles saison", message: "Les photos officielles de la saison seront prises jeudi apres l'entrainement. Tenue officielle obligatoire.", date: "Il y a 2j", from: "Communication", type: "info", read: true },
]

// ============ ICONS HELPERS ============
const eventTypeIcons = {
  training: Dumbbell,
  match: Trophy,
  recovery: Heart,
  meeting: Users,
}

const eventTypeColors = {
  training: "#3B82F6",
  match: "#EF4444",
  recovery: "#10B981",
  meeting: "#8B5CF6",
}

const announcementTypeIcons = {
  convocation: Shirt,
  info: Megaphone,
  urgent: AlertCircle,
  training: Dumbbell,
}

const announcementTypeColors = {
  convocation: "#3B82F6",
  info: "#6B7280",
  urgent: "#EF4444",
  training: "#10B981",
}

// ============ JOUEUR ACCUEIL SCREEN ============
export function JoueurAccueilScreen({ club, onShowNotifications, onShowAnnouncements, onGoToCalendar, onGoToTeam }: {
  club: Club
  onShowNotifications: () => void
  onShowAnnouncements: () => void
  onGoToCalendar: () => void
  onGoToTeam: () => void
}) {
  const nextMatch = calendarEvents.find(e => e.type === "match" && e.status === "upcoming")
  const nextTraining = calendarEvents.find(e => e.type === "training" && e.status === "upcoming")
  const unreadAnnouncements = internalAnnouncements.filter(a => !a.read).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      {/* Player greeting card */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}CC)` }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: `${club.secondaryColor}20` }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold border-2 border-white/30">
              MD
            </div>
            <div>
              <p className="text-sm text-white/70">Bienvenue,</p>
              <h2 className="text-xl font-bold">Moussa Diallo</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/80 bg-white/15 px-2 py-0.5 rounded-full">#10</span>
                <span className="text-xs text-white/80">Milieu offensif</span>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Matchs", value: playerStats.matchesPlayed, icon: Shield },
              { label: "Buts", value: playerStats.goals, icon: Target },
              { label: "Passes D.", value: playerStats.assists, icon: Zap },
              { label: "Note", value: playerStats.rating.toFixed(1), icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                <stat.icon className="w-4 h-4 text-white/70 mx-auto mb-1" />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal announcements preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-foreground">Annonces internes</h2>
            {unreadAnnouncements > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ background: "#EF4444" }}
              >
                {unreadAnnouncements}
              </span>
            )}
          </div>
          <button
            onClick={onShowAnnouncements}
            className="text-sm font-medium"
            style={{ color: club.primaryColor }}
          >
            Voir tout
          </button>
        </div>

        <div className="space-y-2.5">
          {internalAnnouncements.slice(0, 2).map((ann) => {
            const Icon = announcementTypeIcons[ann.type]
            const color = announcementTypeColors[ann.type]
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl border transition-all ${
                  !ann.read ? "bg-card border-border shadow-sm" : "bg-muted/30 border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-semibold text-foreground line-clamp-1 ${!ann.read ? "" : "opacity-70"}`}>
                        {ann.title}
                      </h3>
                      {!ann.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ann.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{ann.from} - {ann.date}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Next events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground">Prochains evenements</h2>
          <button
            onClick={onGoToCalendar}
            className="text-sm font-medium"
            style={{ color: club.primaryColor }}
          >
            Calendrier
          </button>
        </div>

        <div className="space-y-2.5">
          {nextMatch && (
            <div
              className="p-4 rounded-xl border-2 relative overflow-hidden"
              style={{ borderColor: `${club.primaryColor}40` }}
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
                style={{ background: club.primaryColor }}
              />
              <div className="flex items-center gap-3 relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${eventTypeColors.match}15` }}
                >
                  <Trophy className="w-5 h-5" style={{ color: eventTypeColors.match }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{nextMatch.title}</h3>
                  <p className="text-xs text-muted-foreground">{nextMatch.date} - {nextMatch.time}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {nextMatch.location}
                  </p>
                </div>
                {nextMatch.isConvocation && (
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                    style={{ background: nextMatch.convocationStatus === "convoque" ? "#10B981" : "#F59E0B" }}
                  >
                    {nextMatch.convocationStatus === "convoque" ? "Convoque" : "Reserve"}
                  </span>
                )}
              </div>
            </div>
          )}

          {nextTraining && (
            <div className="p-3.5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${eventTypeColors.training}15` }}
                >
                  <Dumbbell className="w-5 h-5" style={{ color: eventTypeColors.training }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{nextTraining.title}</h3>
                  <p className="text-xs text-muted-foreground">{nextTraining.date} - {nextTraining.time}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {nextTraining.location}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { icon: Calendar, label: "Calendrier", action: onGoToCalendar },
          { icon: Users, label: "Equipe", action: onGoToTeam },
          { icon: Megaphone, label: "Annonces", action: onShowAnnouncements },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${club.primaryColor}15` }}
            >
              <item.icon className="w-5 h-5" style={{ color: club.primaryColor }} />
            </div>
            <span className="text-xs font-medium text-foreground">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ============ CALENDRIER JOUEUR SCREEN ============
export function CalendrierJoueurScreen({ club }: { club: Club }) {
  const [filter, setFilter] = useState<"all" | "match" | "training" | "recovery" | "meeting">("all")
  const [selectedEvent, setSelectedEvent] = useState<TrainingSession | null>(null)

  const filteredEvents = calendarEvents.filter(e => {
    if (filter === "all") return true
    return e.type === filter
  })

  const upcomingEvents = filteredEvents.filter(e => e.status === "upcoming")
  const pastEvents = filteredEvents.filter(e => e.status === "done")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      <h2 className="font-bold text-foreground text-lg">Calendrier</h2>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {([
          { key: "all", label: "Tout" },
          { key: "match", label: "Matchs" },
          { key: "training", label: "Entrainements" },
          { key: "recovery", label: "Recuperation" },
          { key: "meeting", label: "Reunions" },
        ] as { key: typeof filter; label: string }[]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: filter === f.key ? club.primaryColor : "var(--muted)",
              color: filter === f.key ? "white" : "var(--muted-foreground)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: club.primaryColor }} />
          A venir
        </h3>
        <div className="space-y-2.5">
          {upcomingEvents.map((event, index) => {
            const Icon = eventTypeIcons[event.type]
            const color = eventTypeColors[event.type]
            return (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  event.type === "match" ? "border-2" : "border-border bg-card"
                }`}
                style={{
                  borderColor: event.type === "match" ? `${color}50` : undefined,
                  background: event.type === "match" ? `${color}05` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm line-clamp-1">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {event.date} - {event.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> {event.location}
                    </p>
                  </div>
                  {event.isConvocation && (
                    <span
                      className="px-2 py-1 rounded-full text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: event.convocationStatus === "convoque" ? "#10B981" : event.convocationStatus === "reserve" ? "#F59E0B" : "#EF4444" }}
                    >
                      {event.convocationStatus === "convoque" ? "Convoque" : event.convocationStatus === "reserve" ? "Reserve" : "Absent"}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Past */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="font-semibold text-muted-foreground text-sm mb-3">Passes</h3>
          <div className="space-y-2 opacity-60">
            {pastEvents.map((event) => {
              const Icon = eventTypeIcons[event.type]
              const color = eventTypeColors[event.type]
              return (
                <div
                  key={event.id}
                  className="p-3 rounded-xl bg-muted/30 border border-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}10` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date} - {event.time}</p>
                    </div>
                    {event.isConvocation && event.convocationStatus === "convoque" && (
                      <Check className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Event Detail Sheet */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailSheet club={club} event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ EVENT DETAIL SHEET ============
function EventDetailSheet({ club, event, onClose }: { club: Club; event: TrainingSession; onClose: () => void }) {
  const Icon = eventTypeIcons[event.type]
  const color = eventTypeColors[event.type]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[70vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-5 pb-8 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                  style={{ background: `${color}15`, color }}
                >
                  {event.type === "training" ? "Entrainement" : event.type === "match" ? "Match" : event.type === "recovery" ? "Recuperation" : "Reunion"}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{event.date}</p>
                <p className="text-xs text-muted-foreground">Date</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{event.time}</p>
                <p className="text-xs text-muted-foreground">Heure</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{event.location}</p>
                <p className="text-xs text-muted-foreground">Lieu</p>
              </div>
            </div>
          </div>

          {event.isConvocation && (
            <div
              className="p-4 rounded-xl border-2"
              style={{ borderColor: event.convocationStatus === "convoque" ? "#10B981" : "#F59E0B", background: event.convocationStatus === "convoque" ? "#10B98108" : "#F59E0B08" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shirt className="w-5 h-5" style={{ color: event.convocationStatus === "convoque" ? "#10B981" : "#F59E0B" }} />
                <span className="font-semibold text-foreground">
                  {event.convocationStatus === "convoque" ? "Vous etes convoque" : "Vous etes reserve"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {event.convocationStatus === "convoque"
                  ? "Presentez-vous au point de rendez-vous 3h avant le coup d'envoi."
                  : "Restez disponible et pret a jouer si necessaire."}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

// ============ TEAM SCREEN ============
export function TeamScreen({ club }: { club: Club }) {
  const [activeSection, setActiveSection] = useState<"joueurs" | "staff">("joueurs")

  // Group players by position
  const goalkeepers = teammates.filter(p => p.position === "Gardien")
  const defenders = teammates.filter(p => p.position.includes("Defenseur") || p.position.includes("Lateral"))
  const midfielders = teammates.filter(p => p.position.includes("Milieu"))
  const forwards = teammates.filter(p => p.position.includes("Attaquant") || p.position.includes("Ailier"))

  const positionGroups = [
    { label: "Gardiens", players: goalkeepers },
    { label: "Defenseurs", players: defenders },
    { label: "Milieux", players: midfielders },
    { label: "Attaquants", players: forwards },
  ].filter(g => g.players.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      <h2 className="font-bold text-foreground text-lg">Equipe</h2>

      {/* Section toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl">
        {(["joueurs", "staff"] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize"
            style={{
              background: activeSection === section ? "var(--background)" : "transparent",
              color: activeSection === section ? club.primaryColor : "var(--muted-foreground)",
              boxShadow: activeSection === section ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {section === "joueurs" ? `Joueurs (${teammates.length})` : `Staff (${staffMembers.length})`}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "joueurs" ? (
          <motion.div
            key="joueurs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-5"
          >
            {positionGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">{group.label}</h3>
                <div className="space-y-2">
                  {group.players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        player.isSelf ? "border-2" : "border-border bg-card"
                      }`}
                      style={{
                        borderColor: player.isSelf ? club.primaryColor : undefined,
                        background: player.isSelf ? `${club.primaryColor}05` : undefined,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: player.isSelf ? club.primaryColor : `${club.primaryColor}15`,
                          color: player.isSelf ? "white" : club.primaryColor,
                        }}
                      >
                        {player.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground text-sm">{player.name}</h4>
                          {player.isCapitain && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">C</span>
                          )}
                          {player.isSelf && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: club.primaryColor }}>Vous</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{player.position}</p>
                      </div>
                      <span
                        className="text-sm font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: `${club.primaryColor}10`, color: club.primaryColor }}
                      >
                        #{player.number}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="staff"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-2.5"
          >
            {staffMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: `${club.secondaryColor}20`, color: club.primaryColor }}
                >
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ ANNOUNCEMENTS SCREEN (overlay) ============
export function AnnouncementsScreen({ club, onBack }: { club: Club; onBack: () => void }) {
  const [announcements, setAnnouncements] = useState(internalAnnouncements)
  const [selectedAnn, setSelectedAnn] = useState<InternalAnnouncement | null>(null)

  const markAsRead = (id: number) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4 pb-20"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-bold text-foreground text-lg">Annonces internes</h2>
      </div>

      <div className="space-y-2.5">
        {announcements.map((ann, index) => {
          const Icon = announcementTypeIcons[ann.type]
          const color = announcementTypeColors[ann.type]
          return (
            <motion.button
              key={ann.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => { setSelectedAnn(ann); markAsRead(ann.id) }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                !ann.read ? "bg-card border-border shadow-sm" : "bg-muted/30 border-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`text-sm font-semibold text-foreground line-clamp-1 ${!ann.read ? "" : "opacity-60"}`}>
                      {ann.title}
                    </h3>
                    {!ann.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{ann.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{ann.from}</span>
                    <span className="text-[10px] text-muted-foreground/50">-</span>
                    <span className="text-[10px] text-muted-foreground">{ann.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Announcement Detail Sheet */}
      <AnimatePresence>
        {selectedAnn && (
          <AnnouncementDetailSheet club={club} announcement={selectedAnn} onClose={() => setSelectedAnn(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ ANNOUNCEMENT DETAIL SHEET ============
function AnnouncementDetailSheet({ club, announcement, onClose }: { club: Club; announcement: InternalAnnouncement; onClose: () => void }) {
  const Icon = announcementTypeIcons[announcement.type]
  const color = announcementTypeColors[announcement.type]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[65vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-5 pb-8 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color }}
                >
                  {announcement.type === "convocation" ? "Convocation" : announcement.type === "urgent" ? "Urgent" : announcement.type === "training" ? "Entrainement" : "Information"}
                </span>
                <h3 className="font-bold text-foreground">{announcement.title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-muted/40">
            <p className="text-sm text-foreground leading-relaxed">{announcement.message}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>De: {announcement.from}</span>
            <span>{announcement.date}</span>
          </div>

          {announcement.type === "convocation" && (
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: club.primaryColor }}
            >
              Confirmer ma presence
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
}
