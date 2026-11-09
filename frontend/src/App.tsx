import { useState } from 'react';
import type { InstructorRole } from './types/audio';
import { Header } from './components/Header';
import { MonitoringBoard } from './components/MonitoringBoard';
import { TalkbackMatrix } from './components/TalkbackMatrix';
import { RoleSelector } from './components/RoleSelector';

export default function App() {
  const [activeRole, setActiveRole] = useState<InstructorRole | null>(null);

  // Solange keine Rolle gewählt ist, den Vollbild-Auswahldialog anzeigen
  if (!activeRole) {
    return <RoleSelector onSelectRole={setActiveRole} />;
  }

  // Das eigentliche Soundboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 flex flex-col font-sans select-none overflow-hidden gap-6">
      <Header role={activeRole} />
      <MonitoringBoard />
      <TalkbackMatrix />
    </div>
  );
}