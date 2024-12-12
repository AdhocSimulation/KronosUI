import React from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { WorkflowInfo, WorkflowStep } from "../../../types/workflow";

interface WorkflowStepBuilderProps {
  colorMode: "light" | "dark";
  steps: WorkflowStep[];
  availableWorkflows: WorkflowInfo[];
  onStepsChange: (steps: WorkflowStep[]) => void;
}

const WorkflowStepBuilder: React.FC<WorkflowStepBuilderProps> = ({
  colorMode,
  steps,
  availableWorkflows,
  onStepsChange,
}) => {
  const handleAddWorkflow = (stepIndex: number) => {
    const newSteps = [...steps];
    const step = newSteps[stepIndex];

    // Add first available workflow
    newSteps[stepIndex] = {
      ...step,
      workflows: [...step.workflows, availableWorkflows[0]],
      isParallel: step.workflows.length > 0,
    };

    onStepsChange(newSteps);
  };

  const handleChangeWorkflow = (
    stepIndex: number,
    workflowIndex: number,
    workflowId: string
  ) => {
    const workflow = availableWorkflows.find((w) => w.id === workflowId);
    if (!workflow) return;

    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      workflows: newSteps[stepIndex].workflows.map((w, i) =>
        i === workflowIndex ? workflow : w
      ),
    };

    onStepsChange(newSteps);
  };

  const handleRemoveWorkflow = (stepIndex: number, workflowIndex: number) => {
    const newSteps = [...steps];
    const step = newSteps[stepIndex];

    const updatedWorkflows = step.workflows.filter(
      (_, i) => i !== workflowIndex
    );

    if (updatedWorkflows.length === 0) {
      // Remove the entire step if no workflows remain
      onStepsChange(newSteps.filter((_, i) => i !== stepIndex));
    } else {
      newSteps[stepIndex] = {
        ...step,
        workflows: updatedWorkflows,
        isParallel: updatedWorkflows.length > 1,
      };
      onStepsChange(newSteps);
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, stepIndex) => (
        <div
          key={step.id}
          className={`p-4 rounded-lg ${
            colorMode === "dark" ? "bg-gray-800" : "bg-white"
          } border ${
            colorMode === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {stepIndex + 1}</span>
            <button
              type="button" // Prevent form submission
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                onStepsChange(steps.filter((_, i) => i !== stepIndex));
              }}
              className={`p-1 rounded hover:bg-opacity-80 ${
                colorMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {step.workflows.map((workflow, workflowIndex) => (
              <div
                key={`${workflow.id}-${workflowIndex}`}
                className={`flex items-center h-8 rounded-lg overflow-hidden border ${
                  colorMode === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <select
                  value={workflow.id}
                  onChange={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleChangeWorkflow(
                      stepIndex,
                      workflowIndex,
                      e.target.value
                    );
                  }}
                  className={`text-sm px-3 h-full ${
                    colorMode === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } focus:outline-none focus:ring-0`}
                >
                  {availableWorkflows.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button" // Prevent form submission
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleRemoveWorkflow(stepIndex, workflowIndex);
                  }}
                  className={`w-8 h-full flex items-center justify-center border-l ${
                    colorMode === "dark"
                      ? "border-gray-600 hover:bg-gray-600"
                      : "border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button" // Prevent form submission
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleAddWorkflow(stepIndex);
              }}
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                colorMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkflowStepBuilder;
