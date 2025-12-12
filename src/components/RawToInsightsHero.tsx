
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Theme } from '../types';
import { ArrowRight, Play, Upload, Activity, TrendingUp, Volume2, VolumeX, ChevronRight, Sparkles } from 'lucide-react';
import { checkCollisionAndFix } from '../utils/layoutEngine';
import '../styles/RawToInsightsHero.css';

declare global {
  interface Window {
    gsap: any;
  }
}

interface Props {
  data?: any[];
  theme: Theme;
  onDemoLoad?: () => void;
  onUploadClick?: () => void;
}

const RawToInsightsHero: React.FC<Props> = ({ data, theme, onDemoLoad, onUploadClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgSvgRef = useRef<SVGSVGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-500' : 'text-gray-400';
  
  // New Huwise-style background: soft, low-noise, premium
  const heroBgClass = isLight 
    ? 'bg-gradient-to-b from-white via-blue-50/30 to-white' 
    : 'bg-gradient-to-b from-[#0f172a] via-[#1e293b]/50 to-[#0f172a]';

  // Run collision check on mount and resize
  useEffect(() => {
    const runCheck = () => checkCollisionAndFix('.hero-wrapper');
    window.addEventListener('resize', runCheck);
    setTimeout(runCheck, 100);
    return () => window.removeEventListener('resize', runCheck);
  }, []);

  // Reduced Motion & Intersection Observer for Video
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    if (videoRef.current) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !mediaQuery.matches) {
                videoRef.current?.play().catch(() => {});
            } else {
                videoRef.current?.pause();
            }
        }, { threshold: 0.5 });
        observer.observe(videoRef.current);
        return () => observer.disconnect();
    }
  }, []);

  // Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (reducedMotion) return;
        setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 15,
            y: (e.clientY / window.innerHeight - 0.5) * 15
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // Subtle Background Particles
  const bgParticles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 1000,
      y: Math.random() * 800,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.2 + 0.05 // Lower opacity for subtlety
    }));
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!window.gsap) return;
    const gsap = window.gsap;

    if (bgSvgRef.current) {
        gsap.to(bgSvgRef.current.querySelectorAll('.bg-particle'), {
            y: "+=15",
            duration: "random(4, 8)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextState = !isMuted;
      videoRef.current.muted = nextState;
      setIsMuted(nextState);
    }
  };

  return (
    <section 
      ref={containerRef} 
      className={`hero-wrapper relative min-h-[90vh] flex items-center pt-32 pb-24 px-6 overflow-hidden ${heroBgClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Layer (Z-0) */}
      <div className="absolute inset-0 pointer-events-none hero-particle" style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}>
         <svg ref={bgSvgRef} viewBox="0 0 1000 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {bgParticles.map(p => (
              <circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill={isLight ? '#60A5FA' : '#fff'} opacity={p.opacity} className="bg-particle" />
            ))}
         </svg>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto w-full relative z-10 hero-content-layer">
         
         <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="layout-safe-stack items-center text-center lg:items-start lg:text-left gap-8">
               
               <div className="space-y-6 max-w-2xl">
                  <h1 className={`text-[clamp(2.5rem,5vw,4.5rem)] font-display font-bold tracking-tight leading-[1.1] ${textColor}`}>
                    Data Visualization <br/>
                    Made Easy.
                  </h1>
                  <p className={`text-lg md:text-xl ${subTextColor} leading-relaxed max-w-lg mx-auto lg:mx-0`}>
                    Turn complex datasets into clear, structured insights instantly. No code required.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
                  <button 
                      onClick={onDemoLoad}
                      className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-white text-black hover:bg-cyan-50 shadow-cyan-500/20'}`}
                  >
                      Explore Live Demo <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                      onClick={onUploadClick}
                      className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all hover:scale-105 ${isLight ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-white/20 text-white hover:bg-white/10'}`}
                  >
                      <Upload className="w-4 h-4" /> Upload Your Data
                  </button>
               </div>
               
               {/* Trust/Social Proof */}
               <div className={`flex items-center gap-4 text-xs font-medium ${subTextColor} mt-4`}>
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 ${isLight ? 'border-white bg-gray-100' : 'border-[#0f172a] bg-white/10'}`}></div>
                     ))}
                  </div>
                  <div>Used by 10,000+ analysts</div>
               </div>

            </div>

            {/* Right Column: Huwise-Style Video Module */}
            <div className="relative w-full flex justify-center lg:justify-end">
               
               {/* Gradient Border Wrapper */}
               <div className={`relative w-full max-w-[580px] p-[1px] rounded-[24px] shadow-2xl transition-all duration-500 ${
                  isLight 
                    ? 'bg-gradient-to-br from-blue-100 via-white to-blue-100 shadow-blue-900/5' 
                    : 'bg-gradient-to-br from-cyan-500/20 via-white/5 to-purple-500/20 shadow-black/40'
               }`}>
                  {/* Inner Glass Card */}
                  <div className={`relative h-full w-full rounded-[23px] p-6 backdrop-blur-2xl ${
                     isLight 
                       ? 'bg-white/70' 
                       : 'bg-[#0f172a]/60'
                  }`}>
                  
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 mb-3 tracking-wide">
                              <Sparkles className="w-3 h-3" /> AI-PROCESSED
                          </div>
                          <h3 className={`text-2xl font-display font-bold ${textColor}`}>From Data → Insights</h3>
                          <p className={`text-sm mt-1 ${subTextColor}`}>See how raw information becomes clarity.</p>
                       </div>
                       <div className={`p-2.5 rounded-xl ${isLight ? 'bg-blue-50 text-blue-500' : 'bg-white/5 text-cyan-400'}`}>
                          <Activity className="w-6 h-6" />
                       </div>
                    </div>

                    {/* Video Container */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black group">
                        <video 
                           ref={videoRef}
                           src="https://cdn.coverr.co/videos/coverr-analyzing-finance-charts-5378/1080p.mp4" 
                           loop 
                           muted={isMuted}
                           playsInline
                           className="w-full h-full object-cover transition-opacity duration-700"
                           onLoadedData={() => setIsVideoLoaded(true)}
                           style={{ opacity: isVideoLoaded ? 1 : 0 }}
                           aria-label="InsightX platform demo video"
                        />
                        
                        {!isVideoLoaded && (
                           <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>
                        )}

                        {/* KPI Overlay */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg z-20">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                           <span className="text-xs font-bold text-white tracking-wide">+24.5% Growth</span>
                           <TrendingUp className="w-3 h-3 text-green-400" />
                        </div>

                        {/* Mute Toggle */}
                        <button 
                           onClick={toggleAudio}
                           className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 hover:scale-105 transition-all z-20"
                           title={isMuted ? "Unmute" : "Mute"}
                        >
                           {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="flex -space-x-1">
                             <div className="w-6 h-6 rounded-full bg-cyan-500 border-2 border-[#0f172a]"></div>
                             <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-[#0f172a]"></div>
                          </div>
                          <span className={`text-xs ${subTextColor}`}>Generating analysis...</span>
                       </div>
                       <button className={`text-xs font-bold flex items-center gap-1 transition-colors ${isLight ? 'text-blue-600 hover:text-blue-700' : 'text-cyan-400 hover:text-cyan-300'}`}>
                          View Full Report <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>

                 </div>
               </div>
            </div>

         </div>

      </div>

    </section>
  );
};

export default RawToInsightsHero;
