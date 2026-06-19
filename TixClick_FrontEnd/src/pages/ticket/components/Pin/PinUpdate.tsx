import { useState, useEffect } from "react"
import { Check, X, KeyRound, ArrowLeft } from "lucide-react"
import { NumericKeypad } from "./NumbericKeypad"
import { Button } from "../../../../components/ui/button"


interface PinUpdateProps {
  onSuccess: () => void
  onCancel: () => void
}

export function PinUpdate({ onSuccess, onCancel }: PinUpdateProps) {
  const [step, setStep] = useState<"verify" | "create" | "confirm">("verify")
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const maxLength = 6

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const handleKeyPress = (key: string) => {
    if (step === "verify" && currentPin.length < maxLength) {
      setCurrentPin((prev) => prev + key)
    } else if (step === "create" && newPin.length < maxLength) {
      setNewPin((prev) => prev + key)
    } else if (step === "confirm" && confirmPin.length < maxLength) {
      setConfirmPin((prev) => prev + key)
    }
    setError("")
  }

  const handleBackspace = () => {
    if (step === "verify") {
      setCurrentPin((prev) => prev.slice(0, -1))
    } else if (step === "create") {
      setNewPin((prev) => prev.slice(0, -1))
    } else {
      setConfirmPin((prev) => prev.slice(0, -1))
    }
    setError("")
  }

  const handleVerifyCurrentPin = () => {
    const storedPin = localStorage.getItem("userPin")

    if (currentPin === storedPin) {
      // Xác thực thành công, chuyển sang bước tạo PIN mới
      setStep("create")
      setCurrentPin("")
    } else {
      // Xác thực thất bại
      setShake(true)
      setError("Mã PIN hiện tại không đúng")
      setCurrentPin("")
    }
  }

  const handleNextStep = () => {
    if (newPin.length < 4) {
      setError("PIN phải có ít nhất 4 số")
      return
    }
    setStep("confirm")
  }

  const handleUpdatePin = () => {
    if (newPin !== confirmPin) {
      setError("PIN không khớp")
      setConfirmPin("")
      return
    }

    // Cập nhật PIN mới
    localStorage.setItem("userPin", newPin)
    onSuccess()
  }

  // Tiêu đề và mô tả dựa trên bước hiện tại
  const getTitle = () => {
    switch (step) {
      case "verify":
        return "Xác nhận mã PIN hiện tại"
      case "create":
        return "Tạo mã PIN mới"
      case "confirm":
        return "Xác nhận mã PIN mới"
    }
  }

  const getDescription = () => {
    switch (step) {
      case "verify":
        return "Nhập mã PIN hiện tại của bạn"
      case "create":
        return "Tạo mã PIN mới để bảo vệ tài khoản"
      case "confirm":
        return "Nhập lại mã PIN mới để xác nhận"
    }
  }

  // Xác định PIN hiện tại dựa trên bước
  const getCurrentPinValue = () => {
    switch (step) {
      case "verify":
        return currentPin
      case "create":
        return newPin
      case "confirm":
        return confirmPin
    }
  }

  return (
    <div
      className={`w-full max-w-sm overflow-hidden rounded-xl border-2 border-blue-500/30 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-8 shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-all ${shake ? "animate-shake" : ""}`}
    >
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 p-3">
          <KeyRound className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="text-center text-2xl font-bold text-white">{getTitle()}</h2>
        <p className="mt-1 text-center text-sm text-blue-300/80">{getDescription()}</p>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex gap-3">
          {Array.from({ length: maxLength }).map((_, index) => (
            <div
              key={index}
              className={`flex h-12 w-9 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                index < getCurrentPinValue().length
                  ? "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              {index < getCurrentPinValue().length && (
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
          onSubmit={step === "verify" ? handleVerifyCurrentPin : step === "create" ? handleNextStep : handleUpdatePin}
        />
      </div>

      <div className="space-y-3">
        {step === "verify" && (
          <>
            <Button
              onClick={handleVerifyCurrentPin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
              disabled={currentPin.length < 4}
            >
              <Check className="mr-2 h-4 w-4" />
              Xác nhận
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Hủy
            </Button>
          </>
        )}

        {step === "create" && (
          <Button
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
            disabled={newPin.length < 4}
          >
            Tiếp tục
          </Button>
        )}

        {step === "confirm" && (
          <div className="space-y-3">
            <Button
              onClick={handleUpdatePin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
              disabled={confirmPin.length < 4}
            >
              <Check className="mr-2 h-4 w-4" />
              Cập nhật
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
    </div>
  )
}

