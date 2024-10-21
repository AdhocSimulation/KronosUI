// This is a dummy implementation of gRPC calls for backtesting

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runBacktest = async (windowSize: number, series: string): Promise<any> => {
  console.log(`Running backtest with window size: ${windowSize} days, series: ${series}`);
  
  // Simulate a gRPC call
  await delay(3000); // Simulate a 3-second delay

  // Return dummy result
  return {
    success: true,
    profitLoss: Math.random() * 1000 - 500, // Random profit/loss between -500 and 500
    trades: Math.floor(Math.random() * 100), // Random number of trades between 0 and 100
    winRate: Math.random() * 100, // Random win rate between 0% and 100%
  };
};

export const cancelBacktest = async (): Promise<void> => {
  console.log('Cancelling backtest');
  
  // Simulate a gRPC call
  await delay(500); // Simulate a 0.5-second delay

  // In a real implementation, this would send a cancellation signal to the backend
  console.log('Backtest cancelled');
};