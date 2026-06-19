import { LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router"
import { cn } from "../../lib/utils"

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
}

export default function NavItem({ icon: Icon, label, href }: NavItemProps) {
  const {pathname} = useLocation()
  const isActive = pathname === href

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg mx-2",
        isActive ? "bg-[#00B14F] text-white" : "text-gray-300 hover:bg-[#3A3A3A]",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}

