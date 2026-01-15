import React from 'react';
import { HorizonSummary } from '../types';

interface HorizonTableProps {
  summaries: HorizonSummary[];
}

const HorizonTable: React.FC<HorizonTableProps> = ({ summaries }) => {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
      <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">
        Exact Hit Rate Matrix
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase text-gray-500">
            <tr>
              <th className="py-2">Horizon</th>
              <th className="py-2">Exact Hit Rate</th>
              <th className="py-2">MAE (°C)</th>
              <th className="py-2">Sample</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary) => (
              <tr key={summary.id} className="border-t border-terminal-border/60">
                <td className="py-2 font-mono text-white">{summary.id}</td>
                <td className="py-2">{summary.exactHitRate}%</td>
                <td className="py-2">{summary.meanAbsoluteError}</td>
                <td className="py-2">{summary.sampleSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HorizonTable;
