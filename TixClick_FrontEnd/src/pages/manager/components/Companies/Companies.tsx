import { Building2, Check, Eye, FileText, Mail, MapPin, MoreHorizontal, Phone, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Company } from "../../../../interface/manager/Company"
import managerApi from "../../../../services/manager/ManagerApi"
import { ManagerHeader } from "../ManagerHeader"

export default function CompanyApprovalsPage() {
  const [companies, setCompanies] = useState<Company[]>([])

  const [selectedCompany, setSelectedCompany] = useState<Company>()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilter, setSearchFilter] = useState<"all" | "name" | "tax" | "email" | "status">("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)

  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const [activeReviewTab, setActiveReviewTab] = useState("company-info")

  const handleReviewCompany = (company: any) => {
    setSelectedCompany(company)
    setIsReviewModalOpen(true)
  }

  const handleApproveCompany = async (status: string, companyVerificationId: number) => {
    try {
      setIsApproving(true)

      console.log("status:", status, "|  companyVerificationId:", companyVerificationId)

      const response = await managerApi.approveCompany(status, companyVerificationId)
      console.log("Approved successfully:", response)

      await fetchCompaniesList()

      toast.success("Công ty đã được duyệt", {
        description: `${selectedCompany?.companyName} đã được xets duyệt. Sẽ sớm có thông báo qua email.`,
      })
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error("Approval failed:", error)
      toast.error("Công ty không được duyệt", {
        description: "Có lỗi xảy ra trong quá trình duyệt công ty. Vui lòng thử lại.",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectCompany = async () => {
    try {
      setIsRejecting(true)

      await managerApi.approveCompany("REJECTED", selectedCompany?.companyVerificationId ?? 0)

      await fetchCompaniesList()

      toast.success("Công ty đã bị từ chối", {
        description: `${selectedCompany?.companyName} đã bị từ chối. Sẽ sớm có thông báo qua email.`,
      })
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error("❌ Rejection failed:", error)
      toast.error("Từ chối công ty thất bại ", {
        description: "Có lỗi xảy ra trong quá trình từ chối công ty. Vui lòng thử lại.",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const handleViewDocuments = (company: Company) => {
    setSelectedCompany(company)
    setIsDocumentModalOpen(true)
  }

  const fetchCompaniesList = async () => {
    try {
      const res: any = await managerApi.getAllCompany()
      console.log("Company List Huy:", res)
      if (res.data.result && res.data.result.length > 0) {
        setCompanies(res.data.result)
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast.error("Failed to fetch companies")
    }
  }

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchCompaniesList()
    }
    initUseEffect()
  }, [])

  const handleSearch = () => {
    setIsSearching(true)

    // Add to search history if not empty and not already in history
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory((prev) => [searchTerm, ...prev].slice(0, 5))
    }

    setTimeout(() => {
      setIsSearching(false)
    }, 500)
  }

  const handleSelectSearchHistory = (term: string) => {
    setSearchTerm(term)
    setShowSearchHistory(false)
    handleSearch()
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchFilter("all")
    setStatusFilter("all")
  }

  const filteredCompanies = companies.filter((company) => {
    // First filter by status if selected
    if (statusFilter !== "all" && company.status !== statusFilter) {
      return false
    }

    // If search term is empty, return all companies that passed the status filter
    if (!searchTerm.trim()) {
      return true
    }

    const term = searchTerm.toLowerCase()

    // Then filter by search term according to the selected filter
    switch (searchFilter) {
      case "name":
        return company.companyName?.toLowerCase().includes(term)
      case "tax":
        return company.codeTax?.toLowerCase().includes(term)
      case "email":
        return company.customAccount.email?.toLowerCase().includes(term)
      case "status":
        return company.status?.toLowerCase().includes(term)
      case "all":
      default:
        return (
          company.companyName?.toLowerCase().includes(term) ||
          company.codeTax?.toLowerCase().includes(term) ||
          company.customAccount.email?.toLowerCase().includes(term) ||
          company.status?.toLowerCase().includes(term)
        )
    }
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <ManagerHeader heading="Xét duyệt công ty" text="Xem và xét duyệt các tài khoẻn công ty" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="relative">
                <Input
                  className="w-full bg-[#2A2A2A] text-white pl-10 pr-10"
                  placeholder="Tìm kiếm công ty ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-white"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search history dropdown */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-[#2A2A2A] border border-[#333333] rounded-md shadow-lg">
                  <div className="p-2 text-xs text-gray-400">Tìm kiếm gần đây</div>
                  {searchHistory.map((term, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-[#333333] cursor-pointer text-white flex items-center"
                      onClick={() => handleSelectSearchHistory(term)}
                    >
                      <Search className="h-3 w-3 mr-2 text-gray-400" />
                      {term}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
          

            

              <Button
                variant="outline"
                className="bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tìm...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Tìm kiếm
                  </div>
                )}
              </Button>

              {(searchTerm || statusFilter !== "all" || searchFilter !== "all") && (
                <Button variant="ghost" className="text-white hover:bg-[#333333]" onClick={clearSearch}>
                  <X className="mr-2 h-4 w-4" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Active filters */}
          {(searchTerm || statusFilter !== "all" || searchFilter !== "all") && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-400">Bộ lọc đang áp dụng:</span>
              {searchTerm && (
                <Badge className="bg-[#333333] text-white hover:bg-[#444444]">
                  Từ khóa: {searchTerm}
                  <button className="ml-1" onClick={() => setSearchTerm("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {searchFilter !== "all" && (
                <Badge className="bg-[#333333] text-white hover:bg-[#444444]">
                  Tìm theo:{" "}
                  {searchFilter === "name"
                    ? "Tên công ty"
                    : searchFilter === "tax"
                      ? "Mã số thuế"
                      : searchFilter === "email"
                        ? "Email"
                        : "Trạng thái"}
                  <button className="ml-1" onClick={() => setSearchFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge className="bg-[#333333] text-white hover:bg-[#444444]">
                  Trạng thái: {statusFilter}
                  <button className="ml-1" onClick={() => setStatusFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-white text-sm">
            Tổng: <span className="font-semibold">{filteredCompanies.length}</span> công ty
            {filteredCompanies.length !== companies.length && (
              <span className="text-gray-400"> (trong tổng số {companies.length})</span>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#333333] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#252525] hover:bg-[#2A2A2A]">
                <TableHead className="text-white w-12 text-center">Số</TableHead>
                <TableHead className="text-white">Tên công ty</TableHead>
                <TableHead className="text-white">Mã số thuế</TableHead>
                <TableHead className="text-white">Người đại diện</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Trạng thái</TableHead>
                <TableHead className="text-white">Tài liệu</TableHead>
                <TableHead className="text-white text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <TableRow
                    key={company.companyId}
                    className={`border-[#333333] hover:bg-[#2A2A2A] ${index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#222222]"}`}
                  >
                    <TableCell className="font-medium text-white text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {company.logoURL ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-[#333333] flex items-center justify-center">
                            <img
                              src={company.logoURL || "/placeholder.svg"}
                              alt={company.companyName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#333333] flex items-center justify-center">
                            <Building2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span>{company.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{company.codeTax}</TableCell>
                    <TableCell className="text-white">
                      {company.customAccount.lastName} {company.customAccount.firstName}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="max-w-[180px] truncate" title={company.email}>
                        {company.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          company.status === "ACTIVE"
                            ? "bg-green-900 text-green-300"
                            : company.status === "PENDING"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                        }`}
                      >
                        {company.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">
                      {company.companyDocument && company.companyDocument.length > 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-black border-[#444444] hover:bg-[#333333]"
                          onClick={() => handleViewDocuments(company)}
                        >
                          <FileText className="h-4 w-4" />
                          {company.companyDocument.length} tài liệu
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">Không có tài liệu nào</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#333333]">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white border-[#444444]">
                          <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => handleReviewCompany(company)}
                            className="hover:bg-[#333333] cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#444444]" />
                          {company.companyDocument && company.companyDocument.length > 0 && (
                            <DropdownMenuItem
                              onSelect={() => handleViewDocuments(company)}
                              className="hover:bg-[#333333] cursor-pointer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Xem tài liệu
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-white">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-400">Không tìm thấy công ty nào</p>
                      {(searchTerm || statusFilter !== "all" || searchFilter !== "all") && (
                        <Button variant="link" className="text-[#00B14F] mt-2" onClick={clearSearch}>
                          Xóa bộ lọc và hiển thị tất cả
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Bảng detail  */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {selectedCompany?.logoURL && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#333333] flex items-center justify-center">
                  <img
                    src={selectedCompany.logoURL || "/placeholder.svg"}
                    alt={selectedCompany?.companyName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {selectedCompany?.companyName}
              <span className="ml-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCompany?.status === "ACTIVE"
                      ? "bg-green-900 text-green-300"
                      : selectedCompany?.status === "PENDING"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                  }`}
                >
                  {selectedCompany?.status}
                </span>
              </span>
            </DialogTitle>
            <DialogDescription>
              Xem xét thông tin công ty và quyết định xem có nên phê duyệt hay từ chối đơn đăng ký hay không.
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <Tabs
              defaultValue="company-info"
              className="w-full"
              onValueChange={setActiveReviewTab}
              value={activeReviewTab}
            >
              <TabsList className="grid grid-cols-2 mb-6 bg-[#333333]">
                <TabsTrigger value="company-info" className="data-[state=active]:bg-[#00B14F]">
                  Thông tin công ty
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-[#00B14F]">
                  Tài liệu ({selectedCompany.companyDocument?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="company-info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Building2 className="mr-2 h-5 w-5 text-[#00B14F]" />
                      Tổng quan công ty
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Tên công ty:</label>
                        <div className="text-base font-semibold">{selectedCompany.companyName}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Mã số thuế:</label>
                        <div className="text-base">{selectedCompany.codeTax}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Email công ty:</label>
                        <div className="text-base">{selectedCompany.email}</div>
                      </div>

                     

                      <div>
                        <label className="text-sm font-medium text-gray-400">CCCD:</label>
                        <div className="text-base">{selectedCompany.nationalId}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-[#00B14F]" />
                      Địa chỉ & Liên hệ
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Địa chỉ</label>
                        <div className="text-base">{selectedCompany.address}</div>
                      </div>

                      <div className="pt-2 border-t border-[#333333] mt-3">
                        <label className="text-sm font-medium text-gray-400">Người Contact</label>
                        <div className="text-base font-semibold">
                          {selectedCompany.customAccount.lastName} {selectedCompany.customAccount.firstName}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#00B14F]" />
                        <div className="text-base">{selectedCompany.customAccount.email}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#00B14F]" />
                        <div className="text-base">{selectedCompany.customAccount.phoneNumber || "Not provided"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4">Thông tin ngân hàng</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Tên ngân hàng</label>
                        <div className="text-base">{selectedCompany.bankingName}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Số tài khoản</label>
                        <div className="text-base font-mono">{selectedCompany.bankingCode}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4">Mô tả công ty</h3>

                    <div>
                      <label className="text-sm font-medium text-gray-400">Về công ty</label>
                      <div className="text-base mt-1 whitespace-pre-wrap">{selectedCompany.description}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                {selectedCompany.companyDocument && selectedCompany.companyDocument.length > 0 ? (
                  <div className="border border-[#333333] rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#252525] hover:bg-[#2A2A2A]">
                          <TableHead className="text-white w-12 text-center">#</TableHead>
                          <TableHead className="text-white">Tên tài liệu</TableHead>
                          <TableHead className="text-white">Loại</TableHead>
                          <TableHead className="text-white">Ngày </TableHead>
                          <TableHead className="text-white text-right">Tác vụ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCompany.companyDocument.map((doc, index) => (
                          <TableRow
                            key={doc.companyDocumentId}
                            className={`border-[#333333] hover:bg-[#2A2A2A] ${
                              index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#222222]"
                            }`}
                          >
                            <TableCell className="font-medium text-white text-center">{index + 1}</TableCell>
                            <TableCell className="font-medium text-white">{doc.fileName}</TableCell>
                            <TableCell className="text-white">{doc.fileType}</TableCell>
                            <TableCell className="text-white">{formatDate(doc.uploadDate)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {doc.fileURL && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(doc.fileURL, "_blank")}
                                    className="border-[#444444] hover:bg-[#333333]"
                                  >
                                    <Eye className="h-4 w-4 text-black" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-md border-[#444444]">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Không tìm thấy tài liệu nào</h3>
                    <p className="text-gray-400">This company hasn't uploaded any documents yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex justify-between mt-6 pt-4 border-t border-[#333333]">
            {selectedCompany && selectedCompany.status === "PENDING" ? (
              <>
                <Button
                  onClick={handleRejectCompany}
                  className="bg-red-500 text-white hover:bg-red-600"
                  disabled={isRejecting || isApproving}
                >
                  {isRejecting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Rejecting...
                    </span>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" /> Reject Company
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleApproveCompany("APPROVED", selectedCompany?.companyVerificationId ?? 0)}
                  className="bg-[#00B14F] text-white"
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Approving...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Approve Company
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsReviewModalOpen(false)} className="ml-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Company Documents</DialogTitle>
            <DialogDescription>View company documents</DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-4">
              {selectedCompany.companyDocument && selectedCompany.companyDocument.length > 0 ? (
                <div className="border border-[#333333] rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#252525] hover:bg-[#2A2A2A]">
                        <TableHead className="text-white w-12 text-center">No</TableHead>
                        <TableHead className="text-white">Document Name</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Upload Date</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany.companyDocument.map((doc, index) => (
                        <TableRow
                          key={doc.companyDocumentId}
                          className={`border-[#333333] hover:bg-[#2A2A2A] ${index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#222222]"}`}
                        >
                          <TableCell className="font-medium text-white text-center">{index + 1}</TableCell>
                          <TableCell className="font-medium text-white">{doc.fileName}</TableCell>
                          <TableCell className="text-white">{doc.fileType}</TableCell>
                          <TableCell className="text-white">{formatDate(doc.uploadDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {doc.fileURL && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(doc.fileURL, "_blank")}
                                  className="border-[#444444] text-black hover:bg-[#333333]"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md border-[#444444]">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No Documents Found</h3>
                  <p className="text-gray-400">This company doesn't have any documents yet.</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDocumentModalOpen(false)}
              className="text-black border-[#444444] hover:bg-[#333333]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
