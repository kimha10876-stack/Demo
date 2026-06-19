import { useEffect, useState } from "react";
import StepOne from "./steps/Step1_Infor";
import StepTwo from "./steps/StepTwo";
import { useNavigate, useSearchParams } from "react-router";
import SeatChartDesigner from "../../pages/seatmap/Seatmap";
import FinalStep from "./steps/FinalStep";
import eventApi from "../../services/eventApi";
import { EventDetailResponse } from "../../interface/EventInterface";
import companyApi from "../../services/companyApi";
import { CompanyStatus } from "../../interface/company/Company";
import LockPage from "../Lock/LockPage";

// import StepTwo from "./Steps/StepTwo"; // nếu có
// import StepThree from "./Steps/StepThree"; // nếu có

export default function CreateEvent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isStepValid, setIsStepValid] = useState<boolean>(false);
  const [statusCompany, setStatusCompany] = useState<CompanyStatus>();

  // Lấy step từ URL, nếu không có thì mặc định là 0
  const getStepFromUrl = () => {
    const stepFromUrl = searchParams.get("step");
    return stepFromUrl ? Math.max(parseInt(stepFromUrl, 10) || 1, 1) : 1;
  };
  const [step, setStep] = useState<number>(getStepFromUrl);

  const getEventIdFromUrl = () => {
    const eventIdFromUrl = Number(searchParams.get("id"));
    return eventIdFromUrl;
  };
  const [eventId, setEventId] = useState<number>(getEventIdFromUrl);
  const [event, setEvent] = useState<EventDetailResponse>();

  const checkStatusCompany = async () => {
    const response = await companyApi.isAccountHaveCompany();
    // console.log(response);
    if (response.data.result) {
      setStatusCompany(response.data.result.status);
    }
  };
  // console.log(statusCompany);

  useEffect(() => {
    checkStatusCompany();
  }, []);

  // Đồng bộ URL params với state khi URL thay đổi
  useEffect(() => {
    setStep(getStepFromUrl());
    setEventId(getEventIdFromUrl());
  }, [searchParams]);

  useEffect(() => {
    const fetchUpdate = async () => {
      if (eventId) {
        const updateEvent = await eventApi.getEventDetail(eventId);
        // console.log(updateEvent.data.result);
        if (updateEvent.data.result) {
          setEvent(updateEvent.data.result);
        }
      }
    };
    fetchUpdate();
  }, [eventId, searchParams]);

  const updateStep = (newStep: number) => {
    navigate(`?id=${eventId}&step=${newStep}`); // Cập nhật URL mà không reload
    setStep(newStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            event={event}
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      case 2:
        return (
          <StepTwo
            event={event}
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      case 3:
        return (
          <SeatChartDesigner
            event={event}
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      case 4:
        return (
          <FinalStep
            event={event}
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      default:
        return <p>Hoàn tất hoặc bước không hợp lệ</p>;
    }
  };

  return (
    <div
      className={`p-6 ${
        step == 3 ? "w-full bg-gray-200" : "max-w-[1000px]"
      }  mx-auto`}
    >
      {(statusCompany == "PENDING" || statusCompany == "REJECTED") && (
        <LockPage message="Công ty của bạn chưa được quyền thao tác do chưa được chấp nhận" />
      )}
      <div className="mb-6">
        <p
          className={`${
            step == 3 ? "text-black" : "text-white"
          } font-semibold text-xl`}
        >
          Tạo sự kiện
        </p>
        <p className={`${step == 3 ? "text-black/70" : "text-white/70"}`}>
          Bước {step} trong 4
        </p>
      </div>

      {renderStep()}
    </div>
  );
}
