// Shared color utilities for backtest parameters and results
export const getParameterSetColor = (index: number): { border: string; bg: string } => {
    const colors = [
      { border: "border-blue-500", bg: "bg-blue-500/10" },
      { border: "border-green-500", bg: "bg-green-500/10" },
      { border: "border-yellow-500", bg: "bg-yellow-500/10" },
      { border: "border-purple-500", bg: "bg-purple-500/10" },
      { border: "border-pink-500", bg: "bg-pink-500/10" },
    ];
    return colors[index % colors.length];
  };