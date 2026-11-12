import { useState, useEffect, useCallback } from 'react';

interface RoomControlProps {
  onAudioUpdate: (update: any) => void;
}

const MASTER_OUTPUTS = [
  { id: 'out_vog', defaultLabel: 'Voice of God' },
  { id: 'out_pat1', defaultLabel: 'Patient 1' },
  { id: 'out_pat2', defaultLabel: 'Patient 2' },
  { id: 'out_sound', defaultLabel: 'Soundboard' },
];

const PTT_STYLES: Record<string, { idle: string, active: string }> = {
  'vog': { 
    idle: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100', 
    active: 'bg-purple-600 border-purple-700 text-white shadow-inner scale-[0.98]' 
  },
  'pat1': { 
    idle: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100', 
    active: 'bg-emerald-500 border-emerald-600 text-white shadow-inner scale-[0.98]' 
  },
  'pat2': { 
    idle: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100', 
    active: 'bg-teal-500 border-teal-600 text-white shadow-inner scale-[0.98]' 
  },
  'room': { 
    idle: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100', 
    active: 'bg-amber-500 border-amber-600 text-white shadow-inner scale-[0.98]' 
  }
};

export function RoomControl({ onAudioUpdate }: RoomControlProps) {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [activeRoutes, setActiveRoutes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedLabels = localStorage.getItem('bensim_labels_room');
    if (savedLabels) {
      try { setLabels(JSON.parse(savedLabels)); } catch (e) {}
    }
  }, []);

  const handleLabelChange = (id: string, text: string) => {
    const newLabels = { ...labels, [id]: text };
    setLabels(newLabels);
    localStorage.setItem('bensim_labels_room', JSON.stringify(newLabels));
  };

  const handleVolumeChange = (id: string, value: number) => {
    setVolumes(prev => ({ ...prev, [id]: value }));
    onAudioUpdate({ payload: { target: 'master', id, property: 'volume', value } });
  };

  const toggleMute = (id: string) => {
    const newState = !muted[id];
    setMuted(prev => ({ ...prev, [id]: newState }));
    onAudioUpdate({ payload: { target: 'master', id, property: 'mute', value: newState } });
  };

  const handlePressIn = useCallback((routeId: string) => {
    setActiveRoutes(prev => ({ ...prev, [routeId]: true }));
    onAudioUpdate({ payload: { target: 'talkback', route: routeId, active: true } });
  }, [onAudioUpdate]);

  const handlePressOut = useCallback((routeId: string) => {
    setActiveRoutes(prev => {
      if (!prev[routeId]) return prev;
      onAudioUpdate({ payload: { target: 'talkback', route: routeId, active: false } });
      return { ...prev, [routeId]: false };
    });
  }, [onAudioUpdate]);

  return (
    <div className="flex gap-4 h-full">
      {/* ZONE B: Master Outputs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 w-1/2 flex flex-col">
        <h2 className="text-xs font-bold text-slate-500 tracking-wide uppercase mb-2 shrink-0">
          <span className="text-emerald-500 mr-1">■</span> ZONE B: Raum-Ausgabe (Master)
        </h2>
        <div className="grid grid-cols-4 gap-2 flex-1 min-h-0">
          {MASTER_OUTPUTS.map(out => (
            <div key={out.id} className="flex flex-col items-center bg-slate-50/50 border border-slate-200 rounded-lg p-2 h-full">
              <div className="w-full text-center mb-1 shrink-0">
                {/* HIER VERGRÖSSERT: text-xs und font-black */}
                <div className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{out.defaultLabel}</div>
                <input 
                  type="text" 
                  value={labels[out.id] || ''}
                  onChange={(e) => handleLabelChange(out.id, e.target.value)}
                  placeholder="Ziel?" 
                  className="w-full text-[11px] text-center bg-white border border-slate-200 rounded px-1 py-1 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-bold text-slate-700"
                />
              </div>

              <div className="relative flex-1 w-full flex justify-center py-2 shrink min-h-[70px]">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes[out.id] || 0}
                  onChange={(e) => handleVolumeChange(out.id, parseInt(e.target.value))}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer touch-none z-20"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <div className="absolute w-1.5 h-full bg-slate-200 rounded-full z-0" />
                <div 
                  className={`absolute bottom-0 w-1.5 rounded-full z-0 transition-colors ${muted[out.id] ? 'bg-slate-300' : 'bg-emerald-400'}`}
                  style={{ height: `${volumes[out.id] || 0}%` }}
                />
                <div 
                  className={`absolute w-7 h-4 bg-white border-2 rounded-full shadow-md pointer-events-none transition-transform z-10 ${muted[out.id] ? 'border-slate-300' : 'border-emerald-500'}`}
                  style={{ bottom: `${volumes[out.id] || 0}%`, transform: 'translateY(50%)' }}
                />
              </div>

              {/* ABSTAND mt-4 und GRÖSSERER MUTE BUTTON */}
              <button 
                onClick={() => toggleMute(out.id)}
                className={`w-full text-[11px] font-bold py-2 rounded-lg border transition-colors shrink-0 mt-4 ${
                  muted[out.id] 
                    ? 'bg-red-100 text-red-700 border-red-400 shadow-inner' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                MUTE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE C: Talkback Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 w-1/2 flex flex-col">
        <h2 className="text-xs font-bold text-slate-500 tracking-wide uppercase mb-2 shrink-0 flex items-center gap-1">
          <span>🎙️</span> ZONE C: Talkback Matrix
        </h2>
        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {[
            { id: 'vog', targetLabelId: 'out_vog' },
            { id: 'pat1', targetLabelId: 'out_pat1' },
            { id: 'pat2', targetLabelId: 'out_pat2' },
            { id: 'room', label: 'Raum-Intercom' }
          ].map(btn => {
            const isActive = activeRoutes[btn.id];
            const style = PTT_STYLES[btn.id] || PTT_STYLES['room'];
            
            return (
              <button
                key={btn.id}
                onPointerDown={() => handlePressIn(btn.id)}
                onPointerUp={() => handlePressOut(btn.id)}
                onPointerLeave={() => handlePressOut(btn.id)}
                className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-75 select-none touch-none ${
                  isActive ? style.active : style.idle
                }`}
              >
                {/* HIER VERGRÖSSERT: text-lg und font-black */}
                <div className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                  {btn.label || labels[btn.targetLabelId!] || MASTER_OUTPUTS.find(o => o.id === btn.targetLabelId)?.defaultLabel}
                </div>
                <div className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${isActive ? 'opacity-90 text-white' : 'opacity-60'}`}>
                  {isActive ? 'AUF SENDUNG' : 'Drücken & Halten'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}