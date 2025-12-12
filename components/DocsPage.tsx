
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';
import { Book, FileText, Filter, Brain, Download, Layout, Terminal, ChevronRight, Zap } from 'lucide-react';

interface Props {
  theme: Theme;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onNewUpload: () => void;
  onToggleTheme: () => void;
}

type SectionId = 'getting-started' | 'uploading' | 'dashboards' | 'filters' | 'ai-insights' | 'exporting' | 'powerbi';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: <Book className="w-4 h-4" /> },
  { id: 'uploading', label: 'Uploading Files', icon: <FileText className="w-4 h-4" /> },
  { id: 'dashboards', label: 'Understanding Dashboards', icon: <Layout className="w-4 h-4" /> },
  { id: 'filters', label: 'Smart Filters', icon: <Filter className="w-4 h-4" /> },
  { id: 'ai-insights', label: 'AI Insights', icon: <Brain className="w-4 h-4" /> },
  { id: 'exporting', label: 'Exporting Data', icon: <Download className="w-4 h-4" /> },
  { id: 'powerbi', label: 'PowerBI Integration', icon: <Zap className="w-4 h-4" /> },
];

const DocsPage: React.FC<Props> = ({ theme, onNavigate, onNewUpload, onToggleTheme }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('getting-started');
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const themeConfig = THEME_CONFIGS[theme];
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10';

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">Getting Started with InsightX</h2>
              <p className={`${subTextColor} text-lg leading-relaxed`}>
                Welcome to InsightX. This platform allows you to transform raw data files (CSV, JSON, Excel) into interactive, AI-powered dashboards in seconds.
              </p>
            </div>
            
            <div className={`border rounded-xl p-6 ${cardBg}`}>
              <h3 className="text-lg font-bold mb-3 text-cyan-400">Prerequisites</h3>
              <ul className={`space-y-2 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-1 text-gray-500" />
                  A modern web browser (Chrome, Edge, Firefox, Safari)
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-1 text-gray-500" />
                  A structured data file (.csv or .json)
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-1 text-gray-500" />
                  Internet connection for AI processing
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Start</h3>
              <div className="space-y-4">
                <Step number={1} title="Prepare your data" desc="Ensure your CSV has headers in the first row." isLight={isLight} />
                <Step number={2} title="Upload" desc="Drag and drop your file onto the InsightX homepage." isLight={isLight} />
                <Step number={3} title="Analyze" desc="Watch as the engine automatically detects schema and generates KPIs." isLight={isLight} />
              </div>
            </div>
          </div>
        );
      
      case 'uploading':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div>
              <h2 className="text-3xl font-display font-bold mb-4">Uploading Data</h2>
              <p className={`${subTextColor} text-lg leading-relaxed mb-6`}>
                InsightX supports various structured data formats. Our parsing engine automatically detects data types (dates, numbers, strings).
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold">Supported Formats</h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className={`p-4 rounded-lg border ${isLight ? 'bg-blue-50 border-blue-100' : 'bg-blue-500/10 border-blue-500/20'}`}>
                    <div className="font-bold text-blue-400 mb-2">CSV (.csv)</div>
                    <p className={`text-sm ${subTextColor}`}>Comma-separated values. First row must contain column headers. Standard encoding (UTF-8) recommended.</p>
                 </div>
                 <div className={`p-4 rounded-lg border ${isLight ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                    <div className="font-bold text-yellow-400 mb-2">JSON (.json)</div>
                    <p className={`text-sm ${subTextColor}`}>Array of objects. Keys are treated as column names. Nested objects are flattened automatically.</p>
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Example Structure</h3>
              <p className={`${subTextColor} mb-4`}>Your data should look something like this:</p>
              <CodeBlock code={`date,region,sales,units\n2023-01-01,North,1200,45\n2023-01-02,South,850,22\n2023-01-03,East,2100,80`} label="sales_data.csv" isLight={isLight} />
            </div>
          </div>
        );

      case 'dashboards':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">The Dashboard Interface</h2>
              <p className={`${subTextColor} text-lg leading-relaxed`}>
                Once processed, your data is visualized in a modular dashboard layout containing three key areas.
              </p>
            </div>

            <div className="grid gap-6">
               <div className={`flex gap-4 p-4 rounded-xl border ${cardBg}`}>
                 <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}>1</div>
                 <div>
                   <h4 className="font-bold text-lg">KPI Cards</h4>
                   <p className={subTextColor}>Top-level metrics (Sum, Average, Count) automatically calculated from numeric columns.</p>
                 </div>
               </div>
               <div className={`flex gap-4 p-4 rounded-xl border ${cardBg}`}>
                 <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold ${isLight ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500/20 text-cyan-400'}`}>2</div>
                 <div>
                   <h4 className="font-bold text-lg">Smart Charts</h4>
                   <p className={subTextColor}>Dynamic visualizations. Line charts for time-series, bar charts for categories, and pie charts for composition.</p>
                 </div>
               </div>
               <div className={`flex gap-4 p-4 rounded-xl border ${cardBg}`}>
                 <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold ${isLight ? 'bg-pink-100 text-pink-600' : 'bg-pink-500/20 text-pink-400'}`}>3</div>
                 <div>
                   <h4 className="font-bold text-lg">AI Storytelling</h4>
                   <p className={subTextColor}>A narrative side-panel that generates plain-English explanations of trends and anomalies.</p>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'ai-insights':
        return (
           <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">AI Features</h2>
              <p className={`${subTextColor} text-lg leading-relaxed`}>
                InsightX uses Google Gemini models to provide semantic understanding of your quantitative data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Forecasting</h3>
              <p className={`${subTextColor} mb-6`}>
                Our forecasting engine analyzes historical data points to predict future trends. It generates a confidence interval (the shaded area) representing 95% probability.
              </p>
              <div className={`p-4 rounded-lg border text-sm font-mono ${isLight ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-gray-900 border-white/10 text-gray-300'}`}>
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                   <Terminal className="w-4 h-4" /> System Logic
                </div>
                <p>Input: Last 20 data points (Date, Value)</p>
                <p>Process: Trend detection + Seasonality check</p>
                <p>Output: Next 3 periods with Upper/Lower bounds</p>
              </div>
            </div>

            <div>
               <h3 className="text-xl font-bold mb-4">Natural Language Search</h3>
               <p className={`${subTextColor} mb-4`}>
                 You can ask questions like "Why did sales drop in November?" or "What is the top region?". The AI uses the dataset context to generate an answer.
               </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <div className="text-4xl font-bold mb-2">Coming Soon</div>
             <p>This documentation section is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${textColor} selection:bg-cyan-500/30 font-sans transition-colors duration-500`}>
      <Navbar theme={theme} onNavigate={onNavigate} onNewUpload={onNewUpload} onToggleTheme={onToggleTheme} />
      
      <div className="pt-6 max-w-7xl mx-auto flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className={`w-full md:w-64 shrink-0 md:h-[calc(100vh-6rem)] md:sticky md:top-24 border-r overflow-y-auto ${isLight ? 'border-gray-200 bg-white' : 'border-white/5 bg-[#020617]'}`}>
          <div className="p-6">
            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Documentation</h5>
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SectionId)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                      : (isLight ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/5')
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </nav>
            
            <div className={`mt-8 pt-8 border-t ${isLight ? 'border-gray-200' : 'border-white/5'}`}>
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Resources</h5>
              <a href="#" className={`flex items-center gap-2 text-sm mb-3 ${isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}>
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> API Status
              </a>
              <a href="#" className={`flex items-center gap-2 text-sm ${isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}>
                 <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Community
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
           <div className="max-w-3xl mx-auto py-12 px-6 md:px-12">
              {renderContent()}
           </div>
        </div>

      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const Step = ({ number, title, desc, isLight }: { number: number, title: string, desc: string, isLight: boolean }) => (
  <div className="flex gap-4">
    <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${isLight ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-white/10 border-white/10'}`}>
      {number}
    </div>
    <div>
      <h4 className="font-bold">{title}</h4>
      <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
    </div>
  </div>
);

const CodeBlock = ({ code, label, isLight }: { code: string, label?: string, isLight: boolean }) => (
  <div className={`rounded-lg overflow-hidden border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-[#0f172a]'}`}>
    {label && <div className={`px-4 py-2 border-b text-xs text-gray-500 font-mono ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/5'}`}>{label}</div>}
    <pre className={`p-4 text-sm font-mono overflow-x-auto ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
      <code>{code}</code>
    </pre>
  </div>
);

export default DocsPage;
