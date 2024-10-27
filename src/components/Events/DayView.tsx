import React from "react";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { X, Clock, MapPin, Link as LinkIcon } from "lucide-react";
import { Event } from "../../types/events";

interface DayViewProps {
  colorMode: "light" | "dark";
  date: Date;
  events: Event[];
  timezone: string;
  onClose: () => void;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onAddEvent: () => void;
}

const DayView: React.FC<DayViewProps> = ({
  colorMode,
  date,
  events,
  timezone,
  onClose,
  onDeleteEvent,
  onAddEvent,
}) => {
  const zonedDate = utcToZonedTime(date, timezone);
  const dayEvents = events.filter((event) => {
    const eventDate = utcToZonedTime(event.start, timezone);
    return format(eventDate, "yyyy-MM-dd") === format(zonedDate, "yyyy-MM-dd");
  });

  const getEventTimeString = (event: Event) => {
    const start = utcToZonedTime(event.start, timezone);
    const end = utcToZonedTime(event.end, timezone);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-full max-w-2xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {format(zonedDate, "MMMM d, yyyy")}
            </h2>
            <p
              className={`text-sm ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {dayEvents.length} events
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddEvent}
              className={`px-4 py-2 rounded-lg ${
                colorMode === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Add Event
            </button>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg ${
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {getEventTimeString(event)}
                    </div>
                    {event.type === "ICO" && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.exchange}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className={`text-sm px-2 py-1 rounded ${
                    colorMode === "dark"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  Delete
                </button>
              </div>

              {event.description && (
                <p
                  className={`mt-2 text-sm ${
                    colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {event.description}
                </p>
              )}

              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-500 hover:underline mt-2"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Event Link
                </a>
              )}
            </div>
          ))}

          {dayEvents.length === 0 && (
            <div
              className={`text-center py-8 ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No events scheduled for this day
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;
