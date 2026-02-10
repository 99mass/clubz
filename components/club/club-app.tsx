"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, Newspaper, Calendar, ShoppingBag, User,
  ArrowLeft, Bell, Share2, Heart, Settings,
  Ticket, Gift, BarChart3, CreditCard, Users, LayoutDashboard, ChevronRight, RefreshCw, Check, MapPin, X, Phone, Megaphone, Shirt, Clipboard
} from "lucide-react"
import Image from "next/image"
import { Crown, Award, Lock } from "lucide-react"
import { MembershipScreen } from "./screens/membership-screen"
import { NotificationsScreen } from "./screens/notifications-screen"
import { JoueurAccueilScreen, CalendrierJoueurScreen, TeamScreen, AnnouncementsScreen } from "./screens/joueur-screens"
import { StaffEquipeScreen, StaffCalendrierScreen, StaffAnnouncementsScreen } from "./screens/staff-screens"
import { AdminDashboardScreen, AdminMembersScreen, AdminContentScreen, AdminFinanceScreen, AdminSettingsScreen } from "./screens/admin-screens"

// Types
export interface Club {
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

export type UserRole = "guest" | "supporter" | "membre" | "joueur" | "staff" | "admin"

// Ticket types
interface MatchInfo {
  id: number
  opponent: Club | null
  date: string
  time: string
  location: string
  isHome: boolean
  competition: string
}

interface TicketCategory {
  id: string
  name: string
  price: number
  description: string
  available: number
}

interface TicketCartItem {
  category: TicketCategory
  quantity: number
}

interface PurchasedTicket {
  id: string
  match: MatchInfo
  category: TicketCategory
  quantity: number
  purchaseDate: string
  status: "upcoming" | "past" | "cancelled"
  scanned?: boolean
}

interface ClubAppProps {
  club: Club
  allClubs: Club[]
  onBack: () => void
  isGuest: boolean
  userRole: UserRole
  userPhone?: string | null
  onLogin: (fromCheckout?: boolean) => void
  onChangeClub: () => void
  onLogout: () => void
  onRoleChange?: (role: UserRole) => void
  initialCheckout?: boolean
  onCheckoutStarted?: () => void
}

type TabId = "accueil" | "actu" | "agenda" | "boutique" | "profil" | "calendrier" | "equipe" | "annonces" | "dashboard" | "membres" | "contenu" | "finance" | "settings"

// Bottom navigation tabs - role-aware
const getNavTabs = (userRole: UserRole) => {
  if (userRole === "joueur") {
    return [
      { id: "accueil" as TabId, label: "Accueil", icon: Home },
      { id: "calendrier" as TabId, label: "Calendrier", icon: Calendar },
      { id: "equipe" as TabId, label: "Equipe", icon: Users },
      { id: "profil" as TabId, label: "Profil", icon: User },
    ]
  }
  if (userRole === "staff") {
    return [
      { id: "equipe" as TabId, label: "Equipe", icon: Users },
      { id: "calendrier" as TabId, label: "Calendrier", icon: Calendar },
      { id: "annonces" as TabId, label: "Annonces", icon: Megaphone },
      { id: "profil" as TabId, label: "Profil", icon: User },
    ]
  }
  if (userRole === "admin") {
    return [
      { id: "dashboard" as TabId, label: "Board", icon: LayoutDashboard },
      { id: "membres" as TabId, label: "Membres", icon: Users },
      { id: "contenu" as TabId, label: "Contenu", icon: Newspaper },
      { id: "finance" as TabId, label: "Finance", icon: BarChart3 },
      { id: "settings" as TabId, label: "Reglages", icon: Settings },
    ]
  }
  return [
    { id: "accueil" as TabId, label: "Accueil", icon: Home },
    { id: "actu" as TabId, label: "Actu", icon: Newspaper },
    { id: "agenda" as TabId, label: "Agenda", icon: Calendar },
    { id: "boutique" as TabId, label: "Boutique", icon: ShoppingBag },
    { id: "profil" as TabId, label: "Profil", icon: User },
  ]
}

export function ClubApp({ club, allClubs, onBack, isGuest, userRole, userPhone, onLogin, onChangeClub, onLogout, onRoleChange, initialCheckout, onCheckoutStarted }: ClubAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialCheckout ? "boutique" : "accueil")
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(initialCheckout || false)
  const [showCheckout, setShowCheckout] = useState(initialCheckout || false)
  // Ticket states
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null)
  const [ticketCart, setTicketCart] = useState<TicketCartItem[]>([])
  const [showTicketCheckout, setShowTicketCheckout] = useState(false)
  const [showMyTickets, setShowMyTickets] = useState(false)
  const [showDonation, setShowDonation] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMembership, setShowMembership] = useState(false)
  const [showMembershipGate, setShowMembershipGate] = useState(false)
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([
    // Sample purchased tickets - one scanned, one not
    {
      id: "TKT-ABC123",
      match: { id: 1, opponent: null, date: "Dim 15", time: "16:00", location: "Stade Leopold Sedar Senghor", isHome: true, competition: "Ligue 1" },
      category: { id: "tribune", name: "Tribune Couverte", price: 5000, description: "Places assises couvertes", available: 200 },
      quantity: 2,
      purchaseDate: "10 Fev 2026",
      status: "upcoming",
      scanned: false
    },
    {
      id: "TKT-DEF456",
      match: { id: 2, opponent: null, date: "Sam 8", time: "17:00", location: "Stade Municipal", isHome: false, competition: "Coupe du Senegal" },
      category: { id: "vip", name: "Tribune VIP", price: 10000, description: "Places assises numerotees", available: 50 },
      quantity: 1,
      purchaseDate: "5 Fev 2026",
      status: "upcoming",
      scanned: true
    }
  ])
  
  // Clear initial checkout flag after mounting
  React.useEffect(() => {
    if (initialCheckout && onCheckoutStarted) {
      onCheckoutStarted()
    }
  }, [])

  // Reset tab when role changes to ensure valid tab is selected
  React.useEffect(() => {
    const tabs = getNavTabs(userRole)
    const validTabs = tabs.map(t => t.id)
    if (!validTabs.includes(activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [userRole])
  
  const handleAddToCart = (item: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === item.product.id && i.size === item.size && i.color === item.color
      )
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += item.quantity
        return updated
      }
      return [...prev, item]
    })
  }
  
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ))
  }
  
  const handleRemoveItem = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }
  
  const handleCheckoutComplete = () => {
    setCart([])
    setShowCheckout(false)
    setShowCart(false)
    setSelectedProduct(null)
  }

  const handleBuyNow = (item: CartItem) => {
    setCart([item])
    setSelectedProduct(null)
    setShowCheckout(true)
  }

  // Ticket handlers
  const handleAddTickets = (items: TicketCartItem[]) => {
    setTicketCart(items)
  }

  const handleTicketCheckoutComplete = () => {
    // Add purchased tickets to the list
    if (selectedMatch) {
      const newTickets: PurchasedTicket[] = ticketCart.map(item => ({
        id: `TKT-${Date.now().toString(36).toUpperCase()}`,
        match: selectedMatch,
        category: item.category,
        quantity: item.quantity,
        purchaseDate: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
        status: "upcoming"
      }))
      setPurchasedTickets(prev => [...newTickets, ...prev])
    }
    setTicketCart([])
    setShowTicketCheckout(false)
    setSelectedMatch(null)
  }
  
  const navTabs = getNavTabs(userRole)

  const handleFollow = () => {
    if (isGuest) {
      onLogin()
    } else {
      setIsFollowing(!isFollowing)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}DD)` 
        }}
      >
        {/* Top bar */}
        <div className="flex items-start justify-between p-4 relative z-10">
          {/* Left: Stacked vertically - Back button + Logo/Name row, then Follow button below */}
          <div className="flex flex-col items-start gap-2">
            {/* Row 1: Back button (guest) + Club logo and name */}
            <div className="flex items-center gap-3">
              {isGuest && (
                <button
                  onClick={onBack}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}
              
              <div 
                className="w-9 h-9 rounded-full p-0.5 flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${club.secondaryColor}, white)` }}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={club.logo || "/placeholder.svg"}
                    alt={club.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="font-bold text-white">{club.name}</span>
            </div>
            
            {/* Row 2: Follow button aligned below */}
            <div className={`flex items-center gap-2 ${isGuest ? "ml-12" : ""}`}>
              <button
                onClick={handleFollow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ 
                  background: isFollowing ? "white" : `${club.secondaryColor}`,
                  color: isFollowing ? club.primaryColor : (club.secondaryColor === "#FFFFFF" || club.secondaryColor.toLowerCase() === "#fff" || club.secondaryColor === "#FFC107" || club.secondaryColor === "#FFEB3B" ? club.primaryColor : "white")
                }}
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowing ? "fill-current" : ""}`} />
                {isFollowing ? "Suivi" : "Suivre"}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium">
                <Share2 className="w-3.5 h-3.5" />
                Partager
              </button>
            </div>
          </div>

          {/* Right: Notification */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 relative"
          >
            <Bell className="w-4 h-4 text-white" />
            {(userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin") && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2" style={{ borderColor: club.primaryColor }} />
            )}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto pb-16">
        <AnimatePresence mode="wait">
{/* Overlay Screens - shown on top of everything */}
  {/* Notifications */}
  {showNotifications && (
    <NotificationsScreen key="notifications" club={club} userRole={userRole} onBack={() => setShowNotifications(false)} />
  )}
  {/* Membership / Adhesion */}
  {showMembership && !showNotifications && (
    <MembershipScreen key="membership" club={club} userRole={userRole} isGuest={isGuest} onLogin={onLogin} onBack={() => setShowMembership(false)} />
  )}
  {/* Premium Content */}

  {/* My Tickets */}
  {showMyTickets && !showNotifications && !showMembership && (
    <MyTicketsScreen key="my-tickets" club={club} tickets={purchasedTickets} onBack={() => setShowMyTickets(false)} />
  )}
  {/* Donation */}
  {showDonation && !showNotifications && !showMembership && (
    <DonationScreen key="donation" club={club} isGuest={isGuest} userPhone={userPhone} onBack={() => setShowDonation(false)} />
  )}
  {/* Announcements (Joueur) */}
  {showAnnouncements && !showNotifications && !showMembership && (
    <AnnouncementsScreen key="announcements" club={club} onBack={() => setShowAnnouncements(false)} />
  )}
  
{/* Regular tab screens - hidden when any overlay is active */}
  {/* JOUEUR-SPECIFIC TABS */}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "joueur" && activeTab === "accueil" && (
    <JoueurAccueilScreen key="joueur-accueil" club={club} allClubs={allClubs} onShowNotifications={() => setShowNotifications(true)} onShowAnnouncements={() => setShowAnnouncements(true)} onGoToCalendar={() => setActiveTab("calendrier")} onGoToTeam={() => setActiveTab("equipe")} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "joueur" && activeTab === "calendrier" && (
    <CalendrierJoueurScreen key="joueur-calendrier" club={club} allClubs={allClubs} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "joueur" && activeTab === "equipe" && (
    <TeamScreen key="joueur-equipe" club={club} />
  )}
  {/* STAFF-SPECIFIC TABS */}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "staff" && activeTab === "equipe" && (
    <StaffEquipeScreen key="staff-equipe" club={club} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "staff" && activeTab === "calendrier" && (
    <StaffCalendrierScreen key="staff-calendrier" club={club} allClubs={allClubs} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "staff" && activeTab === "annonces" && (
    <StaffAnnouncementsScreen key="staff-annonces" club={club} />
  )}
  {/* ADMIN-SPECIFIC TABS */}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "admin" && activeTab === "dashboard" && (
    <AdminDashboardScreen key="admin-dashboard" club={club} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "admin" && activeTab === "membres" && (
    <AdminMembersScreen key="admin-members" club={club} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "admin" && activeTab === "contenu" && (
    <AdminContentScreen key="admin-content" club={club} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "admin" && activeTab === "finance" && (
    <AdminFinanceScreen key="admin-finance" club={club} />
  )}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole === "admin" && activeTab === "settings" && (
    <AdminSettingsScreen key="admin-settings" club={club} />
  )}
  {/* DEFAULT TABS (all non-joueur/staff/admin roles) */}
  {!showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && userRole !== "joueur" && userRole !== "staff" && userRole !== "admin" && activeTab === "accueil" && (
            <AccueilScreen key="accueil" club={club} allClubs={allClubs} userRole={userRole} isGuest={isGuest} onLogin={onLogin} onShowMyTickets={() => setShowMyTickets(true)} onGoToTab={setActiveTab} onSelectMatch={(match) => { setSelectedMatch(match); setActiveTab("agenda"); }} onShowDonation={() => setShowDonation(true)} onShowMembership={() => setShowMembership(true)} />
          )}
            {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "actu" && !selectedNews && (
            <ActuScreen key="actu" club={club} onSelectNews={setSelectedNews} userRole={userRole} onShowMembershipGate={() => setShowMembershipGate(true)} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "actu" && selectedNews && (
            <NewsDetailScreen key="news-detail" club={club} news={selectedNews} onBack={() => setSelectedNews(null)} userRole={userRole} onShowMembership={() => setShowMembership(true)} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "agenda" && !selectedMatch && !showTicketCheckout && (
            <AgendaScreen key="agenda" club={club} allClubs={allClubs} userRole={userRole} isGuest={isGuest} onLogin={onLogin} onSelectMatch={setSelectedMatch} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "agenda" && selectedMatch && !showTicketCheckout && (
            <TicketSelectionScreen key="ticket-selection" club={club} match={selectedMatch} onBack={() => setSelectedMatch(null)} onProceed={(items) => { handleAddTickets(items); setShowTicketCheckout(true); }} isGuest={isGuest} onLogin={onLogin} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "agenda" && showTicketCheckout && (
            <TicketCheckoutScreen key="ticket-checkout" club={club} match={selectedMatch!} tickets={ticketCart} onBack={() => setShowTicketCheckout(false)} onComplete={handleTicketCheckoutComplete} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "boutique" && !selectedProduct && !showCart && !showCheckout && (
            <BoutiqueScreen key="boutique" club={club} cart={cart} onSelectProduct={setSelectedProduct} onOpenCart={() => setShowCart(true)} userRole={userRole} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "boutique" && selectedProduct && !showCart && !showCheckout && (
            <ProductDetailScreen key="product-detail" club={club} product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} userRole={userRole} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "boutique" && showCart && !showCheckout && (
            <CartScreen key="cart" club={club} cart={cart} onBack={() => setShowCart(false)} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onCheckout={() => setShowCheckout(true)} isGuest={isGuest} onLogin={onLogin} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "boutique" && showCheckout && (
            <CheckoutScreen key="checkout" club={club} cart={cart} onBack={() => setShowCheckout(false)} onComplete={handleCheckoutComplete} />
          )}
          {!showMyTickets && !showDonation && !showNotifications && !showMembership && activeTab === "profil" && (
            <ProfilScreen key="profil" club={club} userRole={userRole} isGuest={isGuest} onLogin={onLogin} onChangeClub={onChangeClub} onLogout={onLogout} onShowMyTickets={() => setShowMyTickets(true)} ticketCount={purchasedTickets.filter(t => t.status === "upcoming").length} onRoleChange={onRoleChange} onShowMembership={() => setShowMembership(true)} onShowNotifications={() => setShowNotifications(true)} onShowAnnouncements={() => setShowAnnouncements(true)} />
          )}
        </AnimatePresence>
      </div>

      {/* Membership Gate Modal */}
      <AnimatePresence>
        {showMembershipGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMembershipGate(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-background rounded-t-3xl p-6 pb-10"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})` }}
                >
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-foreground text-xl mb-2">Contenu reserve aux membres</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Cet article est exclusivement reserve aux membres du club. 
                  Rejoignez-nous pour acceder a tous les contenus exclusifs, interviews et coulisses.
                </p>
                <button
                  onClick={() => { setShowMembershipGate(false); setShowMembership(true); }}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white mb-3"
                  style={{ background: club.primaryColor }}
                >
                  Devenir membre
                </button>
                <button
                  onClick={() => setShowMembershipGate(false)}
                  className="w-full py-3 rounded-xl text-sm font-medium text-muted-foreground border border-border"
                >
                  Plus tard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - hidden on detail screens */}
      {!selectedProduct && !showCart && !showCheckout && !selectedNews && !selectedMatch && !showTicketCheckout && !showMyTickets && !showDonation && !showNotifications && !showMembership && !showAnnouncements && (
        <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-sm border-t border-border safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all"
              >
                <tab.icon 
                  className="w-5 h-5 transition-colors"
                  style={{ color: activeTab === tab.id ? club.primaryColor : "var(--muted-foreground)" }}
                />
                <span 
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: activeTab === tab.id ? club.primaryColor : "var(--muted-foreground)" }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* Guest indicator */}
          {isGuest && (
            <div 
              className="text-center py-1.5 text-xs text-white"
              style={{ background: club.primaryColor }}
            >
              Mode visiteur - <button onClick={onLogin} className="underline font-medium">Se connecter</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============ ACCUEIL SCREEN ============
function AccueilScreen({ club, allClubs, userRole, isGuest, onLogin, onShowMyTickets, onGoToTab, onSelectMatch, onShowDonation, onShowMembership }: { 
  club: Club, 
  allClubs: Club[], 
  userRole: UserRole, 
  isGuest: boolean, 
  onLogin: () => void,
  onShowMyTickets: () => void,
  onGoToTab: (tab: TabId) => void,
  onSelectMatch: (match: MatchInfo) => void,
  onShowDonation: () => void,
  onShowMembership: () => void,
}) {
  // Get a deterministic opponent from same category
  const opponents = allClubs.filter(c => c.category === club.category && c.id !== club.id)
  const opponent = opponents.length > 0 ? opponents[0] : null
  const competitionName = club.category === "ligue1" ? "Ligue 1" : club.category === "ligue2" ? "Ligue 2" : "Navetanes"
  
  // Next match info
  const nextMatch: MatchInfo = {
    id: 1,
    opponent: opponent,
    date: "Dim 15",
    time: "16:00",
    location: "Stade Leopold Sedar Senghor",
    isHome: true,
    competition: competitionName
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-6"
    >
      {/* Hero section with next match */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor}20, ${club.secondaryColor}20)` }}
      >
        <div className="p-4">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: club.primaryColor, color: "white" }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Prochain match
          </div>
          
          {/* Teams display - responsive */}
          <div className="flex items-center justify-between gap-2">
            {/* Home team */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                <Image src={club.logo || "/placeholder.svg"} alt={club.name} width={56} height={56} className="w-full h-full object-cover rounded-full" />
              </div>
              <p className="font-bold text-foreground text-xs sm:text-sm text-center mt-2 line-clamp-1">{club.name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Domicile</p>
            </div>
            
            {/* VS, competition and time */}
            <div className="flex flex-col items-center px-2 flex-shrink-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">VS</p>
              <span 
                className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium border whitespace-nowrap"
                style={{ borderColor: `${club.primaryColor}50`, color: club.primaryColor }}
              >
                {competitionName}
              </span>
              <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap mt-1">Dim 16:00</p>
            </div>
            
            {/* Away team */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              {opponent ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                  <Image src={opponent.logo || "/placeholder.svg"} alt={opponent.name} width={56} height={56} className="w-full h-full object-cover rounded-full" />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-muted flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-lg sm:text-xl font-bold text-muted-foreground">?</span>
                </div>
              )}
              <p className="font-bold text-foreground text-xs sm:text-sm text-center mt-2 line-clamp-1">{opponent?.name || "A determiner"}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Exterieur</p>
            </div>
          </div>
          
          <button 
            onClick={() => onSelectMatch(nextMatch)}
            className="w-full mt-4 py-2.5 sm:py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all hover:opacity-90"
            style={{ background: club.primaryColor }}
          >
            Reserver mes billets
          </button>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {(userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin" ? [
          { icon: Award, label: "Adhesion", action: "adhesion" as const },
          { icon: Newspaper, label: "Actu", action: "actu" as const },
          { icon: Ticket, label: "Billets", action: "billets" as const },
          { icon: Gift, label: "Soutenir", action: "don" as const },
        ] : [
          { icon: Ticket, label: "Billets", action: "billets" as const },
          { icon: Award, label: "Adhesion", action: "adhesion" as const },
          { icon: Gift, label: "Soutenir", action: "don" as const },
          { icon: BarChart3, label: "Stats", action: "stats" as const },
        ]).map((item) => (
          <button
            key={item.action}
            onClick={() => {
              if (item.action === "billets") {
                if (isGuest) {
                  onLogin()
                } else {
                  onShowMyTickets()
                }
              } else if (item.action === "don") {
                onShowDonation()
              } else if (item.action === "adhesion") {
                onShowMembership()
              } else if (item.action === "actu") {
                onGoToTab("actu")
              } else if (item.action === "stats") {
                onGoToTab("agenda")
              }
            }}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ background: `${club.primaryColor}15` }}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: club.primaryColor }} />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Latest news */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground">Dernieres actualites</h2>
          <button className="text-sm font-medium" style={{ color: club.primaryColor }}>Voir tout</button>
        </div>
        
        <div className="space-y-3">
          {[
            { title: "Victoire eclatante face a l'adversaire", time: "Il y a 2h", image: "/images/club-hero.jpg" },
            { title: "Preparation pour le prochain match", time: "Hier", image: "/images/event-match.jpg" },
          ].map((news, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-3 rounded-2xl bg-card border border-border"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={news.image || "/placeholder.svg"} alt={news.title} width={80} height={80} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">{news.title}</h3>
                <p className="text-xs" style={{ color: club.primaryColor }}>{news.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Membership card for members -- tappable to open full membership screen */}
      {(userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin") && (
        <button 
          onClick={onShowMembership}
          className="w-full text-left rounded-2xl p-5 text-white relative overflow-hidden transition-transform active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})` }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between mb-1 relative z-10">
            <p className="text-xs font-medium opacity-80">Carte Membre</p>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white">
              Silver
            </span>
          </div>
          <p className="text-lg font-bold mb-3 relative z-10">Moussa Diallo</p>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs opacity-80">Membre depuis</p>
              <p className="font-semibold">Jan 2024</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Voir ma carte</p>
              <ChevronRight className="w-5 h-5 text-white/80 ml-auto" />
            </div>
          </div>
        </button>
      )}
    </motion.div>
  )
}

