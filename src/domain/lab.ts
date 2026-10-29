import { actions, FRAME, RULES, type Action } from '../data/actions';
export class Lab {
  x = 240; facing: -1 | 1 = 1; state: Action = 'idle'; elapsed = 0;
  time = 0; speed = 1; paused = false; auto = false; walking: -1 | 0 | 1 = 0;
  attackId = 0; hits = 0; private hitDone = false;
  dummy: { x: number; hp: number; flash: number } | null = null;
  get frame() { return Math.min(actions[this.state].frames - 1, Math.floor((this.elapsed + 1e-8) / FRAME)); }
  get busy() { return this.state !== 'idle' && this.state !== 'walk'; }
  reset() { Object.assign(this, new Lab()); }
  spawn() { this.dummy = { x: 720, hp: RULES.dummyHp, flash: 0 }; }
  remove() { this.dummy = null; }
  private enter(state: Action) { this.state = state; this.elapsed = 0; this.hitDone = false; if ('hit' in actions[state]) this.attackId++; }
  act(state: Action) {
    if (state === 'stagger' || state === 'knockback') {
      if (['knockback', 'fallen', 'getUp'].includes(this.state)) return;
      this.walking = 0; this.enter(state); return;
    }
    if (state === 'idle') { this.walking = 0; if (!this.busy) this.enter('idle'); return; }
    if (this.busy) return;
    this.enter(state);
  }
  walk(direction: -1 | 0 | 1) { this.walking = direction; if (!direction && this.state === 'walk') this.enter('idle'); }
  tick(realSeconds: number) { if (!this.paused) this.advance(Math.min(realSeconds, 0.1) * this.speed); }
  step() { if (this.paused) this.advance((Math.floor((this.elapsed + 1e-8) / FRAME) + 1) * FRAME - this.elapsed); }
  // Slice at every animation boundary so large deltas preserve hit and transition events.
  advance(seconds: number) {
    while (seconds > 1e-8) {
      if (!this.busy) {
        let direction = this.walking;
        if (this.auto && this.dummy && this.dummy.hp > 0) {
          const distance = this.dummy.x - this.x;
          this.facing = distance < 0 ? -1 : 1;
          if (Math.abs(distance) <= RULES.range) { direction = 0; this.enter('slash'); }
          else direction = this.facing;
        }
        if (!this.busy) {
          if (direction) this.facing = direction;
          const next = direction ? 'walk' : 'idle';
          if (next !== this.state) this.enter(next);
        }
      }
      const amount = Math.min(seconds, (Math.floor((this.elapsed + 1e-8) / FRAME) + 1) * FRAME - this.elapsed);
      if (this.state === 'walk') this.x += this.facing * RULES.speed * amount;
      if (this.state === 'dash' || this.state === 'dashSlash') this.x += this.facing * 280 * amount;
      if (this.state === 'knockback') this.x -= this.facing * 210 * amount;
      this.x = Math.max(RULES.minX, Math.min(RULES.maxX, this.x));
      this.elapsed += amount; this.time += amount; seconds -= amount;
      if (this.dummy) this.dummy.flash = Math.max(0, this.dummy.flash - amount);
      const definition = actions[this.state];
      if ('hit' in definition && !this.hitDone && this.elapsed + 1e-8 >= definition.hit * FRAME) {
        this.hitDone = true;
        const d = this.dummy;
        if (d && d.hp > 0 && Math.abs(d.x - this.x) <= RULES.range && (d.x - this.x) * this.facing >= 0) {
          d.hp = Math.max(0, d.hp - RULES.damage); d.flash = 0.2;
          d.x = Math.max(RULES.minX, Math.min(RULES.maxX, d.x + this.facing * 8)); this.hits++;
        }
      }
      if (this.elapsed + 1e-8 >= definition.frames * FRAME) {
        const next = this.state === 'knockback' ? 'fallen' : this.state === 'fallen' ? 'getUp' : 'idle';
        this.enter(next);
      }
    }
  }
}
