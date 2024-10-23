import React from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  type: string;
  description: string;
}

interface TimelineProps {
  colorMode: 'light' | 'dark';
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ colorMode, events }) => {
  return (
    <div className={`mt-6 ${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <div className="relative">
        {/* Timeline line */}
        <div
          className={`absolute left-4 top-0 bottom-0 w-0.5 ${
            colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        />

        {/* Timeline events */}
        <div className="space-y-6 relative">
          {events.map((event) => (
            <div key={event.id} className="ml-12">
              {/* Event dot */}
              <div
                className={`absolute left-3.5 w-3 h-3 rounded-full ${
                  colorMode === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                } -translate-x-1/2`}
              />

              {/* Event content */}
              <div
                className={`p-4 rounded-lg ${
                  colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {event.date}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      colorMode === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;