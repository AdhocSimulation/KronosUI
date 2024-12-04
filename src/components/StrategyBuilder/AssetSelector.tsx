import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

interface AssetSelectorProps {
  colorMode: "light" | "dark";
  availableAssets: string[];
  selectedAssets: string[];
  onAssetChange: (assets: string[]) => void;
  placeholder?: string;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({
  colorMode,
  availableAssets,
  selectedAssets,
  onAssetChange,
  placeholder = "Select assets...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAssetToggle = (asset: string) => {
    const newAssets = selectedAssets.includes(asset)
      ? selectedAssets.filter((a) => a !== asset)
      : [...selectedAssets, asset];
    onAssetChange(newAssets);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 p-1 rounded-md cursor-pointer border ${
          colorMode === "dark"
            ? "bg-gray-700 border-gray-600"
            : "bg-white border-gray-300"
        }`}
      >
        <div className="flex flex-wrap gap-1 max-w-[200px] overflow-hidden">
          {selectedAssets.length > 0 ? (
            <div className="flex items-center text-xs">
              <span className="font-medium">{selectedAssets[0]}</span>
              {selectedAssets.length > 1 && (
                <span className="ml-1 px-1 rounded-full bg-opacity-50 text-xs">
                  +{selectedAssets.length - 1}
                </span>
              )}
            </div>
          ) : (
            <span
              className={`text-xs ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 w-[180px] mt-1 rounded-md shadow-lg ${
            colorMode === "dark" ? "bg-gray-700" : "bg-white"
          } border ${
            colorMode === "dark" ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="p-1">
            {availableAssets.map((asset) => (
              <div
                key={asset}
                onClick={() => handleAssetToggle(asset)}
                className={`flex items-center justify-between px-2 py-1 rounded text-xs cursor-pointer ${
                  selectedAssets.includes(asset)
                    ? colorMode === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700"
                    : colorMode === "dark"
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <span>{asset}</span>
                {selectedAssets.includes(asset) && (
                  <Check className="w-3 h-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetSelector;
