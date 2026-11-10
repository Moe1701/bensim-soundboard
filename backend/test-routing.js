const { initOscClient } = require('./src/osc/x32Client');

const oscClient = initOscClient();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  console.log('\n🚀 Starte X32 Hardware-Test (Alle 3 Zonen) in 2 Sekunden...');
  await sleep(2000);

  // --- ZONE A: In-Ears (Sends) ---
  console.log(`\n=== ZONE A: MONITORING MIX (IN-EAR SENDS) ===`);
  const IN_EAR_BUSES = ['01', '02', '03'];
  const TEST_CHANNELS = ['/ch/01', '/ch/09']; // Teste exemplarisch TN 1 und Raum L

  for (const bus of IN_EAR_BUSES) {
    for (const ch of TEST_CHANNELS) {
      const address = `${ch}/mix/${bus}/level`;
      console.log(`➡️ In-Ear Bus ${bus} <- ${ch} auf 100%`);
      oscClient.setFader(address, 100);
      await sleep(300);
      oscClient.setFader(address, 0);
      await sleep(100);
    }
  }

  // --- ZONE B: Master Outputs (Fader) ---
  console.log(`\n=== ZONE B: RAUM-AUSGABE (MASTER FADER) ===`);
  const MASTER_FADERS = [
    { name: 'Patient 1', address: '/bus/11/mix/fader' },
    { name: 'Patient 2', address: '/bus/12/mix/fader' },
    { name: 'Voice of God', address: '/bus/13/mix/fader' },
    { name: 'Soundboard (Main LR)', address: '/main/st/mix/fader' }
  ];

  for (const master of MASTER_FADERS) {
    console.log(`➡️ Master Fader: ${master.name} auf 100%`);
    oscClient.setFader(master.address, 100);
    await sleep(400);
    oscClient.setFader(master.address, 0);
    await sleep(100);
  }

  // --- ZONE C: Talkback Matrix (Mute an/aus) ---
  console.log(`\n=== ZONE C: TALKBACK MATRIX (MUTE) ===`);
  const TALKBACK_ROUTES = [
    { name: 'Instruktor 1 -> Voice of God', address: '/ch/14/mix/13/on' },
    { name: 'Instruktor 2 -> Raum-Intercom', address: '/ch/15/mix/14/on' }
  ];

  for (const route of TALKBACK_ROUTES) {
    console.log(`🎙️ Talkback: ${route.name} (UNMUTE / AKTIV)`);
    oscClient.setMute(route.address, false); // false = Ton an
    await sleep(600);
    console.log(`🔇 Talkback: ${route.name} (MUTE / INAKTIV)`);
    oscClient.setMute(route.address, true);  // true = Ton aus
    await sleep(200);
  }

  console.log('\n✅ Test-Routine aller 3 Zonen erfolgreich beendet!');
  process.exit(0);
}

// Wir geben dem UDP-Port 500ms Zeit, sich zu öffnen
setTimeout(runTest, 500);