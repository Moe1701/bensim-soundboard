const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { setupWebSocket } = require('./src/websocket/socketHandler');
const { initOscClient } = require('./src/osc/x32Client');

const PORT = 8080;

console.log('====================================');
console.log('🎙️ BenSim Soundboard Backend startet');
console.log('====================================');

// 1. Express & HTTP-Server aufsetzen
const app = express();
const server = http.createServer(app);

// 2. Den "dist"-Ordner des Frontends freigeben
// (Dorthin wird Vite unser React-Projekt bauen)
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Falls eine Route nicht gefunden wird, immer die index.html laden (React-Standard)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 3. OSC-Client initialisieren
const oscClient = initOscClient();

// 4. WebSocket-Server an den HTTP-Server binden
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Neu: Tablet hat sich verbunden.');
  setupWebSocket(ws, oscClient);
});

// 5. Server auf allen Netzwerk-Schnittstellen (0.0.0.0) starten
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Web- und WebSocket-Server laufen synchron.`);
  console.log(`📱 Tablets im WLAN erreichen die App unter: http://<IP-DEINES-RECHNERS>:${PORT}`);
});