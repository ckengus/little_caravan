import { describe, it, expect } from 'vitest';
import { Lab } from '../src/domain/lab';
import { actorView } from '../src/game/actorView';
describe('two-pose presentation sampled from game time',()=>{
 it('synchronizes attack pose and trail with one damage event, then restores identical idle',()=>{
  const m=new Lab();m.spawn();m.dummy!.x=320;const idle=actorView(m);
  m.act('slash');expect(actorView(m).phase).toBe('anticipation');m.advance(.199);expect(actorView(m).image).toBe('idle');expect(m.hits).toBe(0);
  m.advance(.001);expect(actorView(m)).toMatchObject({phase:'impact',image:'attack',trail:true,offsetX:10});expect(m.hits).toBe(1);expect(m.dummy!.flash).toBe(.2);
  m.advance(.1);expect(actorView(m)).toMatchObject({phase:'recover',image:'idle',trail:false,offsetX:0});m.advance(.3);expect(actorView(m)).toEqual(idle);
 });
 it('mirrors visual offset and cleans up on CC, reset and consecutive attacks',()=>{
  const m=new Lab();m.facing=-1;m.act('slash');m.advance(.2);expect(actorView(m).offsetX).toBe(-10);m.act('stagger');expect(actorView(m)).toMatchObject({image:'idle',offsetX:-0,trail:false});m.advance(.3);expect(actorView(m).rotation).toBe(-0);
  m.act('slash');m.advance(.2);m.reset();expect(actorView(m)).toMatchObject({image:'idle',offsetX:0,rotation:0,trail:false});m.act('slash');expect(actorView(m).phase).toBe('anticipation');
 });
 it('freezes all effects when paused, including offset and trail; steps at slow speed',()=>{
  const m=new Lab();m.act('slash');m.paused=true;m.speed=.25;m.step();m.step();const impact=actorView(m);m.tick(.1);expect(actorView(m)).toEqual(impact);expect(impact.trail).toBe(true);m.step();expect(actorView(m).trail).toBe(false);
 });
 it('never moves the world position for slash, preserves real dash and knockback movement',()=>{
  const m=new Lab();m.act('slash');m.advance(.6);expect(m.x).toBe(240);m.act('dashSlash');m.advance(.6);const destination=m.x;expect(destination).toBeGreaterThan(240);expect(actorView(m).offsetX).toBe(0);m.act('knockback');m.advance(1.1);expect(m.x).toBeLessThan(destination);expect(actorView(m).rotation).toBe(0);
 });
});
