"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, TrendingUp, Ticket, ShoppingBag, Gift, CreditCard,
  ChevronRight, ChevronDown, Check, X, Search, Filter,
  Plus, Edit3, Trash2, MoreVertical, Eye, EyeOff,
  Calendar, Clock, MapPin, BarChart3, ArrowUpRight, ArrowDownRight,
  FileText, Image as ImageIcon, Video, Send, Bell,
  Settings, ToggleLeft, ToggleRight, Shield, Crown,
  Megaphone, Award, Star, Wallet, Receipt, CircleDollarSign,
  UserCheck, UserX, UserPlus, Mail, Phone
} from "lucide-react"
import Image from "next/image"
import type { Club } from "../club-app"

// ============ MOCK DATA ============
interface MemberData {
  id: number
  name: string
  phone: string
  role: string
  tier: string | null
  status: "active" | "inactive" | "expired"
  joinedDate: string
  avatar: string
  profileImage: string
}

const mockMembers: MemberData[] = [
  { id: 1, name: "Moussa Diallo", phone: "+221 77 123 45 67", role: "membre", tier: "Gold", status: "active", joinedDate: "Jan 2025", avatar: "MD", profileImage: "/images/players/player-01.jpg" },
  { id: 2, name: "Ibrahima Ndiaye", phone: "+221 78 234 56 78", role: "membre", tier: "Silver", status: "active", joinedDate: "Mar 2025", avatar: "IN", profileImage: "/images/players/player-03.jpg" },
  { id: 3, name: "Ousmane Sarr", phone: "+221 76 345 67 89", role: "joueur", tier: null, status: "active", joinedDate: "Sep 2024", avatar: "OS", profileImage: "/images/players/player-04.jpg" },
  { id: 4, name: "Amadou Fall", phone: "+221 77 456 78 90", role: "supporter", tier: null, status: "active", joinedDate: "Feb 2025", avatar: "AF", profileImage: "/images/players/player-05.jpg" },
  { id: 5, name: "Cheikh Diop", phone: "+221 78 567 89 01", role: "staff", tier: null, status: "active", joinedDate: "Oct 2024", avatar: "CD", profileImage: "/images/players/player-06.jpg" },
  { id: 6, name: "Mamadou Ba", phone: "+221 76 678 90 12", role: "membre", tier: "Bronze", status: "expired", joinedDate: "Jun 2024", avatar: "MB", profileImage: "/images/players/player-07.jpg" },
  { id: 7, name: "Abdoulaye Sow", phone: "+221 77 789 01 23", role: "supporter", tier: null, status: "inactive", joinedDate: "Dec 2024", avatar: "AS", profileImage: "/images/players/player-02.jpg" },
  { id: 8, name: "Pape Gueye", phone: "+221 78 890 12 34", role: "membre", tier: "Silver", status: "active", joinedDate: "Apr 2025", avatar: "PG", profileImage: "/images/players/player-01.jpg" },
]

interface PostData {
  id: number
  title: string
  excerpt: string
  type: "article" | "photo" | "video" | "announcement"
  isPremium: boolean
  status: "published" | "draft"
  date: string
  views: number
  likes: number
}

const mockPosts: PostData[] = [
  { id: 1, title: "Victoire eclatante face au Casa Sports", excerpt: "Une performance remarquable de l'equipe...", type: "article", isPremium: false, status: "published", date: "10 Fev 2026", views: 1250, likes: 89 },
  { id: 2, title: "Interview exclusive - Capitaine Diallo", excerpt: "Retrouvez l'interview complete de notre capitaine...", type: "video", isPremium: true, status: "published", date: "8 Fev 2026", views: 870, likes: 134 },
  { id: 3, title: "Galerie photos - Dernier entrainement", excerpt: "Les meilleurs cliches de la seance...", type: "photo", isPremium: false, status: "published", date: "7 Fev 2026", views: 560, likes: 45 },
  { id: 4, title: "Communique officiel - Transfert", excerpt: "Le club est heureux d'annoncer...", type: "announcement", isPremium: false, status: "draft", date: "10 Fev 2026", views: 0, likes: 0 },
  { id: 5, title: "Coulisses du vestiaire", excerpt: "Un apercu exclusif de la preparation...", type: "video", isPremium: true, status: "published", date: "5 Fev 2026", views: 2100, likes: 210 },
]

