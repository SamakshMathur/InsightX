
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';
import { Globe, Laptop, Heart, Zap, Coffee, BookOpen, ArrowRight, MapPin, Clock, Code, Smile } from 'lucide-react';

interface Props {
  theme: Theme;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onNewUpload: () => void;
  onToggleTheme: () => void;
}

const CareersPage: React.FC<Props> = ({ theme, onNavigate, onNewUpload, onToggleTheme }) => {
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const themeConfig = THEME_CONFIGS[theme];
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/5';

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${textColor} selection:bg-cyan-500/30 font-sans transition-colors duration-500`}>
      <Navbar theme={theme} onNavigate={onNavigate} onNewUpload={onNewUpload} onToggleTheme={onToggleTheme} />
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-24 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${isLight ? 'bg-purple-200/50' : 'bg-purple-600/10'}`}></div>
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${isLight ? 'bg-cyan-200/50' : 'bg-cyan-600/10'}`}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 animate-fade-in-up ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className={`text-xs font-medium uppercase tracking-wide ${isLight ? 'text-green-700' : 'text-green-100'}`}>We are hiring</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
            Build the future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">AI analytics with us.</span>
          </h1>
          
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed mb-10 ${subTextColor}`}>
            InsightX is on a mission to democratize data science. We're looking for dreamers, builders, and obsessive problem solvers.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })} className={`px-8 py-3 font-bold rounded-xl transition-colors ${isLight ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-black hover:bg-cyan-50'}`}>
               View Open Roles
             </button>
             <button className={`px-8 py-3 border font-bold rounded-xl transition-colors ${isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
               Read Manifesto
             </button>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-3xl font-display font-bold mb-6">Not just another <br/>SaaS company.</h2>
              <div className={`space-y-6 text-lg leading-relaxed ${subTextColor}`}>
                 <p>
                   At InsightX, we don't care about hours clocked or where you work from. We care about <strong className={textColor}>velocity</strong> and <strong className={textColor}>impact</strong>.
                 </p>
                 <p>
                   We are a team of data nerds, design obsessives, and engineering wizards. We believe that software should feel like magic, and that analyzing a million rows of data should be as easy as asking a question.
                 </p>
                 <p>
                   If you love difficult challenges, autonomy, and shipping code that thousands of people use every day, you'll fit right in.
                 </p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                 <CultureCard isLight={isLight} icon={<Zap className="text-yellow-400"/>} title="Fast Paced" />
                 <CultureCard isLight={isLight} icon={<Globe className="text-cyan-400"/>} title="Global Team" />
              </div>
              <div className="space-y-4">
                 <CultureCard isLight={isLight} icon={<Heart className="text-red-400"/>} title="User Obsessed" />
                 <CultureCard isLight={isLight} icon={<Smile className="text-purple-400"/>} title="Zero Ego" />
              </div>
           </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-24 px-6 ${isLight ? 'bg-gray-50' : 'bg-[#0B0F19]'}`}>
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-display font-bold mb-4">Perks & Benefits</h2>
               <p className={subTextColor}>We take care of you so you can do your best work.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <BenefitCard isLight={isLight} icon={<Laptop />} title="Premium Equipment" desc="Latest MacBook Pro, 4K monitor, and whatever else you need." />
               <BenefitCard isLight={isLight} icon={<Globe />} title="Remote-First" desc="Work from anywhere. We have team members in 12 countries." />
               <BenefitCard isLight={isLight} icon={<Clock />} title="Flexible Hours" desc="You manage your schedule. Just deliver great work." />
               <BenefitCard isLight={isLight} icon={<BookOpen />} title="Learning Budget" desc="$2,000/yr stipend for courses, books, and conferences." />
               <BenefitCard isLight={isLight} icon={<Heart />} title="Health & Wellness" desc="Comprehensive insurance and monthly gym/wellness stipend." />
               <BenefitCard isLight={isLight} icon={<Coffee />} title="Offsites" desc="Quarterly team retreats in amazing locations worldwide." />
            </div>
         </div>
      </section>

      {/* Life at InsightX (Gallery) */}
      <section className="py-24 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Life at InsightX</h2>
              <p className={subTextColor}>Sneak peek into our world.</p>
            </div>
         </div>
         <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            <div className="snap-center shrink-0 w-[300px] h-[400px] rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-900 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               <div className="absolute bottom-4 left-4 font-bold text-white">Lisbon Retreat '24</div>
            </div>
            <div className="snap-center shrink-0 w-[400px] h-[400px] rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               <div className="absolute bottom-4 left-4 font-bold text-white">Hackathon Winners</div>
            </div>
            <div className="snap-center shrink-0 w-[300px] h-[400px] rounded-2xl bg-gradient-to-bl from-pink-500 to-rose-600 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               <div className="absolute bottom-4 left-4 font-bold text-white">Design Sprint</div>
            </div>
            <div className="snap-center shrink-0 w-[300px] h-[400px] rounded-2xl bg-gradient-to-tl from-yellow-500 to-orange-600 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               <div className="absolute bottom-4 left-4 font-bold text-white">Launch Day</div>
            </div>
         </div>
      </section>

      {/* Open Roles */}
      <section id="roles" className="py-24 px-6 max-w-5xl mx-auto">
         <h2 className="text-3xl font-display font-bold mb-12">Open Positions</h2>
         <div className="space-y-4">
            <JobCard isLight={isLight} title="Senior Frontend Engineer" team="Engineering" location="Remote (US/EU)" type="Full-time" />
            <JobCard isLight={isLight} title="Backend Engineer (Python/Go)" team="Engineering" location="Remote" type="Full-time" />
            <JobCard isLight={isLight} title="AI Research Scientist" team="AI Lab" location="San Francisco / Remote" type="Full-time" />
            <JobCard isLight={isLight} title="Senior Product Designer" team="Design" location="Remote (EU)" type="Full-time" />
            <JobCard isLight={isLight} title="Content Marketing Lead" team="Marketing" location="New York / Remote" type="Full-time" />
         </div>
         <div className={`mt-12 p-8 rounded-2xl border text-center ${cardBg}`}>
            <h3 className="text-xl font-bold mb-2">Don't see your role?</h3>
            <p className={`${subTextColor} mb-6`}>We're always looking for talented people. Send us your portfolio.</p>
            <button className="text-cyan-400 font-bold hover:text-cyan-300">Email Us &rarr;</button>
         </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const CultureCard = ({ icon, title, isLight }: { icon: React.ReactNode, title: string, isLight: boolean }) => (
  <div className={`p-6 rounded-2xl border backdrop-blur-sm flex items-center gap-4 transition-colors ${isLight ? 'bg-white/80 border-gray-200 hover:bg-white' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
     <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>{icon}</div>
     <span className="font-bold text-lg">{title}</span>
  </div>
);

const BenefitCard = ({ icon, title, desc, isLight }: { icon: React.ReactNode, title: string, desc: string, isLight: boolean }) => (
  <div className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isLight ? 'bg-white border-gray-200 hover:border-blue-300' : 'bg-[#0f172a] border-white/5 hover:border-cyan-500/30'}`}>
     <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isLight ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>{icon}</div>
     <h3 className="font-bold text-lg mb-2">{title}</h3>
     <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
  </div>
);

const JobCard = ({ title, team, location, type, isLight }: { title: string, team: string, location: string, type: string, isLight: boolean }) => (
  <div className={`p-6 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer ${isLight ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
     <div>
        <h3 className={`text-lg font-bold transition-colors ${isLight ? 'text-gray-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-400'}`}>{title}</h3>
        <div className={`flex flex-wrap gap-4 text-sm mt-2 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
           <span className="flex items-center gap-1"><Code className="w-3 h-3" /> {team}</span>
           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {type}</span>
        </div>
     </div>
     <div className={`flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 ${isLight ? 'text-blue-600' : 'text-white'}`}>
        Apply Now <ArrowRight className="w-4 h-4" />
     </div>
  </div>
);

export default CareersPage;
