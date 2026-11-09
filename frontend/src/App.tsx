export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 flex flex-col font-sans select-none">
      
      {/* Kopfzeile (Header) */}
      <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">BenSim Soundboard</h1>
          <p className="text-sm text-slate-500 font-medium">Simulation Audio Controller</p>
        </div>
        
        {/* Temporärer Platzhalter für die Rollen-Auswahl */}
        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-semibold border border-indigo-100">
          Rolle: Instruktor 1
        </div>
      </header>

      {/* Hauptbereich für Mixbus & Talkback */}
      <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-400 text-xl">🎙️</span>
          </div>
          <h2 className="text-lg font-semibold">System bereit</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Die UI-Komponenten für Monitoring-Mix und Talkback-Matrix werden hier platziert.
          </p>
        </div>
      </main>
      
    </div>
  );
}
