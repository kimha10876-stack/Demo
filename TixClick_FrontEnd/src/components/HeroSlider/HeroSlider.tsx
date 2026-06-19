import { AxiosError } from "axios";
import { Menu, Play, Search, X } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaFacebookSquare, FaYoutube } from "react-icons/fa";
import { LuLogOut, LuTicketCheck } from "react-icons/lu";
import { RiCalendarEventLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthContext } from "../../contexts/AuthProvider";
import companyApi from "../../services/companyApi";
import { ROLE_CONSUMER, ROLE_ORGANIZER } from "../../constants/constants";

const HeroSlider = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isBackDrop, setIsBackDrop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsBackDrop(true);
      } else {
        setIsBackDrop(false);
      }

      if (window.scrollY > window.innerHeight - 102) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
    document.body.style.overflow = openMobileMenu ? "auto" : "hidden";
  };

  const hanldeClickCreateEvent = async () => {
    try {
      const response = await companyApi.isAccountHaveCompany();
      console.log(response);
      if (response.data.code == 200) {
        navigate("/create-event");
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        navigate("/create-company", {
          state: toast.error("Bạn cần phải tạo công ty trước"),
        });
      } else {
        console.log("Lỗi không xác định:", axiosError);
        toast.error("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  const submitSearchValue = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("searchValue") as string;
    navigate(`/search?event-name=${searchValue}&maxPrice=${100000}`);

    console.log(searchValue);
  };

  return (
    <div className="">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-[1]"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-[100%] h-screen object-cover brightness-90 contrast-125"
        >
          <source
            src="https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Header  */}
        <header
          className={`fixed flex items-center top-0 left-0 w-full h-[70px] p-4 lg:px-14 text-white transition-all duration-500 z-10 ${
            isVisible ? "translate-y-0 " : "-translate-y-full"
          } ${isBackDrop && "backdrop-blur-[20px] bg-black bg-opacity-30"}`}
        >
          <p className="font-bold text-2xl text-[#FF8A00]">TixClick</p>
          <div className="hidden md:block ml-auto">
            {authContext?.isLogin ? (
              <ul className="flex gap-4 font-medium">
                {authContext.role == ROLE_CONSUMER && (
                  <NavLink to="/ticketManagement">
                    <li className="px-4 py-2 hover:text-[#FF8A00] transition-colors">
                      Vé của tôi
                    </li>
                  </NavLink>
                )}
                {authContext.role == ROLE_ORGANIZER && (
                  <>
                    <NavLink to="/company">
                      <li className="px-4 py-2 hover:text-[#FF8A00] transition-colors">
                        Sự kiện của tôi
                      </li>
                    </NavLink>
                  </>
                )}
                {/* <NavLink to="/my-task">
                  <li className="px-4 py-2 hover:text-[#FF8A00] transition-colors">
                    Công việc của tôi
                  </li>
                </NavLink> */}
                <NavLink to="/profileForm">
                  <li className="px-4 py-2 hover:text-[#FF8A00] transition-colors">
                    Trang cá nhân
                  </li>
                </NavLink>
                {authContext.role == ROLE_ORGANIZER && (
                  <button onClick={hanldeClickCreateEvent}>
                    <li className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-all duration-300">
                      Tạo sự kiện
                    </li>
                  </button>
                )}

                <li
                  onClick={() => authContext?.logout()}
                  className="px-4 py-2 border rounded-md bg-white text-black hover:opacity-80 transition-all cursor-pointer duration-300"
                >
                  Đăng xuất
                </li>
              </ul>
            ) : (
              <NavLink to="/auth/signin">
                <button className="px-6 py-2 border border-white bg-transparent text-white rounded-md hover:bg-white hover:text-black transition-all duration-300">
                  Đăng nhập
                </button>
              </NavLink>
            )}
          </div>
          <button onClick={handleOpenMobileMenu} className="md:hidden ml-auto">
            <Menu className="text-[#FF8A00]" />
          </button>
        </header>

        <form
          onSubmit={submitSearchValue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 z-[2]"
        >
          <div className="w-full flex flex-col gap-2">
            <p className="text-xl md:text-3xl lg:text-5xl font-bold text-center text-white">
              <span className="text-[#FF8A00]">KHÁM PHÁ NHỮNG</span> SỰ KIỆN
              TUYỆT VỜI
            </p>
            <p className="text-xl text-center font-medium text-white">
              Tìm và đặt vé cho những sự kiện tốt nhất trong khu vực của bạn
            </p>

            <button type="button" className="flex justify-center mt-6 p-3">
              <span className="bg-[#FF8A00] p-3 rounded-full ring ring-offset-4 ring-[#FF8A00]/50 hover:bg-[#E67E00] transition-colors">
                <Play className="fill-white stroke-white" />
              </span>
            </button>
          </div>
          {/* <div className="relative max-w-2xl mx-auto mt-8">
            <input
              type="text"
              name="searchValue"
              placeholder="Tìm kiếm sự kiện..."
              className="w-full bg-white/10 backdrop-blur-md border-2 border-[#FF8A00] text-white placeholder-white/80 rounded-full py-4 px-6 pr-16 outline-none focus:ring-2 focus:ring-[#FF8A00] transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF8A00] text-white p-3 rounded-full hover:bg-[#E67E00] transition-all duration-300"
            >
              <Search />
            </button>
          </div> */}
        </form>
      </div>

      {/*  Menu  */}
      <div
        className={` ${
          openMobileMenu ? "translate-x-0" : "-translate-x-[100%]"
        } fixed flex flex-col w-full h-screen top-0 left-0 bg-white z-20 transition-all duration-500`}
      >
        <div className="relative bg-[#FF8A00] p-6 flex gap-4 rounded-br-[60px] items-center">
          <div className="bg-white h-16 w-16 flex items-center justify-center text-[#FF8A00] font-bold rounded-full">
            TixClick
          </div>
          <div className="text-base font-semibold text-white">Đăng nhập</div>
          <div className="absolute top-6 right-6">
            <X onClick={handleOpenMobileMenu} className="text-white" />
          </div>
        </div>
        <div className="text-black my-8">
          <ul className="space-y-4">
            <li>
              <a
                href="/ticketManagement"
                className="flex items-center gap-2 py-3 px-6 hover:bg-[#FF8A00]/10 transition-colors"
              >
                <LuTicketCheck size={24} className="text-[#FF8A00]" />
                Vé đã mua
              </a>
            </li>
            <li>
              <a
                href="/consumerCenter"
                className="flex items-center p-3 px-6 gap-2 hover:bg-[#FF8A00]/10 transition-colors"
              >
                <RiCalendarEventLine size={24} className="text-[#FF8A00]" />
                Sự kiện của tôi
              </a>
            </li>
            <li>
              <a
                href="/profileForm"
                className="flex items-center p-3 px-6 gap-2 hover:bg-[#FF8A00]/10 transition-colors"
              >
                <CgProfile size={24} className="text-[#FF8A00]" />
                Trang cá nhân
              </a>
            </li>
            <li>
              <a
                href="/logout"
                className="flex items-center p-3 px-6 gap-2 hover:bg-[#FF8A00]/10 transition-colors"
              >
                <LuLogOut size={24} className="text-[#FF8A00]" />
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
        <div className="text-white rounded-tl-[60px] flex justify-end items-center gap-4 mt-auto text-right p-6 bg-[#FF8A00]">
          <span className="border border-white p-2 rounded-full hover:bg-white hover:text-[#FF8A00] transition-colors cursor-pointer">
            <FaFacebookSquare size={24} />
          </span>
          <span className="border border-white p-2 rounded-full hover:bg-white hover:text-[#FF8A00] transition-colors cursor-pointer">
            <AiFillTikTok size={24} />
          </span>
          <span className="border border-white p-2 rounded-full hover:bg-white hover:text-[#FF8A00] transition-colors cursor-pointer">
            <FaYoutube size={24} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
