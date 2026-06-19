import { NavLink } from "react-router";
import Img from "../../assets/404.png";
import { GoHomeFill } from "react-icons/go";

const ErrorPage = () => {
  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex justify-center items-center">
        <img src={Img} width={500} loading="lazy" alt="Không có gì ở đây" />
      </div>
      <div className="flex flex-col items-center gap-4 text-pse-black font-extrabold text-[22px] text-center uppercase">
        Không có gì ở đây!
        <NavLink to="/">
          <button className="flex items-center justify-center gap-1 bg-pse-green text-white px-4 py-2 rounded-lg w-[200px] hover:bg-pse-green/80">
            <span>
              <GoHomeFill size={22} />
            </span>
            Trang chủ
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default ErrorPage;
