
import { GoogleGenAI, Type } from "@google/genai";
import { Dataset, Insight, ForecastPoint, ColumnType, DataStory } from '../types';

const getAI = () => {
    if (!process.env.API_KEY) return null;
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Simple in-memory cache to store AI results based on dataset hash/name
const aiCache = new Map<string, any>();

const getCacheKey = (prefix: string, dataset: Dataset, extra: string = '') => {
    return `${prefix}_${dataset.name}_${dataset.rows.length}_${dataset.columns.length}_${extra}`;
};

// Retry helper for transient network/RPC errors with exponential backoff
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        const isRetryable = !error.status || error.status >= 500 || error.status === 429;
        
        if (retries > 0 && isRetryable) {
            console.warn(`Gemini API call failed (Status: ${error.status || 'Unknown'}), retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(operation, retries - 1, delay * 2);
        }
        throw error;
    }
}

export const generateAIInsights = async (dataset: Dataset): Promise<Insight[]> => {
  const cacheKey = getCacheKey('insights', dataset);
  if (aiCache.has(cacheKey)) {
      return aiCache.get(cacheKey);
  }

  const ai = getAI();
  if (!ai) {
    console.warn("API_KEY not found. Returning mock insights.");
    return [
      { type: 'general', title: 'Data Overview', description: 'API Key missing. Showing mock insights.', confidence: 100 },
      { type: 'growth', title: 'Revenue Trend', description: 'Positive growth trajectory observed.', confidence: 85 },
    ];
  }

  // Limit summary size for speed
  const summary = {
    totalRows: dataset.rows.length,
    columns: dataset.columns.slice(0, 10).map(c => ({ 
      name: c.name, 
      type: c.type, 
      stats: c.type === 'NUMBER' ? { min: c.min, max: c.max, avg: c.avg } : { unique: c.uniqueValues } 
    })),
    kpis: dataset.kpis.slice(0, 5).map(k => `${k.label}: ${k.value}`)
  };

  const prompt = `
    Analyze this dataset summary and generate 3 business observations.
    Dataset Summary: ${JSON.stringify(summary)}
    Return JSON array: [{type, title, description, confidence}].
  `;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
            },
            required: ['type', 'title', 'description', 'confidence'],
          },
        },
      }
    }));

    const text = response.text;
    if (!text) return [];
    const result = JSON.parse(text) as Insight[];
    aiCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Gemini Insight generation skipped due to error:", error);
    return [];
  }
};

export const generateDataStory = async (dataset: Dataset, insights: Insight[] = []): Promise<DataStory | null> => {
    const cacheKey = getCacheKey('story', dataset, String(insights.length));
    if (aiCache.has(cacheKey)) return aiCache.get(cacheKey);

    const ai = getAI();
    if (!ai) return null;

    let context = `
      Dataset: ${dataset.name}
      KPIs: ${dataset.kpis.slice(0,5).map(k => `${k.label}: ${k.value}`).join(', ')}
    `;

    if (insights.length > 0) {
        context += `\nInsights: ${insights.slice(0,3).map(i => i.description).join('; ')}`;
    } else {
        const stats = dataset.columns
            .filter(c => c.type === 'NUMBER' && c.name.toLowerCase() !== 'id')
            .slice(0, 3)
            .map(c => `${c.name} (Avg: ${c.avg?.toFixed(1)})`)
            .join('; ');
        context += `\nStats: ${stats}`;
    }

    const prompt = `
      Create a "Data Story" (3 segments) based on this context.
      Context: ${context}
      Return JSON: {title, summary, segments: [{id, title, text, audioScript, chartId}]}.
      Keep audioScript concise.
    `;

    try {
        const response = await withRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        segments: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    text: { type: Type.STRING },
                                    audioScript: { type: Type.STRING },
                                    chartId: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        }));
        
        if (!response.text) return null;
        const result = JSON.parse(response.text) as DataStory;
        aiCache.set(cacheKey, result);
        return result;
    } catch (e) {
        console.warn("Story Gen failed gracefully:", e);
        return null;
    }
};

export const generateChatResponse = async (query: string, dataset: Dataset): Promise<string> => {
   const cacheKey = getCacheKey('chat', dataset, query);
   if (aiCache.has(cacheKey)) return aiCache.get(cacheKey);

   const ai = getAI();
   if (!ai) return "I can't answer that without an API Key.";
   
   const context = `
    Columns: ${dataset.columns.map(c => c.name).join(', ')}.
    KPIs: ${dataset.kpis.map(k => `${k.label}: ${k.value}`).join(', ')}.
   `;

   const prompt = `Context: ${context}. User Question: "${query}". Answer briefly in plain text.`;

   try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    }));
    const result = response.text || "No response generated.";
    aiCache.set(cacheKey, result);
    return result;
   } catch (e) {
     return "Error analyzing question. Please try again.";
   }
};

export const generateForecast = async (dataset: Dataset): Promise<ForecastPoint[]> => {
  const cacheKey = getCacheKey('forecast', dataset);
  if (aiCache.has(cacheKey)) return aiCache.get(cacheKey);

  const ai = getAI();
  if (!ai) return [];

  const dateCol = dataset.columns.find(c => c.type === ColumnType.DATE);
  const numCol = dataset.columns.find(c => c.type === ColumnType.NUMBER && !c.name.toLowerCase().includes('id'));

  if (!dateCol || !numCol) throw new Error("No time-series data found");

  const sortedRows = [...dataset.rows]
    .filter(r => r[dateCol.name] && r[numCol.name] !== null)
    .sort((a, b) => new Date(String(a[dateCol.name])).getTime() - new Date(String(b[dateCol.name])).getTime());
  
  const history = sortedRows.slice(-15).map(r => ({ date: r[dateCol.name], value: r[numCol.name] }));

  const prompt = `
    History: ${JSON.stringify(history)}
    Predict next 3 periods. Return JSON array: [{date, value, lowerBound, upperBound}].
  `;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              value: { type: Type.NUMBER },
              lowerBound: { type: Type.NUMBER },
              upperBound: { type: Type.NUMBER },
            },
            required: ['date', 'value', 'lowerBound', 'upperBound'],
          },
        },
      }
    }));
    if (!response.text) return [];
    const result = JSON.parse(response.text) as ForecastPoint[];
    aiCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Forecast generation failed:", error);
    return [];
  }
};
