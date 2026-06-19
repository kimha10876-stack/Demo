import { Ticket, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import AlterAvatar from "../../../assets/Vie-flag.png";
import { Profile } from "../../../interface/profile/Profile";
import { cn } from "../../../lib/utils";
import profileApi from "../../../services/profile/ProfileApi";

const menuItems = [
  {
    icon: User,
    label: "Thông tin tài khoản",
    href: "/profileForm",
  },
  {
    icon: Ticket,
    label: "Vé đã mua",
    href: "/ticketManagement",
  },
];

export function SidebarProfile() {
  const { pathname } = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getProfile();
      if (res.data.result) {
        setProfile(res.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="w-64 min-h-[calc(100vh-64px)] bg-[#1E1E1E] p-6 border-r border-gray-800">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={profile?.avatarURL || AlterAvatar}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div>
          <div className="text-sm text-gray-400">Tài khoản của</div>
          <div className="text-white font-medium">
            {profile?.firstName} {profile?.lastName}
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10",
                isActive && "bg-white/10 text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
