import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Profile } from "../../../interface/profile/Profile";
import profileApi from "../../../services/profile/ProfileApi";

export function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile | null>(null);
    

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profile updated", {
      description: "Your profile information has been updated successfully.",
    })
  }

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getAdminProfile();
      if (res.data.result) {
        setProfile(res.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
          <AvatarFallback className="text-2xl">AD</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" type="button" className="mt-2">
          Change Avatar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={profile?.firstName}
            onChange={handleChange}
            className="bg-[#3A3A3A] border-[#4A4A4A]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile?.email}
            onChange={handleChange}
            className="bg-[#3A3A3A] border-[#4A4A4A]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={profile?.phone}
            onChange={handleChange}
            className="bg-[#3A3A3A] border-[#4A4A4A]"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Save Changes
      </Button>
    </form>
  )
}

