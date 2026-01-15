import {
  ForecastAnalysisData,
  ForecastDay,
  HorizonSummary,
  AccuracyPoint,
  FlipRateSummary,
  ProfitDecayRow
} from '../types';

const FORECAST_DAYS: ForecastDay[] = [
  { date: '2023-11-18', tMinus3: 9, tMinus2: 10, tMinus1: 10, actual: 10 },
  { date: '2023-11-21', tMinus3: 11, tMinus2: 10, tMinus1: 9, actual: 9 },
  { date: '2023-11-24', tMinus3: 10, tMinus2: 10, tMinus1: 11, actual: 10 },
  { date: '2023-11-28', tMinus3: 8, tMinus2: 9, tMinus1: 9, actual: 9 },
  { date: '2023-12-02', tMinus3: 7, tMinus2: 7, tMinus1: 8, actual: 8 },
  { date: '2023-12-05', tMinus3: 6, tMinus2: 7, tMinus1: 7, actual: 7 },
  { date: '2023-12-07', tMinus3: 10, tMinus2: 10, tMinus1: 10, actual: 10 },
  { date: '2023-12-09', tMinus3: 12, tMinus2: 11, tMinus1: 11, actual: 11 },
  { date: '2023-12-12', tMinus3: 9, tMinus2: 9, tMinus1: 8, actual: 8 },
  { date: '2023-12-15', tMinus3: 10, tMinus2: 9, tMinus1: 10, actual: 9 },
  { date: '2023-12-18', tMinus3: 11, tMinus2: 11, tMinus1: 10, actual: 10 },
  { date: '2023-12-21', tMinus3: 5, tMinus2: 6, tMinus1: 6, actual: 6 },
  { date: '2023-12-24', tMinus3: 8, tMinus2: 8, tMinus1: 7, actual: 7 },
  { date: '2023-12-27', tMinus3: 10, tMinus2: 10, tMinus1: 11, actual: 10 },
  { date: '2023-12-30', tMinus3: 9, tMinus2: 8, tMinus1: 8, actual: 8 },
  { date: '2024-01-02', tMinus3: 7, tMinus2: 7, tMinus1: 7, actual: 7 },
  { date: '2024-01-05', tMinus3: 10, tMinus2: 9, tMinus1: 9, actual: 9 },
  { date: '2024-01-08', tMinus3: 11, tMinus2: 10, tMinus1: 10, actual: 10 },
  { date: '2024-01-11', tMinus3: 9, tMinus2: 9, tMinus1: 10, actual: 10 },
  { date: '2024-01-14', tMinus3: 10, tMinus2: 10, tMinus1: 10, actual: 9 },
  { date: '2024-01-17', tMinus3: 6, tMinus2: 7, tMinus1: 7, actual: 7 },
  { date: '2024-01-20', tMinus3: 8, tMinus2: 8, tMinus1: 9, actual: 8 },
  { date: '2024-01-23', tMinus3: 10, tMinus2: 11, tMinus1: 11, actual: 10 },
  { date: '2024-01-26', tMinus3: 12, tMinus2: 11, tMinus1: 12, actual: 11 },
  { date: '2024-01-29', tMinus3: 9, tMinus2: 9, tMinus1: 9, actual: 9 },
  { date: '2024-02-01', tMinus3: 10, tMinus2: 10, tMinus1: 10, actual: 10 },
  { date: '2024-02-04', tMinus3: 8, tMinus2: 8, tMinus1: 9, actual: 9 },
  { date: '2024-02-07', tMinus3: 11, tMinus2: 10, tMinus1: 10, actual: 10 },
  { date: '2024-02-10', tMinus3: 9, tMinus2: 10, tMinus1: 9, actual: 9 },
  { date: '2024-02-13', tMinus3: 10, tMinus2: 10, tMinus1: 11, actual: 10 }
];

const TARGET_TEMP = 10;
const NO_PRICE_T3 = 0.58;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const meanAbsoluteError = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / (values.length || 1);

const buildSummary = (
  id: HorizonSummary['id'],
  forecasts: number[],
  actuals: number[]
): HorizonSummary => {
  const errors = forecasts.map((forecast, idx) => Math.abs(forecast - actuals[idx]));
  const exactHits = forecasts.filter((forecast, idx) => forecast === actuals[idx]).length;
  const exactHitRate = Math.round((exactHits / (forecasts.length || 1)) * 100);

  return {
    id,
    exactHitRate,
    meanAbsoluteError: Number(meanAbsoluteError(errors).toFixed(2)),
    sampleSize: forecasts.length
  };
};

const buildFlipRates = (days: ForecastDay[]): FlipRateSummary => {
  const t3TenDays = days.filter(day => day.tMinus3 === TARGET_TEMP);
  const t3HoldSample = t3TenDays.length;
  const t3HoldRate = t3HoldSample === 0
    ? 0
    : Math.round((t3TenDays.filter(day => day.tMinus1 === TARGET_TEMP).length / t3HoldSample) * 100);

  const t3To11Days = t3TenDays.filter(day => day.tMinus1 === TARGET_TEMP + 1);
  const t3To11Sample = t3To11Days.length;
  const t3To11Actual10Rate = t3To11Sample === 0
    ? 0
    : Math.round((t3To11Days.filter(day => day.actual === TARGET_TEMP).length / t3To11Sample) * 100);

  return {
    t3HoldRate,
    t3HoldSample,
    t3To11Actual10Rate,
    t3To11Sample
  };
};

const buildProfitDecay = (days: ForecastDay[]): ProfitDecayRow => {
  const t1Prices = days.map(day => {
    const distance = Math.abs(day.tMinus1 - TARGET_TEMP);
    const adjustment = Math.min(0.25, distance * 0.06);
    return clamp(NO_PRICE_T3 + adjustment, 0.1, 0.95);
  });

  const average = t1Prices.reduce((sum, value) => sum + value, 0) / (t1Prices.length || 1);

  return {
    label: `NO on ${TARGET_TEMP}°C`,
    t3Price: NO_PRICE_T3,
    t1AveragePrice: Number(average.toFixed(2)),
    sampleSize: t1Prices.length
  };
};

export const getWeatherAnalysisData = (): ForecastAnalysisData => {
  const actuals = FORECAST_DAYS.map(day => day.actual);
  const t3 = FORECAST_DAYS.map(day => day.tMinus3);
  const t2 = FORECAST_DAYS.map(day => day.tMinus2);
  const t1 = FORECAST_DAYS.map(day => day.tMinus1);

  const summaries: HorizonSummary[] = [
    buildSummary('T-3', t3, actuals),
    buildSummary('T-2', t2, actuals),
    buildSummary('T-1', t1, actuals)
  ];

  const accuracyTrend: AccuracyPoint[] = summaries.map(summary => ({
    horizon: summary.id,
    accuracy: summary.exactHitRate
  }));

  return {
    station: 'London City Airport (EGLC)',
    seasonLabel: 'Winter (Nov-Feb)',
    days: FORECAST_DAYS,
    horizonSummaries: summaries,
    accuracyTrend,
    flipRates: buildFlipRates(FORECAST_DAYS),
    profitDecay: buildProfitDecay(FORECAST_DAYS)
  };
};
