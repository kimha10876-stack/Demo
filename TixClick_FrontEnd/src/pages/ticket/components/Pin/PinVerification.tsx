import { ShieldCheck, Unlock, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { NumericKeypad } from "./NumbericKeypad"

interface PinVerificationProps {
  onSuccess: () => void
  onReset: () => void
}

export function PinVerification({ onSuccess, onReset }: PinVerificationProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false)
  const maxLength = 6

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const handleKeyPress = (key: string) => {
    if (pin.length < maxLength) {
      setPin((prev) => prev + key)
      setError("")
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
    setError("")
  }

  const handleVerifyPin = () => {
    const storedPin = localStorage.getItem("userPin")

    if (pin === storedPin) {
      sessionStorage.setItem("pinVerified", "true")
      onSuccess()
    } else {
      setShake(true)
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        setError("Quá nhiều lần thử. Vui lòng thiết lập lại mã PIN.")
      } else {
        setError(`Mã PIN không đúng. Còn ${3 - newAttempts} lần thử.`)
      }

      setPin("")
    }
  }

  return (
    <div
      className={`w-full max-w-sm overflow-hidden rounded-xl border-2 border-blue-500/30 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-8 shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-all ${shake ? "animate-shake" : ""}`}
    >
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 p-3">
          <ShieldCheck className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="text-center text-2xl font-bold text-white">Xác thực bảo mật</h2>
        <p className="mt-1 text-center text-sm text-blue-300/80">Nhập mã PIN để truy cập</p>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex gap-3">
          {Array.from({ length: maxLength }).map((_, index) => (
            <div
              key={index}
              className={`flex h-12 w-9 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                index < pin.length
                  ? "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              {index < pin.length && (
                <div className="h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-900/30 p-3 text-sm text-red-300">
          <X className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-5">
        <NumericKeypad
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSubmit={handleVerifyPin}
          disabled={attempts >= 3}
        />
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleVerifyPin}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
          disabled={pin.length < 4 || attempts >= 3}
        >
          <Unlock className="mr-2 h-4 w-4" />
          Mở khóa
        </Button>

        {attempts >= 3 && (
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Quên mã PIN?
          </Button>
        )}
      </div>
    </div>
  )
}

