"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, ChevronRight, Clock, MapPin,
  Trophy, Users, Activity, Target, Shield,
  Megaphone, Check, X, Dumbbell, Heart,
  TrendingUp, Star, Zap, AlertCircle, Ruler, Weight, Footprints, Award,
  Plus, Send, Filter, Search, MoreVertical, Edit3, Clipboard,
  UserCheck, UserX, ChevronDown
} from "lucide-react"
import Image from "next/image"
import type { Club } from "../club-app"

// ============ TYPES ============
interface Teammate {
  id: number
  name: string
  position: string
  number: number
  avatar: string
  profileImage: string
  isCapitain?: boolean
  age?: number
  height?: string
  weight?: string
  foot?: string
  nationality?: string
  goals?: number
  assists?: number
  matches?: number
  rating?: number
  status?: "fit" | "injured" | "suspended" | "rest"
  careerClubs?: { club: string; years: string; matches: number; goals: number }[]
}

interface CalendarEvent {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: "training" | "match" | "recovery" | "meeting" | "medical"
  status: "upcoming" | "done" | "cancelled"
  opponentIndex?: number
  isHome?: boolean
  competition?: string
  convocations?: number
  totalPlayers?: number
}

interface Announcement {
  id: number
  title: string
  message: string
  date: string
  from: string
  type: "convocation" | "info" | "urgent" | "training" | "tactical"
  read: boolean
  responses?: { confirmed: number; declined: number; pending: number }
  targetGroup?: string
}

