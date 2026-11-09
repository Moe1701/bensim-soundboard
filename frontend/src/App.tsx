import { useState } from 'react';
import type { InstructorRole } from './types/audio';
import { Header } from './components/Header';
import { MonitoringBoard } from './components/MonitoringBoard';
import { TalkbackMatrix } from './components/TalkbackMatrix';
import { RoleSelector } from './components/RoleSelector';
import { useOscConnection } from './hooks/useOscConnection';

export default function App() {
  const [activeRole, setActiveRole] = useState<InstructorRole | null>(null);

  const { isConnected, sendAudioUpdate } = useOscConnection(
    activeRole as InstructorRole
  );

  if (!activeRole) {
    return <RoleSelector onSelectRole={setActiveRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 flex flex-col font-sans select-none overflow-hidden gap-6">
      <Header role={activeRole} isConnected={isConnected} />
      <MonitoringBoard onAudioUpdate={sendAudioUpdate} />
      <TalkbackMatrix onAudioUpdate={sendAudioUpdate} />
    </div>
  );
}