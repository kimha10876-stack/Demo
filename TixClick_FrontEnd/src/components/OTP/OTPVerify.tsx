import { motion } from "framer-motion";
import OTPVerifyImg from "../../assets/OTPVerify.png";
import { FormEvent, useState } from "react";
import authApi from "../../services/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const OTPVerify = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    authApi
      .sendOTP(email)
      .then((response) => {
        // console.log(response);
        if (response.data.code === 200) {
          navigate("/auth/code", { state: email });
          toast.success(response.data.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <motion.div
      initial={{ x: 500 }} // Vị trí ban đầu bên trái ngoài màn hình
      animate={{ x: 0 }} // Vị trí cuối cùng
      transition={{ duration: 1.5 }}
      className="px-3 py-6 lg:px-8 lg:py-12 w-[550px] h-screen text-pse-black"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <img src={OTPVerifyImg} />
        </div>
        <div className="my-4 ">
          <p className=" text-[22px] font-bold">Xác thực OTP</p>
          <p className=" text-[18px] font-normal">
            Nhập Email để chúng tôi gửi mã cho bạn
          </p>
          <input
            name="email"
            value={email}
            onChange={onChangeEmail}
            placeholder="Email"
            className="px-4 py-2 bg-[#e5e5e5] outline-none rounded-md text-[#808080] w-full my-2"
          />
        </div>
        <button
          disabled={isLoading ? true : false}
          type="submit"
          className="bg-pse-green text-white w-full font-bold rounded-md py-2 hover:opacity-80"
        >
          {isLoading ? "..." : "Tiếp tục"}
        </button>
      </form>
    </motion.div>
  );
};

export default OTPVerify;
