import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  Loader2,
  MoreHorizontal,
  Search,
  Upload,
  XCircle
} from "lucide-react";
import * as pdfjs from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Input } from "../../../../components/ui/input";
import { Progress } from "../../../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { EventStatus } from "../../../../interface/EventInterface";
import type { EventResponse } from "../../../../interface/manager/EventType";
import managerApi from "../../../../services/manager/ManagerApi";
import { ManagerHeader } from "../ManagerHeader";

const customStyles = `
  .description-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .description-scrollbar::-webkit-scrollbar-track {
    background: #1E1E1E;
    border-radius: 4px;
  }
  
  .description-scrollbar::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 4px;
  }
  
  .description-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #444444;
  }
`

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponse[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [selectedEvent, setSelectedEvent] = useState<EventResponse>()
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [relatedContracts, setRelatedContracts] = useState<any[]>([])
  const [isRelatedContractsModalOpen, setIsRelatedContractsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const navigate = useNavigate()

  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const [isCancelEventModalOpen, setCancelEventModalOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New state for confirmation dialog
  const [isCancelConfirmModalOpen, setCancelConfirmModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const fetchEventList = async () => {
    try {
      const res = await managerApi.getAllEvent()
      console.log("Event List:", res.data.result)
      if (res.data.result && res.data.result.length > 0) {
        setEvents(res.data.result)
      }
    } catch (error) {
      console.error("Error fetching contract:", error)
      toast.error("Failed to fetch contract")
    }
  }

  const fetchRelatedContracts = async (eventId: number) => {
    console.log("eventId:", eventId)
    try {
      const res = await managerApi.getContractsByEventId(eventId)
      console.log("Related Contract Documents:", res.data.result)
      if (res.data.result && res.data.result.length > 0) {
        setRelatedContracts(res.data.result)
      } else {
        setRelatedContracts([])
      }
    } catch (error) {
      console.error("Error fetching related contract documents:", error)
      toast.error("Failed to fetch related contract documents")
      setRelatedContracts([])
    }
  }

  const handleApprove = async (status: string, eventId: number) => {
    try {
      console.log("Approving event:", status, "| eventId:", eventId)

      setIsApproving(true)

      const res: any = await managerApi.approveEvent(status, eventId)
      console.log("Approval response:", res)

      if (res.data && res.data.result === true) {
        toast.success("Event approved successfully")
        await fetchEventList()
        setIsEventModalOpen(false)
      } else {
        toast.error("Failed to approve event")
      }
    } catch (error) {
      console.error("Error approving event:", error)
      toast.error("Failed to approve event. Please try again.")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedEvent) return
    try {
      console.log("Rejecting event:", "REJECTED", "| eventId:", selectedEvent.eventId)

      setIsRejecting(true)

      const res = await managerApi.approveEvent("REJECTED", selectedEvent.eventId)
      console.log("Rejection response:", res)

      if (res.data && res.data.result === true) {
        toast.success("Event rejected successfully")
        await fetchEventList()
        setIsEventModalOpen(false)
      } else {
        toast.error("Failed to reject event")
      }
    } catch (error) {
      console.error("Error rejecting event:", error)
      toast.error("Failed to reject event. Please try again.")
    } finally {
      setIsRejecting(false)
    }
  }

  // New function to handle cancel event confirmation
  const handleCancelEventConfirm = async () => {
    if (!selectedEvent) return

    try {
      console.log("Cancelling event:", "CANCELLED", "| eventId:", selectedEvent.eventId)

      setIsCancelling(true)

      const res = await managerApi.approveEvent("CANCELLED", selectedEvent.eventId)
      console.log("Cancel response:", res)

      if (res.data && res.data.result === true) {
        toast.success("Sự kiện đã được hủy thành công")
        await fetchEventList()
        setCancelConfirmModalOpen(false)
        // Show the import/export modal after successful cancellation
        setCancelEventModalOpen(true)
      } else {
        toast.error("Không thể hủy sự kiện")
      }
    } catch (error) {
      console.error("Error cancelling event:", error)
      toast.error("Không thể hủy sự kiện. Vui lòng thử lại.")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleUploadContract = async (file: File) => {
    if (!file || !selectedEvent) return

    try {
      setIsUploading(true)
      setUploadProgress(0)

      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      })

      const res = await managerApi.uploadContractManager(file)
      console.log("Upload contract response:", res)

      if (res.data && res.data.result) {
        // Chỉ hiển thị một toast success
        toast.success("Hợp đồng đã được tải lên thành công")
        fetchEventList()
        if (selectedEvent) {
          await fetchRelatedContracts(selectedEvent.eventId)
        }
      } else {
        toast.error("Không thể tải lên hợp đồng")
        console.error("Upload failed with response:", res)
      }

      setTimeout(() => {
        setIsContractModalOpen(false)
        setFile(null)
        setUploadProgress(0)
        setIsUploading(false)
      }, 1000)
    } catch (error: any) {
      console.error("Error uploading contract:", error)

      if (error.response) {
        toast.error(`Lỗi tải lên: ${error.response.status}`, {
          description:
            (error.response.data?.message as string) ||
            "Server từ chối yêu cầu. Vui lòng kiểm tra định dạng và kích thước file.",
        })
      } else if (error.request) {
        toast.error("Lỗi tải lên", {
          description: "Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.",
        })
      } else {
        toast.error("Lỗi tải lên", {
          description: (error.message as string) || "Có lỗi xảy ra khi tải lên hợp đồng. Vui lòng thử lại.",
        })
      }

      setIsUploading(false)
    }
  }

  const navigateToEventPage = (eventId: number, contractCode: string) => {
    navigate(`/create-event?id=${eventId}&step=2&contractCode=${contractCode}`)
  }

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchEventList()
    }
    initUseEffect()
  }, [])

  // Handle file drop for contract upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  })

  // Upload contract file
  const uploadContract = async () => {
    if (!file || !selectedEvent) return

    // Check if a contract with the same name already exists
    const existingContract = relatedContracts.find((contract) => contract.fileName === file.name)

    if (existingContract) {
      toast.error("Hợp đồng với tên này đã tồn tại. Vui lòng chọn tên khác hoặc cập nhật hợp đồng hiện có.")
      return
    }

    await handleUploadContract(file)
  }

  useEffect(() => {
    let result = events.filter((event) =>
      Object.values(event).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
    )

    if (filterStatus !== "all") {
      result = result.filter((event) => event.status === filterStatus)
    }

    if (filterType !== "all") {
      result = result.filter((event) => event.typeEvent === filterType)
    }

    result.sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredEvents(result)
  }, [searchQuery, events, filterStatus, filterType, sortBy, sortOrder])

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-orange-900/70 text-orange-300 whitespace-nowrap">
            Đã xác nhận
          </span>
        )
      case EventStatus.PENDING:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-900/70 text-yellow-300 whitespace-nowrap">
            Đang xử lý
          </span>
        )
      case EventStatus.REJECTED:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-900/70 text-red-300 whitespace-nowrap">
            Đã từ chối
          </span>
        )
      case EventStatus.SCHEDULED:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-green-900/70 text-green-300 whitespace-nowrap">
            Đã lên lịch
          </span>
        )
      case EventStatus.CANCELLED:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-900/70 text-red-300 whitespace-nowrap">
            Đã hủy
          </span>
        )
      case EventStatus.ENDED:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-amber-900/70 text-white whitespace-nowrap">
            Đã kết thúc
          </span>
        )
      case EventStatus.COMPLETED:
        return (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-900/70 text-blue-300 whitespace-nowrap">
            Đã hủy
          </span>
        )

      default:
        return null
    }
  }

  const handleCreateContract = async () => {
    if (selectedEvent) {
      // Fetch related contracts first to ensure we have the latest data
      await fetchRelatedContracts(selectedEvent.eventId)
    }
    setIsContractModalOpen(true)
    setFile(null)
    setUploadProgress(0)
  }

  const handleDownloadContractTemplate = () => {
    const fileId = "1Lz0B_1FAtS7lwD-CgrJlPZY4wAHNK2uo"
    const url = `https://docs.google.com/document/d/${fileId}/export?format=docx`
    window.open(url, "_blank")
  }

  const handleViewRelatedContracts = async () => {
    if (!selectedEvent) return

    await fetchRelatedContracts(selectedEvent.eventId)
    setIsRelatedContractsModalOpen(true)
  }

  // Pagination functions
  const paginate = (items: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = paginate(filteredEvents, currentPage, itemsPerPage)

  // Add this before the return statement
  useEffect(() => {
    // Add custom scrollbar styles
    const styleElement = document.createElement("style")
    styleElement.textContent = customStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const handleExportCustomers = async () => {
    if (!selectedEvent) return

    try {
      toast.info("Đang xuất dữ liệu khách hàng...")
      await managerApi.exportRefund(selectedEvent.eventId)
      // The file download is handled in the exportRefund function
      toast.success("Xuất dữ liệu thành công")
    } catch (error) {
      console.error("Error exporting customer data:", error)
      toast.error("Không thể xuất dữ liệu khách hàng")
    }
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Check if file is Excel
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)")
        return
      }
      setImportFile(file)
    }
  }

  const handleImportSubmit = async () => {
    if (!importFile) {
      toast.error("Vui lòng chọn file để import")
      return
    }

    try {
      setIsImporting(true)
      setImportProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      const formData = new FormData()
      formData.append("file", importFile)

      const res = await managerApi.importRefund(formData)
      console.log("Import response:", res)

      clearInterval(progressInterval)
      setImportProgress(100)

      if (res.data && res.data.result) {
        toast.success("Import dữ liệu thành công")
        await fetchEventList()
      } else {
        toast.error("Import dữ liệu thất bại")
      }

      setTimeout(() => {
        setImportFile(null)
        setImportProgress(0)
        setIsImporting(false)
        setCancelEventModalOpen(false)
      }, 1000)
    } catch (error) {
      console.error("Error importing data:", error)
      toast.error("Không thể import dữ liệu")
      setIsImporting(false)
    }
  }

  return (
    <>
      <ManagerHeader heading="Sự kiện" text="Xem và quản lý các sự kiện" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              className="w-[300px] bg-[#2A2A2A] text-white"
              placeholder="Tìm kiếm sự kiện ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="PENDING">Đang xử lý</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#2A2A2A] text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  Xếp theo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white">
                <DropdownMenuItem onClick={() => setSortBy("date")}>Date</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableHead className="text-white">Tên sự kiện</TableHead>
                <TableHead className="text-white">Mã sự kiện</TableHead>
                <TableHead className="text-white">Tên địa điểm</TableHead>
                <TableHead className="text-white">Công ty</TableHead>
                <TableHead className="text-white">Trạng thái</TableHead>
                <TableHead className="text-white text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow key={event.eventId} className="border-[#333333] hover:bg-[#2A2A2A]">
                  <TableCell className="font-medium text-white">{event.eventName}</TableCell>
                  <TableCell className="text-white">{event.eventCode}</TableCell>
                  <TableCell className="text-white">{event.locationName}</TableCell>
                  <TableCell className="text-white">{event.companyName}</TableCell>
                  <TableCell className="text-white">{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEvent(event)
                            setIsEventModalOpen(true)
                          }}
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                        {event.status === "SCHEDULED" && (
                          <DropdownMenuItem onClick={() => navigateToEventPage(event.eventId, event.contractCode)}>
                            Dời lịch
                          </DropdownMenuItem>
                        )}
                        {event.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() => navigate(`/manager-dashboard/events/event-detail/${event.eventId}/manager`)}
                          >
                            Đi đến event này
                          </DropdownMenuItem>
                        )}
                        {/* <DropdownMenuItem onClick={handleViewRelatedContracts}>Xem hợp đồng</DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            setSelectedEvent(event)
                            if (event.status === "CANCELLED") {
                              setCancelEventModalOpen(true)
                            } else {
                              setCancelConfirmModalOpen(true)
                            }
                          }}
                        >
                          {event.status === "CANCELLED" ? "Quản lý hoàn tiền" : "Hủy sự kiện"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="mt-6 border-t border-[#333333] pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">
                  Hiển thị{" "}
                  <span className="font-medium text-white">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEvents.length)}
                  </span>{" "}
                  từ{" "}
                  <span className="font-medium text-white">
                    {Math.min(currentPage * itemsPerPage, filteredEvents.length)}
                  </span>{" "}
                  đến <span className="font-medium text-white">{filteredEvents.length}</span> sự kiện
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1) // Reset to first page when changing items per page
                  }}
                >
                  <SelectTrigger className="w-[110px] h-9 bg-[#2A2A2A] text-white border-[#333333]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 / trang</SelectItem>
                    <SelectItem value="10">10 / trang</SelectItem>
                    <SelectItem value="15">15 / trang</SelectItem>
                    <SelectItem value="20">20 / trang</SelectItem>
                  </SelectContent>
                </Select>

                <nav className="flex items-center space-x-1" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">First page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevrons-left"
                    >
                      <path d="m11 17-5-5 5-5" />
                      <path d="m18 17-5-5 5-5" />
                    </svg>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {totalPages <= 5 ? (
                    // If 5 or fewer pages, show all page numbers
                    Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === i + 1
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        <span>{i + 1}</span>
                      </Button>
                    ))
                  ) : (
                    // If more than 5 pages, show a smart subset
                    <>
                      {/* Always show first page */}
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === 1
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(1)}
                      >
                        <span>1</span>
                      </Button>

                      {/* Show ellipsis if current page is > 3 */}
                      {currentPage > 3 && (
                        <span className="mx-1 text-gray-400 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-horizontal"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </span>
                      )}

                      {/* Show page before current if not first or second page */}
                      {currentPage > 2 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <span>{currentPage - 1}</span>
                        </Button>
                      )}

                      {/* Show current page if not first or last */}
                      {currentPage !== 1 && currentPage !== totalPages && (
                        <Button
                          variant="default"
                          size="icon"
                          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 rounded-md"
                        >
                          <span>{currentPage}</span>
                        </Button>
                      )}

                      {/* Show page after current if not last or second-to-last */}
                      {currentPage < totalPages - 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <span>{currentPage + 1}</span>
                        </Button>
                      )}

                      {/* Show ellipsis if current page is < totalPages - 2 */}
                      {currentPage < totalPages - 2 && (
                        <span className="mx-1 text-gray-400 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-horizontal"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </span>
                      )}

                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === totalPages
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        <span>{totalPages}</span>
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Last page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevrons-right"
                    >
                      <path d="m6 17 5-5-5-5" />
                      <path d="m13 17 5-5-5-5" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-[#333333] pb-4">
            <DialogTitle className="text-xl font-bold">{selectedEvent?.eventName}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              {selectedEvent && getStatusBadge(selectedEvent.status)}
              <span className="text-gray-400">ID: {selectedEvent?.eventId}</span>
            </DialogDescription>
          </DialogHeader>
          <Toaster position="top-center" />

          {selectedEvent && (
            <div className="flex-1 overflow-y-auto py-4 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-[#1E1E1E] rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Công ty phụ trách</p>
                        <p className="font-medium">{selectedEvent.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Chủ sự kiện</p>
                        <p className="font-medium">{selectedEvent.organizerName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Địa chỉ
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Tên địa điểm</p>
                        <p className="font-medium">{selectedEvent.locationName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Địa chỉ</p>
                        <p className="font-medium">
                          {selectedEvent.ward + ", " + selectedEvent.district + ", " + selectedEvent.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="bg-[#1E1E1E] rounded-lg p-4 h-full">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Thông tin chi tiết
                    </h3>
                    <div className="overflow-y-auto max-h-[400px] pr-2 description-scrollbar">
                      {selectedEvent.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedEvent?.description,
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 italic">Không có thông tin mô tả cho sự kiện này.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-[#333333] pt-4 mt-4">
            <div className="flex gap-2 w-full justify-between">
              {selectedEvent?.status === "PENDING" ? (
                <Button
                  onClick={() => navigate(`event-detail/${selectedEvent?.eventId}/manager`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="mr-2 h-4 w-4" /> Đi đến event này
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    navigateToEventPage(selectedEvent?.eventId ?? 0, relatedContracts[0]?.contractCode ?? "")
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="mr-2 h-4 w-4" /> Dời lịch
                </Button>
              )}

              <div className="flex gap-2">
                {selectedEvent?.status === "PENDING" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove("CONFIRMED", selectedEvent?.eventId ?? 0)}
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
                          Confirming...
                        </span>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận
                        </>
                      )}
                    </Button>
                    {/* Update the Reject button to show loading state */}
                    <Button
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-700 text-white"
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
                          <XCircle className="mr-2 h-4 w-4" /> Từ chối
                        </>
                      )}
                    </Button>
                  </>
                )}
                {selectedEvent?.status === "CONFIRMED" && (
                  <>
                    <Button onClick={handleCreateContract} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FileText className="mr-2 h-4 w-4" /> Tải hợp đồng
                    </Button>
                    <Button
                      onClick={handleViewRelatedContracts}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <FileText className="mr-2 h-4 w-4" /> Xem hợp đồng
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <Toaster position="top-center" />
        <DialogContent className="bg-[#2A2A2A] text-white max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center w-full">
              <div className="text-left">
                <DialogTitle>Tải hợp đồng</DialogTitle>
                <DialogDescription>Đăng tải hợp đồng cho sự kiện: {selectedEvent?.eventName}</DialogDescription>
              </div>
              <Button onClick={handleDownloadContractTemplate}>Tải mẫu hợp đồng</Button>
            </div>
          </DialogHeader>

          <div className="py-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Kéo và thả hợp đồng của bạn</h3>
                <p className="text-sm text-muted-foreground mb-4">Chỉ hỗ trợ tệp PDF (tối đa 10MB)</p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mx-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = ".pdf,.doc,.docx"
                    input.onchange = (event) => {
                      const target = event.target as HTMLInputElement
                      if (target && target.files && target.files[0]) {
                        setFile(target.files[0])
                      }
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn tệp
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 p-4 bg-[#1E1E1E] rounded-lg">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={() => {
                      setFile(null)
                      setUploadProgress(0)
                    }}
                    disabled={isUploading}
                  >
                    Hủy bỏ
                  </Button>
                  <Button onClick={uploadContract} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>Upload Contract</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Related Contracts Dialog */}
      <Dialog open={isRelatedContractsModalOpen} onOpenChange={setIsRelatedContractsModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-[#333333] pb-4">
            <DialogTitle>Hợp đồng</DialogTitle>
            <DialogDescription>Hợp đồng liên quan đên sự kiện: {selectedEvent?.eventName}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden py-4">
            {relatedContracts.length > 0 ? (
              <div className="overflow-auto max-h-[50vh] pr-2 description-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                      <TableHead className="text-white sticky top-0 bg-[#2A2A2A] z-10">Tên File</TableHead>
                      <TableHead className="text-white sticky top-0 bg-[#2A2A2A] z-10">Loại File</TableHead>
                      <TableHead className="text-white sticky top-0 bg-[#2A2A2A] z-10">Trạng thái</TableHead>
                      <TableHead className="text-white sticky top-0 bg-[#2A2A2A] z-10">Ngày tải lên</TableHead>
                      <TableHead className="text-white text-right sticky top-0 bg-[#2A2A2A] z-10">Tác vụ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedContracts.map((document) => (
                      <TableRow key={document.contractDocumentId} className="border-[#333333] hover:bg-[#2A2A2A]">
                        <TableCell className="font-medium text-white">{document.fileName}</TableCell>
                        <TableCell className="text-white">{document.fileType}</TableCell>
                        <TableCell className="text-white">{document.status}</TableCell>
                        <TableCell className="text-white">
                          {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white">
                              <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
                              {document.fileURL && (
                                <DropdownMenuItem onClick={() => window.open(document.fileURL, "_blank")}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem tài liệu
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => window.open(document.fileURL, "_blank")}>
                                <Download className="mr-2 h-4 w-4" />
                                Tải về máy
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có hợp đồng nào được tải lên</h3>
                <p className="text-sm text-gray-400 mb-4">Chưa có hợp đồng nào được tải lên cho sự kiện này.</p>
                {selectedEvent?.status === "APPROVED" && (
                  <Button
                    onClick={() => {
                      setIsRelatedContractsModalOpen(false)
                      handleCreateContract()
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" /> Tải hợp đồng
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-[#333333] pt-4 mt-auto">
            <div className="flex justify-between w-full">
              <Button
                onClick={handleCreateContract}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={selectedEvent?.status !== "APPROVED"}
              >
                <FileText className="mr-2 h-4 w-4" /> Tải hợp đồng
              </Button>
              <Button onClick={() => setIsRelatedContractsModalOpen(false)}>Đóng</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Event Confirmation Dialog */}
      <Dialog open={isCancelConfirmModalOpen} onOpenChange={setCancelConfirmModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="h-5 w-5" />
              Xác nhận hủy sự kiện
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Bạn có chắc chắn muốn hủy sự kiện{" "}
              <span className="font-semibold text-white">"{selectedEvent?.eventName}"</span> không?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="text-red-300 font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="text-red-200 space-y-1 text-xs">
                    <li>• Sự kiện sẽ được đánh dấu là đã hủy</li>
                    <li>• Bạn sẽ có thể xuất danh sách khách hàng để hoàn tiền</li>
                    <li>• Hành động này không thể hoàn tác</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelConfirmModalOpen(false)}
              disabled={isCancelling}
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleCancelEventConfirm}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Xác nhận hủy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Event Dialog (Import/Export) */}
      <Dialog open={isCancelEventModalOpen} onOpenChange={setCancelEventModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy sự kiện</DialogTitle>
            <DialogDescription>Quản lý hoàn tiền cho sự kiện: {selectedEvent?.eventName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-4">
              <Button onClick={handleExportCustomers} className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Export danh sách khách hàng
              </Button>

              <div className="border border-dashed border-gray-500 rounded-md p-4">
                <p className="text-sm text-gray-400 mb-2">Import file Excel</p>

                {!importFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportFile}
                      accept=".xlsx,.xls"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-black hover:text-white hover:bg-black"
                    >
                      <Upload className="mr-2 h-4 w-4 hover:text-white hover:bg-black" />
                      Chọn file Excel
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-[#1E1E1E] rounded-lg">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 truncate">
                        <p className="font-medium truncate">{importFile.name}</p>
                        <p className="text-xs text-gray-400">{(importFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setImportFile(null)}
                        className="text-gray-400 hover:text-white"
                        disabled={isImporting}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>

                    {isImporting && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{importProgress}%</span>
                        </div>
                        <Progress value={importProgress} className="h-1" />
                      </div>
                    )}

                    <Button
                      onClick={handleImportSubmit}
                      disabled={isImporting}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Import
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelEventModalOpen(false)} className="text-black">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
