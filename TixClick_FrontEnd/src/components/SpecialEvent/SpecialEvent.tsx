import type React from "react";

import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { NavLink } from "react-router";
import type { EventForConsumer } from "../../interface/EventInterface";

type Props = {
  specialEvents: EventForConsumer[];
};

const SpecialEvent: React.FC<Props> = ({ specialEvents }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -948, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 948, behavior: "smooth" });
    }
  };

  return (
    <div className="py-14 px-4 lg:px-14 bg-gradient-to-b from-black/90 to-black/80">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#FF8A00]">
            Sự Kiện Đặc Biệt
          </h2>
          <p className="text-white/70 mt-1">
            Những trải nghiệm không thể bỏ lỡ
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-3 rounded-full bg-[#FF8A00]/20 hover:bg-[#FF8A00] text-white transition-colors"
          >
            <FaAngleLeft size={18} />
          </button>
          <button
            onClick={scrollRight}
            className="p-3 rounded-full bg-[#FF8A00]/20 hover:bg-[#FF8A00] text-white transition-colors"
          >
            <FaAngleRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="flex gap-6 overflow-x-scroll scrollbar-hide lg:overflow-hidden pb-4"
          ref={containerRef}
        >
          {specialEvents.map((events, index) => (
            <div key={index}>
              <NavLink to={`/event-detail/${events.eventId}`}>
                <div className="relative group w-[352px] h-full overflow-hidden cursor-pointer rounded-xl">
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-[1] opacity-0 group-hover:opacity-90 transition-opacity"></div> */}
                  <img
                    src={events.logoURL || "/placeholder.svg"}
                    className="rounded-xl w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    alt={events.eventName}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="text-white text-lg font-bold mb-2">
                      {events.eventName}
                    </span>
                    <span className="text-white text-sm font-semibold px-6 py-2 rounded-full bg-[#FF8A00] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Mua vé
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#FF8A00] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    SPECIAL
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>

        <div
          onClick={scrollLeft}
          className="absolute hidden lg:block bg-black/60 top-[42%] cursor-pointer p-3 left-0 rounded-r-lg hover:bg-[#FF8A00] transition-colors"
        >
          <FaAngleLeft size={18} />
        </div>
        <div
          onClick={scrollRight}
          className="absolute hidden lg:block bg-black/60 top-[42%] cursor-pointer p-3 right-0 rounded-l-lg hover:bg-[#FF8A00] transition-colors"
        >
          <FaAngleRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default SpecialEvent;
