import { actions, FRAME } from '../data/actions';
import { hero } from '../data/hero';
import type { Lab } from '../domain/lab';
export type Phase = keyof typeof hero.phases;
// A pure sample of game time: no timers, retained tweens or renderer damage events.
export function actorView(lab: Lab) {
  let phase: Phase = 'idle';
  const action = actions[lab.state];
  if ('hit' in action) {
    const hitTime = action.hit * FRAME;
    phase = lab.elapsed + 1e-8 < hitTime ? 'anticipation'
      : lab.elapsed + 1e-8 < hitTime + hero.impactDuration ? 'impact' : 'recover';
  }
  const pose = hero.phases[phase];
  const down = lab.state === 'fallen' || lab.state === 'knockback';
  return {
    phase, image: pose.image,
    offsetX: pose.offsetX * lab.facing,
    rotation: down ? -lab.facing * 1.1 : lab.state === 'stagger' ? -lab.facing * 0.12 : pose.rotation * lab.facing,
    trail: phase === 'impact', facing: lab.facing,
    // Non-slash movements still use a temporary idle pose.
    temporary: !['idle','slash','dashSlash'].includes(lab.state),
  };
}
