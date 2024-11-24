import React from "react";
import { X } from "lucide-react";

interface TagFilterProps {
  colorMode: "light" | "dark";
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  colorMode,
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className={`flex items-center px-3 py-1 rounded-full text-sm ${
              colorMode === "dark"
                ? "bg-blue-900/50 text-blue-200"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <span>{tag}</span>
            <button
              onClick={() => onTagRemove(tag)}
              className="ml-2 hover:opacity-75"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags
          .filter((tag) => !selectedTags.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                colorMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
};

export default TagFilter;
