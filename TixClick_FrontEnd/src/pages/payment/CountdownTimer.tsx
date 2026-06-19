import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface CountdownTimerProps {
  initialMinutes?: number
  initialSeconds?: number
  onTimeUp?: () => void
}

export default function CountdownTimer({ initialMinutes = 10, initialSeconds = 0, onTimeUp }: CountdownTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          // Time's up
          clearInterval(interval!)
          if (onTimeUp) onTimeUp()
        }
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [minutes, seconds, isActive, onTimeUp])

  // Format time with leading zeros
  const formattedMinutes = String(minutes).padStart(2, "0")
  const formattedSeconds = String(seconds).padStart(2, "0")

  return (
    <div className="flex items-center text-sm text-gray-400">
      <Clock className="h-4 w-4 mr-1 text-[#FF8A00]" />
      <span>Còn lại: </span>
      <span className="text-[#FF8A00] font-medium ml-1 tabular-nums">
        {formattedMinutes}:{formattedSeconds}
      </span>
    </div>
  )
}
