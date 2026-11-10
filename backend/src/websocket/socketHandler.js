// Speichert alle aktiven Verbindungen (welches Tablet hat welche Rolle)
const connectedClients = new Map(); 

// --- X32 ROUTING MAPS ---
const ROLE_TO_BUS = {
  'instructor-1': '01', // Bus 1
  'instructor-2': '02', // Bus 2
  'instructor-3': '03'  // Bus 3
};

const CHANNEL_MAP = {
  'tn1': '/ch/01', 'tn2': '/ch/02', 'tn3': '/ch/03', 'tn4': '/ch/04',
  'tn5': '/ch/05', 'tn6': '/ch/06', 'tn7': '/ch/07', 'tn8': '/ch/08',
  'raumL': '/ch/09', 'raumR': '/ch/10', 'aux1': '/auxin/01'
};

// --- NEU: TALKBACK MAPS ---
const INSTRUCTOR_MICS = {
  'instructor-1': '/ch/14',
  'instructor-2': '/ch/15',
  'instructor-3': '/ch/16'
};

const TALKBACK_DESTINATIONS = {
  'vog': '13',   // Mixbus 13
  'room': '14',  // Mixbus 14
  'tn': '15'     // Mixbus 15
};

function setupWebSocket(ws, oscClient) {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'REGISTER_ROLE') {
        connectedClients.set(ws, data.role);
        console.log(`✅ Registriert: ${data.role}. Aktive Tablets: ${connectedClients.size}`);
        return;
      }

      if (data.type === 'AUDIO_UPDATE') {
        const role = connectedClients.get(ws);
        if (!role) return; 

        const { target, id, property, value, route, active } = data.payload;
        const targetBus = ROLE_TO_BUS[role];
        
        if (!targetBus) return;

        // -- X32 OSC MAPPING --
        if (target === 'channel') {
          const basePath = CHANNEL_MAP[id];
          if (!basePath) return;

          if (property === 'mute') {
            oscClient.setMute(`${basePath}/mix/${targetBus}/on`, value);
          } 
          else if (property === 'volume') {
            oscClient.setFader(`${basePath}/mix/${targetBus}/level`, value);
          }
          // NEU: Die Solo-Logik
          else if (property === 'solo') {
            console.log(`🎧 Solo-Modus [${role}] für ${id} -> ${value ? 'AN' : 'AUS'}`);
            
            // Wir gehen blitzschnell alle 11 Hardware-Kanäle durch
            for (const [chanId, chanPath] of Object.entries(CHANNEL_MAP)) {
              if (chanId !== id) {
                // Wenn Solo aktiviert wird (value=true) -> Alle anderen stummschalten (Mute=true)
                // Wenn Solo deaktiviert wird (value=false) -> Alle anderen wieder anmachen (Mute=false)
                oscClient.setMute(`${chanPath}/mix/${targetBus}/on`, value);
              } else if (value === true) {
                // Den Solo-Kanal selbst zur Sicherheit immer hörbar machen (Mute=false)
                oscClient.setMute(`${chanPath}/mix/${targetBus}/on`, false);
              }
            }
          }
        }

        if (target === 'talkback') {
          console.log(`🎙️ Talkback [${role}] -> Route: ${route}, Status: ${active ? 'AN' : 'AUS'}`);
          
          const micChannel = INSTRUCTOR_MICS[role];
          const destBus = TALKBACK_DESTINATIONS[route];

          if (micChannel && destBus) {
            oscClient.setMute(`${micChannel}/mix/${destBus}/on`, !active); 
          } else {
            console.warn(`⚠️ Talkback-Ziel '${route}' oder Mikrofon für '${role}' nicht in der Map definiert!`);
          }
        }
      }

    } catch (error) {
      console.error('⚠️ Fehler beim Verarbeiten der WebSocket-Nachricht:', error);
    }
  });

  ws.on('close', () => {
    const role = connectedClients.get(ws);
    if (role) {
      connectedClients.delete(ws);
      console.log(`❌ Verbindung getrennt: ${role}`);
    }
  });
}

module.exports = { setupWebSocket };