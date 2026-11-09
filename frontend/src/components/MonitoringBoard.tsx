import { useState } from 'react';
import { MonitoringChannel } from './MonitoringChannel';

export function MonitoringBoard() {
  // Lokaler State als Dummy (später kommt das über WebSockets vom X32)
  const [volume1, setVolume1] = useState(75);
  const [muted1, setMuted1] = useState(false);
  const [solo1, setSolo1] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Monitoring Mix (Dein In-Ear)</h2>
      
      {/* Kanal-Leiste */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <MonitoringChannel 
          label="TN 1"
          volume={volume1}
          isMuted={muted1}
          isSolo={solo1}
          onVolumeChange={setVolume1}
          onToggleMute={() => setMuted1(!muted1)}
          onToggleSolo={() => setSolo1(!solo1)}
        />

        <MonitoringChannel 
          label="Raumklang"
          volume={40}
          isMuted={true}
          isSolo={false}
          onVolumeChange={() => {}}
          onToggleMute={() => {}}
          onToggleSolo={() => {}}
        />
      </div>
    </div>
  );
}