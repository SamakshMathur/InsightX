
import React from 'react';
import { Theme } from '../types';
import { 
  ShoppingBag, Landmark, Activity, Truck, Trophy, Rocket, GraduationCap,
  LayoutDashboard, BookOpen, Sparkles, TrendingUp, Target, Shield, Clock, 
  ArrowRight, Layout
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  theme: Theme;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SECTORS = [
  { icon: <ShoppingBag />, label: "E-commerce & Retail" },
  { icon: <Landmark />, label: "Finance & Banking" },
  { icon: <Activity />, label: "Healthcare & Pharma" },
  { icon: <Truck />, label: "Manufacturing & Supply" },
  { icon: <Trophy />, label: "Sports Analytics" },
  { icon: <Rocket />, label: "Startups & SaaS" },
  { icon: <GraduationCap />, label: "Education & EdTech" },
];

const NEEDS = [
  { icon: <LayoutDashboard />, label: "Instant Dashboards" },
  { icon: <BookOpen />, label: "AI Data Storytelling" },
  { icon: <Sparkles />, label: "Automated Cleaning" },
  { icon: <TrendingUp />, label: "Predictive Insights" },
  { icon: <Target />, label: "KPI Tracking" },
  { icon: <Shield />, label: "Compliance & Governance" },
  { icon: <Clock />, label: "Real-time Monitoring" },
];

const MegaDropdown: React.FC<Props> = ({ isOpen, theme, onMouseEnter, onMouseLeave }) => {
  const isLight = theme === Theme.MINIMAL_LIGHT;
  
  // Visual Styles
  const cardBase = isLight 
    ? 'bg-white border-gray-200 text-gray-900 shadow-xl shadow-blue-900/5' 
    : 'bg-[#0f172a] border-white/10 text-white shadow-2xl shadow-black/50';

  const hoverClass = isLight 
    ? 'hover:bg-blue-50 text-gray-600 hover:text-blue-700' 
    : 'hover:bg-white/5 text-gray-300 hover:text-cyan-400';
    
  const iconBg = isLight ? 'bg-white shadow-sm' : 'bg-white/5';
  const dividerClass = isLight ? 'border-gray-100' : 'border-white/5';

  if (!isOpen) return null;

  return (
    <div 
      className={`relative mx-auto rounded-2xl border backdrop-blur-3xl overflow-hidden animate-fade-in ${cardBase}`}
      style={{ width: '85vw', maxWidth: '1200px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="menu"
      aria-orientation="horizontal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px]">
        
        {/* Column 1: Sectors */}
        <div className={`p-8 lg:border-r ${dividerClass}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2 opacity-50`}>
            Explore by Sector
          </h3>
          <div className="space-y-1">
            {SECTORS.map((item, idx) => (
              <a 
                key={idx} 
                href="#" 
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all group ${hoverClass}`}
                role="menuitem"
              >
                <div className={`p-1.5 rounded-md transition-colors ${iconBg} ${isLight ? 'group-hover:bg-blue-100' : 'group-hover:bg-cyan-500/20'}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Needs */}
        <div className={`p-8 lg:border-r ${dividerClass}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2 opacity-50`}>
            Explore by Need
          </h3>
          <div className="space-y-1">
            {NEEDS.map((item, idx) => (
              <a 
                key={idx} 
                href="#" 
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all group ${hoverClass}`}
                role="menuitem"
              >
                <div className={`p-1.5 rounded-md transition-colors ${iconBg} ${isLight ? 'group-hover:bg-purple-100' : 'group-hover:bg-purple-500/20'}`}>
                   {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Column 3: Feature Card (Spans 2 cols) */}
        <div className={`lg:col-span-2 p-2 ${isLight ? 'bg-gray-50' : 'bg-white/[0.02]'}`}>
           <div className={`h-full rounded-xl overflow-hidden relative group cursor-pointer flex flex-col border ${isLight ? 'bg-white border-gray-200' : 'bg-[#0f172a] border-white/5'}`}>
              
              {/* Feature Image Area */}
              <div className="relative h-48 w-full overflow-hidden">
                 <img 
                   src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3" 
                   alt="Data Analytics Dashboard" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white/10 to-transparent' : 'from-[#0f172a]/20 to-transparent'}`}></div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                 <div className="mb-4">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-cyan-500/20 text-cyan-400'}`}>
                     Featured
                   </span>
                 </div>
                 <h4 className={`font-display font-bold text-2xl mb-3 leading-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                   Turn messy data into<br/>clean insights instantly.
                 </h4>
                 <p className={`text-sm mb-8 leading-relaxed max-w-md ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                   Zero setup required. Just drag & drop your CSV or JSON files and let our AI build the dashboard for you.
                 </p>
                 <div className="mt-auto">
                    <button className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isLight ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-black hover:bg-cyan-50'}`}>
                        See Real Examples <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MegaDropdown;
