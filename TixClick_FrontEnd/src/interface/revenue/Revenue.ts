export interface RevenueReponse {
  eventActivityDashbroadResponseList: EventActivityDashbroadResponseList[];
  ticketReVenueDashBoardResponseList: TicketReVenueDashBoardResponseList[];
  eventActivityRevenueReportResponseList: EventActivityRevenueReportResponseList[];
}

export interface EventActivityDashbroadResponseList {
  eventActivity: string;
  ticketDashBoardResponseList: TicketDashBoardResponseList[];
}

export interface TicketDashBoardResponseList {
  name: string;
  value: number;
}

export interface EventActivityRevenueReportResponseList {
  eventActivityName: string;
  eventActivityDateReportResponseList: EventActivityDateReportResponseList[];
}

export interface EventActivityDateReportResponseList {
  date: Date;
  revenue: number;
}

export interface TicketReVenueDashBoardResponseList {
  type: string;
  value: number;
}
