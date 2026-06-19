import { useEffect, useRef, useState } from "react"
import { CiCalendar } from "react-icons/ci"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { NavLink } from "react-router"
import type { EventForConsumer } from "../../interface/EventInterface"
import { formatDateVietnamese, formatMoney } from "../../lib/utils"
import eventApi from "../../services/eventApi"

const TabEvent = () => {
  const nowMonth = new Date().getMonth() + 1
  const [activeTab, setActiveTab] = useState<number>(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const [eventWeek, setEventWeek] = useState<EventForConsumer[]>([])
  const [eventMonth, setEventMonth] = useState<EventForConsumer[]>([])
  const [activeEvents, setActiveEvents] = useState<EventForConsumer[]>([])

  const fetchEventWeekend = async () => {
    const response = await eventApi.getWeekend()
    if (response.data.result.length != 0) {
      setEventWeek(response.data.result)
      setActiveEvents(response.data.result)
    }
  }

  const fetchEventMoth = async () => {
    const response = await eventApi.getMonth(nowMonth)
    if (response.data.result.length != 0) {
      setEventMonth(response.data.result)
    }
  }

  useEffect(() => {
    fetchEventWeekend()
    fetchEventMoth()
  }, [nowMonth])

  const changeActiveEvent = () => {
    if (activeTab === 1) {
      setActiveEvents(eventWeek)
    } else {
      setActiveEvents(eventMonth)
    }
  }

  useEffect(() => {
    changeActiveEvent()
  }, [activeTab])

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

  const tabs = [
    { id: 1, label: "Tuần này" },
    { id: 2, label: "Tháng này" },
  ]

  return (
    <div className="py-14 px-4 lg:px-14 bg-gradient-to-b from-black/80 to-black/70">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-8 border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 text-base md:text-lg font-bold focus:outline-none relative ${
                activeTab === tab.id ? "text-[#FF8A00]" : "text-white hover:text-[#FF8A00]/70 transition-colors"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FF8A00] rounded-full"></span>
              )}
            </button>
          ))}
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
          {activeEvents.map((item) => (
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
                    <span className="text-white text-sm font-semibold px-6 py-2 rounded-full bg-[#FF8A00] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Mua vé
                    </span>
                  </div>
                </div>
              </NavLink>
              <div className="mt-3 text-white font-medium">{item.eventName}</div>
              <div className="text-[#FF8A00] font-semibold">Từ {formatMoney(item.minPrice)}</div>
              <div className="flex items-center gap-1 text-white/70">
                <span>
                  <CiCalendar size={18} className="text-[#FF8A00]" />
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

export default TabEvent
