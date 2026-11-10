import { useState, useEffect } from 'react';

interface MonitoringChannelProps {
  label: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  onToggleSolo: () => void;
}

export function MonitoringChannel({
  label,
  volume,
  isMuted,
  isSolo,
  onVolumeChange,
  onToggleMute,
  onToggleSolo,
}: MonitoringChannelProps) {
  
  // Das "Klebeband" nutzt den LocalStorage, damit die Namen beim Neuladen bleiben
  const [tapeLabel, setTapeLabel] = useState(() => {
    return localStorage.getItem(`tape-${label}`) || '';
  });

  useEffect(() => {
    localStorage.setItem(`tape-${label}`, tapeLabel);
  }, [tapeLabel, label]);

  return (
    <div className="flex flex-col items-center bg-white border border-slate-200 rounded-2xl p-3 shadow-sm w-full min-w-[80px] max-w-[120px] mx-auto">
      <div className="text-slate-800 font-bold mb-4 text-sm md:text-base tracking-wide">{label}</div>
      
      <div className="h-40 w-full flex items-center justify-center relative mb-6">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-40 h-8 -rotate-90 absolute cursor-pointer accent-slate-600 bg-slate-100 rounded-full appearance-none"
        />
      </div>

      <div className="flex flex-col gap-2 w-full mt-auto">
        <button 
          onClick={onToggleMute}
          className={`min-h-12 md:min-h-14 rounded-xl font-bold text-sm md:text-base transition-all ${
            isMuted 
              ? 'bg-red-100 text-red-700 border-2 border-red-200' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'
          }`}
        >
          MUTE
        </button>
        
        <button 
          onClick={onToggleSolo}
          className={`min-h-12 md:min-h-14 rounded-xl font-bold text-sm md:text-base transition-all ${
            isSolo 
              ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'
          }`}
        >
          SOLO
        </button>
      </div>

      {/* Das analoge Klebeband */}
      <div className="w-full mt-3 pt-3 border-t border-slate-100">
        <input
          type="text"
          value={tapeLabel}
          onChange={(e) => setTapeLabel(e.target.value)}
          placeholder="Wer?"
          maxLength={12}
          className="w-full bg-[#fef08a] text-slate-800 font-mono text-center text-xs md:text-sm font-bold py-1 px-1 shadow-sm outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-amber-700/40"
          style={{ transform: 'rotate(-1deg)' }}
        />
      </div>
    </div>
  );
}