interface TransactionData {
  id: number
  type: "adhesion" | "billet" | "boutique" | "don"
  label: string
  amount: number
  date: string
  user: string
  method: "Wave" | "Orange Money"
  status: "success" | "pending" | "failed"
}

const mockTransactions: TransactionData[] = [
  { id: 1, type: "adhesion", label: "Adhesion Gold", amount: 25000, date: "10 Fev", user: "Moussa D.", method: "Wave", status: "success" },
  { id: 2, type: "billet", label: "Tribune VIP x2", amount: 10000, date: "10 Fev", user: "Ibrahima N.", method: "Orange Money", status: "success" },
  { id: 3, type: "boutique", label: "Maillot domicile XL", amount: 15000, date: "9 Fev", user: "Amadou F.", method: "Wave", status: "success" },
  { id: 4, type: "don", label: "Don libre", amount: 50000, date: "9 Fev", user: "Cheikh D.", method: "Wave", status: "success" },
  { id: 5, type: "adhesion", label: "Adhesion Silver", amount: 15000, date: "8 Fev", user: "Pape G.", method: "Orange Money", status: "success" },
  { id: 6, type: "billet", label: "Tribune Est x4", amount: 12000, date: "8 Fev", user: "Mamadou B.", method: "Wave", status: "pending" },
  { id: 7, type: "boutique", label: "Echarpe officielle", amount: 5000, date: "7 Fev", user: "Abdoulaye S.", method: "Orange Money", status: "success" },
  { id: 8, type: "don", label: "Contribution mensuelle", amount: 10000, date: "7 Fev", user: "Ousmane S.", method: "Wave", status: "success" },
]

const transTypeConfig: Record<string, { icon: typeof Ticket; color: string; label: string }> = {
  adhesion: { icon: CreditCard, color: "#8b5cf6", label: "Adhesion" },
  billet: { icon: Ticket, color: "#3b82f6", label: "Billetterie" },
  boutique: { icon: ShoppingBag, color: "#f59e0b", label: "Boutique" },
  don: { icon: Gift, color: "#ef4444", label: "Don" },
}

const roleConfig: Record<string, { color: string; label: string }> = {
  supporter: { color: "#6b7280", label: "Supporter" },
  membre: { color: "#8b5cf6", label: "Membre" },
  joueur: { color: "#22c55e", label: "Joueur" },
  staff: { color: "#3b82f6", label: "Staff" },
  admin: { color: "#f59e0b", label: "Admin" },
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "#22c55e", bg: "#22c55e15", label: "Actif" },
  inactive: { color: "#6b7280", bg: "#6b728015", label: "Inactif" },
  expired: { color: "#ef4444", bg: "#ef444415", label: "Expire" },
}


