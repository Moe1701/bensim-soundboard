// Speichert alle aktiven Verbindungen (welches Tablet hat welche Rolle)
const connectedClients = new Map(); 
let currentVideoMaster = null; // Speichert, welche Rolle gerade den Video-Mix diktiert

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

// --- NEU: MASTER OUTPUT MAP (ZONE B) ---
const MASTER_MAP = {
  'out_pat1': '/bus/11',   // In-Ear Schauspieler 1
  'out_pat2': '/bus/12',   // In-Ear Schauspieler 2
  'out_vog': '/bus/13',    // Voice of God Deckenlautsprecher
  'out_sound': '/main/st'  // Soundboard (Aux In) geht direkt auf den L/R Main Mix (Raum)
};

// --- TALKBACK MAPS (ZONE C) ---
const INSTRUCTOR_MICS = {
  'instructor-1': '/ch/14',
  'instructor-2': '/ch/15',
  'instructor-3': '/ch/16'
};

const TALKBACK_DESTINATIONS = {
  'vog': '13',   // Mixbus 13 (Voice of God)
  'room': '14',  // Mixbus 14 (Raumklang)
  'pat1': '11',  // Mixbus 11 (In-Ear Patient 1)
  'pat2': '12',  // Mixbus 12 (In-Ear Patient 2)
  'tn': '15'     // Mixbus 15 (Alle TN - falls in Zukunft genutzt)
};

function setupWebSocket(ws, oscClient, wss) {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'REGISTER_ROLE') {
        connectedClients.set(ws, data.role);
        console.log(`✅ Registriert: ${data.role}. Aktive Tablets: ${connectedClients.size}`);
        return;
      }
      
      if (data.type === 'CLAIM_VIDEO_MASTER') {
        currentVideoMaster = data.role;
        console.log(`🎥 Video-Regie übernommen durch: ${data.role}`);
        // Informiere alle Tablets, wer gerade Video-Master ist
        wss.clients.forEach(client => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify({ type: 'VIDEO_MASTER_UPDATE', masterRole: currentVideoMaster }));
          }
        });
        return;
      }

      if (data.type === 'AUDIO_UPDATE') {
        const role = connectedClients.get(ws);
        if (!role) return; 

        const { target, id, property, value, route, active } = data.payload;
        
        // -- ZONE A (MASTER): Gesamtlautstärke des In-Ear Busses --
        if (target === 'inear_master') {
          const targetBus = ROLE_TO_BUS[role];
          if (!targetBus) return;
          
          if (property === 'volume') {
            // Regelt den Bus-Masterfader (z.B. /bus/01/mix/fader)
            oscClient.setFader(`/bus/${targetBus}/mix/fader`, value);
          } else if (property === 'mute') {
            oscClient.setMute(`/bus/${targetBus}/mix/on`, value);
          }
        }

        // -- ZONE A (CHANNELS): MONITORING MIX --
        if (target === 'channel') {
          const targetBus = ROLE_TO_BUS[role];
          if (!targetBus) return;
          
          const basePath = CHANNEL_MAP[id];
          if (!basePath) return;

          if (property === 'mute') {
            // Mute im eigenen In-Ear Send
            oscClient.setMute(`${basePath}/mix/${targetBus}/on`, value);
            // Wenn Video-Master, auch im Main-Mix muten
            if (role === currentVideoMaster) {
              oscClient.setMute(`${basePath}/mix/on`, value);
            }
          } 
          else if (property === 'volume') {
            // Fader für eigenen In-Ear Send
            oscClient.setFader(`${basePath}/mix/${targetBus}/level`, value);
            // Wenn Video-Master, Fader-Bewegung auch auf den X32 Main-Fader spiegeln
            if (role === currentVideoMaster) {
              oscClient.setFader(`${basePath}/mix/fader`, value);
            }
          }
          else if (property === 'solo') {
            console.log(`🎧 Solo-Modus [${role}] für ${id} -> ${value ? 'AN' : 'AUS'}`);
            
            for (const [chanId, chanPath] of Object.entries(CHANNEL_MAP)) {
              if (chanId !== id) {
                oscClient.setMute(`${chanPath}/mix/${targetBus}/on`, value);
              } else if (value === true) {
                oscClient.setMute(`${chanPath}/mix/${targetBus}/on`, false);
              }
            }
          }
        }

        // -- ZONE B: MASTER OUTPUTS (RAUM & SCHAUSPIELER) --
        if (target === 'master') {
          const basePath = MASTER_MAP[id];
          if (!basePath) return;

          // Bei Bussen und Main LR heißt der Fader-Pfad '/mix/fader' (nicht '/mix/level' wie bei Sends)
          if (property === 'mute') {
            oscClient.setMute(`${basePath}/mix/on`, value);
            console.log(`🎚️ Master Mute -> ${id} = ${value ? 'STUMM' : 'AN'}`);
          } 
          else if (property === 'volume') {
            oscClient.setFader(`${basePath}/mix/fader`, value);
          }
        }

        // -- ZONE C: TALKBACK MATRIX (PTT) --
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
