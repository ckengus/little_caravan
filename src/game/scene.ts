import Phaser from 'phaser';
import { Lab } from '../domain/lab';
import { RULES } from '../data/actions';
export class LabScene extends Phaser.Scene {
  private pen!: Phaser.GameObjects.Graphics;
  constructor(private lab: Lab, private notify: () => void, private debug: () => boolean) { super('character-lab'); }
  create() { this.pen = this.add.graphics(); }
  update(_time: number, delta: number) {
    this.lab.tick(delta / 1000); this.draw(); this.notify();
  }
  private draw() {
    const g = this.pen, m = this.lab, ground = 330;
    g.clear(); g.fillStyle(0x203e3c); g.fillRect(0, 0, 960, 420);
    g.fillStyle(0x2c4c44); g.fillRect(0, ground, 960, 90);
    g.lineStyle(1, 0x759081); g.lineBetween(0, ground, 960, ground);
    for (let x = 0; x < 960; x += 48) { g.lineStyle(1, 0x385650); g.lineBetween(x, 350, x + 20, 350); }
    const d = m.dummy;
    if (d) {
      g.fillStyle(d.flash ? 0xffe5bd : d.hp ? 0xb58f66 : 0x61564c);
      g.fillRoundedRect(d.x - 24, ground - 87, 48, 74, 12);
      g.fillStyle(0x443c35); g.fillRect(d.x - 4, ground - 20, 8, 20);
      g.fillStyle(0x122c2b); g.fillRect(d.x - 35, ground - 105, 70, 7);
      g.fillStyle(0xefb879); g.fillRect(d.x - 35, ground - 105, 70 * d.hp / RULES.dummyHp, 7);
    }
    const f = m.facing, x = m.x;
    const down = m.state === 'fallen' || m.state === 'knockback';
    const y = ground - (down ? 22 : 64);
    const stride = m.state === 'walk' ? Math.sin(m.elapsed * Math.PI * 5) * 10 : 0;
    g.lineStyle(13, 0x332c2a); g.lineBetween(x - 10, y + 16, x - 15 + stride, ground - 5); g.lineBetween(x + 10, y + 16, x + 15 - stride, ground - 5);
    g.fillStyle(0x9d704c); g.fillRoundedRect(x - 20, y - 23, 40, 50, 10);
    g.fillStyle(0xf1c492); g.fillCircle(x, y - 43, 21);
    g.fillStyle(0x5e3f2d); g.fillRoundedRect(x - 23, y - 66, 44, 19, 8);
    g.fillStyle(0x54b4ad); g.fillTriangle(x - 23, y - 26, x + 20, y - 26, x - 34 * f, y - 6);
    const attack = ['slash', 'dashSlash'].includes(m.state);
    const angles = [-1.1, -1.9, 0.4, 0.9, 0.2, -1.1];
    const angle = attack ? angles[m.frame] : m.state === 'thrust' ? 0 : -1.1;
    const handX = x + f * (m.state === 'thrust' && m.frame === 2 ? 46 : 24), handY = y - 6;
    const tipX = handX + f * Math.cos(angle) * 68, tipY = handY + Math.sin(angle) * 68;
    g.lineStyle(10, 0x332c2a); g.lineBetween(x - f * 12, y - 9, handX, handY); g.lineBetween(x + f * 8, y - 17, handX + f * 7, handY - 3);
    g.lineStyle(8, 0xd8e7e0); g.lineBetween(handX, handY, tipX, tipY);
    g.lineStyle(5, 0xe0ae57); g.lineBetween(handX - 6, handY - 8, handX + 6, handY + 8);
    g.fillStyle(0xf1c492); g.fillCircle(handX, handY, 5);
    if (this.debug()) {
      g.lineStyle(1, 0xf0c477, 0.8); g.strokeRect(f > 0 ? x : x - RULES.range, ground - 110, RULES.range, 110);
      g.lineStyle(2, 0x76f3e0); g.lineBetween(x - 8, ground, x + 8, ground); g.lineBetween(x, ground - 8, x, ground + 8);
      g.strokeCircle(handX, handY, 8); g.lineBetween(handX, handY, tipX, tipY);
    }
  }
}
