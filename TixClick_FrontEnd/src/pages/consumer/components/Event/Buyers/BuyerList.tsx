import { CircleCheck, CircleX, User } from "lucide-react";
import EmptyList from "../../../../../components/EmptyList/EmptyList";
import { EventActivityResponse } from "../../../../../interface/event/EventActivity";
import { Consumer } from "../../../../../interface/company/Consumer";
import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import { formatMoney, parseSeatCode } from "../../../../../lib/utils";

type Props = {
  selectedActivity: EventActivityResponse | undefined;
  consumers: Consumer[] | undefined;
  selectedConsumer: Consumer | undefined;
  onChangeConsumer: (consumer: Consumer) => void;
};

const BuyerList = ({
  selectedActivity,
  consumers,
  onChangeConsumer,
  selectedConsumer,
}: Props) => {
  const renderCheckin = (haveCheckin: boolean): JSX.Element => {
    if (!haveCheckin)
      return (
        <span className="flex justify-center w-full rounded-full">
          <CircleX className="stroke-red-700" />
        </span>
      );
    return (
      <div className="flex justify-center w-full rounded-full">
        <CircleCheck className="stroke-green-700" />
      </div>
    );
  };

  const onClickConsumer = (consumer: Consumer) => {
    onChangeConsumer(consumer);
  };

  return (
    <>
      {!selectedActivity ? (
        <div className="flex justify-center items-center min-h-[calc(100vh - 190px)] h-auto">
          <EmptyList label="Chưa chọn hoạt động" />
        </div>
      ) : (
        <div className="grid grid-cols-12 grid-rows-6 h-[calc(100vh-190px)] my-4 space-x-4">
          <div className="col-span-4 space-y-4 h-[calc(100vh-190px)] overflow-y-auto">
            {consumers?.map((consumer) => (
              <div
                onClick={() => onClickConsumer(consumer)}
                className={clsx(`p-6 border-2 rounded-lg cursor-pointer`, {
                  "border-pse-green":
                    JSON.stringify(consumer) ===
                    JSON.stringify(selectedConsumer),
                })}
              >
                <section className="flex items-center gap-2">
                  <span>
                    <User size={30} />
                  </span>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold">{consumer.username}</p>
                    <p>{consumer.email}</p>
                  </div>
                  <div className="ml-auto">
                    {consumer.ticketPurchases.length} đơn hàng
                  </div>
                </section>
              </div>
            ))}
          </div>

          <div className="col-span-8 row-span-6 h-full px-6">
            {!selectedConsumer ? (
              <EmptyList label="Chọn khách hàng để xem chi tiết" />
            ) : (
              <>
                <div className="h-full w-full overflow-y-auto px-2">
                  {selectedConsumer.ticketPurchases.map((item) => (
                    <>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={item.orderCode}>
                          <AccordionTrigger>
                            <div className="flex gap-2 items-center">
                              <p>{renderCheckin(item.haveCheckin)} </p>
                              <p>Mã vé: {item.orderId}</p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {item.ticketPurchases.map((ticket) => (
                              <div className="flex gap-2 mb-4 items-center">
                                <p className="bg-pse-green text-white rounded-full px-1">
                                  x{ticket.quantity}
                                </p>
                                {/* <p className="text-sm font-semibold">{item.ticketType}</p> */}
                                <div>
                                  Ghế:{" "}
                                  <span className="font-bold">
                                    {parseSeatCode(ticket?.seatCode)}
                                    {" - "}
                                    <span className="font-semibold">
                                      {ticket.zoneName}
                                    </span>
                                  </span>{" "}
                                </div>

                                <div className="flex ml-auto">
                                  <span className="font-bold">
                                    {formatMoney(ticket.price)}
                                  </span>{" "}
                                  <p className="text-sm">
                                    ({ticket.ticketType})
                                  </p>
                                </div>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BuyerList;
