import { useState, useEffect } from 'react';
import type { InstructorRole } from '../types/audio';
import QRCode from 'react-qr-code';

interface RoleSelectorProps {
  onSelectRole: (role: InstructorRole) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const [serverUrl, setServerUrl] = useState<string>('');
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setServerUrl(`http://${data.ip}:${data.port}`))
      .catch(err => console.error('Konnte Host-IP nicht laden', err));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200 h-[600px]">

        {/* LINKS: Die Rollenwahl */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">BenSim Soundboard</h1>
          <p className="text-lg text-slate-500 mb-10">Bitte wähle deine Instruktor-Rolle für dieses Gerät.</p>

          <div className="flex flex-col gap-4">
            {(['instructor-1', 'instructor-2', 'instructor-3'] as InstructorRole[]).map((role, i) => (
              <button
                key={role}
                onClick={() => onSelectRole(role)}
                className="p-5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 font-semibold text-lg rounded-xl transition-all flex justify-between items-center group"
              >
                <span>Instruktor {i + 1}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">➔</span>
              </button>
            ))}
          </div>
        </div>

        {/* RECHTS: System Panel (Medical Light Mode) */}
        <div className="w-full md:w-[400px] bg-slate-50 text-slate-800 p-8 flex flex-col items-center justify-center relative border-l border-slate-200 shadow-inner">
          
          <button
            onClick={() => setDevMode(!devMode)}
            className="absolute top-6 right-6 text-xs font-mono px-3 py-1 rounded border border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400 hover:bg-white transition-all"
          >
            {devMode ? 'UI MODUS' : 'DEV MODUS'}
          </button>

          {devMode ? (
            <div className="w-full h-full flex flex-col justify-center font-mono text-sm space-y-4">
              <div className="text-indigo-600 font-bold mb-4 text-lg border-b border-slate-200 pb-2"># SYSTEM STATUS</div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Host-IP:</span>
                <span className="font-semibold">{serverUrl.replace('http://', '') || '...'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Node Port:</span>
                <span className="font-semibold">8080 (TCP)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">OSC Local:</span>
                <span className="font-semibold">53000 (UDP)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">X32 Target:</span>
                <span className="text-amber-600 font-semibold">192.168.1.100:10024</span>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border border-slate-200 text-indigo-600 space-y-2 shadow-sm">
                <div>&gt; Express Server läuft.</div>
                <div>&gt; WebSockets bereit.</div>
                <div className="animate-pulse">&gt; Warte auf Tablets...</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full">
              <h2 className="text-xl font-semibold mb-2 text-slate-700">Tablet verbinden</h2>
              <p className="text-slate-500 text-sm mb-8">Scanne den Code mit der Kamera</p>
              
              {serverUrl ? (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8">
                  <QRCode value={serverUrl} size={180} className="rounded" />
                </div>
              ) : (
                <div className="w-[214px] h-[214px] bg-slate-200 rounded-2xl mb-8 animate-pulse" />
              )}
              
              <div className="w-full bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Netzwerk IP</span>
                <span className="font-mono text-indigo-600 font-bold">{serverUrl || 'Lade...'}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}