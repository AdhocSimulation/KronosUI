import React from "react";
import { Calendar, Clock, Play, Pause, X, ArrowRight } from "lucide-react";
import { Schedule } from "../../../types/workflow";
import { formatDistanceToNow } from "date-fns";
import WorkflowChainVisualizer from "./WorkflowChainVisualizer";

interface ScheduleListProps {
  colorMode: "light" | "dark";
  schedules: Schedule[];
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: string) => void;
  onToggleSchedule: (id: string, enabled: boolean) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  colorMode,
  schedules,
  onEditSchedule,
  onDeleteSchedule,
  onToggleSchedule,
}) => {
  const getStatusColor = (status: "active" | "paused" | "error") => {
    switch (status) {
      case "active":
        return colorMode === "dark" ? "text-green-400" : "text-green-600";
      case "paused":
        return colorMode === "dark" ? "text-yellow-400" : "text-yellow-600";
      case "error":
        return colorMode === "dark" ? "text-red-400" : "text-red-600";
    }
  };

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`p-4 rounded-lg ${
            colorMode === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          {/* Schedule Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">{schedule.name}</h3>
              <div
                className={`text-sm ${
                  colorMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {schedule.description}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleSchedule(schedule.id, !schedule.enabled)}
                className={`p-1.5 rounded-lg ${
                  colorMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                {schedule.enabled ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => onEditSchedule(schedule)}
                className={`p-1.5 rounded-lg ${
                  colorMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Clock className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteSchedule(schedule.id)}
                className={`p-1.5 rounded-lg ${
                  colorMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                } text-red-500`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 opacity-60" />
              <span>{schedule.cronExpression}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 opacity-60" />
              <span>Next run: {formatDistanceToNow(schedule.nextRun)}</span>
            </div>
          </div>

          {/* Workflow Chain Visualization */}
          <div
            className={`mt-4 p-4 rounded-lg ${
              colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <WorkflowChainVisualizer
              colorMode={colorMode}
              steps={schedule.steps}
              compact={true}
            />
          </div>

          {/* Schedule Status */}
          <div
            className={`mt-4 flex items-center justify-between text-sm ${
              colorMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <div>
              {schedule.lastRun && (
                <span>
                  Last run: {formatDistanceToNow(schedule.lastRun)} ago
                </span>
              )}
            </div>
            <div
              className={`flex items-center space-x-2 ${getStatusColor(
                schedule.status
              )}`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span className="capitalize">{schedule.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
