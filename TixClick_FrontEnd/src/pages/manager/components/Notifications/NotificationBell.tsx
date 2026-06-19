import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover"
import { Button } from "../../../../components/ui/button"
import NotificationList, { Notification } from "./NotificationList"


export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/notifications")

        if (!response.ok) {
          throw new Error("Failed to fetch notifications")
        }

        const data = await response.json()
        setNotifications(data)

        // Count unread notifications
        const count = data.filter((notification: Notification) => !notification.read).length
        setUnreadCount(count)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  // Mark notifications as read when popover is opened
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    if (newOpen && unreadCount > 0) {
      // In a real app, you would call an API to mark notifications as read
      // For now, we'll just update the local state
      setTimeout(() => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
        setUnreadCount(0)
      }, 1000)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium">Thông báo</h4>
          {unreadCount > 0 && <p className="text-xs text-muted-foreground">Bạn có {unreadCount} thông báo chưa đọc</p>}
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          <NotificationList notifications={notifications} loading={loading} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

