"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function FootballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5l-2.5 2.5 1.5 4 3 .5 3-.5 1.5-4-2.5-2.5H11zm1 2.5l1.5 1-1.5 2-1.5-2 1.5-1z" />
    </svg>
  )
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(onComplete, 500)
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-primary overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated football pattern background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * 400 - 200, 
              y: -100,
              rotate: 0 
            }}
            animate={{ 
              y: 800,
              rotate: 360 
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            style={{ left: `${15 + i * 15}%` }}
          >
            <FootballIcon className="h-12 w-12 text-primary-foreground" />
          </motion.div>
        ))}
      </div>

      {/* Stadium lines decoration */}
      <motion.div
        className="absolute inset-x-0 top-1/4 h-px bg-primary-foreground/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-1/4 h-px bg-primary-foreground/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Tagline with football icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <FootballIcon className="h-5 w-5 text-secondary" />
          </motion.div>
          <p className="text-primary-foreground/90 text-lg font-medium tracking-wide">
            Votre club, votre passion
          </p>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <FootballIcon className="h-5 w-5 text-secondary" />
          </motion.div>
        </motion.div>

        {/* Animated football loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6 flex items-center gap-4"
        >
          <motion.div
            animate={{ 
              x: [0, 60, 0],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FootballIcon className="h-6 w-6 text-secondary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.8 }}
        className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary-foreground rounded-tl-lg"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.8 }}
        className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary-foreground rounded-tr-lg"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary-foreground rounded-bl-lg"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary-foreground rounded-br-lg"
      />
    </motion.div>
  )
}
