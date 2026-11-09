import { useState } from 'react';
import { TalkbackButton } from './TalkbackButton';

export function TalkbackMatrix() {
  // Dummy-State, welche Ausgänge gerade für das Talkback aktiviert sind
  const [activeRoutes, setActiveRoutes] = useState<string[]>([]);

  const toggleRoute = (route: string) => {
    setActiveRoutes(prev => 
      prev.includes(route) 
        ? prev.filter(r => r !== route) 
        : [...prev, route]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col flex-1">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Talkback Routing (Dein Mikrofon)</h2>
        
        {/* Master PTT-Button (Push To Talk) */}
        <button className="bg-red-50 text-red-700 border-2 border-red-200 px-8 py-3 rounded-xl font-bold text-lg hover:bg-red-100 active:bg-red-200 transition-colors shadow-sm select-none">
          TALK
        </button>
      </div>

      {/* Die Routing-Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TalkbackButton 
          label="Voice of God" 
          isActive={activeRoutes.includes('vog')} 
          onClick={() => toggleRoute('vog')} 
        />
        <TalkbackButton 
          label="Raumklang" 
          isActive={activeRoutes.includes('raum')} 
          onClick={() => toggleRoute('raum')} 
        />
        <TalkbackButton 
          label="TN 1" 
          isActive={activeRoutes.includes('tn1')} 
          onClick={() => toggleRoute('tn1')} 
        />
        <TalkbackButton 
          label="TN 2" 
          isActive={activeRoutes.includes('tn2')} 
          onClick={() => toggleRoute('tn2')} 
        />
      </div>
      
    </div>
  );
}