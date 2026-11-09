import { useState } from 'react';
import { MonitoringChannel } from './MonitoringChannel';

interface MonitoringBoardProps {
  onAudioUpdate: (payload: any) => void;
}

// Das echte Hardware-Setup deines Simulationszentrums
const CHANNELS = [
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
  { id: 'aux1', label: 'Soundboard' }
];

export function MonitoringBoard({ onAudioUpdate }: MonitoringBoardProps) {
  // Initialisiert alle Kanäle standardmäßig auf 75% Lautstärke
  const [volumes, setVolumes] = useState<Record<string, number>>(
    CHANNELS.reduce((acc, ch) => ({ ...acc, [ch.id]: 75 }), {})
  );
  const [mutes, setMutes] = useState<Record<string, boolean>>({});
  const [solos, setSolos] = useState<Record<string, boolean>>({});

  const updateChannel = (id: string, property: string, value: any) => {
    if (property === 'volume') setVolumes(prev => ({ ...prev, [id]: value }));
    if (property === 'mute') setMutes(prev => ({ ...prev, [id]: value }));
    if (property === 'solo') setSolos(prev => ({ ...prev, [id]: value }));
    
    // Sendet exakt die ID (z.B. 'tn8' oder 'aux1') ans Backend
    onAudioUpdate({ target: 'channel', id, property, value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Monitoring Mix (Dein In-Ear)</h2>
      
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
        {CHANNELS.map(ch => (
          <MonitoringChannel 
            key={ch.id}
            label={ch.label}
            volume={volumes[ch.id] || 0}
            isMuted={!!mutes[ch.id]}
            isSolo={!!solos[ch.id]}
            onVolumeChange={(val) => updateChannel(ch.id, 'volume', val)}
            onToggleMute={() => updateChannel(ch.id, 'mute', !mutes[ch.id])}
            onToggleSolo={() => updateChannel(ch.id, 'solo', !solos[ch.id])}
          />
        ))}
      </div>
    </div>
  );
}