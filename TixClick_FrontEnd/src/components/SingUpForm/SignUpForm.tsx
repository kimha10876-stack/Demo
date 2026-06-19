import { LuEye, LuEyeClosed } from "react-icons/lu";
import CustomDivider from "../../components/Divider/CustomDivider";
import authApi from "../../services/authApi";
import { RegisterRequest } from "../../interface/AuthInterface";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Logo from "../../assets/Logo.png";
import GoogleImg from "../../assets/google.png";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ROLE_CONSUMER, TOAST_MESSAGE } from "../../constants/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schema = yup.object({
  userName: yup
    .string()
    .required("Tên đăng nhập không được để trống")
    .min(6, "Ít nhất 6 ký tự")
    .max(20, "Không quá 20 ký tự"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu ít nhất 6 kí tự"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  firstName: yup.string().required("Tên không được để trống"),
  lastName: yup.string().required("Họ không được để trống"),
  roleName: yup.string().required("Vui lòng chọn vai trò"),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      roleName: ROLE_CONSUMER,
    },
  });

  const onChangeShowPassword = () => setIsShowPassword(!isShowPassword);

  const onSubmit = (data: RegisterRequest) => {
    setIsLoading(true);
    const payload: RegisterRequest = {
      ...data,
      roleName: data.roleName,
    };

    authApi
      .signUp(payload)
      .then((response) => {
        console.log(response);
        toast.success(TOAST_MESSAGE.signUpSucces);
        navigate("/auth/code", { state: data.email });
      })
      .catch((error) => {
        toast.warning(
          error.response?.data?.message || TOAST_MESSAGE.signInFail
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <motion.div
      initial={{ x: 500 }}
      animate={{ x: 0 }}
      transition={{ duration: 1.5 }}
      className="px-3 pt-6 pb-10 lg:px-8 lg:py-5 w-[550px] h-auto"
    >
      <div className="hidden lg:flex items-center gap-2 font-bold text-[20px]">
        <img src={Logo} width={64} />
        <p>Event booking</p>
      </div>
      <p className="font-bold text-[22px] my-4">Tham gia với chúng tôi</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-4 space-y-3">
          <div>
            <input
              {...register("userName")}
              placeholder="Tên đăng nhập"
              className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center bg-[#e5e5e5] rounded-md px-4 py-2 text-[#808080] w-full">
              <input
                {...register("password")}
                type={isShowPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full bg-[#e5e5e5] outline-none"
              />
              <span>
                {isShowPassword ? (
                  <LuEyeClosed
                    onClick={onChangeShowPassword}
                    size={20}
                    className="text-[#4d4d4d] cursor-pointer"
                  />
                ) : (
                  <LuEye
                    onClick={onChangeShowPassword}
                    size={20}
                    className="text-[#4d4d4d] cursor-pointer"
                  />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="w-[50%]">
              <input
                {...register("firstName")}
                placeholder="Tên"
                className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-[50%]">
              <input
                {...register("lastName")}
                placeholder="Họ"
                className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Select
              onValueChange={(value) => setValue("roleName", value)}
              defaultValue={ROLE_CONSUMER}
            >
              <SelectTrigger className="w-full bg-[#e5e5e5] text-[#808080] border-none">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUYER">Người mua</SelectItem>
                <SelectItem value="ORGANIZER">Ban tổ chức</SelectItem>
              </SelectContent>
            </Select>
            {errors.roleName && (
              <p className="text-red-500 text-sm">{errors.roleName.message}</p>
            )}
          </div>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="bg-pse-green text-white flex justify-center w-full font-bold rounded-md py-2 hover:opacity-80"
        >
          {isLoading ? (
            <div className="mr-3 size-5 animate-spin flex justify-center items-center">
              <LoaderCircle />
            </div>
          ) : (
            "Đăng kí"
          )}
        </button>
      </form>

      <div className="my-8">
        <CustomDivider />
      </div>

     {/* <button className="bg-[#333333] flex justify-center items-center font-light gap-2 text-white w-full rounded-md py-2 hover:opacity-80">
        <img src={GoogleImg} width={24} />
        Hoặc đăng kí bằng Google
      </button> */}

      <div className="my-4 text-center font-light">
        Bạn đã có tài khoản?{" "}
        <NavLink to="/auth/signin">
          <span className="text-pse-green font-semibold cursor-pointer hover:underline">
            Đăng nhập
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

export default SignUpForm;
