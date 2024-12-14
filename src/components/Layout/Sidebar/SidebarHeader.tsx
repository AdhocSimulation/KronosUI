import React from "react";
import { ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarHeaderProps {
  colorMode: "light" | "dark";
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  colorMode,
  isExpanded,
  onToggle,
}) => (
  <div
    className={`p-4 flex items-center ${
      isExpanded ? "justify-between" : "justify-center"
    }`}
  >
    <Link to="/" className="font-bold text-xl flex items-center">
      {isExpanded ? (
        <>
          <BarChart2 className="mr-2" />
          <span>Kronos</span>
        </>
      ) : (
        <BarChart2 />
      )}
    </Link>
    <button
      onClick={onToggle}
      className={`p-1 rounded-lg ${
        colorMode === "dark"
          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
      }`}
    >
      {isExpanded ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </button>
  </div>
);

export default SidebarHeader;
