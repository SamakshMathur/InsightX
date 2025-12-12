
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Dataset, Theme, Insight, ChartConfig, DataStory } from '../types';
import { generateSmartCharts } from '../services/dataProcessor';
import { generateAIInsights, generateChatResponse, generateDataStory } from '../services/geminiService';
import { generateLocalStory } from '../services/storyGenerator';
import { useForecast } from '../hooks/useForecast';
import { THEME_CONFIGS } from '../constants';
import ChartWidget from './ChartWidget';
import Navbar from './Navbar';
import { LayoutDashboard, TrendingUp, AlertCircle, MessageSquare, Download, Share2, Search, X, Sparkles, AlertTriangle, Calendar, Mic, Play } from 'lucide-react';

// Lazy load StoryMode
const StoryMode = React.lazy(() => import('./StoryMode'));

interface Props {
  dataset: Dataset;
  theme: Theme;
  onNewUpload: () => void;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onToggleTheme: () => void;
}

const Dashboard: React.FC<Props> = ({ dataset, theme, onNewUpload, onNavigate, onToggleTheme }) => {
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [story, setStory] = useState<DataStory | null>(null);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [highlightedChartId, setHighlightedChartId] = useState<string | undefined>(undefined);
  
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingStory, setLoadingStory] = useState(false);
  
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);
  
  const { forecast, loading: loadingForecast, error: forecastError, runForecast, clearForecast, dismissError } = useForecast(dataset);

  const themeStyle = THEME_CONFIGS[theme];

  useEffect(() => {
    // 1. Synchronous Generation (Instant)
    // Run this in a timeout to allow UI to paint first if dataset is massive
    setTimeout(() => {
        const smartCharts = generateSmartCharts(dataset);
        setCharts(smartCharts);

        const localStory = generateLocalStory(dataset);
        setStory(localStory);
    }, 0);

    // 2. Asynchronous AI Enhancement (Parallel for speed)
    const fetchAI = async () => {
        setLoadingInsights(true);
        setLoadingStory(true);
        
        try {
            const [aiInsights, aiStory] = await Promise.allSettled([
                generateAIInsights(dataset),
                generateDataStory(dataset, []) 
            ]);

            if (aiInsights.status === 'fulfilled') {
                setInsights(aiInsights.value);
            }

            if (aiStory.status === 'fulfilled' && aiStory.value) {
                setStory(aiStory.value);
            }
        } catch (e) {
            console.error("Background AI failed", e);
        } finally {
            setLoadingInsights(false);
            setLoadingStory(false);
        }
    };

    // Delay AI fetch slightly to prioritize UI rendering
    const t = setTimeout(fetchAI, 100);
    return () => clearTimeout(t);
    
  }, [dataset]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!chatQuery.trim()) return;
    setIsChatting(true);
    const response = await generateChatResponse(chatQuery, dataset);
    setChatResponse(response);
    setIsChatting(false);
  };

  const handleForecastClick = useCallback(async () => {
    await runForecast();
  }, [runForecast]);

  const toggleStory = useCallback(() => {
      if(story) setShowStoryMode(prev => !prev);
  }, [story]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeStyle.bg} text-white relative`}>
      <Navbar theme={theme} onNewUpload={onNewUpload} onNavigate={onNavigate} onToggleTheme={onToggleTheme} />

      <div className="pt-6 px-6 md:px-10 pb-10 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 text-sm opacity-60 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${theme === Theme.MINIMAL_LIGHT ? 'border-gray-300 text-gray-500' : 'border-white/20 text-gray-400'}`}>Dataset</span>
              <Calendar className="w-3 h-3" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <h1 className={`text-4xl font-display font-bold ${theme === Theme.MINIMAL_LIGHT ? 'text-gray-900' : 'text-white'}`}>
              {dataset.name}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <button 
               onClick={toggleStory}
               className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shadow-lg shadow-purple-900/10 ${theme === Theme.MINIMAL_LIGHT ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200' : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/30 hover:bg-brand-purple/20'}`}
            >
               {loadingStory ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
               {showStoryMode ? 'Hide Story' : 'Play Insights'}
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dataset.kpis.map((kpi) => (
            <div key={kpi.id} className={`p-6 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-1 duration-300 border ${themeStyle.card}`}>
              <p className={`text-sm font-medium mb-2 opacity-70`}>{kpi.label}</p>
              <div className="flex items-end justify-between">
                <h3 className={`text-3xl font-bold font-display`}>
                  {kpi.type === 'currency' ? '$' : ''}{kpi.value.toLocaleString()}
                  {kpi.type === 'percentage' ? '%' : ''}
                </h3>
                {kpi.trend && (
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${kpi.trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    <TrendingUp className={`w-3 h-3 ${kpi.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(kpi.trend)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            {charts.map((chart) => {
              const isTrendChart = chart.type === 'line' || chart.type === 'area';
              const isHighlighted = highlightedChartId === chart.id || (highlightedChartId && chart.id.includes(highlightedChartId));
              
              return (
                <div key={chart.id} id={chart.id} className={`p-1 rounded-2xl border transition-all duration-500 ${isHighlighted ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/10' : ''} ${themeStyle.card}`}>
                  <div className="flex justify-between items-center mb-0 p-4 pb-0">
                    <div className="flex items-center gap-2">
                      {isTrendChart && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleForecastClick}
                            disabled={loadingForecast || !!forecast}
                            className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                              forecast 
                                ? 'bg-purple-600/90 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)] cursor-default' 
                                : theme === Theme.MINIMAL_LIGHT ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            } ${loadingForecast ? 'opacity-70 cursor-wait' : ''}`}
                          >
                            <Sparkles className={`w-3 h-3 ${loadingForecast ? 'animate-spin' : ''}`} />
                            {loadingForecast ? 'Analyzing...' : forecast ? 'Forecast Active' : 'AI Forecast'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-[400px] w-full p-4 pt-0">
                    <ChartWidget 
                      config={chart} 
                      data={dataset.rows} 
                      theme={theme} 
                      forecast={isTrendChart ? forecast : undefined} 
                      isHighlighted={isHighlighted}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 min-w-0">
             <div className={`p-6 rounded-2xl border ${themeStyle.card}`}>
                <h4 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-4">Ask Your Data</h4>
                <form onSubmit={handleChat} className="relative">
                  <input 
                    type="text" 
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="e.g. Why did sales drop?"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all ${
                      theme === Theme.MINIMAL_LIGHT 
                      ? 'bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 text-gray-900' 
                      : 'bg-black/30 border border-white/10 focus:border-brand-blue text-white'
                    }`}
                  />
                  <Search className="absolute left-3 top-3.5 w-4 h-4 opacity-40" />
                </form>
                {chatResponse && (
                  <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed animate-pulse-slow ${theme === Theme.MINIMAL_LIGHT ? 'bg-blue-50 text-blue-900' : 'bg-blue-900/20 text-blue-100'}`}>
                    {isChatting ? 'Analyzing...' : chatResponse}
                  </div>
                )}
             </div>

            <div className={`p-6 rounded-2xl border ${themeStyle.card} relative overflow-hidden`}>
               <h4 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-purple" />
                  Smart Insights
               </h4>
               {loadingInsights ? (
                 <div className="space-y-4 animate-pulse">
                   {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-500/10 rounded-xl"></div>)}
                 </div>
               ) : (
                 <div className="space-y-4">
                   {insights.map((insight, idx) => (
                     <div key={idx} className={`p-4 rounded-xl border-l-2 ${
                       insight.type === 'growth' ? 'border-green-500 bg-green-500/5' : 
                       insight.type === 'anomaly' ? 'border-red-500 bg-red-500/5' : 
                       'border-brand-blue bg-blue-500/5'
                     }`}>
                        <h5 className="font-semibold text-sm mb-1">{insight.title}</h5>
                        <p className="text-xs opacity-70 leading-relaxed">{insight.description}</p>
                     </div>
                   ))}
                   {insights.length === 0 && <p className="text-sm opacity-50">No major insights detected yet.</p>}
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Story Mode Panel */}
        {showStoryMode && story && (
            <Suspense fallback={<div className="fixed right-0 top-24 bottom-6 w-96 m-4 bg-black/80 flex items-center justify-center rounded-2xl z-50">Loading Story...</div>}>
                <StoryMode 
                    story={story} 
                    theme={theme} 
                    onClose={() => setShowStoryMode(false)} 
                    onHighlightChart={setHighlightedChartId} 
                />
            </Suspense>
        )}

        {/* Error Toast */}
        {forecastError && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/50 backdrop-blur-xl rounded-2xl shadow-2xl text-red-200 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium">{forecastError}</span>
            <button onClick={dismissError} className="ml-2 hover:bg-red-500/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
