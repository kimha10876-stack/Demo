import CustomDivider from "../Divider/CustomDivider";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import React, { useState } from "react";
import { EventDetailProps } from "./InformationEvent";

const IntroduceEvent: React.FC<EventDetailProps> = ({ eventDetail }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const onClickExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="bg-white/80 px-3 py-3 lg:py-9 text-pse-black flex justify-center">
      <div
        className={`relative pt-3 pb-14 bg-white rounded-lg w-[700px] ${
          isExpanded ? "max-h-auto" : "max-h-[400px]"
        } overflow-hidden ease-in-out transition-all duration-700`}
      >
        <h4 className="font-bold mx-3">Giới thiệu</h4>
        <div className="mx-3">
          <CustomDivider />
        </div>
        <div
          className="p-6"
          dangerouslySetInnerHTML={{ __html: eventDetail?.description as any }}
        />
        {/* <p className="mb-3 mx-3">{eventDetail?.description}</p>
        <div className="flex justify-center mb-3 mx-3">
          <img src={Img} />
        </div>
        <div className="mx-3">
          <p className="font-bold">Lưu ý Quan Trọng Trước Khi Mua Vé</p>
          <ul className="list-disc ml-4 leading-6">
            <li>
              Vé sự kiện 2024-25 2NE1 ASIA TOUR [WELCOME BACK] IN HO CHI MINH
              chỉ có thể đươc mua thông qua nền tảng của Ticketbox (bao gồm
              trang web và ứng dụng Ticketbox). Vui lòng kiểm tra kỹ thông tin
              và địa chỉ email trước khi tiến hành mua vé.
            </li>
            <li>
              NGƯỜI MUA VÉ là bất kỳ cá nhân nào mua vé theo các Điều khoản &
              Quy định này. NGƯỜI CÓ VÉ là người sở hữu/kiểm soát vé để vào bên
              trong sự kiện vào ngày diễn ra sự kiện. Mỗi vé chỉ có giá trị cho
              một (01) người sở hữu vé cho một (01) lần vào địa điểm tổ chức sự
              kiện.
            </li>
            <li>
              Vui lòng không mua vé từ các nguồn khác ngoài nền tảng chính thức
              được Ban Tổ Chức công bố để tránh vé giả hoặc gian lận. Ban Tổ
              Chức không chịu trách nhiệm giải quyết các trường hợp liên quan
              đến những vé này.
            </li>
            <li>
              Bằng cách mua vé, bạn xác nhận rằng mình đã chấp nhận tất cả các
              Điều Khoản và Điều Kiện của Ban Tổ Chức. Trước khi mua vé và tham
              gia sự kiện, vui lòng đảm bảo rằng bạn tuân thủ tất cả các Hướng
              dẫn để tránh bất kỳ sự bất tiện nào tại sự kiện.
            </li>
          </ul>
        </div> */}
        <div
          className={`absolute bottom-0 h-[70px] w-full bg-white blur-[20px] transition-all duration-300 ease-in-out ${
            isExpanded ? "opacity-0" : "opacity-95"
          }`}
        ></div>
        <button
          onClick={onClickExpanded}
          className="absolute flex justify-center bottom-0 w-full z-10 outline-none"
        >
          {isExpanded ? (
            <MdExpandLess
              className="hover:-translate-y-2 transition-transform duration-500 h-8 w-8 rounded-full"
              size={30}
              color="black"
            />
          ) : (
            <MdExpandMore
              className="hover:translate-y-2 transition-transform duration-500 h-8 w-8 rounded-full"
              size={30}
              color="black"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default IntroduceEvent;
