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

  // Lade gespeicherte Beschriftungen (Kreppband) beim Start
  useEffect(() => {
    const savedLabels = localStorage.getItem('bensim_labels_inear');
    if (savedLabels) {
      try {
        setLabels(JSON.parse(savedLabels));
      } catch (e) {
        console.error('Fehler beim Laden der Labels');
      }
    }
  }, []);

  // Speichere Änderungen direkt lokal im Browser
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase">
          ZONE A: Monitoring Mix (Dein In-Ear)
        </h2>
      </div>

      {/* 10er Grid: Perfekt für die 10 Inputs nebeneinander */}
      <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 flex-1 min-h-0">
        {INPUT_CHANNELS.map(ch => (
          <div 
            key={ch.id} 
            className={`flex flex-col items-center bg-slate-50 border rounded-lg p-2 h-full ${
              solos[ch.id] ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-200'
            }`}
          >
            {/* Header: Label + Digitales Kreppband */}
            <div className="w-full text-center mb-2 shrink-0">
              <div className="text-xs font-bold text-slate-700">{ch.label}</div>
              <input 
                type="text" 
                value={labels[ch.id] || ''}
                onChange={(e) => handleLabelChange(ch.id, e.target.value)}
                placeholder="Wer?" 
                className="w-full text-[10px] text-center bg-white border border-slate-200 rounded mt-1 px-1 py-1 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-300 font-medium transition-all"
              />
            </div>

            {/* Fader Track */}
            <div className="relative flex-1 w-8 bg-slate-200 rounded-full flex justify-center py-2 my-2 shrink min-h-[100px]">
              <input
                type="range"
                min="0"
                max="100"
                value={volumes[ch.id] || 0}
                onChange={(e) => handleVolumeChange(ch.id, parseInt(e.target.value))}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer touch-none z-10"
                style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
              />
              {/* Visueller Fader-Knopf */}
              <div 
                className="absolute w-6 h-6 bg-white border border-slate-300 rounded-full shadow-md pointer-events-none transition-all duration-75 z-0"
                style={{ bottom: `${volumes[ch.id] || 0}%`, transform: 'translateY(50%)' }}
              />
              {/* Aktiver Track (Füllung) */}
              <div 
                className={`absolute bottom-0 w-2 rounded-full pointer-events-none z-0 ${muted[ch.id] ? 'bg-slate-300' : 'bg-indigo-400'}`}
                style={{ height: `${volumes[ch.id] || 0}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-1 w-full shrink-0">
              <button 
                onClick={() => toggleMute(ch.id)}
                className={`text-[10px] font-bold py-1.5 rounded transition-colors ${
                  muted[ch.id] 
                    ? 'bg-red-500 text-white shadow-inner' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                MUTE
              </button>
              <button 
                onClick={() => toggleSolo(ch.id)}
                className={`text-[10px] font-bold py-1.5 rounded transition-colors ${
                  solos[ch.id] 
                    ? 'bg-amber-400 text-amber-900 shadow-inner' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
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