// ============ ACTU SCREEN ============
interface NewsItem {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  likes: number
  category: string
  readTime: string
  is_premium?: boolean
}

function ActuScreen({ club, onSelectNews, userRole, onShowMembershipGate }: { club: Club, onSelectNews: (news: NewsItem) => void, userRole: UserRole, onShowMembershipGate: () => void }) {
  const [likedNews, setLikedNews] = useState<number[]>([])
  const isMember = userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin"

  const handleSelectNews = (item: NewsItem) => {
    if (item.is_premium && !isMember) {
      onShowMembershipGate()
    } else {
      onSelectNews(item)
    }
  }
  
  const news: NewsItem[] = [
    { 
      id: 1, 
      title: "Victoire eclatante 3-1 face a l'adversaire", 
      excerpt: "Une performance remarquable de toute l'equipe lors du derby tant attendu.", 
      content: "L'equipe a livre une prestation exceptionnelle ce dimanche face a notre rival historique. Des la premiere mi-temps, nos joueurs ont impose leur rythme avec une possession de balle maitrisee. Le premier but est venu a la 23e minute grace a une frappe magistrale de notre attaquant vedette. La seconde periode a vu l'equipe confirmer sa domination avec deux buts supplementaires. Une victoire qui nous rapproche du titre et qui restera dans les memoires des supporters.", 
      image: "/images/news/victory.jpg", 
      date: "Il y a 2h", 
      likes: 234,
      category: "Match",
      readTime: "3 min"
    },
    { 
      id: 2, 
      title: "Coulisses: La tactique secrete du coach devoilee", 
      excerpt: "Decouvrez en exclusivite la preparation tactique de notre staff technique avant le derby.", 
      content: "Dans cet article exclusif reserve a nos membres, nous vous devoilons les coulisses de la preparation du match. Le coach a mis en place un systeme de jeu innovant en 3-5-2 avec des consignes tactiques tres precises pour chaque joueur. Les seances video, les exercices specifiques et la strategie de pressing haut qui a destabilise l'adversaire. Un contenu rare qui vous plonge dans l'intimite du vestiaire.", 
      image: "/images/news/signing.jpg", 
      date: "Il y a 5h", 
      likes: 312,
      category: "Exclusif",
      readTime: "5 min",
      is_premium: true
    },
    { 
      id: 3, 
      title: "Recrutement: Arrivee d'un nouveau talent", 
      excerpt: "Le club officialise la signature d'un joueur prometteur pour renforcer l'effectif.", 
      content: "Nous sommes heureux d'annoncer l'arrivee de notre nouvelle recrue. Ce jeune talent de 22 ans arrive en provenance du championnat local et s'est engage pour les trois prochaines saisons. Reconnu pour sa polyvalence au milieu de terrain, il apportera fraicheur et competitivite a notre effectif. Le joueur a declare etre fier de rejoindre notre famille et promet de tout donner pour les couleurs du club.", 
      image: "/images/news/signing.jpg", 
      date: "Hier", 
      likes: 156,
      category: "Transfert",
      readTime: "2 min"
    },
    { 
      id: 4, 
      title: "Interview exclusive: Le capitaine se confie", 
      excerpt: "Le capitaine revient sur ses ambitions, les moments forts et l'avenir du club en exclusivite.", 
      content: "Dans cette interview longue et intime, le capitaine de l'equipe se livre comme rarement auparavant. Il evoque son parcours, les sacrifices consentis pour arriver a ce niveau, sa vision du jeu et ses ambitions pour la fin de saison. Il parle aussi de la cohesion du groupe, du role du staff technique et de ce qui fait la force de cette equipe cette saison. Un temoignage poignant et inspirant.", 
      image: "/images/news/training.jpg", 
      date: "Il y a 1 jour", 
      likes: 198,
      category: "Exclusif",
      readTime: "7 min",
      is_premium: true
    },
    { 
      id: 5, 
      title: "Entrainement ouvert: Venez soutenir l'equipe!", 
      excerpt: "Une seance speciale ouverte aux supporters ce samedi matin au centre d'entrainement.", 
      content: "Le club ouvre les portes de son centre d'entrainement ce samedi de 9h a 12h. Les supporters pourront assister a la seance de preparation de l'equipe premiere et rencontrer leurs joueurs preferes. Une session de dedicaces sera organisee a la fin de l'entrainement. Venez nombreux encourager nos joueurs avant le grand match de la semaine prochaine!", 
      image: "/images/news/training.jpg", 
      date: "Il y a 2 jours", 
      likes: 89,
      category: "Evenement",
      readTime: "2 min"
    },
  ]

  const handleLike = (newsId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground text-lg">Actualites</h2>
        <span className="text-xs text-muted-foreground">{news.length} articles</span>
      </div>
      
      {/* Featured article - first one */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => handleSelectNews(news[0])}
        className="rounded-2xl overflow-hidden cursor-pointer group"
      >
        <div className="relative aspect-[16/10]">
          <Image 
            src={news[0].image || "/placeholder.svg"} 
            alt={news[0].title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Category + Premium badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div 
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: club.primaryColor }}
            >
              {news[0].category}
            </div>
            {news[0].is_premium && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500">
                <Crown className="w-3 h-3" />
                Membre
              </div>
            )}
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-bold text-white text-lg leading-tight mb-2">{news[0].title}</h3>
            <p className="text-white/80 text-sm mb-3 line-clamp-2">{news[0].excerpt}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span>{news[0].date}</span>
                <span>{news[0].readTime} de lecture</span>
              </div>
              <button 
                onClick={(e) => handleLike(news[0].id, e)}
                className="flex items-center gap-1.5 text-white"
              >
                <Heart 
                  className={`w-5 h-5 transition-all ${likedNews.includes(news[0].id) ? "fill-red-500 text-red-500 scale-110" : ""}`} 
                />
                <span className="text-sm font-medium">
                  {news[0].likes + (likedNews.includes(news[0].id) ? 1 : 0)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.article>
      
      {/* Other articles - compact list */}
      <div className="space-y-3">
        {news.slice(1).map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 1) * 0.1 }}
            onClick={() => handleSelectNews(item)}
            className="flex gap-3 p-3 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/30 transition-all group relative"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={item.image || "/placeholder.svg"} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div 
                className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
                style={{ background: club.primaryColor }}
              >
                {item.category}
              </div>
              {/* Lock overlay for non-members on premium */}
              {item.is_premium && !isMember && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white/90" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{item.title}</h3>
                </div>
                {item.is_premium ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-semibold text-amber-600">Contenu membre</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{item.date}</span>
                <button 
                  onClick={(e) => handleLike(item.id, e)}
                  className="flex items-center gap-1"
                >
                  <Heart 
                    className={`w-4 h-4 transition-all ${likedNews.includes(item.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} 
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.likes + (likedNews.includes(item.id) ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}

// ============ NEWS DETAIL SCREEN ============
function NewsDetailScreen({ club, news, onBack, userRole, onShowMembership }: { club: Club, news: NewsItem, onBack: () => void, userRole: UserRole, onShowMembership: () => void }) {
  const [isLiked, setIsLiked] = useState(false)
  const isMember = userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin"
  const isPremiumLocked = news.is_premium && !isMember
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Hero image with back button */}
      <div className="relative aspect-[16/10]">
        <Image 
          src={news.image || "/placeholder.svg"} 
          alt={news.title} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* Category + Premium badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {news.is_premium && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500">
              <Crown className="w-3 h-3" />
              Membre
            </div>
          )}
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{ background: club.primaryColor }}
          >
            {news.category}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 -mt-8 relative">
        <div className="bg-background rounded-t-3xl pt-6">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span>{news.date}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{news.readTime} de lecture</span>
            {news.is_premium && isMember && (
              <>
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Exclusif
                </span>
              </>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-xl font-bold text-foreground leading-tight mb-4 text-balance">
            {news.title}
          </h1>
          
          {/* Article content - blurred for non-members on premium */}
          {isPremiumLocked ? (
            <div className="relative">
              <div className="prose prose-sm max-w-none blur-sm select-none pointer-events-none">
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {news.content}
                </p>
              </div>
              {/* Gate overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-lg mx-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Contenu reserve aux membres</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Devenez membre du club pour acceder a tous les contenus exclusifs, interviews et coulisses.
                  </p>
                  <button
                    onClick={onShowMembership}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500"
                  >
                    Devenir membre
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-2.5 mt-2 rounded-xl text-sm font-medium text-muted-foreground"
                  >
                    Retour
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {news.content}
              </p>
            </div>
          )}
          
          {/* Actions bar - only shown if not locked */}
          {!isPremiumLocked && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{ 
                  background: isLiked ? `${club.primaryColor}15` : "transparent",
                  border: `1px solid ${isLiked ? club.primaryColor : "var(--border)"}` 
                }}
              >
                <Heart 
                  className={`w-5 h-5 transition-all ${isLiked ? "fill-current" : ""}`}
                  style={{ color: isLiked ? club.primaryColor : "var(--muted-foreground)" }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: isLiked ? club.primaryColor : "var(--muted-foreground)" }}
                >
                  {news.likes + (isLiked ? 1 : 0)} J'aime
                </span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border">
                <Share2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Partager</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============ AGENDA SCREEN ============
function AgendaScreen({ club, allClubs, userRole, isGuest, onLogin, onSelectMatch }: { 
  club: Club, 
  allClubs: Club[], 
  userRole: UserRole, 
  isGuest: boolean, 
  onLogin: (fromCheckout?: boolean) => void,
  onSelectMatch: (match: MatchInfo) => void 
}) {
  // Get opponents from same category
  const opponents = allClubs.filter(c => c.category === club.category && c.id !== club.id)
  
  const competitionName = club.category === "ligue1" ? "Ligue 1" : club.category === "ligue2" ? "Ligue 2" : "Navetanes"
  
  const matches: MatchInfo[] = [
    { id: 1, opponent: opponents[0] || null, date: "Dim 15", time: "16:00", location: "Stade Leopold Sedar Senghor", isHome: true, competition: competitionName },
    { id: 2, opponent: opponents[1] || opponents[0] || null, date: "Sam 22", time: "17:00", location: "Stade Municipal", isHome: false, competition: "Coupe du Senegal" },
    { id: 3, opponent: opponents[2] || opponents[0] || null, date: "Dim 1 Mar", time: "16:00", location: "Stade Leopold Sedar Senghor", isHome: true, competition: competitionName },
    { id: 4, opponent: opponents[3] || opponents[1] || null, date: "Sam 8 Mar", time: "15:30", location: "Stade Alassane Djigo", isHome: false, competition: competitionName },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground text-lg">Prochains matchs</h2>
        <span className="text-xs text-muted-foreground">{matches.length} matchs</span>
      </div>
      
      {/* Matches list with same design as home match card */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl overflow-hidden"
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
                  {match.isHome ? "Domicile" : "Exterieur"}
                </div>
                <span className="text-xs text-muted-foreground">{match.date} - {match.time}</span>
              </div>
              
              {/* Teams display */}
              <div className="flex items-center justify-between gap-2">
                {/* Home team */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                    <Image 
                      src={(match.isHome ? club : match.opponent)?.logo || "/placeholder.svg"} 
                      alt={(match.isHome ? club : match.opponent)?.name || "Equipe"} 
                      width={56} height={56} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <p className="font-bold text-foreground text-xs sm:text-sm text-center mt-2 line-clamp-1">
                    {(match.isHome ? club : match.opponent)?.name || "A determiner"}
                  </p>
                </div>
                
                {/* VS and competition */}
                <div className="flex flex-col items-center px-2 flex-shrink-0">
                  <p className="text-lg sm:text-xl font-bold text-foreground">VS</p>
                  <span 
                    className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium border whitespace-nowrap"
                    style={{ borderColor: `${club.primaryColor}50`, color: club.primaryColor }}
                  >
                    {match.competition}
                  </span>
                </div>
                
                {/* Away team */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-lg flex-shrink-0">
                    <Image 
                      src={(match.isHome ? match.opponent : club)?.logo || "/placeholder.svg"} 
                      alt={(match.isHome ? match.opponent : club)?.name || "Equipe"} 
                      width={56} height={56} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <p className="font-bold text-foreground text-xs sm:text-sm text-center mt-2 line-clamp-1">
                    {(match.isHome ? match.opponent : club)?.name || "A determiner"}
                  </p>
                </div>
              </div>
              
              {/* Location and tickets button */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground truncate flex-1 mr-2">{match.location}</p>
                <button
                  onClick={() => onSelectMatch(match)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0 flex items-center gap-1.5"
                  style={{ background: club.primaryColor }}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Billets
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ============ TICKET SELECTION SCREEN ============
function TicketSelectionScreen({ club, match, onBack, onProceed, isGuest, onLogin }: {
  club: Club,
  match: MatchInfo,
  onBack: () => void,
  onProceed: (items: TicketCartItem[]) => void,
  isGuest: boolean,
  onLogin: (fromCheckout?: boolean) => void
}) {
  const ticketCategories: TicketCategory[] = [
    { id: "vip", name: "Tribune VIP", price: 10000, description: "Places assises numerotees, acces salon VIP", available: 50 },
    { id: "tribune", name: "Tribune Couverte", price: 5000, description: "Places assises couvertes", available: 200 },
    { id: "lateral", name: "Tribune Laterale", price: 3000, description: "Places assises non couvertes", available: 500 },
    { id: "virage", name: "Virage", price: 2000, description: "Places debout, ambiance supporters", available: 1000 },
  ]

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const updateQuantity = (categoryId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[categoryId] || 0
      const newQty = Math.max(0, Math.min(10, current + delta))
      return { ...prev, [categoryId]: newQty }
    })
  }

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const totalPrice = ticketCategories.reduce((sum, cat) => sum + (quantities[cat.id] || 0) * cat.price, 0)

  const handleProceed = () => {
    if (isGuest) {
      onLogin(true)
      return
    }
    const items: TicketCartItem[] = ticketCategories
      .filter(cat => quantities[cat.id] > 0)
      .map(cat => ({ category: cat, quantity: quantities[cat.id] }))
    onProceed(items)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-28"
    >
      {/* Header with match info */}
      <div 
        className="p-4 pb-6"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}dd)` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Billetterie</h1>
        </div>

        {/* Match summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 flex-shrink-0">
                <Image 
                  src={club.logo || "/placeholder.svg"} 
                  alt={club.name} 
                  width={40} height={40} 
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
              <span className="text-white font-semibold text-sm truncate">{club.name}</span>
            </div>
            <span className="text-white/80 text-xs font-medium px-2">VS</span>
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="text-white font-semibold text-sm truncate">{match.opponent?.name || "A determiner"}</span>
              <div className="w-10 h-10 rounded-full bg-white p-0.5 flex-shrink-0">
                <Image 
                  src={match.opponent?.logo || "/placeholder.svg"} 
                  alt={match.opponent?.name || "Adversaire"} 
                  width={40} height={40} 
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-white/80 text-xs">
            <span>{match.date} - {match.time}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="truncate">{match.location}</span>
          </div>
        </div>
      </div>

      {/* Ticket categories */}
      <div className="p-4 space-y-3">
        <h2 className="font-semibold text-foreground text-sm mb-3">Choisissez vos places</h2>
        
        {ticketCategories.map((category) => (
          <div 
            key={category.id}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-sm" style={{ color: club.primaryColor }}>
                    {category.price.toLocaleString()} FCFA
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({category.available} disponibles)
                  </span>
                </div>
              </div>
              
              {/* Quantity selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(category.id, -1)}
                  disabled={(quantities[category.id] || 0) === 0}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm disabled:opacity-30"
                >
                  -
                </button>
                <span className="font-bold w-6 text-center text-sm">{quantities[category.id] || 0}</span>
                <button
                  onClick={() => updateQuantity(category.id, 1)}
                  disabled={(quantities[category.id] || 0) >= 10}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white disabled:opacity-30"
                  style={{ background: club.primaryColor }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-3 bg-background border-t border-border z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-muted-foreground">{totalTickets} billet{totalTickets > 1 ? "s" : ""}</span>
            <p className="font-bold" style={{ color: club.primaryColor }}>{totalPrice.toLocaleString()} FCFA</p>
          </div>
        </div>
        <button
          onClick={handleProceed}
          disabled={totalTickets === 0}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: club.primaryColor }}
        >
          <Ticket className="w-4 h-4" />
          {isGuest ? "Se connecter pour acheter" : "Continuer"}
        </button>
      </div>
    </motion.div>
  )
}



// ============ TICKET CHECKOUT SCREEN ============
function TicketCheckoutScreen({ club, match, tickets, onBack, onComplete }: {
  club: Club,
  match: MatchInfo,
  tickets: TicketCartItem[],
  onBack: () => void,
  onComplete: () => void
}) {
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | "card" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const total = tickets.reduce((sum, item) => sum + (item.category.price * item.quantity), 0)

  const handlePayment = () => {
    if (!paymentMethod) return
    setIsProcessing(true)
    
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        onComplete()
      }, 2500)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: club.primaryColor }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-2">Billets reserves!</h2>
        <p className="text-muted-foreground text-center text-sm mb-4">Vous recevrez vos e-billets par SMS et email.</p>
        <div className="bg-card border border-border rounded-xl p-4 w-full max-w-xs">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="font-mono font-bold text-lg" style={{ color: club.primaryColor }}>
              TKT-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-28"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Paiement</h1>
      </div>

      <div className="p-4 space-y-5">
        {/* Order summary */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${club.primaryColor}20` }}>
              <Ticket className="w-5 h-5" style={{ color: club.primaryColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">{club.name} vs {match.opponent?.name}</p>
              <p className="text-xs text-muted-foreground">{match.date} - {match.time}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {tickets.map((item) => (
              <div key={item.category.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.category.name} x{item.quantity}</span>
                <span className="font-medium">{(item.category.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-3 border-t border-border mt-3">
              <span>Total</span>
              <span style={{ color: club.primaryColor }}>{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-3">Mode de paiement</h3>
          <div className="space-y-2">
            {/* Wave */}
            <button
              onClick={() => setPaymentMethod("wave")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                paymentMethod === "wave" ? "border-2" : "border-border"
              }`}
              style={{ borderColor: paymentMethod === "wave" ? club.primaryColor : undefined }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#1DC1EC] flex items-center justify-center">
                <span className="text-white font-bold">W</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">Wave</p>
                <p className="text-[10px] text-muted-foreground">Paiement mobile</p>
              </div>
              {paymentMethod === "wave" && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: club.primaryColor }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>

            {/* Orange Money */}
            <button
              onClick={() => setPaymentMethod("orange")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                paymentMethod === "orange" ? "border-2" : "border-border"
              }`}
              style={{ borderColor: paymentMethod === "orange" ? club.primaryColor : undefined }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF6600] flex items-center justify-center">
                <span className="text-white font-bold text-sm">OM</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">Orange Money</p>
                <p className="text-[10px] text-muted-foreground">Paiement mobile</p>
              </div>
              {paymentMethod === "orange" && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: club.primaryColor }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>

            {/* Card */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                paymentMethod === "card" ? "border-2" : "border-border"
              }`}
              style={{ borderColor: paymentMethod === "card" ? club.primaryColor : undefined }}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">Carte bancaire</p>
                <p className="text-[10px] text-muted-foreground">Visa, Mastercard</p>
              </div>
              {paymentMethod === "card" && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: club.primaryColor }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fixed bottom - Pay button */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border px-4 py-3">
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: club.primaryColor }}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Traitement...
            </>
          ) : (
            `Payer ${total.toLocaleString()} FCFA`
          )}
        </button>
      </div>
    </motion.div>
)
  }

