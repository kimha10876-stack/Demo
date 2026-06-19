import { useEffect, useRef, useState } from "react"
import { CiCalendar } from "react-icons/ci"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { NavLink } from "react-router"
import { eventTypes } from "../../constants/constants"
import type { EventForConsumer } from "../../interface/EventInterface"
import { formatDateVietnamese, formatMoney } from "../../lib/utils"
import eventApi from "../../services/eventApi"

type Props = {
  eventCategoryId: number
  status: string
}

const EventsByCategory = ({ eventCategoryId, status }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeEvents, setActiveEvents] = useState<EventForConsumer[]>()

  const fetchEvents = async () => {
    const response = await eventApi.getByCategory(eventCategoryId, status)
    if (response.data.code == 200) {
      setActiveEvents(response.data.result)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [eventCategoryId, status])

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -1264, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 1264, behavior: "smooth" })
    }
  }

  const categoryInfo = eventTypes.find((type) => type.id === eventCategoryId)
  const categoryColor = eventCategoryId === 1 ? "#FF8A00" : categoryInfo?.color || "#FF8A00"

  return (
    <div className="py-14 px-4 lg:px-14 bg-gradient-to-b from-black/70 to-black/60">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: categoryColor }}>
            {categoryInfo?.vietnamName}
          </h2>
          <p className="text-white/70 mt-1">Khám phá các sự kiện hấp dẫn</p>
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
        <div ref={containerRef} className="pt-4 pb-6 flex overflow-x-auto lg:overflow-x-hidden gap-6 scrollbar-hide">
          {activeEvents?.map((item) => (
            <div key={item.eventId} className="flex-shrink-0">
              <NavLink to={`event-detail/${item.eventId}`}>
                <div className="relative group w-[340px] h-[200px] overflow-hidden cursor-pointer rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-[1] opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <img
                    className="rounded-xl w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    src={item.bannerURL || "/placeholder.svg"}
                    alt={item.eventName}
                  />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span
                      className="text-white text-sm font-semibold px-6 py-2 rounded-full"
                      style={{ backgroundColor: categoryColor }}
                    >
                      Mua vé
                    </span>
                  </div>
                </div>
              </NavLink>
              <div className="mt-3 text-white font-medium">{item.eventName}</div>
              <div className="font-semibold" style={{ color: categoryColor }}>
                Từ {formatMoney(item.minPrice)}
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <span>
                  <CiCalendar size={18} style={{ color: categoryColor }} />
                </span>
                {formatDateVietnamese(item.date)}
              </div>
            </div>
          ))}
        </div>

        <div
          onClick={scrollLeft}
          className="absolute hidden lg:block bg-black/60 top-[33%] cursor-pointer p-3 left-0 rounded-r-lg hover:bg-[#FF8A00] transition-colors"
        >
          <FaAngleLeft size={18} />
        </div>
        <div
          onClick={scrollRight}
          className="absolute hidden lg:block bg-black/60 top-[33%] cursor-pointer p-3 right-0 rounded-l-lg hover:bg-[#FF8A00] transition-colors"
        >
          <FaAngleRight size={18} />
        </div>
      </div>
    </div>
  )
}

export default EventsByCategory
