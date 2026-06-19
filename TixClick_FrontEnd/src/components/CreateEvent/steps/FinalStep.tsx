import React from "react";
import { StepProps } from "./Step1_Infor";
import { Button } from "../../ui/button";
import { NavLink, useNavigate } from "react-router";
import eventApi from "../../../services/eventApi";

const FinalStep: React.FC<StepProps> = ({ eventId }) => {
  const navigate = useNavigate();

  const approveEvent = async () => {
    const response = await eventApi.approveEvent(eventId);
    console.log(response);
    if (response.data.code == 200) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-[100px] gap-4">
      <div className="font-semibold text-[20px]">
        Bạn có chấp nhận với các thông tin mà bạn cung cấp?
      </div>
      <div className="flex gap-4">
        <NavLink to={`/company`}>
          <Button className="bg-black text-white hover:bg-opacity-30">
            Tôi muốn chỉnh sửa
          </Button>
        </NavLink>
        <Button
          onClick={approveEvent}
          className="bg-white text-black hover:bg-opacity-30"
        >
          Đồng ý
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
