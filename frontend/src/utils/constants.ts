import type { InstructorRole } from '../types/audio';

export const ROLES: { id: InstructorRole; label: string }[] = [
  { id: 'instructor-1', label: 'Instruktor 1' },
  { id: 'instructor-2', label: 'Instruktor 2' },
  { id: 'instructor-3', label: 'Instruktor 3' },
];

// Die initiale IP des Linux-Backend-Rechners im Regie-Rack.
// (Im Entwicklungsmodus nutzen wir vorerst localhost)
export const WS_URL = 'ws://localhost:8080';

// Eine Vorlage für einen komplett zurückgesetzten (leeren) Talkback-Status
export const DEFAULT_TALKBACK_ROUTING = {
  vog: false,
  raum: false,
  tn1: false,
  tn2: false,
  tn3: false,
  tn4: false,
  tn5: false,
  tn6: false,
  tn7: false,
  tn8: false,
};