import React, { useState, useEffect } from "react";
import { X, Save, Plus, Calendar, Clock } from "lucide-react";
import { Schedule, WorkflowInfo, WorkflowStep } from "../../../types/workflow";
import CronBuilder from "./CronBuilder";
import WorkflowStepBuilder from "./WorkflowStepBuilder";
import WorkflowChainVisualizer from "./WorkflowChainVisualizer";

interface ScheduleEditorProps {
  colorMode: "light" | "dark";
  schedule?: Schedule;
  availableWorkflows: WorkflowInfo[];
  onSave: (schedule: Omit<Schedule, "id">) => void;
  onClose: () => void;
  onDirty: () => void;
  onChange: (data: Partial<Schedule>) => void;
  draftSchedule: Partial<Schedule> | null;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  colorMode,
  schedule,
  availableWorkflows,
  onSave,
  onClose,
  onDirty,
  onChange,
  draftSchedule,
}) => {
  const [formData, setFormData] = useState({
    name: schedule?.name || draftSchedule?.name || "",
    description: schedule?.description || draftSchedule?.description || "",
    cronExpression:
      schedule?.cronExpression || draftSchedule?.cronExpression || "0 * * * *",
    steps: schedule?.steps || draftSchedule?.steps || [],
  });

  // Update form data when draft changes
  useEffect(() => {
    if (draftSchedule) {
      setFormData((prev) => ({
        ...prev,
        ...draftSchedule,
      }));
    }
  }, [draftSchedule]);

  // Notify parent of changes
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    const newData = {
      ...formData,
      [field]: value,
    };
    setFormData(newData);
    onChange(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a schedule name");
      return;
    }

    if (formData.steps.length === 0) {
      alert("Please add at least one workflow step");
      return;
    }

    onSave({
      ...formData,
      enabled: schedule?.enabled ?? true,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "active",
    });
  };

  const handleAddStep = () => {
    const newSteps = [
      ...formData.steps,
      {
        id: Math.random().toString(36).substr(2, 9),
        workflows: [],
        isParallel: false,
      },
    ];
    handleFieldChange("steps", newSteps);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {schedule ? "Edit Schedule" : "Create Schedule"}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${
                    colorMode === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg ${
                    colorMode === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            {/* Schedule Configuration */}
            <div
              className={`p-6 rounded-lg ${
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-medium">Schedule Configuration</h3>
              </div>
              <CronBuilder
                colorMode={colorMode}
                value={formData.cronExpression}
                onChange={(expr) => handleFieldChange("cronExpression", expr)}
              />
            </div>

            {/* Workflow Chain */}
            <div
              className={`p-6 rounded-lg ${
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-lg font-medium">Workflow Chain</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    colorMode === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Step</span>
                </button>
              </div>

              <WorkflowStepBuilder
                colorMode={colorMode}
                steps={formData.steps}
                availableWorkflows={availableWorkflows}
                onStepsChange={(steps) => handleFieldChange("steps", steps)}
              />

              {formData.steps.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">
                    Workflow Chain Preview
                  </h4>
                  <div
                    className={`p-6 rounded-lg ${
                      colorMode === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <WorkflowChainVisualizer
                      colorMode={colorMode}
                      steps={formData.steps}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              colorMode === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            <Save className="w-4 h-4" />
            <span>Save Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditor;
