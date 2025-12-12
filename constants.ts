import { Dataset, ColumnType, Theme } from './types';

export const THEME_CONFIGS = {
  [Theme.NEON_DARK]: {
    bg: 'bg-gray-950',
    card: 'bg-gray-900/60 border-white/10 text-white',
    accent: 'text-cyan-400',
    chartColors: ['#06B6D4', '#8B5CF6', '#F472B6', '#34D399', '#FBBF24'],
  },
  [Theme.MINIMAL_LIGHT]: {
    bg: 'bg-gray-50',
    card: 'bg-white border-gray-200 text-gray-900 shadow-sm',
    accent: 'text-blue-600',
    chartColors: ['#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706'],
  },
  [Theme.DEEP_SPACE]: {
    bg: 'bg-[#0B0F19]',
    card: 'bg-[#151B2B]/80 border-blue-500/20 text-blue-50',
    accent: 'text-blue-400',
    chartColors: ['#3B82F6', '#6366F1', '#EC4899', '#10B981', '#F59E0B'],
  },
  [Theme.OCEAN_GRADIENT]: {
    bg: 'bg-slate-900',
    card: 'bg-slate-800/50 border-teal-500/20 text-slate-100',
    accent: 'text-teal-400',
    chartColors: ['#2DD4BF', '#0EA5E9', '#A855F7', '#FB7185', '#FACC15'],
  }
};

export const DEMO_DATA: Dataset = {
  name: "SaaS Sales Q3-Q4",
  rows: [
    { date: "2023-09-01", region: "North America", product: "Enterprise Plan", sales: 12000, units: 4 },
    { date: "2023-09-02", region: "Europe", product: "Pro Plan", sales: 4500, units: 15 },
    { date: "2023-09-03", region: "Asia", product: "Basic Plan", sales: 800, units: 20 },
    { date: "2023-09-04", region: "North America", product: "Enterprise Plan", sales: 15000, units: 5 },
    { date: "2023-09-05", region: "Europe", product: "Pro Plan", sales: 5200, units: 18 },
    { date: "2023-09-06", region: "Asia", product: "Pro Plan", sales: 3000, units: 10 },
    { date: "2023-09-07", region: "North America", product: "Basic Plan", sales: 1200, units: 30 },
    { date: "2023-09-08", region: "Europe", product: "Enterprise Plan", sales: 11000, units: 3 },
    { date: "2023-09-09", region: "Asia", product: "Basic Plan", sales: 900, units: 22 },
    { date: "2023-09-10", region: "North America", product: "Pro Plan", sales: 6000, units: 20 },
    { date: "2023-09-11", region: "Europe", product: "Enterprise Plan", sales: 13500, units: 4 },
    { date: "2023-09-12", region: "Asia", product: "Enterprise Plan", sales: 9500, units: 3 },
    { date: "2023-09-13", region: "North America", product: "Pro Plan", sales: 7200, units: 24 },
    { date: "2023-09-14", region: "Europe", product: "Basic Plan", sales: 1500, units: 35 },
    { date: "2023-09-15", region: "Asia", product: "Basic Plan", sales: 1100, units: 28 },
  ],
  columns: [
    { name: "date", type: ColumnType.DATE, uniqueValues: 15 },
    { name: "region", type: ColumnType.STRING, uniqueValues: 3 },
    { name: "product", type: ColumnType.STRING, uniqueValues: 3 },
    { name: "sales", type: ColumnType.NUMBER, uniqueValues: 14, min: 800, max: 15000, sum: 92400, avg: 6160 },
    { name: "units", type: ColumnType.NUMBER, uniqueValues: 10, min: 3, max: 35, sum: 237, avg: 15.8 },
  ],
  kpis: [
    { id: 'total_sales', label: 'Total Revenue', value: 92400, type: 'currency', trend: 12.5, trendLabel: 'vs last period' },
    { id: 'total_units', label: 'Units Sold', value: 237, type: 'number', trend: 5.2, trendLabel: 'vs last period' },
    { id: 'avg_order', label: 'Avg Order Value', value: 6160, type: 'currency', trend: -2.1, trendLabel: 'vs last period' },
  ]
};
