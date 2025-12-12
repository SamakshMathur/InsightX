import React from 'react';
import { Twitter, Github, Linkedin, Zap } from 'lucide-react';

interface Props {
  onNavigate?: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  
  const handleNav = (e: React.MouseEvent, page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => {
    e.preventDefault();
    if (onNavigate) {
        onNavigate(page);
        window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="relative bg-[#000205] pt-24 pb-12 border-t border-white/5 overflow-hidden">
        {/* Soft neon glow top effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Top Row: Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
                <div>
                    <h4 className="font-bold text-white mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" onClick={(e) => handleNav(e, 'landing')} className="hover:text-cyan-400 transition-colors">Features</a></li>
                        <li><a href="#" onClick={(e) => handleNav(e, 'landing')} className="hover:text-cyan-400 transition-colors">Live Demo</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">AI Insights</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Smart Filters</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">PowerBI Integration</a></li>
                        <li><a href="#" onClick={(e) => handleNav(e, 'landing')} className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" onClick={(e) => handleNav(e, 'about')} className="hover:text-cyan-400 transition-colors">About Us</a></li>
                        <li><a href="#" onClick={(e) => handleNav(e, 'careers')} className="hover:text-cyan-400 transition-colors">Careers</a></li>
                        <li><a href="#" onClick={(e) => handleNav(e, 'blog')} className="hover:text-cyan-400 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Resources</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" onClick={(e) => handleNav(e, 'docs')} className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Changelog</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Roadmap</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Community (Discord)</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Data Security</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Compliance</a></li>
                    </ul>
                </div>
            </div>

            {/* Middle Row: Newsletter */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-8 mb-16 backdrop-blur-sm relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-xl font-display font-bold text-white mb-2">Stay ahead of the curve</h3>
                        <p className="text-gray-400 text-sm">Get product updates, new features, and analytics insights.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                         <input type="email" placeholder="Enter your email" className="bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 transition-colors w-full md:w-72" />
                         <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm px-6 py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] whitespace-nowrap">
                            Subscribe
                         </button>
                    </div>
                 </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleNav(e, 'landing')}>
                    <div className="w-6 h-6 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white fill-current" />
                    </div>
                    <span className="font-display font-bold text-lg text-white">InsightX</span>
                </div>
                
                <p className="text-gray-600 text-sm">© 2025 InsightX Analytics. All rights reserved.</p>

                <div className="flex gap-4">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;