"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard, Award, Calendar, ChevronRight, Check,
  Clock, Star, Shield, X, ArrowUpRight, ArrowLeft
} from "lucide-react"
import type { Club, UserRole } from "../club-app"

// Membership tier types
interface MembershipTier {
  id: string
  name: string
  price: number
  duration_months: number
  benefits: string[]
  color: string
  icon: typeof Star
}

interface MembershipInfo {
  tier: MembershipTier
  status: "actif" | "expire"
  startDate: string
  endDate: string
  memberSince: string
  memberId: string
}

interface PaymentHistory {
  id: string
  date: string
  amount: number
  type: string
  method: string
  status: "success" | "pending" | "failed"
}

interface MembershipScreenProps {
  club: Club
  userRole: UserRole
  isGuest: boolean
  onLogin: () => void
  onBack?: () => void
}

// Membership tiers data
const membershipTiers: MembershipTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 5000,
    duration_months: 12,
    benefits: [
      "Carte de membre digitale",
      "Acces aux contenus exclusifs",
      "Notifications ciblees",
      "5% de reduction sur la boutique",
    ],
    color: "#CD7F32",
    icon: Shield,
  },
  {
    id: "silver",
    name: "Silver",
    price: 15000,
    duration_months: 12,
    benefits: [
      "Tous les avantages Bronze",
      "Acces prioritaire billetterie",
      "10% de reduction sur la boutique",
      "Rencontres avec les joueurs",
      "Newsletter exclusive",
    ],
    color: "#C0C0C0",
    icon: Award,
  },
  {
    id: "gold",
    name: "Gold",
    price: 30000,
    duration_months: 12,
    benefits: [
      "Tous les avantages Silver",
      "Place VIP garantie",
      "20% de reduction sur la boutique",
      "Acces au centre d'entrainement",
      "Maillot dedicace offert",
      "Invitation aux evenements prives",
    ],
    color: "#FFD700",
    icon: Star,
  },
]

// Mock membership data
const mockMembership: MembershipInfo = {
  tier: membershipTiers[1], // Silver
  status: "actif",
  startDate: "15 Jan 2025",
  endDate: "15 Jan 2026",
  memberSince: "Mars 2024",
  memberId: "CLZ-MBR-2024-0847",
}

const mockPaymentHistory: PaymentHistory[] = [
  { id: "PAY-001", date: "15 Jan 2025", amount: 15000, type: "Cotisation Silver", method: "Wave", status: "success" },
  { id: "PAY-002", date: "15 Jan 2024", amount: 5000, type: "Cotisation Bronze", method: "Orange Money", status: "success" },
  { id: "PAY-003", date: "10 Dec 2023", amount: 5000, type: "Cotisation Bronze", method: "Wave", status: "success" },
]

