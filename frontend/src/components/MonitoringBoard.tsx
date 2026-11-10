import { useState, useEffect } from 'react';

interface MonitoringBoardProps {
  onAudioUpdate: (update: any) => void;
}

const INPUT_CHANNELS = [
  { id: 'tn1', label: 'TN 1' },
  { id: 'tn2', label: 'TN 2' },
  { id: 'tn3', label: 'TN 3' },
  { id: 'tn4', label: 'TN 4' },
  { id: 'tn5', label: 'TN 5' },
  { id: 'tn6', label: 'TN 6' },
  { id: 'tn7', label: 'TN 7' },
  { id: 'tn8', label: 'TN 8' },
  { id: 'raumL', label: 'Raum L' },
  { id: 'raumR', label: 'Raum R' },
];

export function MonitoringBoard({ onAudioUpdate }: MonitoringBoardProps) {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [solos, setSolos] = useState<Record<string, boolean>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLabels = localStorage.getItem('bensim_labels_inear');
    if (savedLabels) {
      try { setLabels(JSON.parse(savedLabels)); } catch (e) {}
    }
  }, []);

  const handleLabelChange = (id: string, text: string) => {
    const newLabels = { ...labels, [id]: text };
    setLabels(newLabels);
    localStorage.setItem('bensim_labels_inear', JSON.stringify(newLabels));
  };

  const handleVolumeChange = (id: string, value: number) => {
    setVolumes(prev => ({ ...prev, [id]: value }));
    onAudioUpdate({ payload: { target: 'channel', id, property: 'volume', value } });
  };

  const toggleMute = (id: string) => {
    const newState = !muted[id];
    setMuted(prev => ({ ...prev, [id]: newState }));
    onAudioUpdate({ payload: { target: 'channel', id, property: 'mute', value: newState } });
  };

  const toggleSolo = (id: string) => {
    const newState = !solos[id];
    setSolos(prev => ({ ...prev, [id]: newState }));
    onAudioUpdate({ payload: { target: 'channel', id, property: 'solo', value: newState } });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-xs font-bold text-slate-500 tracking-wide uppercase">
          <span className="text-blue-500 mr-1">■</span> ZONE A: Monitoring Mix (Dein In-Ear)
        </h2>
      </div>

      <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 flex-1 min-h-0">
        {INPUT_CHANNELS.map(ch => (
          <div 
            key={ch.id} 
            className={`flex flex-col items-center bg-slate-50/50 border rounded-lg p-2 h-full transition-colors ${
              solos[ch.id] ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'
            }`}
          >
            <div className="w-full text-center mb-1 shrink-0">
              {/* HIER VERGRÖSSERT: text-sm und font-black */}
              <div className="text-sm font-black text-slate-800 tracking-tight">{ch.label}</div>
              <input 
                type="text" 
                value={labels[ch.id] || ''}
                onChange={(e) => handleLabelChange(ch.id, e.target.value)}
                placeholder="Wer?" 
                className="w-full text-[10px] text-center bg-white border border-slate-200 rounded mt-1 px-1 py-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 placeholder:text-slate-300 font-bold"
              />
            </div>

            <div className="relative flex-1 w-full flex justify-center py-2 my-2 shrink min-h-[90px]">
              <input
                type="range"
                min="0"
                max="100"
                value={volumes[ch.id] || 0}
                onChange={(e) => handleVolumeChange(ch.id, parseInt(e.target.value))}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer touch-none z-20"
                style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
              />
              <div className="absolute w-1 h-full bg-slate-200 rounded-full z-0" />
              <div 
                className={`absolute bottom-0 w-1 rounded-full z-0 transition-colors ${muted[ch.id] ? 'bg-slate-300' : 'bg-blue-400'}`}
                style={{ height: `${volumes[ch.id] || 0}%` }}
              />
              <div 
                className={`absolute w-6 h-3 bg-white border-2 rounded-full shadow-sm pointer-events-none transition-transform z-10 ${muted[ch.id] ? 'border-slate-300' : 'border-blue-500'}`}
                style={{ bottom: `${volumes[ch.id] || 0}%`, transform: 'translateY(50%)' }}
              />
            </div>

            <div className="flex flex-col gap-1 w-full shrink-0">
              <button 
                onClick={() => toggleMute(ch.id)}
                className={`text-[9px] font-bold py-1 rounded border transition-colors ${
                  muted[ch.id] 
                    ? 'bg-red-100 text-red-700 border-red-300' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                MUTE
              </button>
              <button 
                onClick={() => toggleSolo(ch.id)}
                className={`text-[9px] font-bold py-1 rounded border transition-colors ${
                  solos[ch.id] 
                    ? 'bg-amber-100 text-amber-700 border-amber-300' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                SOLO
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}