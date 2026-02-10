"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lock, Crown, Heart, Share2, Play, ArrowLeft, Eye, Clock, Star, X
} from "lucide-react"
import Image from "next/image"
import type { Club, UserRole } from "../club-app"

interface PremiumPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  likes: number
  views: number
  readTime: string
  category: "video" | "article" | "annonce" | "coulisses"
  is_premium: boolean
}

interface PremiumContentScreenProps {
  club: Club
  userRole: UserRole
  isGuest: boolean
  onLogin: () => void
}

const premiumPosts: PremiumPost[] = [
  {
    id: 101,
    title: "Coulisses: Preparation avant le derby",
    excerpt: "Decouvrez l'ambiance dans le vestiaire et les derniers reglages tactiques avant le grand match.",
    content: "Un acces exclusif aux coulisses du club avant le derby tant attendu. De la seance video tactique du matin aux dernieres consignes du coach dans le vestiaire, vivez cette journee comme si vous y etiez. Les joueurs se sont montres determines et concentres. Le staff medical a confirme que l'ensemble de l'effectif est apte. Un match qui s'annonce palpitant!",
    image: "/images/news/training.jpg",
    date: "Il y a 3h",
    likes: 342,
    views: 1280,
    readTime: "5 min",
    category: "coulisses",
    is_premium: true,
  },
  {
    id: 102,
    title: "Interview exclusive: Le capitaine se confie",
    excerpt: "Une interview intimiste avec le capitaine sur ses ambitions et sa vision pour la saison.",
    content: "Dans cette interview exclusive reservee aux membres, notre capitaine nous livre ses pensees les plus profondes sur la saison en cours. Il evoque ses objectifs personnels, la cohesion du groupe et son ambition de remporter le titre cette annee. Il partage egalement des anecdotes inedites sur ses coequipiers et sa routine d'entrainement quotidienne.",
    image: "/images/news/victory.jpg",
    date: "Hier",
    likes: 189,
    views: 890,
    readTime: "7 min",
    category: "article",
    is_premium: true,
  },
  {
    id: 103,
    title: "Video: Les plus beaux buts de la saison",
    excerpt: "Compilation exclusive des 10 plus beaux buts de la saison, avec analyse tactique.",
    content: "Revivez les moments forts de la saison avec cette compilation exclusive. Chaque but est accompagne d'une analyse tactique detaillee par notre staff technique.",
    image: "/images/event-match.jpg",
    date: "Il y a 2 jours",
    likes: 456,
    views: 2100,
    readTime: "12 min",
    category: "video",
    is_premium: true,
  },
  {
    id: 104,
    title: "Annonce: Journee portes ouvertes reservee aux membres",
    excerpt: "Invitation speciale pour les membres: visitez le centre d'entrainement et rencontrez les joueurs.",
    content: "En tant que membre du club, vous etes invite a participer a notre journee portes ouvertes exclusive le samedi 22 fevrier. Au programme: visite guidee du centre d'entrainement, seance de dedicaces avec les joueurs, et un dejeuner offert. Places limitees, inscrivez-vous vite!",
    image: "/images/club-hero.jpg",
    date: "Il y a 3 jours",
    likes: 278,
    views: 1560,
    readTime: "3 min",
    category: "annonce",
    is_premium: true,
  },
  {
    id: 105,
    title: "Analyse tactique: Le schema de jeu decrypte",
    excerpt: "Notre analyste decrypte le systeme tactique mis en place cette saison.",
    content: "Plongez dans l'univers tactique du club avec cette analyse detaillee de notre systeme de jeu. Du pressing haut au jeu de possession, decouvrez les secrets tactiques qui font la force de notre equipe.",
    image: "/images/news/signing.jpg",
    date: "Il y a 5 jours",
    likes: 167,
    views: 720,
    readTime: "8 min",
    category: "article",
    is_premium: true,
  },
]

const categoryLabels: Record<string, string> = {
  video: "Video",
  article: "Article",
  annonce: "Annonce",
  coulisses: "Coulisses",
}

const categoryColors: Record<string, string> = {
  video: "#EF4444",
  article: "#3B82F6",
  annonce: "#F59E0B",
  coulisses: "#8B5CF6",
}

