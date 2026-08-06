import path from 'path';
import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const FFMPEG = path.join(process.cwd(), 'node_modules/@ffmpeg-installer/linux-x64/ffmpeg');
const BASE = 'http://127.0.0.1:4173';
const OUT = './videos';
const TMP = './video-frames';

mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MOCK_INIT_SCRIPT = `
(() => {
  const FAKE_USER_ID = 'screenshot-user-0000-0000-0000-000000000001';
  const FAKE_SESSION = {
    access_token: 'fake-access-token', refresh_token: 'fake-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: 'bearer',
    user: { id: FAKE_USER_ID, email: 'player@mega-magpie.test', aud: 'authenticated', role: 'authenticated' },
  };
  try {
    localStorage.setItem('sb-fqdrrtqifoffrgllcail-auth-token', JSON.stringify(FAKE_SESSION));
    localStorage.setItem('mm_age_verified_v1', 'true');
  } catch {}
  const MOCK_PLAYER_STATE = {
    user_id: FAKE_USER_ID, player_name: 'Lucky Magpie', coins: 1250,
    games_played: 42, games_won: 28, best_time_seconds: 95, best_moves: 52,
    updated_at: new Date().toISOString(), xp: 3400, level: 7,
    winnings_pence: 1500, total_deposited_pence: 5000, max_level_reached: 8,
    tokens: 180, active_card_back: 'classic', active_character: 'alex', active_outfit: 'default',
    wins_since_milestone: 3, milestones_claimed: 1, pending_milestone_pence: 0,
    ads_watched_today: 2, ads_reset_date: new Date().toISOString().slice(0, 10),
    current_wager: 0, age_verified: true, session_spent_coins: 320, lifetime_spent_coins: 2100,
    speed_points: 540, lifetime_won_pence: 1500, current_streak: 4, best_streak: 7,
    daily_streak: 5, best_daily_streak: 12, last_login_date: new Date().toISOString().slice(0, 10),
    daily_reward_claimed: false, streak_freezes: 1, last_freeze_date: null,
  };
  const MOCK_INVENTORY = [
    { id: 'inv-1', user_id: FAKE_USER_ID, item_type: 'card_back', item_id: 'classic', acquired_at: '2025-01-01T00:00:00Z' },
    { id: 'inv-2', user_id: FAKE_USER_ID, item_type: 'character', item_id: 'alex', acquired_at: '2025-01-01T00:00:00Z' },
    { id: 'inv-3', user_id: FAKE_USER_ID, item_type: 'outfit', item_id: 'default', acquired_at: '2025-01-01T00:00:00Z' },
  ];
  const MOCK_TRANSACTIONS = [
    { id: 'tx-1', user_id: FAKE_USER_ID, type: 'deposit', amount_pence: 5000, description: 'Initial deposit', status: 'completed', created_at: '2025-07-15T10:00:00Z' },
    { id: 'tx-2', user_id: FAKE_USER_ID, type: 'award', amount_pence: 1500, description: 'Milestone reward', status: 'completed', created_at: '2025-07-20T14:30:00Z' },
  ];
  const origFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.includes('/rest/v1/player_state')) return new Response(JSON.stringify(MOCK_PLAYER_STATE), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (url.includes('/rest/v1/player_inventory')) return new Response(JSON.stringify(MOCK_INVENTORY), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (url.includes('/rest/v1/transactions')) return new Response(JSON.stringify(MOCK_TRANSACTIONS), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (url.includes('/rest/v1/speed_matches')) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (url.includes('/rest/v1/rpc/')) return new Response(JSON.stringify(MOCK_PLAYER_STATE), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return origFetch(input, init);
  };
})();
`;

async function closeAllModals(page) {
  await page.keyboard.press('Escape');
  await sleep(300);
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].filter((b) => b.querySelector('svg.lucide-x')).forEach((b) => b.click());
  });
  await sleep(500);
}

async function clickHeaderIcon(page, lucideClass) {
  await page.evaluate((cls) => {
    const btn = [...document.querySelectorAll('header button')].find((b) => b.querySelector(`svg.${cls}`));
    if (btn) btn.click();
  }, lucideClass);
  await sleep(1000);
}

