import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Trade } from "../../types/backtest";

interface AssetChartProps {
  colorMode: "light" | "dark";
  asset: string;
  selectedTrade: Trade | null;
}

const AssetChart: React.FC<AssetChartProps> = ({
  colorMode,
  asset,
  selectedTrade,
}) => {
  const [priceData, setPriceData] = useState<[number, number][]>([]);

  useEffect(() => {
    // Generate mock price data
    const startDate = new Date(2023, 0, 1);
    const data: [number, number][] = [];
    let price = asset.includes("BTC")
      ? 30000
      : asset.includes("ETH")
      ? 2000
      : 100;

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      price *= 1 + (Math.random() * 0.04 - 0.02);
      data.push([date.getTime(), price]);
    }

    setPriceData(data);
  }, [asset]);

  const options: Highcharts.Options = {
    chart: {
      height: "400px",
      backgroundColor: "transparent",
      style: {
        fontFamily: "inherit",
      },
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: colorMode === "dark" ? "#9CA3AF" : "#4B5563",
        },
      },
      lineColor: colorMode === "dark" ? "#374151" : "#E5E7EB",
      tickColor: colorMode === "dark" ? "#374151" : "#E5E7EB",
      plotLines: selectedTrade
        ? [
            {
              color: colorMode === "dark" ? "#60A5FA" : "#3B82F6",
              value: selectedTrade.entryDate.getTime(),
              width: 2,
              dashStyle: "dash",
              label: {
                text: "Entry",
                style: {
                  color: colorMode === "dark" ? "#60A5FA" : "#3B82F6",
                },
              },
            },
            {
              color: colorMode === "dark" ? "#60A5FA" : "#3B82F6",
              value: selectedTrade.exitDate.getTime(),
              width: 2,
              dashStyle: "dash",
              label: {
                text: "Exit",
                style: {
                  color: colorMode === "dark" ? "#60A5FA" : "#3B82F6",
                },
              },
            },
          ]
        : undefined,
    },
    yAxis: {
      title: {
        text: "Price",
        style: {
          color: colorMode === "dark" ? "#9CA3AF" : "#4B5563",
        },
      },
      labels: {
        style: {
          color: colorMode === "dark" ? "#9CA3AF" : "#4B5563",
        },
        formatter: function () {
          return Highcharts.numberFormat(this.value as number, 2, ".", ",");
        },
      },
      gridLineColor: colorMode === "dark" ? "#374151" : "#E5E7EB",
    },
    series: [
      {
        type: "line",
        name: asset,
        data: priceData,
        color: colorMode === "dark" ? "#10B981" : "#059669",
      },
    ],
    tooltip: {
      backgroundColor: colorMode === "dark" ? "#1F2937" : "#FFFFFF",
      borderColor: colorMode === "dark" ? "#374151" : "#E5E7EB",
      style: {
        color: colorMode === "dark" ? "#F3F4F6" : "#1F2937",
      },
      formatter: function () {
        const point = this.point;
        return `
          <b>${Highcharts.dateFormat("%Y-%m-%d %H:%M", point.x)}</b><br/>
          Price: $${Highcharts.numberFormat(point.y, 2, ".", ",")}
        `;
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={options}
    />
  );
};

export default AssetChart;
