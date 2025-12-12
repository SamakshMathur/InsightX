import React, { useRef, useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import Footer from './Footer';
import Navbar from './Navbar';
import RawToInsightsHero from './RawToInsightsHero';
import { Theme } from '../types';
import { DEMO_DATA, THEME_CONFIGS } from '../constants';
import { 
  LayoutDashboard, Brain, Filter, Share2, Quote, Mail, Loader2, CheckCircle, 
  ArrowRight, X, FileSpreadsheet, Sparkles, Play, Pause, BarChart3, 
  PieChart, LineChart, Globe, Shield, Lock, Server, Zap, Search, 
  ShoppingBag, Landmark, Activity, Truck, GraduationCap, Megaphone,
  ChevronRight, ChevronLeft, Star, MousePointer2, TrendingUp
} from 'lucide-react';

interface Props {
  theme: Theme;
  onFileUpload: (file: File) => void;
  onDemoLoad: () => void;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onToggleTheme: () => void;
}

const LandingPage: React.FC<Props> = ({ theme, onFileUpload, onDemoLoad, onNavigate, onToggleTheme }) => {
  const uploadRef = useRef<HTMLDivElement>(null);
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const themeConfig = THEME_CONFIGS[theme];

  // Dynamic Styles based on Theme
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-600' : 'text-gray-400';
  const borderColor = isLight ? 'border-gray-200' : 'border-white/10';
  const cardBg = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10';

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${textColor} overflow-x-hidden relative transition-colors duration-500 selection:bg-cyan-500/30`}>
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${isLight ? 'bg-blue-200/40' : 'bg-brand-blue/20'}`}></div>
      
      <Navbar theme={theme} onNavigate={onNavigate} onToggleTheme={onToggleTheme} />

      <div className="layout-safe-stack pb-0">
        
        {/* HERO SECTION */}
        <RawToInsightsHero 
          theme={theme} 
          data={DEMO_DATA.rows} 
          onDemoLoad={onDemoLoad}
          onUploadClick={scrollToUpload}
        />

        {/* 1. PROBLEM -> SOLUTION EXPLAINER */}
        <section className="section-container px-6 safe-zone">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                {/* Problem */}
                <div className={`p-8 rounded-3xl border border-dashed relative overflow-hidden ${isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-900/5 border-red-500/20'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileSpreadsheet className="w-32 h-32 text-red-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                        <X className="w-5 h-5" /> The Old Way
                    </h3>
                    <ul className={`space-y-4 ${isLight ? 'text-red-900/70' : 'text-red-200/70'}`}>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                            Messy spreadsheets with thousands of rows
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                            Hours wasted cleaning and formatting data
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                            Static charts that don't explain "why"
                        </li>
                    </ul>
                </div>

                {/* Solution */}
                <div className={`p-8 rounded-3xl border relative overflow-hidden ${isLight ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-xl shadow-blue-900/5' : 'bg-gradient-to-br from-cyan-900/10 to-transparent border-cyan-500/30 shadow-2xl shadow-cyan-900/10'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-32 h-32 text-cyan-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
                        <CheckCircle className="w-5 h-5" /> The InsightX Way
                    </h3>
                    <ul className={`space-y-4 font-medium ${isLight ? 'text-gray-700' : 'text-gray-200'}`}>
                        <li className="flex gap-3 items-center">
                            <div className={`p-1 rounded-full ${isLight ? 'bg-blue-100 text-blue-600' : 'bg-cyan-500/20 text-cyan-400'}`}><Zap className="w-3 h-3" /></div>
                            Auto-built interactive dashboards
                        </li>
                        <li className="flex gap-3 items-center">
                            <div className={`p-1 rounded-full ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}><Brain className="w-3 h-3" /></div>
                            AI-powered narrative explanations
                        </li>
                        <li className="flex gap-3 items-center">
                            <div className={`p-1 rounded-full ${isLight ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'}`}><Share2 className="w-3 h-3" /></div>
                            Real-time sharing & export
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* 4. BEFORE & AFTER SLIDER (Moved up for impact) */}
        <section className="section-container px-6 safe-zone overflow-hidden">
             <div className="max-w-5xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">See the transformation</h2>
                <p className={subTextColor}>Drag the slider to convert raw data into visual intelligence.</p>
             </div>
             <BeforeAfterSlider theme={theme} />
        </section>

        {/* FILE UPLOAD (Primary CTA) */}
        <div ref={uploadRef} className="section-container relative z-10 px-6 safe-zone">
           <div className="max-w-5xl mx-auto layout-safe-stack items-center gap-8">
               <FileUpload onFileUpload={onFileUpload} onDemoLoad={onDemoLoad} />
           </div>
        </div>

        {/* 2. AI NARRATOR PREVIEW */}
        <section className={`section-container px-6 safe-zone ${isLight ? 'bg-gray-50/50' : 'bg-white/[0.02]'}`}>
           <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300'}`}>
                     <Brain className="w-3 h-3" /> Audio Insights
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Your data, narrated.</h2>
                  <p className={`text-lg leading-relaxed mb-8 ${subTextColor}`}>
                     Don't just look at charts—listen to them. InsightX generates professional audio summaries of your key metrics, perfect for executive briefings on the go.
                  </p>
                  <button onClick={onDemoLoad} className={`flex items-center gap-2 font-bold ${isLight ? 'text-purple-600 hover:text-purple-700' : 'text-purple-400 hover:text-purple-300'}`}>
                     Try it yourself <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
               <div className="relative">
                   <div className={`absolute inset-0 bg-purple-500/20 blur-3xl rounded-full`}></div>
                   <AINarratorPreview isLight={isLight} />
               </div>
           </div>
        </section>

        {/* 6. SMART QUERY BAR */}
        <section className="section-container px-6 safe-zone">
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Just ask your data</h2>
                <p className={subTextColor}>Natural language querying powered by Gemini 2.5.</p>
            </div>
            <SmartQueryDemo isLight={isLight} />
        </section>

        {/* 9. LIVE DASHBOARD DEMO (Static Mockup for Performance) */}
        <section className="section-container px-6 safe-zone">
            <div className="max-w-6xl mx-auto">
                <div className={`rounded-2xl overflow-hidden border shadow-2xl ${borderColor} ${isLight ? 'bg-white' : 'bg-[#0f172a]'}`}>
                    {/* Mock Browser Header */}
                    <div className={`h-10 border-b flex items-center px-4 gap-2 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        </div>
                        <div className={`ml-4 px-3 py-1 rounded text-xs flex-1 text-center font-mono opacity-50 ${isLight ? 'bg-white' : 'bg-black/20'}`}>insightx.ai/dashboard/demo</div>
                    </div>
                    {/* Dashboard Mockup Content */}
                    <div className="p-6 md:p-8 grid gap-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold font-display">Q4 Performance</h3>
                                <p className={`text-sm ${subTextColor}`}>Last updated: Just now</p>
                            </div>
                            <div className="flex gap-2">
                                <div className={`h-8 w-24 rounded-lg animate-pulse ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}></div>
                                <div className={`h-8 w-8 rounded-lg animate-pulse ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}></div>
                            </div>
                        </div>
                        {/* KPI Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className={`h-24 rounded-xl border p-4 ${cardBg}`}>
                                    <div className={`h-4 w-20 mb-2 rounded ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}></div>
                                    <div className={`h-8 w-32 rounded ${isLight ? 'bg-gray-200' : 'bg-white/20'}`}></div>
                                </div>
                            ))}
                        </div>
                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
                             <div className={`md:col-span-2 rounded-xl border ${cardBg} p-4 relative overflow-hidden group`}>
                                 <div className="absolute inset-x-0 bottom-0 top-12 flex items-end justify-between px-4 pb-4 gap-2 opacity-50">
                                     {[40, 60, 45, 70, 65, 80, 50, 75, 90, 85].map((h, idx) => (
                                         <div key={idx} style={{height: `${h}%`}} className={`flex-1 rounded-t-sm transition-all duration-1000 group-hover:bg-cyan-500 ${isLight ? 'bg-blue-200' : 'bg-blue-500/30'}`}></div>
                                     ))}
                                 </div>
                                 <div className="absolute top-4 left-4 font-bold text-sm">Revenue Trend</div>
                             </div>
                             <div className={`rounded-xl border ${cardBg} p-4 relative`}>
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className={`w-32 h-32 rounded-full border-[12px] border-t-cyan-500 border-r-purple-500 border-b-blue-500 border-l-transparent rotate-45 ${isLight ? 'border-gray-100' : 'border-white/5'}`}></div>
                                 </div>
                                 <div className="absolute top-4 left-4 font-bold text-sm">Distribution</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. USE CASE GRID */}
        <section className="section-container px-6 safe-zone">
           <div className="max-w-7xl mx-auto">
               <div className="text-center mb-12">
                   <h2 className="text-3xl font-display font-bold mb-4">Built for every industry</h2>
                   <p className={subTextColor}>Versatile templates that adapt to your data structure.</p>
               </div>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <UseCaseCard isLight={isLight} icon={<LayoutDashboard />} title="SaaS Analytics" desc="MRR, Churn, LTV, and cohort analysis out of the box." />
                   <UseCaseCard isLight={isLight} icon={<ShoppingBag />} title="Ecommerce" desc="Sales velocity, inventory forecasting, and basket analysis." />
                   <UseCaseCard isLight={isLight} icon={<Landmark />} title="Finance" desc="P&L visualization, expense tracking, and budget variance." />
                   <UseCaseCard isLight={isLight} icon={<Activity />} title="Healthcare" desc="Patient volume, treatment outcomes, and resource utilization." />
                   <UseCaseCard isLight={isLight} icon={<Truck />} title="Manufacturing" desc="Supply chain efficiency, defect rates, and production capacity." />
                   <UseCaseCard isLight={isLight} icon={<Megaphone />} title="Marketing" desc="Campaign ROI, conversion funnels, and attribution modeling." />
               </div>
           </div>
        </section>

        {/* 5. TEMPLATE GALLERY */}
        <section className={`section-container px-6 safe-zone ${isLight ? 'bg-blue-50/50' : 'bg-white/[0.02]'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-display font-bold mb-2">Starter Templates</h2>
                        <p className={subTextColor}>Jumpstart your analysis with pre-configured views.</p>
                    </div>
                    <button className={`hidden md:flex items-center gap-2 text-sm font-bold ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                    {['Sales Overview', 'Marketing Funnel', 'Product Usage', 'Customer Support'].map((t, i) => (
                        <div key={i} className={`snap-center shrink-0 w-72 h-48 rounded-2xl border p-4 flex flex-col justify-between transition-all hover:-translate-y-1 cursor-pointer group ${cardBg}`}>
                            <div className={`h-24 rounded-lg w-full mb-4 relative overflow-hidden ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                                <div className={`absolute inset-x-2 bottom-0 h-16 rounded-t-lg opacity-50 group-hover:scale-105 transition-transform ${isLight ? 'bg-white shadow-sm' : 'bg-white/10'}`}></div>
                            </div>
                            <div>
                                <h4 className="font-bold">{t}</h4>
                                <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                                    <BarChart3 className="w-3 h-3" /> 5 Charts
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 8. SECURITY SECTION */}
        <section className="section-container px-6 safe-zone">
            <div className={`max-w-5xl mx-auto rounded-3xl p-8 md:p-12 border ${isLight ? 'bg-gray-900 text-white border-gray-800' : 'bg-white/5 border-white/10'}`}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Shield className="w-3 h-3" /> Enterprise Grade
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Your data stays yours.</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            We use state-of-the-art encryption and strictly adhere to privacy standards. Your dataset is never used to train our public models.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                             <div className="flex gap-3">
                                 <Lock className="w-5 h-5 text-gray-400" />
                                 <span className="font-medium text-sm">SOC2 Compliant</span>
                             </div>
                             <div className="flex gap-3">
                                 <Server className="w-5 h-5 text-gray-400" />
                                 <span className="font-medium text-sm">Local Processing</span>
                             </div>
                             <div className="flex gap-3">
                                 <Globe className="w-5 h-5 text-gray-400" />
                                 <span className="font-medium text-sm">EU Hosted Options</span>
                             </div>
                             <div className="flex gap-3">
                                 <CheckCircle className="w-5 h-5 text-gray-400" />
                                 <span className="font-medium text-sm">Zero-Retention</span>
                             </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-cyan-500/20 blur-3xl rounded-full"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                            <Shield className="w-16 h-16 text-green-400 mb-4" />
                            <div className="text-2xl font-bold font-mono text-white mb-1">100% Encrypted</div>
                            <div className="text-sm text-gray-400">End-to-end data protection</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 7. TESTIMONIALS (Premium Upgrade) */}
        <section className="section-container px-6 safe-zone">
             <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-display font-bold text-center mb-16">Loved by data teams</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <TestimonialCard 
                        quote="InsightX cut our reporting time by 90%. It's like having a data scientist in your pocket."
                        author="Sarah Lin"
                        role="VP of Sales, TechFlow"
                        isLight={isLight}
                    />
                    <TestimonialCard 
                        quote="The forecasting accuracy is scary good. We predicted our Q4 spike two weeks in advance."
                        author="Michael Ross"
                        role="Ops Lead, GearUp"
                        isLight={isLight}
                    />
                    <TestimonialCard 
                        quote="Finally, a BI tool that doesn't require SQL. My entire marketing team uses it daily."
                        author="Jessica Tan"
                        role="CMO, BrightPath"
                        isLight={isLight}
                    />
                </div>
             </div>
        </section>

        {/* 10. PRICING SNAPSHOT */}
        <section id="pricing" className={`section-container border-y ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/[0.02] border-white/5'} safe-zone`}>
          <div className="max-w-7xl mx-auto px-6 layout-safe-stack gap-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center">Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
              <PricingCard isLight={isLight} plan="Free" price="$0" features={["1 Dataset / mo", "Basic Charts", "720p Export"]} />
              <PricingCard isLight={isLight} plan="Pro" price="$29" active features={["Unlimited Datasets", "AI Insights", "Forecasting", "4K Export"]} />
              <PricingCard isLight={isLight} plan="Enterprise" price="Custom" features={["SSO", "Dedicated Support", "Custom API", "SLA"]} />
            </div>
          </div>
        </section>

        <NewsletterCTA isLight={isLight} />

      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

// ---------------- SUB-COMPONENTS ----------------

const BeforeAfterSlider = ({ theme }: { theme: Theme }) => {
    const [position, setPosition] = useState(50);
    const isLight = theme === Theme.MINIMAL_LIGHT;
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setPosition((x / rect.width) * 100);
    };

    return (
        <div 
            ref={containerRef}
            className={`relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden border cursor-ew-resize select-none ${isLight ? 'border-gray-200 shadow-xl' : 'border-white/10 shadow-2xl'}`}
            onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
            onTouchMove={handleMove}
            onClick={handleMove}
        >
            {/* After Image (Full Width) */}
            <div className={`absolute inset-0 flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#0f172a]'}`}>
                {/* Mock Dashboard */}
                <div className="w-full h-full p-4 md:p-8 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                        <div className={`h-32 rounded-lg ${isLight ? 'bg-blue-50' : 'bg-blue-500/10'}`}></div>
                        <div className={`h-full rounded-lg ${isLight ? 'bg-purple-50' : 'bg-purple-500/10'}`}></div>
                    </div>
                    <div className="space-y-4">
                        <div className={`h-20 rounded-lg ${isLight ? 'bg-gray-50' : 'bg-white/5'}`}></div>
                        <div className={`h-20 rounded-lg ${isLight ? 'bg-gray-50' : 'bg-white/5'}`}></div>
                        <div className={`h-full rounded-lg ${isLight ? 'bg-cyan-50' : 'bg-cyan-500/10'}`}></div>
                    </div>
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${isLight ? 'bg-white shadow text-blue-600' : 'bg-black/50 text-white'}`}>InsightX Dashboard</div>
            </div>

            {/* Before Image (Clipped) */}
            <div 
                className={`absolute inset-0 border-r-2 border-white flex items-start justify-start overflow-hidden ${isLight ? 'bg-gray-100' : 'bg-[#1e293b]'}`}
                style={{ width: `${position}%` }}
            >
                {/* Mock CSV Table */}
                <div className="w-[900px] p-8 font-mono text-xs opacity-60 space-y-2">
                    <div className="grid grid-cols-5 gap-4 font-bold border-b pb-2">
                        <span>id</span><span>date</span><span>region</span><span>product</span><span>amount</span>
                    </div>
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="grid grid-cols-5 gap-4">
                            <span>{1001 + i}</span>
                            <span>2023-10-{10+i}</span>
                            <span>{['North', 'South', 'East', 'West'][i%4]}</span>
                            <span>Item_{String.fromCharCode(65 + i)}</span>
                            <span>${(Math.random()*1000).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white">Raw CSV</div>
            </div>

            {/* Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                style={{ left: `${position}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                    <div className="flex gap-0.5">
                        <ChevronLeft className="w-3 h-3" />
                        <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AINarratorPreview = ({ isLight }: { isLight: boolean }) => {
    const [playing, setPlaying] = useState(false);
    
    return (
        <div className={`rounded-2xl border p-6 relative overflow-hidden ${isLight ? 'bg-white/80 border-gray-200 shadow-xl' : 'bg-black/40 border-white/10 backdrop-blur-md shadow-2xl'}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'}`}>
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-sm">AI Summary</div>
                        <div className="text-xs opacity-50">Q3 Sales Report.mp3</div>
                    </div>
                </div>
                <button 
                    onClick={() => setPlaying(!playing)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${playing ? 'bg-red-500 text-white' : (isLight ? 'bg-gray-900 text-white' : 'bg-white text-black')}`}
                >
                    {playing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
            </div>
            
            {/* Waveform */}
            <div className="flex items-center justify-center gap-1 h-12 mb-6">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1 rounded-full transition-all duration-300 ${isLight ? 'bg-purple-400' : 'bg-purple-500'}`}
                        style={{ 
                            height: playing ? `${Math.random() * 100}%` : '20%',
                            opacity: playing ? 1 : 0.3 
                        }}
                    ></div>
                ))}
            </div>

            <div className={`text-sm leading-relaxed p-4 rounded-xl font-medium ${isLight ? 'bg-purple-50 text-purple-900' : 'bg-purple-500/10 text-purple-200'}`}>
                "Revenue is up 12% month-over-month, primarily driven by the Enterprise segment in North America. However, customer churn has slightly increased..."
            </div>
        </div>
    );
};

const SmartQueryDemo = ({ isLight }: { isLight: boolean }) => {
    return (
        <div className="max-w-2xl mx-auto">
             <div className={`relative rounded-xl border shadow-lg overflow-hidden mb-4 ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                 <div className="flex items-center px-4 py-4">
                     <Search className={`w-5 h-5 mr-3 ${isLight ? 'text-gray-400' : 'text-gray-500'}`} />
                     <div className={`flex-1 font-medium ${isLight ? 'text-gray-800' : 'text-white'}`}>
                         <span className="animate-typing overflow-hidden whitespace-nowrap border-r-2 border-cyan-500 pr-1">
                             Which region had the highest growth?
                         </span>
                     </div>
                     <div className={`px-2 py-1 rounded text-xs font-bold ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-gray-400'}`}>Cmd+K</div>
                 </div>
                 {/* Progress Bar */}
                 <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
                     <div className="h-full bg-cyan-500 w-2/3 animate-progress"></div>
                 </div>
             </div>

             {/* Result Card */}
             <div className={`rounded-xl border p-4 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-700 delay-500 ${isLight ? 'bg-white border-gray-200' : 'bg-[#0f172a] border-white/10'}`}>
                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isLight ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'}`}>
                     <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                     <div className="font-bold text-lg">North America (+24%)</div>
                     <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                         Driven by the new Enterprise plan launch on Oct 12th.
                     </p>
                 </div>
             </div>
        </div>
    );
};

const UseCaseCard = ({ icon, title, desc, isLight }: { icon: React.ReactElement, title: string, desc: string, isLight: boolean }) => (
    <div className={`p-6 rounded-2xl border transition-all hover:border-cyan-500/50 hover:shadow-lg group ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/5'}`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${isLight ? 'bg-gray-100 group-hover:bg-blue-50 text-gray-700 group-hover:text-blue-600' : 'bg-white/10 group-hover:bg-cyan-500/20 text-white group-hover:text-cyan-400'}`}>
            {React.cloneElement(icon, { className: "w-5 h-5" } as React.Attributes & { className?: string })}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
    </div>
);

const TestimonialCard = ({ quote, author, role, isLight }: { quote: string, author: string, role: string, isLight: boolean }) => (
    <div className={`p-8 rounded-3xl border flex flex-col ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/5'}`}>
        <div className="mb-6">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 inline-block mr-0.5 fill-current" />)}
        </div>
        <p className={`text-lg font-medium leading-relaxed mb-6 flex-1 ${isLight ? 'text-gray-800' : 'text-gray-200'}`}>"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-white/10 text-white'}`}>
                {author.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-sm">{author}</div>
                <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>{role}</div>
            </div>
        </div>
    </div>
);

const PricingCard = ({ plan, price, features, active, isLight }: { plan: string, price: string, features: string[], active?: boolean, isLight: boolean }) => (
  <div className={`p-8 rounded-3xl border flex flex-col relative transition-all duration-300 hover:scale-105 h-full ${active ? (isLight ? 'bg-white border-blue-500 shadow-2xl shadow-blue-200 z-10' : 'bg-gradient-to-b from-gray-800 to-gray-900 border-cyan-500/50 shadow-2xl shadow-cyan-900/20 z-10') : (isLight ? 'bg-gray-50 border-gray-200 hover:bg-white' : 'bg-gray-900/50 border-white/10 hover:bg-gray-800/80')}`}>
    {active && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
            Most Popular
        </div>
    )}
    <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>{plan}</h3>
    <div className={`text-4xl font-display font-bold mb-6 ${isLight ? 'text-gray-900' : 'text-white'}`}>{price}<span className="text-lg text-gray-500 font-sans font-normal">{price !== 'Custom' && '/mo'}</span></div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((f, i) => (
        <li key={i} className={`flex items-center gap-3 text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span> {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-xl font-bold transition ${active ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : (isLight ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-white/10 hover:bg-white/20 text-white')}`}>
      Choose {plan}
    </button>
  </div>
);

const NewsletterCTA = ({ isLight }: { isLight: boolean }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section className={`section-container px-6 relative overflow-hidden ${isLight ? 'bg-gray-100' : 'bg-[#020617]'} safe-zone`}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[100px] pointer-events-none ${isLight ? 'bg-purple-200/50' : 'bg-brand-purple/10'}`}></div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center layout-safe-stack items-center gap-8">
         <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-2 transition-colors ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10 group-hover:bg-white/10'}`}>
            <Mail className="w-7 h-7 text-cyan-400" />
         </div>
         
         <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Stay updated</h2>
            <p className={`max-w-lg mx-auto leading-relaxed text-lg ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Join 10,000+ data leaders receiving our weekly insights.
            </p>
         </div>

         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative w-full pt-4">
             <div className="relative flex-1">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(status==='error') setStatus('idle'); }}
                  placeholder="Enter your email" 
                  className={`w-full border rounded-xl px-5 py-4 outline-none transition-colors backdrop-blur-sm ${isLight ? 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 placeholder:text-gray-400' : `bg-white/5 text-white placeholder:text-gray-500 ${status === 'error' ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}`}
                />
             </div>
             <button 
               type="submit"
               disabled={status === 'loading' || status === 'success'}
               className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 min-w-[140px] shadow-lg ${status === 'success' ? 'bg-green-500 text-white shadow-green-500/20' : (isLight ? 'bg-gray-900 text-white hover:bg-black shadow-gray-300' : 'bg-white text-black hover:bg-cyan-50 hover:shadow-cyan-500/20')}`}
             >
               {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : status === 'success' ? <CheckCircle className="w-4 h-4" /> : 'Subscribe'}
             </button>
         </form>
      </div>
    </section>
  );
};

export default LandingPage;