// Speichert alle aktiven Verbindungen (welches Tablet hat welche Rolle)
const connectedClients = new Map(); 

function setupWebSocket(ws, oscClient) {
  // 1. Wenn das Tablet eine Nachricht sendet
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // a) Das Tablet teilt uns beim Start mit, welche Rolle gewählt wurde
      if (data.type === 'REGISTER_ROLE') {
        connectedClients.set(ws, data.role);
        console.log(`✅ Registriert: ${data.role}. Aktive Tablets: ${connectedClients.size}`);
        updateRoutingLogic();
        return;
      }

      // b) Das Tablet schickt eine Änderung (Fader bewegt, Mute gedrückt)
      if (data.type === 'AUDIO_UPDATE') {
        const role = connectedClients.get(ws);
        if (!role) return; // Ignorieren, falls das Tablet noch keine Rolle hat

        console.log(`[${role}] sendet Audio-Update:`, data.payload);
        
        // HIER verbinden wir im nächsten Schritt die Daten mit dem oscClient!
        // z.B. oscClient.setMute('/ch/01/mix/on', data.payload.isMuted);
      }

    } catch (error) {
      console.error('⚠️ Fehler beim Verarbeiten der WebSocket-Nachricht:', error);
    }
  });

  // 2. Wenn das Tablet die Verbindung verliert (z.B. WLAN weg oder Browser geschlossen)
  ws.on('close', () => {
    const role = connectedClients.get(ws);
    if (role) {
      connectedClients.delete(ws);
      console.log(`❌ Verbindung getrennt: ${role}`);
      updateRoutingLogic();
    }
  });
}

// Berechnet, wer welchen X32-Mixbus steuert (gemäß Architektur-Tagebuch Eintrag 2)
function updateRoutingLogic() {
  const activeRoles = Array.from(connectedClients.values());
  console.log('🔄 Dynamisches Routing wird neu berechnet. Aktive Rollen:', activeRoles);
  
  // Die konkrete Zuweisung (1->1,2,3 etc.) implementieren wir, 
  // sobald das Frontend erste echte Daten sendet!
}

module.exports = { setupWebSocket };