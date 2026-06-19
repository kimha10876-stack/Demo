import CustomDivider from "../Divider/CustomDivider";
import { EventDetailProps } from "./InformationEvent";

const HostEvent: React.FC<EventDetailProps> = ({ eventDetail }) => {
  return (
    <div className="bg-white/80 p-3 pb-8 text-pse-black">
      <div className="w-full max-w-[700px] bg-white p-3 rounded-lg mx-auto">
        <p className="font-bold">Ban Tổ Chức</p>
        <CustomDivider />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-[160px] h-[160px]">
            <img src={eventDetail?.companyURL} />
          </div>
          <div>
            <p className="font-extrabold text-[20px]">
              {eventDetail?.companyName}
            </p>
            <p>{eventDetail?.descriptionCompany}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostEvent;
