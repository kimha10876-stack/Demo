// "use client";

// import { AlertCircle, CheckCircle, Loader2, Ticket } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { toast, Toaster } from "sonner";
// import { Button } from "../../../../TixClick_FrontEnd/src/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../../TixClick_FrontEnd/src/components/ui/card";
// // import { formatDateVietnamese, formatTimeFe } from "../../../../lib/utils";

// interface PaymentQueueData {
//   purchaseResponse: any; // Phản hồi mua vé
//   eventInfo: {
//     id: string; // ID sự kiện
//     activityId: string; // ID hoạt động
//     name: string; // Tên sự kiện
//     location: string; // Địa điểm
//     date: string; // Ngày diễn ra
//   };
//   seats: any[]; // Danh sách ghế
//   totalAmount: number; // Tổng số tiền
//   discountedAmount: number; // Số tiền sau giảm giá
//   voucher: { code: string; discountAmount: number; discountPercentage: number } | null; // Thông tin mã giảm giá
//   transactionId: string; // ID giao dịch
//   timestamp: string; // Thời gian giao dịch
//   apiResponses: { purchase: any }; // Phản hồi API
// }

// export default function PaymentQueuePage() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [paymentStatus, setPaymentStatus] = useState<"PAID" | "FAILED" | "CANCELLED" | "PENDING" | null>(null); // Trạng thái thanh toán
//   const [isVerifying, setIsVerifying] = useState(true); // Đang xác minh
//   const [paymentDetails, setPaymentDetails] = useState<any>(null); // Chi tiết thanh toán
//   const [queueData, setQueueData] = useState<PaymentQueueData | null>(null); // Dữ liệu hàng đợi thanh toán

//   // Phân tích các tham số truy vấn từ URL trả về của PayOS
//   const orderId = searchParams.get("orderId"); // ID đơn hàng
//   const orderCode = searchParams.get("orderCode"); // Mã đơn hàng
//   const status = searchParams.get("status"); // Trạng thái
//   const cancel = searchParams.get("cancel"); // Hủy
//   const amount = searchParams.get("amount"); // Số tiền
//   const userName = searchParams.get("userName"); // Tên người dùng
//   const code = searchParams.get("code"); // Mã phản hồi
//   const id = searchParams.get("id"); // ID

//   // Xác minh thanh toán với backend
//   const verifyPayment = async () => {
//     setIsVerifying(true);
//     try {
//       const response = await fetch("https://tixclick.site/api/payment/pay-os-verify", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         },
//         body: JSON.stringify({
//           orderId,
//           orderCode,
//           status,
//           cancel,
//           amount,
//           code,
//           id,
//         }),
//       });

//       const data = await response.json();
//       console.log("Phản hồi xác minh thanh toán:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Không thể xác minh thanh toán");
//       }

//       if (data.code === 200 && data.result?.error === "ok") {
//         setPaymentStatus(data.result.data.status);
//         setPaymentDetails(data.result.data);
//       } else {
//         throw new Error("Xác minh thanh toán không thành công");
//       }
//     } catch (error) {
//       console.error("Lỗi xác minh thanh toán:", error);
//       setPaymentStatus("FAILED");
//       toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi khi xác minh thanh toán");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // Tải dữ liệu hàng đợi thanh toán từ localStorage
//   const loadQueueData = () => {
//     const storedPaymentData = localStorage.getItem("paymentQueueData");
//     if (storedPaymentData) {
//       try {
//         const parsedData = JSON.parse(storedPaymentData);
//         setQueueData(parsedData);
//         console.log("Dữ liệu hàng đợi thanh toán:", parsedData);
//       } catch (error) {
//         console.error("Lỗi phân tích dữ liệu hàng đợi:", error);
//         toast.error("Không thể tải dữ liệu thanh toán");
//       }
//     } else {
//       toast.error("Không tìm thấy dữ liệu thanh toán");
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     }
//   };

//   // Gọi verifyPayment và loadQueueData khi trang được tải
//   useEffect(() => {
//     loadQueueData();
//     if (orderId && orderCode && status) {
//       verifyPayment();
//     } else {
//       setIsVerifying(false);
//       setPaymentStatus("FAILED");
//       toast.error("Thiếu thông tin thanh toán từ PayOS");
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     }
//   }, [orderId, orderCode, status]);

