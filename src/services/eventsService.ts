import { EventType } from "../types/events";

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  description?: string;
  asset?: string;
  quoteCurrency?: string;
  exchange?: string;
  link?: string;
}

// In-memory storage
let events: Event[] = [
  {
    id: "1",
    title: "NewCoin ICO",
    start: new Date("2024-03-20T10:00:00Z"),
    end: new Date("2024-03-20T12:00:00Z"),
    type: "ICO",
    asset: "NCN",
    quoteCurrency: "USDT",
    exchange: "Binance",
    description: "Initial Coin Offering for NewCoin",
  },
  {
    id: "2",
    title: "Crypto Summit 2024",
    start: new Date("2024-03-22T09:00:00Z"),
    end: new Date("2024-03-23T18:00:00Z"),
    type: "Conference",
    description: "Annual cryptocurrency conference",
    link: "https://example.com/summit",
  },
  {
    id: "3",
    title: "Platform Maintenance",
    start: new Date("2024-03-25T02:00:00Z"),
    end: new Date("2024-03-25T06:00:00Z"),
    type: "Maintenance",
    description: "Scheduled platform maintenance",
  },
  {
    id: "4",
    title: "Token Release",
    start: new Date("2024-03-28T14:00:00Z"),
    end: new Date("2024-03-28T15:00:00Z"),
    type: "Release",
    description: "Major token release event",
    link: "https://example.com/release",
  },
  {
    id: "5",
    title: "Community Airdrop",
    start: new Date("2024-03-30T16:00:00Z"),
    end: new Date("2024-03-30T17:00:00Z"),
    type: "Airdrop",
    description: "Community rewards distribution",
    asset: "REWARD",
    exchange: "Multiple",
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const eventsService = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    await delay(300);
    return events.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  },

  // Add new event
  addEvent: async (event: Omit<Event, "id">): Promise<Event> => {
    await delay(300);
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      start: new Date(event.start),
      end: new Date(event.end),
    };
    events.push(newEvent);
    return newEvent;
  },

  // Update event
  updateEvent: async (event: Event): Promise<Event> => {
    await delay(300);
    const index = events.findIndex((e) => e.id === event.id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    events[index] = {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
    return events[index];
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    await delay(300);
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    events = events.filter((e) => e.id !== id);
  },
};
