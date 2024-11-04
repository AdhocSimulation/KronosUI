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
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { Plus } from "lucide-react";
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

const EventsCalendar: React.FC<EventsCalendarProps> = ({ colorMode }) => {
  const { events, loading, error, fetchEvents, addEvent, deleteEvent } =
    useEvents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [timezone, setTimezone] = useState("America/New_York");
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: "ICO",
    start: new Date(),
    end: new Date(),
  });

  const convertedEvents = useEventConversion(events, timezone);

  useEffect(() => {
    fetchEvents();
  }, []);

  const getNextDate = (currentDate: Date, currentView: string): Date => {
    switch (currentView) {
      case Views.MONTH:
        return addMonths(currentDate, 1);
      case Views.WEEK:
        return addWeeks(currentDate, 1);
      case Views.DAY:
        return addDays(currentDate, 1);
      default:
        return addDays(currentDate, 1);
    }
  };

  const getPreviousDate = (currentDate: Date, currentView: string): Date => {
    switch (currentView) {
      case Views.MONTH:
        return subMonths(currentDate, 1);
      case Views.WEEK:
        return subWeeks(currentDate, 1);
      case Views.DAY:
        return subDays(currentDate, 1);
      default:
        return subDays(currentDate, 1);
    }
  };

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    switch (action) {
      case "PREV":
        setDate(getPreviousDate(date, view));
        break;
      case "NEXT":
        setDate(getNextDate(date, view));
        break;
      case "TODAY":
        setDate(new Date());
        break;
    }
  };

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
      <div className="mb-6 flex justify-between items-center">
        <h1
          className={`text-2xl font-bold ${
            colorMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Events Calendar
        </h1>
        <button
          onClick={() => handleOpenAddEvent(selectedDate || new Date())}
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
        } rounded-lg shadow-lg`}
      >
        <Calendar
          localizer={localizer}
          events={convertedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 250px)" }}
          onSelectEvent={(event) => handleEventClick(event as Event)}
          onSelectSlot={({ start }) => handleDayClick(start)}
          selectable
          className={colorMode === "dark" ? "dark-calendar" : ""}
          view={view}
          onView={setView as any}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventPropGetter}
          components={{
            toolbar: () => (
              <CalendarToolbar
                colorMode={colorMode}
                timezone={timezone}
                setTimezone={setTimezone}
                view={view}
                setView={setView}
                date={date}
                handleNavigate={handleNavigate}
                onNavigate={setDate}
              />
            ),
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
        />
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
