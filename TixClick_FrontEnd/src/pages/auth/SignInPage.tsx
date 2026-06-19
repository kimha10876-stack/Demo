import SignInImg from "../../assets/pexels-wendywei-1190297.jpg";
import { motion } from "framer-motion";
import { Outlet } from "react-router";

const SignInPage = () => {
  return (
    <div className="flex justify-center bg-white text-pse-black text-[16px] h-auto max-h-screen">
      <motion.div
        initial={{ x: -1000 }} // Vị trí ban đầu bên trái ngoài màn hình
        animate={{ x: 0 }} // Vị trí cuối cùng
        transition={{ duration: 2 }}
        className="hidden lg:block"
      >
        <img src={SignInImg} className="h-screen" />
      </motion.div>
      <Outlet />
    </div>
  );
};

export default SignInPage;
