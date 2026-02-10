"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, RefreshCw } from "lucide-react"

function FootballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5l-2.5 2.5 1.5 4 3 .5 3-.5 1.5-4-2.5-2.5H11zm1 2.5l1.5 1-1.5 2-1.5-2 1.5-1z" />
    </svg>
  )
}

function WhistleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L8 6H4v4l-2 2 2 2v4h4l4 4 4-4h4v-4l2-2-2-2V6h-4l-4-4zm0 3.41L14.59 8H16v1.41L18.59 12 16 14.59V16h-1.41L12 18.59 9.41 16H8v-1.41L5.41 12 8 9.41V8h1.41L12 5.41z"/>
    </svg>
  )
}

interface OtpScreenProps {
  phone: string
  onVerify: () => void
  onBack: () => void
}

type VerificationState = "idle" | "loading" | "success" | "error"

export function OtpScreen({ phone, onVerify, onBack }: OtpScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [verificationState, setVerificationState] = useState<VerificationState>("idle")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      handleVerify(pastedData)
    }
  }

  const handleVerify = (code: string) => {
    setVerificationState("loading")
    
    setTimeout(() => {
      if (code === "123456") {
        setVerificationState("success")
        setTimeout(() => {
          onVerify()
        }, 1200)
      } else {
        setVerificationState("error")
        setTimeout(() => {
          setVerificationState("idle")
          setOtp(["", "", "", "", "", ""])
          inputRefs.current[0]?.focus()
        }, 1500)
      }
    }, 1000)
  }

  const handleResend = () => {
    if (!canResend) return
    setCountdown(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    setVerificationState("idle")
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-primary overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-foreground/5"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -left-16 h-48 w-48 rounded-full bg-secondary/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-foreground/10"
          disabled={verificationState === "loading" || verificationState === "success"}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WhistleIcon className="h-5 w-5 text-secondary" />
          <span className="text-sm font-medium text-primary-foreground/80">Verification</span>
        </motion.div>
        
        <div className="w-10" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Icon and title */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary"
            >
              <FootballIcon className="h-8 w-8 text-secondary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary-foreground">
              Code de verification
            </h1>
            <p className="mt-2 text-primary-foreground/70">
              Envoye au <span className="font-semibold text-secondary">{phone}</span>
            </p>
          </div>

          {/* OTP Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-card p-6 shadow-2xl"
          >
            {/* OTP Input */}
            <div 
              className="flex justify-between gap-2" 
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={verificationState !== "idle"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: verificationState === "error" ? [1, 1.05, 0.95, 1] : 1
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    scale: { duration: 0.3 }
                  }}
                  className={`h-14 w-full rounded-xl border-2 bg-muted/50 text-center text-2xl font-bold outline-none transition-all
                    ${verificationState === "error" 
                      ? "border-destructive text-destructive" 
                      : verificationState === "success"
                      ? "border-primary text-primary"
                      : digit 
                      ? "border-primary text-foreground" 
                      : "border-transparent text-foreground focus:border-primary focus:bg-muted"
                    }
                    disabled:opacity-60
                  `}
                />
              ))}
            </div>

            {/* Status */}
            <AnimatePresence mode="wait">
              {verificationState === "loading" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center justify-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FootballIcon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground">Verification...</span>
                </motion.div>
              )}

              {verificationState === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary"
                  >
                    <Check className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  <span className="text-sm font-medium text-primary">Bienvenue sur CLUBZ !</span>
                </motion.div>
              )}

              {verificationState === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-center"
                >
                  <span className="text-sm text-destructive">Code incorrect</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resend */}
            {verificationState === "idle" && (
              <div className="mt-6 text-center">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Renvoyer le code
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Renvoyer dans <span className="font-bold text-foreground">{countdown}s</span>
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Demo hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-xs text-primary-foreground/50"
          >
            Demo: code <span className="font-mono font-bold text-secondary">123456</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary-foreground/5 to-transparent" />
    </div>
  )
}
