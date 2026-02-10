"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart, Share2, MessageCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  clubName: string
  clubLogo: string
  clubColors: { primary: string; secondary: string }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
}

const mockPosts: Post[] = [
  {
    id: "1",
    clubName: "ASC Jaraaf",
    clubLogo: "/images/clubs/jaraaf.jpg",
    clubColors: { primary: "#1B5E20", secondary: "#FFFFFF" },
    content: "Victoire 2-1 face au Casa Sports ! Nos guerriers ont tout donne sur le terrain. Merci aux supporters presents au stade !",
    image: "/images/club-hero.jpg",
    timestamp: "Il y a 2h",
    likes: 234,
    comments: 45,
    isLiked: false,
  },
  {
    id: "2",
    clubName: "Casa Sports",
    clubLogo: "/images/clubs/casa.jpg",
    clubColors: { primary: "#B71C1C", secondary: "#FFFFFF" },
    content: "Seance de recuperation ce matin pour les joueurs. Le prochain match approche et l'equipe est determinee !",
    timestamp: "Il y a 5h",
    likes: 156,
    comments: 23,
    isLiked: true,
  },
]

const upcomingEvent: Event = {
  id: "1",
  title: "ASC Jaraaf vs AS Pikine",
  date: "Sam 15 Fev",
  time: "17:00",
  location: "Stade Leopold Senghor",
  image: "/images/event-match.jpg",
}

function FootballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5l-2.5 2.5 1.5 4 3 .5 3-.5 1.5-4-2.5-2.5H11zm1 2.5l1.5 1-1.5 2-1.5-2 1.5-1z" />
    </svg>
  )
}

export function HomeScreen() {
  const [posts, setPosts] = useState(mockPosts)

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        }
      }
      return post
    }))
  }

  const handleShare = (postId: string) => {
    // Mock share
    console.log("Sharing post", postId)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <FootballIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">CLUBZ</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            Mes clubs
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Prochain evenement */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Prochain evenement
            </h2>
            <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
              Voir tout
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <Image
              src={upcomingEvent.image || "/placeholder.svg"}
              alt={upcomingEvent.title}
              width={400}
              height={200}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 bg-secondary rounded-full">
                  <span className="text-xs font-semibold text-secondary-foreground">
                    {upcomingEvent.date}
                  </span>
                </div>
                <span className="text-xs text-white/80">{upcomingEvent.time}</span>
              </div>
              <h3 className="font-bold text-white text-lg">{upcomingEvent.title}</h3>
              <p className="text-sm text-white/70">{upcomingEvent.location}</p>
            </div>
          </motion.div>
        </section>

        {/* Feed */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Actualites
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3 p-4">
                    <div 
                      className="relative h-10 w-10 rounded-full overflow-hidden ring-2"
                      style={{ ringColor: post.clubColors.primary }}
                    >
                      <Image
                        src={post.clubLogo || "/placeholder.svg"}
                        alt={post.clubName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{post.clubName}</h4>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>

                  {/* Post content */}
                  <div className="px-4 pb-3">
                    <p className="text-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post image */}
                  {post.image && (
                    <div className="relative aspect-video">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Post actions */}
                  <div className="flex items-center gap-6 p-4 border-t border-border">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 group"
                    >
                      <motion.div
                        whileTap={{ scale: 1.2 }}
                        animate={post.isLiked ? { scale: [1, 1.3, 1] } : {}}
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            post.isLiked 
                              ? "fill-red-500 text-red-500" 
                              : "text-muted-foreground group-hover:text-red-500"
                          }`}
                        />
                      </motion.div>
                      <span className={`text-sm ${post.isLiked ? "text-red-500" : "text-muted-foreground"}`}>
                        {post.likes}
                      </span>
                    </button>

                    <button className="flex items-center gap-2 group">
                      <MessageCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground">{post.comments}</span>
                    </button>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-2 group ml-auto"
                    >
                      <Share2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  )
}
