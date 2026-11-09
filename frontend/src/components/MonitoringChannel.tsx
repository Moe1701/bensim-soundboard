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
  return (
    <div className="flex flex-col items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-36 shrink-0">
      {/* Kanal-Name */}
      <div className="text-slate-800 font-bold mb-6 text-lg tracking-wide">{label}</div>
      
      {/* Volume Slider (Vertikal gedreht für Mischpult-Feeling) */}
      <div className="h-48 w-full flex items-center justify-center relative mb-8">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-48 h-8 -rotate-90 absolute cursor-pointer accent-slate-600 bg-slate-100 rounded-full appearance-none"
        />
      </div>

      {/* Touch-Buttons */}
      <div className="flex flex-col gap-3 w-full mt-auto">
        <button 
          onClick={onToggleMute}
          className={`min-h-16 rounded-xl font-bold text-lg transition-all ${
            isMuted 
              ? 'bg-red-100 text-red-700 border-2 border-red-200' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'
          }`}
        >
          MUTE
        </button>
        
        <button 
          onClick={onToggleSolo}
          className={`min-h-16 rounded-xl font-bold text-lg transition-all ${
            isSolo 
              ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'
          }`}
        >
          SOLO
        </button>
      </div>
    </div>
  );
}