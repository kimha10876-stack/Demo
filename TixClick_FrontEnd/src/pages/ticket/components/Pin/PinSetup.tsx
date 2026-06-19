import { ArrowLeft, Check, KeyRound, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { NumericKeypad } from "./NumbericKeypad"


interface PinSetupProps {
  onComplete: () => void
}

export function PinSetup({ onComplete }: PinSetupProps) {
  const [step, setStep] = useState<"create" | "confirm">("create")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const maxLength = 6

  const handleKeyPress = (key: string) => {
    if (step === "create" && pin.length < maxLength) {
      setPin((prev) => prev + key)
    } else if (step === "confirm" && confirmPin.length < maxLength) {
      setConfirmPin((prev) => prev + key)
    }
    setError("")
  }

  const handleBackspace = () => {
    if (step === "create") {
      setPin((prev) => prev.slice(0, -1))
    } else {
      setConfirmPin((prev) => prev.slice(0, -1))
    }
    setError("")
  }

  const handleNextStep = () => {
    if (pin.length < 4) {
      setError("PIN phải có ít nhất 4 số")
      return
    }
    setStep("confirm")
  }

  const handleSetPin = () => {
    if (pin !== confirmPin) {
      setError("PIN không khớp")
      setConfirmPin("")
      return
    }

    localStorage.setItem("userPin", pin)
    onComplete()
  }

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-blue-500/30 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-8 shadow-[0_0_25px_rgba(0,0,0,0.3)]">
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 p-3">
          <KeyRound className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="text-center text-2xl font-bold text-white">
          {step === "create" ? "Tạo mã PIN" : "Xác nhận mã PIN"}
        </h2>
        <p className="mt-1 text-center text-sm text-blue-300/80">
          {step === "create" ? "Tạo mã PIN để bảo vệ tài khoản của bạn" : "Nhập lại mã PIN để xác nhận"}
        </p>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex gap-3">
          {Array.from({ length: maxLength }).map((_, index) => (
            <div
              key={index}
              className={`flex h-12 w-9 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                step === "create"
                  ? index < pin.length
                    ? "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-gray-700 bg-gray-800/50"
                  : index < confirmPin.length
                    ? "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-gray-700 bg-gray-800/50"
              }`}
            >
              {(step === "create" && index < pin.length) || (step === "confirm" && index < confirmPin.length) ? (
                <div className="h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
              ) : null}
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
          onSubmit={step === "create" ? handleNextStep : handleSetPin}
        />
      </div>

      {step === "create" ? (
        <Button
          onClick={handleNextStep}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
          disabled={pin.length < 4}
        >
          Tiếp tục
        </Button>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleSetPin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
            disabled={confirmPin.length < 4}
          >
            <Check className="mr-2 h-4 w-4" />
            Xác nhận
          </Button>

          <Button
            onClick={() => {
              setStep("create")
              setConfirmPin("")
              setError("")
            }}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      )}
    </div>
  )
}

