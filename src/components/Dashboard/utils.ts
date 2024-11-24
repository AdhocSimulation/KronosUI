export const formatters = {
  formatNumber: (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  formatCurrency: (num: number): string => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  },

  formatPercent: (num: number): string => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  },
};

export const assetTags = {
  categories: ["DeFi", "Layer1", "Layer2", "GameFi", "NFT", "Stablecoin"],
  marketCap: ["Large Cap", "Mid Cap", "Small Cap"],
  status: ["Trending", "New Listing", "Top Gainer", "Top Loser"],
  technology: [
    "Smart Contract",
    "PoS",
    "PoW",
    "ZK-Rollup",
    "Optimistic Rollup",
  ],
  sector: ["Finance", "Infrastructure", "Gaming", "Social", "Exchange"],
};
