/**
 * One-off verification harness for the 3D layer (not part of the build).
 * Drives system Chrome headless against the dev server and checks:
 *  1. the WebGL scene mounts and sizes itself,
 *  2. scroll moves the camera (dolly),
 *  3. hovering the hero shape raycasts through the DOM (cursor store flips),
 *  4. clicking a landmark navigates to its section,
 *  5. screenshots at top / mid / bottom for visual review.
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = 'http://localhost:5173';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--window-size=1440,900', '--use-angle=default'],
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  // Let the preloader finish and the scene fade in.
  await page.waitForFunction(() => window.__uiStore?.getState().loaderDone, { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1200));

  const mount = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const r = c?.getBoundingClientRect();
    const s = window.__three?.();
    return {
      canvas: r ? { w: r.width, h: r.height } : null,
      threeReady: Boolean(s),
      sceneChildren: s ? s.scene.children.map((o) => o.type) : [],
      camZ: s ? +s.camera.position.z.toFixed(2) : null,
    };
  });
  console.log('MOUNT', JSON.stringify(mount));
  await page.screenshot({ path: 'scripts/shot-hero.png' });

  // 2. Scroll → camera dolly.
  await page.evaluate(() => window.scrollTo(0, 4000));
  await new Promise((r) => setTimeout(r, 1500));
  const afterScroll = await page.evaluate(() => +window.__three().camera.position.z.toFixed(2));
  console.log('CAM_Z top→4000px:', mount.camZ, '→', afterScroll);
  await page.screenshot({ path: 'scripts/shot-mid.png' });

  // 3. Hover the hero shape: project its position to screen coords, move mouse there.
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1500));
  const heroXY = await page.evaluate(() => {
    const s = window.__three();
    const hero = s.scene.children.find((o) => o.type === 'Group');
    const v = hero.position.clone().project(s.camera);
    return { x: ((v.x + 1) / 2) * innerWidth, y: ((1 - v.y) / 2) * innerHeight };
  });
  await page.mouse.move(heroXY.x, heroXY.y, { steps: 5 });
  await new Promise((r) => setTimeout(r, 400));
  const hoverState = await page.evaluate(() => {
    const s = window.__uiStore.getState();
    return { variant: s.cursorVariant, label: s.cursorLabel };
  });
  console.log('HERO_HOVER at', JSON.stringify(heroXY), '→', JSON.stringify(hoverState));

  // 4. Click a landmark: scroll until the 'about' torus is in front of the camera.
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 1500));
  const lmXY = await page.evaluate(() => {
    const s = window.__three();
    const torus = s.scene.children.find(
      (o) => o.type === 'Mesh' && o.geometry?.type === 'TorusGeometry'
    );
    const v = torus.position.clone().project(s.camera);
    return {
      x: ((v.x + 1) / 2) * innerWidth,
      y: ((1 - v.y) / 2) * innerHeight,
      behind: v.z > 1,
    };
  });
  console.log('LANDMARK torus at', JSON.stringify(lmXY));
  if (!lmXY.behind && lmXY.x > 0 && lmXY.x < 1440) {
    await page.mouse.move(lmXY.x, lmXY.y, { steps: 5 });
    await new Promise((r) => setTimeout(r, 300));
    const lmHover = await page.evaluate(() => window.__uiStore.getState().cursorLabel);
    await page.mouse.click(lmXY.x, lmXY.y);
    await new Promise((r) => setTimeout(r, 2000));
    const aboutTop = await page.evaluate(() =>
      Math.round(document.getElementById('about').getBoundingClientRect().top)
    );
    console.log('LANDMARK_HOVER label:', lmHover, '| after click, #about top:', aboutTop);
  }

  // 5. Bottom of page.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: 'scripts/shot-bottom.png' });

  console.log('ERRORS', JSON.stringify(errors.slice(0, 5)));
} finally {
  await browser.close();
}
