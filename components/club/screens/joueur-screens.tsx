"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Calendar, ChevronRight, Clock, MapPin,
  Trophy, Users, Activity, Target, Flame, Shield,
  Megaphone, Check, X, Dumbbell, Shirt, Heart,
  TrendingUp, Star, Zap, AlertCircle, Ruler, Weight, Footprints, Award
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
  opponentIndex?: number
  isHome?: boolean
  competition?: string
}

interface Teammate {
  id: number
  name: string
  position: string
  number: number
  avatar: string
  profileImage: string
  isCapitain?: boolean
  isSelf?: boolean
  age?: number
  height?: string
  weight?: string
  foot?: string
  nationality?: string
  goals?: number
  assists?: number
  matches?: number
  rating?: number
  careerClubs?: { club: string; years: string; matches: number; goals: number }[]
}

interface StaffMember {
  id: number
  name: string
  role: string
  avatar: string
  profileImage: string
  experience?: string
  specialty?: string
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
  { id: 4, title: "Match Ligue 1 - Journee 16", date: "Dim 16 Fev", time: "16:00", location: "Stade Leopold Sedar Senghor", type: "match", status: "upcoming", isConvocation: true, convocationStatus: "convoque", opponentIndex: 0, isHome: true, competition: "Ligue 1" },
  { id: 5, title: "Recuperation", date: "Lun 17 Fev", time: "10:00", location: "Centre medical", type: "recovery", status: "upcoming" },
  { id: 6, title: "Entrainement collectif", date: "Mar 18 Fev", time: "09:00", location: "Terrain principal", type: "training", status: "upcoming" },
  { id: 7, title: "Match Coupe du Senegal", date: "Sam 22 Fev", time: "17:00", location: "Stade Demba Diop", type: "match", status: "upcoming", isConvocation: true, convocationStatus: "reserve", opponentIndex: 1, isHome: false, competition: "Coupe du Senegal" },
  { id: 8, title: "Entrainement technique", date: "Jeu 6 Fev", time: "09:00", location: "Terrain principal", type: "training", status: "done" },
  { id: 9, title: "Match Ligue 1 - Journee 15", date: "Dim 2 Fev", time: "16:00", location: "Stade Iba Mar Diop", type: "match", status: "done", isConvocation: true, convocationStatus: "convoque", opponentIndex: 2, isHome: false, competition: "Ligue 1" },
]

