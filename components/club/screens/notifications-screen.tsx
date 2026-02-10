"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell, BellRing, Check, Ticket, Crown, Users, Calendar,
  Gift, Megaphone, X, ChevronRight, ArrowLeft
} from "lucide-react"
import type { Club, UserRole } from "../club-app"

interface Notification {
  id: number
  title: string
  message: string
  date: string
  type: "match" | "membership" | "premium" | "event" | "general" | "promotion"
  target_role: string
  read: boolean
}

interface NotificationsScreenProps {
  club: Club
  userRole: UserRole
  onBack?: () => void
}

const notificationIcons: Record<string, typeof Bell> = {
  match: Calendar,
  membership: Crown,
  premium: Crown,
  event: Ticket,
  general: Megaphone,
  promotion: Gift,
}

const notificationColors: Record<string, string> = {
  match: "#3B82F6",
  membership: "#FFD700",
  premium: "#8B5CF6",
  event: "#10B981",
  general: "#6B7280",
  promotion: "#EF4444",
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Match demain!",
    message: "N'oubliez pas le match de demain a 16h au Stade Leopold Sedar Senghor. Reservez vos billets!",
    date: "Il y a 1h",
    type: "match",
    target_role: "membre",
    read: false,
  },
  {
    id: 2,
    title: "Nouveau contenu premium",
    message: "Decouvrez l'interview exclusive du capitaine, disponible maintenant dans la section Premium.",
    date: "Il y a 3h",
    type: "premium",
    target_role: "membre",
    read: false,
  },
  {
    id: 3,
    title: "Votre adhesion expire bientot",
    message: "Votre adhesion Silver expire dans 30 jours. Renouvelez maintenant pour garder vos avantages.",
    date: "Hier",
    type: "membership",
    target_role: "membre",
    read: false,
  },
  {
    id: 4,
    title: "Journee portes ouvertes",
    message: "Vous etes invite a la journee portes ouvertes ce samedi. Inscrivez-vous dans la section Evenements.",
    date: "Il y a 2 jours",
    type: "event",
    target_role: "membre",
    read: true,
  },
  {
    id: 5,
    title: "Offre speciale membres",
    message: "Profitez de -20% sur toute la boutique ce weekend avec le code MEMBRE20. Offre exclusive!",
    date: "Il y a 3 jours",
    type: "promotion",
    target_role: "membre",
    read: true,
  },
  {
    id: 6,
    title: "Bienvenue dans le club!",
    message: "Merci d'avoir rejoint la famille du club. Decouvrez tous vos avantages dans la section Adhesion.",
    date: "Il y a 5 jours",
    type: "general",
    target_role: "membre",
    read: true,
  },
  {
    id: 7,
    title: "Resultats du dernier match",
    message: "Victoire 3-1! Revivez les meilleurs moments dans la section Actu.",
    date: "Il y a 1 sem.",
    type: "match",
    target_role: "membre",
    read: true,
  },
]

export function NotificationsScreen({ club, userRole, onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const filters = [
    { id: "all", label: "Tout", count: notifications.length },
    { id: "unread", label: "Non lues", count: unreadCount },
    { id: "match", label: "Matchs" },
    { id: "membership", label: "Adhesion" },
    { id: "premium", label: "Premium" },
  ]

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : activeFilter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === activeFilter)

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setSelectedNotification(notification)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <BellRing className="w-5 h-5" style={{ color: club.primaryColor }} />
            <h2 className="font-bold text-foreground text-lg">Notifications</h2>
            {unreadCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ background: club.primaryColor }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium"
              style={{ color: club.primaryColor }}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1"
              style={{
                background: activeFilter === filter.id ? club.primaryColor : "var(--muted)",
                color: activeFilter === filter.id ? "white" : "var(--muted-foreground)",
              }}
            >
              {filter.label}
              {filter.count !== undefined && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: activeFilter === filter.id ? "rgba(255,255,255,0.25)" : "var(--background)",
                    color: activeFilter === filter.id ? "white" : "var(--muted-foreground)",
                  }}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="px-4 pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: `${club.primaryColor}15` }}
            >
              <Bell className="w-8 h-8" style={{ color: club.primaryColor }} />
            </div>
            <p className="font-semibold text-foreground mb-1">Aucune notification</p>
            <p className="text-sm text-muted-foreground text-center">
              Les nouvelles notifications apparaitront ici
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => {
              const IconComponent = notificationIcons[notification.type] || Bell
              const iconColor = notificationColors[notification.type] || club.primaryColor

              return (
                <motion.button
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3"
                  style={{
                    background: notification.read ? "var(--card)" : `${club.primaryColor}08`,
                    border: `1px solid ${notification.read ? "var(--border)" : club.primaryColor + "25"}`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconColor + "15" }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm leading-tight line-clamp-1 ${
                          notification.read ? "font-medium text-foreground" : "font-semibold text-foreground"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: club.primaryColor }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{notification.date}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      {/* Notification Detail Sheet */}
      <AnimatePresence>
        {selectedNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[70vh] overflow-hidden"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = notificationIcons[selectedNotification.type] || Bell
                    return (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: notificationColors[selectedNotification.type] + "15" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: notificationColors[selectedNotification.type] }} />
                      </div>
                    )
                  })()}
                  <h3 className="text-base font-bold text-foreground">{selectedNotification.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 pb-8">
                <p className="text-[10px] text-muted-foreground mb-3">{selectedNotification.date}</p>
                <p className="text-foreground text-sm leading-relaxed">{selectedNotification.message}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
