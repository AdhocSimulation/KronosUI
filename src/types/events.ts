export type EventType = 'ICO' | 'Conference' | 'Maintenance' | 'Release' | 'Airdrop';

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
  location?: string;
  speakers?: string[];
  version?: string;
  changelog?: string[];
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}