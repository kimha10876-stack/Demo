import { NavLink, useLocation, useNavigate } from "react-router";
import { Button } from "../../../components/ui/button";
import { useEffect } from "react";
import paymentApi from "../../../services/paymentApi";
import { CheckCircle, XCircle } from "lucide-react";
import Header from "../../../components/Header/Header";

const CallbackPayment = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get("status");

  const handleCallBack = async () => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    await paymentApi.callback(params);
  };

  useEffect(() => {
    handleCallBack();
  }, []);
  if (status == "PAID")
    return (
      <div className="flex flex-col h-screen gap-4 justify-center items-center text-center">
        <Header />
        <CheckCircle className="w-16 h-16 text-green-500" />
        <div className="text-2xl font-semibold text-green-600">
          Thanh toán thành công
        </div>
        <NavLink to="/ticketManagement">
          <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100">
            Vé của tôi
          </Button>
        </NavLink>
      </div>
    );

  if (status == "CANCELLED")
    return (
      <div className="flex flex-col h-screen gap-4 justify-center items-center text-center">
        <Header />
        <XCircle className="w-16 h-16 text-red-500" />
        <div className="text-2xl font-semibold text-red-600">
          Thanh toán thất bại
        </div>
        <NavLink to="/">
          <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100">
            Trang chủ
          </Button>
        </NavLink>
      </div>
    );
};

export default CallbackPayment;
