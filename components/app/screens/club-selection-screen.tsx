"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, ChevronDown, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Club {
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

interface ClubSelectionScreenProps {
  onSelectClub: (club: Club) => void
}

export const clubs: Club[] = [
  // Ligue 1
  { id: "jaraaf", name: "ASC Jaraaf", logo: "/images/clubs/jaraaf.jpg", primaryColor: "#1B5E20", secondaryColor: "#FFFFFF", supporters: 45200, category: "ligue1" },
  { id: "casa", name: "Casa Sports", logo: "/images/clubs/casa.jpg", primaryColor: "#B71C1C", secondaryColor: "#FFFFFF", supporters: 38100, category: "ligue1" },
  { id: "teungueth", name: "Teungueth FC", logo: "/images/clubs/teungueth.jpg", primaryColor: "#E65100", secondaryColor: "#000000", supporters: 29400, category: "ligue1" },
  { id: "diambars", name: "Diambars FC", logo: "/images/clubs/diambars.jpg", primaryColor: "#6A1B9A", secondaryColor: "#FFFFFF", supporters: 22800, category: "ligue1" },
  // Ligue 2
  { id: "pikine", name: "AS Pikine", logo: "/images/clubs/pikine.jpg", primaryColor: "#1565C0", secondaryColor: "#FFC107", supporters: 18500, category: "ligue2" },
  { id: "guediawaye", name: "Guediawaye FC", logo: "/images/clubs/guediawaye.jpg", primaryColor: "#2E7D32", secondaryColor: "#FFEB3B", supporters: 15200, category: "ligue2" },
  // Navetanes - Dakar
  { id: "navetan-dakar-1", name: "ASC Yeggo", logo: "/images/clubs/jaraaf.jpg", primaryColor: "#00695C", secondaryColor: "#FFAB00", supporters: 3200, category: "navetane", region: "Dakar", zone: "Zone A" },
  { id: "navetan-dakar-2", name: "ASC Ndiarème", logo: "/images/clubs/casa.jpg", primaryColor: "#C62828", secondaryColor: "#FFFFFF", supporters: 2800, category: "navetane", region: "Dakar", zone: "Zone A" },
  { id: "navetan-dakar-3", name: "ASC Diamalaye", logo: "/images/clubs/pikine.jpg", primaryColor: "#1976D2", secondaryColor: "#FFF176", supporters: 2400, category: "navetane", region: "Dakar", zone: "Zone B" },
  // Navetanes - Thies
  { id: "navetan-thies-1", name: "ASC Thialy", logo: "/images/clubs/teungueth.jpg", primaryColor: "#EF6C00", secondaryColor: "#212121", supporters: 1900, category: "navetane", region: "Thies", zone: "Zone Centre" },
  { id: "navetan-thies-2", name: "ASC Keur Massar", logo: "/images/clubs/diambars.jpg", primaryColor: "#7B1FA2", secondaryColor: "#E1BEE7", supporters: 1600, category: "navetane", region: "Thies", zone: "Zone Centre" },
  // Navetanes - Saint-Louis
  { id: "navetan-sl-1", name: "ASC Ndar", logo: "/images/clubs/guediawaye.jpg", primaryColor: "#388E3C", secondaryColor: "#FDD835", supporters: 2100, category: "navetane", region: "Saint-Louis", zone: "Zone Nord" },
]

const categories = [
  { id: "all", label: "Tous", icon: null },
  { id: "ligue1", label: "Ligue 1", icon: null },
  { id: "ligue2", label: "Ligue 2", icon: null },
  { id: "navetane", label: "Navetanes", icon: null },
]

const regions = ["Dakar", "Thies", "Saint-Louis"]

export function ClubSelectionScreen({ onSelectClub }: ClubSelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [expandedZones, setExpandedZones] = useState<string[]>([])

  const toggleZone = (zone: string) => {
    setExpandedZones(prev => 
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    )
  }

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || club.category === selectedCategory
    const matchesRegion = !selectedRegion || club.region === selectedRegion
    return matchesSearch && matchesCategory && (selectedCategory !== "navetane" || matchesRegion)
  })

  // Group navetane clubs by region and zone
  const navetanesByRegion = clubs
    .filter(c => c.category === "navetane")
    .reduce((acc, club) => {
      if (!club.region) return acc
      if (!acc[club.region]) acc[club.region] = {}
      if (!acc[club.region][club.zone || "Sans zone"]) acc[club.region][club.zone || "Sans zone"] = []
      acc[club.region][club.zone || "Sans zone"].push(club)
      return acc
    }, {} as Record<string, Record<string, Club[]>>)

  const renderClubCard = (club: Club, index: number) => (
    <motion.button
      key={club.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onSelectClub(club)}
      className="group relative aspect-square rounded-2xl overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background gradient with club colors */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(145deg, ${club.primaryColor} 0%, ${club.secondaryColor} 100%)` 
        }}
      />
      
      {/* Logo taking full card */}
      <div className="absolute inset-2 rounded-xl overflow-hidden">
        <Image
          src={club.logo || "/placeholder.svg"}
          alt={club.name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Club name overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-8">
        <h3 className="font-bold text-white text-center text-xs leading-tight drop-shadow-lg">
          {club.name}
        </h3>
      </div>
    </motion.button>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 pt-6 pb-4">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-bold text-foreground">Choisissez votre club</h1>
            <p className="text-muted-foreground text-sm mt-1">Rejoignez la communaute de supporters</p>
          </motion.div>
          
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-muted border-0 focus-visible:ring-primary"
            />
          </motion.div>
        </div>
        
        {/* Categories */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  if (cat.id !== "navetane") setSelectedRegion(null)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Region filter for Navetanes */}
        <AnimatePresence>
          {selectedCategory === "navetane" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3 border-t border-border pt-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Region</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedRegion(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    !selectedRegion
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Toutes
                </button>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedRegion === region
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Standard grid for Ligue 1, Ligue 2, or All */}
        {(selectedCategory !== "navetane" || !selectedRegion) && selectedCategory !== "navetane" && (
          <div className="grid grid-cols-2 gap-4">
            {filteredClubs.map((club, index) => renderClubCard(club, index))}
          </div>
        )}

        {/* Navetanes organized by Region > Zone */}
        {selectedCategory === "navetane" && (
          <div className="space-y-6">
            {Object.entries(navetanesByRegion)
              .filter(([region]) => !selectedRegion || region === selectedRegion)
              .map(([region, zones]) => (
                <motion.div
                  key={region}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Region header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{region}</h2>
                  </div>

                  {/* Zones */}
                  <div className="space-y-3">
                    {Object.entries(zones).map(([zone, zoneClubs]) => (
                      <div key={zone} className="bg-card rounded-xl border border-border overflow-hidden">
                        {/* Zone header */}
                        <button
                          onClick={() => toggleZone(`${region}-${zone}`)}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{zone}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {zoneClubs.length} clubs
                            </span>
                          </div>
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              expandedZones.includes(`${region}-${zone}`) ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Zone clubs */}
                        <AnimatePresence>
                          {expandedZones.includes(`${region}-${zone}`) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-border"
                            >
                              <div className="p-4 grid grid-cols-2 gap-4">
                                {zoneClubs.map((club, index) => renderClubCard(club, index))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Empty state */}
        {filteredClubs.length === 0 && selectedCategory !== "navetane" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Aucun club trouve pour "{searchQuery}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
