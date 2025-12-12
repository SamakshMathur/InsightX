
import React, { useMemo, useState, useCallback } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap, ScatterChart, Scatter, 
  ZAxis, Sankey
} from 'recharts';
import { ChartConfig, Theme, ForecastPoint } from '../types';
import { THEME_CONFIGS } from '../constants';
import { AlertCircle, AlertTriangle, RefreshCw, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, Download, ChevronDown, MoreHorizontal, Maximize2 } from 'lucide-react';

interface Props {
  config: ChartConfig;
  data: any[];
  theme: Theme;
  forecast?: ForecastPoint[];
  isHighlighted?: boolean;
}

// Fallback Demo Data Generator
const getFallbackData = (type: string) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    value: Math.floor(Math.random() * 5000) + 1000,
    value2: Math.floor(Math.random() * 3000) + 500,
  }));
};

class ChartErrorBoundary extends React.Component<{ children: React.ReactNode, onRetry: () => void }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("ChartWidget Rendering Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-red-500/20 rounded-xl bg-red-500/5">
          <AlertTriangle className="w-10 h-10 mb-3 text-red-400" />
          <h3 className="text-sm font-bold text-red-300">Unable to render chart</h3>
          <p className="text-xs opacity-60 mt-1 mb-4 max-w-[200px] overflow-hidden text-ellipsis">
            {this.state.error?.message || "Data format issue detected"}
          </p>
          <div className="flex gap-2">
            <button 
                onClick={() => this.setState({ hasError: false })}
                className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
                Retry
            </button>
            <button 
                onClick={this.props.onRetry}
                className="px-3 py-1.5 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
                Use Sample
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ChartWidget: React.FC<Props> = React.memo(({ config, data, theme, forecast, isHighlighted }) => {
  const [activeType, setActiveType] = useState<string>(config.type);
  const [showControls, setShowControls] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const themeColors = THEME_CONFIGS[theme].chartColors;
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const gridColor = isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)";
  const textColor = isLight ? "#374151" : "#9ca3af";
  const tooltipBg = isLight ? "#ffffff" : "#1e293b";
  const tooltipBorder = isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)";

  // Derived effective data
  const effectiveData = useMemo(() => {
    if (useSampleData || !data || data.length === 0) {
        return getFallbackData(activeType);
    }
    
    // Safety check: if data exists but keys are missing, we might want fallback
    const hasKeys = data.some(d => d[config.dataKeys[0]] !== undefined);
    if (!hasKeys && !['treemap', 'sankey'].includes(activeType)) return getFallbackData(activeType);

    // Performance Downsampling
    if (data.length > 500 && ['line', 'area', 'bar', 'scatter'].includes(activeType)) {
       const step = Math.ceil(data.length / 500);
       return data.filter((_, i) => i % step === 0);
    }
    
    // Forecast merging
    if (forecast && ['line', 'area'].includes(activeType)) {
       const targetKey = config.dataKeys[0];
       const historyData = data.map(d => ({
         ...d,
         [`${targetKey}_history`]: d[targetKey],
         isForecast: false,
       }));
       const forecastData = forecast.map(f => ({
         [config.xAxisKey]: f.date,
         [`${targetKey}_forecast`]: f.value,
         [`${targetKey}_lower`]: f.lowerBound,
         [`${targetKey}_upper`]: f.upperBound,
         isForecast: true,
       }));
       // Stitch
       if (historyData.length > 0) {
        const last = historyData[historyData.length - 1];
        last[`${targetKey}_forecast`] = last[`${targetKey}_history`];
       }
       return [...historyData, ...forecastData];
    }
    
    return data;
  }, [data, config, forecast, activeType, useSampleData, refreshKey]);

  // Insight Generation (Quick Heuristic)
  const insightCaption = useMemo(() => {
    if (!effectiveData || effectiveData.length === 0) return "No data available.";
    
    if (useSampleData) return "Sample pattern visualization (Demo Mode).";

    const key = config.dataKeys[0];
    const vals = effectiveData.map(d => Number(d[key]) || 0);
    if (vals.length < 2) return `Tracking ${key} metrics.`;

    const first = vals[0];
    const last = vals[vals.length - 1];
    const diff = last - first;
    const change = first !== 0 ? ((diff / first) * 100).toFixed(1) : 0;
    
    if (activeType === 'bar' || activeType === 'donut' || activeType === 'pie') {
        // Find max
        let maxVal = -Infinity;
        let maxLabel = '';
        effectiveData.forEach(d => {
            const v = Number(d[key]);
            if (v > maxVal) {
                maxVal = v;
                maxLabel = String(d[config.xAxisKey]);
            }
        });
        return `Top driver: ${maxLabel} (${maxVal.toLocaleString()}).`;
    }

    return `${diff >= 0 ? 'Trending up' : 'Trending down'} by ${Math.abs(Number(change))}% over this period.`;
  }, [effectiveData, config, activeType, useSampleData]);

  // Handlers
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setUseSampleData(false); // Try to reload real data
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setShowControls(false);
  };

  const containerClass = `w-full h-full min-h-[300px] transition-all duration-500 relative group/chart ${isHighlighted ? 'ring-2 ring-cyan-400 scale-[1.01] shadow-2xl shadow-cyan-500/20 rounded-xl bg-cyan-500/5' : ''}`;

  // If absolutely no data and no fallback request yet, show empty state or fallback automatically
  if ((!data || data.length === 0) && !useSampleData) {
     // Auto-switch to sample data if empty
     setTimeout(() => setUseSampleData(true), 0);
     return null; 
  }

  const renderChart = () => {
    const commonProps = {
      data: effectiveData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const XAxisProps = {
      dataKey: config.xAxisKey || 'name',
      stroke: textColor,
      fontSize: 12,
      tickLine: false,
      axisLine: false,
      tickMargin: 10,
    };

    const YAxisProps = {
      stroke: textColor,
      fontSize: 12,
      tickLine: false,
      axisLine: false,
      tickFormatter: (val: number) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : String(val),
    };

    const TooltipProps = {
      contentStyle: { backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
      itemStyle: { color: isLight ? '#111827' : '#e2e8f0' },
      cursor: { fill: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }
    };

    switch (activeType) {
      case 'line':
      case 'area':
        const ChartComponent = activeType === 'area' ? AreaChart : LineChart;
        const DataComponent = activeType === 'area' ? Area : Line;
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent {...commonProps}>
              <defs>
                {config.dataKeys.map((key, i) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColors[i % themeColors.length]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={themeColors[i % themeColors.length]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis {...XAxisProps} />
              <YAxis {...YAxisProps} />
              <Tooltip {...TooltipProps} />
              <Legend />
              {config.dataKeys.map((key, i) => (
                <DataComponent 
                  key={key}
                  type="monotone" 
                  dataKey={forecast ? `${key}_history` : key} 
                  stroke={themeColors[i % themeColors.length]} 
                  fill={activeType === 'area' ? `url(#grad-${key})` : undefined}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  name={key}
                />
              ))}
              {/* Forecast Lines */}
              {forecast && config.dataKeys.map((key, i) => (
                <DataComponent
                  key={`${key}-forecast`}
                  type="monotone"
                  dataKey={`${key}_forecast`}
                  stroke={themeColors[i % themeColors.length]}
                  strokeDasharray="5 5"
                  fill="transparent"
                  dot={false}
                  name={`${key} (Forecast)`}
                  opacity={0.7}
                />
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis {...XAxisProps} />
              <YAxis {...YAxisProps} />
              <Tooltip {...TooltipProps} />
              <Legend />
              {config.dataKeys.map((key, i) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={themeColors[i % themeColors.length]} 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={effectiveData}
                cx="50%"
                cy="50%"
                innerRadius={activeType === 'donut' ? 60 : 0}
                outerRadius={80}
                paddingAngle={5}
                dataKey={config.dataKeys[0]}
                nameKey={config.xAxisKey || 'name'}
              >
                {effectiveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                ))}
              </Pie>
              <Tooltip {...TooltipProps} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
           <ResponsiveContainer width="100%" height="100%">
             <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
               <XAxis type="number" dataKey={config.xAxisKey} name={config.xAxisKey} {...XAxisProps} />
               <YAxis type="number" dataKey={config.dataKeys[0]} name={config.dataKeys[0]} {...YAxisProps} />
               <Tooltip cursor={{ strokeDasharray: '3 3' }} {...TooltipProps} />
               <Scatter name={config.title} data={effectiveData} fill={themeColors[0]} />
             </ScatterChart>
           </ResponsiveContainer>
        );

      default:
         // Fallback to Bar for unknown types
         return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis {...XAxisProps} />
              <YAxis {...YAxisProps} />
              <Tooltip {...TooltipProps} />
              <Legend />
              <Bar dataKey={config.dataKeys[0] || 'value'} fill={themeColors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className={containerClass}>
       {/* Chart Header & Controls */}
       <div className="flex justify-between items-start mb-4 px-1 pt-1">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
               {config.title}
               {useSampleData && (
                 <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">Demo Data</span>
               )}
            </h3>
            <p className="text-xs opacity-60 mt-0.5">{insightCaption}</p>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover/chart:opacity-100 transition-opacity">
              <button 
                onClick={handleRefresh}
                title="Refresh Data"
                className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-gray-400'}`}
              >
                 <RefreshCw className={`w-4 h-4 ${refreshKey > 0 ? 'animate-spin' : ''}`} />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowControls(!showControls)}
                  title="Chart Options"
                  className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-gray-400'}`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                {showControls && (
                  <div className={`absolute right-0 top-full mt-2 w-40 rounded-xl border shadow-xl z-50 overflow-hidden ${isLight ? 'bg-white border-gray-200' : 'bg-[#1e293b] border-white/10'}`}>
                     <div className="p-1">
                        <div className={`px-3 py-2 text-xs font-bold uppercase opacity-50 ${textColor}`}>View As</div>
                        <button onClick={() => handleTypeChange('line')} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg ${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                           <LineChartIcon className="w-4 h-4" /> Line Chart
                        </button>
                        <button onClick={() => handleTypeChange('bar')} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg ${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                           <BarChart2 className="w-4 h-4" /> Bar Chart
                        </button>
                        <button onClick={() => handleTypeChange('area')} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg ${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                           <Activity className="w-4 h-4" /> Area Chart
                        </button>
                        <button onClick={() => handleTypeChange('donut')} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg ${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                           <PieChartIcon className="w-4 h-4" /> Donut
                        </button>
                        <div className={`my-1 border-t ${isLight ? 'border-gray-100' : 'border-white/5'}`}></div>
                        <button onClick={() => { setUseSampleData(true); setShowControls(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg ${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                           <Activity className="w-4 h-4" /> Load Demo Data
                        </button>
                     </div>
                  </div>
                )}
              </div>
          </div>
       </div>

       {/* Chart Rendering Area */}
       <div className="flex-1 w-full h-[300px] relative">
          <ChartErrorBoundary onRetry={() => setUseSampleData(true)}>
            {renderChart()}
          </ChartErrorBoundary>
       </div>
    </div>
  );
});

export default ChartWidget;