// ============ MOCK DATA ============
const squadPlayers: Teammate[] = [
  { id: 1, name: "Abdoulaye Sow", position: "Gardien", number: 1, avatar: "AS", profileImage: "/images/players/player-02.jpg", isCapitain: true, age: 28, height: "1m88", weight: "82kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 0, matches: 22, rating: 7.5, status: "fit", careerClubs: [{ club: "ASC Jaraaf", years: "2020-present", matches: 95, goals: 0 }, { club: "Ndiambour", years: "2017-2020", matches: 65, goals: 0 }] },
  { id: 2, name: "Khadim Faye", position: "Gardien", number: 16, avatar: "KF", profileImage: "/images/players/player-03.jpg", age: 20, height: "1m90", weight: "83kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 0, matches: 2, rating: 6.0, status: "fit" },
  { id: 3, name: "Ibrahima Ndiaye", position: "Defenseur central", number: 4, avatar: "IN", profileImage: "/images/players/player-03.jpg", age: 26, height: "1m85", weight: "80kg", foot: "Gauche", nationality: "Senegalais", goals: 1, assists: 0, matches: 20, rating: 7.0, status: "fit" },
  { id: 4, name: "Cheikh Mbaye", position: "Defenseur central", number: 5, avatar: "CM", profileImage: "/images/players/player-04.jpg", age: 25, height: "1m83", weight: "78kg", foot: "Droit", nationality: "Senegalais", goals: 2, assists: 1, matches: 19, rating: 6.8, status: "injured" },
  { id: 5, name: "Pape Diop", position: "Lateral droit", number: 2, avatar: "PD", profileImage: "/images/players/player-05.jpg", age: 23, height: "1m75", weight: "70kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 5, matches: 17, rating: 6.9, status: "fit" },
  { id: 6, name: "Mamadou Fall", position: "Lateral gauche", number: 3, avatar: "MF", profileImage: "/images/players/player-06.jpg", age: 22, height: "1m77", weight: "71kg", foot: "Gauche", nationality: "Senegalais", goals: 1, assists: 3, matches: 16, rating: 6.7, status: "fit" },
  { id: 7, name: "Ousmane Ba", position: "Milieu defensif", number: 6, avatar: "OB", profileImage: "/images/players/player-07.jpg", age: 27, height: "1m80", weight: "76kg", foot: "Droit", nationality: "Senegalais", goals: 1, assists: 2, matches: 21, rating: 7.1, status: "fit" },
  { id: 8, name: "Aliou Cisse", position: "Milieu central", number: 8, avatar: "AC", profileImage: "/images/players/player-03.jpg", age: 24, height: "1m76", weight: "73kg", foot: "Droit", nationality: "Senegalais", goals: 3, assists: 4, matches: 18, rating: 7.0, status: "fit" },
  { id: 9, name: "Moussa Diallo", position: "Milieu offensif", number: 10, avatar: "MD", profileImage: "/images/players/player-01.jpg", age: 24, height: "1m78", weight: "72kg", foot: "Droit", nationality: "Senegalais", goals: 7, assists: 4, matches: 18, rating: 7.2, status: "fit" },
  { id: 10, name: "Babacar Gueye", position: "Ailier droit", number: 7, avatar: "BG", profileImage: "/images/players/player-05.jpg", age: 21, height: "1m73", weight: "68kg", foot: "Droit", nationality: "Senegalais", goals: 5, assists: 3, matches: 17, rating: 7.3, status: "suspended" },
  { id: 11, name: "Modou Sarr", position: "Ailier gauche", number: 11, avatar: "MS", profileImage: "/images/players/player-06.jpg", age: 22, height: "1m74", weight: "69kg", foot: "Gauche", nationality: "Senegalais", goals: 4, assists: 6, matches: 19, rating: 7.1, status: "fit" },
  { id: 12, name: "El Hadj Diouf", position: "Attaquant", number: 9, avatar: "ED", profileImage: "/images/players/player-07.jpg", age: 26, height: "1m82", weight: "77kg", foot: "Droit", nationality: "Senegalais", goals: 12, assists: 2, matches: 20, rating: 7.6, status: "fit" },
  { id: 13, name: "Seydou Niang", position: "Milieu central", number: 14, avatar: "SN", profileImage: "/images/players/player-04.jpg", age: 23, height: "1m79", weight: "74kg", foot: "Droit", nationality: "Senegalais", goals: 2, assists: 1, matches: 12, rating: 6.5, status: "fit" },
  { id: 14, name: "Amadou Diagne", position: "Defenseur", number: 15, avatar: "AD", profileImage: "/images/players/player-02.jpg", age: 21, height: "1m86", weight: "79kg", foot: "Droit", nationality: "Senegalais", goals: 0, assists: 0, matches: 8, rating: 6.3, status: "rest" },
  { id: 15, name: "Lamine Toure", position: "Attaquant", number: 17, avatar: "LT", profileImage: "/images/players/player-01.jpg", age: 20, height: "1m80", weight: "73kg", foot: "Gauche", nationality: "Senegalais", goals: 3, assists: 1, matches: 10, rating: 6.8, status: "fit" },
]

const staffCalendarEvents: CalendarEvent[] = [
  { id: 1, title: "Entrainement tactique", date: "Lun 10 Fev", time: "09:00", location: "Terrain annexe", type: "training", status: "upcoming" },
  { id: 2, title: "Reunion technique", date: "Mar 11 Fev", time: "10:00", location: "Salle conference", type: "meeting", status: "upcoming" },
  { id: 3, title: "Entrainement physique", date: "Mer 12 Fev", time: "08:30", location: "Terrain principal", type: "training", status: "upcoming" },
  { id: 4, title: "Match Ligue 1 - J16", date: "Dim 16 Fev", time: "16:00", location: "Stade Leopold Sedar Senghor", type: "match", status: "upcoming", opponentIndex: 0, isHome: true, competition: "Ligue 1", convocations: 18, totalPlayers: 15 },
  { id: 5, title: "Seance de recuperation", date: "Lun 17 Fev", time: "10:00", location: "Centre medical", type: "recovery", status: "upcoming" },
  { id: 6, title: "Visite medicale equipe", date: "Mar 18 Fev", time: "09:00", location: "Centre medical", type: "medical", status: "upcoming" },
  { id: 7, title: "Match Coupe du Senegal", date: "Sam 22 Fev", time: "17:00", location: "Stade Demba Diop", type: "match", status: "upcoming", opponentIndex: 1, isHome: false, competition: "Coupe du Senegal", convocations: 20, totalPlayers: 12 },
  { id: 8, title: "Entrainement technique", date: "Jeu 6 Fev", time: "09:00", location: "Terrain principal", type: "training", status: "done" },
  { id: 9, title: "Match Ligue 1 - J15", date: "Dim 2 Fev", time: "16:00", location: "Stade Iba Mar Diop", type: "match", status: "done", opponentIndex: 2, isHome: false, competition: "Ligue 1" },
]

const staffAnnouncements: Announcement[] = [
  { id: 1, title: "Convocation Match J16 vs Casa Sports", message: "La liste des 18 joueurs convoques pour le match de dimanche a ete arretee. Rendez-vous samedi 15h pour la mise au vert.", date: "Il y a 2h", from: "Coach Malick Daf", type: "convocation", read: false, responses: { confirmed: 14, declined: 1, pending: 3 }, targetGroup: "Joueurs convoques" },
  { id: 2, title: "Changement horaire entrainement", message: "L'entrainement de mercredi est decale a 08h30 au lieu de 09h00 en raison de la chaleur. Hydratation obligatoire.", date: "Il y a 5h", from: "Preparateur physique", type: "training", read: false, targetGroup: "Tout l'effectif" },
  { id: 3, title: "Analyse tactique disponible", message: "La video de l'analyse du dernier match est disponible. Chaque joueur doit la visionner avant la seance video de mardi.", date: "Hier", from: "Coach adjoint", type: "tactical", read: true, targetGroup: "Tout l'effectif" },
  { id: 4, title: "Point medical - Cheikh Mbaye", message: "Blessure musculaire ischio-jambiers gauche. Indisponibilite estimee 3 semaines. Protocole de reeducation en cours.", date: "Il y a 2j", from: "Staff medical", type: "urgent", read: true, targetGroup: "Staff technique" },
  { id: 5, title: "Rappel reglement interieur", message: "Les retards aux entrainements seront sanctionnes conformement au reglement interieur. Ponctualite exigee.", date: "Il y a 3j", from: "Direction sportive", type: "info", read: true, targetGroup: "Tout l'effectif" },
  { id: 6, title: "Nouveau protocole d'echauffement", message: "Un nouveau protocole d'echauffement sera mis en place des cette semaine. Duree: 25 minutes avec focus sur la prevention des blessures.", date: "Il y a 4j", from: "Preparateur physique", type: "training", read: true, targetGroup: "Staff + Joueurs" },
]

const statusConfig = {
  fit: { label: "Apte", color: "#22c55e", bg: "#22c55e15" },
  injured: { label: "Blesse", color: "#ef4444", bg: "#ef444415" },
  suspended: { label: "Suspendu", color: "#f59e0b", bg: "#f59e0b15" },
  rest: { label: "Repos", color: "#8b5cf6", bg: "#8b5cf615" },
}

const eventTypeConfig = {
  training: { icon: Dumbbell, color: "#22c55e", label: "Entrainement" },
  match: { icon: Trophy, color: "#f59e0b", label: "Match" },
  recovery: { icon: Heart, color: "#8b5cf6", label: "Recuperation" },
  meeting: { icon: Users, color: "#3b82f6", label: "Reunion" },
  medical: { icon: Activity, color: "#ef4444", label: "Medical" },
}

const announcementTypeConfig = {
  convocation: { icon: Clipboard, color: "#f59e0b", label: "Convocation" },
  info: { icon: Megaphone, color: "#3b82f6", label: "Info" },
  urgent: { icon: AlertCircle, color: "#ef4444", label: "Urgent" },
  training: { icon: Dumbbell, color: "#22c55e", label: "Entrainement" },
  tactical: { icon: Target, color: "#8b5cf6", label: "Tactique" },
}

// ============ STAFF EQUIPE SCREEN ============
export function StaffEquipeScreen({ club }: { club: Club }) {
  const [selectedPlayer, setSelectedPlayer] = useState<Teammate | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlayers = squadPlayers.filter(p => {
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.position.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const fitCount = squadPlayers.filter(p => p.status === "fit").length
  const injuredCount = squadPlayers.filter(p => p.status === "injured").length
  const suspendedCount = squadPlayers.filter(p => p.status === "suspended").length

  const positionGroups = [
    { label: "Gardiens", positions: ["Gardien"] },
    { label: "Defenseurs", positions: ["Defenseur central", "Lateral droit", "Lateral gauche", "Defenseur"] },
    { label: "Milieux", positions: ["Milieu defensif", "Milieu central", "Milieu offensif"] },
    { label: "Attaquants", positions: ["Ailier droit", "Ailier gauche", "Attaquant"] },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full"
    >
      {/* Hero header */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src="/images/training-session.jpg"
          alt="Training session"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${club.primaryColor}90, ${club.primaryColor}DD)` }} />
        <div className="absolute inset-0 flex flex-col justify-end p-4 pb-5">
          <h2 className="text-white text-xl font-bold mb-1">Effectif</h2>
          <p className="text-white/70 text-sm">{squadPlayers.length} joueurs enregistres</p>
          {/* Status summary pills */}
          <div className="flex items-center gap-2 mt-3">
            {[
              { label: "Aptes", count: fitCount, color: "#22c55e" },
              { label: "Blesses", count: injuredCount, color: "#ef4444" },
              { label: "Suspendus", count: suspendedCount, color: "#f59e0b" },
            ].map(s => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ background: `${s.color}25` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-white text-xs font-medium">{s.count} {s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "Tous", count: squadPlayers.length },
            { key: "fit", label: "Aptes", count: fitCount },
            { key: "injured", label: "Blesses", count: injuredCount },
            { key: "suspended", label: "Suspendus", count: suspendedCount },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: filterStatus === f.key ? club.primaryColor : "var(--muted)",
                color: filterStatus === f.key ? "white" : "var(--muted-foreground)",
              }}
            >
              {f.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px]"
                style={{
                  background: filterStatus === f.key ? "rgba(255,255,255,0.2)" : "var(--background)",
                }}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Player list by position groups */}
        <div className="space-y-5 pb-24">
          {positionGroups.map(group => {
            const playersInGroup = filteredPlayers.filter(p => group.positions.includes(p.position))
            if (playersInGroup.length === 0) return null
            return (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1 h-4 rounded-full" style={{ background: club.primaryColor }} />
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{group.label}</h3>
                  <span className="text-xs text-muted-foreground">({playersInGroup.length})</span>
                </div>
                <div className="space-y-2">
                  {playersInGroup.map((player, idx) => {
                    const st = statusConfig[player.status || "fit"]
                    return (
                      <motion.button
                        key={player.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => setSelectedPlayer(player)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-all text-left"
                      >
                        {/* Photo */}
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: st.color }}>
                          <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
                          {player.isCapitain && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: club.secondaryColor }}>
                              C
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm truncate">{player.name}</span>
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}>#{player.number}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{player.position}</p>
                        </div>
                        {/* Status + Stats */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{player.matches || 0} MJ</span>
                            <span>{player.goals || 0} B</span>
                            <span>{player.assists || 0} PD</span>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Player Detail Sheet */}
      <AnimatePresence>
        {selectedPlayer && (
          <StaffPlayerDetailSheet
            player={selectedPlayer}
            club={club}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ STAFF PLAYER DETAIL SHEET ============
function StaffPlayerDetailSheet({ player, club, onClose }: { player: Teammate; club: Club; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"fiche" | "stats" | "parcours">("fiche")
  const st = statusConfig[player.status || "fit"]

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
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Player header with image */}
        <div className="relative px-4 pb-4">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: st.color }}>
              <Image src={player.profileImage} alt={player.name} fill className="object-cover" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-foreground text-lg">{player.name}</h3>
                {player.isCapitain && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: club.secondaryColor }}>CAPITAINE</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}>#{player.number}</span>
                <span className="text-xs text-muted-foreground">{player.position}</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 mb-3">
          {(["fiche", "stats", "parcours"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all text-center"
              style={{
                background: activeTab === tab ? club.primaryColor : "var(--muted)",
                color: activeTab === tab ? "white" : "var(--muted-foreground)",
              }}
            >
              {tab === "fiche" ? "Fiche" : tab === "stats" ? "Statistiques" : "Parcours"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {activeTab === "fiche" && (
            <div className="space-y-4">
              {/* Physical info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Ruler, label: "Taille", value: player.height || "N/A" },
                  { icon: Weight, label: "Poids", value: player.weight || "N/A" },
                  { icon: Footprints, label: "Pied fort", value: player.foot || "N/A" },
                  { icon: Calendar, label: "Age", value: player.age ? `${player.age} ans` : "N/A" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${club.primaryColor}15` }}>
                      <item.icon className="w-4 h-4" style={{ color: club.primaryColor }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick stats overview */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Resume saison</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Matchs", value: player.matches || 0 },
                    { label: "Buts", value: player.goals || 0 },
                    { label: "Passes D.", value: player.assists || 0 },
                    { label: "Note", value: player.rating?.toFixed(1) || "N/A" },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2.5 rounded-xl" style={{ background: `${club.primaryColor}08` }}>
                      <p className="font-bold text-foreground text-lg">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nationality */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${club.primaryColor}15` }}>
                  <Shield className="w-4 h-4" style={{ color: club.primaryColor }} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Nationalite</p>
                  <p className="text-sm font-semibold text-foreground">{player.nationality || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-4">
              {/* Rating circle */}
              <div className="flex items-center justify-center py-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={club.primaryColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${((player.rating || 0) / 10) * 264} 264`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{player.rating?.toFixed(1)}</span>
                    <span className="text-[10px] text-muted-foreground">Note moy.</span>
                  </div>
                </div>
              </div>

              {/* Detailed stats grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Matchs joues", value: player.matches || 0, icon: Trophy },
                  { label: "Buts marques", value: player.goals || 0, icon: Target },
                  { label: "Passes dec.", value: player.assists || 0, icon: TrendingUp },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                    <s.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: club.primaryColor }} />
                    <p className="font-bold text-foreground text-xl">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Performance bars */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performance</h4>
                {[
                  { label: "Attaque", value: Math.min(100, ((player.goals || 0) / 15) * 100) },
                  { label: "Creation", value: Math.min(100, ((player.assists || 0) / 10) * 100) },
                  { label: "Endurance", value: Math.min(100, ((player.matches || 0) / 22) * 100) },
                  { label: "Discipline", value: 85 },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{bar.label}</span>
                      <span className="text-xs font-semibold text-foreground">{Math.round(bar.value)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: club.primaryColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "parcours" && (
            <div className="space-y-3">
              {(player.careerClubs || []).map((career, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 mt-1" style={{ borderColor: club.primaryColor, background: i === 0 ? club.primaryColor : "transparent" }} />
                    {i < (player.careerClubs?.length || 0) - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-card border border-border mb-1">
                    <h4 className="font-semibold text-foreground text-sm">{career.club}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{career.years}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{career.matches} matchs</span>
                      <span className="text-xs text-muted-foreground">{career.goals} buts</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!player.careerClubs || player.careerClubs.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">Aucun parcours enregistre</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

// ============ STAFF CALENDRIER SCREEN ============
export function StaffCalendrierScreen({ club, allClubs }: { club: Club; allClubs: Club[] }) {
  const [filter, setFilter] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const upcomingEvents = staffCalendarEvents.filter(e => e.status === "upcoming")
  const pastEvents = staffCalendarEvents.filter(e => e.status === "done")

  const filteredUpcoming = filter === "all" ? upcomingEvents : upcomingEvents.filter(e => e.type === filter)
  const filteredPast = filter === "all" ? pastEvents : pastEvents.filter(e => e.type === filter)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full"
    >
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/images/staff-tactics.jpg"
          alt="Staff tactics"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${club.primaryColor}90, ${club.primaryColor}DD)` }} />
        <div className="absolute inset-0 flex flex-col justify-end p-4 pb-5">
          <h2 className="text-white text-xl font-bold mb-1">Calendrier</h2>
          <p className="text-white/70 text-sm">{upcomingEvents.length} evenements a venir</p>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "Tout" },
            { key: "match", label: "Matchs" },
            { key: "training", label: "Entrainements" },
            { key: "meeting", label: "Reunions" },
            { key: "medical", label: "Medical" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === f.key ? club.primaryColor : "var(--muted)",
                color: filter === f.key ? "white" : "var(--muted-foreground)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Upcoming section */}
        {filteredUpcoming.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">A venir</h3>
            <div className="space-y-2.5">
              {filteredUpcoming.map((event, idx) => {
                const config = eventTypeConfig[event.type]
                const EventIcon = config.icon

                // Match card - same design as AgendaScreen
                if (event.type === "match" && event.opponentIndex !== undefined) {
                  const opponent = allClubs.filter(c => c.id !== club.id)[event.opponentIndex]
                  const homeTeam = event.isHome ? club : opponent
                  const awayTeam = event.isHome ? opponent : club
                  return (
                    <motion.button
                      key={event.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full rounded-2xl overflow-hidden text-left"
                      style={{ background: `linear-gradient(135deg, ${club.primaryColor}15, ${club.secondaryColor}15)` }}
                    >
                      <div className="p-4">
                        {/* Date and home/away badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: club.primaryColor, color: "white" }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            {event.isHome ? "Domicile" : "Exterieur"}
                          </div>
                          <span className="text-xs text-muted-foreground">{event.date} - {event.time}</span>
                        </div>

                        {/* Teams display */}
                        <div className="flex items-center justify-between gap-2">
                          {/* Home team */}
                          <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                              <Image
                                src={homeTeam?.logo || "/placeholder.svg"}
                                alt={homeTeam?.name || "Equipe"}
                                width={56} height={56}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <p className="font-bold text-foreground text-xs sm:text-sm text-center mt-2 line-clamp-1">
                              {homeTeam?.name || "A determiner"}
                            </p>
                          </div>

                          {/* VS and competition */}
                          <div className="flex flex-col items-center px-2 flex-shrink-0">
                            <p className="text-lg sm:text-xl font-bold text-foreground">VS</p>
                            <span
                              className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium border whitespace-nowrap"
                              style={{ borderColor: `${club.primaryColor}50`, color: club.primaryColor }}
                            >
                              {event.competition}
                            </span>
                          </div>

                          {/* Away team */}
                          <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                              <Image
                                src={awayTeam?.logo || "/placeholder.svg"}
                                alt={awayTeam?.name || "Equipe"}
                                width={56} height={56}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <p className="font-bold text-foreground text-xs sm:text-sm text-center mt-2 line-clamp-1">
                              {awayTeam?.name || "A determiner"}
                            </p>
                          </div>
                        </div>

                        {/* Location + convocation status */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground truncate flex-1 mr-2">{event.location}</p>
                          {event.convocations && (
                            <div
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
                              style={{ background: `${club.primaryColor}15` }}
                            >
                              <Clipboard className="w-3.5 h-3.5" style={{ color: club.primaryColor }} />
                              <span className="text-[10px] font-semibold" style={{ color: club.primaryColor }}>
                                {event.totalPlayers || 0}/{event.convocations} convoques
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                }

                // Regular event card
                return (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-primary/20 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${config.color}15` }}>
                      <EventIcon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>
                        {config.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{event.location}</span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Past section */}
        {filteredPast.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Passes</h3>
            <div className="space-y-2 opacity-70">
              {filteredPast.map(event => {
                const config = eventTypeConfig[event.type]
                const EventIcon = config.icon
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${config.color}10` }}>
                      <EventIcon className="w-4.5 h-4.5" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                      <span className="text-xs text-muted-foreground">{event.date} - {event.time}</span>
                    </div>
                    <Check className="w-4 h-4 text-muted-foreground" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Event detail bottom sheet */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailSheet event={selectedEvent} club={club} allClubs={allClubs} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ EVENT DETAIL SHEET ============
function EventDetailSheet({ event, club, allClubs, onClose }: { event: CalendarEvent; club: Club; allClubs: Club[]; onClose: () => void }) {
  const config = eventTypeConfig[event.type]
  const EventIcon = config.icon
  const isMatch = event.type === "match"
  const [showConvocation, setShowConvocation] = useState(false)

  if (isMatch && showConvocation) {
    const opponent = event.opponentIndex !== undefined
      ? allClubs.filter(c => c.id !== club.id)[event.opponentIndex]
      : undefined
    return <ConvocationSheet event={event} club={club} opponent={opponent} onBack={() => setShowConvocation(false)} onClose={onClose} />
  }

  const opponent = isMatch && event.opponentIndex !== undefined
    ? allClubs.filter(c => c.id !== club.id)[event.opponentIndex]
    : undefined
  const homeTeam = event.isHome ? club : opponent
  const awayTeam = event.isHome ? opponent : club

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-4 pb-8">
          {/* Close button */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>{config.label}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Match header with teams - same gradient style */}
          {isMatch && opponent ? (
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: `linear-gradient(135deg, ${club.primaryColor}15, ${club.secondaryColor}15)` }}>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                      <Image src={homeTeam?.logo || "/placeholder.svg"} alt={homeTeam?.name || ""} width={56} height={56} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <p className="font-bold text-foreground text-xs text-center mt-2 line-clamp-1">{homeTeam?.name}</p>
                    <p className="text-[10px] text-muted-foreground">Domicile</p>
                  </div>
                  <div className="flex flex-col items-center px-2 flex-shrink-0">
                    <p className="text-xl font-bold text-foreground">VS</p>
                    <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium border whitespace-nowrap" style={{ borderColor: `${club.primaryColor}50`, color: club.primaryColor }}>
                      {event.competition}
                    </span>
                    <p className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">{event.time}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                      <Image src={awayTeam?.logo || "/placeholder.svg"} alt={awayTeam?.name || ""} width={56} height={56} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <p className="font-bold text-foreground text-xs text-center mt-2 line-clamp-1">{awayTeam?.name}</p>
                    <p className="text-[10px] text-muted-foreground">Exterieur</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${config.color}15` }}>
                <EventIcon className="w-6 h-6" style={{ color: config.color }} />
              </div>
              <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{event.date} a {event.time}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{event.location}</span>
            </div>

            {/* Convocation summary for match */}
            {isMatch && event.convocations && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Convocations</h4>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" style={{ color: "#22c55e" }} />
                    <span className="text-sm text-foreground">{event.totalPlayers || 0} convoques</span>
                  </div>
                  <span className="text-sm text-muted-foreground">/ {event.convocations} places</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((event.totalPlayers || 0) / event.convocations) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: club.primaryColor }}
                  />
                </div>
              </div>
            )}

            {/* Main action button */}
            {isMatch ? (
              <button
                onClick={() => setShowConvocation(true)}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: club.primaryColor }}
              >
                <Clipboard className="w-4 h-4" />
                Gerer les convocations
              </button>
            ) : (
              <button
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: club.primaryColor }}
              >
                <Edit3 className="w-4 h-4" />
                Modifier l&apos;evenement
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ============ CONVOCATION SHEET ============
function ConvocationSheet({ event, club, opponent, onBack, onClose }: {
  event: CalendarEvent; club: Club; opponent?: Club; onBack: () => void; onClose: () => void
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(() => {
    // Pre-select some fit players
    const fitPlayers = squadPlayers.filter(p => p.status === "fit").slice(0, event.totalPlayers || 0)
    return new Set(fitPlayers.map(p => p.id))
  })
  const [filterPos, setFilterPos] = useState("all")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const maxConvocations = event.convocations || 18

  const togglePlayer = (id: number) => {
    setSelectedPlayers(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < maxConvocations) {
        next.add(id)
      }
      return next
    })
  }

  const positionFilters = [
    { key: "all", label: "Tous" },
    { key: "Gardien", label: "Gardiens" },
    { key: "Defenseur", label: "Defense" },
    { key: "Milieu", label: "Milieu" },
    { key: "Attaquant", label: "Attaque" },
  ]

  const filteredPlayers = filterPos === "all"
    ? squadPlayers
    : squadPlayers.filter(p => p.position.toLowerCase().includes(filterPos.toLowerCase()))

  const handleSend = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)
    }, 1500)
  }

  const homeTeam = event.isHome ? club : opponent
  const awayTeam = event.isHome ? opponent : club

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[92vh] flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Success state */}
        {isSent ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: club.primaryColor }}
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-foreground font-bold text-lg mb-1">Convocations envoyees</p>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {selectedPlayers.size} joueurs ont ete notifies pour le match
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: club.primaryColor }}
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  Retour
                </button>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Match mini header */}
              <div className="flex items-center justify-center gap-3 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow">
                    <Image src={homeTeam?.logo || "/placeholder.svg"} alt="" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{homeTeam?.name?.split(" ").pop()}</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">vs</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{awayTeam?.name?.split(" ").pop()}</span>
                  <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow">
                    <Image src={awayTeam?.logo || "/placeholder.svg"} alt="" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: `${club.primaryColor}10` }}>
                <div>
                  <p className="text-xs text-muted-foreground">Joueurs selectionnes</p>
                  <p className="text-lg font-bold text-foreground">
                    <span style={{ color: club.primaryColor }}>{selectedPlayers.size}</span>
                    <span className="text-muted-foreground text-sm font-normal"> / {maxConvocations}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  <p className="text-xs font-semibold text-foreground">{event.time} - {event.location}</p>
                </div>
              </div>

              {/* Position filter */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                {positionFilters.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilterPos(f.key)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                    style={{
                      background: filterPos === f.key ? club.primaryColor : "var(--muted)",
                      color: filterPos === f.key ? "white" : "var(--muted-foreground)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Player list - scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              <div className="space-y-1.5">
                {filteredPlayers.map((player) => {
                  const isSelected = selectedPlayers.has(player.id)
                  const status = statusConfig[player.status || "fit"]
                  const isUnavailable = player.status === "injured" || player.status === "suspended"

                  return (
                    <button
                      key={player.id}
                      onClick={() => !isUnavailable && togglePlayer(player.id)}
                      disabled={isUnavailable}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={{
                        background: isSelected ? `${club.primaryColor}10` : isUnavailable ? "var(--muted)" : "var(--card)",
                        border: `1.5px solid ${isSelected ? club.primaryColor : "var(--border)"}`,
                        opacity: isUnavailable ? 0.5 : 1,
                      }}
                    >
                      {/* Selection indicator */}
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          borderColor: isSelected ? club.primaryColor : "var(--border)",
                          background: isSelected ? club.primaryColor : "transparent",
                        }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>

                      {/* Player photo */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border">
                        <Image src={player.profileImage} alt={player.name} width={40} height={40} className="w-full h-full object-cover" />
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">{player.name}</span>
                          {player.isCapitain && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}>C</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">#{player.number}</span>
                          <span className="text-[10px] text-muted-foreground">{player.position}</span>
                        </div>
                      </div>

                      {/* Status + Stats */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span
                          className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{player.matches}m / {player.goals}b</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="p-4 border-t border-border flex-shrink-0">
              <button
                onClick={handleSend}
                disabled={selectedPlayers.size === 0 || isSending}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: club.primaryColor }}
              >
                {isSending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer les convocations ({selectedPlayers.size} joueurs)
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}

// ============ STAFF ANNOUNCEMENTS SCREEN ============
export function StaffAnnouncementsScreen({ club }: { club: Club }) {
  const [announcements, setAnnouncements] = useState(staffAnnouncements)
  const [showCompose, setShowCompose] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const unreadCount = announcements.filter(a => !a.read).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full"
    >
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}CC)` }} />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/4 translate-x-1/4" style={{ background: `${club.secondaryColor}15` }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/3 -translate-x-1/4" style={{ background: `${club.secondaryColor}10` }} />
        <div className="absolute inset-0 flex flex-col justify-end p-4 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-white" />
            <h2 className="text-white text-xl font-bold">Annonces</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: club.secondaryColor, color: club.primaryColor }}>
                {unreadCount} nouvelles
              </span>
            )}
          </div>
          <p className="text-white/70 text-sm">Communication interne de l&apos;equipe</p>
        </div>
      </div>

      <div className="p-4 space-y-3 pb-24">
        {/* Compose button */}
        <button
          onClick={() => setShowCompose(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: club.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </button>

        {/* Announcement list */}
        {announcements.map((announcement, idx) => {
          const config = announcementTypeConfig[announcement.type]
          const AnnIcon = config.icon
          return (
            <motion.button
              key={announcement.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelectedAnnouncement(announcement)
                setAnnouncements(prev => prev.map(a => a.id === announcement.id ? { ...a, read: true } : a))
              }}
              className="w-full text-left p-4 rounded-xl bg-card border transition-all"
              style={{ borderColor: !announcement.read ? `${config.color}40` : "var(--border)" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${config.color}15` }}>
                  <AnnIcon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>
                      {config.label}
                    </span>
                    {!announcement.read && (
                      <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">{announcement.date}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1 truncate">{announcement.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{announcement.message}</p>

                  {/* Footer meta */}
                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-[10px] text-muted-foreground">Par {announcement.from}</span>
                    {announcement.targetGroup && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{announcement.targetGroup}</span>
                    )}
                  </div>

                  {/* Response tracker */}
                  {announcement.responses && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] text-green-600 font-medium">{announcement.responses.confirmed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserX className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] text-red-500 font-medium">{announcement.responses.declined}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-medium">{announcement.responses.pending} en attente</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Announcement Detail Sheet */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <AnnouncementDetailSheet announcement={selectedAnnouncement} club={club} onClose={() => setSelectedAnnouncement(null)} />
        )}
      </AnimatePresence>

      {/* Compose Sheet */}
      <AnimatePresence>
        {showCompose && (
          <ComposeAnnouncementSheet club={club} onClose={() => setShowCompose(false)} onSend={(announcement) => {
            setAnnouncements(prev => [announcement, ...prev])
            setShowCompose(false)
          }} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ ANNOUNCEMENT DETAIL SHEET ============
function AnnouncementDetailSheet({ announcement, club, onClose }: { announcement: Announcement; club: Club; onClose: () => void }) {
  const config = announcementTypeConfig[announcement.type]
  const AnnIcon = config.icon

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
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
        <div className="px-4 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${config.color}15` }}>
                <AnnIcon className="w-6 h-6" style={{ color: config.color }} />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>{config.label}</span>
                <h3 className="font-bold text-foreground mt-1">{announcement.title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
            <span>Par {announcement.from}</span>
            <span>{announcement.date}</span>
            {announcement.targetGroup && (
              <span className="px-1.5 py-0.5 rounded bg-muted">{announcement.targetGroup}</span>
            )}
          </div>

          {/* Body */}
          <div className="p-4 rounded-xl bg-muted/50 mb-4">
            <p className="text-sm text-foreground leading-relaxed">{announcement.message}</p>
          </div>

          {/* Responses */}
          {announcement.responses && (
            <div className="p-4 rounded-xl bg-card border border-border mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Reponses</h4>
              <div className="space-y-2.5">
                {[
                  { icon: UserCheck, label: "Confirmes", count: announcement.responses.confirmed, color: "#22c55e" },
                  { icon: UserX, label: "Declines", count: announcement.responses.declined, color: "#ef4444" },
                  { icon: Clock, label: "En attente", count: announcement.responses.pending, color: "#f59e0b" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <r.icon className="w-4 h-4" style={{ color: r.color }} />
                      <span className="text-sm text-foreground">{r.label}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: r.color }}>{r.count}</span>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="h-2.5 rounded-full bg-muted mt-3 overflow-hidden flex">
                <div className="h-full" style={{ width: `${(announcement.responses.confirmed / (announcement.responses.confirmed + announcement.responses.declined + announcement.responses.pending)) * 100}%`, background: "#22c55e" }} />
                <div className="h-full" style={{ width: `${(announcement.responses.declined / (announcement.responses.confirmed + announcement.responses.declined + announcement.responses.pending)) * 100}%`, background: "#ef4444" }} />
                <div className="h-full" style={{ width: `${(announcement.responses.pending / (announcement.responses.confirmed + announcement.responses.declined + announcement.responses.pending)) * 100}%`, background: "#f59e0b" }} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: club.primaryColor }}>
              <Send className="w-4 h-4" />
              Renvoyer
            </button>
            <button className="py-3 px-4 rounded-xl text-sm font-semibold border border-border text-foreground flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ============ COMPOSE ANNOUNCEMENT SHEET ============
function ComposeAnnouncementSheet({ club, onClose, onSend }: { club: Club; onClose: () => void; onSend: (a: Announcement) => void }) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<Announcement["type"]>("info")
  const [target, setTarget] = useState("Tout l'effectif")
  const [isSending, setIsSending] = useState(false)

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return
    setIsSending(true)
    setTimeout(() => {
      onSend({
        id: Date.now(),
        title: title.trim(),
        message: message.trim(),
        date: "A l'instant",
        from: "Coach Malick Daf",
        type,
        read: true,
        targetGroup: target,
      })
    }, 800)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-lg font-bold text-foreground">Nouvelle annonce</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pb-8 space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(announcementTypeConfig) as [Announcement["type"], typeof announcementTypeConfig.info][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: type === key ? `${cfg.color}20` : "var(--muted)",
                    color: type === key ? cfg.color : "var(--muted-foreground)",
                    borderWidth: 1,
                    borderColor: type === key ? cfg.color : "transparent",
                  }}
                >
                  <cfg.icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Destinataires</label>
            <div className="flex flex-wrap gap-2">
              {["Tout l'effectif", "Joueurs convoques", "Staff technique", "Staff + Joueurs"].map(t => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: target === t ? club.primaryColor : "var(--muted)",
                    color: target === t ? "white" : "var(--muted-foreground)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'annonce"
              className="w-full p-3 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary/50 placeholder:text-muted-foreground"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contenu de l'annonce..."
              rows={4}
              className="w-full p-3 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary/50 resize-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!title.trim() || !message.trim() || isSending}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: club.primaryColor }}
          >
            {isSending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer l&apos;annonce
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  )
}
