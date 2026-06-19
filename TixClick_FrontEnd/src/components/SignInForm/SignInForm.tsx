import { motion } from "framer-motion";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import CustomDivider from "../../components/Divider/CustomDivider";
import { AuthContext } from "../../contexts/AuthProvider";
import { LoginRequest } from "../../interface/AuthInterface";
import authApi from "../../services/authApi";

import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Logo from "../../assets/Logo.png";
import GoogleImg from "../../assets/google.png";
import { LoaderCircle } from "lucide-react";
import { ROLE_CONSUMER, ROLE_ORGANIZER } from "../../constants/constants";
// import { TOAST_MESSAGE } from "../../constants/constants";
// import { ERROR_RESPONSE } from "../../constants/constants";

const SignInForm = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    userName: "",
    password: "",
  });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedPassword = localStorage.getItem("password");
    if (storedUserName && storedPassword) {
      setFormData({
        userName: storedUserName,
        password: storedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  const navigateByRole = (role: string) => {
    switch (role) {
      case ROLE_ORGANIZER:
        navigate("/company");
        break;
      case ROLE_CONSUMER:
        navigate("/");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const onChangeShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked); // Cập nhật trạng thái "Nhớ mật khẩu"
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(formData);
    authApi
      .signIn(formData)
      .then((response) => {
        if (response.data.result.status == true) {
          localStorage.clear();
          console.log(response.data);
          authContext?.login(
            response.data.result.accessToken,
            response.data.result.roleName
          );
          authContext?.setTokenForAxios(
            "user",
            response.data.result.accessToken
          );
          localStorage.setItem(
            "refreshToken",
            response.data.result.refreshToken
          );

          if (rememberMe) {
            localStorage.setItem("userName", formData.userName);
            localStorage.setItem("password", formData.password);
          }

          toast.success("Đăng nhập thành công");
          navigateByRole(response.data.result.roleName);
        } else {
          navigate("/auth/code", { state: response.data.result.email });
          toast.error("Bạn cần phải kích hoạt tài khoản");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message == "Tài khoản chưa được kích hoạt")
          navigate("/auth/code", { state: error.response.data.email });
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <motion.div
      initial={{ x: 500 }} // Vị trí ban đầu bên trái ngoài màn hình
      animate={{ x: 0 }} // Vị trí cuối cùng
      transition={{ duration: 1.5 }}
      className="px-3 py-6 lg:px-8 lg:py-12 w-[550px] h-screen"
    >
      <div className="hidden lg:flex items-center mb-12 gap-2 font-bold text-[20px]">
        <img src={Logo} width={64} />
        <p>Event booking</p>
      </div>
      <p className="font-bold text-[22px] my-4">Chào mừng bạn trở lại</p>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
          />
          <div className="flex items-center my-2 bg-[#e5e5e5] rounded-md px-4 py-2 text-[#808080] w-full">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={isShowPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="w-full bg-[#e5e5e5] outline-none"
            />
            <span>
              {isShowPassword ? (
                <LuEyeClosed
                  onClick={onChangeShowPassword}
                  size={20}
                  className="text-[#4d4d4d]"
                />
              ) : (
                <LuEye
                  onClick={onChangeShowPassword}
                  size={20}
                  className="text-[#4d4d4d]"
                />
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-[14px] font-semibold">
            <div className="flex items-center gap-2">
              <label className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-[#e5e5e5] transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-pse-green">
                <input
                  type="checkbox"
                  id="AcceptConditions"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="peer sr-only"
                />
                <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-900 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
              </label>
              <p>Nhớ mật khẩu</p>
            </div>
            <div className="text-pse-green cursor-pointer hover:underline">
              Quên mật khẩu?
            </div>
          </div>
        </div>
        <button
          disabled={isLoading && true}
          type="submit"
          className="bg-pse-green text-white flex justify-center w-full font-bold rounded-md py-2 hover:opacity-80"
        >
          {isLoading ? (
            <div className="mr-3 size-5 animate-spin flex justify-center items-center">
              <LoaderCircle />
            </div>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
      <div className="my-8">
        <CustomDivider />
      </div>
    {/* <a href="https://tixclick.site/login/oauth2/code/google">
        <button className="bg-[#333333] flex justify-center items-center font-light gap-2 text-white w-full rounded-md py-2 hover:opacity-80">
          <img src={GoogleImg} width={24} />
          Hoặc đăng nhập bằng Goolge
        </button>
      </a> */}
      <div className="my-4 text-center font-light">
        Chưa có tài khoản?{" "}
        <NavLink to="/auth/signup">
          <span className="text-pse-green font-semibold cursor-pointer hover:underline">
            Đăng ký ngay
          </span>
        </NavLink>
      </div>
      <div className="lg:hidden flex items-center justify-center mt-16 gap-2 font-bold text-[20px]">
        <img src={GoogleImg} width={64} />
        <p>Event booking</p>
      </div>
    </motion.div>
  );
};

export default SignInForm;
