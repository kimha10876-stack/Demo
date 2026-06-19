import { House, LockKeyhole, PhoneCall } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { NavLink } from "react-router";
import { CompanyStatus } from "../../interface/company/Company";

type Props = {
  message?: string;
  status?: CompanyStatus;
};

const LockPage = ({ message, status }: Props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none"; // Vô hiệu toàn bộ tương tác ngoài
    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, []);

  return (
    <div className="fixed pointer-events-auto flex-col gap-4 w-full h-full top-0 right-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center text-2xl font-bold">
      <LockKeyhole size={40} />
      <p className="text-center">{message}</p>
      <p className="flex items-center gap-2">
        <PhoneCall /> <span>Hotline CSKH: 0931337204</span>
      </p>
      {status === "PENDING" ? (
        <NavLink to="/">
          <Button className="flex items-center gap-2 bg-pse-green hover:bg-opacity-80 text-white shadow-md">
            <House /> <span>Trang chủ</span>
          </Button>
        </NavLink>
      ) : (
        <NavLink to="/create-company">
          <Button className="flex items-center gap-2 bg-pse-green hover:bg-opacity-80 text-white shadow-md">
            <House /> <span>Chỉnh sửa thông tin công ty</span>
          </Button>
        </NavLink>
      )}
    </div>
  );
};

export default LockPage;
