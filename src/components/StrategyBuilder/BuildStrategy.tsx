import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import {
  Strategy,
  StrategyExpression,
  TimeGranularity,
  PriceType,
  Measure,
} from "../../types/strategy";
import ExpressionBuilder from "./ExpressionBuilder";

interface BuildStrategyProps {
  colorMode: "light" | "dark";
  selectedStrategy: Strategy | null;
  onSave: (strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

const BuildStrategy: React.FC<BuildStrategyProps> = ({
  colorMode,
  selectedStrategy,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(selectedStrategy?.name || "");
  const [description, setDescription] = useState(
    selectedStrategy?.description || ""
  );
  const [expressions, setExpressions] = useState<StrategyExpression[]>(
    selectedStrategy?.expressions || [{ id: "1", expression: "", weight: 1.0 }]
  );
  const [fullExpression, setFullExpression] = useState("");

  useEffect(() => {
    // Build full expression when individual expressions change
    const expr = expressions
      .filter((e) => e.expression.trim() !== "")
      .map((e) => `(${e.expression}) * ${e.weight}`)
      .join(" + ");
    setFullExpression(expr);
  }, [expressions]);

  const handleAddExpression = () => {
    setExpressions([
      ...expressions,
      {
        id: Math.random().toString(36).substr(2, 9),
        expression: "",
        weight: 1.0,
      },
    ]);
  };

  const handleRemoveExpression = (id: string) => {
    setExpressions(expressions.filter((e) => e.id !== id));
  };

  const handleExpressionChange = (id: string, expression: string) => {
    setExpressions(
      expressions.map((e) => (e.id === id ? { ...e, expression } : e))
    );
  };

  const handleWeightChange = (id: string, weight: number) => {
    setExpressions(
      expressions.map((e) => (e.id === id ? { ...e, weight } : e))
    );
  };

  const handleClear = () => {
    setExpressions([{ id: "1", expression: "", weight: 1.0 }]);
    setName("");
    setDescription("");
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      expressions,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto`}
      >
        <h2 className="text-xl font-bold mb-6">
          {selectedStrategy ? "Edit Strategy" : "Create New Strategy"}
        </h2>

        <div className="space-y-6">
          {/* Strategy Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Strategy Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 rounded ${
                colorMode === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 rounded ${
                colorMode === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            />
          </div>

          {/* Full Expression */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Strategy Expression
            </label>
            <div
              className={`w-full px-3 py-2 rounded font-mono text-sm ${
                colorMode === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {fullExpression || "Strategy expression will appear here"}
            </div>
          </div>

          {/* Expression Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Strategy Components</label>
              <button
                onClick={handleAddExpression}
                className={`p-1 rounded-full ${
                  colorMode === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition-colors`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {expressions.map((expr, index) => (
              <div key={expr.id} className="flex items-start space-x-2">
                <div className="flex-1">
                  <ExpressionBuilder
                    colorMode={colorMode}
                    expression={expr.expression}
                    onChange={(value) => handleExpressionChange(expr.id, value)}
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={expr.weight}
                    onChange={(e) =>
                      handleWeightChange(expr.id, parseFloat(e.target.value))
                    }
                    step="0.1"
                    min="0"
                    max="1"
                    className={`w-full px-2 py-1 rounded ${
                      colorMode === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                </div>
                {expressions.length > 1 && (
                  <button
                    onClick={() => handleRemoveExpression(expr.id)}
                    className={`p-1 rounded-full ${
                      colorMode === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleClear}
              className={`px-4 py-2 rounded ${
                colorMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                colorMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                !name.trim() || expressions.some((e) => !e.expression.trim())
              }
              className={`px-4 py-2 rounded flex items-center space-x-2 ${
                !name.trim() || expressions.some((e) => !e.expression.trim())
                  ? "bg-gray-400 cursor-not-allowed"
                  : colorMode === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildStrategy;
