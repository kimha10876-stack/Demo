import type React from "react"

import { useRef } from "react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { NavLink } from "react-router"
import Top1Img from "../../assets/number-1-svgrepo-com.svg"
import Top2Img from "../../assets/number-2-svgrepo-com.svg"
import Top3Img from "../../assets/number-3-svgrepo-com.svg"
import Top4Img from "../../assets/number-4-svgrepo-com.svg"
import Top5Img from "../../assets/number-5-svgrepo-com.svg"
import Top6Img from "../../assets/number-6-svgrepo-com.svg"
import Top7Img from "../../assets/number-7-svgrepo-com.svg"
import Top8Img from "../../assets/number-8-svgrepo-com.svg"
import Top9Img from "../../assets/number-9-svgrepo-com.svg"
import Top10Img from "../../assets/number_10.svg"
import type { EventForConsumer } from "../../interface/EventInterface"

const top10Img = [Top1Img, Top2Img, Top3Img, Top4Img, Top5Img, Top6Img, Top7Img, Top8Img, Top9Img, Top10Img]

type Props = {
  data: EventForConsumer[]
}

const Top10Event: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="py-14 px-4 lg:px-14 bg-gradient-to-b from-black to-black/90">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#FF8A00]">Top 10 Sự Kiện Nổi Bật</h2>
          <p className="text-white/70 mt-1">Những sự kiện được yêu thích nhất</p>
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
        <div className="flex gap-6 overflow-x-scroll scrollbar-hide lg:overflow-hidden pb-4" ref={containerRef}>
          {data.map((events, index) => (
            <div key={index} className="flex items-center">
              <NavLink to={`/event-detail/${events.eventId}`}>
                <div className="relative group w-[340px] h-[220px] overflow-hidden cursor-pointer rounded-xl">
                  <img
                    src={top10Img[index] || "/placeholder.svg"}
                    className="w-16 absolute top-4 left-4 z-10 drop-shadow-lg"
                    alt={`Top ${index + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-[1] opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  <img
                    src={events.bannerURL || "/placeholder.svg"}
                    className="rounded-xl w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    alt={events.eventName}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                    <h3 className="text-white font-bold truncate">{events.eventName}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/80 text-sm">#{index + 1} Trending</span>
                      <span className="text-white text-sm font-semibold px-4 py-1 rounded-full bg-[#FF8A00] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Mua vé
                      </span>
                    </div>
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
  )
}

export default Top10Event
