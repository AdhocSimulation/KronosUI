import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChartProvider } from "./contexts/ChartContext";
import { EventsProvider } from "./contexts/EventsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import AppContent from "./components/Layout/AppContent";

const App: React.FC = () => {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthProvider>
      <ChartProvider>
        <EventsProvider>
          <NotificationsProvider>
            <Router>
              <AppContent
                colorMode={colorMode}
                toggleColorMode={toggleColorMode}
              />
            </Router>
          </NotificationsProvider>
        </EventsProvider>
      </ChartProvider>
    </AuthProvider>
  );
};

export default App;
