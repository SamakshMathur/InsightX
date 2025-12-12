
import React, { useState, Suspense } from 'react';
import { Dataset, Theme } from './types';
import { DEMO_DATA } from './constants';
import { parseCSV, analyzeDataset } from './services/dataProcessor';

// Lazy Load Pages for Performance
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const DocsPage = React.lazy(() => import('./components/DocsPage'));
const CareersPage = React.lazy(() => import('./components/CareersPage'));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers'>('landing');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.NEON_DARK);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    
    // Process in a non-blocking way
    setTimeout(() => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          let data;
          
          try {
            if (file.name.endsWith('.json')) {
              data = JSON.parse(text);
            } else {
              data = parseCSV(text);
            }
            const analyzedData = analyzeDataset(file.name.split('.')[0], data);
            setDataset(analyzedData);
            setCurrentView('dashboard');
            setIsProcessing(false);
          } catch (error) {
            alert("Error parsing file. Please check format.");
            setIsProcessing(false);
          }
        };
        reader.readAsText(file);
    }, 50); // Small delay to allow UI to show processing state
  };

  const loadDemo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDataset(DEMO_DATA);
      setCurrentView('dashboard');
      setIsProcessing(false);
    }, 600);
  };

  const handleNewUpload = () => {
    setDataset(null);
    setCurrentView('landing');
  };

  const toggleTheme = () => {
     if (theme === Theme.NEON_DARK) setTheme(Theme.MINIMAL_LIGHT);
     else if (theme === Theme.MINIMAL_LIGHT) setTheme(Theme.DEEP_SPACE);
     else if (theme === Theme.DEEP_SPACE) setTheme(Theme.OCEAN_GRADIENT);
     else setTheme(Theme.NEON_DARK);
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-display font-bold animate-pulse">Initializing...</h2>
    </div>
  );

  const renderView = () => {
    if (isProcessing) {
      return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-display font-bold animate-pulse">Analyzing Data...</h2>
          <p className="text-gray-400 mt-2">Detecting schema, calculating KPIs, and generating insights.</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return dataset ? (
          <Dashboard 
            dataset={dataset} 
            theme={theme} 
            onNewUpload={handleNewUpload} 
            onNavigate={setCurrentView}
            onToggleTheme={toggleTheme}
          />
        ) : <LandingPage theme={theme} onFileUpload={handleFileUpload} onDemoLoad={loadDemo} onNavigate={setCurrentView} onToggleTheme={toggleTheme} />;
      case 'about':
        return <AboutPage theme={theme} onNavigate={setCurrentView} onNewUpload={handleNewUpload} onToggleTheme={toggleTheme} />;
      case 'blog':
        return <BlogPage theme={theme} onNavigate={setCurrentView} onNewUpload={handleNewUpload} onToggleTheme={toggleTheme} />;
      case 'docs':
        return <DocsPage theme={theme} onNavigate={setCurrentView} onNewUpload={handleNewUpload} onToggleTheme={toggleTheme} />;
      case 'careers':
        return <CareersPage theme={theme} onNavigate={setCurrentView} onNewUpload={handleNewUpload} onToggleTheme={toggleTheme} />;
      case 'landing':
      default:
        return <LandingPage theme={theme} onFileUpload={handleFileUpload} onDemoLoad={loadDemo} onNavigate={setCurrentView} onToggleTheme={toggleTheme} />;
    }
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      {renderView()}
    </Suspense>
  );
};

export default App;
