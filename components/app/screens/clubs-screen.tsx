"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Search, Heart, Users, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Club {
  id: string
  name: string
  logo: string
  category: string
  location: string
  colors: { primary: string; secondary: string }
  followers: number
  isFollowing: boolean
}

const mockClubs: Club[] = [
  {
    id: "1",
    name: "ASC Jaraaf",
    logo: "/images/clubs/jaraaf.jpg",
    category: "Ligue 1",
    location: "Dakar",
    colors: { primary: "#1B5E20", secondary: "#FFFFFF" },
    followers: 12500,
    isFollowing: true,
  },
  {
    id: "2",
    name: "Casa Sports",
    logo: "/images/clubs/casa.jpg",
    category: "Ligue 1",
    location: "Ziguinchor",
    colors: { primary: "#B71C1C", secondary: "#FFFFFF" },
    followers: 8900,
    isFollowing: false,
  },
  {
    id: "3",
    name: "AS Pikine",
    logo: "/images/clubs/pikine.jpg",
    category: "Ligue 1",
    location: "Pikine",
    colors: { primary: "#1565C0", secondary: "#FFC107" },
    followers: 7200,
    isFollowing: false,
  },
  {
    id: "4",
    name: "ASC Yeggo",
    logo: "/images/clubs/jaraaf.jpg",
    category: "Navetanes",
    location: "Dakar",
    colors: { primary: "#FF6F00", secondary: "#FFFFFF" },
    followers: 1200,
    isFollowing: true,
  },
  {
    id: "5",
    name: "ASC HLM",
    logo: "/images/clubs/casa.jpg",
    category: "Division regionale",
    location: "Dakar",
    colors: { primary: "#6A1B9A", secondary: "#FFFFFF" },
    followers: 850,
    isFollowing: false,
  },
]

const categories = ["Tous", "Ligue 1", "Ligue 2", "Navetanes", "Regional"]

export function ClubsScreen() {
  const [clubs, setClubs] = useState(mockClubs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Tous" || club.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFollow = (clubId: string) => {
    setClubs(clubs.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          isFollowing: !club.isFollowing,
          followers: club.isFollowing ? club.followers - 1 : club.followers + 1,
        }
      }
      return club
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground mb-3">Decouvrir les clubs</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Clubs list */}
      <div className="px-4 py-4">
        <div className="grid gap-4">
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Club logo */}
                <div 
                  className="relative h-16 w-16 rounded-xl overflow-hidden ring-2 flex-shrink-0"
                  style={{ 
                    ringColor: club.colors.primary,
                    backgroundColor: club.colors.primary + "20"
                  }}
                >
                  <Image
                    src={club.logo || "/placeholder.svg"}
                    alt={club.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Club info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground truncate">{club.name}</h3>
                    {club.isFollowing && (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                      {club.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {club.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{club.followers.toLocaleString()} supporters</span>
                  </div>
                </div>

                {/* Follow button */}
                <Button
                  onClick={() => handleFollow(club.id)}
                  variant={club.isFollowing ? "outline" : "default"}
                  size="sm"
                  className={club.isFollowing ? "border-primary text-primary" : ""}
                >
                  {club.isFollowing ? "Suivi" : "Suivre"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun club trouve</p>
          </div>
        )}
      </div>
    </div>
  )
}
