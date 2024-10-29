import { useState, useEffect } from 'react';
import { Event } from '../types/events';
import { utcToZonedTime } from 'date-fns-tz';

export function useEventConversion(events: Event[], timezone: string) {
  const [convertedEvents, setConvertedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const converted = events.map(event => ({
      ...event,
      start: utcToZonedTime(new Date(event.start), timezone),
      end: utcToZonedTime(new Date(event.end), timezone),
    }));
    setConvertedEvents(converted);
  }, [events, timezone]);

  return convertedEvents;
}