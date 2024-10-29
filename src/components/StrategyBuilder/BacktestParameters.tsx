import React, { useState } from 'react';
import { Parameter } from '../../types/backtest';
import { RefreshCw, Play, AlertCircle } from 'lucide-react';

interface BacktestParametersProps {
  colorMode: 'light' | 'dark';
  onRunBacktest: (parameters: Parameter[]) => void;
  isBacktesting: boolean;
}

const defaultParameters: Parameter[] = [
  {
    name: 'lookbackPeriod',
    value: 20,
    type: 'number',
    min: 1,
    max: 100,
    step: 1,
    description: 'Number of periods to look back',
  },
  {
    name: 'profitTarget',
    value: 2.5,
    type: 'number',
    min: 0.1,
    max: 10,
    step: 0.1,
    description: 'Take profit target in %',
  },
  {
    name: 'stopLoss',
    value: 1.5,
    type: 'number',
    min: 0.1,
    max: 10,
    step: 0.1,
    description: 'Stop loss in %',
  },
  {
    name: 'trailingStop',
    value: true,
    type: 'boolean',
    description: 'Enable trailing stop loss',
  },
  {
    name: 'timeframe',
    value: '1h',
    type: 'string',
    description: 'Trading timeframe',
  },
];

const BacktestParameters: React.FC<BacktestParametersProps> = ({
  colorMode,
  onRunBacktest,
  isBacktesting,
}) => {
  const [parameters, setParameters] = useState<Parameter[]>(defaultParameters);
  const [isValid, setIsValid] = useState(true);

  const handleParameterChange = (index: number, value: number | string | boolean) => {
    const newParameters = [...parameters];
    newParameters[index] = { ...newParameters[index], value };
    
    // Validate numeric parameters
    const valid = newParameters.every(param => {
      if (param.type === 'number') {
        const numValue = param.value as number;
        return numValue >= (param.min || -Infinity) && numValue <= (param.max || Infinity);
      }
      return true;
    });
    
    setIsValid(valid);
    setParameters(newParameters);
  };

  const handleReset = () => {
    setParameters(defaultParameters);
    setIsValid(true);
  };

  return (
    <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
      <h2 className="text-xl font-bold mb-4">Strategy Parameters</h2>
      
      <div className="space-y-4">
        {parameters.map((param, index) => (
          <div key={param.name}>
            <label className="block text-sm font-medium mb-1">
              {param.name}
              {param.description && (
                <span className={`ml-2 text-xs ${
                  colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  ({param.description})
                </span>
              )}
            </label>
            
            {param.type === 'number' && (
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value as number}
                  onChange={(e) => handleParameterChange(index, parseFloat(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={param.value as number}
                  onChange={(e) => handleParameterChange(index, parseFloat(e.target.value))}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className={`w-20 px-2 py-1 rounded ${
                    colorMode === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                />
              </div>
            )}
            
            {param.type === 'boolean' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={param.value as boolean}
                  onChange={(e) => handleParameterChange(index, e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Enabled</span>
              </label>
            )}
            
            {param.type === 'string' && (
              <select
                value={param.value as string}
                onChange={(e) => handleParameterChange(index, e.target.value)}
                className={`w-full px-3 py-2 rounded ${
                  colorMode === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="1d">1 day</option>
              </select>
            )}
          </div>
        ))}
      </div>

      {!isValid && (
        <div className="mt-4 p-2 rounded bg-red-100 text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Some parameters are outside valid ranges</span>
        </div>
      )}
      
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onRunBacktest(parameters)}
          disabled={!isValid || isBacktesting}
          className={`flex-1 py-2 px-4 rounded flex items-center justify-center space-x-2 ${
            !isValid || isBacktesting
              ? 'bg-gray-400 cursor-not-allowed'
              : colorMode === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors duration-200`}
        >
          {isBacktesting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run Backtest</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isBacktesting}
          className={`px-4 py-2 rounded ${
            colorMode === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors duration-200`}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BacktestParameters;