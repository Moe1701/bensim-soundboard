const { initOscClient } = require('./src/osc/x32Client');

const oscClient = initOscClient();

const CHANNELS = [
  '/ch/01', '/ch/02', '/ch/03', '/ch/04', '/ch/05',
  '/ch/06', '/ch/07', '/ch/08', '/ch/09', '/ch/10',
  '/auxin/01'
];
const BUSES = ['01', '02', '03'];

// Hilfsfunktion zum Pausieren
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  console.log('\n🚀 Starte X32 Hardware-Test in 2 Sekunden...');
  await sleep(2000);

  for (const bus of BUSES) {
    console.log(`\n====================================`);
    console.log(`📡 TESTE BUS ${bus} (Instruktor ${parseInt(bus)})`);
    console.log(`====================================`);
    
    for (const ch of CHANNELS) {
      const address = `${ch}/mix/${bus}/level`;
      
      console.log(`➡️ ${address} -> 100%`);
      oscClient.setFader(address, 100);
      
      await sleep(300); // Fader 300ms oben halten
      
      oscClient.setFader(address, 0);
      await sleep(100); // 100ms Pause bis zum nächsten Kanal
    }
  }
  
  console.log('\n✅ Test-Routine erfolgreich beendet!');
  console.log('Du kannst das Skript jetzt mit Strg+C abbrechen.');
  process.exit(0);
}

// Wir geben dem UDP-Port 500ms Zeit, sich zu öffnen, bevor der Test startet
setTimeout(runTest, 500);