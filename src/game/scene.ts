import Phaser from 'phaser';
import { Lab } from '../domain/lab';
import { RULES } from '../data/actions';
import { hero } from '../data/hero';
import { actorView } from './actorView';
export class LabScene extends Phaser.Scene {
  private pen!: Phaser.GameObjects.Graphics;
  private actor!: Phaser.GameObjects.Image;
  private effects!: Phaser.GameObjects.Graphics;
  constructor(private lab: Lab, private notify: () => void, private debug: () => boolean) { super('character-lab'); }
  preload() {
    this.load.svg('hero-idle', hero.images.idle);
    this.load.svg('hero-attack', hero.images.attack);
  }
  create() {
    this.pen = this.add.graphics();
    this.actor = this.add.image(0, 0, 'hero-idle').setOrigin(hero.foot.x / hero.canvas.width, hero.foot.y / hero.canvas.height).setScale(hero.displayHeight / hero.canvas.height);
    this.effects = this.add.graphics();
  }
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
    const f = m.facing, x = m.x, view = actorView(m);
    this.actor.setTexture(`hero-${view.image}`).setPosition(x + view.offsetX, ground).setFlipX(f < 0).setRotation(view.rotation);
    const e = this.effects;
    e.clear();
    if (view.trail) {
      e.lineStyle(7, hero.trail.color, 0.85);
      e.beginPath();
      for (let i = 0; i <= 16; i++) {
        const angle = -1.1 + i / 16 * 2;
        const px = x + view.offsetX + f * Math.cos(angle) * hero.trail.radius;
        const py = ground - 68 + Math.sin(angle) * hero.trail.radius;
        if (i === 0) e.moveTo(px, py); else e.lineTo(px, py);
      }
      e.strokePath();
    }
    if (d && d.flash > 0) {
      e.lineStyle(3, 0xffefbd, d.flash / 0.2);
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        e.lineBetween(d.x + Math.cos(a) * 30, ground - 55 + Math.sin(a) * 30, d.x + Math.cos(a) * 43, ground - 55 + Math.sin(a) * 43);
      }
    }
    if (this.debug()) {
      e.lineStyle(1, 0xf0c477, 0.8); e.strokeRect(f > 0 ? x : x - RULES.range, ground - 110, RULES.range, 110);
      e.lineStyle(2, 0x76f3e0); e.lineBetween(x - 8, ground, x + 8, ground); e.lineBetween(x, ground - 8, x, ground + 8);
    }
    const canvas = this.game.canvas;
    canvas.dataset.phase = view.phase;
    canvas.dataset.pose = view.image;
    canvas.dataset.visualOffset = String(view.offsetX);
    canvas.dataset.rotation = String(view.rotation);
    canvas.dataset.facing = String(view.facing);
    canvas.dataset.trail = String(view.trail);
  }
}
