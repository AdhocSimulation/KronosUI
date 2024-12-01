import { apiService } from "../services/apiService";
import { BarData } from "../types/chart";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { assetService } from "../services/assetService";

export const fetchAssetData = async (
  symbol: string,
  granularity: string
): Promise<BarData[]> => {
  try {
    // For now, return placeholder data instead of making API calls
    //return generatePlaceholderData(asset);

    // In production, uncomment and use real API:
    console.log(symbol);
    console.log(granularity);
    const response = await apiService.get<BarData[]>(
      `assets/timeseries?symbol=${symbol}&granularity=${granularity}`
    );
    console.log(response);

    return generatePlaceholderData(symbol);
    /*
    const timeSeriesData = response.data[`Time Series (${granularity})`];
    if (!timeSeriesData) {
      throw new Error('No data received from API');
    }

    return Object.entries(timeSeriesData)
      .map(([date, values]: [string, any]) => ({
        date: new Date(date).getTime(),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))
      .reverse();
    */
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const generatePlaceholderData = (symbol: string): BarData[] => {
  const data: BarData[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setHours(2, 0, 0);

  const basePrice = assetService.getBasePrice(symbol);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const price =
      basePrice +
      Math.sin(i / 10) * (basePrice * 0.2) +
      Math.random() * (basePrice * 0.1);
    data.push({
      date: date.getTime(),
      open: price,
      high: price + Math.random() * (basePrice * 0.05),
      low: price - Math.random() * (basePrice * 0.05),
      close: price + Math.random() * (basePrice * 0.02) - basePrice * 0.01,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }

  return data;
};
