"use client"

import { motion } from "framer-motion"

type TabId = "home" | "clubs" | "events" | "profile"

interface BottomNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  isGuest?: boolean
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" />
    </svg>
  )
}

function ClubsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5l-2.5 2.5 1.5 4 3 .5 3-.5 1.5-4-2.5-2.5H11zm1 2.5l1.5 1-1.5 2-1.5-2 1.5-1z" />
    </svg>
  )
}

function EventsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM12 13H17V18H12V13Z" />
    </svg>
  )
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
    </svg>
  )
}

const tabs: { id: TabId; label: string; icon: typeof HomeIcon }[] = [
  { id: "home", label: "Accueil", icon: HomeIcon },
  { id: "clubs", label: "Clubs", icon: ClubsIcon },
  { id: "events", label: "Agenda", icon: EventsIcon },
  { id: "profile", label: "Profil", icon: ProfileIcon },
]

export function BottomNavigation({ activeTab, onTabChange, isGuest }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isProfileGuest = tab.id === "profile" && isGuest
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative h-6 w-6 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {isProfileGuest && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-secondary rounded-full" />
                )}
              </div>
              <span
                className={`mt-1 text-xs transition-colors ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {isProfileGuest ? "Connexion" : tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
