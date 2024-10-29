import React from 'react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  DollarSign,
  Building,
  Tag,
  X
} from 'lucide-react';
import { Event } from '../../types/events';

interface EventDetailsProps {
  colorMode: 'light' | 'dark';
  event: Event;
  onClose: () => void;
  timezone: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ colorMode, event, onClose, timezone }) => {
  const zonedStart = utcToZonedTime(event.start, timezone);
  const zonedEnd = utcToZonedTime(event.end, timezone);

  const getEventTypeColor = (type: string) => {
    const colors = {
      ICO: 'text-purple-500',
      Conference: 'text-blue-500',
      Maintenance: 'text-yellow-500',
      Release: 'text-green-500',
      Airdrop: 'text-red-500'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500';
  };

  const renderEventSpecificDetails = () => {
    switch (event.type) {
      case 'ICO':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Asset: {event.asset}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Quote Currency: {event.quoteCurrency}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Exchange: {event.exchange}</span>
            </div>
          </div>
        );
      case 'Conference':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location: {event.location}</span>
            </div>
            {event.speakers && (
              <div>
                <h4 className="font-medium mb-2">Speakers:</h4>
                <ul className="list-disc list-inside">
                  {event.speakers.map((speaker, index) => (
                    <li key={index}>{speaker}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'Release':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Version: {event.version}</span>
            </div>
            {event.changelog && (
              <div>
                <h4 className="font-medium mb-2">Changelog:</h4>
                <ul className="list-disc list-inside">
                  {event.changelog.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-2xl`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getEventTypeColor(event.type)}`}>
                {event.type}
              </span>
            </div>
            {event.description && (
              <p className={`mt-2 ${colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {event.description}
              </p>
            )}
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{format(zonedStart, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(zonedStart, 'h:mm a')} - {format(zonedEnd, 'h:mm a')}
              </span>
            </div>
          </div>

          {renderEventSpecificDetails()}

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-500 hover:underline"
            >
              <LinkIcon className="w-5 h-5" />
              <span>Event Details</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;