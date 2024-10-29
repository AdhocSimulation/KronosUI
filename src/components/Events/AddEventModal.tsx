import React from 'react';
import DatePicker from 'react-datepicker';
import { X, DollarSign, Tag, Building, MapPin } from 'lucide-react';
import { EventType } from '../../types/events';

interface AddEventModalProps {
  colorMode: 'light' | 'dark';
  newEvent: any;
  setNewEvent: (event: any) => void;
  onClose: () => void;
  onSubmit: () => void;
  eventTypes: EventType[];
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  colorMode,
  newEvent,
  setNewEvent,
  onClose,
  onSubmit,
  eventTypes,
}) => {
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
                onChange={(e) => setNewEvent({ ...newEvent, speakers: e.target.value.split(',').map((s: string) => s.trim()) })}
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
                onChange={(e) => setNewEvent({ ...newEvent, changelog: e.target.value.split('\n').filter((s: string) => s.trim()) })}
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Event</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Type</label>
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
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
                onChange={(date) => setNewEvent({ ...newEvent, start: date })}
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
                onChange={(date) => setNewEvent({ ...newEvent, end: date })}
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

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                colorMode === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className={`px-4 py-2 rounded-lg ${
                colorMode === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;