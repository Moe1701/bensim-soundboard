import { useState, useEffect, useRef, useCallback } from 'react';
import type { InstructorRole } from '../types/audio';

export function useOscConnection(role: InstructorRole | null) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // DER FIX: Wenn noch keine Rolle ausgewählt wurde, brich hier sofort ab!
    // Dadurch entsteht kein "Geist" mehr im Backend.
    if (!role) {
      return;
    }

    // Dynamische Host-Erkennung (Tablet verbindet sich mit der IP, die es im Browser aufgerufen hat)
    const wsUrl = `ws://${window.location.hostname}:8080`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Sobald die Verbindung steht, melden wir uns beim Backend mit der Rolle an
      ws.send(JSON.stringify({ type: 'REGISTER_ROLE', role }));
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    // Cleanup: Wenn der Instruktor das Tablet sperrt oder die App schließt, trenne sauber.
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [role]);

  const sendAudioUpdate = useCallback((update: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Wir packen den Payload ein und senden ihn als AUDIO_UPDATE an den socketHandler.js
      wsRef.current.send(JSON.stringify({ type: 'AUDIO_UPDATE', ...update }));
    }
  }, []);

  return { isConnected, sendAudioUpdate };
}