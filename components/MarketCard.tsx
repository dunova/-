import React from 'react';
import { CoinData } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface MarketCardProps {
  coin: CoinData;
  labels: {
    high: string;
    low: string;
  };
}

const MarketCard: React.FC<MarketCardProps> = ({ coin, labels }) => {
  const isPositive = coin.price_change_percentage_24h >= 0;
  const isGold = coin.id === 'pax-gold';
  
  // Custom color logic based on asset type
  let accentColor = isPositive ? '#10B981' : '#EF4444'; // Green/Red Default
  if (isGold) accentColor = '#F59E0B'; // Gold color

  // Format sparkline data for Recharts
  const chartData = coin.sparkline_in_7d.price.map((price, index) => ({
    index,
    price
  }));

  return (
    <div className={`bg-terminal-card border ${isGold ? 'border-yellow-900/30' : 'border-terminal-border'} rounded-lg p-4 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-terminal-blue transition-colors duration-200`}>
      <div className="z-10 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`${isGold ? 'text-yellow-500' : 'text-gray-400'} text-xs font-mono uppercase tracking-wider flex items-center gap-2`}>
              {coin.name}
              {coin.isIndex && <span className="text-[10px] bg-gray-800 px-1 rounded text-gray-400">INDEX</span>}
            </h3>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={`text-sm font-mono px-2 py-1 rounded ${isPositive ? 'bg-green-900/30 text-terminal-green' : 'bg-red-900/30 text-terminal-red'}`}>
            {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-xs text-gray-500 font-mono">
           <div>
             <span className="block text-gray-600">{labels.high}</span>
             {coin.high_24h.toLocaleString()}
           </div>
           <div>
             <span className="block text-gray-600">{labels.low}</span>
             {coin.low_24h.toLocaleString()}
           </div>
        </div>
      </div>

      {/* Background Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
             <defs>
              <linearGradient id={`color-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={accentColor} 
              fill={`url(#color-${coin.id})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketCard;