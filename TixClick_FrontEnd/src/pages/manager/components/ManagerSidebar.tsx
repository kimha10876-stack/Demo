import {
  Bell,
  CalendarDays,
  ClipboardSignature,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MailIcon,
  MessageSquare,
  UserCheck,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import Logo from "../../../assets/Logo.png";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../../../components/ui/sidebar";
import { cn } from "../../../lib/utils";
// Import the AuthContext and Client from stomp/stompjs at the top
import { Client } from "@stomp/stompjs";
import { useContext, useEffect, useRef, useState } from "react";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { AuthContext } from "../../../contexts/AuthProvider";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState("");
  // Replace the existing notifications state and add these new states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("unknown");
  const stompClient = useRef<Client | null>(null);
  const context = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(5); // Example count
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Add this type definition
  type Notification = {
    id: number;
    content?: string;
    message?: string;
    title?: string;
    type?: string;
    read: boolean;
    createdAt?: string;
    time?: string;
  };

  useEffect(() => {
    const path = location.pathname.replace(/^\/manager\/?/, "");
    setCurrentPath(path);
  }, [location.pathname]);

  // Extract username from token
  useEffect(() => {
    if (context?.accessToken) {
      try {
        const tokenParts = context.accessToken.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setCurrentUser(payload.sub || "unknown");
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
  }, [context?.accessToken]);

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    const connectWebSocket = () => {
      if (!context?.accessToken || currentUser === "unknown") {
        return;
      }

      const client = new Client({
        brokerURL: "wss://tixclick.site/ws",
        connectHeaders: {
          Authorization: `Bearer ${context.accessToken}`,
        },
        debug: (str) => {
          console.log("STOMP: " + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        client.subscribe(`/user/specific/messages`, (message) => {
          try {
            const newNotification = JSON.parse(message.body);

            // Add to notifications list
            setNotifications((prev) => [
              {
                ...newNotification,
                type:
                  newNotification.type ||
                  ["message", "order", "user", "document", "system", "email"][
                    Math.floor(Math.random() * 6)
                  ],
                time: "Just now",
              },
              ...prev,
            ]);

            // Update unread count
            setUnreadNotifications((prev) => prev + 1);

            // Show toast notification
            toast.success("Thông báo mới", {
              description:
                newNotification.content ||
                newNotification.message ||
                "Bạn có thông báo mới",
            });
          } catch (err) {
            console.error("Error processing WebSocket message:", err);
          }
        });
      };

      client.activate();
      stompClient.current = client;
    };

    if (currentUser !== "unknown") {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
      connectWebSocket();
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [currentUser, context?.accessToken]);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!context?.accessToken) return;

      try {
        setLoading(true);
        const response = await fetch(
          "https://tixclick.site/api/notification/notifications",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${context.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi tải thông báo");
        }

        const data = await response.json();

        if (data && Array.isArray(data.result)) {
          const enhancedNotifications = data.result.map(
            (notification: Notification) => ({
              ...notification,
              type:
                notification.type ||
                ["message", "order", "user", "document", "system", "email"][
                  Math.floor(Math.random() * 6)
                ],
              time: formatNotificationTime(notification.createdAt),
            })
          );
          setNotifications(enhancedNotifications);

          const unreadCount = enhancedNotifications.filter(
            (n: any) => !n.read
          ).length;
          setUnreadNotifications(unreadCount);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [context?.accessToken]);

  const formatNotificationTime = (createdAt?: string) => {
    if (!createdAt) return "Unknown time";

    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Add this function to mark notifications as read
  const markAllAsRead = async () => {
    if (!context?.accessToken) return;

    try {
      // You would typically call an API endpoint to mark all as read
      // For now, we'll just update the local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotifications(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      toast.error("Failed to mark notifications as read");
    }
  };

  const isActive = (path: string) => {
    if (
      path === "" &&
      (location.pathname === "/manager" || location.pathname === "/manager/")
    ) {
      return true;
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
      duration: 5000,
    });

    setTimeout(() => {
      navigate("/superLogin");
    }, 1000);
  };

  // Function to get notification icon based on type
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "message":
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
        );
      case "order":
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
        );
      case "user":
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
        );
      case "document":
        return (
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
            <ClipboardSignature className="h-5 w-5" />
          </div>
        );
      case "email":
        return (
          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
            <MailIcon className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
            <Bell className="h-5 w-5" />
          </div>
        );
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    return notification.type === activeTab;
  });

  // Get notification counts by type
  const getTypeCount = (type: string) => {
    return notifications.filter((n) => n.type === type && !n.read).length;
  };

  return (
    <Sidebar>
      <Toaster position="top-right" />
      <SidebarHeader className="border-b border-[#333333] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={Logo || "/placeholder.svg"}
              alt="Logo"
              className="h-12 w-13"
            />
            <h1 className="text-xl font-bold text-black">Manager Dashboard</h1>
          </div>

          {/* Notification Bell in Header */}
          <Popover
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-orange-100 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <Bell className="h-5 w-5 text-orange-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-[10px] font-medium text-white flex items-center justify-center ring-2 ring-white">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[380px] p-0 shadow-lg border border-orange-100"
              align="end"
              sideOffset={5}
            >
              <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-orange-50 to-white">
                <h3 className="font-semibold text-lg text-orange-700">
                  Thông báo
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                    disabled={unreadNotifications === 0}
                  >
                    Đánh dấu đã đọc
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <div className="px-4 pt-2">
                  <TabsList className="w-full bg-orange-50 p-1">
                    <TabsTrigger
                      value="all"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:text-orange-700"
                    >
                      Tất cả
                      {unreadNotifications > 0 && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-orange-100 text-orange-700 border-orange-200"
                        >
                          {unreadNotifications}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="message"
                      className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700"
                    >
                      Đã đọc
                      {getTypeCount("message") > 0 && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-blue-100 text-blue-700 border-blue-200"
                        >
                          {getTypeCount("message")}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <ScrollArea className="h-[350px]">
                    {loading ? (
                      <div className="flex flex-col gap-2 p-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 border-b animate-pulse"
                          >
                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredNotifications.length > 0 ? (
                      <div className="flex flex-col">
                        {filteredNotifications
                          .slice(0, 5)
                          .map((notification) => (
                            <div
                              key={notification.id}
                              className={cn(
                                "flex items-start gap-3 p-4 border-b hover:bg-orange-50 cursor-pointer transition-colors",
                                !notification.read &&
                                  "bg-gradient-to-r from-orange-50 to-white"
                              )}
                              onClick={() => {
                                navigate("notifications");
                                setIsNotificationsOpen(false);
                              }}
                            >
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium text-gray-800">
                                    {notification.title ||
                                      notification.content ||
                                      notification.message ||
                                      "Thông báo mới"}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 ml-2 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8">
                        <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-400 mb-4">
                          <Bell className="h-8 w-8" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          Không có thông báo
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="message" className="mt-0">
                  <ScrollArea className="h-[350px]">
                    {loading ? (
                      <div className="flex flex-col gap-2 p-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 border-b animate-pulse"
                          >
                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredNotifications.length > 0 ? (
                      <div className="flex flex-col">
                        {filteredNotifications
                          .slice(0, 5)
                          .map((notification) => (
                            <div
                              key={notification.id}
                              className={cn(
                                "flex items-start gap-3 p-4 border-b hover:bg-blue-50 cursor-pointer transition-colors",
                                !notification.read &&
                                  "bg-gradient-to-r from-blue-50 to-white"
                              )}
                              onClick={() => {
                                navigate("notifications");
                                setIsNotificationsOpen(false);
                              }}
                            >
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium text-gray-800">
                                    {notification.title ||
                                      notification.content ||
                                      notification.message ||
                                      "Thông báo mới"}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 ml-2 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 mb-4">
                          <MessageSquare className="h-8 w-8" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          Không có thông báo
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="order" className="mt-0">
                  <ScrollArea className="h-[350px]">
                    {loading ? (
                      <div className="flex flex-col gap-2 p-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 border-b animate-pulse"
                          >
                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredNotifications.length > 0 ? (
                      <div className="flex flex-col">
                        {filteredNotifications
                          .slice(0, 5)
                          .map((notification) => (
                            <div
                              key={notification.id}
                              className={cn(
                                "flex items-start gap-3 p-4 border-b hover:bg-green-50 cursor-pointer transition-colors",
                                !notification.read &&
                                  "bg-gradient-to-r from-green-50 to-white"
                              )}
                              onClick={() => {
                                navigate("notifications");
                                setIsNotificationsOpen(false);
                              }}
                            >
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium text-gray-800">
                                    {notification.title ||
                                      notification.content ||
                                      notification.message ||
                                      "Đơn hàng mới"}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 ml-2 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-400 mb-4">
                          <CreditCard className="h-8 w-8" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          Không có thông báo đơn hàng
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <div className="p-4 border-t">
                  <Button
                    asChild
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Link to="notifications">Xem tất cả thông báo</Link>
                  </Button>
                </div>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild className={cn(isActive("") && "bg-orange-100 text-orange-600 font-medium")}>
              <Link to="" className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span>Tổng quan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                isActive("company-approvals") &&
                  "bg-orange-100 text-orange-600 font-medium"
              )}
            >
              <Link to="company-approvals" className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5" />
                <span>Xét duyệt công ty</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                isActive("events") &&
                  "bg-orange-100 text-orange-600 font-medium"
              )}
            >
              <Link to="events" className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>Xét duyệt sự kiện</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                isActive("contracts") &&
                  "bg-orange-100 text-orange-600 font-medium"
              )}
            >
              <Link to="contracts" className="flex items-center">
                <ClipboardSignature className="mr-2 h-5 w-5" />
                <span>Hợp đồng</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                isActive("payments") &&
                  "bg-orange-100 text-orange-600 font-medium"
              )}
            >
              <Link to="payments" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                <span>Thanh toán</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          {/* Notifications page link - still keep this for navigation
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(isActive("notifications") && "bg-orange-100 text-orange-600 font-medium")}
            >
              <Link to="notifications" className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge variant="outline" className="ml-auto bg-orange-100 text-orange-600 border-orange-200">
                    {unreadNotifications}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="border-t border-[#333333] p-6">
        <div className="flex flex-col space-y-4">
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/" alt="Manager" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span>Manager Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] text-white">
              <DialogHeader>
                <DialogTitle>Manager Profile</DialogTitle>
                <DialogDescription>
                  View and manage your manager account details.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-4 py-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">Manager User</h3>
                  <p className="text-sm text-gray-400">manager@example.com</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  className="w-full text-black hover:bg-orange-300"
                  variant="outline"
                >
                  Edit Profile
                </Button>
                <Button
                  className="w-full text-black hover:bg-orange-300"
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            className="w-full justify-start px-2"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Đăng xuất</span>
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-4">© 2025 TixClick</p>
      </SidebarFooter>
    </Sidebar>
  );
}
