import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';

mkdirSync('./screenshots', { recursive: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://127.0.0.1:4173';
const OUT = './screenshots';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  await sleep(900);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`Captured ${name}.png`);
}

async function closeAllModals(page) {
  await page.keyboard.press('Escape');
  await sleep(300);
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    btns.filter((b) => b.querySelector('svg.lucide-x')).forEach((b) => b.click());
  });
  await sleep(500);
}

async function clickHeaderIcon(page, lucideClass) {
  const found = await page.evaluate((cls) => {
    const btns = [...document.querySelectorAll('header button')];
    const btn = btns.find((b) => b.querySelector(`svg.${cls}`));
    if (btn) { btn.click(); return true; }
    return false;
  }, lucideClass);
  if (!found) console.warn(`Header button with icon "${lucideClass}" not found`);
  await sleep(1000);
  return found;
}

async function clickModalBtn(page, text) {
  const found = await page.evaluate((t) => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find((b) => b.textContent.trim().replace(/\s+/g, ' ').includes(t) && !b.disabled);
    if (btn) { btn.click(); return true; }
    return false;
  }, text);
  if (!found) console.warn(`Modal button with text "${text}" not found`);
  await sleep(700);
  return found;
}

// Inject a fake Supabase auth session + mock DB responses before the page loads.
// This lets the screenshot script capture all 10 screens without a real backend.
const MOCK_INIT_SCRIPT = `
(() => {
  const FAKE_USER_ID = 'screenshot-user-0000-0000-0000-000000000001';
  const FAKE_SESSION = {
    access_token: 'fake-access-token',
    refresh_token: 'fake-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: { id: FAKE_USER_ID, email: 'player@mega-magpie.test', aud: 'authenticated', role: 'authenticated' },
  };

  try {
    localStorage.setItem('sb-fqdrrtqifoffrgllcail-auth-token', JSON.stringify(FAKE_SESSION));
    localStorage.setItem('mm_age_verified_v1', 'true');
  } catch {}

  const MOCK_PLAYER_STATE = {
    user_id: FAKE_USER_ID,
    player_name: 'Lucky Magpie',
    coins: 1250,
    games_played: 42,
    games_won: 28,
    best_time_seconds: 95,
    best_moves: 52,
    updated_at: new Date().toISOString(),
    xp: 3400,
    level: 7,
    winnings_pence: 1500,
    total_deposited_pence: 5000,
    max_level_reached: 8,
    tokens: 180,
    active_card_back: 'classic',
    active_character: 'alex',
    active_outfit: 'default',
    wins_since_milestone: 3,
    milestones_claimed: 1,
    pending_milestone_pence: 0,
    ads_watched_today: 2,
    ads_reset_date: new Date().toISOString().slice(0, 10),
    current_wager: 0,
    age_verified: true,
    session_spent_coins: 320,
    lifetime_spent_coins: 2100,
    speed_points: 540,
    lifetime_won_pence: 1500,
    current_streak: 4,
    best_streak: 7,
    daily_streak: 5,
    best_daily_streak: 12,
    last_login_date: new Date().toISOString().slice(0, 10),
    daily_reward_claimed: false,
    streak_freezes: 1,
    last_freeze_date: null,
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

    if (url.includes('/rest/v1/player_state')) {
      return new Response(JSON.stringify(MOCK_PLAYER_STATE), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('/rest/v1/player_inventory')) {
      return new Response(JSON.stringify(MOCK_INVENTORY), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('/rest/v1/transactions')) {
      return new Response(JSON.stringify(MOCK_TRANSACTIONS), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('/rest/v1/speed_matches')) {
      return new Response(JSON.stringify([]), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('/rest/v1/rpc/')) {
      return new Response(JSON.stringify(MOCK_PLAYER_STATE), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    return origFetch(input, init);
  };
})();
`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 3 });
  await page.setDefaultTimeout(12000);

  // Inject mock auth + Supabase before the page loads
  await page.evaluateOnNewDocument(MOCK_INIT_SCRIPT);

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  // 1. Game Board
  await shot(page, '01-game-board');

  // 2. Daily Reward Modal
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('header button')];
    const btn = btns.find((b) => b.querySelector('svg.lucide-gift'));
    if (btn) btn.click();
  });
  await sleep(1200);
  await shot(page, '02-daily-reward-modal');
  await closeAllModals(page);

  // 3. Profile Modal
  await page.evaluate(() => {
    const btn = document.querySelector('header button:first-child');
    if (btn) btn.click();
  });
  await sleep(1200);
  await shot(page, '03-profile-modal');
  await closeAllModals(page);

  // 4. Wallet Overview
  await clickHeaderIcon(page, 'lucide-wallet');
  await shot(page, '04-wallet-overview');

  // 5. Wallet Deposit
  await clickModalBtn(page, 'Deposit');
  await shot(page, '05-wallet-deposit');
  await clickModalBtn(page, 'Back to Wallet');
  await sleep(500);

  // 6. Wallet Withdraw
  await clickModalBtn(page, 'Withdraw');
  await shot(page, '06-wallet-withdraw');
  await closeAllModals(page);

  // 7. Wager Modal
  await clickHeaderIcon(page, 'lucide-trending-up');
  await shot(page, '07-wager-modal');
  await closeAllModals(page);

  // 8. Levels Modal
  await clickHeaderIcon(page, 'lucide-star');
  await shot(page, '08-levels-modal');
  await closeAllModals(page);

  // 9. Customize Modal
  await clickHeaderIcon(page, 'lucide-sparkles');
  await shot(page, '09-customize-modal');
  await closeAllModals(page);

  // 10. Shop Modal
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('header button')];
    const btn = btns.find((b) => b.textContent.includes('Shop'));
    if (btn) btn.click();
  });
  await sleep(1200);
  await shot(page, '10-shop-modal');

  await browser.close();
  console.log('Done! All 10 screenshots captured.');
}

main().catch((err) => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