async function clickModalBtn(page, text) {
  await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim().replace(/\\s+/g, ' ').includes(t) && !b.disabled);
    if (btn) btn.click();
  }, text);
  await sleep(700);
}

async function recordVideo(name, durationSec, actions) {
  const frameDir = path.join(TMP, name);
  mkdirSync(frameDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 1 });
  await page.setDefaultTimeout(15000);
  await page.evaluateOnNewDocument(MOCK_INIT_SCRIPT);
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  const fps = 6;
  const totalFrames = durationSec * fps;
  let frameNum = 0;
  let recording = true;

  const captureLoop = async () => {
    while (recording && frameNum < totalFrames) {
      const padded = String(frameNum).padStart(5, '0');
      try {
        await page.screenshot({ path: path.join(frameDir, `frame_${padded}.png`), fullPage: false });
      } catch {}
      frameNum++;
      await sleep(1000 / fps);
    }
  };

  const actionsLoop = async () => {
    for (const action of actions) {
      if (!recording) break;
      await action(page);
    }
  };

  await Promise.all([captureLoop(), actionsLoop()]);
  recording = false;
  await sleep(300);
  await browser.close();

  const outputPath = path.join(OUT, `${name}.mp4`);
  execSync(
    `${FFMPEG} -y -framerate ${fps} -i ${path.join(frameDir, 'frame_%05d.png')} ` +
    `-c:v libx264 -pix_fmt yuv420p -vf "scale=1242:2688:flags=lanczos" -r 30 ` +
    `-preset medium -crf 18 -movflags +faststart ${outputPath} 2>&1`,
    { stdio: 'pipe' }
  );

  rmSync(frameDir, { recursive: true, force: true });
  console.log(`Recorded ${name}.mp4 (${durationSec}s, ${frameNum} frames)`);
}

const videoName = process.argv[2] || 'all';

async function main() {
  if (videoName === '1' || videoName === 'all') {
    await recordVideo('01-gameplay-preview', 15, [
      async () => { await sleep(4000); },
      async (page) => {
        await page.evaluate(() => {
          const cards = [...document.querySelectorAll('[class*="cursor-pointer"]')];
          if (cards[0]) cards[0].click();
        });
        await sleep(3000);
      },
      async (page) => {
        await page.evaluate(() => {
          const btn = [...document.querySelectorAll('header button')].find((b) => b.querySelector('svg.lucide-gift'));
          if (btn) btn.click();
        });
        await sleep(4000);
      },
      async (page) => { await closeAllModals(page); },
      async () => { await sleep(2000); },
    ]);
  }

  if (videoName === '2' || videoName === 'all') {
    await recordVideo('02-wallet-wager-preview', 15, [
      async (page) => { await clickHeaderIcon(page, 'lucide-wallet'); await sleep(3000); },
      async (page) => { await clickModalBtn(page, 'Deposit'); await sleep(3000); },
      async (page) => { await clickModalBtn(page, 'Back to Wallet'); await sleep(1500); },
      async (page) => { await clickModalBtn(page, 'Withdraw'); await sleep(3000); },
      async (page) => { await closeAllModals(page); },
      async (page) => { await clickHeaderIcon(page, 'lucide-trending-up'); await sleep(3000); },
      async (page) => { await closeAllModals(page); },
    ]);
  }

  if (videoName === '3' || videoName === 'all') {
    await recordVideo('03-shop-customize-preview', 15, [
      async (page) => { await clickHeaderIcon(page, 'lucide-star'); await sleep(3500); },
      async (page) => { await closeAllModals(page); },
      async (page) => { await clickHeaderIcon(page, 'lucide-sparkles'); await sleep(3500); },
      async (page) => { await closeAllModals(page); },
      async (page) => {
        await page.evaluate(() => {
          const btn = [...document.querySelectorAll('header button')].find((b) => b.textContent.includes('Shop'));
          if (btn) btn.click();
        });
        await sleep(4000);
      },
    ]);
  }

  console.log('Done!');
}

main().catch((err) => { console.error('Failed:', err); process.exit(1); });
