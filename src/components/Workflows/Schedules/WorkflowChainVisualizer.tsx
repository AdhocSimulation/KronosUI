import React, { useState } from "react";
import {
  ArrowDown,
  Database,
  RefreshCcw,
  FileCheck,
  GitCompare,
  Workflow,
  FileSearch,
  Scale,
} from "lucide-react";
import { WorkflowStep } from "../../../types/workflow";
import WorkflowDetailsModal from "./WorkflowDetailsModal";

interface WorkflowChainVisualizerProps {
  colorMode: "light" | "dark";
  steps: WorkflowStep[];
  compact?: boolean;
}

const WorkflowChainVisualizer: React.FC<WorkflowChainVisualizerProps> = ({
  colorMode,
  steps,
  compact = false,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<{
    id: string;
    name: string;
    type: string;
  } | null>(null);

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case "backpopulate":
        return <Database className="w-5 h-5" />;
      case "sync":
        return <RefreshCcw className="w-5 h-5" />;
      case "cleanup":
        return <FileCheck className="w-5 h-5" />;
      case "validation":
        return <GitCompare className="w-5 h-5" />;
      case "migration":
        return <Workflow className="w-5 h-5" />;
      case "audit":
        return <FileSearch className="w-5 h-5" />;
      case "reconciliation":
        return <Scale className="w-5 h-5" />;
      default:
        return <Workflow className="w-5 h-5" />;
    }
  };

  const getWorkflowColor = (type: string) => {
    switch (type) {
      case "backpopulate":
        return "text-blue-500";
      case "sync":
        return "text-green-500";
      case "cleanup":
        return "text-yellow-500";
      case "validation":
        return "text-purple-500";
      case "migration":
        return "text-indigo-500";
      case "audit":
        return "text-pink-500";
      case "reconciliation":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  // Calculate dynamic height based on number of steps and compact mode
  const containerHeight = compact
    ? Math.max(80, steps.length * 80)
    : Math.max(120, steps.length * 120);

  return (
    <div style={{ height: `${containerHeight}px` }} className="relative">
      <div className="absolute inset-0 flex flex-col justify-evenly">
        {steps.map((step, stepIndex) => (
          <div key={`step-${step.id}`} className="w-full">
            {/* Workflows Container */}
            <div className="flex justify-evenly w-full">
              {step.workflows.map((workflow, workflowIndex) => (
                <button
                  key={`${workflow.id}-${workflowIndex}`}
                  onClick={() => setSelectedWorkflow(workflow)}
                  className={`
                    flex-1 mx-2 p-${
                      compact ? "2" : "4"
                    } rounded-lg border-2 transition-all duration-200
                    ${
                      colorMode === "dark"
                        ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                        : "bg-white border-gray-200 hover:border-blue-400"
                    }
                    flex items-center space-x-3
                  `}
                >
                  <div
                    className={`
                    p-2 rounded-lg
                    ${colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"}
                    ${getWorkflowColor(workflow.type)}
                  `}
                  >
                    {getWorkflowIcon(workflow.type)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${compact ? "text-sm" : ""}`}>
                      {workflow.name}
                    </div>
                    {!compact && (
                      <div
                        className={`text-xs mt-1 ${
                          colorMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {workflow.type}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Step Connector */}
            {stepIndex < steps.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowDown
                  className={`w-6 h-6 ${
                    colorMode === "dark" ? "text-blue-400" : "text-blue-500"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workflow Details Modal */}
      {selectedWorkflow && (
        <WorkflowDetailsModal
          colorMode={colorMode}
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}
    </div>
  );
};

export default WorkflowChainVisualizer;
