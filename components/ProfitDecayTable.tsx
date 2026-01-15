import React from 'react';
import { ProfitDecayRow } from '../types';

interface ProfitDecayTableProps {
  row: ProfitDecayRow;
}

const ProfitDecayTable: React.FC<ProfitDecayTableProps> = ({ row }) => {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
      <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">
        Profit Decay (NO Strategy)
      </h3>
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase text-gray-500">
          <tr>
            <th className="py-2">Contract</th>
            <th className="py-2">T-3 Buy</th>
            <th className="py-2">Avg T-1 Sell</th>
            <th className="py-2">Sample</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-terminal-border/60">
            <td className="py-2 font-mono text-white">{row.label}</td>
            <td className="py-2">{row.t3Price.toFixed(2)}</td>
            <td className="py-2">{row.t1AveragePrice.toFixed(2)}</td>
            <td className="py-2">{row.sampleSize}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3">
        T-1 pricing is modeled from distance-to-strike: wider separation from 10°C lifts the NO
        price, reflecting higher implied probability of &quot;not 10°C&quot;.
      </p>
    </div>
  );
};

export default ProfitDecayTable;
