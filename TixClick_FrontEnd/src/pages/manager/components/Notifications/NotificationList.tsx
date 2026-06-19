import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Bell, Clock, FileText, Info, Mail, MessageSquare, User } from "lucide-react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Skeleton } from "../../../../components/ui/skeleton"
import { cn } from "../../../../lib/utils"

interface NotificationListProps {
  notifications: Notification[]
  loading: boolean
  onMarkAsRead?: (id: string) => Promise<void> | void
  onDelete?: (id: string) => Promise<void> | void
  onMarkAllAsRead?: () => Promise<void> | void
}

export interface Notification {
  notificationId: string
  message: string
  read: boolean
  createdDate: string
  type?: string
  link?: string
}

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {}

  notifications.forEach((notification) => {
    const date = new Date(notification.createdDate)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let groupKey = ""

    if (date.toDateString() === today.toDateString()) {
      groupKey = "Hôm nay"
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Hôm qua"
    } else {
      groupKey = date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }

    groups[groupKey].push(notification)
  })

  return groups
}

const getNotificationIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "message":
      return <MessageSquare className="h-5 w-5 text-blue-500" />
    case "user":
      return <User className="h-5 w-5 text-purple-500" />
    case "document":
      return <FileText className="h-5 w-5 text-yellow-500" />
    case "system":
      return <Info className="h-5 w-5 text-red-500" />
    case "email":
      return <Mail className="h-5 w-5 text-indigo-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

export default function NotificationList({
  notifications,
  loading,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-end gap-2 pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!Array.isArray(notifications)) {
    console.error("Lỗi: notifications không phải là mảng", notifications)
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Dữ liệu thông báo không hợp lệ</p>
        </CardContent>
      </Card>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Không có thông báo</h3>
          <p className="text-muted-foreground">Bạn chưa có thông báo nào</p>
        </CardContent>
      </Card>
    )
  }

  const groupedNotifications = groupNotificationsByDate(notifications)

  return (
    <div className="space-y-6">
      

      {Object.entries(groupedNotifications).map(([date, items]) => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">{date}</h3>
          <div className="space-y-3">
            {items.map((notification) => (
              <Card
                key={notification.notificationId || Math.random()}
                className={cn(
                  "overflow-hidden transition-all duration-200 hover:shadow-md",
                  !notification.read && "border-l-4 border-l-primary",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.message}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {notification.createdDate
                          ? formatDistanceToNow(new Date(notification.createdDate), {
                              addSuffix: true,
                              locale: vi,
                            })
                          : "Vừa xong"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

