export interface ForecastDay {
  date: string;
  tMinus3: number;
  tMinus2: number;
  tMinus1: number;
  actual: number;
}

export interface HorizonSummary {
  id: 'T-3' | 'T-2' | 'T-1';
  exactHitRate: number;
  meanAbsoluteError: number;
  sampleSize: number;
}

export interface AccuracyPoint {
  horizon: 'T-3' | 'T-2' | 'T-1';
  accuracy: number;
}

export interface FlipRateSummary {
  t3HoldRate: number;
  t3HoldSample: number;
  t3To11Actual10Rate: number;
  t3To11Sample: number;
}

export interface ProfitDecayRow {
  label: string;
  t3Price: number;
  t1AveragePrice: number;
  sampleSize: number;
}

export interface ForecastAnalysisData {
  station: string;
  seasonLabel: string;
  days: ForecastDay[];
  horizonSummaries: HorizonSummary[];
  accuracyTrend: AccuracyPoint[];
  flipRates: FlipRateSummary;
  profitDecay: ProfitDecayRow;
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