//   // Hàm định dạng số tiền
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(amount);
//   };

//   return (
//     <div className="min-h-screen bg-[#121212] text-gray-200 flex items-center justify-center p-4">
//       <Toaster />
//       <Card className="bg-[#1A1A1A] border-[#2A2A2A] w-full max-w-2xl">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
//             {isVerifying ? (
//               <Loader2 className="h-6 w-6 animate-spin text-[#FF8A00]" />
//             ) : paymentStatus === "PAID" ? (
//               <CheckCircle className="h-6 w-6 text-green-500" />
//             ) : (
//               <AlertCircle className="h-6 w-6 text-red-500" />
//             )}
//             Kết quả thanh toán
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {isVerifying ? (
//             <div className="text-center py-8">
//               <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#FF8A00]" />
//               <p className="mt-4 text-gray-400">Đang xác minh thanh toán...</p>
//             </div>
//           ) : paymentStatus === "PAID" && queueData ? (
//             <>
//               <div className="bg-green-900/20 border border-green-800 p-4 rounded-md text-green-400">
//                 <h3 className="font-medium flex items-center gap-2">
//                   <CheckCircle className="h-5 w-5" />
//                   Thanh toán thành công
//                 </h3>
//                 <p className="mt-2 text-sm">
//                   Cảm ơn bạn đã thanh toán! Vé của bạn đã được xác nhận.
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 <h4 className="font-medium text-white">Chi tiết thanh toán</h4>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="text-gray-400">Mã đơn hàng:</div>
//                   <div>{orderCode}</div>
//                   <div className="text-gray-400">Số tiền:</div>
//                   <div>{formatCurrency(Number(amount))}</div>
//                   <div className="text-gray-400">Người dùng:</div>
//                   <div>{userName}</div>
//                   <div className="text-gray-400">Thời gian:</div>
//                   <div>{new Date().toLocaleString("vi-VN")}</div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h4 className="font-medium text-white">Thông tin vé</h4>
//                 <div className="bg-[#2A2A2A] p-4 rounded-md">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Ticket className="h-5 w-5 text-[#FF8A00]" />
//                     <span className="font-medium">{queueData.eventInfo.name}</span>
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     <p>Địa điểm: {queueData.eventInfo.location}</p>
//                     <p>Thời gian: {queueData.eventInfo.date}</p>
//                     <p>
//                       Ghế:{" "}
//                       {queueData.seats
//                         .map((seat) => `${seat.sectionName} - ${seat.seatLabel}`)
//                         .join(", ")}
//                     </p>
//                     <p>Tổng cộng: {formatCurrency(queueData.discountedAmount)}</p>
//                     {queueData.voucher && (
//                       <p>
//                         Mã giảm giá: {queueData.voucher.code} (
//                         {queueData.voucher.discountPercentage > 0
//                           ? `${queueData.voucher.discountPercentage}%`
//                           : formatCurrency(queueData.voucher.discountAmount)}
//                         )
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Button
//                 className="w-full bg-[#FF8A00] hover:bg-[#FF9A20] text-white"
//                 onClick={() => navigate("/events")}
//               >
//                 Quay lại trang sự kiện
//               </Button>
//             </>
//           ) : (
//             <div className="bg-red-900/20 border border-red-800 p-4 rounded-md text-red-400">
//               <h3 className="font-medium flex items-center gap-2">
//                 <AlertCircle className="h-5 w-5" />
//                 {paymentStatus === "CANCELLED"
//                   ? "Thanh toán đã bị hủy"
//                   : "Thanh toán không thành công"}
//               </h3>
//               <p className="mt-2 text-sm">
//                 {paymentStatus === "CANCELLED"
//                   ? "Bạn đã hủy thanh toán. Vui lòng thử lại nếu muốn mua vé."
//                   : "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
//               </p>
//               <Button
//                 className="mt-4 w-full bg-[#FF8A00] hover:bg-[#FF9A20] text-white"
//                 onClick={() => navigate("/")}
//               >
//                 Quay lại trang chủ
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }