import { NavLink } from "react-router";
import { Button } from "../ui/button";
import Img from "../../assets/no content backup.png";
const NotHaveCompany = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-2 h-full w-full">
      <img src={Img} alt="" />
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-lg">Tài khoản của bạn chưa tạo công ty !</div>
        <NavLink to="/create-company">
          <Button className="bg-background text-foreground hover:bg-pse-green hover:text-white transition-all duration-300">
            Tạo công ty ngay
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default NotHaveCompany;
