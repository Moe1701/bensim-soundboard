import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_URL } from '../utils/constants';
import type { InstructorRole } from '../types/audio';

export function useOscConnection(role: InstructorRole) {
  const [isConnected, setIsConnected] = useState(false);
  // useRef speichert die WebSocket-Instanz, ohne Re-Renders auszulösen
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Verbindung aufbauen
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('✅ Mit Backend verbunden!');
      
      // 2. Sofort beim Backend anmelden und die Tablet-Rolle mitteilen
      ws.send(JSON.stringify({
        type: 'REGISTER_ROLE',
        role: role
      }));
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('❌ Verbindung zum Backend getrennt.');
    };

    ws.onerror = (error) => {
      console.error('⚠️ WebSocket Fehler:', error);
    };

    // 3. Aufräumen, wenn die App geschlossen wird
    return () => {
      ws.close();
    };
  }, [role]); // Der Hook reagiert, falls sich die Rolle jemals ändert

  // 4. Hilfsfunktion, um später Button-Klicks (Mute/Fader) ans Backend zu senden
  const sendAudioUpdate = useCallback((payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'AUDIO_UPDATE',
        payload
      }));
    }
  }, []);

  return {
    isConnected,
    sendAudioUpdate
  };
}