export function MembershipScreen({ club, userRole, isGuest, onLogin, onBack }: MembershipScreenProps) {
  const [showDigitalCard, setShowDigitalCard] = useState(false)
  const [showTierUpgrade, setShowTierUpgrade] = useState(false)
  const [activeSection, setActiveSection] = useState<"card" | "status" | "history">("card")

  if (isGuest || userRole === "guest" || userRole === "supporter") {
    return <MembershipCTA club={club} onLogin={onLogin} isGuest={isGuest} />
  }

  const membership = mockMembership

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      {/* Header with back */}
      {onBack && (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-bold text-foreground text-lg">Mon adhesion</h2>
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center justify-between">
        {!onBack && <h2 className="font-bold text-foreground text-lg">Mon adhesion</h2>}
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
          style={{ background: membership.tier.color }}
        >
          {membership.tier.name}
        </span>
      </div>

      {/* Digital Membership Card */}
      <motion.button
        onClick={() => setShowDigitalCard(true)}
        className="w-full text-left"
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}CC)`,
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2"
            style={{ background: `${club.secondaryColor}20` }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-1/2 -translate-x-1/2"
            style={{ background: `${club.secondaryColor}15` }}
          />

          {/* Card header */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-xs font-medium tracking-wider uppercase">
                CLUBZ
              </span>
              <span className="text-white/40">|</span>
              <span className="text-white/80 text-xs">{club.name}</span>
            </div>
            <div
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: membership.tier.color, color: "#1a1a1a" }}
            >
              {membership.tier.name}
            </div>
          </div>

          {/* Member name */}
          <p className="text-white text-lg font-bold relative z-10 mb-1">
            Moussa Diallo
          </p>
          <p className="text-white/60 text-xs font-mono relative z-10 mb-4">
            {membership.memberId}
          </p>

          {/* Card footer */}
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-white/60 text-[10px]">Membre depuis</p>
              <p className="text-white text-sm font-semibold">{membership.memberSince}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px]">Expire le</p>
              <p className="text-white text-sm font-semibold">{membership.endDate}</p>
            </div>
          </div>

          {/* Tap indicator */}
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-white/40 text-[9px]">
            <span>Voir la carte</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </motion.button>

      {/* Section tabs */}
      <div className="flex gap-2">
        {([
          { id: "card" as const, label: "Statut", icon: Shield },
          { id: "status" as const, label: "Avantages", icon: Star },
          { id: "history" as const, label: "Paiements", icon: Clock },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: activeSection === tab.id ? `${club.primaryColor}15` : "transparent",
              color: activeSection === tab.id ? club.primaryColor : "var(--muted-foreground)",
              border: `1px solid ${activeSection === tab.id ? club.primaryColor + "40" : "var(--border)"}`,
            }}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content sections */}
      <AnimatePresence mode="wait">
        {activeSection === "card" && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Membership status card */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Statut de l'adhesion</h3>
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600">
                  Actif
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Niveau</span>
                  <span className="text-sm font-semibold" style={{ color: membership.tier.color }}>
                    {membership.tier.name}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Cotisation</span>
                  <span className="text-sm font-semibold" style={{ color: club.primaryColor }}>
                    {membership.tier.price.toLocaleString()} FCFA / an
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Date de debut</span>
                  <span className="text-sm font-medium text-foreground">{membership.startDate}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-muted-foreground">Date d'expiration</span>
                  <span className="text-sm font-medium text-foreground">{membership.endDate}</span>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            {membership.tier.id !== "gold" && (
              <button
                onClick={() => setShowTierUpgrade(true)}
                className="w-full p-4 rounded-xl flex items-center justify-between transition-all"
                style={{
                  background: `linear-gradient(135deg, ${club.primaryColor}10, ${club.secondaryColor}10)`,
                  border: `1px solid ${club.primaryColor}30`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${club.primaryColor}20` }}
                  >
                    <ArrowUpRight className="w-5 h-5" style={{ color: club.primaryColor }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Passer au niveau superieur</p>
                    <p className="text-xs text-muted-foreground">
                      Debloquez plus d'avantages avec{" "}
                      {membership.tier.id === "bronze" ? "Silver" : "Gold"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        )}

        {activeSection === "status" && (
          <motion.div
            key="benefits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Current tier benefits */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: membership.tier.color + "20" }}
                >
                  <membership.tier.icon className="w-4 h-4" style={{ color: membership.tier.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Avantages {membership.tier.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Votre niveau actuel</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {membership.tier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${club.primaryColor}15` }}
                    >
                      <Check className="w-3 h-3" style={{ color: club.primaryColor }} />
                    </div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All tiers comparison */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Tous les niveaux</h3>
              {membershipTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-3 rounded-xl border transition-all"
                  style={{
                    borderColor: tier.id === membership.tier.id ? tier.color : "var(--border)",
                    background: tier.id === membership.tier.id ? `${tier.color}08` : "var(--card)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: tier.color + "20" }}
                      >
                        <tier.icon className="w-4 h-4" style={{ color: tier.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{tier.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {tier.benefits.length} avantages
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm" style={{ color: tier.color }}>
                        {tier.price.toLocaleString()} FCFA
                      </p>
                      <p className="text-[10px] text-muted-foreground">/ an</p>
                    </div>
                  </div>
                  {tier.id === membership.tier.id && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: tier.color }}>
                      Votre niveau
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground text-sm mb-4">Historique des paiements</h3>
              <div className="space-y-3">
                {mockPaymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: `${club.primaryColor}15` }}
                      >
                        <CreditCard className="w-4 h-4" style={{ color: club.primaryColor }} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{payment.type}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {payment.date} - {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm" style={{ color: club.primaryColor }}>
                        {payment.amount.toLocaleString()} FCFA
                      </p>
                      <span
                        className={`text-[9px] font-semibold ${
                          payment.status === "success"
                            ? "text-green-600"
                            : payment.status === "pending"
                            ? "text-orange-500"
                            : "text-red-500"
                        }`}
                      >
                        {payment.status === "success" ? "Paye" : payment.status === "pending" ? "En attente" : "Echoue"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Card Bottom Sheet */}
      <AnimatePresence>
        {showDigitalCard && (
          <DigitalCardSheet
            club={club}
            membership={membership}
            onClose={() => setShowDigitalCard(false)}
          />
        )}
      </AnimatePresence>

      {/* Tier Upgrade Bottom Sheet */}
      <AnimatePresence>
        {showTierUpgrade && (
          <TierUpgradeSheet
            club={club}
            currentTier={membership.tier}
            onClose={() => setShowTierUpgrade(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ MEMBERSHIP CTA (for non-members) ============
function MembershipCTA({ club, onLogin, isGuest }: { club: Club; onLogin: () => void; isGuest: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-20"
    >
      <h2 className="font-bold text-foreground text-lg">Adhesion</h2>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}CC)`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: `${club.secondaryColor}15` }}
        />
        <Award className="w-12 h-12 text-white mx-auto mb-3 relative z-10" />
        <h3 className="text-white font-bold text-lg mb-2 relative z-10">
          Devenez membre de {club.name}
        </h3>
        <p className="text-white/80 text-sm mb-4 relative z-10">
          Accedez a des contenus exclusifs, profitez de reductions et soutenez votre club
        </p>
        {isGuest ? (
          <button
            onClick={onLogin}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all relative z-10"
            style={{ background: club.secondaryColor, color: club.primaryColor }}
          >
            Se connecter pour adherer
          </button>
        ) : (
          <button
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all relative z-10"
            style={{ background: club.secondaryColor, color: club.primaryColor }}
          >
            Choisir mon niveau
          </button>
        )}
      </div>

      {/* Tiers list */}
      <div className="space-y-3">
        {membershipTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: tier.color + "20" }}
                >
                  <tier.icon className="w-5 h-5" style={{ color: tier.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground">{tier.duration_months} mois</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: tier.color }}>
                  {tier.price.toLocaleString()} FCFA
                </p>
                <p className="text-[10px] text-muted-foreground">/ an</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {tier.benefits.slice(0, 3).map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tier.color }} />
                  <span className="text-xs text-muted-foreground">{benefit}</span>
                </div>
              ))}
              {tier.benefits.length > 3 && (
                <p className="text-[10px] text-muted-foreground pl-5.5">
                  +{tier.benefits.length - 3} autres avantages
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ============ DIGITAL CARD BOTTOM SHEET ============
function DigitalCardSheet({
  club,
  membership,
  onClose,
}: {
  club: Club
  membership: MembershipInfo
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-lg font-bold text-foreground">Carte de membre</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Card - Large */}
        <div className="px-4 pb-6">
          <div
            className="relative rounded-2xl p-6 overflow-hidden aspect-[1.6/1]"
            style={{
              background: `linear-gradient(135deg, ${club.primaryColor}, ${club.primaryColor}BB)`,
            }}
          >
            {/* Decorative */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/3"
              style={{ background: `${club.secondaryColor}20` }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/3"
              style={{ background: `${club.secondaryColor}15` }}
            />

            {/* Card content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm tracking-wider">CLUBZ</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/80 text-xs">{club.name}</span>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: membership.tier.color, color: "#1a1a1a" }}
                >
                  {membership.tier.name}
                </div>
              </div>

              <div>
                <p className="text-white text-xl font-bold mb-0.5">Moussa Diallo</p>
                <p className="text-white/60 text-sm font-mono">{membership.memberId}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/50 text-[10px]">Membre depuis</p>
                  <p className="text-white text-sm font-semibold">{membership.memberSince}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px]">Valide jusqu'au</p>
                  <p className="text-white text-sm font-semibold">{membership.endDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="mt-4 flex flex-col items-center">
            <div className="w-40 h-40 rounded-xl bg-white flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-32 h-32">
                <rect x="10" y="10" width="20" height="20" fill={club.primaryColor} />
                <rect x="70" y="10" width="20" height="20" fill={club.primaryColor} />
                <rect x="10" y="70" width="20" height="20" fill={club.primaryColor} />
                <rect x="15" y="15" width="10" height="10" fill="white" />
                <rect x="75" y="15" width="10" height="10" fill="white" />
                <rect x="15" y="75" width="10" height="10" fill="white" />
                <rect x="18" y="18" width="4" height="4" fill={club.primaryColor} />
                <rect x="78" y="18" width="4" height="4" fill={club.primaryColor} />
                <rect x="18" y="78" width="4" height="4" fill={club.primaryColor} />
                <rect x="35" y="10" width="5" height="5" fill="#333" />
                <rect x="45" y="10" width="5" height="5" fill="#333" />
                <rect x="55" y="10" width="5" height="5" fill="#333" />
                <rect x="35" y="20" width="5" height="5" fill="#333" />
                <rect x="50" y="20" width="5" height="5" fill="#333" />
                <rect x="10" y="35" width="5" height="5" fill="#333" />
                <rect x="20" y="35" width="5" height="5" fill="#333" />
                <rect x="10" y="45" width="5" height="5" fill="#333" />
                <rect x="25" y="45" width="5" height="5" fill="#333" />
                <rect x="35" y="35" width="30" height="30" fill="#f3f4f6" />
                <rect x="40" y="40" width="20" height="20" fill={club.primaryColor} />
                <rect x="45" y="45" width="10" height="10" fill="white" />
                <rect x="70" y="35" width="5" height="5" fill="#333" />
                <rect x="80" y="35" width="5" height="5" fill="#333" />
                <rect x="75" y="45" width="5" height="5" fill="#333" />
                <rect x="35" y="70" width="5" height="5" fill="#333" />
                <rect x="45" y="70" width="5" height="5" fill="#333" />
                <rect x="70" y="70" width="20" height="20" fill="#f3f4f6" />
                <rect x="75" y="75" width="10" height="10" fill={club.primaryColor} />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Presentez ce QR code pour verifier votre adhesion
            </p>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ============ TIER UPGRADE BOTTOM SHEET ============
function TierUpgradeSheet({
  club,
  currentTier,
  onClose,
}: {
  club: Club
  currentTier: MembershipTier
  onClose: () => void
}) {
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const upgradeTiers = membershipTiers.filter(
    (t) => membershipTiers.indexOf(t) > membershipTiers.findIndex((mt) => mt.id === currentTier.id)
  )

  const handleUpgrade = () => {
    if (!selectedTier || !paymentMethod) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(onClose, 2000)
    }, 2000)
  }

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
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-lg font-bold text-foreground">
            {isSuccess ? "Felicitations!" : "Choisir un niveau"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: club.primaryColor }}
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-foreground font-semibold mb-1">Adhesion mise a jour!</p>
            <p className="text-sm text-muted-foreground text-center">
              Votre niveau a ete mis a jour vers {selectedTier?.name}
            </p>
          </div>
        ) : (
          <div className="px-4 pb-8 space-y-4">
            {/* Tier selection */}
            {upgradeTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className="w-full p-4 rounded-xl text-left border-2 transition-all"
                style={{
                  borderColor: selectedTier?.id === tier.id ? tier.color : "var(--border)",
                  background: selectedTier?.id === tier.id ? `${tier.color}08` : "var(--card)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <tier.icon className="w-5 h-5" style={{ color: tier.color }} />
                    <span className="font-bold text-foreground">{tier.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: tier.color }}>
                    {tier.price.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="space-y-1">
                  {tier.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 flex-shrink-0" style={{ color: tier.color }} />
                      <span className="text-xs text-muted-foreground">{b}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}

            {/* Payment methods */}
            {selectedTier && (
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-2">Paiement</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod("wave")}
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                    style={{ borderColor: paymentMethod === "wave" ? "#1DC1EC" : "transparent", background: paymentMethod === "wave" ? "transparent" : "var(--muted)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1DC1EC] flex items-center justify-center">
                      <span className="text-white font-bold">W</span>
                    </div>
                    <span className="text-xs font-medium">Wave</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("orange")}
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                    style={{ borderColor: paymentMethod === "orange" ? "#FF6600" : "transparent", background: paymentMethod === "orange" ? "transparent" : "var(--muted)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FF6600] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">OM</span>
                    </div>
                    <span className="text-xs font-medium">Orange Money</span>
                  </button>
                </div>
              </div>
            )}

            {/* Upgrade button */}
            <button
              onClick={handleUpgrade}
              disabled={!selectedTier || !paymentMethod || isProcessing}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
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
              ) : selectedTier ? (
                `Passer a ${selectedTier.name} - ${selectedTier.price.toLocaleString()} FCFA`
              ) : (
                "Choisir un niveau"
              )}
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
