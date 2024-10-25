import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { ServiceHealth, HealthResponse } from "../../types/monitoring";

interface MonitoringDashboardProps {
  colorMode: "light" | "dark";
}

const mockServices: ServiceHealth[] = [
  {
    id: "1",
    name: "Authentication Service",
    endpoint: "/auth/health",
    loading: false,
  },
  { id: "2", name: "User Service", endpoint: "/users/health", loading: false },
  {
    id: "3",
    name: "Payment Service",
    endpoint: "/payments/health",
    loading: false,
  },
  {
    id: "4",
    name: "Order Service",
    endpoint: "/orders/health",
    loading: false,
  },
  {
    id: "5",
    name: "Notification Service",
    endpoint: "/notifications/health",
    loading: false,
  },
  {
    id: "6",
    name: "Analytics Service",
    endpoint: "/analytics/health",
    loading: false,
  },
  {
    id: "7",
    name: "Search Service",
    endpoint: "/search/health",
    loading: false,
  },
  { id: "8", name: "Cache Service", endpoint: "/cache/health", loading: false },
  { id: "9", name: "Email Service", endpoint: "/email/health", loading: false },
  {
    id: "10",
    name: "Storage Service",
    endpoint: "/storage/health",
    loading: false,
  },
  {
    id: "11",
    name: "Queue Service",
    endpoint: "/queue/health",
    loading: false,
  },
  {
    id: "12",
    name: "Logging Service",
    endpoint: "/logging/health",
    loading: false,
  },
];

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  colorMode,
}) => {
  const [services, setServices] = useState<ServiceHealth[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchServiceHealth = async (
    service: ServiceHealth
  ): Promise<HealthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

    return {
      serviceName: service.name,
      metrics: [
        {
          name: "CPU Usage",
          value: Math.round(Math.random() * 100),
          unit: "%",
        },
        { name: "Memory", value: Math.round(Math.random() * 16), unit: "GB" },
        { name: "Requests/sec", value: Math.round(Math.random() * 1000) },
        { name: "Latency", value: Math.round(Math.random() * 500), unit: "ms" },
      ],
      statuses: [
        {
          title: "System Status",
          description:
            Math.random() > 0.8
              ? "System experiencing high load"
              : "System operating normally",
          type: Math.random() > 0.8 ? "warning" : "valid",
        },
        {
          title: "Database Connection",
          description:
            Math.random() > 0.9
              ? "Database connection failed"
              : "Connected to database",
          type: Math.random() > 0.9 ? "error" : "valid",
        },
        {
          title: "Cache Status",
          description:
            Math.random() > 0.85
              ? "Cache hit ratio low"
              : "Cache performing well",
          type: Math.random() > 0.85 ? "warning" : "valid",
        },
      ],
    };
  };

  const refreshServices = async () => {
    setIsRefreshing(true);
    setServices((prev) =>
      prev.map((service) => ({ ...service, loading: true }))
    );

    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const health = await fetchServiceHealth(service);
          return { ...service, health, loading: false, error: undefined };
        } catch (error) {
          return {
            ...service,
            loading: false,
            error: "Failed to fetch service health",
            health: undefined,
          };
        }
      })
    );

    setServices(updatedServices);
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshServices();

    if (autoRefresh) {
      const interval = setInterval(refreshServices, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${
            colorMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Service Health Monitor
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-lg text-sm ${
                colorMode === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-200"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Search
              className={`absolute left-2.5 top-2.5 h-4 w-4 ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          <button
            onClick={refreshServices}
            disabled={isRefreshing}
            className={`p-2 rounded-lg ${
              colorMode === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            } border ${
              colorMode === "dark" ? "border-gray-700" : "border-gray-200"
            } transition-colors duration-200`}
          >
            <RefreshCw
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""} ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </button>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span
              className={`text-sm ${
                colorMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Auto-refresh
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            colorMode={colorMode}
          />
        ))}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
