import { test, expect } from '@playwright/test';
test('field loads, pauses, steps, attacks, resets without errors or missing resources',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('/?scene=character-lab');await expect(page.locator('canvas')).toBeVisible();
 await page.getByRole('button',{name:'더미 투입'}).click();await expect(page.locator('#status')).toContainText('HP 100');
 await page.locator('#auto').check();await expect(page.locator('#status')).not.toContainText('타격 0',{timeout:12000});
 await page.getByRole('button',{name:'일시정지',exact:true}).click();const before=await page.locator('#status').textContent();await page.waitForTimeout(250);expect(await page.locator('#status').textContent()).toBe(before);
 await page.getByRole('button',{name:'한 프레임 진행'}).click();await expect(page.locator('#status')).not.toHaveText(before!);
 await page.getByRole('button',{name:'전체 초기화'}).click();await expect(page.locator('#status')).toContainText('x 240.0');await expect(page.locator('#auto')).not.toBeChecked();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/lab-${test.info().project.name}.png`,fullPage:true});expect(errors).toEqual([]);
});
test('movement stops on pointer release, leave, cancellation and focus loss',async({page})=>{
 await page.goto('/?scene=character-lab');await expect(page.locator('canvas')).toBeVisible();
 for(const end of ['pointerup','pointercancel','pointerleave','lostpointercapture','blur']){
  await page.getByRole('button',{name:'전체 초기화'}).click();const b=page.locator('[data-walk="1"]');
  await b.dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch',buttons:1});await page.waitForTimeout(150);
  if(end==='blur')await page.evaluate(()=>window.dispatchEvent(new Event('blur')));else await b.dispatchEvent(end,{pointerId:1,pointerType:'touch'});
  await expect(page.locator('#status')).toContainText('대기');const x=(await page.locator('#status').textContent())!.match(/x ([\d.]+)/)![1];await page.waitForTimeout(150);expect((await page.locator('#status').textContent())!).toContain(`x ${x}`);
 }
});
test('keyboard movement and attack, manual actions, speed and debug controls', async({page})=>{
 await page.goto('/?scene=character-lab');await expect(page.locator('canvas')).toBeVisible();
 await page.keyboard.down('d');await page.waitForTimeout(200);await page.keyboard.up('d');await expect(page.locator('#status')).toContainText('대기');expect(await page.locator('#status').textContent()).not.toContain('x 240.0');
 await page.keyboard.press('Space');await expect(page.locator('#status')).toContainText('slash');
 await page.getByRole('button',{name:'일시정지',exact:true}).click();await page.getByRole('button',{name:'전체 초기화'}).click();
 await page.getByRole('button',{name:'일시정지',exact:true}).click();
 for(const action of ['thrust','dash','dashSlash','stagger','knockback']) {
  await page.getByRole('button',{name:'전체 초기화'}).click();await page.getByRole('button',{name:'일시정지',exact:true}).click();
  await page.locator(`[data-action="${action}"]`).click();await expect(page.locator('#status')).toContainText(`(${action})`);
 }
 await page.locator('#speed').selectOption('0.25');await expect(page.locator('#speed')).toHaveValue('0.25');await page.locator('#debug').uncheck();await expect(page.locator('#debug')).not.toBeChecked();
 await page.getByRole('button',{name:'더미 투입'}).click();await page.getByRole('button',{name:'더미 제거'}).click();await expect(page.locator('#status')).toContainText('HP —');
});
