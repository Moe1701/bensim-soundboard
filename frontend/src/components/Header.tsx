import type { InstructorRole } from '../types/audio';
import { ROLES } from '../utils/constants';

interface HeaderProps {
  role: InstructorRole;
  isConnected?: boolean;
}

export function Header({ role, isConnected = false }: HeaderProps) {
  const roleLabel = ROLES.find(r => r.id === role)?.label || 'Unbekannt';
  
  return (
    <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">BenSim Soundboard</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <p className="text-sm text-slate-500 font-medium">
            {isConnected ? 'System online' : 'System offline'}
          </p>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-semibold border border-indigo-100">
        Rolle: {roleLabel}
      </div>
    </header>
  );
}