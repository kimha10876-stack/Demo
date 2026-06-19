import { BarChartIcon, Calendar, DollarSign, LogOut, Settings, Ticket, User, Users, X } from "lucide-react"
import { useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { toast } from "sonner"
import Logo from "../../assets/Logo.png"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { SidebarProvider } from "../../components/ui/sidebar"
import NavItem from "./NavItem"

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigate = useNavigate()

    const handleLogOut = () => {
      localStorage.removeItem("userRole")
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userName")
      toast.success("Logged out", {
        description: "You have been successfully logged out.",
        duration: 5000,
      })
  
      setTimeout(() => {
        navigate("/superLogin")
      }, 1000)
    }

    const handleOpenProfile = () => {
    }

    return (
      <div className="flex h-screen bg-[#1E1E1E] text-white">
        
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-[#2A2A2A] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between p-4">
            <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-12 w-13" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="mt-8">
            <NavItem icon={BarChartIcon} label="Overview" href="/proAdmin" />
            <NavItem icon={Calendar} label="Events" href="/proAdmin/events" />
            <NavItem icon={Ticket} label="Companies" href="/proAdmin/companies" />
            <NavItem icon={Users} label="Manager Management" href="/proAdmin/managerManagement" />
            <NavItem icon={DollarSign} label="Revenue" href="/proAdmin/revenues" />
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@gmail.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
  
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          
         <SidebarProvider>
          <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <Outlet/>
          </div>
          </SidebarProvider>
        </main>
      </div>
    )
  }

  