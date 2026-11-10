import type { InstructorRole } from '../types/audio';
import { ROLES } from '../utils/constants';

interface HeaderProps {
  role: InstructorRole;
  isConnected?: boolean;
}

export function Header({ role, isConnected = false }: HeaderProps) {
  const roleLabel = ROLES.find(r => r.id === role)?.label || 'Unbekannt';
  
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
      
      <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
        {roleLabel}
      </div>
    </header>
  );
}