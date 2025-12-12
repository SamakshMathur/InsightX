
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Theme } from '../types';
import { ArrowRight, Play, Upload, Activity, TrendingUp, Volume2, VolumeX, ChevronRight, Sparkles, FileSpreadsheet, Database } from 'lucide-react';
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
  
  // Animation State: 'raw' -> 'processing' -> 'insight'
  const [animationState, setAnimationState] = useState<'raw' | 'processing' | 'insight'>('raw');
  
  const isLight = theme === Theme.MINIMAL_LIGHT;
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-500' : 'text-gray-400';
  
  const heroBgClass = isLight 
    ? 'bg-gradient-to-b from-white via-blue-50/30 to-white' 
    : 'bg-gradient-to-b from-[#0f172a] via-[#1e293b]/50 to-[#0f172a]';

  // Animation Sequence Logic - Looping every 30s
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      // Step 1: Raw Data View (Start)
      setAnimationState('raw');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      // Step 2: Processing State (after 6s)
      timeouts.push(setTimeout(() => {
        setAnimationState('processing');
      }, 6000));

      // Step 3: Insight View (after 9s - allows 3s for processing)
      timeouts.push(setTimeout(() => {
        setAnimationState('insight');
        // Force video play when revealing
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                });
            }
        }
      }, 9000));

      // Step 4: Loop back (after 30s total duration)
      timeouts.push(setTimeout(() => {
        runSequence();
      }, 30000));
    };

    runSequence();
    
    return () => timeouts.forEach(clearTimeout);
  }, []);

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
            if (entries[0].isIntersecting && !mediaQuery.matches && animationState === 'insight') {
                videoRef.current?.play().catch(() => {});
            } else {
                videoRef.current?.pause();
            }
        }, { threshold: 0.5 });
        observer.observe(videoRef.current);
        return () => observer.disconnect();
    }
  }, [animationState]);

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
      opacity: Math.random() * 0.2 + 0.05 
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

  // Mock Data for "Raw" View - Messy Data Simulation
  const mockRawData = Array.from({length: 16}).map((_, i) => ({
      id: i % 4 === 0 ? '' : 1000 + i,
      date: i % 3 === 0 ? 'INVALID' : `2023-10-${10+i}`,
      region: ['North', 'NULL', 'East', 'West', '??'][i % 5],
      amount: i % 5 === 0 ? '#VALUE!' : (Math.random() * 10000).toFixed(2)
  }));

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
                    Turn messy, raw datasets into clear, structured insights instantly. No code required.
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
               
               <div className={`flex items-center gap-4 text-xs font-medium ${subTextColor} mt-4`}>
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 ${isLight ? 'border-white bg-gray-100' : 'border-[#0f172a] bg-white/10'}`}></div>
                     ))}
                  </div>
                  <div>Used by 10,000+ analysts</div>
               </div>

            </div>

            {/* Right Column: Visual Transformation Module */}
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
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold mb-3 tracking-wide transition-colors duration-500 ${
                              animationState === 'insight' 
                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                          }`}>
                              {animationState === 'insight' ? <Sparkles className="w-3 h-3" /> : <Database className="w-3 h-3" />}
                              {animationState === 'insight' ? 'AI-PROCESSED' : 'UNSTRUCTURED INPUT'}
                          </div>
                          <h3 className={`text-2xl font-display font-bold transition-all duration-500 ${textColor}`}>
                              {animationState === 'insight' ? 'From Data → Insights' : 'Raw File Upload'}
                          </h3>
                          <p className={`text-sm mt-1 ${subTextColor}`}>
                              {animationState === 'insight' ? 'See how raw information becomes clarity.' : 'Analyzing messy, complex datasets...'}
                          </p>
                       </div>
                       <div className={`p-2.5 rounded-xl transition-colors duration-500 ${
                           animationState === 'insight'
                             ? (isLight ? 'bg-blue-50 text-blue-500' : 'bg-white/5 text-cyan-400')
                             : 'bg-gray-500/10 text-gray-400'
                       }`}>
                          <Activity className="w-6 h-6" />
                       </div>
                    </div>

                    {/* Media Container */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-gray-900 group">
                        
                        {/* 0. Fallback Dashboard Background (Visible if video is loading or fails) */}
                        {/* Always visible underneath. Ensures screen never goes blank. */}
                        <div className="absolute inset-0 bg-slate-900 p-6 flex flex-col gap-4 opacity-50">
                             <div className="flex justify-between items-center mb-2">
                                <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse"></div>
                                <div className="flex gap-2">
                                    <div className="h-6 w-6 bg-slate-700/50 rounded-full"></div>
                                </div>
                             </div>
                             <div className="grid grid-cols-3 gap-4 flex-1">
                                <div className="col-span-2 bg-slate-800/50 rounded-lg border border-white/5 relative overflow-hidden flex items-end px-4 pb-2 gap-1">
                                    {[30,50,40,60,45,70,80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-cyan-500/10 rounded-t" style={{height: `${h}%`}}></div>
                                    ))}
                                </div>
                                <div className="col-span-1 grid grid-rows-2 gap-4">
                                    <div className="bg-slate-800/50 rounded-lg border border-white/5"></div>
                                    <div className="bg-slate-800/50 rounded-lg border border-white/5"></div>
                                </div>
                             </div>
                        </div>

                        {/* 1. The Insight Video (Background Layer) */}
                        <video 
                           ref={videoRef}
                           src="https://cdn.coverr.co/videos/coverr-analyzing-finance-charts-5378/1080p.mp4" 
                           loop 
                           muted={isMuted}
                           playsInline
                           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                               (animationState === 'insight' && isVideoLoaded) ? 'opacity-100' : 'opacity-0'
                           }`}
                           onLoadedData={() => setIsVideoLoaded(true)}
                        />
                        
                        {/* 2. The Raw/Processing Overlay (Foreground Layer) */}
                        <div className={`absolute inset-0 bg-[#0f172a] transition-opacity duration-1000 z-10 flex items-center justify-center ${animationState === 'insight' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            
                            {/* Processing Spinner */}
                            {animationState === 'processing' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0f172a]/80 backdrop-blur-sm animate-in fade-in duration-500">
                                    <div className="relative w-20 h-20 mb-4">
                                        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                    </div>
                                    <div className="text-cyan-400 font-bold font-mono animate-pulse">
                                        Cleaning & Structuring...
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 font-mono">
                                        Detecting Schema • Calculating KPIs
                                    </div>
                                </div>
                            )}

                            {/* Raw Data Visual */}
                            <div className={`w-3/4 h-3/4 bg-[#1e293b] border border-white/10 rounded-lg p-4 relative overflow-hidden transition-transform duration-700 ${animationState === 'processing' ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
                                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                                    <FileSpreadsheet className="w-4 h-4 text-red-400" />
                                    <span className="text-xs font-mono text-gray-400">sales_dump_v2_FINAL.csv</span>
                                </div>
                                <div className="space-y-2 font-mono text-[9px] leading-tight text-gray-500 opacity-80">
                                    <div className="grid grid-cols-4 gap-2 text-cyan-500/50 font-bold border-b border-white/5 pb-1 mb-1">
                                        <div>ID</div><div>DATE</div><div>REGION</div><div>AMT</div>
                                    </div>
                                    {mockRawData.map((row, idx) => (
                                        <div key={idx} className="grid grid-cols-4 gap-2 font-mono">
                                            <div className={!row.id ? 'text-red-500 font-bold' : ''}>{row.id || 'NULL'}</div>
                                            <div className={row.date === 'INVALID' ? 'text-red-400' : ''}>{row.date}</div>
                                            <div className={['NULL', '??'].includes(row.region) ? 'text-yellow-500' : ''}>{row.region}</div>
                                            <div className={row.amount === '#VALUE!' ? 'text-red-500 font-bold' : ''}>{row.amount}</div>
                                        </div>
                                    ))}
                                </div>
                                {/* Messy Badge */}
                                <div className="absolute top-10 right-4 rotate-12 bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 text-xs font-bold rounded shadow-lg backdrop-blur-md">
                                    MESSY DATA
                                </div>
                                {/* Scan Line */}
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-1/4 w-full animate-[scan_2s_ease-in-out_infinite] pointer-events-none ${animationState === 'processing' ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>
                        </div>

                        {/* Video Controls (Visible only in Insight Mode) */}
                        <div className={`absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg z-20 transition-all duration-500 ${animationState === 'insight' ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                           <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                           <span className="text-xs font-bold text-white tracking-wide">Live Dashboard</span>
                           <TrendingUp className="w-3 h-3 text-green-400" />
                        </div>

                        <button 
                           onClick={toggleAudio}
                           className={`absolute bottom-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 hover:scale-105 transition-all z-20 ${animationState === 'insight' ? 'opacity-100' : 'opacity-0'}`}
                           title={isMuted ? "Unmute" : "Mute"}
                        >
                           {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="flex -space-x-1">
                             <div className={`w-6 h-6 rounded-full border-2 border-[#0f172a] transition-colors duration-500 ${animationState === 'insight' ? 'bg-cyan-500' : 'bg-red-500/50'}`}></div>
                             <div className={`w-6 h-6 rounded-full border-2 border-[#0f172a] transition-colors duration-500 delay-100 ${animationState === 'insight' ? 'bg-purple-500' : 'bg-red-500/30'}`}></div>
                          </div>
                          <span className={`text-xs ${subTextColor} transition-opacity duration-300`}>
                              {animationState === 'insight' ? 'Insight generation complete' : 'Waiting for clean up...'}
                          </span>
                       </div>
                       <button className={`text-xs font-bold flex items-center gap-1 transition-all ${
                           animationState === 'insight' 
                             ? (isLight ? 'text-blue-600 hover:text-blue-700 opacity-100' : 'text-cyan-400 hover:text-cyan-300 opacity-100')
                             : 'opacity-50 cursor-not-allowed text-gray-500'
                       }`}>
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
