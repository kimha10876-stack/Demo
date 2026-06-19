import { motion } from "framer-motion";
import {
  Calendar,
  Camera,
  Check,
  Edit2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { toast, Toaster } from "sonner";
import Header from "../../components/Header/Header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { ROLE_ID } from "../../constants/constants";
import { Profile } from "../../interface/profile/Profile";
import profileApi from "../../services/profile/ProfileApi";
import { getCroppedImg } from "./imageUtils";

interface CroppedAreaPixels {
  x: number
  y: number
  width: number
  height: number
}

interface ProfileFormData extends Omit<Profile, "dob"> {
  dob: string
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({} as ProfileFormData)
  const [loading, setLoading] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null)

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getProfile()
      if (res.data.result) {
        setProfile(res.data.result)
      }
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error)
      toast.error("Không thể tải thông tin người dùng")
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      const formattedProfile: ProfileFormData = {
        ...profile,
        dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
      }
      setFormData(formattedProfile)
    }
  }, [profile])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  const uploadProfileImage = async (croppedImageBlob: Blob) => {
    try {
      setLoading(true)

      const avatarFile = new File([croppedImageBlob], "avatar.jpg", {
        type: "image/jpeg",
      })

      const response = await profileApi.updateProfile(profile as Profile, avatarFile as File)

      if (response.data.result) {
        location.reload()
      } else {
        toast.error(response.data?.message || "Cập nhật ảnh đại diện thất bại")
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast.error("Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.")
    } finally {
      setLoading(false)
      setImage(null)
    }
  }

  const handleCropComplete = async (_: unknown, croppedAreaPixels: CroppedAreaPixels) => {
    try {
      if (!image) return

      setLoading(true)
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0)

      if (croppedImage) {
        await uploadProfileImage(croppedImage)
      }
    } catch (error) {
      console.error("Error cropping image:", error)
      toast.error("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U"
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!profile?.accountId) {
        throw new Error("Missing account ID")
      }

      const updateData: Profile = {
        accountId: profile.accountId,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        userName: profile.userName, 
        phone: formData.phone || "",
        email: formData.email || "",
        dob: formData.dob ? new Date(formData.dob) : profile.dob,
        roleId: profile.roleId, 
        avatarURL: profile.avatarURL, 
        bankingName: formData.bankingName || "",
        bankingCode: formData.bankingCode || "",
        ownerCard: formData.ownerCard || "",
      }

      console.log("Sending update data:", JSON.stringify(updateData, null, 2)) 

      const response = await profileApi.updateProfile(updateData, null)

      console.log("API Response:", JSON.stringify(response.data, null, 2))

      if (response.data) {
        if (response.data.result) {
          setProfile(response.data.result)
          toast.success("Cập nhật thông tin thành công!")
        } else {
          setProfile({
            ...profile,
            ...updateData,
          })
          toast.success("Đã lưu thông tin!")
        }

        setTimeout(() => {
          fetchProfile()
        }, 500)

        setEditMode(false)
      } else {
        console.error("API response has no data:", response)
        toast.error("Cập nhật thất bại: Không nhận được phản hồi từ máy chủ")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const renderRoleName = (roleId: number | undefined): JSX.Element => {
    const role = ROLE_ID.find((r) => r.id === roleId)
    if (!role) {
      return <span className="text-gray-500 italic">Không rõ</span>
    }
    const roleColorMap: Record<string, string> = {
      ADMIN: "text-red-500",
      BUYER: "text-green-500",
      ORGANIZER: "text-pse-green",
      MANAGER: "text-purple-500",
    }

    return (
      <span className={`font-semibold text-sm ${roleColorMap[role?.roleName] || "text-black"}`}>{role.roleVi}</span>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#1E1E1E] text-gray-200 flex flex-col">
        <Header />
        <Toaster />
        <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#1A1A1A] rounded-2xl shadow-xl overflow-hidden border border-[#2A2A2A]">
                <div className="bg-gradient-to-r from-[#FF8A00]/20 to-[#FF8A00]/5 h-32 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="px-6 pb-6 -mt-16 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-[#1A1A1A] shadow-lg">
                      <AvatarImage src={profile?.avatarURL || ""} alt="Avatar" />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-[#FF8A00] to-[#FF9A20] text-white">
                        {getInitials(profile?.firstName, profile?.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute -right-2 bottom-0">
                      <label
                        htmlFor="avatar-upload"
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#FF8A00] text-white shadow-md cursor-pointer hover:bg-[#FF9A20] transition-colors"
                      >
                        <Camera className="h-5 w-5" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <h2 className="flex flex-col items-center mt-4 text-xl font-bold text-white">
                    {profile?.userName || "Người dùng"} {renderRoleName(profile?.roleId)}
                  </h2>

                  <div className="w-full mt-6 space-y-4">
                    <div className="flex items-center text-gray-400">
                      <User className="h-5 w-5 mr-3 text-[#FF8A00]" />
                      <span>
                        {profile?.lastName || ""} {profile?.firstName || ""}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-400">
                      <Phone className="h-5 w-5 mr-3 text-[#FF8A00]" />
                      <span>{profile?.phone || "Chưa cập nhật"}</span>
                    </div>

                    <div className="flex items-center text-gray-400">
                      <Mail className="h-5 w-5 mr-3 text-[#FF8A00]" />
                      <span>{profile?.email || "Chưa cập nhật"}</span>
                    </div>

                    {/* Display banking info in sidebar */}
                    {(profile?.bankingName || profile?.bankingCode) && (
                      <div className="pt-4 border-t border-[#3A3A3A]">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Thông tin ngân hàng</h5>
                        {profile?.bankingName && (
                          <div className="text-xs text-gray-400 mb-1">Ngân hàng: {profile.bankingName}</div>
                        )}
                        {profile?.bankingCode && (
                          <div className="text-xs text-gray-400 mb-1">STK: {profile.bankingCode}</div>
                        )}
                        {profile?.ownerCard && <div className="text-xs text-gray-400">Chủ TK: {profile.ownerCard}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsContent value="profile">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-[#2A2A2A]"
                  >
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white border-b border-[#3A3A3A] pb-2">
                          Thông tin cá nhân
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Họ</label>
                            <div className="relative">
                              <Input
                                name="lastName"
                                value={formData.lastName || ""}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                  !editMode ? "opacity-80" : ""
                                }`}
                              />
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Tên</label>
                            <div className="relative">
                              <Input
                                name="firstName"
                                value={formData.firstName || ""}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                  !editMode ? "opacity-80" : ""
                                }`}
                              />
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Số điện thoại</label>
                            <div className="relative">
                              <Input
                                name="phone"
                                type="tel"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                  !editMode ? "opacity-80" : ""
                                }`}
                              />
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Ngày sinh</label>
                            <div className="relative">
                              <Input
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                  !editMode ? "opacity-80" : ""
                                }`}
                              />
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-300">Email</label>
                          <div className="relative">
                            <Input
                              name="email"
                              type="email"
                              value={formData.email || ""}
                              onChange={handleInputChange}
                              disabled
                              className="pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] opacity-80"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white border-b border-[#3A3A3A] pb-2">
                          Thông tin ngân hàng
                        </h4>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-300">Tên ngân hàng</label>
                          <div className="relative">
                            <Input
                              name="bankingName"
                              value={formData.bankingName || ""}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              placeholder="Ví dụ: Vietcombank, BIDV, Techcombank..."
                              className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                !editMode ? "opacity-80" : ""
                              }`}
                            />
                            <svg
                              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Số tài khoản ngân hàng</label>
                            <div className="relative">
                              <Input
                                name="bankingCode"
                                value={formData.bankingCode || ""}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                placeholder="Nhập số tài khoản"
                                className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                  !editMode ? "opacity-80" : ""
                                }`}
                              />
                              <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Tên chủ tài khoản</label>
                            <div className="relative">
                              <Input
                                name="ownerCard"
                                value={formData.ownerCard || ""}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                placeholder="Tên chủ tài khoản ngân hàng"
                                className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                                  !editMode ? "opacity-80" : ""
                                }`}
                              />
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {editMode && (
                        <div className="pt-4 border-t border-[#3A3A3A]">
                          <Button
                            type="submit"
                            className="w-full bg-[#FF8A00] hover:bg-[#FF9A20] text-white transition-colors duration-300"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang lưu
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Check className="mr-2 h-4 w-4" />
                                Lưu thông tin
                              </div>
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                </TabsContent>

                <TabsContent value="security">
                  <div className="bg-[#1A1A1A] rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center border border-[#2A2A2A]">
                    <p className="text-gray-400">Tính năng bảo mật sẽ được cập nhật sau</p>
                  </div>
                </TabsContent>

                <TabsContent value="preferences">
                  <div className="bg-[#1A1A1A] rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center border border-[#2A2A2A]">
                    <p className="text-gray-400">Tính năng tùy chọn sẽ được cập nhật sau</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {image && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-[#2A2A2A]"
            >
              <div className="p-4 bg-gradient-to-r from-[#FF8A00] to-[#FF9A20] text-white">
                <h3 className="text-lg font-semibold text-center">Chỉnh sửa ảnh đại diện</h3>
              </div>

              <div className="p-6">
                <div className="relative w-full h-64 bg-[#2A2A2A] rounded-xl overflow-hidden mb-6">
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    cropShape="round"
                    showGrid={false}
                    onCropComplete={(_, croppedAreaPixels) => {
                      setCroppedAreaPixels(croppedAreaPixels)
                    }}
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-300">Phóng to</label>
                      <span className="text-sm text-gray-400">{zoom.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#2A2A2A] text-gray-200 hover:bg-[#2A2A2A] hover:text-white"
                      onClick={() => setImage(null)}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="flex-1 bg-[#FF8A00] hover:bg-[#FF9A20] text-white transition-colors duration-300"
                      onClick={() => handleCropComplete(null, croppedAreaPixels as CroppedAreaPixels)}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Đang xử lý
                        </div>
                      ) : (
                        "Lưu ảnh"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}
