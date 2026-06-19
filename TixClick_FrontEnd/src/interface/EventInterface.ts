import React from "react";

export interface CreateEvent {
  eventName: string;
  location: string;
  typeEvent: string;
  description: string;
  categoryId: string;
  files: ImageEvent[];
}

export interface EventType {
  id: number;
  name: string;
  englishName?: string;
  vietnamName?: string;
  color: string;
  img: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface ImageEvent {
  file: File | null;
}

export interface EventForConsumer {
  bannerURL: string;
  eventId: number;
  logoURL: string;
  eventName: string;
  minPrice: number;
  date: string;
}

export interface EventDetailResponse {
  eventId: number;
  eventName: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  locationName: string;
  status: EventStatus;
  typeEvent: string;
  countView: number;
  logoURL: string;
  bannerURL: string;
  description: string;
  startDate: string;
  endDate: string;
  urlOnline: null;
  eventCategory: string;
  eventCategoryId: number;
  countTicketSold: null;
  totalRevenue: null;
  haveSeatMap: boolean;
  eventActivityDTOList: EventActivityDTOList[];
  price: number;
  companyURL: string;
  companyName: string;
  descriptionCompany: string;
}

export interface EventActivityDTOList {
  eventActivityId: number;
  activityName: string;
  dateEvent: Date;
  startTimeEvent: string;
  endTimeEvent: string;
  startTicketSale: Date;
  endTicketSale: Date;
  seatMapId?: number;
  eventId: number;
  createdBy?: number;
  soldOut?: boolean;
  tickets?: Ticket[] | undefined;
}

export interface Ticket {
  ticketId?: number;
  ticketName: string;
  ticketCode: string;
  createdDate: Date;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  status: boolean;
  textColor: string;
  seatBackgroundColor: string;
  accountId: number;
  eventId: number;
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  ENDED = "ENDED",
}
