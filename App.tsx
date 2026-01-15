import React, { useMemo } from 'react';
import { UI_LABELS } from './constants';
import { getWeatherAnalysisData } from './services/weatherAnalysis';
import AccuracyChart from './components/AccuracyChart';
import HorizonTable from './components/HorizonTable';
import FlipRateCard from './components/FlipRateCard';
import ProfitDecayTable from './components/ProfitDecayTable';
import ForecastMatrix from './components/ForecastMatrix';

const App: React.FC = () => {
  const labels = UI_LABELS;
  const analysisData = useMemo(() => getWeatherAnalysisData(), []);

  return (
    <div className="min-h-screen bg-terminal-bg text-gray-300 font-sans selection:bg-terminal-blue selection:text-white p-4 md:p-8 lg:p-12">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 border-b border-terminal-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-2">
            {labels.titlePrefix} <span className="text-terminal-blue">{labels.titleSuffix}</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm max-w-xl">
            {labels.description}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="text-right">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{labels.station}</p>
            <p className="text-sm text-gray-300">{analysisData.station}</p>
            <p className="text-xs font-mono text-gray-500 mt-1">{analysisData.seasonLabel}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary & Stability */}
        <section className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></div>
             <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">{labels.summary}</h2>
          </div>
          
          <HorizonTable summaries={analysisData.horizonSummaries} />
          <FlipRateCard flipRates={analysisData.flipRates} />

          {/* Quick Stats or Info Box */}
          <div className="bg-terminal-card/50 border border-terminal-border p-6 rounded-lg mt-8">
            <h3 className="text-terminal-blue font-mono text-xs uppercase mb-4">{labels.methodology}</h3>
            <ul className="space-y-3 text-sm text-gray-500 font-mono">
              <li className="flex justify-between">
                <span>{labels.scope}</span>
                <span className="text-gray-300">Nov–Feb, EGLC</span>
              </li>
              <li className="flex justify-between">
                <span>{labels.metric}</span>
                <span className="text-gray-300">Exact Hit Rate (°C)</span>
              </li>
              <li className="flex justify-between">
                <span>{labels.safeHold}</span>
                <span className="text-terminal-green">T-2 → T-1 window</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Right Column: Analysis */}
        <section className="lg:col-span-8">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-terminal-blue"></div>
             <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">{labels.tacticalAnalysis}</h2>
          </div>

          <div className="space-y-6">
            <AccuracyChart data={analysisData.accuracyTrend} />
            <ProfitDecayTable row={analysisData.profitDecay} />
            <ForecastMatrix days={analysisData.days} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