const teammates: Teammate[] = [
  { id: 1, name: "Moussa Diallo", position: "Milieu offensif", number: 10, avatar: "MD", profileImage: "/images/players/player-01.jpg", isSelf: true, age: 24, height: "1m78", weight: "72kg", foot: "Droit", nationality: "Senegalais", goals: 7, assists: 4, matches: 18, rating: 7.2, careerClubs: [{ club: "ASC Jaraaf", years: "2023-present", matches: 42, goals: 14 }, { club: "US Goree", years: "2021-2023", matches: 38, goals: 8 }, { club: "Academie Diambars", years: "2018-2021", matches: 52, goals: 11 }] },
  { id: 2, name: "Abdoulaye Sow", position: "Gardien", number: 1, avatar: "AS", profileImage: "/images/players/player-02.jpg", isCapitain: true, age: 28, height: "1m88", weight: "82kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 0, matches: 22, rating: 7.5, careerClubs: [{ club: "ASC Jaraaf", years: "2020-present", matches: 95, goals: 0 }, { club: "Ndiambour", years: "2017-2020", matches: 65, goals: 0 }] },
  { id: 3, name: "Ibrahima Ndiaye", position: "Defenseur central", number: 4, avatar: "IN", profileImage: "/images/players/player-03.jpg", age: 26, height: "1m85", weight: "80kg", foot: "Gauche", nationality: "Senegalais", goals: 1, assists: 0, matches: 20, rating: 7.0 },
  { id: 4, name: "Cheikh Mbaye", position: "Defenseur central", number: 5, avatar: "CM", profileImage: "/images/players/player-04.jpg", age: 25, height: "1m83", weight: "78kg", foot: "Droit", nationality: "Senegalais", goals: 2, assists: 1, matches: 19, rating: 6.8 },
  { id: 5, name: "Pape Diop", position: "Lateral droit", number: 2, avatar: "PD", profileImage: "/images/players/player-05.jpg", age: 23, height: "1m75", weight: "70kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 5, matches: 17, rating: 6.9 },
  { id: 6, name: "Mamadou Fall", position: "Lateral gauche", number: 3, avatar: "MF", profileImage: "/images/players/player-06.jpg", age: 22, height: "1m77", weight: "71kg", foot: "Gauche", nationality: "Senegalais", goals: 1, assists: 3, matches: 16, rating: 6.7 },
  { id: 7, name: "Ousmane Ba", position: "Milieu defensif", number: 6, avatar: "OB", profileImage: "/images/players/player-07.jpg", age: 27, height: "1m80", weight: "76kg", foot: "Droit", nationality: "Senegalais", goals: 1, assists: 2, matches: 21, rating: 7.1 },
  { id: 8, name: "Aliou Cisse", position: "Milieu central", number: 8, avatar: "AC", profileImage: "/images/players/player-03.jpg", age: 24, height: "1m76", weight: "73kg", foot: "Droit", nationality: "Senegalais", goals: 3, assists: 4, matches: 18, rating: 7.0 },
  { id: 9, name: "Babacar Gueye", position: "Ailier droit", number: 7, avatar: "BG", profileImage: "/images/players/player-05.jpg", age: 21, height: "1m73", weight: "68kg", foot: "Droit", nationality: "Senegalais", goals: 5, assists: 3, matches: 17, rating: 7.3 },
  { id: 10, name: "Modou Sarr", position: "Ailier gauche", number: 11, avatar: "MS", profileImage: "/images/players/player-06.jpg", age: 22, height: "1m74", weight: "69kg", foot: "Gauche", nationality: "Senegalais", goals: 4, assists: 6, matches: 19, rating: 7.1 },
  { id: 11, name: "El Hadj Diouf", position: "Attaquant", number: 9, avatar: "ED", profileImage: "/images/players/player-07.jpg", age: 26, height: "1m82", weight: "77kg", foot: "Droit", nationality: "Senegalais", goals: 12, assists: 2, matches: 20, rating: 7.6 },
  { id: 12, name: "Seydou Niang", position: "Milieu central", number: 14, avatar: "SN", profileImage: "/images/players/player-04.jpg", age: 23, height: "1m79", weight: "74kg", foot: "Droit", nationality: "Senegalais", goals: 2, assists: 1, matches: 12, rating: 6.5 },
  { id: 13, name: "Amadou Diagne", position: "Defenseur", number: 15, avatar: "AD", profileImage: "/images/players/player-02.jpg", age: 21, height: "1m86", weight: "79kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 0, matches: 8, rating: 6.3 },
  { id: 14, name: "Lamine Toure", position: "Attaquant", number: 17, avatar: "LT", profileImage: "/images/players/player-01.jpg", age: 20, height: "1m80", weight: "73kg", foot: "Gauche", nationality: "Senegalais", goals: 3, assists: 1, matches: 10, rating: 6.8 },
  { id: 15, name: "Khadim Faye", position: "Gardien", number: 16, avatar: "KF", profileImage: "/images/players/player-03.jpg", age: 20, height: "1m90", weight: "83kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 0, matches: 2, rating: 6.0 },
]

const staffMembers: StaffMember[] = [
  { id: 1, name: "Coach Malick Daf", role: "Entraineur principal", avatar: "MD", profileImage: "/images/players/coach-01.jpg", experience: "15 ans", specialty: "Tactique et strategie" },
  { id: 2, name: "Lamine Diatta", role: "Entraineur adjoint", avatar: "LD", profileImage: "/images/players/player-06.jpg", experience: "10 ans", specialty: "Preparation offensive" },
  { id: 3, name: "Dr. Souleymane Ba", role: "Medecin du club", avatar: "SB", profileImage: "/images/players/player-04.jpg", experience: "12 ans", specialty: "Medecine du sport" },
  { id: 4, name: "Pape Samba Ndiaye", role: "Preparateur physique", avatar: "PN", profileImage: "/images/players/player-07.jpg", experience: "8 ans", specialty: "Condition physique" },
  { id: 5, name: "Ibou Kebe", role: "Entraineur des gardiens", avatar: "IK", profileImage: "/images/players/player-02.jpg", experience: "6 ans", specialty: "Gardiens de but" },
]

const internalAnnouncements: InternalAnnouncement[] = [
  { id: 1, title: "Convocation - Match vs Casa Sports", message: "Vous etes convoque pour le match de dimanche. Rendez-vous a 13h au stade.", date: "Il y a 2h", from: "Coach Malick Daf", type: "convocation", read: false },
  { id: 2, title: "Changement horaire entrainement", message: "L'entrainement de mercredi est deplace a 08h30 au lieu de 09h00. Terrain principal.", date: "Il y a 5h", from: "Staff technique", type: "training", read: false },
  { id: 3, title: "Reunion d'equipe obligatoire", message: "Reunion importante mardi a 10h en salle de conference. Presence obligatoire de tous les joueurs.", date: "Hier", from: "Direction sportive", type: "urgent", read: true },
  { id: 4, title: "Seance de recuperation", message: "Seance de recuperation prevue lundi matin au centre medical pour les titulaires du dernier match.", date: "Hier", from: "Dr. Souleymane Ba", type: "info", read: true },
  { id: 5, title: "Photos officielles saison", message: "Les photos officielles de la saison seront prises jeudi apres l'entrainement. Tenue officielle obligatoire.", date: "Il y a 2j", from: "Communication", type: "info", read: true },
]

// ============ ICONS/COLORS ============
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

// ============ MATCH CARD (reusable, same style as AccueilScreen/AgendaScreen) ============
function MatchCard({ club, allClubs, event, compact }: { club: Club; allClubs: Club[]; event: TrainingSession; compact?: boolean }) {
  const opponents = allClubs.filter(c => c.category === club.category && c.id !== club.id)
  const opponent = event.opponentIndex !== undefined ? opponents[event.opponentIndex] || opponents[0] || null : null
  const homeTeam = event.isHome ? club : opponent
  const awayTeam = event.isHome ? opponent : club

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${club.primaryColor}15, ${club.secondaryColor}15)` }}
    >
      <div className={compact ? "p-3.5" : "p-4"}>
        {/* Top badges */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: club.primaryColor, color: "white" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {event.isHome ? "Domicile" : "Exterieur"}
          </div>
          <div className="flex items-center gap-2">
            {event.isConvocation && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                style={{ background: event.convocationStatus === "convoque" ? "#10B981" : "#F59E0B" }}
              >
                {event.convocationStatus === "convoque" ? "Convoque" : "Reserve"}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{event.date} - {event.time}</span>
          </div>
        </div>

        {/* Teams VS display */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className={`${compact ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"} rounded-full bg-white p-0.5 shadow-lg flex-shrink-0`}>
              <Image
                src={homeTeam?.logo || "/placeholder.svg"}
                alt={homeTeam?.name || "Equipe"}
                width={56} height={56}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className={`font-bold text-foreground ${compact ? "text-[11px]" : "text-xs sm:text-sm"} text-center mt-1.5 line-clamp-1`}>
              {homeTeam?.name || "A determiner"}
            </p>
          </div>

          <div className="flex flex-col items-center px-2 flex-shrink-0">
            <p className={`${compact ? "text-base" : "text-lg sm:text-xl"} font-bold text-foreground`}>VS</p>
            {event.competition && (
              <span
                className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium border whitespace-nowrap"
                style={{ borderColor: `${club.primaryColor}50`, color: club.primaryColor }}
              >
                {event.competition}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className={`${compact ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"} rounded-full bg-white p-0.5 shadow-lg flex-shrink-0`}>
              <Image
                src={awayTeam?.logo || "/placeholder.svg"}
                alt={awayTeam?.name || "Equipe"}
                width={56} height={56}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className={`font-bold text-foreground ${compact ? "text-[11px]" : "text-xs sm:text-sm"} text-center mt-1.5 line-clamp-1`}>
              {awayTeam?.name || "A determiner"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-border/50">
          <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground truncate">{event.location}</p>
        </div>
      </div>
    </div>
  )
}

// ============ JOUEUR ACCUEIL SCREEN ============
export function JoueurAccueilScreen({ club, allClubs, onShowNotifications, onShowAnnouncements, onGoToCalendar, onGoToTeam }: {
  club: Club
  allClubs: Club[]
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
      className="space-y-5 pb-24"
    >
      {/* Hero banner with player image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src="/images/player-hero.jpg"
          alt="Joueur"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${club.primaryColor}, transparent 70%)` }} />

        {/* Player info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/70 text-sm">Bienvenue,</p>
              <h1 className="text-white text-2xl font-bold">Moussa Diallo</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-semibold">#10</span>
                <span className="text-xs text-white/80">Milieu offensif</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-lg">
              <Image src={club.logo || "/placeholder.svg"} alt={club.name} width={48} height={48} className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 -mt-4 relative z-10">
        <div
          className="rounded-2xl p-3 grid grid-cols-4 gap-2 border border-border shadow-lg"
          style={{ background: "var(--card)" }}
        >
          {[
            { label: "Matchs", value: playerStats.matchesPlayed, icon: Shield, color: club.primaryColor },
            { label: "Buts", value: playerStats.goals, icon: Target, color: "#EF4444" },
            { label: "Passes D.", value: playerStats.assists, icon: Zap, color: "#F59E0B" },
            { label: "Note", value: playerStats.rating.toFixed(1), icon: Star, color: "#10B981" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-1.5">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next match - full card with team logos */}
      {nextMatch && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: club.primaryColor }} />
              <h2 className="font-bold text-foreground">Prochain match</h2>
            </div>
            <button onClick={onGoToCalendar} className="text-sm font-medium" style={{ color: club.primaryColor }}>
              Calendrier
            </button>
          </div>
          <MatchCard club={club} allClubs={allClubs} event={nextMatch} />
        </div>
      )}

      {/* Announcements section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-foreground">Annonces internes</h2>
            {unreadAnnouncements > 0 && (
              <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "#EF4444" }}>
                {unreadAnnouncements}
              </span>
            )}
          </div>
          <button onClick={onShowAnnouncements} className="text-sm font-medium" style={{ color: club.primaryColor }}>
            Voir tout
          </button>
        </div>

        <div className="space-y-2">
          {internalAnnouncements.filter(a => !a.read).slice(0, 2).map((ann) => {
            const Icon = announcementTypeIcons[ann.type]
            const color = announcementTypeColors[ann.type]
            return (
              <motion.button
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onShowAnnouncements}
                className="w-full text-left p-3.5 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1 flex-1">{ann.title}</h3>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ann.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{ann.from} - {ann.date}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Next training with image */}
      {nextTraining && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Prochain entrainement</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <div className="relative h-28 overflow-hidden">
              <Image
                src="/images/training-session.jpg"
                alt="Entrainement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{nextTraining.title}</h3>
                  <p className="text-xs text-white/80">{nextTraining.date} - {nextTraining.time}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                  A venir
                </span>
              </div>
            </div>
            <div className="p-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{nextTraining.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: Calendar, label: "Calendrier", action: onGoToCalendar, color: "#3B82F6" },
            { icon: Users, label: "Equipe", action: onGoToTeam, color: "#10B981" },
            { icon: Megaphone, label: "Annonces", action: onShowAnnouncements, color: "#8B5CF6" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-card border border-border hover:shadow-md transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}12` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============ CALENDRIER JOUEUR SCREEN ============
export function CalendrierJoueurScreen({ club, allClubs }: { club: Club; allClubs: Club[] }) {
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
      className="space-y-5 pb-24"
    >
      {/* Header with training image */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src="/images/training-session.jpg"
          alt="Calendrier"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="font-bold text-foreground text-xl">Calendrier</h2>
          <p className="text-sm text-muted-foreground">{upcomingEvents.length} evenements a venir</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-4">
        {([
          { key: "all", label: "Tout", count: calendarEvents.filter(e => e.status === "upcoming").length },
          { key: "match", label: "Matchs", count: calendarEvents.filter(e => e.type === "match" && e.status === "upcoming").length },
          { key: "training", label: "Entrainements", count: calendarEvents.filter(e => e.type === "training" && e.status === "upcoming").length },
          { key: "recovery", label: "Recuperation", count: calendarEvents.filter(e => e.type === "recovery" && e.status === "upcoming").length },
          { key: "meeting", label: "Reunions", count: calendarEvents.filter(e => e.type === "meeting" && e.status === "upcoming").length },
        ] as { key: typeof filter; label: string; count: number }[]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: filter === f.key ? club.primaryColor : "var(--card)",
              color: filter === f.key ? "white" : "var(--muted-foreground)",
              border: filter === f.key ? "none" : "1px solid var(--border)",
            }}
          >
            {f.label}
            {f.count > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{
                  background: filter === f.key ? "rgba(255,255,255,0.25)" : `${club.primaryColor}15`,
                  color: filter === f.key ? "white" : club.primaryColor,
                }}
              >
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="px-4">
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: club.primaryColor }} />
          A venir
        </h3>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => {
            if (event.type === "match") {
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer"
                >
                  <MatchCard club={club} allClubs={allClubs} event={event} compact />
                </motion.div>
              )
            }
            const Icon = eventTypeIcons[event.type]
            const color = eventTypeColors[event.type]
            return (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left p-3.5 rounded-2xl bg-card border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}12` }}
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
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.button>
            )
          })}
          {upcomingEvents.length === 0 && (
            <div className="py-10 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun evenement a venir</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="px-4">
          <h3 className="font-semibold text-muted-foreground text-sm mb-3">Passes</h3>
          <div className="space-y-2 opacity-60">
            {pastEvents.map((event) => {
              if (event.type === "match") {
                return (
                  <div key={event.id} className="opacity-70">
                    <MatchCard club={club} allClubs={allClubs} event={event} compact />
                  </div>
                )
              }
              const Icon = eventTypeIcons[event.type]
              const color = eventTypeColors[event.type]
              return (
                <div key={event.id} className="p-3 rounded-xl bg-muted/30 border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}10` }}>
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
          <EventDetailSheet club={club} allClubs={allClubs} event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ EVENT DETAIL SHEET ============
function EventDetailSheet({ club, allClubs, event, onClose }: { club: Club; allClubs: Club[]; event: TrainingSession; onClose: () => void }) {
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
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-5 pb-8 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: `${color}15`, color }}>
                  {event.type === "training" ? "Entrainement" : event.type === "match" ? "Match" : event.type === "recovery" ? "Recuperation" : "Reunion"}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {event.type === "match" && (
            <MatchCard club={club} allClubs={allClubs} event={event} />
          )}

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

// ============ PLAYER DETAIL BOTTOM SHEET ============
function PlayerDetailSheet({ player, club, onClose }: { player: Teammate; club: Club; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"profil" | "stats" | "parcours">("profil")

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
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[88vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Player header with image */}
        <div className="relative px-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 flex-shrink-0"
                style={{ borderColor: club.primaryColor }}
              >
                <Image
                  src={player.profileImage}
                  alt={player.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{player.name}</h3>
                  {player.isCapitain && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600">CAP</span>
                  )}
                  {player.isSelf && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: club.primaryColor }}>Vous</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{player.position}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}
                  >
                    #{player.number}
                  </span>
                  {player.nationality && (
                    <span className="text-xs text-muted-foreground">{player.nationality}</span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 mb-4">
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {(["profil", "stats", "parcours"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                style={{
                  background: activeTab === tab ? "var(--background)" : "transparent",
                  color: activeTab === tab ? club.primaryColor : "var(--muted-foreground)",
                  boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {tab === "profil" ? "Profil" : tab === "stats" ? "Statistiques" : "Parcours"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5 pb-8">
          <AnimatePresence mode="wait">
            {activeTab === "profil" && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Caracteristiques physiques</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Ruler, label: "Taille", value: player.height || "-", color: "#3B82F6" },
                    { icon: Weight, label: "Poids", value: player.weight || "-", color: "#EF4444" },
                    { icon: Footprints, label: "Pied fort", value: player.foot || "-", color: "#10B981" },
                    { icon: Calendar, label: "Age", value: player.age ? `${player.age} ans` : "-", color: "#F59E0B" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12` }}>
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-bold text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pt-2">Informations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <span className="text-sm text-muted-foreground">Poste</span>
                    <span className="text-sm font-semibold text-foreground">{player.position}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <span className="text-sm text-muted-foreground">Numero</span>
                    <span className="text-sm font-semibold text-foreground">#{player.number}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <span className="text-sm text-muted-foreground">Nationalite</span>
                    <span className="text-sm font-semibold text-foreground">{player.nationality || "-"}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Saison en cours</h4>
                
                {/* Rating big display */}
                {player.rating && (
                  <div className="flex items-center justify-center py-4">
                    <div className="relative">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center border-4"
                        style={{ borderColor: player.rating >= 7 ? "#10B981" : player.rating >= 6 ? "#F59E0B" : "#EF4444" }}
                      >
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{player.rating.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">Note moy.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Shield, label: "Matchs joues", value: player.matches ?? 0, color: club.primaryColor },
                    { icon: Target, label: "Buts", value: player.goals ?? 0, color: "#EF4444" },
                    { icon: Zap, label: "Passes dec.", value: player.assists ?? 0, color: "#F59E0B" },
                    { icon: Star, label: "Titularisations", value: Math.max(0, (player.matches ?? 0) - 3), color: "#8B5CF6" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3.5 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Performance bar */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-3">Performance globale</h4>
                  {[
                    { label: "Attaque", value: 75, color: "#EF4444" },
                    { label: "Creation", value: 68, color: "#F59E0B" },
                    { label: "Endurance", value: 82, color: "#10B981" },
                    { label: "Discipline", value: 90, color: "#3B82F6" },
                  ].map((bar) => (
                    <div key={bar.label} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground">{bar.label}</span>
                        <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "parcours" && (
              <motion.div
                key="parcours"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Parcours en club</h4>
                
                {player.careerClubs && player.careerClubs.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border" />
                    
                    <div className="space-y-4">
                      {player.careerClubs.map((career, index) => (
                        <motion.div
                          key={career.club}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex items-start gap-4"
                        >
                          {/* Timeline dot */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2"
                            style={{
                              background: index === 0 ? club.primaryColor : "var(--card)",
                              borderColor: index === 0 ? club.primaryColor : "var(--border)",
                            }}
                          >
                            <Award className="w-4 h-4" style={{ color: index === 0 ? "white" : "var(--muted-foreground)" }} />
                          </div>
                          
                          <div className="flex-1 p-3.5 rounded-xl bg-card border border-border">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-foreground text-sm">{career.club}</h4>
                              {index === 0 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: club.primaryColor }}>Actuel</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{career.years}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-semibold text-foreground">{career.matches}</span>
                                <span className="text-[10px] text-muted-foreground">matchs</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-semibold text-foreground">{career.goals}</span>
                                <span className="text-[10px] text-muted-foreground">buts</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Award className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Parcours non disponible</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

// ============ TEAM SCREEN ============
export function TeamScreen({ club }: { club: Club }) {
  const [activeSection, setActiveSection] = useState<"joueurs" | "staff">("joueurs")
  const [selectedPlayer, setSelectedPlayer] = useState<Teammate | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  const goalkeepers = teammates.filter(p => p.position === "Gardien")
  const defenders = teammates.filter(p => p.position.includes("Defenseur") || p.position.includes("Lateral"))
  const midfielders = teammates.filter(p => p.position.includes("Milieu"))
  const forwards = teammates.filter(p => p.position.includes("Attaquant") || p.position.includes("Ailier"))

  const positionGroups = [
    { label: "Gardiens", players: goalkeepers, icon: Shield },
    { label: "Defenseurs", players: defenders, icon: Shield },
    { label: "Milieux", players: midfielders, icon: Zap },
    { label: "Attaquants", players: forwards, icon: Target },
  ].filter(g => g.players.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5 pb-24"
    >
      {/* Team hero with image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src="/images/team-photo.jpg"
          alt="Equipe"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-bold text-foreground text-xl">Mon equipe</h2>
              <p className="text-sm text-muted-foreground">{teammates.length} joueurs - {staffMembers.length} staff</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-lg">
              <Image src={club.logo || "/placeholder.svg"} alt={club.name} width={40} height={40} className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Section toggle */}
      <div className="px-4">
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
      </div>

      <div className="px-4">
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
                  <div className="flex items-center gap-2 mb-2.5">
                    <group.icon className="w-3.5 h-3.5" style={{ color: club.primaryColor }} />
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{group.label}</h3>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] text-muted-foreground">{group.players.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.players.map((player, index) => (
                      <motion.button
                        key={player.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedPlayer(player)}
                        className={`p-3 rounded-2xl border transition-all text-left ${
                          player.isSelf ? "border-2 shadow-md" : "border-border bg-card"
                        }`}
                        style={{
                          borderColor: player.isSelf ? club.primaryColor : undefined,
                          background: player.isSelf ? `${club.primaryColor}05` : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-border">
                            <Image
                              src={player.profileImage}
                              alt={player.name}
                              width={44}
                              height={44}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-semibold text-foreground text-xs line-clamp-1">{player.name}</h4>
                              {player.isCapitain && (
                                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-amber-500/15 text-amber-600">C</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                style={{ background: `${club.primaryColor}10`, color: club.primaryColor }}
                              >
                                #{player.number}
                              </span>
                              {player.isSelf && (
                                <span className="text-[8px] font-bold px-1 py-0.5 rounded text-white" style={{ background: club.primaryColor }}>Vous</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-1">{player.position}</p>
                      </motion.button>
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
                <motion.button
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedStaff(member)}
                  className="w-full text-left flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-border">
                    <Image
                      src={member.profileImage}
                      alt={member.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    {member.experience && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{member.experience} d'experience</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Player Detail Sheet */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerDetailSheet player={selectedPlayer} club={club} onClose={() => setSelectedPlayer(null)} />
        )}
      </AnimatePresence>

      {/* Staff Detail Sheet */}
      <AnimatePresence>
        {selectedStaff && (
          <StaffDetailSheet staff={selectedStaff} club={club} onClose={() => setSelectedStaff(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ STAFF DETAIL SHEET ============
function StaffDetailSheet({ staff, club, onClose }: { staff: StaffMember; club: Club; onClose: () => void }) {
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
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[60vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-5 pb-8 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-lg border-2 flex-shrink-0" style={{ borderColor: club.primaryColor }}>
                <Image src={staff.profileImage} alt={staff.name} width={72} height={72} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{staff.name}</h3>
                <p className="text-sm text-muted-foreground">{staff.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {staff.experience && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="text-sm font-semibold text-foreground">{staff.experience}</span>
              </div>
            )}
            {staff.specialty && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <span className="text-sm text-muted-foreground">Specialite</span>
                <span className="text-sm font-semibold text-foreground">{staff.specialty}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <span className="text-sm text-muted-foreground">Club</span>
              <span className="text-sm font-semibold text-foreground">{club.name}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ============ ANNOUNCEMENTS SCREEN (overlay) ============
export function AnnouncementsScreen({ club, onBack }: { club: Club; onBack: () => void }) {
  const [announcements, setAnnouncements] = useState(internalAnnouncements)
  const [selectedAnn, setSelectedAnn] = useState<InternalAnnouncement | null>(null)

  const markAsRead = (id: number) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

  const unreadCount = announcements.filter(a => !a.read).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      {/* Header with colored banner */}
      <div
        className="p-4 pb-5"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}dd)` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="font-bold text-white text-lg">Annonces internes</h2>
        </div>
        {unreadCount > 0 && (
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
              <p className="text-xs text-white/70">Restez informe des dernieres annonces</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2.5">
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
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
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
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
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
