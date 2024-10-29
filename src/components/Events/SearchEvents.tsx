import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Event } from '../../types/events';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface SearchEventsProps {
  colorMode: 'light' | 'dark';
  events: Event[];
  onEventSelect: (event: Event) => void;
}

const SearchEvents: React.FC<SearchEventsProps> = ({ colorMode, events, onEventSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (searchTerm.length === 0) {
        // Show all events when focused and no search term
        setFilteredEvents(events);
      } else {
        // Filter events based on search term
        const filtered = events.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
      }
    }
  }, [searchTerm, events, isOpen]);

  const handleSelect = (event: Event) => {
    onEventSelect(event);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
    setFilteredEvents(events); // Show all events on focus
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      ICO: colorMode === 'dark' ? 'text-purple-400' : 'text-purple-600',
      Conference: colorMode === 'dark' ? 'text-blue-400' : 'text-blue-600',
      Maintenance: colorMode === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      Release: colorMode === 'dark' ? 'text-green-400' : 'text-green-600',
      Airdrop: colorMode === 'dark' ? 'text-red-400' : 'text-red-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search events..."
          className={`w-64 pl-9 pr-4 py-2 rounded-lg text-sm ${
            colorMode === 'dark'
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <Search
          className={`absolute left-2.5 top-2.5 h-4 w-4 ${
            colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
      </div>

      {isOpen && filteredEvents.length > 0 && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
            colorMode === 'dark' ? 'bg-gray-700' : 'bg-white'
          } border ${
            colorMode === 'dark' ? 'border-gray-600' : 'border-gray-200'
          } max-h-96 overflow-y-auto`}
        >
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => handleSelect(event)}
              className={`p-3 cursor-pointer ${
                colorMode === 'dark'
                  ? 'hover:bg-gray-600'
                  : 'hover:bg-gray-100'
              } ${index !== 0 ? 'border-t border-gray-600' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className={`text-sm ${
                    colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {format(new Date(event.start), 'MMM d, yyyy h:mm a')}
                  </div>
                  {event.description && (
                    <div className={`text-sm mt-1 ${
                      colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {event.description}
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ml-2 ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredEvents.length === 0 && searchTerm.length > 0 && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
            colorMode === 'dark' ? 'bg-gray-700' : 'bg-white'
          } border ${
            colorMode === 'dark' ? 'border-gray-600' : 'border-gray-200'
          } p-4 text-center`}
        >
          <span className={`text-sm ${
            colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No events found
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchEvents;