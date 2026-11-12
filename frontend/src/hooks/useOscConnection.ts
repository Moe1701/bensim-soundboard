import { useState, useEffect, useRef, useCallback } from 'react';
import type { InstructorRole } from '../types/audio';

export function useOscConnection(role: InstructorRole | null) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!role) {
      return;
    }

    const wsUrl = `ws://${window.location.hostname}:8080`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'REGISTER_ROLE', role }));
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [role]);

  const sendAudioUpdate = useCallback((update: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'AUDIO_UPDATE', ...update }));
    }
  }, []);

  const claimVideoMaster = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'CLAIM_VIDEO_MASTER', role }));
    }
  }, [role]);

  return { isConnected, sendAudioUpdate, claimVideoMaster };
}
