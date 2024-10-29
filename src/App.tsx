import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Sun,
  Moon,
  BarChart2,
  Home as HomeIcon,
  Info,
  LogOut,
  Briefcase,
  Code,
  Calendar,
  LayoutDashboard,
  Activity,
} from "lucide-react";
import FinancialChart from "./components/FinancialChart";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ChartProvider } from "./contexts/ChartContext";
import { EventsProvider } from "./contexts/EventsContext";
import "./styles/chart.css";
import Portfolio from "./components/Portfolio/Portfolio";
import MonitoringDashboard from "./components/Monitoring/MonitoringDashboard";
import ServiceDetails from "./components/Monitoring/ServiceDetails";
import EventsCalendar from "./components/Events/EventsCalendar";
import BacktestDashboard from "./components/StrategyBuilder/BacktestDashboard";

function App() {
  const [colorMode, setColorMode] = React.useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthProvider>
      <ChartProvider>
        <EventsProvider>
          <Router>
            <AppContent
              colorMode={colorMode}
              toggleColorMode={toggleColorMode}
            />
          </Router>
        </EventsProvider>
      </ChartProvider>
    </AuthProvider>
  );
}

function AppContent({
  colorMode,
  toggleColorMode,
}: {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}) {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const menuItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/chart", label: "Live Chart", icon: BarChart2, requireAuth: true },
    {
      path: "/portfolios",
      label: "Portfolios",
      icon: Briefcase,
      requireAuth: true,
    },
    {
      path: "/strategy-builder",
      label: "Strategy Builder",
      icon: Code,
      requireAuth: true,
    },
    {
      path: "/events",
      label: "Events",
      icon: Calendar,
      requireAuth: true,
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      requireAuth: true,
    },
    {
      path: "/monitoring",
      label: "Monitoring",
      icon: Activity,
      requireAuth: true,
    },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <div className={`min-h-screen ${colorMode}`}>
      <nav
        className={`${
          colorMode === "dark"
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800"
        } shadow-md fixed top-0 left-0 right-0 z-10 w-full`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-xl flex items-center">
                <BarChart2 className="mr-2" /> Kronos
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map(
                  (item) =>
                    (!item.requireAuth || isAuthenticated) && (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        active={location.pathname === item.path}
                      >
                        <item.icon className="w-5 h-5 mr-1" />
                        {item.label}
                      </NavLink>
                    )
                )}
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    colorMode === "dark"
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              ) : (
                <NavLink to="/login" active={location.pathname === "/login"}>
                  Login
                </NavLink>
              )}
              <button
                onClick={toggleColorMode}
                className={`ml-4 p-2 rounded-full ${
                  colorMode === "dark"
                    ? "bg-gray-700 text-yellow-400"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {colorMode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main
        className={`${
          colorMode === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-100 text-gray-900"
        } min-h-screen pt-16`}
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
                <div>Dashboard content</div>
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
          <Route path="/about" element={<About colorMode={colorMode} />} />
          <Route path="/login" element={<Login colorMode={colorMode} />} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function NavLink({
  to,
  children,
  active,
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default App;