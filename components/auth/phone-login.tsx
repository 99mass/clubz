"use client"

import React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import Image from "next/image"

function FootballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5l-2.5 2.5 1.5 4 3 .5 3-.5 1.5-4-2.5-2.5H11zm1 2.5l1.5 1-1.5 2-1.5-2 1.5-1z" />
    </svg>
  )
}

interface PhoneLoginProps {
  onSubmit: (phone: string) => void
  onSkip: () => void
}

export function PhoneLogin({ onSubmit, onSkip }: PhoneLoginProps) {
  const [phone, setPhone] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "")
    if (digits.length <= 9) {
      setPhone(formatPhone(digits))
    }
  }

  const rawPhone = phone.replace(/\s/g, "")
  const isValid = rawPhone.length === 9 && /^(70|75|76|77|78)/.test(rawPhone)

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(`+221${rawPhone}`)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border-[40px] border-primary-foreground" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border-[30px] border-primary-foreground" />
      </div>

      {/* Top section with logo */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/clubz-logo.png"
            alt="CLUBZ"
            width={180}
            height={72}
            className="h-16 w-auto"
          />
        </motion.div>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex-1 bg-background rounded-t-[2.5rem] px-6 pt-8 pb-6 flex flex-col"
      >
        {/* Football decoration */}
        <motion.div
          className="absolute -top-6 right-8"
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
        >
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
            <FootballIcon className="w-6 h-6 text-secondary-foreground" />
          </div>
        </motion.div>

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            Rejoignez votre club
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-muted-foreground"
          >
            Connectez-vous pour vivre votre passion
          </motion.p>
        </div>

        {/* Phone input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex-1"
        >
          <div 
            className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-text ${
              isFocused 
                ? "border-primary bg-primary/5" 
                : "border-border bg-muted/30"
            }`}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Country code */}
            <div className="flex items-center gap-2 pr-3 border-r border-border">
              <span className="text-lg">🇸🇳</span>
              <span className="font-semibold text-foreground">+221</span>
            </div>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="tel"
                value={phone}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="77 123 45 67"
                className="w-full bg-transparent text-xl font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>

            {/* Indicator */}
            <AnimatePresence>
              {isValid && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Helper text */}
          <p className="mt-3 text-sm text-muted-foreground text-center">
            Un code SMS vous sera envoye
          </p>
        </motion.div>

        {/* Bottom actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="space-y-3 pt-8 mt-auto"
        >
          {/* Continue button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-14 text-base font-semibold rounded-2xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            size="lg"
          >
            Continuer
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Skip option */}
          <Button
            onClick={onSkip}
            variant="ghost"
            className="w-full h-12 text-muted-foreground hover:text-foreground"
          >
            Explorer sans compte
          </Button>
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 pt-6 text-xs text-muted-foreground"
        >
          <Phone className="w-3 h-3" />
          <span>Connexion securisee par OTP</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