export function PremiumContentScreen({ club, userRole, isGuest, onLogin }: PremiumContentScreenProps) {
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [selectedPost, setSelectedPost] = useState<PremiumPost | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const isMember = !isGuest && userRole !== "guest" && userRole !== "supporter"

  const filters = [
    { id: "all", label: "Tout" },
    { id: "coulisses", label: "Coulisses" },
    { id: "article", label: "Articles" },
    { id: "video", label: "Videos" },
    { id: "annonce", label: "Annonces" },
  ]

  const filteredPosts = activeFilter === "all"
    ? premiumPosts
    : premiumPosts.filter((p) => p.category === activeFilter)

  const handleLike = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isMember) return
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4 pb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5" style={{ color: "#FFD700" }} />
          <h2 className="font-bold text-foreground text-lg">Contenu premium</h2>
        </div>
        <span className="text-xs text-muted-foreground">{premiumPosts.length} contenus</span>
      </div>

      {/* Non-member banner */}
      {!isMember && (
        <div
          className="p-4 rounded-xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${club.primaryColor}15, ${club.secondaryColor}15)`,
            border: `1px solid ${club.primaryColor}30`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${club.primaryColor}20` }}
            >
              <Lock className="w-5 h-5" style={{ color: club.primaryColor }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm mb-1">Contenu reserve aux membres</p>
              <p className="text-xs text-muted-foreground mb-3">
                Devenez membre pour acceder aux contenus exclusifs du club
              </p>
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ background: club.primaryColor }}
              >
                {isGuest ? "Se connecter" : "Devenir membre"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeFilter === filter.id ? club.primaryColor : "var(--muted)",
              color: activeFilter === filter.id ? "white" : "var(--muted-foreground)",
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Featured premium post */}
      {filteredPosts.length > 0 && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => isMember && setSelectedPost(filteredPosts[0])}
          className="rounded-2xl overflow-hidden cursor-pointer group relative"
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={filteredPosts[0].image || "/placeholder.svg"}
              alt={filteredPosts[0].title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${!isMember ? "blur-[2px]" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Premium badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                style={{ background: categoryColors[filteredPosts[0].category] }}
              >
                {filteredPosts[0].category === "video" && <Play className="w-3 h-3" />}
                {categoryLabels[filteredPosts[0].category]}
              </div>
              <div className="px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 bg-amber-500 text-white">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            </div>

            {/* Lock overlay for non-members */}
            {!isMember && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>
            )}

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-bold text-white text-lg leading-tight mb-2 text-balance">
                {filteredPosts[0].title}
              </h3>
              <p className="text-white/80 text-sm mb-3 line-clamp-2">{filteredPosts[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span>{filteredPosts[0].date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {filteredPosts[0].views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {filteredPosts[0].readTime}
                  </span>
                </div>
                <button
                  onClick={(e) => handleLike(filteredPosts[0].id, e)}
                  className="flex items-center gap-1.5 text-white"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      likedPosts.includes(filteredPosts[0].id) ? "fill-red-500 text-red-500 scale-110" : ""
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {filteredPosts[0].likes + (likedPosts.includes(filteredPosts[0].id) ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      )}

      {/* Other premium posts */}
      <div className="space-y-3">
        {filteredPosts.slice(1).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 1) * 0.08 }}
            onClick={() => isMember && setSelectedPost(post)}
            className="flex gap-3 p-3 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/30 transition-all group relative"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${!isMember ? "blur-[1px]" : ""}`}
              />
              {/* Category badge */}
              <div
                className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white flex items-center gap-0.5"
                style={{ background: categoryColors[post.category] }}
              >
                {post.category === "video" && <Play className="w-2.5 h-2.5" />}
                {categoryLabels[post.category]}
              </div>

              {/* Lock for non-members */}
              {!isMember && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Lock className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span className="text-[9px] font-bold text-amber-500">PREMIUM</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                  {post.title}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    {post.views}
                  </span>
                </div>
                <button
                  onClick={(e) => handleLike(post.id, e)}
                  className="flex items-center gap-1"
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                      likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Premium Post Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedPost && (
          <PremiumPostDetail
            club={club}
            post={selectedPost}
            isLiked={likedPosts.includes(selectedPost.id)}
            onLike={() =>
              setLikedPosts((prev) =>
                prev.includes(selectedPost.id)
                  ? prev.filter((id) => id !== selectedPost.id)
                  : [...prev, selectedPost.id]
              )
            }
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ PREMIUM POST DETAIL ============
function PremiumPostDetail({
  club,
  post,
  isLiked,
  onLike,
  onClose,
}: {
  club: Club
  post: PremiumPost
  isLiked: boolean
  onLike: () => void
  onClose: () => void
}) {
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
        className="fixed bottom-0 inset-x-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
      >
        {/* Hero image */}
        <div className="relative aspect-[16/10]">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover rounded-t-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 rounded-t-3xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div
              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
              style={{ background: categoryColors[post.category] }}
            >
              {post.category === "video" && <Play className="w-3 h-3" />}
              {categoryLabels[post.category]}
            </div>
            <div className="px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 bg-amber-500 text-white">
              <Crown className="w-3 h-3" />
              Premium
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 -mt-6 relative">
          <div className="bg-background rounded-t-2xl pt-4">
            {/* Meta info */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.views} vues
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-foreground leading-tight mb-4 text-balance">
              {post.title}
            </h1>

            {/* Content */}
            <p className="text-muted-foreground leading-relaxed text-sm text-pretty">
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border pb-6">
              <button
                onClick={onLike}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{
                  background: isLiked ? `${club.primaryColor}15` : "transparent",
                  border: `1px solid ${isLiked ? club.primaryColor : "var(--border)"}`,
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
                  {post.likes + (isLiked ? 1 : 0)} J'aime
                </span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border">
                <Share2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Partager</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
