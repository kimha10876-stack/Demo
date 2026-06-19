import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2a2a2a] text-white py-16 shadow-[0_4px_10px_rgba(255,255,255,0.1)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <p className="text-sm lg:text-base mb-4">
              &copy; {new Date().getFullYear()} TixClick. All rights reserved
            </p>
            <p className="text-xs lg:text-sm text-gray-400 mb-4">
              TixClick là nền tảng bán vé trực tuyến hàng đầu, giúp kết nối
              người dùng với các sự kiện âm nhạc, thể thao và văn hóa. Chúng tôi
              cam kết mang đến trải nghiệm mua vé nhanh chóng, an toàn và tiện
              lợi.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <a className="hover:text-gray-400 transition-colors text-sm lg:text-base">
              Giới thiệu
            </a>
            <a className="hover:text-gray-400 transition-colors text-sm lg:text-base">
              Chính sách bảo mật
            </a>
            <a className="hover:text-gray-400 transition-colors text-sm lg:text-base">
              Điều khoản sử dụng
            </a>
          </div>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-gray-400 transition-colors">
              <FaFacebookF size={24} />
            </a>
            <a className="hover:text-gray-400 transition-colors">
              <FaInstagram size={24} />
            </a>
            <a className="hover:text-gray-400 transition-colors">
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
