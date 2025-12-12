
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';
import { Search, ArrowRight, Calendar, Clock, Tag, ChevronRight, Zap } from 'lucide-react';

interface Props {
  theme: Theme;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onNewUpload: () => void;
  onToggleTheme: () => void;
}

const CATEGORIES = ["All", "Product Updates", "Analytics Tips", "AI Insights", "Company News"];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Introducing InsightX 2.0: The Future of AI Analytics",
    excerpt: "We've rebuilt our engine from the ground up to deliver faster insights, smarter forecasts, and seamless PowerBI integration.",
    category: "Product Updates",
    date: "Oct 12, 2023",
    readTime: "5 min read",
    image: "from-cyan-500 to-blue-600",
    featured: true
  },
  {
    id: 2,
    title: "How to Spot Anomalies in Your Sales Data",
    excerpt: "Learn how to use standard deviation and z-scores to identify outliers that could indicate fraud or viral trends.",
    category: "Analytics Tips",
    date: "Oct 08, 2023",
    readTime: "8 min read",
    image: "from-purple-500 to-pink-600",
    featured: false
  },
  {
    id: 3,
    title: "5 Ways Generative AI is Changing BI",
    excerpt: "From natural language querying to automated forecasting, explore how LLMs are democratizing data science.",
    category: "AI Insights",
    date: "Sep 28, 2023",
    readTime: "6 min read",
    image: "from-amber-400 to-orange-500",
    featured: false
  },
  {
    id: 4,
    title: "Understanding Confidence Intervals in Forecasting",
    excerpt: "What do those shaded areas on your charts actually mean? A guide for non-statisticians.",
    category: "Analytics Tips",
    date: "Sep 22, 2023",
    readTime: "4 min read",
    image: "from-green-400 to-emerald-600",
    featured: false
  },
  {
    id: 5,
    title: "New Integration: Connect PowerBI",
    excerpt: "You asked, we delivered. Now you can embed your existing PowerBI dashboards directly into InsightX.",
    category: "Product Updates",
    date: "Sep 15, 2023",
    readTime: "3 min read",
    image: "from-blue-600 to-indigo-700",
    featured: false
  },
  {
    id: 6,
    title: "Q3 Company Update: We're Growing!",
    excerpt: "Welcoming 5,000 new teams to the platform and a look ahead at our Q4 roadmap.",
    category: "Company News",
    date: "Sep 10, 2023",
    readTime: "4 min read",
    image: "from-gray-600 to-gray-800",
    featured: false
  }
];

