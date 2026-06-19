import { Armchair, MapPin, Pencil, User } from "lucide-react";
import Img from "../../../../assets/1c7973947f9b163b2376dc6bdc0c6540.jpg";
const EventList = () => {
  return (
    <div>
      <div className="flex flex-col px-4 pt-4 bg-[#31353e] rounded-md shadow-box">
        <div className="flex items-start">
          <img
            src={Img}
            className="w-[120px] h-[68px] md:w-[200px] md:h-[108px] rounded-md"
          />
          <div className="flex flex-col gap-4 ml-4">
            <p className="font-semibold">Sân khấu hài</p>
            <div className="hidden md:flex items-start gap-1">
              <span className="text-white">
                <MapPin size={14} />
              </span>
              <div className="flex flex-col items-start">
                <p className="text-pse-green-second text-sm flex items-center gap-1">
                  White Palace
                </p>
                <p className="text-sm">123s</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex bg-[#414652] mx-[-16px] mt-4 p-4 md:p-2 rounded-b-md">
          <ul className="flex justify-between w-[400px] mx-auto">
            <li className="flex flex-col items-center">
              <User />
              <p className="hidden md:block mt-2">Thành viên</p>
            </li>
            <li className="flex flex-col items-center">
              <Armchair />
              <p className="hidden md:block mt-2">Sơ đồ ghế</p>
            </li>
            <li className="flex flex-col items-center">
              <Pencil />
              <p className="hidden md:block mt-2">Chỉnh sửa</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventList;
