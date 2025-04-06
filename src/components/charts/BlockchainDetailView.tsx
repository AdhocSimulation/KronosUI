import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Mock data for blockchain-specific network graphs
const blockchainData: Record<string, any> = {
  ethereum: {
    nodes: [
      // Main node
      { id: 'ethereum', label: 'Ethereum', size: 50, color: '#627EEA', group: 'main' },
      
      // Staking addresses
      { id: 'lido', label: 'Lido', size: 30, color: '#00A3FF', group: 'staking', value: '$20B' },
      { id: 'rocket_pool', label: 'Rocket Pool', size: 25, color: '#00A3FF', group: 'staking', value: '$2.5B' },
      { id: 'stakewise', label: 'StakeWise', size: 20, color: '#00A3FF', group: 'staking', value: '$500M' },
      
      // DEX addresses
      { id: 'uniswap_v3', label: 'Uniswap V3', size: 35, color: '#FF007A', group: 'dex', value: '$5B' },
      { id: 'curve_eth', label: 'Curve', size: 30, color: '#FF007A', group: 'dex', value: '$3.2B' },
      { id: 'balancer_eth', label: 'Balancer', size: 25, color: '#FF007A', group: 'dex', value: '$800M' },
      
      // Top TVL addresses
      { id: 'aave_v3', label: 'Aave V3', size: 40, color: '#B6509E', group: 'tvl', value: '$6.5B' },
      { id: 'maker_dao', label: 'MakerDAO', size: 35, color: '#B6509E', group: 'tvl', value: '$7.2B' },
      { id: 'compound', label: 'Compound', size: 30, color: '#B6509E', group: 'tvl', value: '$2.8B' }
    ],
    links: [
      // Staking connections
      { source: 'ethereum', target: 'lido', value: 2000 },
      { source: 'ethereum', target: 'rocket_pool', value: 500 },
      { source: 'ethereum', target: 'stakewise', value: 200 },
      
      // DEX connections
      { source: 'ethereum', target: 'uniswap_v3', value: 3000 },
      { source: 'ethereum', target: 'curve_eth', value: 2500 },
      { source: 'ethereum', target: 'balancer_eth', value: 1000 },
      
      // TVL connections
      { source: 'ethereum', target: 'aave_v3', value: 4000 },
      { source: 'ethereum', target: 'maker_dao', value: 4500 },
      { source: 'ethereum', target: 'compound', value: 2000 },
      
      // Cross-protocol connections
      { source: 'aave_v3', target: 'uniswap_v3', value: 1500 },
      { source: 'maker_dao', target: 'curve_eth', value: 2000 },
      { source: 'compound', target: 'balancer_eth', value: 800 }
    ]
  },
  // Add similar data structures for other blockchains...
};

interface BlockchainDetailViewProps {
  blockchain: string;
  onClose: () => void;
  className?: string;
}

const BlockchainDetailView: React.FC<BlockchainDetailViewProps> = ({
  blockchain,
  onClose,
  className
}) => {
  const graphRef = useRef<any>();
  const data = blockchainData[blockchain] || blockchainData.ethereum;

  useEffect(() => {
    // Warm up the force engine
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-400);
      graphRef.current.d3Force('link').distance(link => 100 + link.value / 100);
    }
  }, []);

  const getNodeColor = (node: any) => {
    switch (node.group) {
      case 'staking':
        return '#00A3FF';
      case 'dex':
        return '#FF007A';
      case 'tvl':
        return '#B6509E';
      default:
        return '#627EEA';
    }
  };

  const getLinkColor = (link: any) => {
    const sourceGroup = data.nodes.find((n: any) => n.id === link.source.id)?.group;
    const targetGroup = data.nodes.find((n: any) => n.id === link.target.id)?.group;
    
    if (sourceGroup === 'main' || targetGroup === 'main') {
      return '#627EEA';
    }
    return '#999';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{blockchain} Ecosystem</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
          >
            Back to Overview
          </button>
        </CardTitle>
        <CardDescription>
          Interactive visualization of addresses, protocols, and their interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: '800px', background: '#1a1b1e' }} className="rounded-lg">
          <ForceGraph2D
            ref={graphRef}
            graphData={data}
            nodeLabel={node => `${node.label}\n${node.value || ''}`}
            nodeColor={getNodeColor}
            nodeRelSize={6}
            linkWidth={link => Math.sqrt(link.value) / 500}
            linkColor={getLinkColor}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.005}
            d3VelocityDecay={0.3}
            cooldownTime={2000}
            onNodeClick={(node: any) => {
              // Center/zoom on node
              graphRef.current.centerAt(node.x, node.y, 1000);
              graphRef.current.zoom(2.5, 1000);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainDetailView;
