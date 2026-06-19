import { useRef } from "react"
import { Download, Printer } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { useReactToPrint } from "react-to-print"

export default function ContractTemplate() {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    // content: (() => componentRef.current) as () => React.ReactInstance | null,  
    documentTitle: "Event_Contract_Template",
  })

  const handleDownload = async () => {
    if (!componentRef.current) return

    const element = componentRef.current
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    if (imgHeight > 297) {
      let heightLeft = imgHeight - 297
      let position = -297

      while (heightLeft > 0) {
        position -= 297
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= 297
      }
    }

    pdf.save("Event_Contract_Template.pdf")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mẫu Hợp Đồng Sự Kiện</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Đây là mẫu hợp đồng sự kiện được thiết kế để hệ thống quét PDF có thể dễ dàng trích xuất thông tin. Bạn có
            thể tải xuống mẫu này dưới dạng PDF hoặc in trực tiếp.
          </p>
          <div className="flex gap-4">
            <Button onClick={handleDownload} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Tải xuống PDF
            </Button>
            <Button variant="outline" onClick={() => handlePrint?.()} className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              In mẫu
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="hidden print:block" ref={componentRef}>
        <div className="max-w-[800px] mx-auto p-8 font-serif">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase mb-2">HỢP ĐỒNG TỔ CHỨC SỰ KIỆN</h1>
            <p className="text-sm">Số: EVENT-2024-001</p>
          </div>

          <div className="mb-6">
            <p>Hôm nay, ngày 15 tháng 06 năm 2024, tại Thành phố Hồ Chí Minh, chúng tôi gồm:</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">BÊN A: (BÊN THUÊ DỊCH VỤ)</h2>
            <p><strong>Tên công ty:</strong> Công Ty TNHH ABC</p>
            <p><strong>Địa chỉ:</strong> 123 Đường Nguyễn Huệ, Quận 1, TP.HCM</p>
            <p><strong>Điện thoại:</strong> 028 1234 5678</p>
            <p><strong>Email:</strong> contact@abccompany.com</p>
            <p><strong>Đại diện:</strong> Ông Nguyễn Văn A</p>
            <p><strong>Chức vụ:</strong> Giám đốc</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">BÊN B: (BÊN CUNG CẤP DỊCH VỤ)</h2>
            <p><strong>Tên công ty:</strong> Công Ty Tổ Chức Sự Kiện XYZ</p>
            <p><strong>Địa chỉ:</strong> 456 Đường Lê Lợi, Quận 1, TP.HCM</p>
            <p><strong>Điện thoại:</strong> 028 8765 4321</p>
            <p><strong>Email:</strong> info@xyzevent.com</p>
            <p><strong>Đại diện:</strong> Bà Trần Thị B</p>
            <p><strong>Chức vụ:</strong> Giám đốc điều hành</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">THÔNG TIN SỰ KIỆN</h2>
            <p><strong>Tên sự kiện:</strong> Lễ Ra Mắt Sản Phẩm Mới ABC 2024</p>
            <p><strong>Ngày sự kiện:</strong> 30/07/2024</p>
            <p><strong>Địa điểm:</strong> Trung Tâm Hội Nghị White Palace, 194 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP.HCM</p>
            <p><strong>Thời gian bắt đầu:</strong> 18:00</p>
            <p><strong>Thời gian kết thúc:</strong> 21:30</p>
            <p><strong>Số lượng khách mời:</strong> 200 người</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">DỊCH VỤ CUNG CẤP</h2>
            <ul className="list-disc pl-6">
              <li>Trang trí sân khấu và khu vực sự kiện</li>
              <li>Hệ thống âm thanh, ánh sáng chuyên nghiệp</li>
              <li>MC dẫn chương trình</li>
              <li>Chụp hình, quay phim sự kiện</li>
              <li>Tiệc cocktail cho 200 khách</li>
              <li>Nhân viên lễ tân và phục vụ</li>
              <li>Thiết kế và in ấn standee, backdrop</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">CHI PHÍ VÀ THANH TOÁN</h2>
            <p><strong>Giá trị hợp đồng:</strong> 150,000,000 VNĐ (Một trăm năm mươi triệu đồng)</p>
            <p><strong>Điều khoản thanh toán:</strong></p>
            <ul className="list-disc pl-6">
              <li>Đợt 1: 50% giá trị hợp đồng, thanh toán ngay sau khi ký hợp đồng</li>
              <li>Đợt 2: 30% giá trị hợp đồng, thanh toán trước ngày sự kiện 10 ngày</li>
              <li>Đợt 3: 20% giá trị hợp đồng, thanh toán sau khi kết thúc sự kiện 5 ngày</li>
            </ul>
            <p><strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng</p>
            <p><strong>Thông tin tài khoản:</strong></p>
            <ul className="list-none pl-6">
              <li>Tên tài khoản: Công Ty Tổ Chức Sự Kiện XYZ</li>
              <li>Số tài khoản: 0123456789</li>
              <li>Ngân hàng: Vietcombank - Chi nhánh TP.HCM</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">ĐIỀU KHOẢN CHUNG</h2>
            <ol className="list-decimal pl-6">
              <li className="mb-2"><strong>Thay đổi và hủy bỏ:</strong> Mọi thay đổi về nội dung, chương trình phải được thông báo bằng văn bản và được sự đồng ý của cả hai bên...</li>
              <li className="mb-2"><strong>Bất khả kháng:</strong> Trong trường hợp bất khả kháng như thiên tai, dịch bệnh...</li>
              <li className="mb-2"><strong>Bảo mật thông tin:</strong> Hai bên cam kết bảo mật thông tin liên quan...</li>
            </ol>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">GHI CHÚ BỔ SUNG</h2>
            <p>Bên B sẽ cung cấp bản kế hoạch chi tiết và timeline sự kiện trong vòng 7 ngày...</p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="font-bold mb-20">ĐẠI DIỆN BÊN A</p>
                <p>Nguyễn Văn A</p>
              </div>
              <div className="text-center">
                <p className="font-bold mb-20">ĐẠI DIỆN BÊN B</p>
                <p>Trần Thị B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
