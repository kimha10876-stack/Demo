import { motion } from "framer-motion";
import { NavLink } from "react-router";
import { useContext } from "react";
import { SidebarContext } from "../../../contexts/SideBarContext";
import { cn } from "../../../lib/utils";
import { ChevronRight, Handshake, ListChecks } from "lucide-react";

export function TaskSidebar() {
  const context = useContext(SidebarContext);

  const navigation = [
    { name: "Công việc của tôi", href: "/my-task", icon: ListChecks },
    {
      name: "Hợp tác",
      href: "/my-task/cooperations",
      icon: Handshake,
    },
  ];

  return (
    <div className="fixed left-0 top-16 bg-[#1e1e1e]">
      <button
        onClick={context?.toggleSidebar}
        className="absolute -right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8A00] text-white shadow-lg"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            context?.isCollapsed ? "" : "rotate-180"
          )}
        />
      </button>

      <motion.nav
        initial={false}
        animate={{ width: context?.isCollapsed ? "80px" : "240px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-screen flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] border-r border-[#2A2A2A]"
      >
        <div className="flex-1 px-3 py-6">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                end
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group relative flex h-12 items-center overflow-hidden rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-[#2A2A2A] text-white"
                      : "text-gray-400 hover:bg-[#2A2A2A]/50 hover:text-white",
                    context?.isCollapsed ? "justify-center" : "px-4"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#FF8A00]"></div>
                    )}
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                        isActive
                          ? "bg-[#FF8A00]/10 text-[#FF8A00]"
                          : "text-gray-400 group-hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    {!context?.isCollapsed && (
                      <span className="ml-3 text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
