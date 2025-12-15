export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  isIndex?: boolean; // To distinguish stock indices from crypto
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  FETCHING_MARKET = 'FETCHING_MARKET',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  markdown: string;
  timestamp: string;
}