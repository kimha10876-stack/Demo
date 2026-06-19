import { EventStatus } from "../EventInterface";

export interface EventType {
  id: number;
  name: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface EventReview {
  eventId: number;
  eventName: string;
  location: string;
  logoURL: string;
  bannerURL: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  typeEvent: "ONLINE" | "OFFLINE";
  description: string;
  categoryId: number;
  organizerId: number;
  companyId: number;
}

export interface Event {
  name: string;
  date: string;
  location: string;
  attendees: number;
  priceRange: string;
  status: "pending" | "approved" | "rejected";
}

export interface EventManagement {
  id: string;
  name: string;
  date: Date;
}

export interface SelectedEvent {
  id: number;
  name: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
  status: string;
  type: string;
  description: string;
  budget: number;
  sponsors: string[];
  speakers: string[];
}

export interface EventResponse {
  eventId: number;
  eventName: string;
  locationName: string;
  description: string;
  bannerURL: string;
  logoURL: string;
  eventCode: string;
  city: string;
  district: string;
  contractCode: string;
  ward: string;
  status: EventStatus;
  typeEvent: string;
  organizerId: number;
  organizerName: string;
  companyId: number;
  companyName: string;
}
