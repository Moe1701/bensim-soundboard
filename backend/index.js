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
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// 3. Fallback für React Router (Express 5.0 kompatibel)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 4. OSC-Client initialisieren
const oscClient = initOscClient();

// 5. WebSocket-Server an den HTTP-Server binden
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Neu: Tablet (oder Host) hat sich verbunden.');
  setupWebSocket(ws, oscClient);
});

// 6. Server starten
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Web- und WebSocket-Server laufen synchron auf Port ${PORT}.`);
  console.log(`🖥️  Lokal am PC testen: http://localhost:${PORT}`);
  console.log(`📱 Tablets im WLAN: http://<DEINE-PC-IP>:${PORT}`);
});