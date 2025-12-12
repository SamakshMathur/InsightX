


import React, { useState, useEffect } from 'react';
import { DataStory, Theme } from '../types';
import { X, BarChart3, ChevronRight, ChevronLeft } from 'lucide-react';
import VoiceNarrator from './VoiceNarrator';

interface Props {
  story: DataStory;
  theme: Theme;
  onClose: () => void;
  onHighlightChart: (chartId: string | undefined) => void;
}

const StoryMode: React.FC<Props> = ({ story, theme, onClose, onHighlightChart }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const isLight = theme === Theme.MINIMAL_LIGHT;
  const currentSegment = story.segments[currentSegmentIndex];

  useEffect(() => {
    // Highlight chart when segment changes
    onHighlightChart(currentSegment.chartId);
    return () => onHighlightChart(undefined);
  }, [currentSegmentIndex, onHighlightChart, currentSegment.chartId]);

  const handleNext = () => {
    if (currentSegmentIndex < story.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setAutoPlay(true);
    }
  };

  const handlePrev = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
      setAutoPlay(true);
    }
  };

  return (
    <div className={`fixed right-0 top-24 bottom-6 w-96 m-4 rounded-2xl border shadow-2xl flex flex-col z-40 transition-all duration-300 ${isLight ? 'bg-white/95 border-gray-200 text-gray-900' : 'bg-[#0f172a]/95 border-white/10 text-white'} backdrop-blur-md`}>
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start">
        <div>
          <h6 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 flex items-center gap-2">
             AI Story Mode
          </h6>
          <h3 className="font-display font-bold text-xl leading-tight">{story.title}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-50" />
        </button>
      </div>

      {/* Voice Control */}
      <div className={`p-4 border-b ${isLight ? 'border-gray-100 bg-gray-50/50' : 'border-white/5 bg-black/20'}`}>
         <VoiceNarrator 
           text={currentSegment.audioScript} 
           autoPlay={autoPlay}
           theme={isLight ? 'light' : 'dark'}
           onEnd={() => {
              // Auto advance logic could go here if desired, 
              // currently we wait for user to click next or just let them replay
           }}
         />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <p className={`text-sm italic leading-relaxed ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
          "{story.summary}"
        </p>

        <div className="space-y-4">
          {story.segments.map((seg, idx) => (
            <div 
              key={seg.id}
              onClick={() => { setCurrentSegmentIndex(idx); setAutoPlay(true); }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                idx === currentSegmentIndex 
                  ? (isLight ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-brand-blue/10 border-brand-blue/50 ring-1 ring-brand-blue/50') 
                  : (isLight ? 'bg-gray-50 border-gray-100 opacity-60 hover:opacity-100' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100')
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-bold ${idx === currentSegmentIndex ? 'text-cyan-400' : 'opacity-50'}`}>Part {idx + 1}</span>
                {seg.chartId && <BarChart3 className="w-3 h-3 opacity-40" />}
              </div>
              <h4 className="font-bold text-sm mb-2">{seg.title}</h4>
              <p className="text-sm opacity-80 leading-relaxed">{seg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className={`p-4 border-t flex justify-between items-center ${isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-black/20'}`}>
         <button 
           onClick={handlePrev}
           disabled={currentSegmentIndex === 0}
           className={`p-2 rounded-lg border flex items-center gap-2 text-sm font-bold transition-all ${currentSegmentIndex === 0 ? 'opacity-30 cursor-not-allowed' : (isLight ? 'bg-white border-gray-200 hover:bg-gray-100' : 'bg-white/5 border-white/10 hover:bg-white/10')}`}
         >
           <ChevronLeft className="w-4 h-4" /> Prev
         </button>
         <span className="text-xs font-mono opacity-50">
           {currentSegmentIndex + 1} / {story.segments.length}
         </span>
         <button 
           onClick={handleNext}
           disabled={currentSegmentIndex === story.segments.length - 1}
           className={`p-2 rounded-lg border flex items-center gap-2 text-sm font-bold transition-all ${currentSegmentIndex === story.segments.length - 1 ? 'opacity-30 cursor-not-allowed' : (isLight ? 'bg-white border-gray-200 hover:bg-gray-100' : 'bg-white/5 border-white/10 hover:bg-white/10')}`}
         >
           Next <ChevronRight className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
};

export default StoryMode;
