import React, { useState } from "react";
import WorkflowSidebar, { workflowItems } from "./WorkflowSidebar";
import BackpopulateWorkflow from "./BackpopulateWorkflow";
import DataSyncWorkflow from "./DataSyncWorkflow";
import DataCleanupWorkflow from "./DataCleanupWorkflow";
import DataValidationWorkflow from "./DataValidationWorkflow";
import SchedulesPage from "./Schedules/SchedulesPage";

interface WorkflowsPageProps {
  colorMode: "light" | "dark";
}

const WorkflowsPage: React.FC<WorkflowsPageProps> = ({ colorMode }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowItems[0].id);
  const [showSchedules, setShowSchedules] = useState(false);

  const renderWorkflowContent = () => {
    if (showSchedules) {
      return <SchedulesPage colorMode={colorMode} />;
    }

    switch (selectedWorkflow) {
      case "backpopulate":
        return <BackpopulateWorkflow colorMode={colorMode} />;
      case "sync":
        return <DataSyncWorkflow colorMode={colorMode} />;
      case "cleanup":
        return <DataCleanupWorkflow colorMode={colorMode} />;
      case "validation":
        return <DataValidationWorkflow colorMode={colorMode} />;
      default:
        return (
          <div className="p-6">
            <div
              className={`p-8 rounded-lg ${
                colorMode === "dark" ? "bg-gray-800" : "bg-white"
              } text-center`}
            >
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p
                className={`${
                  colorMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                This workflow is currently under development
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex h-full">
        <WorkflowSidebar
          colorMode={colorMode}
          selectedWorkflow={selectedWorkflow}
          onSelectWorkflow={setSelectedWorkflow}
          showSchedules={showSchedules}
          onToggleSchedules={() => setShowSchedules(!showSchedules)}
        />
        <div className="flex-1 overflow-auto">{renderWorkflowContent()}</div>
      </div>
    </div>
  );
};

export default WorkflowsPage;
