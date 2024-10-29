import React, { useState } from 'react';
import { FileDown, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { Event } from '../../types/events';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface ExportEventsProps {
  colorMode: 'light' | 'dark';
  events: Event[];
  timezone: string;
}

const ExportEvents: React.FC<ExportEventsProps> = ({ colorMode, events, timezone }) => {
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const exportToExcel = () => {
    if (!startDate || !endDate) return;

    const filteredEvents = events.filter(event => {
      const eventDate = utcToZonedTime(new Date(event.start), timezone);
      return eventDate >= startDate && eventDate <= endDate;
    });

    const csvContent = [
      ['Title', 'Type', 'Start Date', 'End Date', 'Description', 'Location', 'Link'].join(','),
      ...filteredEvents.map(event => [
        `"${event.title}"`,
        event.type,
        format(utcToZonedTime(new Date(event.start), timezone), 'yyyy-MM-dd HH:mm:ss'),
        format(utcToZonedTime(new Date(event.end), timezone), 'yyyy-MM-dd HH:mm:ss'),
        `"${event.description || ''}"`,
        `"${event.location || ''}"`,
        `"${event.link || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `events_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center px-4 py-2 rounded-lg ${
          colorMode === 'dark'
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-white hover:bg-gray-50'
        } border ${
          colorMode === 'dark' ? 'border-gray-600' : 'border-gray-300'
        }`}
      >
        <FileDown className="w-4 h-4 mr-2" />
        Export
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${
            colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg p-6 w-full max-w-md`}>
            <h2 className="text-xl font-bold mb-4">Export Events</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setDateRange([date, endDate])}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className={`w-full p-2 rounded-lg border ${
                        colorMode === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      dateFormat="MMM d, yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setDateRange([startDate, date])}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className={`w-full p-2 rounded-lg border ${
                        colorMode === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      dateFormat="MMM d, yyyy"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    colorMode === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={exportToExcel}
                  disabled={!startDate || !endDate}
                  className={`px-4 py-2 rounded-lg ${
                    !startDate || !endDate
                      ? 'bg-gray-400 cursor-not-allowed'
                      : colorMode === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportEvents;