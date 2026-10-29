import idle from '../game/assets/hero-idle.svg?url';
import attack from '../game/assets/hero-attack.svg?url';
// Transparent, authored geometric placeholders; replace the entire pose, not hands/sockets.
export const hero = {
  id: 'hero-simple-draft', status: 'temporary-unapproved',
  equipment: { weaponId: 'training-sword', damage: 10 },
  appearance: { id: 'hero-simple-draft', fixedWeapon: true },
  canvas: { width: 256, height: 256 }, foot: { x: 128, y: 234 }, displayHeight: 160,
  images: { idle, attack },
  phases: {
    idle: { image: 'idle', offsetX: 0, rotation: 0 },
    anticipation: { image: 'idle', offsetX: -3, rotation: -0.025 },
    impact: { image: 'attack', offsetX: 10, rotation: 0 },
    recover: { image: 'idle', offsetX: 0, rotation: 0 },
  },
  impactDuration: 0.1, trail: { radius: 78, color: 0xffd18a },
} as const;
