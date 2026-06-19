import { Lock } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { PinInput } from "./PinInput"

interface PinAuthProps {
  children: ReactNode
}



export function PinAuth({ children }: PinAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  // const router = useRouter()

  // Check if PIN is already stored in localStorage
  useEffect(() => {
    const storedPin = localStorage.getItem("pinCode")
    if (storedPin) {
      verifyPin(storedPin)
    }
  }, [])

  const verifyPin = async (pinCode: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/account/login-with-pin-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ pinCode }),
      })

      const data = await response.json()

      if (response.ok && data.code === 0) {
        localStorage.setItem("pinCode", pinCode)
        setIsAuthenticated(true)
      } else {
        setError(data.message || "Invalid PIN code")
        localStorage.removeItem("pinCode")
      }
    } catch (err) {
      setError("Failed to verify PIN. Please try again.")
      localStorage.removeItem("pinCode")
    } finally {
      setIsLoading(false)
    }
  }

  const registerPin = async (pinCode: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/account/register-pin-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ pinCode }),
      })

      const data = await response.json()

      if (response.ok && data.code === 0) {
        localStorage.setItem("pinCode", pinCode)
        setIsAuthenticated(true)
      } else {
        setError(data.message || "Failed to register PIN code")
      }
    } catch (err) {
      setError("Failed to register PIN. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSubmit = async (pin: string) => {
    await verifyPin(pin)
  }

  const handleRegisterPin = async (pin: string) => {
    await registerPin(pin)
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <div className="w-full max-w-md p-8 space-y-8 bg-[#2A2A2A] rounded-xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#3A3A3A] flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">PIN Authentication</h2>
            <p className="mt-2 text-sm text-gray-400">Enter your PIN to access the ticket management system</p>
          </div>

          <PinInput onSubmit={handlePinSubmit} onRegister={handleRegisterPin} isLoading={isLoading} error={error} />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
