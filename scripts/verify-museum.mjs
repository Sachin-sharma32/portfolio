/**
 * One-off verification harness for the museum mode (not part of the build).
 * Flow under test: classic site is the default everywhere; the bottom-left
 * "Enter 3D mode" button drops the visitor straight into the first-person
 * walk (auto pointer lock); Esc pauses and the top-right "Classic site"
 * button must remain clickable above the pause overlay.
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = 'http://localhost:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--window-size=1600,950'],
  defaultViewport: { width: 1600, height: 950 },
});

const fail = (msg) => {
  console.error('FAIL:', msg);
  process.exitCode = 1;
};

try {
  /* ---------------- Desktop ---------------- */
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(() => window.__uiStore?.getState().loaderDone, { timeout: 15000 });
  await sleep(1200);

  // 1. Classic site boots by default, with the 3D invite in the bottom-left.
  const boot = await page.evaluate(() => {
    const invite = [...document.querySelectorAll('button')].find((b) =>
      b.textContent.toLowerCase().includes('enter 3d mode')
    );
    const r = invite?.getBoundingClientRect();
    return {
      mode: window.__uiStore.getState().mode,
      hero: Boolean(document.getElementById('home')),
      invite: Boolean(invite),
      invitePos: r ? { left: Math.round(r.left), bottom: Math.round(innerHeight - r.bottom) } : null,
    };
  });
  console.log('BOOT', JSON.stringify(boot));
  if (boot.mode !== 'classic' || !boot.hero || !boot.invite) fail('classic-by-default boot wrong');

  // 2. Enter 3D mode → should land directly in the walk (auto pointer lock).
  const invite = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find((b) =>
      b.textContent.toLowerCase().includes('enter 3d mode')
    )
  );
  await invite.asElement().click();
  await page.waitForFunction(() => window.__museumStore?.getState !== undefined, { timeout: 15000 });
  await sleep(2500); // museum chunk + fonts + auto-lock race
  const entered = await page.evaluate(() => ({
    mode: window.__uiStore.getState().mode,
    locked: window.__museumStore.getState().locked,
    pointerLockEl: Boolean(document.pointerLockElement),
    doorVisible: [...document.querySelectorAll('button')].some((b) =>
      b.textContent.toLowerCase().includes('click to enter')
    ),
  }));
  console.log('DIRECT_ENTER', JSON.stringify(entered));
  if (entered.mode !== 'museum') fail('invite did not switch mode');
  if (!entered.locked) fail('auto pointer lock did not engage — door screen fallback shown');
  await page.screenshot({ path: 'scripts/shot-direct.png' });

  // 3. Quick sanity: walking still works.
  const z0 = await page.evaluate(() => window.__three().camera.position.z);
  await page.keyboard.down('KeyW');
  await sleep(700);
  await page.keyboard.up('KeyW');
  const z1 = await page.evaluate(() => window.__three().camera.position.z);
  console.log('WALK z:', z0.toFixed(2), '→', z1.toFixed(2));
  if (!(z1 < z0 - 1)) fail('walking broke');

  // 4. Pause. (Headless can't synthesize the browser-level Esc that exits
  // pointer lock, so trigger the same exit programmatically.) The top-right
  // "Classic site" button must sit above the pause overlay.
  await page.evaluate(() => document.exitPointerLock());
  await sleep(900);
  const paused = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      b.textContent.toLowerCase().includes('classic site')
    );
    if (!btn) return { btn: false };
    const r = btn.getBoundingClientRect();
    const onTop = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return {
      btn: true,
      locked: window.__museumStore.getState().locked,
      clickable: btn === onTop || btn.contains(onTop),
      pausedShown: document.body.textContent.includes('PAUSED'),
    };
  });
  console.log('PAUSE', JSON.stringify(paused));
  if (!paused.btn || !paused.clickable) fail('classic-site button not clickable while paused');
  await page.screenshot({ path: 'scripts/shot-paused.png' });

  // 5. Click it → back on the classic site.
  const classicBtn = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find((b) =>
      b.textContent.toLowerCase().includes('classic site')
    )
  );
  await classicBtn.asElement().click();
  await sleep(1200);
  const back = await page.evaluate(() => ({
    mode: window.__uiStore.getState().mode,
    hero: Boolean(document.getElementById('home')),
  }));
  console.log('BACK_TO_CLASSIC', JSON.stringify(back));
  if (back.mode !== 'classic' || !back.hero) fail('exit to classic failed');

  console.log('DESKTOP_ERRORS', JSON.stringify(errors.slice(0, 5)));

  /* ---------------- Mobile: flat site, no 3D, no invite ---------------- */
  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobile.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await mobile.waitForFunction(() => window.__uiStore?.getState().loaderDone, { timeout: 15000 });
  await sleep(800);
  const mob = await mobile.evaluate(() => ({
    mode: window.__uiStore.getState().mode,
    canvas: Boolean(document.querySelector('canvas')),
    hero: Boolean(document.getElementById('home')),
    invite: [...document.querySelectorAll('button')].some((b) =>
      b.textContent.toLowerCase().includes('enter 3d mode')
    ),
  }));
  console.log('MOBILE', JSON.stringify(mob));
  if (mob.mode !== 'classic' || mob.canvas || !mob.hero || mob.invite)
    fail('mobile should be flat 2D with no 3D invite');

  console.log(process.exitCode ? 'RESULT: FAILURES ABOVE' : 'RESULT: ALL CHECKS PASSED');
} finally {
  await browser.close();
}
