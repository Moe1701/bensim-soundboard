import { useState, useEffect } from 'react';
import type { InstructorRole } from '../types/audio';
import { ROLES } from '../utils/constants';

interface HeaderProps {
  role: InstructorRole;
  isConnected?: boolean;
  onClaimVideoMaster?: () => void;
}

export function Header({ role, isConnected = false, onClaimVideoMaster }: HeaderProps) {
  const roleLabel = ROLES.find(r => r.id === role)?.label || 'Unbekannt';
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Vollbild fehlgeschlagen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return (
    <header className="flex justify-between items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">BenSim Soundboard</h1>
        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {isConnected ? 'System online' : 'System offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200"
          title={isFullscreen ? "Vollbild beenden" : "Vollbild aktivieren"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          )}
        </button>
        {onClaimVideoMaster && (
          <button
            onClick={onClaimVideoMaster}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1.5"
            title="Dein Tablet steuert ab jetzt den Video-Ton (Main Mix)"
          >
            🎥 Video Mix Sync
          </button>
        )}
        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 uppercase tracking-wider">
          {roleLabel}
        </div>
      </div>
    </header>
  );
}
