import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

interface CronBuilderProps {
  colorMode: "light" | "dark";
  value: string;
  onChange: (expression: string) => void;
}

const frequencies = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const weekDays = [
  { value: "0", label: "Sun" },
  { value: "1", label: "Mon" },
  { value: "2", label: "Tue" },
  { value: "3", label: "Wed" },
  { value: "4", label: "Thu" },
  { value: "5", label: "Fri" },
  { value: "6", label: "Sat" },
];

const CronBuilder: React.FC<CronBuilderProps> = ({
  colorMode,
  value,
  onChange,
}) => {
  const [frequency, setFrequency] = useState("hourly");
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(1);

  useEffect(() => {
    // Parse initial cron expression
    const parts = value.split(" ");
    if (parts.length === 5) {
      if (parts[1] === "*") {
        setFrequency("hourly");
      } else if (parts[4] === "*") {
        setFrequency("daily");
        setSelectedTime(
          `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`
        );
      } else if (parts[2] === "*") {
        setFrequency("weekly");
        setSelectedDays(parts[4].split(","));
        setSelectedTime(
          `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`
        );
      } else {
        setFrequency("monthly");
        setSelectedDate(parseInt(parts[2]));
        setSelectedTime(
          `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`
        );
      }
    }
  }, [value]);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    const newFrequency = e.currentTarget.value;
    setFrequency(newFrequency);
    const [hours, minutes] = selectedTime.split(":");

    switch (newFrequency) {
      case "hourly":
        onChange("0 * * * *");
        break;
      case "daily":
        onChange(`${minutes} ${hours} * * *`);
        break;
      case "weekly":
        onChange(`${minutes} ${hours} * * 1`);
        setSelectedDays(["1"]);
        break;
      case "monthly":
        onChange(`${minutes} ${hours} 1 * *`);
        setSelectedDate(1);
        break;
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent form submission
    const time = e.target.value;
    setSelectedTime(time);
    const [hours, minutes] = time.split(":");

    switch (frequency) {
      case "daily":
        onChange(`${minutes} ${hours} * * *`);
        break;
      case "weekly":
        onChange(`${minutes} ${hours} * * ${selectedDays.join(",")}`);
        break;
      case "monthly":
        onChange(`${minutes} ${hours} ${selectedDate} * *`);
        break;
    }
  };

  const handleDayToggle = (
    e: React.MouseEvent<HTMLButtonElement>,
    day: string
  ) => {
    e.preventDefault(); // Prevent form submission
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].sort();

    setSelectedDays(newDays);
    const [hours, minutes] = selectedTime.split(":");
    onChange(`${minutes} ${hours} * * ${newDays.join(",")}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault(); // Prevent form submission
    const date = parseInt(e.target.value);
    setSelectedDate(date);
    const [hours, minutes] = selectedTime.split(":");
    onChange(`${minutes} ${hours} ${date} * *`);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {frequencies.map((freq) => (
          <button
            key={freq.value}
            type="button" // Prevent form submission
            value={freq.value}
            onClick={handleFrequencyChange}
            className={`px-3 py-1.5 rounded-lg ${
              frequency === freq.value
                ? colorMode === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : colorMode === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {freq.label}
          </button>
        ))}
      </div>

      {frequency !== "hourly" && (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className={`px-3 py-1.5 rounded ${
              colorMode === "dark"
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-900"
            }`}
          />
        </div>
      )}

      {frequency === "weekly" && (
        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => (
            <button
              key={day.value}
              type="button" // Prevent form submission
              onClick={(e) => handleDayToggle(e, day.value)}
              className={`px-3 py-1.5 rounded ${
                selectedDays.includes(day.value)
                  ? colorMode === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : colorMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      )}

      {frequency === "monthly" && (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <select
            value={selectedDate}
            onChange={handleDateChange}
            className={`px-3 py-1.5 rounded ${
              colorMode === "dark"
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <span>of every month</span>
        </div>
      )}
    </div>
  );
};

export default CronBuilder;
