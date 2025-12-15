import React, { useState, useEffect, useCallback } from 'react';
import { fetchMarketData } from './services/cryptoService';
import { generateAnalysis } from './services/geminiService';
import MarketCard from './components/MarketCard';
import AnalysisDisplay from './components/AnalysisDisplay';
import { CoinData, AnalysisStatus } from './types';
import { UI_LABELS } from './constants';

const App: React.FC = () => {
  const [marketData, setMarketData] = useState<CoinData[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const labels = UI_LABELS;

  const initData = useCallback(async () => {
    try {
      setStatus(AnalysisStatus.FETCHING_MARKET);
      const data = await fetchMarketData();
      setMarketData(data);
      setStatus(AnalysisStatus.IDLE);
    } catch (err) {
      console.error(err);
      setError(labels.errorFetch);
      setStatus(AnalysisStatus.ERROR);
    }
  }, [labels.errorFetch]);

  useEffect(() => {
    initData();
  }, [initData]); 

  const handleRunAnalysis = async () => {
    if (marketData.length === 0) return;
    
    setError(null);
    setStatus(AnalysisStatus.ANALYZING);
    
    try {
      const markdown = await generateAnalysis(marketData);
      if (markdown) {
        setAnalysis(markdown);
        setStatus(AnalysisStatus.COMPLETED);
      } else {
        throw new Error("No analysis generated");
      }
    } catch (err) {
      console.error(err);
      setError(labels.errorAnalysis);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case AnalysisStatus.FETCHING_MARKET: return labels.statusFetching;
      case AnalysisStatus.ANALYZING: return labels.statusAnalyzing;
      default: return labels.statusReady;
    }
  };

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
           <div className="flex gap-4">
            <button 
              onClick={initData}
              disabled={status === AnalysisStatus.ANALYZING || status === AnalysisStatus.FETCHING_MARKET}
              className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white border border-terminal-border hover:border-gray-500 rounded transition-colors"
            >
              {labels.refresh}
            </button>
            <button 
              onClick={handleRunAnalysis}
              disabled={status === AnalysisStatus.ANALYZING || marketData.length === 0}
              className={`px-6 py-2 text-sm font-bold font-mono rounded transition-all duration-300 flex items-center gap-2
                ${status === AnalysisStatus.ANALYZING 
                  ? 'bg-terminal-border text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                }`}
            >
              {status === AnalysisStatus.ANALYZING ? (
                <>{labels.processing}</>
              ) : (
                <>{labels.initiate}</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Market Data (Gold, US500, BTC) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></div>
             <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">{labels.liveFeeds}</h2>
          </div>
          
          {marketData.length === 0 && status === AnalysisStatus.FETCHING_MARKET ? (
             <div className="space-y-4 animate-pulse">
               {[1,2,3].map(i => <div key={i} className="h-40 bg-terminal-card rounded-lg border border-terminal-border"></div>)}
             </div>
          ) : (
            marketData.map((coin) => (
              <MarketCard key={coin.id} coin={coin} labels={labels.marketCard} />
            ))
          )}

          {/* Quick Stats or Info Box */}
          <div className="bg-terminal-card/50 border border-terminal-border p-6 rounded-lg mt-8">
            <h3 className="text-terminal-blue font-mono text-xs uppercase mb-4">{labels.systemParams}</h3>
            <ul className="space-y-3 text-sm text-gray-500 font-mono">
              <li className="flex justify-between">
                <span>{labels.model}</span>
                <span className="text-gray-300">Gemini 2.5 Flash</span>
              </li>
              <li className="flex justify-between">
                <span>{labels.grounding}</span>
                <span className="text-terminal-green">Google Search Active</span>
              </li>
              <li className="flex justify-between">
                <span>{labels.dataSource}</span>
                <span className="text-gray-300">CG / Synthetic / Search</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Right Column: AI Analysis */}
        <section className="lg:col-span-8">
           <div className="flex items-center gap-2 mb-4">
             <div className={`w-2 h-2 rounded-full ${analysis ? 'bg-terminal-blue' : 'bg-gray-700'}`}></div>
             <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">{labels.tacticalAnalysis}</h2>
          </div>

          <div className="bg-terminal-card border border-terminal-border rounded-xl p-8 min-h-[600px] shadow-2xl">
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 text-red-400 text-sm font-mono rounded">
                ERROR: {error}
              </div>
            )}
            
            <AnalysisDisplay 
              markdown={analysis} 
              loading={status === AnalysisStatus.ANALYZING}
              statusMessage={getStatusMessage()}
              labels={labels}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;