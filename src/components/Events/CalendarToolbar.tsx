import React from "react";
import { format } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DatePicker from "react-datepicker";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

interface CalendarToolbarProps {
  colorMode: "light" | "dark";
  timezone: string;
  setTimezone: (timezone: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (range: [Date | null, Date | null]) => void;
  showTimelines: boolean;
  setShowTimelines: (show: boolean) => void;
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  colorMode,
  timezone,
  setTimezone,
  dateRange,
  setDateRange,
  showTimelines,
  setShowTimelines,
}) => {
  const [startDate, endDate] = dateRange;

  return (
    <div
      className={`${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg shadow-sm mb-4 flex items-center space-x-6`}
    >
      {/* Timezone Selector */}
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5" />
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border ${
            colorMode === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center space-x-2">
        <CalendarIcon className="w-5 h-5" />
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setDateRange([date, endDate])}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className={`px-3 py-1.5 rounded-lg border ${
              colorMode === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            dateFormat="MMM d, yyyy"
          />
          <span>to</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setDateRange([startDate, date])}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className={`px-3 py-1.5 rounded-lg border ${
              colorMode === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            dateFormat="MMM d, yyyy"
          />
        </div>
      </div>

      {/* Timeline Toggle */}
      <div className="flex items-center space-x-2">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showTimelines}
              onChange={(e) => setShowTimelines(e.target.checked)}
            />
            <div
              className={`block w-10 h-6 rounded-full ${
                colorMode === "dark" ? "bg-gray-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                showTimelines ? "transform translate-x-4" : ""
              }`}
            ></div>
          </div>
          <div className="ml-3 text-sm">Show Timelines</div>
        </label>
      </div>
    </div>
  );
};

export default CalendarToolbar;