// ============ DASHBOARD SCREEN ============
export function AdminDashboardScreen({ club }: { club: Club }) {
  const stats = [
    { label: "Membres", value: "247", change: "+12%", up: true, icon: Users, color: "#8b5cf6" },
    { label: "Revenus", value: "1.2M", change: "+18%", up: true, icon: CircleDollarSign, color: "#22c55e" },
    { label: "Billets", value: "456", change: "+8%", up: true, icon: Ticket, color: "#3b82f6" },
    { label: "Dons", value: "180K", change: "+25%", up: true, icon: Gift, color: "#ef4444" },
  ]

  const recentActivity = [
    { label: "Nouvelle adhesion Gold", user: "Moussa D.", time: "il y a 2h", icon: CreditCard, color: "#8b5cf6" },
    { label: "Achat 2 billets VIP", user: "Ibrahima N.", time: "il y a 3h", icon: Ticket, color: "#3b82f6" },
    { label: "Don de 50 000 FCFA", user: "Cheikh D.", time: "il y a 5h", icon: Gift, color: "#ef4444" },
    { label: "Commande boutique", user: "Amadou F.", time: "il y a 6h", icon: ShoppingBag, color: "#f59e0b" },
    { label: "Nouvelle adhesion Silver", user: "Pape G.", time: "il y a 8h", icon: CreditCard, color: "#8b5cf6" },
  ]

  const quickActions = [
    { icon: FileText, label: "Publier", desc: "Creer un article" },
    { icon: Bell, label: "Notifier", desc: "Envoyer une notification" },
    { icon: Calendar, label: "Evenement", desc: "Ajouter un match" },
    { icon: UserPlus, label: "Membre", desc: "Ajouter un membre" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      {/* Welcome header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Vue d&apos;ensemble de {club.name}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
              <div className="flex items-center gap-0.5" style={{ color: stat.up ? "#22c55e" : "#ef4444" }}>
                {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-semibold">{stat.change}</span>
              </div>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Revenus (FCFA)</h3>
          <span className="text-[11px] text-muted-foreground px-2.5 py-1 rounded-full bg-muted">Ce mois</span>
        </div>
        <div className="flex items-end gap-1.5 h-28">
          {[35, 55, 42, 68, 48, 72, 85, 62, 78, 92, 70, 88].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
              className="flex-1 rounded-t-md"
              style={{ background: i === 11 ? club.primaryColor : `${club.primaryColor}30` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">Jan</span>
          <span className="text-[10px] text-muted-foreground">Fev</span>
          <span className="text-[10px] text-muted-foreground">Mar</span>
          <span className="text-[10px] text-muted-foreground">Avr</span>
          <span className="text-[10px] text-muted-foreground">Mai</span>
          <span className="text-[10px] text-muted-foreground">Jun</span>
          <span className="text-[10px] text-muted-foreground">Jul</span>
          <span className="text-[10px] text-muted-foreground">Aou</span>
          <span className="text-[10px] text-muted-foreground">Sep</span>
          <span className="text-[10px] text-muted-foreground">Oct</span>
          <span className="text-[10px] text-muted-foreground">Nov</span>
          <span className="text-[10px] text-muted-foreground font-semibold" style={{ color: club.primaryColor }}>Dec</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Total annuel</p>
            <p className="text-lg font-bold text-foreground">8 450 000 <span className="text-xs font-normal text-muted-foreground">FCFA</span></p>
          </div>
          <div className="flex items-center gap-1" style={{ color: "#22c55e" }}>
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-bold">+18%</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Actions rapides</h3>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${club.primaryColor}15` }}>
                <a.icon className="w-5 h-5" style={{ color: club.primaryColor }} />
              </div>
              <span className="text-[11px] font-semibold text-foreground">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Activite recente</h3>
          <button className="text-xs font-medium" style={{ color: club.primaryColor }}>Tout voir</button>
        </div>
        <div className="space-y-2">
          {recentActivity.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15` }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
                <p className="text-[11px] text-muted-foreground">{a.user}</p>
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


// ============ MEMBERS SCREEN ============
export function AdminMembersScreen({ club }: { club: Club }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null)

  const roleFilters = [
    { key: "all", label: "Tous" },
    { key: "membre", label: "Membres" },
    { key: "joueur", label: "Joueurs" },
    { key: "staff", label: "Staff" },
    { key: "supporter", label: "Supporters" },
  ]

  const filtered = mockMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = filterRole === "all" || m.role === filterRole
    return matchSearch && matchRole
  })

  const memberStats = [
    { label: "Total", value: mockMembers.length.toString() },
    { label: "Actifs", value: mockMembers.filter(m => m.status === "active").length.toString() },
    { label: "Membres", value: mockMembers.filter(m => m.role === "membre").length.toString() },
    { label: "Joueurs", value: mockMembers.filter(m => m.role === "joueur").length.toString() },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4 pb-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Membres</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{mockMembers.length} utilisateurs enregistres</p>
        </div>
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: club.primaryColor, color: "white" }}
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-4 gap-2">
        {memberStats.map((s, i) => (
          <div key={s.label} className="text-center p-2.5 rounded-xl" style={{ background: i === 0 ? `${club.primaryColor}10` : "var(--muted)" }}>
            <p className="font-bold text-foreground" style={i === 0 ? { color: club.primaryColor } : undefined}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Role filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {roleFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilterRole(f.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: filterRole === f.key ? club.primaryColor : "var(--muted)",
              color: filterRole === f.key ? "white" : "var(--muted-foreground)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Member list */}
      <div className="space-y-2">
        {filtered.map((member, idx) => {
          const role = roleConfig[member.role] || roleConfig.supporter
          const status = statusConfig[member.status]
          return (
            <motion.button
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setSelectedMember(member)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border text-left"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-border">
                <Image src={member.profileImage} alt={member.name} width={44} height={44} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{member.name}</span>
                  {member.tier && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}>
                      {member.tier}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${role.color}15`, color: role.color }}>
                    {role.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{member.joinedDate}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>
                  {status.label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Member detail sheet */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailSheet member={selectedMember} club={club} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ MEMBER DETAIL SHEET ============
function MemberDetailSheet({ member, club, onClose }: { member: MemberData; club: Club; onClose: () => void }) {
  const [editRole, setEditRole] = useState(false)
  const [currentRole, setCurrentRole] = useState(member.role)
  const role = roleConfig[currentRole] || roleConfig.supporter
  const status = statusConfig[member.status]

  const allRoles = ["supporter", "membre", "joueur", "staff", "admin"]

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Fiche membre</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
              <Image src={member.profileImage} alt={member.name} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-lg">{member.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${role.color}15`, color: role.color }}>
                  {role.label}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>
                  {status.label}
                </span>
                {member.tier && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}>
                    {member.tier}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{member.phone}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Inscrit depuis {member.joinedDate}</span>
            </div>
          </div>

          {/* Role management */}
          <div className="p-4 rounded-xl bg-card border border-border mb-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role actuel</h4>
              <button
                onClick={() => setEditRole(!editRole)}
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: `${club.primaryColor}15`, color: club.primaryColor }}
              >
                {editRole ? "Fermer" : "Modifier"}
              </button>
            </div>

            {editRole ? (
              <div className="space-y-1.5">
                {allRoles.map(r => {
                  const rc = roleConfig[r]
                  return (
                    <button
                      key={r}
                      onClick={() => { setCurrentRole(r); setEditRole(false); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                      style={{
                        background: currentRole === r ? `${rc.color}10` : "var(--muted)",
                        border: `1.5px solid ${currentRole === r ? rc.color : "transparent"}`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${rc.color}15` }}>
                          <Shield className="w-4 h-4" style={{ color: rc.color }} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{rc.label}</span>
                      </div>
                      {currentRole === r && <Check className="w-4 h-4" style={{ color: rc.color }} />}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${role.color}15` }}>
                  <Shield className="w-5 h-5" style={{ color: role.color }} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{role.label}</p>
                  <p className="text-xs text-muted-foreground">Depuis {member.joinedDate}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-border"
            >
              <Bell className="w-4 h-4" />
              Envoyer une notification
            </button>
            {member.status === "active" ? (
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-red-500 flex items-center justify-center gap-2 border border-red-200">
                <UserX className="w-4 h-4" />
                Desactiver le compte
              </button>
            ) : (
              <button
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: club.primaryColor }}
              >
                <UserCheck className="w-4 h-4" />
                Reactiver le compte
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}


// ============ CONTENT SCREEN ============
export function AdminContentScreen({ club }: { club: Club }) {
  const [filterType, setFilterType] = useState("all")
  const [showCreatePost, setShowCreatePost] = useState(false)

  const typeFilters = [
    { key: "all", label: "Tous" },
    { key: "article", label: "Articles" },
    { key: "photo", label: "Photos" },
    { key: "video", label: "Videos" },
    { key: "announcement", label: "Annonces" },
  ]

  const typeIcons: Record<string, typeof FileText> = {
    article: FileText,
    photo: ImageIcon,
    video: Video,
    announcement: Megaphone,
  }

  const typeColors: Record<string, string> = {
    article: "#3b82f6",
    photo: "#22c55e",
    video: "#f59e0b",
    announcement: "#ef4444",
  }

  const filtered = filterType === "all" ? mockPosts : mockPosts.filter(p => p.type === filterType)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4 pb-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Contenus</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{mockPosts.length} publications</p>
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: club.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          Creer
        </button>
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total vues</span>
          </div>
          <p className="text-lg font-bold text-foreground">4 780</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total likes</span>
          </div>
          <p className="text-lg font-bold text-foreground">478</p>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {typeFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: filterType === f.key ? club.primaryColor : "var(--muted)",
              color: filterType === f.key ? "white" : "var(--muted-foreground)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="space-y-2.5">
        {filtered.map((post, idx) => {
          const TypeIcon = typeIcons[post.type] || FileText
          const typeColor = typeColors[post.type] || "#6b7280"
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${typeColor}15` }}>
                  <TypeIcon className="w-5 h-5" style={{ color: typeColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-semibold text-foreground truncate">{post.title}</h4>
                    {post.isPremium && (
                      <Crown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#f59e0b" }} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground">{post.date}</span>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{
                        background: post.status === "published" ? "#22c55e15" : "#f59e0b15",
                        color: post.status === "published" ? "#22c55e" : "#f59e0b",
                      }}
                    >
                      {post.status === "published" ? "Publie" : "Brouillon"}
                    </span>
                    {post.status === "published" && (
                      <>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{post.likes}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Create post sheet */}
      <AnimatePresence>
        {showCreatePost && <CreatePostSheet club={club} onClose={() => setShowCreatePost(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ CREATE POST SHEET ============
function CreatePostSheet({ club, onClose }: { club: Club; onClose: () => void }) {
  const [postType, setPostType] = useState<string>("article")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePublish = () => {
    if (!title.trim()) return
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setIsSuccess(true)
      setTimeout(onClose, 1500)
    }, 1500)
  }

  const postTypes = [
    { key: "article", label: "Article", icon: FileText },
    { key: "photo", label: "Photo", icon: ImageIcon },
    { key: "video", label: "Video", icon: Video },
    { key: "announcement", label: "Annonce", icon: Megaphone },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="px-4 pb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-foreground">
              {isSuccess ? "Publication reussie" : "Nouvelle publication"}
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: club.primaryColor }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-foreground font-semibold">Contenu publie avec succes</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Post type selector */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Type de contenu</label>
                <div className="grid grid-cols-4 gap-2">
                  {postTypes.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setPostType(t.key)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                      style={{
                        background: postType === t.key ? `${club.primaryColor}10` : "var(--muted)",
                        border: `1.5px solid ${postType === t.key ? club.primaryColor : "transparent"}`,
                      }}
                    >
                      <t.icon className="w-5 h-5" style={{ color: postType === t.key ? club.primaryColor : "var(--muted-foreground)" }} />
                      <span className="text-[10px] font-medium" style={{ color: postType === t.key ? club.primaryColor : "var(--muted-foreground)" }}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la publication..."
                  className="w-full px-4 py-3 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Contenu</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Redigez votre contenu ici..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
                />
              </div>

              {/* Premium toggle */}
              <button
                onClick={() => setIsPremium(!isPremium)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5" style={{ color: "#f59e0b" }} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Contenu premium</p>
                    <p className="text-[11px] text-muted-foreground">Reserve aux membres adherents</p>
                  </div>
                </div>
                {isPremium ? (
                  <ToggleRight className="w-8 h-8 flex-shrink-0" style={{ color: club.primaryColor }} />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {/* Media upload area */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Ajouter des medias</p>
                <p className="text-[11px] text-muted-foreground mt-1">Photos, videos ou documents</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border text-foreground">
                  Brouillon
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!title.trim() || isPublishing}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: club.primaryColor }}
                >
                  {isPublishing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publier
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}


// ============ FINANCE SCREEN ============
export function AdminFinanceScreen({ club }: { club: Club }) {
  const [filterType, setFilterType] = useState("all")

  const revenueBreakdown = [
    { type: "adhesion", label: "Adhesions", amount: 375000, percent: 31, color: "#8b5cf6" },
    { type: "billet", label: "Billetterie", amount: 320000, percent: 27, color: "#3b82f6" },
    { type: "boutique", label: "Boutique", amount: 245000, percent: 20, color: "#f59e0b" },
    { type: "don", label: "Dons", amount: 260000, percent: 22, color: "#ef4444" },
  ]

  const totalRevenue = revenueBreakdown.reduce((s, r) => s + r.amount, 0)

  const typeFilters = [
    { key: "all", label: "Tous" },
    { key: "adhesion", label: "Adhesions" },
    { key: "billet", label: "Billets" },
    { key: "boutique", label: "Boutique" },
    { key: "don", label: "Dons" },
  ]

  const filteredTransactions = filterType === "all"
    ? mockTransactions
    : mockTransactions.filter(t => t.type === filterType)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground">Finances</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Suivi des revenus de {club.name}</p>
      </div>

      {/* Total revenue card */}
      <div
        className="p-5 rounded-2xl relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}CC)` }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: `${club.secondaryColor}15` }} />
        <p className="text-white/70 text-xs font-medium mb-1 relative z-10">Revenu total ce mois</p>
        <p className="text-3xl font-bold text-white relative z-10">
          {totalRevenue.toLocaleString()} <span className="text-sm font-normal text-white/70">FCFA</span>
        </p>
        <div className="flex items-center gap-1 mt-2 relative z-10" style={{ color: club.secondaryColor }}>
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-sm font-semibold">+18% vs mois precedent</span>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Repartition des revenus</h3>
        
        {/* Visual bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {revenueBreakdown.map((r) => (
            <motion.div
              key={r.type}
              initial={{ width: 0 }}
              animate={{ width: `${r.percent}%` }}
              transition={{ duration: 0.8 }}
              style={{ background: r.color }}
            />
          ))}
        </div>

        <div className="space-y-3">
          {revenueBreakdown.map((r) => {
            const config = transTypeConfig[r.type]
            return (
              <div key={r.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${r.color}15` }}>
                    <config.icon className="w-4 h-4" style={{ color: r.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.label}</p>
                    <p className="text-[10px] text-muted-foreground">{r.percent}% du total</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">{r.amount.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">FCFA</span></p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Transactions recentes</h3>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide mb-3">
          {typeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: filterType === f.key ? club.primaryColor : "var(--muted)",
                color: filterType === f.key ? "white" : "var(--muted-foreground)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredTransactions.map((tx, idx) => {
            const config = transTypeConfig[tx.type]
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${config.color}15` }}>
                  <config.icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{tx.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{tx.user}</span>
                    <span className="text-[10px] text-muted-foreground">{tx.date}</span>
                    <span className="text-[10px] text-muted-foreground">{tx.method}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: "#22c55e" }}>+{tx.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">FCFA</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}


// ============ SETTINGS SCREEN ============
export function AdminSettingsScreen({ club }: { club: Club }) {
  const [settings, setSettings] = useState({
    memberships_enabled: true,
    ticketing_enabled: true,
    shop_enabled: true,
    donations_enabled: true,
    sponsors_enabled: false,
    premium_content: true,
    notifications_public: true,
    notifications_internal: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const settingGroups = [
    {
      title: "Modules actifs",
      desc: "Activez ou desactivez les fonctionnalites",
      items: [
        { key: "memberships_enabled" as const, label: "Adhesions", desc: "Gestion des membres et cartes digitales", icon: CreditCard },
        { key: "ticketing_enabled" as const, label: "Billetterie", desc: "Vente de billets en ligne", icon: Ticket },
        { key: "shop_enabled" as const, label: "Boutique", desc: "Vente de produits derives", icon: ShoppingBag },
        { key: "donations_enabled" as const, label: "Dons", desc: "Recevoir des contributions", icon: Gift },
        { key: "sponsors_enabled" as const, label: "Sponsors", desc: "Espaces partenaires et publicites", icon: Award },
      ]
    },
    {
      title: "Contenu et notifications",
      desc: "Parametres de diffusion",
      items: [
        { key: "premium_content" as const, label: "Contenu premium", desc: "Contenus reserves aux membres", icon: Crown },
        { key: "notifications_public" as const, label: "Notifications publiques", desc: "Alertes matchs et resultats", icon: Bell },
        { key: "notifications_internal" as const, label: "Notifications internes", desc: "Communications joueurs et staff", icon: Megaphone },
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground">Parametres</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Configuration de {club.name}</p>
      </div>

      {/* Club identity card */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Identite du club</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-white p-1.5 flex-shrink-0">
            <Image src={club.logo} alt={club.name} width={64} height={64} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">{club.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border border-border" style={{ background: club.primaryColor }} />
                <span className="text-[10px] text-muted-foreground">Principale</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border border-border" style={{ background: club.secondaryColor }} />
                <span className="text-[10px] text-muted-foreground">Secondaire</span>
              </div>
            </div>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted">
            <Edit3 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Settings groups */}
      {settingGroups.map((group) => (
        <div key={group.title}>
          <div className="mb-3">
            <h3 className="text-sm font-bold text-foreground">{group.title}</h3>
            <p className="text-[11px] text-muted-foreground">{group.desc}</p>
          </div>
          <div className="space-y-1.5">
            {group.items.map((item) => (
              <button
                key={item.key}
                onClick={() => toggleSetting(item.key)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: settings[item.key] ? `${club.primaryColor}15` : "var(--muted)" }}
                  >
                    <item.icon className="w-5 h-5 transition-colors" style={{ color: settings[item.key] ? club.primaryColor : "var(--muted-foreground)" }} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                {settings[item.key] ? (
                  <ToggleRight className="w-9 h-9 flex-shrink-0" style={{ color: club.primaryColor }} />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-muted-foreground flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50">
        <h3 className="text-sm font-bold text-red-600 mb-2">Zone de danger</h3>
        <p className="text-xs text-red-500/70 mb-3">Ces actions sont irreversibles et affectent tout le club.</p>
        <button className="w-full py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200">
          Suspendre le club
        </button>
      </div>
    </motion.div>
  )
}
