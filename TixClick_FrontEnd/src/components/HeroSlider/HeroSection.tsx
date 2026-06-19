import { ArrowRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../assets/Logo.png";
import companyApi from "../../services/companyApi";
import { AxiosError } from "axios";
import { toast } from "sonner";

const HeroSection = () => {
  const navigate = useNavigate();
  const hanldeClickCreateEvent = async () => {
    try {
      const response = await companyApi.isAccountHaveCompany();
      console.log(response.data.code);
      if (response.data.code == 200) {
        navigate("/create-event");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        navigate("/create-company", {
          state: toast.error("Bạn cần phải tạo công ty trước"),
        });
      } else {
        console.log("Lỗi không xác định:", axiosError.message);
        toast.error("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };
  return (
    <div className="relative py-20 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A00]/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF8A00]/5 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-14 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Tạo <span className="text-[#FF8A00]">Sự Kiện</span> Của Riêng Bạn
          </h2>
          <p className="text-white/80 mb-10 text-lg max-w-lg">
            Dễ dàng tạo và quản lý sự kiện, bán vé trực tuyến và tiếp cận hàng
            ngàn người tham dự tiềm năng.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={hanldeClickCreateEvent}
              className="px-8 py-4 bg-[#FF8A00] text-white font-semibold rounded-full hover:bg-[#E67E00] transition-colors flex items-center gap-2"
            >
              Tạo Sự Kiện Ngay
              <ArrowRight size={18} />
            </button>

            <NavLink to="/about">
              <button className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Tìm hiểu thêm
              </button>
            </NavLink>
          </div>
        </div>

        <div className="md:w-1/2 relative flex justify-center md:justify-end">
          <div className="relative">
            <img
              src={Logo || "/placeholder.svg"}
              alt="TixClick Logo"
              className="w-64 h-64 md:w-80 md:h-80 object-contain z-10 relative"
            />

            <div className="absolute -z-10 -bottom-10 -right-10 w-[200px] h-[200px] bg-[#FF8A00] rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -z-10 top-10 -left-10 w-[150px] h-[150px] bg-[#FF8A00] rounded-full opacity-10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
