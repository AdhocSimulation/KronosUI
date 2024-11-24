import React, { useState, useEffect } from "react";
import { assetService } from "../../services/assetService";
import { AssetMetrics } from "./types";
import { assetTags } from "./utils";
import TagFilter from "./TagFilter";
import AssetTable from "./AssetTable";

interface DashboardProps {
  colorMode: "light" | "dark";
}

const Dashboard: React.FC<DashboardProps> = ({ colorMode }) => {
  const [assets, setAssets] = useState<AssetMetrics[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof AssetMetrics>("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Flatten all available tags into a single array
  const availableTags = Object.values(assetTags).flat();

  useEffect(() => {
    const fetchAssets = async () => {
      const allAssets = await assetService.getAssets();

      // Generate mock metrics for demonstration
      const assetsWithMetrics: AssetMetrics[] = allAssets.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        price: asset.basePrice * (0.9 + Math.random() * 0.2),
        change24h: -15 + Math.random() * 30,
        volume24h: Math.random() * 1000000000,
        marketCap: asset.basePrice * (Math.random() * 1000000000),
        // Assign random tags from each category
        tags: Object.values(assetTags).map(
          (category) => category[Math.floor(Math.random() * category.length)]
        ),
        indicators: {
          crossMA: -1 + Math.random() * 2,
          betaTrend: -2 + Math.random() * 4,
          betaVol: Math.random() * 2,
          ornsteinUhlenbeck: -1 + Math.random() * 2,
          residualPCA: -3 + Math.random() * 6,
          zScore1Y: -2 + Math.random() * 4,
        },
      }));

      setAssets(assetsWithMetrics);
    };

    fetchAssets();
  }, []);

  const handleTagSelect = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSort = (field: keyof AssetMetrics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter assets based on selected tags
  const filteredAssets = assets.filter(
    (asset) =>
      selectedTags.length === 0 ||
      selectedTags.every((tag) => asset.tags.includes(tag))
  );

  // Sort filtered assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "object" || typeof bValue === "object") {
      return 0;
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  return (
    <div
      className={`p-6 ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } p-6 shadow-lg`}
      >
        <h1 className="text-2xl font-bold mb-6">Market Dashboard</h1>

        <TagFilter
          colorMode={colorMode}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
        />

        <AssetTable
          colorMode={colorMode}
          assets={sortedAssets}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default Dashboard;
