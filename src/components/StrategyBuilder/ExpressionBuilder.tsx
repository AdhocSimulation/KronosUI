import React, { useState, useEffect } from "react";
import { TimeGranularity, PriceType, Measure } from "../../types/strategy";

interface ExpressionBuilderProps {
  colorMode: "light" | "dark";
  expression: string;
  onChange: (expression: string) => void;
}

const priceTypes: PriceType[] = ["Open", "High", "Low", "Close"];
const granularities: TimeGranularity[] = ["1m", "5m", "30m", "1h"];
const measures: Measure[] = ["Sma", "Ema", "Rsi", "Macd", "BollingerBands"];

const ExpressionBuilder: React.FC<ExpressionBuilderProps> = ({
  colorMode,
  expression,
  onChange,
}) => {
  const [components, setComponents] = useState({
    priceType: "Close" as PriceType,
    granularity: "1m" as TimeGranularity,
    measure: "Sma" as Measure,
    period: 14,
  });

  useEffect(() => {
    const newExpression = `${components.priceType}[${components.granularity}].${components.measure}[${components.period}]`;
    onChange(newExpression);
  }, [components]);

  const handleComponentChange = (
    key: keyof typeof components,
    value: string | number
  ) => {
    setComponents((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={components.priceType}
        onChange={(e) =>
          handleComponentChange("priceType", e.target.value as PriceType)
        }
        className={`px-2 py-1 rounded ${
          colorMode === "dark"
            ? "bg-gray-700 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {priceTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={components.granularity}
        onChange={(e) =>
          handleComponentChange(
            "granularity",
            e.target.value as TimeGranularity
          )
        }
        className={`px-2 py-1 rounded ${
          colorMode === "dark"
            ? "bg-gray-700 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {granularities.map((gran) => (
          <option key={gran} value={gran}>
            {gran}
          </option>
        ))}
      </select>

      <select
        value={components.measure}
        onChange={(e) =>
          handleComponentChange("measure", e.target.value as Measure)
        }
        className={`px-2 py-1 rounded ${
          colorMode === "dark"
            ? "bg-gray-700 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {measures.map((measure) => (
          <option key={measure} value={measure}>
            {measure}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={components.period}
        onChange={(e) =>
          handleComponentChange("period", parseInt(e.target.value))
        }
        min="1"
        className={`w-20 px-2 py-1 rounded ${
          colorMode === "dark"
            ? "bg-gray-700 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      />
    </div>
  );
};

export default ExpressionBuilder;
