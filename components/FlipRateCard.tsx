import React from 'react';
import { FlipRateSummary } from '../types';

interface FlipRateCardProps {
  flipRates: FlipRateSummary;
}

const FlipRateCard: React.FC<FlipRateCardProps> = ({ flipRates }) => {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
      <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">
        Stability (Flip Rate)
      </h3>
      <div className="space-y-4 text-sm text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">T-3 = 10°C stays 10°C at T-1</span>
          <span className="text-white font-mono">
            {flipRates.t3HoldRate}% ({flipRates.t3HoldSample})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">T-3 = 10°C → T-1 = 11°C, actual 10°C</span>
          <span className="text-white font-mono">
            {flipRates.t3To11Actual10Rate}% ({flipRates.t3To11Sample})
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Flip rates quantify how sticky the 10°C strike is between T-3 and T-1, a key input for
          safe holding periods in NO positioning.
        </p>
      </div>
    </div>
  );
};

export default FlipRateCard;
