const osc = require('osc');

// ACHTUNG: Die IP-Adresse deines echten X32 Mischpults im Simulationszentrum.
// Für die Offline-Entwicklung ist das gerade ein Dummy-Wert.
const X32_IP = '192.168.1.100'; 
const X32_PORT = 10024; // Standard-Port für X32 OSC

let udpPort;

function initOscClient() {
  udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0", // Lauscht auf allen lokalen Netzwerk-Adaptern
    localPort: 53000,        // Freier Port auf unserem Linux-Backend
    remoteAddress: X32_IP,
    remotePort: X32_PORT,
    metadata: true
  });

  udpPort.on("error", (err) => {
    console.error("⚠️ OSC Fehler:", err.message);
  });

  udpPort.on("ready", () => {
    console.log(`🎛️  OSC Client bereit. Verbunden mit X32 auf ${X32_IP}:${X32_PORT}`);
  });

  // UDP-Port öffnen
  udpPort.open();

  // Wir geben ein Objekt mit Hilfsfunktionen zurück, 
  // die der WebSocket-Handler später einfach aufrufen kann.
  return {
    // Schaltet einen Kanal stumm oder an
    setMute: (channelAddress, isMuted) => {
      // X32 Logik: 0 = Mute (Ton aus), 1 = On (Ton an)
      const value = isMuted ? 0 : 1; 
      
      udpPort.send({
        address: channelAddress, // z.B. /ch/01/mix/on
        args: [
          { type: "i", value: value }
        ]
      });
      console.log(`OSC -> ${channelAddress} = ${value} (Int)`);
    },

    // Setzt die Fader-Lautstärke
    setFader: (channelAddress, levelPercent) => {
      // Das Tablet sendet 0-100%, das X32 erwartet Float von 0.0 bis 1.0
      const oscLevel = levelPercent / 100;
      
      udpPort.send({
        address: channelAddress,
        args: [
          { type: "f", value: oscLevel }
        ]
      });
      // console.log-Spam deaktiviert für flüssigere Terminal-Ausgabe
      // console.log(`OSC -> ${channelAddress} = ${oscLevel} (Float)`);
    }
  };
}

module.exports = { initOscClient };