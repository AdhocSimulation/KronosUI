import { ChartConfigOptions } from "../types/chart";

export const getChartConfiguration = ({
  colorMode,
  selectedChartType,
  selectedStock,
  stockData,
  signalData,
  selectedSignals,
  chartExtremes,
  strategyData,
  selectedStrategies,
}: ChartConfigOptions): Highcharts.Options => {
  const measureSignals = selectedSignals.filter((s) => s.type === "Measure");
  const externalSignals = selectedSignals.filter((s) => s.type === "External");

  const getMainChartHeight = () => {
    if (selectedStrategies.length > 0) {
      return externalSignals.length > 0 ? 70 : 80;
    }
    return externalSignals.length > 0 ? 80 : 90;
  };

  return {
    chart: {
      backgroundColor: colorMode === "dark" ? "#1f2937" : "#ffffff",
      height: "58%",
      animation: false,
      panning: {
        enabled: true,
        type: "x",
      },
      zoomType: "x",
    },
    rangeSelector: {
      enabled: true,
      buttons: [
        {
          type: "day",
          count: 7,
          text: "1w",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
        },
        {
          type: "year",
          count: 1,
          text: "1y",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: undefined,
      inputEnabled: true,
      inputDateFormat: "%Y-%m-%d",
      inputEditDateFormat: "%Y-%m-%d",
      inputDateParser: function (value) {
        return new Date(value).getTime();
      },
      inputStyle: {
        color: colorMode === "dark" ? "#e5e7eb" : "#111827",
        backgroundColor: colorMode === "dark" ? "#374151" : "#ffffff",
      },
      labelStyle: {
        color: colorMode === "dark" ? "#e5e7eb" : "#111827",
      },
    },
    navigator: {
      enabled: true,
      height: 30,
      margin: 20,
      series: {
        color: colorMode === "dark" ? "#3b82f6" : "#2563eb",
        fillOpacity: 0.05,
        lineWidth: 1,
      },
      xAxis: {
        labels: {
          style: {
            color: colorMode === "dark" ? "#9ca3af" : "#6b7280",
          },
        },
      },
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
          style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
        },
        title: {
          text: "OHLC",
          style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
        },
        height: `${getMainChartHeight()}%`,
        lineWidth: 2,
        resize: {
          enabled: true,
        },
        crosshair: {
          label: {
            enabled: true,
            format: "{value:.2f}",
            backgroundColor: colorMode === "dark" ? "#374151" : "#ffffff",
            style: {
              color: colorMode === "dark" ? "#e5e7eb" : "#111827",
            },
          },
          color:
            colorMode === "dark"
              ? "rgba(255, 150, 150, 0.7)"
              : "rgba(0, 0, 0, 0.3)",
          dashStyle: "Dash",
          snap: false,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
          style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
        },
        title: {
          text: "Volume",
          style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
        },
        top: `${getMainChartHeight()}%`,
        height: "10%",
        offset: 0,
        lineWidth: 2,
        crosshair: {
          label: {
            enabled: true,
            format: "{value:,.0f}",
            backgroundColor: colorMode === "dark" ? "#374151" : "#ffffff",
            style: {
              color: colorMode === "dark" ? "#e5e7eb" : "#111827",
            },
          },
          color:
            colorMode === "dark"
              ? "rgba(255, 150, 150, 0.7)"
              : "rgba(0, 0, 0, 0.3)",
          dashStyle: "Dash",
          snap: false,
        },
      },
      ...(selectedStrategies.length > 0
        ? [
            {
              labels: {
                align: "right",
                x: -3,
                style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
              },
              title: {
                text: "Strategies",
                style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
              },
              top: `${getMainChartHeight() + 10}%`,
              height: "10%",
              offset: 0,
              lineWidth: 2,
              min: -1,
              max: 1,
              crosshair: {
                label: {
                  enabled: true,
                  format: "{value:.2f}",
                  backgroundColor: colorMode === "dark" ? "#374151" : "#ffffff",
                  style: {
                    color: colorMode === "dark" ? "#e5e7eb" : "#111827",
                  },
                },
                color:
                  colorMode === "dark"
                    ? "rgba(255, 150, 150, 0.7)"
                    : "rgba(0, 0, 0, 0.3)",
                dashStyle: "Dash",
                snap: false,
              },
            },
          ]
        : []),
      ...(externalSignals.length > 0
        ? [
            {
              labels: {
                align: "right",
                x: -3,
                style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
              },
              title: {
                text: "External Signals",
                style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
              },
              top:
                selectedStrategies.length > 0
                  ? `${getMainChartHeight() + 20}%`
                  : `${getMainChartHeight() + 10}%`,
              height: "10%",
              offset: 0,
              lineWidth: 2,
              min: -1,
              max: 1,
              crosshair: {
                label: {
                  enabled: true,
                  format: "{value:.2f}",
                  backgroundColor: colorMode === "dark" ? "#374151" : "#ffffff",
                  style: {
                    color: colorMode === "dark" ? "#e5e7eb" : "#111827",
                  },
                },
                color:
                  colorMode === "dark"
                    ? "rgba(255, 150, 150, 0.7)"
                    : "rgba(0, 0, 0, 0.3)",
                dashStyle: "Dash",
                snap: false,
              },
            },
          ]
        : []),
    ],
    series: [
      {
        type: selectedChartType as any,
        name: `${selectedStock} Price`,
        data: stockData.map((d) => [d.date, d.open, d.high, d.low, d.close]),
        id: "main",
        color: "#ef4444",
        upColor: "#22c55e",
        showInLegend: true,
      },
      {
        type: "column",
        name: "Volume",
        data: stockData.map((d) => [d.date, d.volume]),
        yAxis: 1,
        color:
          colorMode === "dark"
            ? "rgba(255, 165, 0, 0.8)"
            : "rgba(37, 99, 235, 0.5)",
        showInLegend: true,
      },
      ...Object.entries(strategyData || {}).map(([strategy, data], index) => ({
        type: "line",
        name: `Strategy: ${strategy}`,
        data: data.map((d) => [d.date, d.value]),
        yAxis: 2,
        color: `hsl(${index * 60}, 70%, 50%)`,
        showInLegend: true,
        marker: {
          symbol: "diamond",
        },
      })),
      ...measureSignals.map((signal, index) => ({
        type: "line",
        name: `Signal (Measure): ${signal.name}`,
        data: signalData[signal.name]?.map((d) => [d.date, d.value]) || [],
        yAxis: 0,
        color: `hsl(${index * 90 + 180}, 70%, 50%)`,
        showInLegend: true,
        marker: {
          symbol: "circle",
        },
      })),
      ...externalSignals.map((signal, index) => ({
        type: "line",
        name: `Signal (External): ${signal.name}`,
        data: signalData[signal.name]?.map((d) => [d.date, d.value]) || [],
        yAxis: selectedStrategies.length > 0 ? 3 : 2,
        color: `hsl(${index * 90 + 45}, 70%, 50%)`,
        showInLegend: true,
        marker: {
          symbol: "triangle",
        },
      })),
    ],
    xAxis: {
      type: "datetime",
      ordinal: false,
      min: chartExtremes.min,
      max: chartExtremes.max,
      labels: {
        style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
      },
      crosshair: {
        label: {
          enabled: true,
          format: "{value:%Y-%m-%d}",
        },
        color:
          colorMode === "dark"
            ? "rgba(255, 150, 150, 0.7)"
            : "rgba(0, 0, 0, 0.3)",
        dashStyle: "Dash",
      },
    },
    tooltip: {
      enabled: false,
      split: true,
      shared: true,
      backgroundColor: colorMode === "dark" ? "#374151" : "#ffffff",
      style: {
        color: colorMode === "dark" ? "#e5e7eb" : "#111827",
      },
    },
    plotOptions: {
      series: {
        animation: false,
        states: {
          inactive: {
            opacity: 1,
          },
          hover: {
            lineWidth: 3,
          },
        },
        dataLabels: {
          style: { color: colorMode === "dark" ? "#e5e7eb" : "#111827" },
        },
      },
      candlestick: {
        color: "#ef4444",
        upColor: "#22c55e",
      },
    },
  };
};
