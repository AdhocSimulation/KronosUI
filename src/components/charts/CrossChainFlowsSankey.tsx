import React, { useState, useCallback } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import BlockchainDetailView from './BlockchainDetailView';

// Mock data structure for the Sankey diagram
const mockData = {
  nodes: [
    // Layer 1 Chains
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'bsc', name: 'BSC' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'arbitrum', name: 'Arbitrum' },
    { id: 'optimism', name: 'Optimism' },
    { id: 'avalanche', name: 'Avalanche' },
    { id: 'solana', name: 'Solana' },
    
    // DEXes
    { id: 'uniswap', name: 'Uniswap' },
    { id: 'pancakeswap', name: 'PancakeSwap' },
    { id: 'quickswap', name: 'QuickSwap' },
    { id: 'trader_joe', name: 'Trader Joe' },
    { id: 'sushiswap', name: 'SushiSwap' },
    { id: 'curve', name: 'Curve' },
    { id: 'balancer', name: 'Balancer' },
    
    // CEXes
    { id: 'binance', name: 'Binance' },
    { id: 'coinbase', name: 'Coinbase' },
    { id: 'kraken', name: 'Kraken' },
    { id: 'kucoin', name: 'KuCoin' },
    { id: 'ftx', name: 'FTX' },
    
    // Bridges
    { id: 'wormhole', name: 'Wormhole' },
    { id: 'stargate', name: 'Stargate' },
    { id: 'hop', name: 'Hop Protocol' },
    { id: 'across', name: 'Across' },
    
    // TVL Categories
    { id: 'lending', name: 'Lending' },
    { id: 'yield', name: 'Yield Farming' },
    { id: 'staking', name: 'Staking' },
    { id: 'liquid_staking', name: 'Liquid Staking' }
  ],
  links: [
    // Cross-chain flows via bridges
    { source: 'ethereum', target: 'wormhole', value: 2500 },
    { source: 'wormhole', target: 'solana', value: 1500 },
    { source: 'wormhole', target: 'avalanche', value: 1000 },
    { source: 'ethereum', target: 'stargate', value: 3000 },
    { source: 'stargate', target: 'bsc', value: 1200 },
    { source: 'stargate', target: 'arbitrum', value: 1800 },
    { source: 'ethereum', target: 'hop', value: 2000 },
    { source: 'hop', target: 'optimism', value: 1200 },
    { source: 'hop', target: 'polygon', value: 800 },
    
    // DEX flows
    { source: 'ethereum', target: 'uniswap', value: 5000 },
    { source: 'ethereum', target: 'curve', value: 4000 },
    { source: 'ethereum', target: 'balancer', value: 2000 },
    { source: 'bsc', target: 'pancakeswap', value: 3500 },
    { source: 'polygon', target: 'quickswap', value: 1500 },
    { source: 'polygon', target: 'sushiswap', value: 1000 },
    { source: 'avalanche', target: 'trader_joe', value: 1200 },
    
    // CEX flows
    { source: 'ethereum', target: 'binance', value: 8000 },
    { source: 'ethereum', target: 'coinbase', value: 6000 },
    { source: 'ethereum', target: 'kraken', value: 3000 },
    { source: 'bsc', target: 'binance', value: 4000 },
    { source: 'solana', target: 'ftx', value: 2500 },
    { source: 'solana', target: 'kucoin', value: 1500 },
    
    // TVL flows
    { source: 'ethereum', target: 'lending', value: 10000 },
    { source: 'ethereum', target: 'yield', value: 8000 },
    { source: 'ethereum', target: 'staking', value: 6000 },
    { source: 'ethereum', target: 'liquid_staking', value: 7000 },
    { source: 'bsc', target: 'lending', value: 3000 },
    { source: 'bsc', target: 'yield', value: 2500 },
    { source: 'polygon', target: 'lending', value: 2000 },
    { source: 'polygon', target: 'yield', value: 1500 },
    { source: 'arbitrum', target: 'lending', value: 2500 },
    { source: 'optimism', target: 'lending', value: 2000 },
    { source: 'avalanche', target: 'yield', value: 1800 },
    { source: 'solana', target: 'staking', value: 3000 }
  ]
};

interface CrossChainFlowsSankeyProps {
  className?: string;
}

const CrossChainFlowsSankey: React.FC<CrossChainFlowsSankeyProps> = ({ className }) => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);

  const handleClick = useCallback((nodeData: any) => {
    console.log('Click data:', nodeData);
    
    // Only show detail view for blockchain nodes
    const blockchainNodes = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana'];
    if (blockchainNodes.includes(nodeData.id)) {
      console.log('Setting selected blockchain:', nodeData.id);
      setSelectedBlockchain(nodeData.id);
    }
  }, []);

  console.log('Current selected blockchain:', selectedBlockchain);

  if (selectedBlockchain) {
    console.log('Rendering BlockchainDetailView for:', selectedBlockchain);
    return (
      <BlockchainDetailView
        blockchain={selectedBlockchain}
        onClose={() => {
          console.log('Closing detail view');
          setSelectedBlockchain(null);
        }}
        className={className}
      />
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cross-Chain Flows & TVL</CardTitle>
        <CardDescription>
          Visualization of cross-chain flows through bridges, DEX/CEX activity, and Total Value Locked (TVL)
          <br />
          <span className="text-sm text-muted-foreground">
            Click on any blockchain node to see detailed ecosystem view
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: '800px' }}>
          <ResponsiveSankey
            data={mockData}
            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
            align="justify"
            colors={{ scheme: 'category10' }}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderColor={{
              from: 'color',
              modifiers: [['darker', 0.8]]
            }}
            linkOpacity={0.5}
            linkHoverOthersOpacity={0.1}
            linkContract={3}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={16}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1]]
            }}
            animate={true}
            motionConfig="gentle"
            onClick={handleClick}
            isInteractive={true}
            enableLinkGradient={true}
            tooltip={({ node }) => (
              <div
                style={{
                  padding: 12,
                  background: '#ffffff',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  color: '#333'
                }}
              >
                <strong>{node.name}</strong>
                <br />
                Volume: ${(node.value / 1000).toFixed(2)}M
                {['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana'].includes(node.id) && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Click to view detailed ecosystem
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossChainFlowsSankey;
