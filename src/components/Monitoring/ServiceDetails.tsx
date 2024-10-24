import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Server,
  ArrowLeft,
} from "lucide-react";
import { ServiceHealth, StatusType } from "../../types/monitoring";

interface ServiceDetailsProps {
  colorMode: "light" | "dark";
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ colorMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock service data - in a real app, fetch this based on the ID
  const service: ServiceHealth = {
    id: id || "",
    name: "Authentication Service",
    endpoint: "/auth/health",
    loading: false,
    health: {
      serviceName: "Authentication Service",
      metrics: [
        { name: "CPU Usage", value: 45, unit: "%" },
        { name: "Memory", value: 2.8, unit: "GB" },
        { name: "Requests/sec", value: 850 },
        { name: "Latency", value: 120, unit: "ms" },
        { name: "Error Rate", value: 0.02, unit: "%" },
        { name: "Success Rate", value: 99.98, unit: "%" },
        { name: "Active Users", value: 15420 },
        { name: "Cache Hit Rate", value: 95.5, unit: "%" },
      ],
      statuses: [
        {
          title: "System Status",
          description: "System operating normally",
          type: "valid",
        },
        {
          title: "Database Connection",
          description: "Connected to database",
          type: "valid",
        },
        {
          title: "Cache Status",
          description: "Cache performing well",
          type: "valid",
        },
      ],
    },
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/monitoring")}
          className={`flex items-center space-x-2 mb-4 ${
            colorMode === "dark" ? "text-gray-300" : "text-gray-600"
          } hover:opacity-80`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Monitoring</span>
        </button>
        <div className="flex items-center space-x-3">
          <Server
            className={`h-6 w-6 ${
              colorMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h1
            className={`text-2xl font-bold ${
              colorMode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {service.name}
          </h1>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {service.health?.metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <div
              className={`text-sm ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {metric.name}
            </div>
            <div className="text-2xl font-semibold mt-1">
              {metric.value}
              {metric.unit && (
                <span className="text-sm ml-1">{metric.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Checks */}
      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } p-6 shadow`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            colorMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Status Checks
        </h2>
        <div className="space-y-4">
          {service.health?.statuses.map((status, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                status.type === "valid"
                  ? colorMode === "dark"
                    ? "bg-green-900/30"
                    : "bg-green-50"
                  : status.type === "warning"
                  ? colorMode === "dark"
                    ? "bg-yellow-900/30"
                    : "bg-yellow-50"
                  : colorMode === "dark"
                  ? "bg-red-900/30"
                  : "bg-red-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.type)}
                <div>
                  <div
                    className={`font-medium ${
                      status.type === "valid"
                        ? "text-green-500"
                        : status.type === "warning"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {status.title}
                  </div>
                  <div
                    className={`text-sm ${
                      colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {status.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
