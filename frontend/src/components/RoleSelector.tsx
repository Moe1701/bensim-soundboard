import type { InstructorRole } from '../types/audio';
import { ROLES } from '../utils/constants';

interface RoleSelectorProps {
  onSelectRole: (role: InstructorRole) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Willkommen</h2>
        <p className="text-slate-500 mb-8">Bitte wähle deine Instruktor-Rolle für dieses Tablet.</p>
        
        <div className="flex flex-col gap-4">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="min-h-16 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-lg rounded-xl border-2 border-transparent hover:border-indigo-200 transition-all"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}