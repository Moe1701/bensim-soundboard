// Speichert alle aktiven Verbindungen (welches Tablet hat welche Rolle)
const connectedClients = new Map(); 

// --- X32 ROUTING MAPS ---

// Welcher Instruktor hört auf welchem Bus?
const ROLE_TO_BUS = {
  'instructor-1': '01', // Bus 1
  'instructor-2': '02', // Bus 2
  'instructor-3': '03'  // Bus 3
};

// Welche UI-ID gehört zu welchem physischen Input am Mischpult?
const CHANNEL_MAP = {
  'tn1': '/ch/01',
  'tn2': '/ch/02',
  'tn3': '/ch/03',
  'tn4': '/ch/04',
  'tn5': '/ch/05',
  'tn6': '/ch/06',
  'tn7': '/ch/07',
  'tn8': '/ch/08',
  'raumL': '/ch/09',
  'raumR': '/ch/10',
  'aux1': '/auxin/01' // Hier steckt dein Soundboard
};

function setupWebSocket(ws, oscClient) {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // a) Registrierung
      if (data.type === 'REGISTER_ROLE') {
        connectedClients.set(ws, data.role);
        console.log(`✅ Registriert: ${data.role}. Aktive Tablets: ${connectedClients.size}`);
        return;
      }

      // b) Audio-Update
      if (data.type === 'AUDIO_UPDATE') {
        const role = connectedClients.get(ws);
        if (!role) return; 

        const { target, id, property, value, route, active } = data.payload;
        
        // Finde heraus, welchen Mixbus dieser Instruktor steuern darf
        const targetBus = ROLE_TO_BUS[role];
        
        if (!targetBus) {
          console.warn(`⚠️ Keine Bus-Zuweisung für Rolle gefunden: ${role}`);
          return;
        }

        // -- X32 OSC MAPPING --
        
        if (target === 'channel') {
          const basePath = CHANNEL_MAP[id];
          if (!basePath) return;

          // Wir bauen die dynamische X32 Adresse, z.B.: /ch/01/mix/01/level
          if (property === 'mute') {
            oscClient.setMute(`${basePath}/mix/${targetBus}/on`, value);
          } else if (property === 'volume') {
            oscClient.setFader(`${basePath}/mix/${targetBus}/level`, value);
          }
        }

        if (target === 'talkback') {
          // Talkback heben wir uns für den Feinschliff auf!
          console.log(`🎙️ Talkback Routing [${route}] -> ${active ? 'AN' : 'AUS'}`);
        }
      }

    } catch (error) {
      console.error('⚠️ Fehler beim Verarbeiten der WebSocket-Nachricht:', error);
    }
  });

  // Verbindungsabbruch
  ws.on('close', () => {
    const role = connectedClients.get(ws);
    if (role) {
      connectedClients.delete(ws);
      console.log(`❌ Verbindung getrennt: ${role}`);
    }
  });
}

module.exports = { setupWebSocket };