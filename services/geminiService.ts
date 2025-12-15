import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { CoinData } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAnalysis = async (marketData: CoinData[]) => {
  const ai = getClient();

  // Extract specific data points
  const gold = marketData.find(d => d.id === 'pax-gold');
  const btc = marketData.find(d => d.id === 'bitcoin');
  
  // Note: We do not pass the US500 synthetic object to Gemini as fact, 
  // we ask Gemini to search for the real one.

  const prompt = `
    当前时间: ${new Date().toLocaleString('zh-CN')}
    
    【已知实时市场数据 (来源: CoinGecko)】:
    1. 黄金 (Gold Proxy): $${gold?.current_price || 'N/A'} (24h涨跌: ${gold?.price_change_percentage_24h.toFixed(2)}%)
    2. 比特币 (BTC): $${btc?.current_price || 'N/A'} (24h涨跌: ${btc?.price_change_percentage_24h.toFixed(2)}%)

    【任务指令】:
    1. 使用 Google Search 查询 **S&P 500 (SPX)** 的实时指数价格和今日涨跌幅。
    2. 使用 Google Search 查询 **美元指数 (DXY)** 和 **10年期美债收益率 (US10Y)**。
    3. 综合以上"已知数据"和"搜索数据"，生成一份《全球宏观资产关联分析报告》。
    
    请严格按照系统指令中的格式输出中文报告。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Very low temp for analytical precision
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};