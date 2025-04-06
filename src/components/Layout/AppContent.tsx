import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getNavigationItems } from "./navigationConfig";
import LayoutSwitcher from "./LayoutSwitcher";
import NotificationPanel from "../Notifications/NotificationPanel";
import Home from "../Home";
import FinancialChart from "../FinancialChart";
import About from "../About";
import Login from "../Login";
import Portfolio from "../Portfolio/Portfolio";
import MonitoringDashboard from "../Monitoring/MonitoringDashboard";
import ServiceDetails from "../Monitoring/ServiceDetails";
import EventsCalendar from "../Events/EventsCalendar";
import BacktestDashboard from "../StrategyBuilder/BacktestDashboard";
import Dashboard from "../Dashboard/Dashboard";
import WorkflowsPage from "../Workflows/WorkflowsPage";
import Research from "../Research";

interface AppContentProps {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}

const AppContent: React.FC<AppContentProps> = ({
  colorMode,
  toggleColorMode,
}) => {
  const { isAuthenticated } = useAuth();
  const menuItems = getNavigationItems();

  return (
    <div className={`min-h-screen ${colorMode}`}>
      <LayoutSwitcher
        colorMode={colorMode}
        menuItems={menuItems}
        onColorModeToggle={toggleColorMode}
      >
        <main
          className={`${
            colorMode === "dark"
              ? "bg-gray-900 text-gray-100"
              : "bg-gray-100 text-gray-900"
          } min-h-screen`}
        >
          <Routes>
            <Route path="/" element={<Home colorMode={colorMode} />} />
            <Route
              path="/chart"
              element={
                <ProtectedRoute>
                  <FinancialChart colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolios"
              element={
                <ProtectedRoute>
                  <Portfolio colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strategy-builder"
              element={
                <ProtectedRoute>
                  <BacktestDashboard colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsCalendar colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflows"
              element={
                <ProtectedRoute>
                  <WorkflowsPage colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <MonitoringDashboard colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring/service/:id"
              element={
                <ProtectedRoute>
                  <ServiceDetails colorMode={colorMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research"
              element={
                <ProtectedRoute>
                  <Research />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About colorMode={colorMode} />} />
            <Route path="/login" element={<Login colorMode={colorMode} />} />
          </Routes>
        </main>
        {isAuthenticated && <NotificationPanel colorMode={colorMode} />}
      </LayoutSwitcher>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default AppContent;
