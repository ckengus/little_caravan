import { Lab } from '../domain/lab';
export function bindMovement(lab: Lab) {
  const held = new Map<string, -1 | 1>();
  const sync = () => lab.walk([...held.values()].at(-1) ?? 0);
  const clear = () => { held.clear(); sync(); };
  document.querySelectorAll<HTMLButtonElement>('[data-walk]').forEach(button => {
    button.addEventListener('pointerdown', e => { e.preventDefault(); button.setPointerCapture(e.pointerId); held.set(`p${e.pointerId}`, Number(button.dataset.walk) as -1 | 1); sync(); });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave']) button.addEventListener(type, (event) => { held.delete(`p${(event as PointerEvent).pointerId}`); sync(); });
  });
  window.addEventListener('keydown', e => {
    if ((e.target as HTMLElement).matches('input, select, textarea')) return;
    const dir = ['a', 'ArrowLeft'].includes(e.key) ? -1 : ['d', 'ArrowRight'].includes(e.key) ? 1 : 0;
    if (dir) { e.preventDefault(); held.set(e.code, dir); sync(); }
    if (e.code === 'Space' && !(e.target as HTMLElement).matches('button')) { e.preventDefault(); lab.act('slash'); }
  });
  window.addEventListener('keyup', e => { held.delete(e.code); sync(); });
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  return clear;
}
