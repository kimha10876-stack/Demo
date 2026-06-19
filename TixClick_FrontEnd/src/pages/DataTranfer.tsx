
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Define consistent interfaces for data transfer
export interface SeatInfo {
  id: string
  seatId: number
  sectionName: string
  typeName: string
  formattedPrice: string
  seatLabel: string
  rcCode: string
  price: number
  seatTypeId: string
  zoneActivityId?: number
  ticketId?: number
  zoneId?: number
  row: number
  column: number
  status: string
}

export interface EventInfo {
  id: string | null
  activityId: string | null
  name: string
  location: string
  date: string
}

export interface SelectedSeatsData {
  seats: SeatInfo[]
  totalAmount: number
  eventInfo: EventInfo
  apiResponses?: {
    ticket?: any
    seats?: any
    purchase?: any
  }
}

// Function to save selected seats data to localStorage
export const saveSelectedSeatsData = (data: SelectedSeatsData): void => {
  try {
    localStorage.setItem("selectedSeats", JSON.stringify(data))
    console.log("Saved selected seats data:", data)
  } catch (error) {
    console.error("Error saving selected seats data:", error)
    toast.error("Không thể lưu thông tin ghế đã chọn")
  }
}

// Function to get selected seats data from localStorage
export const getSelectedSeatsData = (): SelectedSeatsData | null => {
  try {
    const data = localStorage.getItem("selectedSeats")
    if (!data) return null

    return JSON.parse(data) as SelectedSeatsData
  } catch (error) {
    console.error("Error getting selected seats data:", error)
    toast.error("Không thể đọc thông tin ghế đã chọn")
    return null
  }
}

// Hook to use selected seats data
export const useSelectedSeatsData = () => {
  const [selectedSeatsData, setSelectedSeatsData] = useState<SelectedSeatsData | null>(null)

  useEffect(() => {
    const data = getSelectedSeatsData()
    setSelectedSeatsData(data)
  }, [])

  const updateSelectedSeatsData = (data: SelectedSeatsData) => {
    saveSelectedSeatsData(data)
    setSelectedSeatsData(data)
  }

  return { selectedSeatsData, updateSelectedSeatsData }
}

// Function to format date and time consistently
export const formatEventDateTime = (startTime?: string, endTime?: string, date?: string): string => {
  if (!startTime || !date) return "19:30, 12 tháng 4, 2025"

  const formattedTime = endTime ? `${startTime} - ${endTime}` : startTime

  return `${formattedTime}, ${date}`
}

// Function to calculate total amount consistently
export const calculateTotal = (seats: SeatInfo[]): number => {
  return seats.reduce((total, seat) => total + (seat.price || 0), 0)
}

// Function to format currency consistently
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export const formatDateVietnamese = (dateString?: string): string => {
    if (!dateString) return ""
  
    try {
      const date = new Date(dateString)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
  
      return `${day} tháng ${month}, ${year}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }
  
  // Format time for frontend display
  export const formatTimeFe = (timeString?: string): string => {
    if (!timeString) return ""
  
    try {
      // Handle different time formats
      if (timeString.includes("T")) {
        // ISO format
        const date = new Date(timeString)
        return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      } else if (timeString.includes(":")) {
        // Already in HH:MM format
        return timeString.substring(0, 5)
      }
  
      return timeString
    } catch (error) {
      console.error("Error formatting time:", error)
      return timeString
    }
  }
  
  // Format money with Vietnamese currency
  export const formatMoney = (amount?: number): string => {
    if (amount === undefined || amount === null) return "0 đ"
  
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }
  