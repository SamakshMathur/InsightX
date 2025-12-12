

export type CellValue = string | number | boolean | null;

export interface DataRow {
  [key: string]: CellValue;
}

export enum ColumnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
}

export interface ColumnMetadata {
  name: string;
  type: ColumnType;
  uniqueValues: number;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
}

export interface Dataset {
  name: string;
  rows: DataRow[];
  columns: ColumnMetadata[];
  kpis: KPI[];
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend?: number; // percentage
  trendLabel?: string;
  type: 'currency' | 'number' | 'percentage';
}

export interface Insight {
  type: 'growth' | 'anomaly' | 'correlation' | 'general';
  title: string;
  description: string;
  confidence: number;
}

export interface ForecastPoint {
  date: string;
  value: number;
  lowerBound: number;
  upperBound: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter' | 'radar' | 'treemap' | 'bubble' | 'waterfall' | 'stacked_area' | 'heatmap' | 'manhattan' | 'boxplot' | 'sankey';
  xAxisKey: string;
  dataKeys: string[];
  description?: string;
  zAxisKey?: string; // For bubble charts
  segmentKey?: string; // For stacked/grouped/heatmap Y-axis/Sankey Target
}

export enum Theme {
  NEON_DARK = 'NEON_DARK',
  MINIMAL_LIGHT = 'MINIMAL_LIGHT',
  DEEP_SPACE = 'DEEP_SPACE',
  OCEAN_GRADIENT = 'OCEAN_GRADIENT',
}

export interface FilterState {
  [columnName: string]: string[] | [number, number] | null;
}

export interface StorySegment {
  id: string;
  title: string;
  text: string;
  chartId?: string; // Links to a specific chart for highlighting
  audioScript: string;
}

export interface DataStory {
  title: string;
  summary: string;
  segments: StorySegment[];
}

export interface VoiceConfig {
  voiceURI: string;
  rate: number;
  pitch: number;
  volume: number;
  style: 'neutral' | 'energetic' | 'professional';
}
