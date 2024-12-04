import React from "react";
import {
  Database,
  RefreshCcw,
  History,
  FileCheck,
  GitCompare,
  Workflow,
  FileSearch,
  Scale,
} from "lucide-react";

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

interface WorkflowSidebarProps {
  colorMode: "light" | "dark";
  selectedWorkflow: string;
  onSelectWorkflow: (id: string) => void;
}

export const workflowItems: WorkflowItem[] = [
  {
    id: "backpopulate",
    name: "Backpopulate Data",
    description: "Fetch and store historical market data",
    icon: Database,
  },
  {
    id: "sync",
    name: "Data Synchronization",
    description: "Keep market data up to date across sources",
    icon: RefreshCcw,
  },
  {
    id: "cleanup",
    name: "Data Cleanup",
    description: "Clean and normalize historical data",
    icon: FileCheck,
  },
  {
    id: "validation",
    name: "Data Validation",
    description: "Validate data quality and consistency",
    icon: GitCompare,
  },
  {
    id: "migration",
    name: "Data Migration",
    description: "Migrate data between different formats",
    icon: Workflow,
  },
  {
    id: "audit",
    name: "Data Audit",
    description: "Audit data integrity and completeness",
    icon: FileSearch,
  },
  {
    id: "reconciliation",
    name: "Data Reconciliation",
    description: "Reconcile data across different sources",
    icon: Scale,
  },
];

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  colorMode,
  selectedWorkflow,
  onSelectWorkflow,
}) => {
  return (
    <div
      className={`w-64 h-full overflow-y-auto border-r ${
        colorMode === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Workflows</h2>
        <div className="space-y-2">
          {workflowItems.map((workflow) => {
            const Icon = workflow.icon;
            return (
              <button
                key={workflow.id}
                onClick={() => onSelectWorkflow(workflow.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedWorkflow === workflow.id
                    ? colorMode === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700"
                    : colorMode === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{workflow.name}</div>
                    <div
                      className={`text-xs ${
                        selectedWorkflow === workflow.id
                          ? colorMode === "dark"
                            ? "text-blue-200"
                            : "text-blue-600"
                          : colorMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {workflow.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;
