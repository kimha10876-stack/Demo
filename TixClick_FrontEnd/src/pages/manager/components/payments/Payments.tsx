import { ChevronDown, ChevronRight, Download, FileText, MoreHorizontal, Search, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"
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
import { Progress } from "../../../../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Textarea } from "../../../../components/ui/textarea"
import { AccountGroup, ContractDTO, ContractPaymentDTO, ContractPaymentGroup } from "../../../../interface/manager/Payment"
import managerApi from "../../../../services/manager/ManagerApi"
import { ManagerHeader } from "../ManagerHeader"

export default function PaymentsPage() {
  const [paymentGroups, setPaymentGroups] = useState<AccountGroup[]>([])
  const [selectedPayment, setSelectedPayment] = useState<ContractPaymentDTO | null>(null)
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchPaymentList = async () => {
    try {
      setIsLoading(true)
      const res = await managerApi.getAllPayment()
      console.log("Contract Payment List:", res)

      if (res.data.result && res.data.result.length > 0) {
        const groupedByAccount: { [key: number]: AccountGroup } = {}

        res.data.result.forEach((item: ContractPaymentGroup) => {
          const accountId = item.contractDTO.accountId

          if (!groupedByAccount[accountId]) {
            groupedByAccount[accountId] = {
              accountId,
              payments: [],
              contractInfo: item.contractDTO,
              isExpanded: false,
            }
          }

          if (item.contractPaymentDTOList && item.contractPaymentDTOList.length > 0) {
            groupedByAccount[accountId].payments.push(...item.contractPaymentDTOList)
          }
        })

        const groups = Object.values(groupedByAccount)
        setPaymentGroups(groups)
      } else {
        setPaymentGroups([])
      }
    } catch (error) {
      console.error("Error fetching contract payments:", error)
      toast.error("Failed to fetch contract payments")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentList()
  }, [])

  const toggleGroupExpansion = (accountId: number) => {
    setPaymentGroups((prevGroups) =>
      prevGroups.map((group) => (group.accountId === accountId ? { ...group, isExpanded: !group.isExpanded } : group)),
    )
  }

  const handleSendReminder = () => {
    if (selectedPayment) {
      console.log(`Sending reminder for payment ${selectedPayment.contractPaymentId}: ${reminderMessage}`)
      toast.success("Reminder Sent", {
        description: `A payment reminder has been sent for contract payment #${selectedPayment.contractPaymentId}.`,
      })
      setIsReminderModalOpen(false)
      setReminderMessage("")
    }
  }

  const handleDownloadInvoice = (payment: ContractPaymentDTO) => {
    console.log(`Downloading invoice for payment #${payment.contractPaymentId}`)
    toast.success("Invoice Downloaded", {
      description: `Invoice for payment #${payment.contractPaymentId} has been downloaded.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
      case "Paid":
        return <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-500">Paid</span>
      case "PARTIAL":
      case "Partial":
        return <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-500">Partial</span>
      case "PENDING":
      case "Pending":
        return <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-500">Pending</span>
      case "OVERDUE":
      case "Overdue":
        return <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500">Overdue</span>
      default:
        return <span className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-500">{status}</span>
    }
  }

  const filteredGroups = paymentGroups
    .map((group) => {
      const filteredPayments = group.payments.filter((payment) => {
        const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase()
        const matchesSearch =
          searchQuery === "" ||
          payment.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (payment.bankName && payment.bankName.toLowerCase().includes(searchQuery.toLowerCase()))

        return matchesStatus && matchesSearch
      })

      return {
        ...group,
        payments: filteredPayments,
      }
    })
    .filter((group) => group.payments.length > 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <ManagerHeader heading="Payments" text="View all contract payments" />

      <main className="p-6">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Search className="text-[#FF8A00]" />
                <Input
                  className="w-[300px] bg-[#2A2A2A] border-[#3A3A3A] text-white focus:border-[#FF8A00] focus:ring-[#FF8A00]/10"
                  placeholder="Search by payment method or bank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border border-[#2A2A2A] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#2A2A2A] hover:bg-[#333333]">
                    <TableHead className="text-white w-[50px]"></TableHead>
                    <TableHead className="text-white">Contract Code</TableHead>
                    <TableHead className="text-white">Contract Name</TableHead>
                    <TableHead className="text-white">Total Amount</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                    <TableHead className="text-white text-right"></TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                        Loading payments...
                      </TableCell>
                    </TableRow>
                  ) : filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <>
                        <TableRow
                          key={group.accountId}
                          className="border-[#333333] hover:bg-[#2A2A2A] cursor-pointer"
                          onClick={() => toggleGroupExpansion(group.accountId)}
                        >
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-[#FF8A00]">
                              {group.isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium text-white">{group.contractInfo.contractCode}</TableCell>
                          <TableCell className="text-white">{group.contractInfo.contractName}</TableCell>
                          <TableCell className="text-white">{formatCurrency(group.contractInfo.totalAmount)}</TableCell>
                          <TableCell className="text-white">{getStatusBadge(group.contractInfo.status)}</TableCell>
                          <TableCell className="text-right text-white">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer hover:bg-[#333333] ">
                                  View account details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-[#333333] ]">
                                  Export payment history
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="text-white"></TableCell>

                        </TableRow>

                        {group.isExpanded &&
                          group.payments.map((payment) => (
                            <TableRow
                              key={payment.contractPaymentId}
                              className="border-[#333333] bg-[#1E1E1E] hover:bg-[#2A2A2A]"
                            >
                              <TableCell></TableCell>
                              <TableCell className="pl-10 flex items-center">
                                <FileText className="h-4 w-4 text-[#FF8A00] mr-2" />
                                <span className="text-gray-300">{payment.note}</span>
                              </TableCell>
                              <TableCell className="text-gray-300">{payment.paymentDate}</TableCell>
                              <TableCell className="text-gray-300">{payment.paymentMethod}</TableCell>
                              <TableCell className="text-gray-300">{formatCurrency(payment.paymentAmount)}</TableCell>
                              <TableCell className="text-gray-300">
                                {payment.paymentDate
                                  ? new Date(payment.paymentDate).toLocaleDateString()
                                  : "Not paid yet"}
                                <div className="mt-1">{getStatusBadge(payment.status)}</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                      className="cursor-pointer hover:bg-[#333333] focus:bg-[#333333]"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPayment(payment)
                                        setSelectedContract(group.contractInfo)
                                        setIsPaymentModalOpen(true)
                                      }}
                                    >
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer hover:bg-[#333333] focus:bg-[#333333]"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPayment(payment)
                                        setSelectedContract(group.contractInfo)
                                        setIsReminderModalOpen(true)
                                      }}
                                    >
                                      Send payment reminder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer hover:bg-[#333333] focus:bg-[#333333]"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDownloadInvoice(payment)
                                      }}
                                    >
                                      Download invoice
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                                    <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-[#333333] focus:bg-[#333333]">
                                      Mark as void
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                        No payments found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 text-[#FF8A00] mr-2" />
              Payment Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View and manage the details of the selected payment.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && selectedContract && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#2A2A2A]">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-[#333333] data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="contract"
                  className="data-[state=active]:bg-[#333333] data-[state=active]:text-white"
                >
                  Contract Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#2A2A2A] rounded-md">
                  <div className="space-y-2">
                    <p className="text-gray-400">Payment ID</p>
                    <p className="font-medium">{selectedPayment.contractPaymentId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Payment Method</p>
                    <p className="font-medium">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Amount</p>
                    <p className="font-medium text-[#FF8A00]">{formatCurrency(selectedPayment.paymentAmount)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Payment Date</p>
                    <p className="font-medium">
                      {selectedPayment.paymentDate
                        ? new Date(selectedPayment.paymentDate).toLocaleDateString()
                        : "Not paid yet"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Status</p>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Bank Name</p>
                    <p className="font-medium">{selectedPayment.bankName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Account Number</p>
                    <p className="font-medium">{selectedPayment.accountNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Note</p>
                    <p className="font-medium">{selectedPayment.note}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contract" className="mt-4">
                <div className="p-4 bg-[#2A2A2A] rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Contract Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-400">Contract ID</p>
                      <p className="font-medium">{selectedContract.contractId}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Contract Name</p>
                      <p className="font-medium">{selectedContract.contractName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Total Amount</p>
                      <p className="font-medium text-[#FF8A00]">{formatCurrency(selectedContract.totalAmount)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Commission</p>
                      <p className="font-medium">{selectedContract.commission}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Contract Type</p>
                      <p className="font-medium">{selectedContract.contractType}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Status</p>
                      <div>{getStatusBadge(selectedContract.status)}</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Start Date</p>
                      <p className="font-medium">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">End Date</p>
                      <p className="font-medium">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-400 mb-2">Payment Progress</p>
                    <Progress
                      value={
                        selectedPayment.status === "PAID" || selectedPayment.status === "Paid"
                          ? 100
                          : selectedPayment.status === "PARTIAL" || selectedPayment.status === "Partial"
                            ? 50
                            : selectedPayment.status === "PENDING" || selectedPayment.status === "Pending"
                              ? 25
                              : 0
                      }
                      className="h-2 bg-[#333333]"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              className="text-white border-[#3A3A3A] hover:bg-[#2A2A2A] hover:text-white"
            >
              Close
            </Button>
            <Button
              onClick={() => selectedPayment && handleDownloadInvoice(selectedPayment)}
              className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white"
            >
              <Download className="h-4 w-4 mr-2" /> Download Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 text-[#FF8A00] mr-2" />
              Send Payment Reminder
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a reminder for the payment to the account holder.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && selectedContract && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-[#2A2A2A] rounded-md">
                <p className="text-sm text-gray-400">Contract</p>
                <p className="font-medium">{selectedContract.contractName}</p>
                <div className="mt-2 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-medium text-[#FF8A00]">{formatCurrency(selectedPayment.paymentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Status</p>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Reminder Message</label>
                <Textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white focus:border-[#FF8A00] focus:ring-[#FF8A00]/10 min-h-[120px]"
                  placeholder={`Dear Account #${selectedContract.accountId},\n\nThis is a friendly reminder about your pending payment for contract "${selectedContract.contractName}".\n\nPlease complete your payment at your earliest convenience.`}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsReminderModalOpen(false)}
              className="border-[#3A3A3A] hover:bg-[#2A2A2A] hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSendReminder} className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white">
              <Send className="h-4 w-4 mr-2" /> Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
