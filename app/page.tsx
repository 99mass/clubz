"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { Onboarding } from "@/components/onboarding"
import { AuthFlow } from "@/components/auth/auth-flow"
import { ClubSelectionScreen, clubs } from "@/components/app/screens/club-selection-screen"
import { ClubApp, type Club, type UserRole } from "@/components/club/club-app"

type AppState = "splash" | "onboarding" | "auth" | "clubs" | "portal"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("splash")
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [userRole, setUserRole] = useState<UserRole>("guest")
  const [pendingClub, setPendingClub] = useState<Club | null>(null) // Club to return to after login
  const [pendingCheckout, setPendingCheckout] = useState(false) // Return to checkout after login

  const handleSplashComplete = () => {
    setAppState("onboarding")
  }

  const handleOnboardingComplete = () => {
    setAppState("auth")
  }

  const handleAuthComplete = (phone: string) => {
    setUserPhone(phone)
    setIsGuest(false)
    setUserRole("supporter") // Default role after login, can be membre/joueur/staff/admin based on backend
    
    // If user was in a club portal before login, return to that club
    if (pendingClub) {
      setSelectedClub(pendingClub)
      setPendingClub(null)
      setAppState("portal")
    } else {
      setAppState("clubs")
    }
  }

  const handleSkipAuth = () => {
    setIsGuest(true)
    setUserRole("guest")
    setAppState("clubs")
  }

  const handleLogin = (fromCheckout = false) => {
    // Save current club if user is in portal so we can return after login
    if (selectedClub && appState === "portal") {
      setPendingClub(selectedClub)
      if (fromCheckout) {
        setPendingCheckout(true)
      }
    }
    setAppState("auth")
  }

  const handleSelectClub = (club: Club) => {
    setSelectedClub(club)
    setAppState("portal")
  }

  const handleBackToClubs = () => {
    setAppState("clubs")
  }

  const handleChangeClub = () => {
    setAppState("clubs")
  }

  const handleLogout = () => {
    setUserPhone(null)
    setIsGuest(true)
    setUserRole("guest")
    setAppState("clubs")
  }

  if (appState === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (appState === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  if (appState === "auth") {
    return <AuthFlow onComplete={handleAuthComplete} onSkip={handleSkipAuth} />
  }

  if (appState === "clubs") {
    return <ClubSelectionScreen onSelectClub={handleSelectClub} />
  }

  if (appState === "portal" && selectedClub) {
    return (
      <ClubApp 
        club={selectedClub}
        allClubs={clubs}
        onBack={handleBackToClubs}
        isGuest={isGuest}
        userRole={userRole}
        userPhone={userPhone}
        onLogin={handleLogin}
        onChangeClub={handleChangeClub}
        onLogout={handleLogout}
        initialCheckout={pendingCheckout}
        onCheckoutStarted={() => setPendingCheckout(false)}
      />
    )
  }

  return null
}
