const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const qrcode = require('qrcode-terminal'); // NEU: QR Code Generator
const { setupWebSocket } = require('./src/websocket/socketHandler');
const { initOscClient } = require('./src/osc/x32Client');

const PORT = 8080;

// Hilfsfunktion: Findet die WLAN/LAN IP-Adresse deines PCs
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const tabletUrl = `http://${localIp}:${PORT}`;

console.log('====================================');
console.log('🎙️ BenSim Soundboard Backend startet');
console.log('====================================');

const app = express();
const server = http.createServer(app);
// --- NEU: API FÜR FRONTEND CONFIG ---
app.get('/api/config', (req, res) => {
  res.json({ ip: localIp, port: PORT });
});

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const oscClient = initOscClient();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Neu: Tablet (oder Host) hat sich verbunden.');
  setupWebSocket(ws, oscClient);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server laufen synchron auf Port ${PORT}.`);
  console.log(`🖥️  Host-PC: http://localhost:${PORT}`);
  console.log(`📱 Tablets: ${tabletUrl}`);
  
  // NEU: QR-Code im Terminal ausgeben
  console.log('\n--- SCAN MICH FÜR TABLET-ZUGANG ---');
  qrcode.generate(tabletUrl, { small: true });
  console.log('====================================\n');
});