import type { InstructorRole } from '../types/audio';
import { ROLES } from '../utils/constants';

interface HeaderProps {
  role: InstructorRole;
}

export function Header({ role }: HeaderProps) {
  // Sucht den schönen Namen (z.B. "Instruktor 1") zur technischen ID
  const roleLabel = ROLES.find(r => r.id === role)?.label || 'Unbekannt';
  
  return (
    <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">BenSim Soundboard</h1>
        <p className="text-sm text-slate-500 font-medium">Simulation Audio Controller</p>
      </div>
      
      <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-semibold border border-indigo-100">
        Rolle: {roleLabel}
      </div>
    </header>
  );
}