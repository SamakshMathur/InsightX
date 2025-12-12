
import { useState, useEffect } from 'react';
import { Dataset, ForecastPoint } from '../types';
import { generateForecast } from '../services/geminiService';

export const useForecast = (dataset: Dataset) => {
  const [forecast, setForecast] = useState<ForecastPoint[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset forecast when dataset changes
  useEffect(() => {
    setForecast(undefined);
    setError(null);
  }, [dataset]);

  // Auto-dismiss error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const runForecast = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateForecast(dataset);
      if (result && result.length > 0) {
        setForecast(result);
        return true;
      } else {
        setError("Forecast generation failed. Please check your API key and try again.");
        return false;
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Unable to generate forecast. Ensure your data has a valid Date and Number column.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearForecast = () => {
    setForecast(undefined);
  };

  const dismissError = () => {
    setError(null);
  };

  return {
    forecast,
    loading,
    error,
    runForecast,
    clearForecast,
    dismissError
  };
};
