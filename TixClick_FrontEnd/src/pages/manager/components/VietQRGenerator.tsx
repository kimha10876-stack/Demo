import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"


export default function VietQRGenerator() {
  const [bankId, setBankId] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateQRCode = () => {
    setIsLoading(true);
  
    if (!bankId || !accountNumber) {
      alert("Vui lòng chọn ngân hàng và nhập số tài khoản!");
      setIsLoading(false);
      return;
    }
  
    const formattedAmount = amount && !isNaN(Number(amount)) ? Number(amount) : "";
  
    const baseUrl = "https://img.vietqr.io/image";
    const url = `${baseUrl}/${bankId}-${accountNumber}-qr.png?amount=${formattedAmount}&addInfo=${encodeURIComponent(
      description
    )}&accountName=account`;
  
    setQrCodeUrl(url);
    setIsLoading(false);
  };
  

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>VietQR Generator</CardTitle>
          <CardDescription>Tạo mã QR cho thanh toán ngân hàng Việt Nam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Ngân hàng</Label>
            <Select value={bankId} onValueChange={setBankId}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Chọn ngân hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="970436">Vietcombank</SelectItem>
                <SelectItem value="970418">BIDV</SelectItem>
                <SelectItem value="970422">MB Bank</SelectItem>
                <SelectItem value="970415">VietinBank</SelectItem>
                <SelectItem value="970416">ACB</SelectItem>
                <SelectItem value="970432">VPBank</SelectItem>
                <SelectItem value="970403">Sacombank</SelectItem>
                <SelectItem value="970423">Techcombank</SelectItem>
                <SelectItem value="970441">VIB</SelectItem>
                <SelectItem value="970454">TPBank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="account">Số tài khoản</Label>
            <Input
              id="account"
              placeholder="Nhập số tài khoản"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VND)</Label>
            <Input
              id="amount"
              placeholder="Nhập số tiền (không bắt buộc)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Nội dung chuyển khoản</Label>
            <Input
              id="description"
              placeholder="Nhập nội dung chuyển khoản"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={generateQRCode} disabled={!bankId || !accountNumber || isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo mã QR"}
          </Button>

          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="border p-4 rounded-lg bg-white">
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt="VietQR Code"
                width={200}
                height={200}
                className="mx-auto"
                />

              </div>
              <p className="text-xs text-center text-muted-foreground">
                Quét mã QR này bằng ứng dụng ngân hàng để thanh toán
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