const BlogPage: React.FC<Props> = ({ theme, onNavigate, onNewUpload, onToggleTheme }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const isLight = theme === Theme.MINIMAL_LIGHT;
  const themeConfig = THEME_CONFIGS[theme];
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/5';
  const inputBg = isLight ? 'bg-white border-gray-200' : 'bg-black/30 border-white/10';

  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const regularPosts = BLOG_POSTS.filter(p => !p.featured && (activeCategory === "All" || p.category === activeCategory));

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${textColor} selection:bg-cyan-500/30 font-sans transition-colors duration-500`}>
      <Navbar theme={theme} onNavigate={onNavigate} onNewUpload={onNewUpload} onToggleTheme={onToggleTheme} />
      
      {/* Hero / Featured Section */}
      <section className="pt-10 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Insights & <span className="text-cyan-400">Updates</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${subTextColor}`}>
            The latest news, tips, and tutorials from the InsightX team.
          </p>
        </div>

        {/* Featured Card */}
        {featuredPost && (
          <div className={`group relative rounded-3xl overflow-hidden border transition-all mb-20 ${isLight ? 'bg-white border-gray-200 shadow-sm hover:shadow-md' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
            <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isLight ? 'from-blue-50 to-purple-50' : 'from-cyan-500/10 to-purple-500/10'}`}></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`h-64 md:h-auto bg-gradient-to-br ${featuredPost.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-6 left-6">
                   <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/20">
                     {featuredPost.category}
                   </span>
                </div>
              </div>
              <div className="p-8 md:py-12 md:pr-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featuredPost.readTime}</span>
                </div>
                <h2 className={`text-3xl font-display font-bold mb-4 transition-colors ${isLight ? 'text-gray-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-400'}`}>
                  {featuredPost.title}
                </h2>
                <p className={`${subTextColor} text-lg leading-relaxed mb-8`}>
                  {featuredPost.excerpt}
                </p>
                <button className="flex items-center gap-2 text-cyan-400 font-bold hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-10">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                      : (isLight ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5')
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-8">
               {regularPosts.map(post => (
                 <div key={post.id} className={`group rounded-2xl border transition-all flex flex-col overflow-hidden hover:-translate-y-1 ${cardBg}`}>
                    <div className={`h-48 bg-gradient-to-br ${post.image} relative`}>
                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">{post.category}</span>
                          <span className="text-xs text-gray-500">{post.date}</span>
                       </div>
                       <h3 className={`text-xl font-bold mb-3 transition-colors ${isLight ? 'text-gray-900 group-hover:text-blue-600' : 'text-gray-100 group-hover:text-white'}`}>{post.title}</h3>
                       <p className={`text-sm mb-6 flex-1 leading-relaxed ${subTextColor}`}>
                         {post.excerpt}
                       </p>
                       <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-gray-100' : 'border-white/5'}`}>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                          <span className="text-sm font-medium text-cyan-400 group-hover:underline cursor-pointer">Read</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            
            {/* Search */}
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search articles..." 
                 className={`w-full border rounded-xl px-4 py-3 pl-10 text-sm outline-none transition-colors focus:border-cyan-500 ${inputBg} ${isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white'}`}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            </div>

            {/* Trending Topics */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-yellow-400" /> Trending Topics
               </h3>
               <div className="flex flex-wrap gap-2">
                 {["Data Visualization", "Forecasting", "SaaS Metrics", "Team Collaboration", "API Integration", "Dark Mode"].map(tag => (
                   <span key={tag} className={`px-3 py-1 rounded-lg text-xs cursor-pointer border ${isLight ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200' : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'}`}>
                     #{tag}
                   </span>
                 ))}
               </div>
            </div>

            {/* Popular Articles */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
               <h3 className="font-bold text-lg mb-6">Popular Reads</h3>
               <div className="space-y-6">
                  {[1, 3, 2].map((id, idx) => {
                    const p = BLOG_POSTS.find(post => post.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex gap-4 group cursor-pointer">
                         <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${p.image} shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                         <div>
                            <h4 className="font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">{p.title}</h4>
                            <span className="text-xs text-gray-500">{p.date}</span>
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>

          </div>

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className={`py-20 px-6 border-t ${isLight ? 'border-gray-200' : 'border-white/5'}`}>
         <div className={`max-w-4xl mx-auto rounded-3xl p-1 border ${isLight ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200' : 'bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 border-white/10'}`}>
           <div className={`backdrop-blur-xl rounded-[22px] p-8 md:p-12 text-center ${isLight ? 'bg-white/80' : 'bg-[#020617]/80'}`}>
              <h2 className="text-3xl font-display font-bold mb-4">Never miss an insight</h2>
              <p className={`${subTextColor} mb-8 max-w-lg mx-auto`}>
                Join 10,000+ data professionals receiving our weekly newsletter on analytics trends and product updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                 <input type="email" placeholder="Enter your work email" className={`flex-1 border rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors ${inputBg} ${isLight ? 'text-gray-900' : 'text-white'}`} />
                 <button className={`font-bold px-8 py-3 rounded-xl transition-colors ${isLight ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-black hover:bg-cyan-400'}`}>
                   Subscribe
                 </button>
              </div>
           </div>
         </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default BlogPage;
