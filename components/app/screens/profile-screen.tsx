"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { 
  User, Heart, Ticket, Gift, Settings, ChevronRight, 
  LogOut, Bell, Shield, HelpCircle, X
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileScreenProps {
  userPhone: string | null
  isGuest: boolean
  onLogin: () => void
  onLogout: () => void
}

interface MenuItem {
  id: string
  icon: typeof User
  label: string
  description?: string
  badge?: string
  action?: () => void
}

function DonateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export function ProfileScreen({ userPhone, isGuest, onLogin, onLogout }: ProfileScreenProps) {
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [donationAmount, setDonationAmount] = useState<number | null>(null)

  const donationAmounts = [1000, 2500, 5000, 10000, 25000]

  const menuItems: MenuItem[] = isGuest 
    ? [
        { id: "login", icon: User, label: "Se connecter", description: "Accedez a toutes les fonctionnalites", action: onLogin },
        { id: "help", icon: HelpCircle, label: "Aide", description: "FAQ et support" },
      ]
    : [
        { id: "tickets", icon: Ticket, label: "Mes billets", description: "Historique et billets actifs", badge: "2" },
        { id: "clubs", icon: Heart, label: "Mes clubs", description: "Clubs que vous suivez", badge: "3" },
        { id: "donate", icon: Gift, label: "Faire un don", description: "Soutenez votre club", action: () => setShowDonateModal(true) },
        { id: "notifications", icon: Bell, label: "Notifications", description: "Gerer vos alertes" },
        { id: "privacy", icon: Shield, label: "Confidentialite", description: "Parametres de securite" },
        { id: "settings", icon: Settings, label: "Parametres", description: "Preferences de l'app" },
        { id: "help", icon: HelpCircle, label: "Aide", description: "FAQ et support" },
      ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary pt-8 pb-12 px-4 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-primary-foreground">Profil</h1>
          {!isGuest && (
            <button 
              onClick={onLogout}
              className="p-2 rounded-full bg-primary-foreground/10"
            >
              <LogOut className="h-5 w-5 text-primary-foreground" />
            </button>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            {isGuest ? (
              <>
                <h2 className="text-lg font-bold text-primary-foreground">Visiteur</h2>
                <p className="text-sm text-primary-foreground/70">Connectez-vous pour plus de fonctionnalites</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-primary-foreground">Supporter CLUBZ</h2>
                <p className="text-sm text-primary-foreground/70">{userPhone}</p>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Stats (only for logged users) */}
      {!isGuest && (
        <div className="px-4 -mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-4 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <span className="block text-2xl font-bold text-primary">3</span>
              <span className="text-xs text-muted-foreground">Clubs suivis</span>
            </div>
            <div className="text-center border-x border-border">
              <span className="block text-2xl font-bold text-primary">12</span>
              <span className="text-xs text-muted-foreground">Matchs vus</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-secondary">15K</span>
              <span className="text-xs text-muted-foreground">FCFA donnes</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Menu items */}
      <div className="px-4 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-medium text-foreground">{item.label}</span>
                {item.description && (
                  <span className="block text-sm text-muted-foreground">{item.description}</span>
                )}
              </div>
              {item.badge && (
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </motion.button>
          )
        })}
      </div>

      {/* Donate Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowDonateModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-card rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <DonateIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Faire un don</h2>
                </div>
                <button
                  onClick={() => setShowDonateModal(false)}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                Soutenez votre club de coeur et aidez-le a grandir
              </p>

              {/* Club selector */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src="/images/clubs/jaraaf.jpg"
                    alt="ASC Jaraaf"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="block font-semibold text-foreground">ASC Jaraaf</span>
                  <span className="text-sm text-muted-foreground">Votre club de coeur</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Amount selection */}
              <label className="block text-sm font-medium text-foreground mb-3">
                Montant du don
              </label>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`py-3 rounded-xl font-semibold transition-colors ${
                      donationAmount === amount
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => setDonationAmount(0)}
                  className={`py-3 rounded-xl font-semibold transition-colors ${
                    donationAmount === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Autre
                </button>
              </div>

              {/* CTA */}
              <Button 
                className="w-full py-6 text-base font-semibold gap-2"
                disabled={donationAmount === null}
              >
                <DonateIcon className="h-5 w-5" />
                {donationAmount 
                  ? `Donner ${donationAmount.toLocaleString()} FCFA`
                  : "Choisir un montant"
                }
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
