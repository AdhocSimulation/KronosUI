import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import DatePicker from "react-datepicker";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import {
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  subWeeks,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format as formatDate,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useEvents } from "../../contexts/EventsContext";
import { Event } from "../../types/events";
import DayView from "./DayView";
import EventDetails from "./EventDetails";
import AddEventModal from "./AddEventModal";
import { useEventConversion } from "../../hooks/useEventConversion";
import CalendarToolbar from "./CalendarToolbar";

interface EventsCalendarProps {
  colorMode: "light" | "dark";
}

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

const eventTypes = [
  "ICO",
  "Conference",
  "Maintenance",
  "Release",
  "Airdrop",
] as const;

const MiniCalendar = ({
  colorMode,
  currentDate,
  onDateChange,
}: {
  colorMode: "light" | "dark";
  currentDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  return (
    <div
      className={`w-full rounded-lg overflow-hidden ${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            {formatDate(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className={`p-1 rounded hover:${
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className={`p-1 rounded hover:${
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium p-2 text-gray-500"
            >
              {day}
            </div>
          ))}
          {days.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={`aspect-square flex items-center justify-center text-sm rounded-full ${
                isSameDay(day, currentDate)
                  ? "bg-blue-500 text-white"
                  : isSameMonth(day, currentDate)
                  ? colorMode === "dark"
                    ? "text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                  : colorMode === "dark"
                  ? "text-gray-600"
                  : "text-gray-400"
              }`}
            >
              {formatDate(day, "d")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const EventsCalendar: React.FC<EventsCalendarProps> = ({ colorMode }) => {
  const { events, loading, error, fetchEvents, addEvent, deleteEvent } =
    useEvents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timezone, setTimezone] = useState("America/New_York");
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: "ICO",
    start: new Date(),
    end: new Date(),
  });

  const convertedEvents = useEventConversion(events, timezone);

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.start && newEvent.end && newEvent.type) {
      const utcStart = zonedTimeToUtc(newEvent.start, timezone);
      const utcEnd = zonedTimeToUtc(newEvent.end, timezone);

      await addEvent({
        ...newEvent,
        start: utcStart,
        end: utcEnd,
      } as Omit<Event, "id">);

      setShowAddModal(false);
      setNewEvent({
        type: "ICO",
        start: selectedDate || new Date(),
        end: selectedDate || new Date(),
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    setSelectedEvent(null);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayView(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleOpenAddEvent = (date: Date) => {
    setNewEvent({
      ...newEvent,
      start: date,
      end: date,
    });
    setShowDayView(false);
    setShowAddModal(true);
  };

  const eventPropGetter = (event: Event) => ({
    className: `event-${event.type}`,
  });

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
      <div className="flex space-x-6">
        {/* Left Sidebar */}
        <div className="w-64 space-y-6">
          <button
            onClick={() => handleOpenAddEvent(currentDate)}
            className={`w-full px-4 py-3 rounded-lg ${
              colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors duration-200 flex items-center justify-center space-x-2`}
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>

          <MiniCalendar
            colorMode={colorMode}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        {/* Main Calendar */}
        <div className="flex-1">
          <div
            className={`rounded-lg ${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg overflow-hidden`}
          >
            <Calendar
              localizer={localizer}
              events={convertedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "calc(100vh - 2rem)" }}
              onSelectEvent={(event) => handleEventClick(event as Event)}
              onSelectSlot={({ start }) => handleDayClick(start)}
              selectable
              className={colorMode === "dark" ? "dark-calendar" : ""}
              view={view}
              onView={setView as any}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventPropGetter}
              components={{
                toolbar: () => (
                  <CalendarToolbar
                    colorMode={colorMode}
                    timezone={timezone}
                    setTimezone={setTimezone}
                    view={view}
                    setView={setView}
                    date={currentDate}
                    handleNavigate={(action) => {
                      switch (action) {
                        case "PREV":
                          setCurrentDate(
                            view === Views.MONTH
                              ? subMonths(currentDate, 1)
                              : view === Views.WEEK
                              ? subWeeks(currentDate, 1)
                              : subDays(currentDate, 1)
                          );
                          break;
                        case "NEXT":
                          setCurrentDate(
                            view === Views.MONTH
                              ? addMonths(currentDate, 1)
                              : view === Views.WEEK
                              ? addWeeks(currentDate, 1)
                              : addDays(currentDate, 1)
                          );
                          break;
                        case "TODAY":
                          setCurrentDate(new Date());
                          break;
                      }
                    }}
                    onNavigate={setCurrentDate}
                  />
                ),
              }}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEventModal
          colorMode={colorMode}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEvent}
          eventTypes={eventTypes}
        />
      )}

      {showDayView && selectedDate && (
        <DayView
          colorMode={colorMode}
          date={selectedDate}
          events={convertedEvents.filter((event) => {
            const eventDate = event.start;
            return (
              eventDate.getFullYear() === selectedDate.getFullYear() &&
              eventDate.getMonth() === selectedDate.getMonth() &&
              eventDate.getDate() === selectedDate.getDate()
            );
          })}
          timezone={timezone}
          onClose={() => setShowDayView(false)}
          onDeleteEvent={handleDeleteEvent}
          onAddEvent={() => handleOpenAddEvent(selectedDate)}
        />
      )}

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          colorMode={colorMode}
          timezone={timezone}
        />
      )}
    </div>
  );
};

export default EventsCalendar;
