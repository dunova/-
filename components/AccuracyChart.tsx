import React from 'react';
import { AccuracyPoint } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface AccuracyChartProps {
  data: AccuracyPoint[];
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data }) => {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 shadow-2xl">
      <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">
        Accuracy vs Days to Event
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="horizon" stroke="#6b7280" />
            <YAxis
              stroke="#6b7280"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }}
              labelStyle={{ color: '#e5e7eb' }}
              formatter={(value: number) => [`${value}%`, 'Exact Hit Rate']}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccuracyChart;
