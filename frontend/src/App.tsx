import { useState } from 'react';
import type { InstructorRole } from './types/audio';
import { Header } from './components/Header';
import { MonitoringBoard } from './components/MonitoringBoard';
import { RoleSelector } from './components/RoleSelector';
import { useOscConnection } from './hooks/useOscConnection';
import { RoomControl } from './components/RoomControl';

export default function App() {
  const [activeRole, setActiveRole] = useState<InstructorRole | null>(null);

  const { isConnected, sendAudioUpdate } = useOscConnection(
    activeRole as InstructorRole
  );

  if (!activeRole) {
    return <RoleSelector onSelectRole={setActiveRole} />;
  }

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-800 p-2 md:p-3 flex flex-col font-sans select-none overflow-hidden gap-3">
      {/* Der Kopf-Bereich (Rolle, Status) */}
      <Header role={activeRole} isConnected={isConnected} />

      {/* OBERE HÄLFTE: Zone A (In-Ear) */}
      <div className="flex-[3] min-h-0">
        <MonitoringBoard onAudioUpdate={sendAudioUpdate} />
      </div>

      {/* UNTERE HÄLFTE: Zone B & C (Raum & PTT) */}
      <div className="flex-[2] min-h-0">
        <RoomControl onAudioUpdate={sendAudioUpdate} />
      </div>
    </div>
  );
}