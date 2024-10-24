import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Server,
} from "lucide-react";
import { ServiceHealth, StatusType } from "../../types/monitoring";

interface ServiceCardProps {
  service: ServiceHealth;
  colorMode: "light" | "dark";
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, colorMode }) => {
  const getOverallStatus = (service: ServiceHealth): StatusType => {
    if (!service.health) return "error";
    const statuses = service.health.statuses;
    if (statuses.some((s) => s.type === "error")) return "error";
    if (statuses.some((s) => s.type === "warning")) return "warning";
    return "valid";
  };

  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case "valid":
        return colorMode === "dark" ? "bg-green-900/50" : "bg-green-50";
      case "warning":
        return colorMode === "dark" ? "bg-yellow-900/50" : "bg-yellow-50";
      case "error":
        return colorMode === "dark" ? "bg-red-900/50" : "bg-red-50";
    }
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

  const getStatusBorder = (status: StatusType): string => {
    switch (status) {
      case "valid":
        return colorMode === "dark" ? "border-green-700" : "border-green-200";
      case "warning":
        return colorMode === "dark" ? "border-yellow-700" : "border-yellow-200";
      case "error":
        return colorMode === "dark" ? "border-red-700" : "border-red-200";
    }
  };

  const status = getOverallStatus(service);

  return (
    <div
      className={`rounded-lg border ${getStatusBorder(status)} ${getStatusColor(
        status
      )} p-4 transition-all duration-200 hover:scale-[1.02]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Server
            className={`h-5 w-5 ${
              colorMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h3 className="font-medium">{service.name}</h3>
        </div>
        {service.loading ? (
          <Activity className="h-5 w-5 animate-pulse text-blue-500" />
        ) : (
          getStatusIcon(status)
        )}
      </div>

      {/* Error State */}
      {service.error && (
        <div
          className={`text-sm ${
            colorMode === "dark" ? "text-red-400" : "text-red-600"
          } mb-4`}
        >
          {service.error}
        </div>
      )}

      {/* Metrics */}
      {service.health && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {service.health.metrics.slice(0, 4).map((metric) => (
              <div
                key={metric.name}
                className={`text-sm ${
                  colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div className="text-xs font-medium opacity-75">
                  {metric.name}
                </div>
                <div className="font-medium">
                  {metric.value}
                  {metric.unit && (
                    <span className="text-xs ml-1">{metric.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Statuses */}
          <div className="space-y-2">
            {service.health.statuses.map((status, index) => (
              <div
                key={index}
                className={`text-sm rounded-md p-2 ${
                  status.type === "valid"
                    ? colorMode === "dark"
                      ? "bg-green-900/30 text-green-200"
                      : "bg-green-50 text-green-700"
                    : status.type === "warning"
                    ? colorMode === "dark"
                      ? "bg-yellow-900/30 text-yellow-200"
                      : "bg-yellow-50 text-yellow-700"
                    : colorMode === "dark"
                    ? "bg-red-900/30 text-red-200"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <div className="font-medium">{status.title}</div>
                <div className="text-xs opacity-75">{status.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
