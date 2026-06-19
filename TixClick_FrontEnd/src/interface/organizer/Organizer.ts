export interface Event {
    id: string;
    name: string;
    title: string;
    image: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    ticketsSold: number;
    revenue: number;
    description: string;
    ticketTypes: [];
    status: string;
    organizer: Organizer;
}

export interface Organizer {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string;
}

