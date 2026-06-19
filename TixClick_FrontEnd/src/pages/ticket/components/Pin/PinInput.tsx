
import type React from "react"

import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../../../../components/ui/button"

interface PinInputProps {
  onSubmit: (pin: string) => void
  onRegister: (pin: string) => void
  isLoading: boolean
  error: string | null
}

export function PinInput({ onSubmit, onRegister, isLoading, error }: PinInputProps) {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""))
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false)
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(6).fill(""))
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string, isConfirm = false) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1)
    }

    if (!/^\d*$/.test(value)) {
      return
    }

    const newPin = isConfirm ? [...confirmPin] : [...pin]
    newPin[index] = value

    if (isConfirm) {
      setConfirmPin(newPin)
    } else {
      setPin(newPin)
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = isConfirm ? confirmInputRefs.current[index + 1] : inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isConfirm = false) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = isConfirm ? confirmInputRefs.current[index - 1] : inputRefs.current[index - 1]
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, isConfirm = false) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (!/^\d+$/.test(pastedData)) {
      return
    }

    const digits = pastedData.split("").slice(0, 6)
    const newPin = Array(6).fill("")

    digits.forEach((digit, index) => {
      if (index < 6) {
        newPin[index] = digit
      }
    })

    if (isConfirm) {
      setConfirmPin(newPin)
    } else {
      setPin(newPin)
    }

    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(digits.length, 5)
    const refs = isConfirm ? confirmInputRefs.current : inputRefs.current

    if (refs[lastIndex]) {
      refs[lastIndex].focus()
    }
  }

  const handleSubmit = () => {
    const pinString = pin.join("")

    if (pinString.length !== 6) {
      return
    }

    if (isRegisterMode) {
      const confirmPinString = confirmPin.join("")

      if (confirmPinString.length !== 6) {
        setConfirmError("Please enter all 6 digits")
        return
      }

      if (pinString !== confirmPinString) {
        setConfirmError("PINs do not match")
        return
      }

      onRegister(pinString)
    } else {
      onSubmit(pinString)
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setPin(Array(6).fill(""))
    setConfirmPin(Array(6).fill(""))
    setConfirmError(null)

    // Focus the first input after toggling
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, 0)
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {isRegisterMode ? "Create PIN" : "Enter PIN"}
        </label>
        <div className="flex justify-between gap-2">
          {pin.map((digit, index) => (
            <input
              key={`pin-${index}`}
              ref={(el:any) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(e)}
              className="w-12 h-12 text-center text-xl font-semibold bg-[#3A3A3A] border border-[#4A4A4A] rounded-md text-white focus:ring-2 focus:ring-[#5A5A5A] focus:border-transparent"
            />
          ))}
        </div>
      </div>

      {isRegisterMode && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm PIN</label>
          <div className="flex justify-between gap-2">
            {confirmPin.map((digit, index) => (
              <input
                key={`confirm-pin-${index}`}
                ref={(el:any) => (confirmInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value, true)}
                onKeyDown={(e) => handleKeyDown(index, e, true)}
                onPaste={(e) => handlePaste(e, true)}
                className="w-12 h-12 text-center text-xl font-semibold bg-[#3A3A3A] border border-[#4A4A4A] rounded-md text-white focus:ring-2 focus:ring-[#5A5A5A] focus:border-transparent"
              />
            ))}
          </div>
          {confirmError && <p className="mt-2 text-sm text-red-500">{confirmError}</p>}
        </div>
      )}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex flex-col gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || pin.some((digit) => digit === "")}
          className="w-full py-2 px-4 bg-[#4A4A4A] hover:bg-[#5A5A5A] text-white rounded-md transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isRegisterMode ? (
            "Register PIN"
          ) : (
            "Submit PIN"
          )}
        </Button>

        <Button variant="ghost" onClick={toggleMode} disabled={isLoading} className="text-gray-400 hover:text-white">
          {isRegisterMode ? "Already have a PIN? Login" : "Register a new PIN"}
        </Button>
      </div>
    </div>
  )
}
