
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';
import { Zap, Target, Clock, Users, Shield, Lightbulb, ArrowRight, Heart, Rocket } from 'lucide-react';

interface Props {
  theme: Theme;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onNewUpload: () => void;
  onToggleTheme: () => void;
}

const AboutPage: React.FC<Props> = ({ theme, onNavigate, onNewUpload, onToggleTheme }) => {
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const themeConfig = THEME_CONFIGS[theme];
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10';

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${textColor} selection:bg-cyan-500/30 font-sans transition-colors duration-500`}>
      <Navbar theme={theme} onNavigate={onNavigate} onNewUpload={onNewUpload} onToggleTheme={onToggleTheme} />
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 px-6 overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors ${isLight ? 'bg-blue-100' : 'bg-brand-blue/10'}`}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 backdrop-blur-md ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className={`text-xs font-medium uppercase tracking-wide ${isLight ? 'text-cyan-700' : 'text-cyan-100'}`}>Our Mission</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
            We’re building the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">future of analytics.</span>
          </h1>
          
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${subTextColor}`}>
            InsightX helps businesses turn raw data into instant decisions. We believe that intelligence shouldn't require a data science degree.
          </p>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold">Data is messy.<br/>Insights shouldn't be.</h2>
            <p className={`${subTextColor} leading-relaxed`}>
              We started InsightX with a simple observation: companies are drowning in data but starving for insights. 
              Traditional BI tools are clunky, expensive, and require weeks of setup.
            </p>
            <p className={`${subTextColor} leading-relaxed`}>
              We built an engine that understands your data automatically. No SQL, no formulas, no headaches. Just drop a file and get answers.
            </p>
          </div>
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full ${isLight ? 'from-blue-200/50 to-purple-200/50' : 'from-cyan-500/20 to-purple-500/20'}`}></div>
            <div className={`relative border rounded-2xl p-8 backdrop-blur-xl ${cardBg}`}>
               <div className="flex gap-4 mb-6">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? 'bg-cyan-100' : 'bg-cyan-500/20'}`}>
                    <Zap className={`w-6 h-6 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Instant Speed</h3>
                   <p className={`text-sm ${subTextColor}`}>From upload to dashboard in under 2 seconds.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? 'bg-purple-100' : 'bg-purple-500/20'}`}>
                    <Lightbulb className={`w-6 h-6 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Automated Intelligence</h3>
                   <p className={`text-sm ${subTextColor}`}>AI that explains the 'why' behind the numbers.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-32">
          <h2 className="text-3xl font-display font-bold text-center mb-16">Our Journey</h2>
          <div className="relative">
             {/* Line */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-600 opacity-30 hidden md:block"></div>
             
             <div className="space-y-12 relative">
                <TimelineItem 
                  year="2023" 
                  title="The Spark" 
                  desc="The idea for InsightX was born after watching a data analyst spend 3 days building a simple sales report."
                  align="left"
                  isLight={isLight}
                  subTextColor={subTextColor}
                />
                <TimelineItem 
                  year="2024" 
                  title="The MVP" 
                  desc="Launched our beta. The auto-schema detection engine processed its first 1 million rows of data."
                  align="right"
                  isLight={isLight}
                  subTextColor={subTextColor}
                />
                <TimelineItem 
                  year="2025" 
                  title="Growth & Scale" 
                  desc="Introduced AI Forecasting and Narrative Stories. Now serving 10,000+ teams worldwide."
                  align="left"
                  isLight={isLight}
                  subTextColor={subTextColor}
                />
                <TimelineItem 
                  year="Future" 
                  title="Beyond Dashboards" 
                  desc="Building the first autonomous data agent that manages your analytics while you sleep."
                  align="right"
                  isLight={isLight}
                  subTextColor={subTextColor}
                />
             </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-32">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-display font-bold mb-4">Core Values</h2>
             <p className={subTextColor}>The principles that guide every feature we build.</p>
           </div>
           <div className="grid md:grid-cols-4 gap-6">
              <ValueCard isLight={isLight} icon={<Target />} title="Clarity" desc="Eliminate ambiguity. Data should be obvious." />
              <ValueCard isLight={isLight} icon={<Rocket />} title="Speed" desc="Fast software is a feature. We optimize for milliseconds." />
              <ValueCard isLight={isLight} icon={<Users />} title="Trust" desc="Your data is yours. Security and privacy are non-negotiable." />
              <ValueCard isLight={isLight} icon={<Heart />} title="Passion" desc="We love data so you don't have to." />
           </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center mb-16">The Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <TeamMember name="Alex Chen" role="Founder & CEO" color="bg-blue-500" />
             <TeamMember name="Sarah Jenkins" role="Head of AI" color="bg-purple-500" />
             <TeamMember name="Marcus Thorne" role="Lead Product Design" color="bg-cyan-500" />
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className={`py-24 px-6 border-t ${isLight ? 'bg-gradient-to-b from-gray-50 to-blue-50/50 border-gray-200' : 'bg-gradient-to-b from-[#020617] to-indigo-950/20 border-white/5'}`}>
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to modernize your analytics?</h2>
            <p className={`text-xl mb-10 ${subTextColor}`}>Join thousands of data-driven teams using InsightX today.</p>
            <button 
              onClick={() => onNavigate('landing')}
              className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              Start for Free
            </button>
         </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const TimelineItem = ({ year, title, desc, align, isLight, subTextColor }: { year: string, title: string, desc: string, align: 'left' | 'right', isLight: boolean, subTextColor: string }) => (
  <div className={`md:flex justify-between items-center ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
    <div className="w-1/2 hidden md:block"></div>
    <div className={`relative z-10 w-12 h-12 rounded-full border-2 border-cyan-500 flex items-center justify-center text-xs font-bold shrink-0 mx-auto md:mx-0 my-4 md:my-0 shadow-[0_0_15px_rgba(34,211,238,0.4)] ${isLight ? 'bg-white text-gray-900' : 'bg-[#020617] text-white'}`}>
      {year}
    </div>
    <div className={`w-full md:w-1/2 p-6 ${align === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
      <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>{title}</h3>
      <p className={`${subTextColor} leading-relaxed`}>{desc}</p>
    </div>
  </div>
);

const ValueCard = ({ icon, title, desc, isLight }: { icon: React.ReactNode, title: string, desc: string, isLight: boolean }) => (
  <div className={`p-6 rounded-2xl border transition hover:-translate-y-1 ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
    <div className="mb-4 text-cyan-400">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
  </div>
);

const TeamMember = ({ name, role, color }: { name: string, role: string, color: string }) => (
  <div className="group relative">
    <div className="aspect-[4/5] bg-gray-900 rounded-2xl overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity`}></div>
      {/* Placeholder Avatar */}
      <div className={`w-full h-full ${color} opacity-20 group-hover:opacity-30 transition-opacity flex items-center justify-center`}>
         <Users className="w-20 h-20 opacity-20" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
         <h3 className="text-xl font-bold text-white">{name}</h3>
         <p className="text-cyan-400 text-sm font-medium">{role}</p>
      </div>
    </div>
  </div>
);

export default AboutPage;
