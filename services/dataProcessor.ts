
import { Dataset, DataRow, ColumnType, ColumnMetadata, KPI, ChartConfig } from '../types';

export const parseCSV = (csvText: string): DataRow[] => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: DataRow[] = new Array(lines.length - 1);
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: DataRow = {};
    for (let j = 0; j < headers.length; j++) {
      let val = values[j] ? values[j].trim().replace(/^"|"$/g, '') : null;
      if (val === null || val === '') {
        row[headers[j]] = null;
        continue;
      }
      const numVal = Number(val);
      if (!isNaN(numVal) && val !== '') {
         row[headers[j]] = numVal;
      } else if (val.toLowerCase() === 'true') {
         row[headers[j]] = true;
      } else if (val.toLowerCase() === 'false') {
         row[headers[j]] = false;
      } else {
         row[headers[j]] = val;
      }
    }
    rows[i - 1] = row;
  }
  return rows;
};

const detectColumnType = (values: any[]): ColumnType => {
  let count = 0;
  const sample: any[] = [];
  for (const v of values) {
      if (v !== null && v !== undefined && v !== '') {
          sample.push(v);
          count++;
          if (count >= 100) break;
      }
  }
  
  if (sample.length === 0) return ColumnType.STRING;

  const isNumber = sample.every(v => typeof v === 'number');
  if (isNumber) return ColumnType.NUMBER;

  const isDate = sample.every(v => !isNaN(Date.parse(String(v))));
  if (isDate && sample.some(v => String(v).includes('-') || String(v).includes('/'))) return ColumnType.DATE;

  const isBoolean = sample.every(v => typeof v === 'boolean');
  if (isBoolean) return ColumnType.BOOLEAN;

  return ColumnType.STRING;
};

export const analyzeDataset = (name: string, rows: DataRow[]): Dataset => {
  if (rows.length === 0) throw new Error("Empty dataset");

  const columnNames = Object.keys(rows[0]);
  const columns: ColumnMetadata[] = columnNames.map(col => {
    const values = rows.map(r => r[col]);
    const type = detectColumnType(values);
    const uniqueValues = new Set(values).size;

    let meta: ColumnMetadata = { name: col, type, uniqueValues };

    if (type === ColumnType.NUMBER) {
      const nums = values.filter(v => typeof v === 'number') as number[];
      if (nums.length > 0) {
        meta.min = Math.min(...nums);
        meta.max = Math.max(...nums);
        meta.sum = nums.reduce((a, b) => a + b, 0);
        meta.avg = meta.sum / nums.length;
      }
    }
    return meta;
  });

  const kpis: KPI[] = [];
  kpis.push({
    id: 'total_records',
    label: 'Total Records',
    value: rows.length,
    type: 'number'
  });

  const numberCols = columns.filter(c => c.type === ColumnType.NUMBER && !c.name.toLowerCase().includes('id'));
  if (numberCols.length > 0) {
    const primaryMetric = numberCols.reduce((prev, current) => (prev.sum || 0) > (current.sum || 0) ? prev : current);
    
    if (primaryMetric.sum) {
      kpis.push({
        id: `sum_${primaryMetric.name}`,
        label: `Total ${primaryMetric.name.charAt(0).toUpperCase() + primaryMetric.name.slice(1)}`,
        value: Math.round(primaryMetric.sum * 100) / 100,
        type: 'currency',
        trend: Math.floor(Math.random() * 20) - 5
      });

      if (primaryMetric.avg) {
        kpis.push({
          id: `avg_${primaryMetric.name}`,
          label: `Avg ${primaryMetric.name.charAt(0).toUpperCase() + primaryMetric.name.slice(1)}`,
          value: Math.round(primaryMetric.avg * 100) / 100,
          type: 'currency'
        });
      }
    }
  }

  return { name, rows, columns, kpis };
};

export const generateSmartCharts = (dataset: Dataset): ChartConfig[] => {
  const charts: ChartConfig[] = [];
  const { columns } = dataset;

  const dateCol = columns.find(c => c.type === ColumnType.DATE);
  const catCols = columns.filter(c => c.type === ColumnType.STRING && c.uniqueValues < 50);
  const numCols = columns.filter(c => c.type === ColumnType.NUMBER && !c.name.toLowerCase().includes('id'));

  // 1. Trend Line (Time Series) - Priority 1
  if (dateCol && numCols.length > 0) {
    const isSports = columns.some(c => ['over', 'inning', 'match'].some(k => c.name.toLowerCase().includes(k)));
    charts.push({
      id: 'trend_main',
      title: isSports ? `${numCols[0].name} Progression` : `${numCols[0].name} Over Time`,
      type: 'area', 
      xAxisKey: dateCol.name,
      dataKeys: [numCols[0].name],
      description: isSports ? 'Cumulative score progression' : `Historical trend analysis of ${numCols[0].name}`
    });
  }

  // 2. Category Breakdown (Donut/Bar) - Priority 2
  if (catCols.length > 0 && numCols.length > 0) {
    charts.push({
      id: 'cat_breakdown',
      title: `${numCols[0].name} by ${catCols[0].name}`,
      type: 'donut',
      xAxisKey: catCols[0].name,
      dataKeys: [numCols[0].name],
      description: `Distribution across top categories`
    });
  }

  // 3. Correlation (Scatter)
  if (numCols.length >= 2) {
    charts.push({
        id: 'correlation_scatter',
        title: `${numCols[0].name} vs ${numCols[1].name}`,
        type: 'scatter',
        xAxisKey: numCols[0].name,
        dataKeys: [numCols[1].name],
        description: 'Correlation analysis between metrics'
    });
  }

  // 4. Fallback: Histogram / Distribution if only 1 numeric column and no date
  if (charts.length === 0 && numCols.length > 0) {
      charts.push({
          id: 'distribution_bar',
          title: `${numCols[0].name} Distribution`,
          type: 'bar',
          xAxisKey: catCols.length > 0 ? catCols[0].name : 'index', // Fallback to index if no category
          dataKeys: [numCols[0].name],
          description: `Value distribution of ${numCols[0].name}`
      });
  }

  // 5. Fillers to ensure at least 3 charts if possible (Balance the grid)
  if (charts.length < 3 && numCols.length > 1) {
     // Add another bar/line for secondary metric
     const secondary = numCols[1];
     if (dateCol) {
        charts.push({
            id: 'trend_secondary',
            title: `${secondary.name} Trend`,
            type: 'line',
            xAxisKey: dateCol.name,
            dataKeys: [secondary.name],
            description: `Trend analysis for ${secondary.name}`
        });
     } else if (catCols.length > 0) {
        charts.push({
            id: 'cat_breakdown_secondary',
            title: `${secondary.name} by ${catCols[0].name}`,
            type: 'bar',
            xAxisKey: catCols[0].name,
            dataKeys: [secondary.name],
            description: `Comparative analysis`
        });
     }
  }

  // 6. Absolute Fallback for Empty/Invalid Mapping
  if (charts.length === 0) {
      charts.push({
          id: 'demo_fallback',
          title: 'Sample Data Overview',
          type: 'bar',
          xAxisKey: 'category',
          dataKeys: ['value'],
          description: 'No mapable columns found. Showing sample data pattern.'
      });
  }

  return charts;
}
