import React, { useState } from "react";
import { Plus } from "lucide-react";
import ScheduleList from "./ScheduleList";
import ScheduleEditor from "./ScheduleEditor";
import { Schedule } from "../../../types/workflow";
import { workflowItems } from "../WorkflowSidebar";

// Mock data for initial schedules
const mockSchedules: Schedule[] = [
  {
    id: "1",
    name: "Daily Data Sync",
    description: "Synchronize market data every day at midnight",
    cronExpression: "0 0 * * *",
    steps: [
      {
        id: "1",
        workflows: [
          { id: "sync", name: "Data Synchronization", type: "sync" },
          { id: "validation", name: "Data Validation", type: "validation" },
        ],
        isParallel: false,
      },
      {
        id: "2",
        workflows: [
          { id: "cleanup", name: "Data Cleanup", type: "cleanup" },
          { id: "audit", name: "Data Audit", type: "audit" },
        ],
        isParallel: true,
      },
    ],
    enabled: true,
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "active",
  },
];

const SchedulesPage: React.FC<{ colorMode: "light" | "dark" }> = ({
  colorMode,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<
    Schedule | undefined
  >();
  const [isDirty, setIsDirty] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState<Partial<Schedule> | null>(
    null
  );

  const handleAddSchedule = () => {
    setSelectedSchedule(undefined);
    setDraftSchedule(null);
    setShowEditor(true);
    setIsDirty(false);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDraftSchedule(null);
    setShowEditor(true);
    setIsDirty(false);
  };

  const handleSaveSchedule = (scheduleData: Omit<Schedule, "id">) => {
    if (selectedSchedule) {
      // Update existing schedule
      setSchedules(
        schedules.map((s) =>
          s.id === selectedSchedule.id
            ? { ...scheduleData, id: selectedSchedule.id }
            : s
        )
      );
    } else {
      // Create new schedule
      setSchedules([
        ...schedules,
        {
          ...scheduleData,
          id: Math.random().toString(36).substring(7),
        },
      ]);
    }
    setShowEditor(false);
    setSelectedSchedule(undefined);
    setDraftSchedule(null);
    setIsDirty(false);
  };

  const handleCloseEditor = () => {
    if (isDirty) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        setShowEditor(false);
        setSelectedSchedule(undefined);
        setDraftSchedule(null);
        setIsDirty(false);
      }
    } else {
      setShowEditor(false);
      setSelectedSchedule(undefined);
      setDraftSchedule(null);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  const handleToggleSchedule = (id: string, enabled: boolean) => {
    setSchedules(
      schedules.map((s) =>
        s.id === id
          ? { ...s, enabled, status: enabled ? "active" : "paused" }
          : s
      )
    );
  };

  const handleScheduleChange = (data: Partial<Schedule>) => {
    setDraftSchedule((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  };

  return (
    <div
      className={`p-6 ${colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Workflow Schedules</h1>
            <p
              className={`${
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage and automate workflow execution schedules
            </p>
          </div>
          <button
            onClick={handleAddSchedule}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            <Plus className="w-4 h-4" />
            <span>Create Schedule</span>
          </button>
        </div>

        <ScheduleList
          colorMode={colorMode}
          schedules={schedules}
          onEditSchedule={handleEditSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onToggleSchedule={handleToggleSchedule}
        />

        {showEditor && (
          <ScheduleEditor
            colorMode={colorMode}
            schedule={selectedSchedule}
            availableWorkflows={workflowItems.map((item) => ({
              id: item.id,
              name: item.name,
              type: item.id,
            }))}
            onSave={handleSaveSchedule}
            onClose={handleCloseEditor}
            onDirty={() => setIsDirty(true)}
            onChange={handleScheduleChange}
            draftSchedule={draftSchedule}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulesPage;
