import React from 'react';
import { Views } from 'react-big-calendar';
import { LayoutGrid, Calendar as CalendarViewIcon, Clock } from 'lucide-react';
import SearchEvents from './SearchEvents';
import ExportEvents from './ExportEvents';
import { useEvents } from '../../contexts/EventsContext';
import { format } from 'date-fns';
import { Event } from '../../types/events';

interface CalendarToolbarProps {
  colorMode: "light" | "dark";
  timezone: string;
  setTimezone: (timezone: string) => void;
  view: string;
  setView: (view: string) => void;
  date: Date;
  handleNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onNavigate: (date: Date) => void;
}

const timeZones = [
  { name: 'New York', value: 'America/New_York', offset: '-05:00' },
  { name: 'London', value: 'Europe/London', offset: '+00:00' },
  { name: 'Paris', value: 'Europe/Paris', offset: '+01:00' },
  { name: 'Dubai', value: 'Asia/Dubai', offset: '+04:00' },
  { name: 'Tokyo', value: 'Asia/Tokyo', offset: '+09:00' },
  { name: 'Sydney', value: 'Australia/Sydney', offset: '+11:00' },
];

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  colorMode,
  timezone,
  setTimezone,
  view,
  setView,
  date,
  handleNavigate,
  onNavigate,
}) => {
  const { events } = useEvents();

  const handleEventSelect = (event: Event) => {
    const eventDate = new Date(event.start);
    setView(Views.DAY);
    const newDate = new Date(eventDate);
    newDate.setHours(0, 0, 0, 0);
    onNavigate(newDate);
  };

  const getViewLabel = () => {
    const formattedDate = format(date, 'MMMM yyyy');
    switch (view) {
      case Views.MONTH:
        return formattedDate;
      case Views.WEEK:
        return `Week of ${format(date, 'MMM d, yyyy')}`;
      case Views.DAY:
        return format(date, 'MMMM d, yyyy');
      default:
        return formattedDate;
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleNavigate('TODAY')}
          className={`px-4 py-2 rounded-lg ${
            colorMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Today
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavigate('PREV')}
            className={`p-2 rounded-lg ${
              colorMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ←
          </button>
          <button
            onClick={() => handleNavigate('NEXT')}
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
        <SearchEvents
          colorMode={colorMode}
          events={events}
          onEventSelect={handleEventSelect}
        />
        <ExportEvents
          colorMode={colorMode}
          events={events}
          timezone={timezone}
        />
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
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;