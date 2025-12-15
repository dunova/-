import { CoinData } from '../types';

// CoinGecko IDs: pax-gold (Gold Proxy), bitcoin
const ASSET_IDS = ['pax-gold', 'bitcoin'];

// Helper to generate a realistic looking sparkline for mocked data
const generateSparkline = (startPrice: number, volatility: number = 0.02) => {
  const points = [];
  let price = startPrice;
  for (let i = 0; i < 168; i++) { // 7 days * 24 hours
    const change = price * (Math.random() - 0.5) * volatility;
    price += change;
    points.push(price);
  }
  return points;
};

export const fetchMarketData = async (): Promise<CoinData[]> => {
  try {
    // 1. Fetch Real Crypto & Gold Data
    const ids = ASSET_IDS.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API Error: ${response.statusText}`);
    }

    const data: CoinData[] = await response.json();

    // 2. Identify assets
    const gold = data.find(c => c.id === 'pax-gold');
    const btc = data.find(c => c.id === 'bitcoin');

    // 3. Create Synthetic US500 Data (Since free real-time index API is not available for frontend)
    // We will use Gemini Grounding to get the REAL price for the text analysis, 
    // but this ensures the UI has a nice graph.
    const baseUS500 = 5800; // Approximate level
    const mockChange = (Math.random() * 2) - 1; // Random daily change between -1% and 1%
    const currentUS500 = baseUS500 * (1 + mockChange / 100);
    
    const us500: CoinData = {
      id: 'us500',
      symbol: 'SPX',
      name: 'S&P 500 (Indicative)',
      current_price: currentUS500,
      price_change_percentage_24h: mockChange,
      total_volume: 0,
      high_24h: currentUS500 * 1.01,
      low_24h: currentUS500 * 0.99,
      sparkline_in_7d: {
        price: generateSparkline(baseUS500)
      },
      isIndex: true
    };

    // 4. Return strictly ordered array: Gold -> US500 -> BTC
    const result: CoinData[] = [];
    if (gold) {
      gold.name = "Gold (XAU/USD)"; // Rename for display
      result.push(gold);
    }
    result.push(us500);
    if (btc) result.push(btc);

    return result;
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    throw error;
  }
};