// ============ DONATION SCREEN ============
function DonationScreen({ club, isGuest, userPhone, onBack }: {
  club: Club,
  isGuest: boolean,
  userPhone?: string | null,
  onBack: () => void
}) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | null>(null)
  const [phoneNumber, setPhoneNumber] = useState(userPhone?.replace("+221", "") || "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [donorName, setDonorName] = useState("")
  const [showThankYou, setShowThankYou] = useState(false)
  
  const quickAmounts = [1000, 2000, 5000]
  const largeAmounts = [10000, 20000, 50000]
  
  const finalAmount = selectedAmount && selectedAmount !== -1 ? selectedAmount : (Number(customAmount) || 0)

  const handleDonate = () => {
    if (finalAmount < 100 || !paymentMethod || phoneNumber.length < 9) return
    
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        setShowThankYou(true)
      }, 1500)
    }, 2000)
  }

  if (showThankYou) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}cc)` }}
        >
          <Heart className="w-12 h-12 text-white fill-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-2 text-center">Merci pour votre soutien!</h2>
        <p className="text-muted-foreground text-center text-sm mb-6 max-w-xs">
          Votre don de <span className="font-bold" style={{ color: club.primaryColor }}>{finalAmount?.toLocaleString()} FCFA</span> aide {club.name} a atteindre ses objectifs.
        </p>
        <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-xs mb-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Reference de votre don</p>
            <p className="font-mono font-bold text-xl" style={{ color: club.primaryColor }}>
              DON-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full font-semibold text-white"
          style={{ background: club.primaryColor }}
        >
          Retour
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-28"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Soutenir {club.name}</h1>
      </div>

      <div className="p-4 space-y-5">
        {/* Amount input */}
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-2">Montant du don</h3>
          <div 
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all"
            style={{ borderColor: customAmount ? club.primaryColor : "var(--border)" }}
          >
            <input
              type="number"
              placeholder="Entrez le montant"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
            <span className="text-sm text-muted-foreground">FCFA</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">Montant minimum: 100 FCFA</p>
        </div>

        {/* Donor name (for guests) */}
        {isGuest && (
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-2">Votre nom <span className="text-muted-foreground font-normal">(optionnel)</span></h3>
            <input
              type="text"
              placeholder="Entrez votre nom"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-all"
            />
          </div>
        )}

        {/* Phone number input */}
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-2">Numero de telephone</h3>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border">
            <span className="text-sm text-muted-foreground">+221</span>
            <input
              type="tel"
              placeholder="77 123 45 67"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {phoneNumber.length === 9 && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Payment method */}
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-2">Paiement mobile</h3>
          <div className="flex gap-2">
            {/* Wave */}
            <button
              onClick={() => setPaymentMethod("wave")}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                paymentMethod === "wave" ? "" : "border-transparent bg-muted/50"
              }`}
              style={{ borderColor: paymentMethod === "wave" ? "#1DC1EC" : "transparent" }}
            >
              <div className="w-10 h-10 rounded-full bg-[#1DC1EC] flex items-center justify-center">
                <span className="text-white font-bold">W</span>
              </div>
              <span className="text-xs font-medium">Wave</span>
            </button>

            {/* Orange Money */}
            <button
              onClick={() => setPaymentMethod("orange")}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                paymentMethod === "orange" ? "" : "border-transparent bg-muted/50"
              }`}
              style={{ borderColor: paymentMethod === "orange" ? "#FF6600" : "transparent" }}
            >
              <div className="w-10 h-10 rounded-full bg-[#FF6600] flex items-center justify-center">
                <span className="text-white font-bold text-sm">OM</span>
              </div>
              <span className="text-xs font-medium">Orange Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-4 bg-background border-t border-border">
        <button
          onClick={handleDonate}
          disabled={!finalAmount || finalAmount < 100 || !paymentMethod || phoneNumber.length < 9 || isProcessing}
          className="w-full py-4 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: club.primaryColor }}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Traitement en cours...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Don effectue!
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              Donner {finalAmount ? `${finalAmount.toLocaleString()} FCFA` : ""}
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// ============ MY TICKETS SCREEN ============
function MyTicketsScreen({ club, tickets, onBack }: {
  club: Club,
  tickets: PurchasedTicket[],
  onBack: () => void
}) {
  const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket | null>(null)
  const upcomingTickets = tickets.filter(t => t.status === "upcoming")
  const pastTickets = tickets.filter(t => t.status === "past")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Mes billets</h1>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${club.primaryColor}15` }}
          >
            <Ticket className="w-8 h-8" style={{ color: club.primaryColor }} />
          </div>
          <p className="text-base font-semibold text-foreground mb-1">Aucun billet</p>
          <p className="text-sm text-muted-foreground text-center">Vos billets achetes apparaitront ici</p>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Upcoming tickets */}
          {upcomingTickets.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                A venir ({upcomingTickets.length})
              </h2>
              <div className="space-y-3">
                {upcomingTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-card border border-border overflow-hidden"
                  >
                    {/* Ticket header with dashed border effect */}
                    <div className="flex items-center justify-between pb-3 border-b border-dashed border-border">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `${club.primaryColor}15` }}
                        >
                          <Ticket className="w-4 h-4" style={{ color: club.primaryColor }} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Reference</p>
                          <p className="font-mono font-bold text-sm" style={{ color: club.primaryColor }}>{ticket.id}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-600">
                        Valide
                      </span>
                    </div>

                    {/* Match info */}
                    <div className="py-3">
                      <p className="font-semibold text-foreground text-sm mb-1">
                        {club.name} vs {ticket.match.opponent?.name || "Adversaire"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ticket.match.date} - {ticket.match.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{ticket.match.location}</span>
                      </div>
                    </div>

                    {/* Ticket details */}
                    <div className="pt-3 border-t border-dashed border-border flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{ticket.category.name}</p>
                        <p className="font-semibold text-sm">{ticket.quantity} billet{ticket.quantity > 1 ? "s" : ""}</p>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                        style={{ background: club.primaryColor }}
                      >
                        Voir QR Code
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past tickets */}
          {pastTickets.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                Historique ({pastTickets.length})
              </h2>
              <div className="space-y-2">
                {pastTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-xl bg-muted/50 border border-border opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {club.name} vs {ticket.match.opponent?.name || "Adversaire"}
                        </p>
                        <p className="text-xs text-muted-foreground">{ticket.match.date}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{ticket.quantity} billet{ticket.quantity > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QR Code Bottom Sheet */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4">
                <h3 className="text-lg font-bold text-foreground">QR Code du billet</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Content */}
              <div className="px-4 pb-8 space-y-4">
                {/* Ticket info */}
                <div className="text-center">
                  <p className="font-semibold text-foreground">{club.name} vs {selectedTicket.match.opponent?.name || "Adversaire"}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.match.date} - {selectedTicket.match.time}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedTicket.category.name} - {selectedTicket.quantity} place{selectedTicket.quantity > 1 ? "s" : ""}</p>
                </div>
                
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-48 h-48 rounded-2xl flex items-center justify-center relative ${
                      selectedTicket.scanned ? "bg-muted" : "bg-white"
                    }`}
                  >
                    {/* Simulated QR Code pattern */}
                    <svg viewBox="0 0 100 100" className={`w-40 h-40 ${selectedTicket.scanned ? "opacity-30" : ""}`}>
                      {/* QR Code simulation with squares */}
                      <rect x="10" y="10" width="20" height="20" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      <rect x="70" y="10" width="20" height="20" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      <rect x="10" y="70" width="20" height="20" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      
                      <rect x="15" y="15" width="10" height="10" fill="white" />
                      <rect x="75" y="15" width="10" height="10" fill="white" />
                      <rect x="15" y="75" width="10" height="10" fill="white" />
                      
                      <rect x="18" y="18" width="4" height="4" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      <rect x="78" y="18" width="4" height="4" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      <rect x="18" y="78" width="4" height="4" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      
                      {/* Data pattern */}
                      <rect x="35" y="10" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="45" y="10" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="55" y="10" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="35" y="20" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="50" y="20" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      
                      <rect x="10" y="35" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="20" y="35" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="10" y="45" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="25" y="45" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="10" y="55" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="20" y="55" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      
                      <rect x="35" y="35" width="30" height="30" fill={selectedTicket.scanned ? "#d1d5db" : "#f3f4f6"} />
                      <rect x="40" y="40" width="20" height="20" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                      <rect x="45" y="45" width="10" height="10" fill="white" />
                      
                      <rect x="70" y="35" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="80" y="35" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="75" y="45" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="85" y="45" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="70" y="55" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      
                      <rect x="35" y="70" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="45" y="70" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="40" y="80" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      <rect x="55" y="75" width="5" height="5" fill={selectedTicket.scanned ? "#9ca3af" : "#333"} />
                      
                      <rect x="70" y="70" width="20" height="20" fill={selectedTicket.scanned ? "#d1d5db" : "#f3f4f6"} />
                      <rect x="75" y="75" width="10" height="10" fill={selectedTicket.scanned ? "#9ca3af" : club.primaryColor} />
                    </svg>
                    
                    {/* Scanned overlay */}
                    {selectedTicket.scanned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold transform -rotate-12">
                          SCANNE
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Reference */}
                  <p className="font-mono text-sm font-bold mt-3" style={{ color: club.primaryColor }}>
                    {selectedTicket.id}
                  </p>
                </div>
                
                {/* Status */}
                <div className={`p-3 rounded-xl text-center ${
                  selectedTicket.scanned 
                    ? "bg-orange-500/10" 
                    : "bg-green-500/10"
                }`}>
                  {selectedTicket.scanned ? (
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Billet deja scanne</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Ticket className="w-4 h-4" />
                      <span className="text-sm font-medium">Presentez ce QR code a l'entree</span>
                    </div>
                  )}
                </div>
                
                {/* Instructions */}
                {!selectedTicket.scanned && (
                  <p className="text-xs text-muted-foreground text-center">
                    Ce QR code est valable pour {selectedTicket.quantity} personne{selectedTicket.quantity > 1 ? "s" : ""}. 
                    Il ne peut etre scanne qu'une seule fois.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ BOUTIQUE TYPES ============
interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  memberPrice?: number
  image: string
  tag?: string
  description: string
  sizes?: string[]
  colors?: { name: string, hex: string }[]
}

interface CartItem {
  product: Product
  quantity: number
  size?: string
  color?: string
}

const products: Product[] = [
  { 
    id: 1, 
    name: "Maillot Domicile 2024", 
    price: 25000, 
    originalPrice: 30000, 
    memberPrice: 20000,
    image: "/images/products/jersey-home.jpg", 
    tag: "Promo",
    description: "Le maillot officiel de la saison 2024. Tissu respirant haute performance, ecusson brode, coupe moderne et confortable.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Domicile", hex: "#1B5E20" }]
  },
  { 
    id: 2, 
    name: "Maillot Training", 
    price: 18000, 
    memberPrice: 14500,
    image: "/images/products/training.jpg",
    description: "Maillot d'entrainement officiel. Leger et respirant, parfait pour vos seances de sport.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Noir", hex: "#212121" }, { name: "Gris", hex: "#616161" }]
  },
  { 
    id: 3, 
    name: "Echarpe officielle", 
    price: 8000, 
    memberPrice: 6500,
    image: "/images/products/scarf.jpg", 
    tag: "Populaire",
    description: "Echarpe tricotee aux couleurs du club. Indispensable pour supporter votre equipe au stade.",
  },
  { 
    id: 4, 
    name: "Casquette du club", 
    price: 5000, 
    memberPrice: 4000,
    image: "/images/products/cap.jpg",
    description: "Casquette snapback avec logo brode. Ajustable, taille unique.",
    colors: [{ name: "Vert", hex: "#1B5E20" }, { name: "Noir", hex: "#212121" }]
  },
]

// ============ BOUTIQUE SCREEN ============
function BoutiqueScreen({ club, cart, onSelectProduct, onOpenCart, userRole }: { 
  club: Club, 
  cart: CartItem[], 
  onSelectProduct: (product: Product) => void,
  onOpenCart: () => void,
  userRole: UserRole
}) {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const isMember = userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground text-lg">Boutique officielle</h2>
        <button 
          onClick={onOpenCart}
          className="relative p-2 rounded-full"
          style={{ background: `${club.primaryColor}15` }}
        >
          <ShoppingBag className="w-5 h-5" style={{ color: club.primaryColor }} />
          {cartCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: club.primaryColor }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => {
          const displayPrice = isMember && product.memberPrice ? product.memberPrice : product.price
          const showMemberDiscount = isMember && product.memberPrice && product.memberPrice < product.price
          
          return (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelectProduct(product)}
              className="group relative rounded-2xl overflow-hidden bg-card text-left"
            >
              {/* Product image */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image 
                  src={product.image || "/placeholder.svg"} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {/* Member discount badge */}
                  {showMemberDiscount && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500">
                      <Crown className="w-3 h-3" />
                      -{Math.round(((product.price - product.memberPrice!) / product.price) * 100)}%
                    </div>
                  )}
                  {/* Promo badge */}
                  {product.originalPrice && !showMemberDiscount && (
                    <div className="px-2 py-1 rounded-full text-[10px] font-bold text-white bg-red-500">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {/* Tag badge */}
                  {product.tag && !product.originalPrice && !showMemberDiscount && (
                    <div 
                      className="px-2 py-1 rounded-full text-[10px] font-bold text-white"
                      style={{ background: club.primaryColor }}
                    >
                      {product.tag}
                    </div>
                  )}
                </div>
                
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                
                {/* Product info */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="font-semibold text-white text-xs leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-white text-sm">{displayPrice.toLocaleString()}</span>
                    <span className="text-white/60 text-[10px]">FCFA</span>
                  </div>
                  {showMemberDiscount && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/50 text-xs line-through">{product.price.toLocaleString()} FCFA</span>
                      <span className="text-amber-400 text-[10px] font-semibold">
                        Prix membre
                      </span>
                    </div>
                  )}
                  {product.originalPrice && !showMemberDiscount && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/50 text-xs line-through">{product.originalPrice.toLocaleString()} FCFA</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ============ PRODUCT DETAIL SCREEN ============
function ProductDetailScreen({ club, product, onBack, onAddToCart, onBuyNow, userRole }: { 
  club: Club, 
  product: Product, 
  onBack: () => void,
  onAddToCart: (item: CartItem) => void,
  onBuyNow: (item: CartItem) => void,
  userRole: UserRole
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "")
  const [addedToCart, setAddedToCart] = useState(false)
  const isMember = userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin"
  const displayPrice = isMember && product.memberPrice ? product.memberPrice : product.price
  const showMemberDiscount = isMember && product.memberPrice && product.memberPrice < product.price

  const handleAddToCart = () => {
    onAddToCart({
      product: { ...product, price: displayPrice },
      quantity,
      size: selectedSize,
      color: selectedColor
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    onBuyNow({
      product: { ...product, price: displayPrice },
      quantity,
      size: selectedSize,
      color: selectedColor
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-24"
    >
      {/* Product image */}
      <div className="relative aspect-square">
        <Image 
          src={product.image || "/placeholder.svg"} 
          alt={product.name} 
          fill 
          className="object-cover" 
        />
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* Badge top right */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
          {showMemberDiscount && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500">
              <Crown className="w-3.5 h-3.5" />
              -{Math.round(((product.price - product.memberPrice!) / product.price) * 100)}%
            </div>
          )}
          {product.originalPrice && !showMemberDiscount && (
            <div className="px-3 py-1.5 rounded-full text-sm font-bold text-white bg-red-500">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Name and price */}
        <div>
          <h1 className="text-base font-bold text-foreground mb-1">{product.name}</h1>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold" style={{ color: showMemberDiscount ? "#d97706" : club.primaryColor }}>
              {displayPrice.toLocaleString()} FCFA
            </span>
            {showMemberDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString()}
              </span>
            )}
            {product.originalPrice && !showMemberDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {showMemberDiscount && (
            <div className="flex items-center gap-1.5 mt-1">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs text-amber-600 font-semibold">
                Prix membre - Economisez {(product.price - product.memberPrice!).toLocaleString()} FCFA
              </p>
            </div>
          )}
          {!showMemberDiscount && product.memberPrice && !isMember && (
            <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Prix membre: <span className="font-bold">{product.memberPrice.toLocaleString()} FCFA</span> - Devenez membre!
              </p>
            </div>
          )}
          {product.originalPrice && !showMemberDiscount && (
            <p className="text-xs text-green-600 font-medium mt-0.5">
              Economisez {(product.originalPrice - product.price).toLocaleString()} FCFA
            </p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Description</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
        </div>
        
        {/* Size selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Taille</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedSize === size 
                      ? "border-transparent text-white" 
                      : "border-border text-foreground hover:border-primary/50"
                  }`}
                  style={{ 
                    background: selectedSize === size ? club.primaryColor : "transparent" 
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Color selector */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Couleur: <span className="font-normal text-muted-foreground">{selectedColor}</span></h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color.name ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ background: color.hex }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Quantity selector */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Quantite</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-medium hover:bg-muted transition-colors"
            >
              -
            </button>
            <span className="text-base font-bold w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-medium hover:bg-muted transition-colors"
            >
              +
            </button>
            <span className="text-xs text-muted-foreground ml-1">
              Total: {(displayPrice * quantity).toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>
      
      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 inset-x-0 px-4 py-3 bg-background border-t border-border z-50">
        <div className="flex gap-2">
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all border"
            style={{ 
              background: addedToCart ? "#22c55e" : "transparent",
              borderColor: addedToCart ? "#22c55e" : club.primaryColor,
              color: addedToCart ? "white" : club.primaryColor
            }}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Ajoute!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Panier
              </>
            )}
          </button>
          
          {/* Buy now button */}
          <button
            onClick={handleBuyNow}
            className="flex-[2] py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5"
            style={{ background: club.primaryColor }}
          >
            Acheter - {(displayPrice * quantity).toLocaleString()} FCFA
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============ CART SCREEN ============
function CartScreen({ club, cart, onBack, onUpdateQuantity, onRemoveItem, onCheckout, isGuest, onLogin }: {
  club: Club,
  cart: CartItem[],
  onBack: () => void,
  onUpdateQuantity: (productId: number, quantity: number) => void,
  onRemoveItem: (productId: number) => void,
  onCheckout: () => void,
  isGuest: boolean,
  onLogin: (fromCheckout?: boolean) => void
}) {
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const savings = cart.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + ((item.product.originalPrice - item.product.price) * item.quantity)
    }
    return sum
  }, 0)

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background p-4"
      >
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Mon panier</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${club.primaryColor}15` }}
          >
            <ShoppingBag className="w-10 h-10" style={{ color: club.primaryColor }} />
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">Votre panier est vide</p>
          <p className="text-sm text-muted-foreground text-center">Ajoutez des articles de la boutique pour commencer</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: club.primaryColor }}
          >
            Voir la boutique
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-40"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Mon panier ({cart.length})</h1>
      </div>
      
      {/* Cart items */}
      <div className="p-4 space-y-4">
        {cart.map((item) => (
          <motion.div
            key={item.product.id}
            layout
            className="flex gap-4 p-3 rounded-xl bg-card border border-border"
          >
            {/* Product image */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={item.product.image || "/placeholder.svg"} 
                alt={item.product.name} 
                fill 
                className="object-cover" 
              />
            </div>
            
            {/* Product info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm line-clamp-1">{item.product.name}</h3>
              {(item.size || item.color) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[item.size, item.color].filter(Boolean).join(" - ")}
                </p>
              )}
              <p className="font-bold mt-1" style={{ color: club.primaryColor }}>
                {item.product.price.toLocaleString()} FCFA
              </p>
              
              {/* Quantity controls */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="font-semibold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-xs text-destructive"
                >
                  Retirer
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Fixed bottom - Summary and checkout */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border p-4 space-y-4">
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Economies</span>
              <span className="text-green-600 font-medium">-{savings.toLocaleString()} FCFA</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span style={{ color: club.primaryColor }}>{subtotal.toLocaleString()} FCFA</span>
          </div>
        </div>
        
        {/* Checkout button */}
        <button
          onClick={() => isGuest ? onLogin(true) : onCheckout()}
          className="w-full py-4 rounded-xl font-semibold text-white"
          style={{ background: club.primaryColor }}
        >
          {isGuest ? "Se connecter pour commander" : "Passer la commande"}
        </button>
      </div>
    </motion.div>
  )
}

// ============ CHECKOUT SCREEN ============
function CheckoutScreen({ club, cart, onBack, onComplete }: { 
  club: Club, 
  cart: CartItem[], 
  onBack: () => void,
  onComplete: () => void 
}) {
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | "card" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handlePayment = () => {
    if (!paymentMethod) return
    setIsProcessing(true)
    
    // Simulate payment
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        onComplete()
      }, 2000)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: club.primaryColor }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-2">Commande confirmee!</h2>
        <p className="text-muted-foreground text-center">Merci pour votre achat. Vous recevrez un SMS de confirmation.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-32"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Paiement</h1>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Order summary */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-3">Recapitulatif</h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                <span className="font-medium">{(item.product.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-3 border-t border-border mt-3">
              <span>Total</span>
              <span style={{ color: club.primaryColor }}>{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
        
        {/* Payment methods */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Mode de paiement</h3>
          <div className="space-y-3">
            {/* Wave */}
            <button
              onClick={() => setPaymentMethod("wave")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                paymentMethod === "wave" ? "border-2" : "border-border"
              }`}
              style={{ borderColor: paymentMethod === "wave" ? club.primaryColor : undefined }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#1DC1EC] flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">Wave</p>
                <p className="text-xs text-muted-foreground">Paiement mobile instantane</p>
              </div>
              {paymentMethod === "wave" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: club.primaryColor }}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
            
            {/* Orange Money */}
            <button
              onClick={() => setPaymentMethod("orange")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                paymentMethod === "orange" ? "border-2" : "border-border"
              }`}
              style={{ borderColor: paymentMethod === "orange" ? club.primaryColor : undefined }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FF6600] flex items-center justify-center">
                <span className="text-white font-bold text-lg">OM</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">Orange Money</p>
                <p className="text-xs text-muted-foreground">Paiement mobile Orange</p>
              </div>
              {paymentMethod === "orange" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: club.primaryColor }}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
            
            {/* Card */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                paymentMethod === "card" ? "border-2" : "border-border"
              }`}
              style={{ borderColor: paymentMethod === "card" ? club.primaryColor : undefined }}
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">Carte bancaire</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
              </div>
              {paymentMethod === "card" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: club.primaryColor }}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Fixed bottom - Pay button */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border p-4">
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className="w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: club.primaryColor }}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Traitement en cours...
            </>
          ) : (
            `Payer ${total.toLocaleString()} FCFA`
          )}
        </button>
      </div>
    </motion.div>
  )
}

