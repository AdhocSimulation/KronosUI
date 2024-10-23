import axios from 'axios';
import { StockData } from '../types/chart';

export const fetchStockData = async (stock: string, granularity: string): Promise<StockData[]> => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_${granularity.toUpperCase()}&symbol=${stock}&outputsize=full&apikey=YOUR_API_KEY`
    );
    
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
  } catch (error) {
    throw error;
  }
};

export const generatePlaceholderData = (): StockData[] => {
  const data: StockData[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const basePrice = 100 + Math.sin(i / 10) * 20 + Math.random() * 10;
    data.push({
      date: date.getTime(),
      open: basePrice,
      high: basePrice + Math.random() * 5,
      low: basePrice - Math.random() * 5,
      close: basePrice + Math.random() * 2 - 1,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }

  return data;
};