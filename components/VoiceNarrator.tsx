
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, Settings, RefreshCw } from 'lucide-react';

interface VoiceConfig {
  rate: number;
  pitch: number;
  voiceURI: string;
}

interface Props {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
  theme: 'light' | 'dark';
}

const VoiceNarrator: React.FC<Props> = ({ text, autoPlay = false, onStart, onEnd, onPause, onResume, className, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [config, setConfig] = useState<VoiceConfig>({ rate: 1, pitch: 1, voiceURI: '' });
  
  const synth = useRef<SpeechSynthesis>(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const vs = synth.current.getVoices();
      setVoices(vs);
      if (!config.voiceURI && vs.length > 0) {
        // Prefer Google US English or Samantha or first available
        const preferred = vs.find(v => v.name.includes("Google US English")) || vs.find(v => v.name.includes("Samantha")) || vs[0];
        setConfig(prev => ({ ...prev, voiceURI: preferred.voiceURI }));
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (autoPlay && text) {
      handlePlay();
    }
  }, [text, autoPlay]);

  const handlePlay = () => {
    if (isPaused) {
      synth.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      if (onResume) onResume();
      return;
    }

    synth.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = config.rate;
    u.pitch = config.pitch;
    const voice = voices.find(v => v.voiceURI === config.voiceURI);
    if (voice) u.voice = voice;

    u.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (onStart) onStart();
    };

    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onEnd) onEnd();
    };

    utteranceRef.current = u;
    synth.current.speak(u);
  };

  const handlePause = () => {
    synth.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
    if (onPause) onPause();
  };

  const handleStop = () => {
    synth.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    if (onEnd) onEnd();
  };

  const iconColor = theme === 'light' ? 'text-gray-700' : 'text-gray-200';
  const bgColor = theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10';

  return (
    <div className={`rounded-xl border p-2 flex flex-col gap-2 ${bgColor} ${className}`}>
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            {isPlaying ? (
               <button onClick={handlePause} className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${iconColor}`}>
                 <Pause className="w-5 h-5 fill-current" />
               </button>
            ) : (
               <button onClick={handlePlay} className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${iconColor}`}>
                 <Play className="w-5 h-5 fill-current" />
               </button>
            )}
            <button onClick={handleStop} className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${iconColor}`}>
               <Square className="w-4 h-4 fill-current" />
            </button>
            <button onClick={() => { handleStop(); handlePlay(); }} className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${iconColor}`}>
               <RefreshCw className="w-4 h-4" />
            </button>
         </div>
         
         <div className="flex items-center gap-2">
            {isPlaying && (
               <div className="flex gap-0.5 items-end h-4 mr-2">
                  <div className="w-1 bg-cyan-400 animate-[pulse_0.5s_ease-in-out_infinite] h-2"></div>
                  <div className="w-1 bg-cyan-400 animate-[pulse_0.7s_ease-in-out_infinite] h-4"></div>
                  <div className="w-1 bg-cyan-400 animate-[pulse_0.6s_ease-in-out_infinite] h-3"></div>
               </div>
            )}
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${iconColor}`}>
               <Settings className="w-4 h-4" />
            </button>
         </div>
      </div>

      {showSettings && (
         <div className="mt-2 pt-2 border-t border-gray-500/10 space-y-3 p-2 text-xs">
            <div>
               <label className={`block mb-1 font-bold ${iconColor}`}>Voice</label>
               <select 
                 className={`w-full p-1.5 rounded border ${theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-black/30 border-white/10'} ${iconColor}`}
                 value={config.voiceURI}
                 onChange={(e) => setConfig({ ...config, voiceURI: e.target.value })}
               >
                 {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name.slice(0, 25)}</option>)}
               </select>
            </div>
            <div className="flex gap-4">
               <div className="flex-1">
                  <label className={`block mb-1 font-bold ${iconColor}`}>Speed ({config.rate}x)</label>
                  <input 
                    type="range" min="0.5" max="2" step="0.25"
                    value={config.rate}
                    onChange={(e) => setConfig({ ...config, rate: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
               </div>
               <div className="flex-1">
                  <label className={`block mb-1 font-bold ${iconColor}`}>Pitch</label>
                  <input 
                    type="range" min="0.5" max="2" step="0.1"
                    value={config.pitch}
                    onChange={(e) => setConfig({ ...config, pitch: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default VoiceNarrator;
