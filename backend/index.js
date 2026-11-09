const WebSocket = require('ws');
const { setupWebSocket } = require('./src/websocket/socketHandler');
const { initOscClient } = require('./src/osc/x32Client');

const WS_PORT = 8080;

console.log('====================================');
console.log('🎙️ BenSim Soundboard Backend startet');
console.log('====================================');

// 1. OSC-Verbindung zum Behringer X32 aufbauen
const oscClient = initOscClient();

// 2. WebSocket-Server für die 3 Instruktor-Tablets starten
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('Neu: Tablet hat sich verbunden.');
  // Delegiert die gesamte Logik für dieses Tablet an unseren Handler
  setupWebSocket(ws, oscClient);
});

console.log(`✅ WebSocket-Server lauscht auf ws://localhost:${WS_PORT}`);
console.log('Warte auf Verbindungen...\n');