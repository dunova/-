import React from 'react';
import { ForecastDay } from '../types';

interface ForecastMatrixProps {
  days: ForecastDay[];
}

const ForecastMatrix: React.FC<ForecastMatrixProps> = ({ days }) => {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
          Forecast Matrix
        </h3>
        <span className="text-xs font-mono text-gray-500">{days.length} observations</span>
      </div>
      <div className="overflow-auto max-h-80">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase text-gray-500 sticky top-0 bg-terminal-card">
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">T-3</th>
              <th className="py-2">T-2</th>
              <th className="py-2">T-1</th>
              <th className="py-2">Actual</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date} className="border-t border-terminal-border/60">
                <td className="py-2 font-mono text-white">{day.date}</td>
                <td className="py-2">{day.tMinus3}°C</td>
                <td className="py-2">{day.tMinus2}°C</td>
                <td className="py-2">{day.tMinus1}°C</td>
                <td className="py-2">{day.actual}°C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastMatrix;
