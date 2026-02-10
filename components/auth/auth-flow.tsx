"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PhoneLogin } from "./phone-login"
import { OtpScreen } from "./otp-screen"

interface AuthFlowProps {
  onComplete: (phone: string) => void
  onSkip: () => void
}

export function AuthFlow({ onComplete, onSkip }: AuthFlowProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")

  const handlePhoneSubmit = (phoneNumber: string) => {
    setPhone(phoneNumber)
    setStep("otp")
  }

  const handleOtpVerify = () => {
    onComplete(phone)
  }

  const handleBack = () => {
    setStep("phone")
  }

  return (
    <AnimatePresence mode="wait">
      {step === "phone" && (
        <motion.div
          key="phone"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PhoneLogin onSubmit={handlePhoneSubmit} onSkip={onSkip} />
        </motion.div>
      )}

      {step === "otp" && (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <OtpScreen
            phone={phone}
            onVerify={handleOtpVerify}
            onBack={handleBack}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
