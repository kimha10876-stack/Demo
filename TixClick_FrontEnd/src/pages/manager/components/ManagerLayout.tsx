import type { Metadata } from "next"
import { Outlet } from "react-router"
import { SidebarProvider } from "../../../components/ui/sidebar"
import { DashboardSidebar } from "./ManagerSidebar"

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description: "Manage companies, events, contracts, and payments",
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="flex flex-col">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}