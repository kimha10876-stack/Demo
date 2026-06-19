import { Client } from "@stomp/stompjs";
import { Bell, BellOff } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { AuthContext } from "../../../../contexts/AuthProvider";
import NotificationList, { Notification } from "./NotificationList";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [currentUser, setCurrentUser] = useState<string>("unknown");

  const context = useContext(AuthContext);

  const stompClient = useRef<Client | null>(null);

  // console.log(error);

  // Function to connect to WebSocket
  // Make connectWebSocket depend on currentUser
  const connectWebSocket = () => {
    if (!context?.accessToken2 || currentUser === "unknown") {
      console.log("Waiting for user information before connecting...");
      return;
    }

    console.log("Connecting to WebSocket for user:", currentUser);

    const client = new Client({
      brokerURL: `wss://160.191.175.172:8443/ws?token=${context?.accessToken2}`,
      connectHeaders: {
        Authorization: `Bearer ${context.accessToken2}`,
      },
      debug: function (str) {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      console.log("🔌 Connected to WebSocket:", frame);

      console.log(`Subscribing to /user/${currentUser}/queue/notifications`);

      client.subscribe("/user/specific/messages", async function (message) {
        if (message.body) {
          console.log("📬 Notification event received:", message.body);

          await fetchNotifications();

          toast.success("Thông báo mới", {
            description: "Danh sách thông báo đã được cập nhật.",
          });
        } else {
          console.warn("⚠️ Received empty message from WebSocket");
        }
      });
    };

    client.activate();
    stompClient.current = client;
  };

  // Split the useEffect into two - one for user extraction and one for WebSocket
  useEffect(() => {
    // Extract username from token
    if (context?.accessToken2) {
      try {
        const tokenParts = context.accessToken2.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setCurrentUser(payload.sub || "unknown");
          console.log("👤 Current user:", payload.sub);
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
  }, [context?.accessToken2]);

  // Separate useEffect for WebSocket that depends on currentUser
  useEffect(() => {
    // Only connect if we have a valid user
    if (currentUser !== "unknown") {
      // If there's already a connection, disconnect it first
      if (stompClient.current) {
        stompClient.current.deactivate();
        console.log("Disconnecting previous WebSocket connection");
      }

      connectWebSocket();
    }

    // Cleanup on unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        console.log("🔌 WebSocket disconnected");
      }
    };
  }, [currentUser, context?.accessToken2]);

  // Extract username from token
  useEffect(() => {
    // Get username from token
    if (context?.accessToken2) {
      try {
        const tokenParts = context.accessToken2.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setCurrentUser(payload.sub || "unknown");
          console.log("👤 Current user:", payload.sub);
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }

    // Connect WebSocket
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        console.log("🔌 WebSocket disconnected");
      }
    };
  }, [context?.accessToken2]);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://tixclick.site/api/notification/notifications",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.accessToken2}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải thông báo");
      }

      const data = await response.json();
      console.log("Dữ liệu từ API:", data);

      if (data && Array.isArray(data.result)) {
        const enhancedNotifications = data.result.map(
          (notification: Notification) => ({
            ...notification,
            type:
              notification.type ||
              ["message", "order", "user", "document", "system", "email"][
                Math.floor(Math.random() * 6)
              ],
          })
        );
        setNotifications(enhancedNotifications);
      } else {
        console.error("Dữ liệu từ API không đúng định dạng:", data);
        setNotifications([]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [context?.accessToken2]);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread" && notification.read) return false;
    if (filter === "read" && !notification.read) return false;

    return true;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-background dark:bg-muted/5 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Thông báo của bạn</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Chưa đọc
            </TabsTrigger>
            <TabsTrigger value="read" className="flex items-center gap-2">
              <BellOff className="h-4 w-4" />
              Đã đọc
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="unread" className="mt-4">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="read" className="mt-4">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
