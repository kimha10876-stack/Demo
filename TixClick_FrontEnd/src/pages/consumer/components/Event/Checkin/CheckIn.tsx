import { useEffect, useState } from "react";
import TicketTable from "./CheckInTable";
import FilterCheckIn from "./FilterCheckIn";
import eventApi from "../../../../../services/eventApi";
import { useParams } from "react-router";
import { TicketCheckin } from "../../../../../interface/ticket/Ticket";
import eventActivityApi from "../../../../../services/eventActivityApi";
import { EventActivityResponse } from "../../../../../interface/event/EventActivity";

const CheckIn = () => {
  const { eventId } = useParams();
  const [ticketCheckin, setTicketCheckin] = useState<TicketCheckin[]>([]);
  const [eventActivity, setEventActivity] = useState<EventActivityResponse[]>(
    []
  );
  const [selectedEventActId, setSelectedEventActId] = useState<string>("");

  const fetchEventActivity = async () => {
    try {
      const response = await eventActivityApi.getByEventId(Number(eventId));
      // console.log(response);
      if (response.data.result.length != 0) {
        setEventActivity(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCheckin = async () => {
    try {
      const response = await eventApi.getCheckIn(Number(selectedEventActId));
      console.log(response.data.result);
      if (response.data.code == 200) {
        setTicketCheckin(response.data.result.checkinStats);
      }
    } catch (error) {
      setTicketCheckin([]);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEventActivity();
  }, [eventId]);

  useEffect(() => {
    fetchCheckin();
  }, [selectedEventActId]);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <FilterCheckIn
        eventActivity={eventActivity}
        selectedEventActId={selectedEventActId}
        setSelectedEventActId={setSelectedEventActId}
      />
      <div className="my-6">
        <TicketTable data={ticketCheckin} />
      </div>
    </div>
  );
};

export default CheckIn;
