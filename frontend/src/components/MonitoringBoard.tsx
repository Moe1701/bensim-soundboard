import { useState } from 'react';
import { MonitoringChannel } from './MonitoringChannel';

interface MonitoringBoardProps {
  onAudioUpdate: (payload: any) => void;
}

export function MonitoringBoard({ onAudioUpdate }: MonitoringBoardProps) {
  const [volume1, setVolume1] = useState(75);
  const [muted1, setMuted1] = useState(false);
  const [solo1, setSolo1] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Monitoring Mix (Dein In-Ear)</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        <MonitoringChannel 
          label="TN 1"
          volume={volume1}
          isMuted={muted1}
          isSolo={solo1}
          onVolumeChange={(val) => {
            setVolume1(val);
            onAudioUpdate({ target: 'channel', id: 'tn1', property: 'volume', value: val });
          }}
          onToggleMute={() => {
            setMuted1(!muted1);
            onAudioUpdate({ target: 'channel', id: 'tn1', property: 'mute', value: !muted1 });
          }}
          onToggleSolo={() => {
            setSolo1(!solo1);
            onAudioUpdate({ target: 'channel', id: 'tn1', property: 'solo', value: !solo1 });
          }}
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