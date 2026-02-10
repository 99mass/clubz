"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BottomNavigation } from "./bottom-navigation"
import { HomeScreen } from "./screens/home-screen"
import { ClubsScreen } from "./screens/clubs-screen"
import { EventsScreen } from "./screens/events-screen"
import { ProfileScreen } from "./screens/profile-screen"

type TabId = "home" | "clubs" | "events" | "profile"

interface MainAppProps {
  userPhone: string | null
  isGuest: boolean
  onLogin: () => void
  onLogout: () => void
}

export function MainApp({ userPhone, isGuest, onLogin, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home")

  const handleTabChange = (tab: TabId) => {
    // If guest clicks profile, trigger login
    if (tab === "profile" && isGuest) {
      onLogin()
      return
    }
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "home" && <HomeScreen />}
          {activeTab === "clubs" && <ClubsScreen />}
          {activeTab === "events" && <EventsScreen />}
          {activeTab === "profile" && (
            <ProfileScreen 
              userPhone={userPhone} 
              isGuest={isGuest}
              onLogin={onLogin}
              onLogout={onLogout}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isGuest={isGuest}
      />
    </div>
  )
}
