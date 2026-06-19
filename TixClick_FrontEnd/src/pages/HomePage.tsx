import type React from "react"

import { useEffect, useRef, useState } from "react"
import Categories from "../components/Categories/Categories"
import HeroSection from "../components/HeroSlider/HeroSection"
import HeroSlider from "../components/HeroSlider/HeroSlider"
import SpecialEvent from "../components/SpecialEvent/SpecialEvent"
import Top10Event from "../components/SpecialEvent/Top10Event"
import EventsByCategory from "../components/TabEvent/EventsByCategory"
import TabEvent from "../components/TabEvent/TabEvent"
import useTop10Event from "../hooks/useTop10Event"
import type { EventForConsumer } from "../interface/EventInterface"
import eventApi from "../services/eventApi"

const HomePage = () => {
  const [specialEvents, setSpecialEvents] = useState<EventForConsumer[]>([])
  const { data } = useTop10Event()

  const musicRef = useRef<HTMLDivElement | null>(null)
  const sportRef = useRef<HTMLDivElement | null>(null)
  const artRef = useRef<HTMLDivElement | null>(null)
  const otherRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await eventApi.getEventList()
      if (response.data.result.length != 0) {
        setSpecialEvents(response.data.result)
      } else {
        setSpecialEvents([])
      }
    }
    fetchEvents()
  }, [])

  const scrollToCategory = (categoryId: number) => {
    const refMap: Record<number, React.RefObject<HTMLDivElement>> = {
      1: musicRef,
      2: sportRef,
      3: artRef,
      4: otherRef,
    }
    refMap[categoryId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  return (
    <div className="bg-black text-white">
      <HeroSlider />

      <Categories onCategoryClick={scrollToCategory} />
      <Top10Event data={data} />
      <SpecialEvent specialEvents={specialEvents} />
      <TabEvent />
      <div ref={musicRef}>
        <EventsByCategory eventCategoryId={1} status="SCHEDULED" />
      </div>
      <div ref={sportRef}>
        <EventsByCategory eventCategoryId={2} status="SCHEDULED" />
      </div>
      <div ref={artRef}>
        <EventsByCategory eventCategoryId={3} status="SCHEDULED" />
      </div>
      <div ref={otherRef}>
        <EventsByCategory eventCategoryId={4} status="SCHEDULED" />
      </div>
      <HeroSection />
    </div>
  )
}

export default HomePage
