import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import DatePicker from "react-datepicker";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, X } from "lucide-react";
import { useEvents } from "../../contexts/EventsContext";
import { Event, EventType } from "../../types/events";

interface EventsCalendarProps {
  colorMode: "light" | "dark";
}

const eventTypes: EventType[] = [
  "ICO",
  "Conference",
  "Maintenance",
  "Release",
  "Airdrop",
];

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const getEventStyle = (event: Event) => {
  const styles: { [key in EventType]: string } = {
    ICO: "bg-purple-500 hover:bg-purple-400",
    Conference: "bg-blue-500 hover:bg-blue-400",
    Maintenance: "bg-yellow-500 hover:bg-yellow-400",
    Release: "bg-green-500 hover:bg-green-400",
    Airdrop: "bg-red-500 hover:bg-red-400",
  };

  return styles[event.type];
};

const EventsCalendar: React.FC<EventsCalendarProps> = ({ colorMode }) => {
  const { events, loading, error, fetchEvents, addEvent, deleteEvent } =
    useEvents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: "ICO",
    start: new Date(),
    end: new Date(),
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Only fetch events once when component mounts
  useEffect(() => {
    void fetchEvents();
  }, []); // Empty dependency array

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.start && newEvent.end && newEvent.type) {
      await addEvent(newEvent as Omit<Event, "id">);
      setShowAddModal(false);
      setNewEvent({ type: "ICO", start: new Date(), end: new Date() });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div
        className={`p-6 ${
          colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
        } min-h-screen flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 ${
          colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
        } min-h-screen`}
      >
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      <div className="mb-6 flex justify-between items-center">
        <h1
          className={`text-2xl font-bold ${
            colorMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Events Calendar
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center px-4 py-2 rounded-lg ${
            colorMode === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors duration-200`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      <div
        className={`${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 shadow-lg`}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 250px)" }}
          eventPropGetter={(event) => ({
            className: getEventStyle(event as Event),
          })}
          onSelectEvent={(event) => setSelectedEvent(event as Event)}
          className={colorMode === "dark" ? "dark-calendar" : ""}
        />
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 w-full max-w-md`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Event</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      type: e.target.value as EventType,
                    })
                  }
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start
                  </label>
                  <DatePicker
                    selected={newEvent.start}
                    onChange={(date) =>
                      setNewEvent({ ...newEvent, start: date || new Date() })
                    }
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className={`w-full p-2 rounded-lg border ${
                      colorMode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End</label>
                  <DatePicker
                    selected={newEvent.end}
                    onChange={(date) =>
                      setNewEvent({ ...newEvent, end: date || new Date() })
                    }
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className={`w-full p-2 rounded-lg border ${
                      colorMode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {newEvent.type === "ICO" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Asset
                    </label>
                    <input
                      type="text"
                      value={newEvent.asset || ""}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, asset: e.target.value })
                      }
                      className={`w-full p-2 rounded-lg border ${
                        colorMode === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quote Currency
                    </label>
                    <input
                      type="text"
                      value={newEvent.quoteCurrency || ""}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          quoteCurrency: e.target.value,
                        })
                      }
                      className={`w-full p-2 rounded-lg border ${
                        colorMode === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Exchange
                    </label>
                    <input
                      type="text"
                      value={newEvent.exchange || ""}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, exchange: e.target.value })
                      }
                      className={`w-full p-2 rounded-lg border ${
                        colorMode === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  rows={3}
                />
              </div>

              {(newEvent.type === "Conference" ||
                newEvent.type === "Release") && (
                <div>
                  <label className="block text-sm font-medium mb-1">Link</label>
                  <input
                    type="url"
                    value={newEvent.link || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, link: e.target.value })
                    }
                    className={`w-full p-2 rounded-lg border ${
                      colorMode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              )}

              <button
                onClick={handleAddEvent}
                className={`w-full py-2 rounded-lg ${
                  colorMode === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors duration-200`}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 w-full max-w-md`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">Type:</span>
                <span className="ml-2">{selectedEvent.type}</span>
              </div>

              <div>
                <span className="text-sm font-medium">Time:</span>
                <span className="ml-2">
                  {format(selectedEvent.start, "PPp")} -{" "}
                  {format(selectedEvent.end, "PPp")}
                </span>
              </div>

              {selectedEvent.type === "ICO" && (
                <>
                  <div>
                    <span className="text-sm font-medium">Asset:</span>
                    <span className="ml-2">{selectedEvent.asset}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Quote Currency:</span>
                    <span className="ml-2">{selectedEvent.quoteCurrency}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Exchange:</span>
                    <span className="ml-2">{selectedEvent.exchange}</span>
                  </div>
                </>
              )}

              {selectedEvent.description && (
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="mt-1">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.link && (
                <div>
                  <span className="text-sm font-medium">Link:</span>
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {selectedEvent.link}
                  </a>
                </div>
              )}

              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className={`w-full py-2 rounded-lg ${
                  colorMode === "dark"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
                } text-white transition-colors duration-200 mt-4`}
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCalendar;
