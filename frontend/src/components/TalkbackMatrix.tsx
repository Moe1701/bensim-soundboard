import { useState, useCallback } from 'react';

interface TalkbackMatrixProps {
  onAudioUpdate: (update: any) => void;
}

const DESTINATIONS = [
  { id: 'vog', label: 'Voice of God' },
  { id: 'room', label: 'Raumklang' },
  { id: 'tn', label: 'Alle TN (IEM)' },
];

export function TalkbackMatrix({ onAudioUpdate }: TalkbackMatrixProps) {
  const [activeRoutes, setActiveRoutes] = useState<Record<string, boolean>>({});

  const handlePressIn = useCallback((route: string) => {
    setActiveRoutes(prev => ({ ...prev, [route]: true }));
    onAudioUpdate({
      payload: { target: 'talkback', route, active: true }
    });
  }, [onAudioUpdate]);

  const handlePressOut = useCallback((route: string) => {
    setActiveRoutes(prev => {
      if (!prev[route]) return prev;
      
      onAudioUpdate({
        payload: { target: 'talkback', route, active: false }
      });
      return { ...prev, [route]: false };
    });
  }, [onAudioUpdate]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span>🎙️</span> Talkback Matrix
      </h2>
      <div className="flex gap-4">
        {DESTINATIONS.map(dest => (
          <button
            key={dest.id}
            onPointerDown={() => handlePressIn(dest.id)}
            onPointerUp={() => handlePressOut(dest.id)}
            onPointerLeave={() => handlePressOut(dest.id)}
            className={`flex-1 py-8 rounded-lg border-2 transition-all duration-75 select-none touch-none ${
              activeRoutes[dest.id]
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-inner scale-[0.98]'
                : 'bg-slate-50 border-slate-200 text-slate-600 shadow hover:bg-slate-100'
            }`}
          >
            <div className="text-xl font-bold">{dest.label}</div>
            <div className="text-sm mt-2 opacity-70 font-medium">
              {activeRoutes[dest.id] ? 'AUF SENDUNG' : 'Drücken & Halten'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}