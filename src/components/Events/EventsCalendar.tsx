import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, X, Calendar as CalendarIcon, Clock, LayoutGrid, Calendar as CalendarViewIcon, Clock as ClockIcon, MapPin, Tag, Building, DollarSign } from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import { Event, EventType } from '../../types/events';
import DayView from './DayView';
import EventDetails from './EventDetails';

interface EventsCalendarProps {
  colorMode: 'light' | 'dark';
}

const eventTypes: EventType[] = ['ICO', 'Conference', 'Maintenance', 'Release', 'Airdrop'];

const timeZones = [
  { name: 'New York', value: 'America/New_York', offset: '-05:00' },
  { name: 'London', value: 'Europe/London', offset: '+00:00' },
  { name: 'Paris', value: 'Europe/Paris', offset: '+01:00' },
  { name: 'Dubai', value: 'Asia/Dubai', offset: '+04:00' },
  { name: 'Tokyo', value: 'Asia/Tokyo', offset: '+09:00' },
  { name: 'Sydney', value: 'Australia/Sydney', offset: '+11:00' },
];

const locales = {
  'en-US': enUS,
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
    ICO: 'bg-purple-500 hover:bg-purple-400',
    Conference: 'bg-blue-500 hover:bg-blue-400',
    Maintenance: 'bg-yellow-500 hover:bg-yellow-400',
    Release: 'bg-green-500 hover:bg-green-400',
    Airdrop: 'bg-red-500 hover:bg-red-400',
  };
  
  return styles[event.type];
};

const EventsCalendar: React.FC<EventsCalendarProps> = ({ colorMode }) => {
  const { events, loading, error, fetchEvents, addEvent, deleteEvent } = useEvents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [timezone, setTimezone] = useState(timeZones[0].value);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'ICO',
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    void fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.start && newEvent.end && newEvent.type) {
      await addEvent(newEvent as Omit<Event, 'id'>);
      setShowAddModal(false);
      setNewEvent({ type: 'ICO', start: selectedDate || new Date(), end: selectedDate || new Date() });
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
      end: date
    });
    setShowDayView(false);
    setShowAddModal(true);
  };

  const getViewLabel = () => {
    switch (view) {
      case Views.MONTH:
        return format(date, 'MMMM yyyy');
      case Views.WEEK:
        return `Week of ${format(date, 'MMM d, yyyy')}`;
      case Views.DAY:
        return format(date, 'MMMM d, yyyy');
      default:
        return format(date, 'MMMM yyyy');
    }
  };

  const renderEventTypeFields = () => {
    switch (newEvent.type) {
      case 'ICO':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Asset</span>
                </div>
              </label>
              <input
                type="text"
                value={newEvent.asset || ''}
                onChange={(e) => setNewEvent({ ...newEvent, asset: e.target.value })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Quote Currency</span>
                </div>
              </label>
              <input
                type="text"
                value={newEvent.quoteCurrency || ''}
                onChange={(e) => setNewEvent({ ...newEvent, quoteCurrency: e.target.value })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Exchange</span>
                </div>
              </label>
              <input
                type="text"
                value={newEvent.exchange || ''}
                onChange={(e) => setNewEvent({ ...newEvent, exchange: e.target.value })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </>
        );
      case 'Conference':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
              </label>
              <input
                type="text"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Speakers (comma-separated)</label>
              <input
                type="text"
                value={newEvent.speakers?.join(', ') || ''}
                onChange={(e) => setNewEvent({ ...newEvent, speakers: e.target.value.split(',').map(s => s.trim()) })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="John Doe, Jane Smith"
              />
            </div>
          </>
        );
      case 'Release':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Version</span>
                </div>
              </label>
              <input
                type="text"
                value={newEvent.version || ''}
                onChange={(e) => setNewEvent({ ...newEvent, version: e.target.value })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="v1.0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Changelog (one item per line)</label>
              <textarea
                value={newEvent.changelog?.join('\n') || ''}
                onChange={(e) => setNewEvent({ ...newEvent, changelog: e.target.value.split('\n').filter(s => s.trim()) })}
                className={`w-full p-2 rounded-lg border ${
                  colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                rows={4}
                placeholder="Added new feature&#10;Fixed bug&#10;Improved performance"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const CustomToolbar = () => (
    <div className={`flex items-center justify-between p-4 ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDate(new Date())}
          className={`px-4 py-2 rounded-lg ${
            colorMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Today
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDate(new Date(date.setMonth(date.getMonth() - 1)))}
            className={`p-2 rounded-lg ${
              colorMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ←
          </button>
          <button
            onClick={() => setDate(new Date(date.setMonth(date.getMonth() + 1)))}
            className={`p-2 rounded-lg ${
              colorMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            →
          </button>
        </div>
        <h2 className="text-lg font-semibold">{getViewLabel()}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={`px-3 py-2 rounded-lg ${
            colorMode === 'dark'
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          }`}
        >
          {timeZones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.name} (UTC{tz.offset})
            </option>
          ))}
        </select>
        <div className="flex space-x-2">
          <button
            onClick={() => setView(Views.MONTH)}
            className={`p-2 rounded-lg ${
              view === Views.MONTH
                ? colorMode === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : colorMode === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView(Views.WEEK)}
            className={`p-2 rounded-lg ${
              view === Views.WEEK
                ? colorMode === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : colorMode === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <CalendarViewIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView(Views.DAY)}
            className={`p-2 rounded-lg ${
              view === Views.DAY
                ? colorMode === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : colorMode === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ClockIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 ${colorMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${colorMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${colorMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${colorMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Events Calendar
        </h1>
        <button
          onClick={() => handleOpenAddEvent(selectedDate || new Date())}
          className={`flex items-center px-4 py-2 rounded-lg ${
            colorMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors duration-200`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      <div className={`${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 250px)' }}
          eventPropGetter={(event) => ({
            className: getEventStyle(event as Event),
          })}
          onSelectEvent={(event) => handleEventClick(event as Event)}
          onSelectSlot={({ start }) => handleDayClick(start)}
          selectable
          className={colorMode === 'dark' ? 'dark-calendar' : ''}
          view={view}
          onView={setView as any}
          date={date}
          onNavigate={setDate}
          components={{
            toolbar: CustomToolbar,
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
        />
      </div>

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Event</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start</label>
                  <DatePicker
                    selected={newEvent.start}
                    onChange={(date) => setNewEvent({ ...newEvent, start: date || new Date() })}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className={`w-full p-2 rounded-lg border ${
                      colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End</label>
                  <DatePicker
                    selected={newEvent.end}
                    onChange={(date) => setNewEvent({ ...newEvent, end: date || new Date() })}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className={`w-full p-2 rounded-lg border ${
                      colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {renderEventTypeFields()}

              <div>
                <label className="block text-sm font-medium mb-1">Event Link (optional)</label>
                <input
                  type="url"
                  value={newEvent.link || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${
                    colorMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  placeholder="https://"
                />
              </div>

              <button
                onClick={handleAddEvent}
                className={`w-full py-2 rounded-lg ${
                  colorMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors duration-200`}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day View Modal */}
      {showDayView && selectedDate && (
        <DayView
          colorMode={colorMode}
          date={selectedDate}
          events={events.filter(event => {
            const eventDate = new Date(event.start);
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

      {/* Event Details Modal */}
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