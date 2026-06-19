export interface EventActivity {
  activityName: string;
  dateEvent: Date;
  startTimeEvent: string;
  endTimeEvent: string;
  startTicketSale: Date;
  endTicketSale: Date;
  eventId: number;
}

export interface EventActivityResponse extends EventActivity {
  eventActivityId: number;
  seatMapId: number;
  createdBy: number;
}
