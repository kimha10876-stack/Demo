import { useState } from "react";
import Avt from "../../../assets/AvatarHuy.jpg";
import Popup from "../../../components/Popup/Popup";
import { NavLink } from "react-router";

const CompanyAccount = () => {
  const [isOpenVerify, setIsOpenVerify] = useState<boolean>(false);

  const handleCloseVerify = () => {
    setIsOpenVerify(false);
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <p className="flex flex-col items-end text-white text-[16px]">
        Công ty ABC
        <span className="text-[14px] text-pse-gray">29 Lê Thánh Tôn</span>
      </p>
      <NavLink to="/company/profile">
        <button>
          <img
            src={Avt}
            alt="Avatar"
            className="rounded-full w-[38px] h-[38px] hover:ring-1 ring-offset-4 ring-black"
          />
        </button>
      </NavLink>

      {/* Popup for account verification */}
      <Popup
        key={"verify"}
        title="Kích hoạt tài khoản"
        isOpen={isOpenVerify}
        onClose={handleCloseVerify}
      >
        Điền form
      </Popup>
    </div>
  );
};

export default CompanyAccount;
