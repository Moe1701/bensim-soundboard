// Die drei festen Rollen im Simulationszentrum
export type InstructorRole = 'instructor-1' | 'instructor-2' | 'instructor-3';

// Der Zustand eines einzelnen Kanals (z.B. TN 1 oder Raum)
export interface ChannelState {
  id: string;      // z.B. 'tn1'
  label: string;   // z.B. 'TN 1'
  volume: number;  // 0 bis 100
  isMuted: boolean;
  isSolo: boolean;
}

// Die Talkback-Ziele (Push-to-Talk)
export interface TalkbackRouting {
  vog: boolean;    // Voice of God (Decke)
  raum: boolean;   // Raumklang-Lautsprecher
  tn1: boolean;
  tn2: boolean;
  tn3: boolean;
  tn4: boolean;
  tn5: boolean;
  tn6: boolean;
  tn7: boolean;
  tn8: boolean;
}

// Das Gesamtpaket, das später über WebSockets synchronisiert wird
export interface AudioState {
  channels: ChannelState[];
  talkback: TalkbackRouting;
}