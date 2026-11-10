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

export function RoomControl({ onAudioUpdate }: RoomControlProps) {
  // State für die 4 Master-Fader
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  
  // State für die PTT Talkback-Matrix
  const [activeRoutes, setActiveRoutes] = useState<Record<string, boolean>>({});

  // Lade gespeicherte Beschriftungen beim Start
  useEffect(() => {
    const savedLabels = localStorage.getItem('bensim_labels_room');
    if (savedLabels) {
      try {
        setLabels(JSON.parse(savedLabels));
      } catch (e) {
        console.error('Fehler beim Laden der Labels');
      }
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

  // PTT (Push-To-Talk) Logic
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
      {/* ZONE B: Master Outputs (Die 4 Fader) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-1/2 flex flex-col">
        <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase mb-4 shrink-0">
          ZONE B: Raum-Ausgabe (Master)
        </h2>
        <div className="grid grid-cols-4 gap-2 flex-1 min-h-0">
          {MASTER_OUTPUTS.map(out => (
            <div key={out.id} className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-lg p-2 h-full">
              <div className="w-full text-center mb-2 shrink-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{out.defaultLabel}</div>
                <input 
                  type="text" 
                  value={labels[out.id] || ''}
                  onChange={(e) => handleLabelChange(out.id, e.target.value)}
                  placeholder="Ziel?" 
                  className="w-full text-xs text-center bg-white border border-slate-300 rounded mt-1 px-1 py-1 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-bold text-slate-700"
                />
              </div>

              <div className="relative flex-1 w-10 bg-slate-200 rounded-full flex justify-center py-2 my-2 shrink min-h-[80px]">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes[out.id] || 0}
                  onChange={(e) => handleVolumeChange(out.id, parseInt(e.target.value))}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer touch-none z-10"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <div 
                  className="absolute w-8 h-8 bg-white border-2 border-slate-300 rounded-full shadow-md pointer-events-none transition-all duration-75 z-0"
                  style={{ bottom: `${volumes[out.id] || 0}%`, transform: 'translateY(50%)' }}
                />
                <div 
                  className={`absolute bottom-0 w-3 rounded-full pointer-events-none z-0 ${muted[out.id] ? 'bg-slate-300' : 'bg-emerald-400'}`}
                  style={{ height: `${volumes[out.id] || 0}%` }}
                />
              </div>

              <button 
                onClick={() => toggleMute(out.id)}
                className={`w-full text-[10px] font-bold py-2 rounded transition-colors shrink-0 ${
                  muted[out.id] 
                    ? 'bg-red-500 text-white shadow-inner' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                MUTE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE C: Talkback Matrix (PTT) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-1/2 flex flex-col">
        <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase mb-4 shrink-0 flex items-center gap-2">
          <span>🎙️</span> ZONE C: Talkback Matrix
        </h2>
        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Wir nutzen hier die custom labels aus Zone B, damit der Button weiß, wie das Ziel heißt */}
          {[
            { id: 'vog', targetLabelId: 'out_vog' },
            { id: 'pat1', targetLabelId: 'out_pat1' },
            { id: 'pat2', targetLabelId: 'out_pat2' },
            { id: 'room', label: 'Raum-Intercom' }
          ].map(btn => (
            <button
              key={btn.id}
              onPointerDown={() => handlePressIn(btn.id)}
              onPointerUp={() => handlePressOut(btn.id)}
              onPointerLeave={() => handlePressOut(btn.id)}
              className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-75 select-none touch-none ${
                activeRoutes[btn.id]
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-inner scale-[0.98]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 shadow-sm hover:bg-slate-100'
              }`}
            >
              <div className="text-lg font-bold">
                {btn.label || labels[btn.targetLabelId!] || MASTER_OUTPUTS.find(o => o.id === btn.targetLabelId)?.defaultLabel}
              </div>
              <div className="text-[10px] mt-1 opacity-70 font-bold uppercase tracking-wider">
                {activeRoutes[btn.id] ? 'AUF SENDUNG' : 'Drücken & Halten'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}