// ============ PROFIL SCREEN ============
function ProfilScreen({ club, userRole, isGuest, onLogin, onChangeClub, onLogout, onShowMyTickets, ticketCount, onRoleChange, onShowMembership, onShowNotifications, onShowAnnouncements }: { 
  club: Club, 
  userRole: UserRole, 
  isGuest: boolean, 
  onLogin: () => void, 
  onChangeClub: () => void, 
  onLogout: () => void,
  onShowMyTickets: () => void,
  ticketCount: number,
  onRoleChange?: (role: UserRole) => void,
  onShowMembership: () => void,
  onShowNotifications: () => void,
  onShowAnnouncements?: () => void,
}) {
  if (isGuest) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 flex flex-col items-center justify-center min-h-[60vh]"
      >
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: `${club.primaryColor}15` }}
        >
          <User className="w-10 h-10" style={{ color: club.primaryColor }} />
        </div>
        <h2 className="font-bold text-foreground text-lg mb-2">Connectez-vous</h2>
        <p className="text-muted-foreground text-center text-sm mb-6 max-w-xs">
          Accedez a votre espace personnel, suivez vos clubs et gerez vos billets
        </p>
        <button
          onClick={onLogin}
          className="px-8 py-3 rounded-full font-semibold text-white"
          style={{ background: club.primaryColor }}
        >
          Se connecter
        </button>
      </motion.div>
    )
  }

  const isMember = userRole === "membre" || userRole === "joueur" || userRole === "staff" || userRole === "admin"

  const menuItems: { icon: typeof Ticket, label: string, badge?: string, visible?: boolean, action?: string }[] = [
    { icon: Shirt, label: "Ma fiche joueur", visible: userRole === "joueur", action: "membership" },
    { icon: Megaphone, label: "Annonces internes", visible: userRole === "joueur", badge: "2", action: "announcements" },
    { icon: Users, label: "Gestion effectif", visible: userRole === "staff" },
    { icon: Clipboard, label: "Convocations", visible: userRole === "staff", badge: "2" },
    { icon: Ticket, label: "Mes billets", visible: userRole !== "joueur" && userRole !== "staff" && userRole !== "admin", badge: ticketCount > 0 ? ticketCount.toString() : undefined, action: "mytickets" },
    { icon: Heart, label: "Clubs suivis", badge: "3", visible: userRole !== "joueur" && userRole !== "staff" && userRole !== "admin" },
    { icon: CreditCard, label: "Ma carte membre", visible: isMember && userRole !== "joueur" && userRole !== "staff" && userRole !== "admin", action: "membership" },
    { icon: Bell, label: "Notifications", action: "notifications", badge: isMember ? "3" : undefined },
    { icon: RefreshCw, label: "Changer de club", action: "changeclub" },
    { icon: Settings, label: "Parametres" },
    { icon: LayoutDashboard, label: "Tableau de bord", visible: false },
  ].filter(item => item.visible !== false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-6"
    >
      {/* User info */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ background: club.primaryColor }}
        >
          MD
        </div>
        <div>
          <h2 className="font-bold text-foreground text-lg">Moussa Diallo</h2>
          <p className="text-sm text-muted-foreground capitalize">{userRole === "staff" ? "Staff technique" : userRole === "admin" ? "Administrateur" : userRole} • {club.name}</p>
          {userRole === "joueur" && (
            <p className="text-xs text-muted-foreground mt-0.5">#10 - Milieu offensif</p>
          )}
          {userRole === "staff" && (
            <p className="text-xs text-muted-foreground mt-0.5">Entraineur principal</p>
          )}
          {userRole === "admin" && (
            <p className="text-xs text-muted-foreground mt-0.5">Dirigeant du club</p>
          )}
        </div>
      </div>

      {/* Player stats card (joueur only) */}
      {userRole === "joueur" && (
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${club.primaryColor}15, ${club.secondaryColor}15)` }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Mes statistiques saison</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Matchs", value: "18" },
              { label: "Buts", value: "7" },
              { label: "Passes D.", value: "4" },
              { label: "Note moy.", value: "7.2" },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-xl bg-background/60">
                <p className="font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff overview card (staff only) */}
      {userRole === "staff" && (
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${club.primaryColor}15, ${club.secondaryColor}15)` }}
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Apercu de l&apos;equipe</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Joueurs", value: "15" },
              { label: "Aptes", value: "12" },
              { label: "Blesses", value: "1" },
              { label: "Matchs", value: "22" },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-xl bg-background/60">
                <p className="font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              if (item.action === "mytickets") onShowMyTickets()
              else if (item.action === "changeclub") onChangeClub()
              else if (item.action === "membership") onShowMembership()
              else if (item.action === "notifications") onShowNotifications()
              else if (item.action === "announcements" && onShowAnnouncements) onShowAnnouncements()
            }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${club.primaryColor}15` }}
              >
                <item.icon className="w-5 h-5" style={{ color: club.primaryColor }} />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: club.primaryColor }}
                >
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Role switcher for testing */}
      {onRoleChange && (
        <div className="p-4 rounded-2xl bg-card border border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Changer de role (demo)</p>
          <div className="flex flex-wrap gap-2">
            {(["supporter", "membre", "joueur", "staff", "admin"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: userRole === role ? club.primaryColor : "var(--muted)",
                  color: userRole === role ? "white" : "var(--muted-foreground)",
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full p-4 rounded-2xl border border-destructive/30 text-destructive font-medium hover:bg-destructive/10 transition-colors"
      >
        Se deconnecter
      </button>
    </motion.div>
  )
}
