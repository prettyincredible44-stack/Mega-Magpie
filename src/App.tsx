import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { Header } from '@/components/Header';
import { BoostBar, UNDO_PACK_COST_COINS, HINT_PACK_COST_COINS, UNDO_PACK_COST_TOKENS, HINT_PACK_COST_TOKENS } from '@/components/BoostBar';
import { GameBoard } from '@/components/GameBoard';
import { ShopModal } from '@/components/ShopModal';
import { WinModal } from '@/components/WinModal';
import { LevelModal } from '@/components/LevelModal';
import { WalletModal } from '@/components/WalletModal';
import { RewardedAdModal } from '@/components/RewardedAdModal';
import { WagerModal } from '@/components/WagerModal';
import { LuckyPickModal } from '@/components/LuckyPickModal';
import { generatePlayerName } from '@/lib/names';
import { LevelUpToast } from '@/components/LevelUpToast';
import { AgeGate } from '@/components/AgeGate';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { CharacterUnlockModal } from '@/components/CharacterUnlockModal';
import { ResponsibleGamblingModal } from '@/components/ResponsibleGamblingModal';
import { SpeedMatchModal } from '@/components/SpeedMatchModal';
import { CustomizeModal, Currency } from '@/components/CustomizeModal';
import { ProfileModal } from '@/components/ProfileModal';
import { DailyRewardModal } from '@/components/DailyRewardModal';
import { getRewardForDay } from '@/game/dailyRewards';
import { useGame } from '@/hooks/useGame';
import { useAuth } from '@/hooks/useAuth';
import { usePlayerState } from '@/hooks/usePlayerState';
import { supabase, PlayerState } from '@/lib/supabase';
import { findValidMoves } from '@/game/engine';
import {
  getLevelForXp, LevelInfo,
  TOKENS_PER_AD, DAILY_AD_CAP, WAGER_TIERS,
} from '@/game/levels';
import {
  CASHBACK_RATE,
  getCardBack, getCharacter,
  CardBack, Character, Outfit,
} from '@/game/catalog';
import {
  resumeAudio,
  playCardFlip, playCardMove, playCardPlace, playFoundation,
  playWin, playCoin, playLevelUp, playClick, playJackpot,
} from '@/lib/sounds';

const PACK_SIZE = 5;

// The 18+ confirmation is held per device, not in the shared player row, so
// every visitor is asked rather than inheriting someone else's confirmation.
const AGE_VERIFIED_KEY = 'mm_age_verified_v1';
const ONBOARDING_KEY = 'mm_onboarding_v1';

export default function App() {
  const game = useGame();
  const { user, status: authStatus, signIn, signUp, signOut } = useAuth();
  const { state: player, inventory, status, persist, addToInventory, ownsItem, applyServerState } = usePlayerState(user?.id ?? null);
  const [shopOpen, setShopOpen] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adOpen, setAdOpen] = useState(false);
  const [wagerOpen, setWagerOpen] = useState(false);
  const [luckyPickOpen, setLuckyPickOpen] = useState(false);
  const [rgOpen, setRgOpen] = useState(false);
  const [speedMatchOpen, setSpeedMatchOpen] = useState(false);
  const [dailyRewardOpen, setDailyRewardOpen] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [unlockedCharacter, setUnlockedCharacter] = useState<Character | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [lastCashWonPence, setLastCashWonPence] = useState(0);
  const [levelUp, setLevelUp] = useState<LevelInfo | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [ageVerified, setAgeVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AGE_VERIFIED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [onboardingSeen, setOnboardingSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Initialize audio settings
  useEffect(() => {
    setSfxEnabled(true);
    setMusicEnabled(true);
  }, []);

  // Apply audio settings to engine
  useEffect(() => {
    setSfxEnabled(sfxEnabled);
  }, [sfxEnabled]);

  useEffect(() => {
    setMusicEnabled(musicEnabled);
  }, [musicEnabled]);

  const toggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev;
      setMusicEnabled(next);
      return next;
    });
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      setSfxEnabled(next);
      return next;
    });
  }, []);

  const sfx = useCallback((fn: () => void) => {
    if (sfxEnabled) { resumeAudio(); fn(); }
  }, [sfxEnabled]);

  const coins = player?.coins ?? 0;
  const tokens = player?.tokens ?? 0;
  const xp = player?.xp ?? 0;
  const levelInfo = getLevelForXp(xp);
  const winningsPence = player?.winnings_pence ?? 0;
  const totalDepositedPence = player?.total_deposited_pence ?? 0;
  const maxLevelReached = player?.max_level_reached ?? 1;
  const activeCardBackId = player?.active_card_back ?? 'classic';
  const activeCharacterId = player?.active_character ?? 'alex';
  const activeOutfitId = player?.active_outfit ?? 'default';
  const activeCardBack = getCardBack(activeCardBackId);
  const activeCharacter = getCharacter(activeCharacterId);
  const currentWager = player?.current_wager ?? 0;
  const wagerTier = WAGER_TIERS.find((t) => t.coins === currentWager) ?? WAGER_TIERS[0];

  const ownedCardBacks = useMemo(() => new Set(inventory.filter((i) => i.item_type === 'card_back').map((i) => i.item_id)), [inventory]);
  const ownedCharacters = useMemo(() => new Set(inventory.filter((i) => i.item_type === 'character').map((i) => i.item_id)), [inventory]);
  const ownedOutfits = useMemo(() => new Set(inventory.filter((i) => i.item_type === 'outfit').map((i) => i.item_id)), [inventory]);

  // Record game start once data is loaded.
  useEffect(() => {
    if (status === 'ready' && player && !game.counted) {
      game.setCounted(true);
      persist({ games_played: player.games_played + 1 });
    }
  }, [status, player, game, persist]);

  // On win, hand the whole result to the server. record_win owns XP, level,
  // coin reward, stake payout, streaks, the 10-win cash milestone and the
  // one-time Level 10 award; the client no longer computes or writes any of it.
  useEffect(() => {
    if (!game.won || game.counted || !player) return;

    // Claim the win locally first so a re-render cannot submit it twice.
    game.setCounted(true);

    const prevCoins = player.coins;
    const prevWinnings = player.winnings_pence;
    const prevLevel = player.level;

    sfx(playWin);

    (async () => {
      const { data, error } = await supabase.rpc('record_win', {
        p_seconds: game.seconds,
        p_moves: game.state.moves,
      });

      if (error || !data) {
        console.error('failed to record win', error);
        return;
      }

      const row = data as PlayerState;
      applyServerState(row);
      setCoinsEarned(Math.max(0, row.coins - prevCoins));
      setLastCashWonPence(Math.max(0, row.winnings_pence - prevWinnings));

      if (row.level > prevLevel) {
        setLevelUp(getLevelForXp(row.xp));
        setTimeout(() => sfx(playLevelUp), 600);
      }
    })();
  }, [game.won, game, player, applyServerState, sfx]);

  // Helper: spend coins and earn 20% token cashback. Tracks spending for responsible gambling.
  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (!player || player.coins < amount) return false;
    const cashback = Math.ceil(amount * CASHBACK_RATE);
    await persist({
      coins: player.coins - amount,
      tokens: player.tokens + cashback,
      session_spent_coins: player.session_spent_coins + amount,
      lifetime_spent_coins: player.lifetime_spent_coins + amount,
    });
    return true;
  }, [player, persist]);

  const spendTokens = useCallback(async (amount: number): Promise<boolean> => {
    if (!player || player.tokens < amount) return false;
    await persist({ tokens: player.tokens - amount });
    return true;
  }, [player, persist]);

  const handleBuyUndo = useCallback(async (currency: 'coins' | 'tokens') => {
    const cost = currency === 'coins' ? UNDO_PACK_COST_COINS : UNDO_PACK_COST_TOKENS;
    const ok = currency === 'coins' ? await spendCoins(cost) : await spendTokens(cost);
    if (ok) game.addBoosts('undos', PACK_SIZE);
  }, [spendCoins, spendTokens, game]);

  const handleBuyHint = useCallback(async (currency: 'coins' | 'tokens') => {
    const cost = currency === 'coins' ? HINT_PACK_COST_COINS : HINT_PACK_COST_TOKENS;
    const ok = currency === 'coins' ? await spendCoins(cost) : await spendTokens(cost);
    if (ok) game.addBoosts('hints', PACK_SIZE);
  }, [spendCoins, spendTokens, game]);

  const handleBuyCardBack = useCallback(async (cb: CardBack, currency: Currency) => {
    if (!player || ownsItem('card_back', cb.id)) return;
    const price = currency === 'coins' ? cb.priceCoins : cb.priceTokens;
    if (price === 0) { await addToInventory('card_back', cb.id); return; }
    const ok = currency === 'coins' ? await spendCoins(price) : await spendTokens(price);
    if (ok) await addToInventory('card_back', cb.id);
  }, [player, ownsItem, spendCoins, spendTokens, addToInventory]);

  const handleBuyCharacter = useCallback(async (c: Character, currency: Currency) => {
    if (!player || ownsItem('character', c.id)) return;
    const price = currency === 'coins' ? c.priceCoins : c.priceTokens;
    if (price === 0) { await addToInventory('character', c.id); return; }
    const ok = currency === 'coins' ? await spendCoins(price) : await spendTokens(price);
    if (ok) await addToInventory('character', c.id);
  }, [player, ownsItem, spendCoins, spendTokens, addToInventory]);

  const handleBuyOutfit = useCallback(async (o: Outfit, currency: Currency) => {
    if (!player || ownsItem('outfit', o.id)) return;
    const price = currency === 'coins' ? o.priceCoins : o.priceTokens;
    if (price === 0) { await addToInventory('outfit', o.id); return; }
    const ok = currency === 'coins' ? await spendCoins(price) : await spendTokens(price);
    if (ok) await addToInventory('outfit', o.id);
  }, [player, ownsItem, spendCoins, spendTokens, addToInventory]);

  const handleSelectCardBack = useCallback((id: string) => {
    if (!ownsItem('card_back', id)) return;
    persist({ active_card_back: id });
  }, [ownsItem, persist]);

  const handleSelectCharacter = useCallback((id: string) => {
    if (!ownsItem('character', id)) return;
    persist({ active_character: id });
  }, [ownsItem, persist]);

  const handleSelectOutfit = useCallback((id: string) => {
    if (!ownsItem('outfit', id)) return;
    persist({ active_outfit: id });
  }, [ownsItem, persist]);

  // Payments are not connected yet. Both handlers refuse rather than moving
  // money: the deposit total gates withdrawal eligibility and may only ever be
  // set by a verified payment, and the winnings balance is server-owned.
  const handleDeposit = useCallback(async () => {
    throw new Error('Payments are not available yet.');
  }, []);

  const handleWithdraw = useCallback(async () => {
    throw new Error('Payments are not available yet.');
  }, []);

  const handleAdReward = useCallback(async () => {
    if (!player) return;
    const today = new Date().toISOString().slice(0, 10);
    const isNewDay = player.ads_reset_date !== today;
    const newAdsWatched = isNewDay ? 1 : player.ads_watched_today + 1;
    if (newAdsWatched > DAILY_AD_CAP) return;
    await persist({
      tokens: player.tokens + TOKENS_PER_AD,
      ads_watched_today: newAdsWatched,
      ads_reset_date: today,
    });
  }, [player, persist]);

  const handleSetWager = useCallback((wagerCoins: number) => {
    persist({ current_wager: wagerCoins });
  }, [persist]);

  const handleStartNewGame = useCallback(() => {
    sfx(playClick);
    if (!player) { game.startNewGame(); return; }
    const wager = player.current_wager;
    if (wager > 0 && player.coins >= wager) {
      const cashback = Math.ceil(wager * CASHBACK_RATE);
      persist({
        coins: player.coins - wager,
        tokens: player.tokens + cashback,
      });
    } else if (wager > 0 && player.coins < wager) {
      persist({ current_wager: 0 });
    }
    if (!game.won && player.current_streak > 0) {
      persist({ current_streak: 0 });
    }
    game.startNewGame();
  }, [player, persist, game, sfx]);

  const handleLuckyPickWin = useCallback((amount: number) => {
    if (!player) return;
    sfx(amount >= 50 ? playJackpot : playCoin);
    persist({ tokens: player.tokens + amount });
  }, [player, persist, sfx]);

  const handleLuckyPickSpend = useCallback((amount: number) => {
    sfx(playCoin);
    spendCoins(amount);
  }, [sfx, spendCoins]);

  const handleShopSmallBuy = useCallback((id: string, cost: number) => {
    if (!player) return;
    sfx(playCoin);
    if (id === 'undo_pack') {
      spendCoins(cost);
      game.addBoosts('undos', 5);
    } else if (id === 'hint_pack') {
      spendCoins(cost);
      game.addBoosts('hints', 5);
    } else if (id === 'token_small') {
      spendCoins(cost);
      persist({ tokens: player.tokens + 50 });
    } else if (id === 'token_large') {
      spendCoins(cost);
      persist({ tokens: player.tokens + 150 });
    } else if (id === 'lucky_bundle') {
      spendCoins(cost);
    }
  }, [player, sfx, spendCoins, persist, game]);

  const handleRegenerateName = useCallback(() => {
    persist({ player_name: generatePlayerName() });
  }, [persist]);

  const handleAgeVerify = useCallback(() => {
    try {
      localStorage.setItem(AGE_VERIFIED_KEY, 'true');
    } catch {
      // Private browsing may block storage; the gate simply reappears next visit.
    }
    setAgeVerified(true);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // Private browsing may block storage.
    }
    setOnboardingComplete(true);
  }, []);

  const handleResetSession = useCallback(() => {
    persist({ session_spent_coins: 0 });
  }, [persist]);

  const handleSpeedMatchComplete = useCallback((result: { score: number; moves: number; timeSeconds: number; won: boolean; wagered: number }) => {
    if (!player) return;
    const newSpeedPoints = player.speed_points + result.score;
    // Charge the entry fee that was only being recorded, never deducted, so the
    // coin balance and the responsible-play spend tracker agree.
    const fee = Math.max(0, Math.min(result.wagered, player.coins));
    persist({
      speed_points: newSpeedPoints,
      coins: player.coins - fee,
      session_spent_coins: player.session_spent_coins + fee,
      lifetime_spent_coins: player.lifetime_spent_coins + fee,
    });
    supabase.from('speed_matches').insert({
      player_name: player.player_name ?? 'Player',
      score: result.score,
      moves: result.moves,
      time_seconds: result.timeSeconds,
      won: result.won,
      wagered: fee,
    });
  }, [player, persist]);

  // Daily login reward: check streak on load and auto-open modal if unclaimed
  useEffect(() => {
    if (status !== 'ready' || !player) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastLogin = player.last_login_date;

    if (lastLogin === today && !player.daily_reward_claimed) {
      setDailyRewardOpen(true);
      return;
    }
    if (lastLogin === today && player.daily_reward_claimed) return;

    let newStreak = player.daily_streak;
    let freezes = player.streak_freezes;

    if (lastLogin) {
      const last = new Date(lastLogin + 'T00:00:00');
      const now = new Date(today + 'T00:00:00');
      const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
      if (diffDays === 1) {
        newStreak = player.daily_streak + 1;
      } else if (diffDays === 2 && freezes > 0) {
        freezes -= 1;
        newStreak = player.daily_streak + 1;
      } else if (diffDays > 1) {
        newStreak = 0;
      }
    } else {
      newStreak = 0;
    }

    const bestDaily = Math.max(player.best_daily_streak, newStreak);
    persist({
      daily_streak: newStreak,
      best_daily_streak: bestDaily,
      last_login_date: today,
      daily_reward_claimed: false,
      streak_freezes: freezes,
    });
    setDailyRewardOpen(true);
  }, [status, player?.last_login_date]);

  const handleClaimDailyReward = useCallback(() => {
    if (!player || player.daily_reward_claimed) return;
    const reward = getRewardForDay(player.daily_streak + 1);
    const today = new Date().toISOString().slice(0, 10);
    const newStreak = player.daily_streak + 1;
    const newBest = Math.max(player.best_daily_streak, newStreak);
    const newFreezes = newStreak > 0 && newStreak % 7 === 0 ? player.streak_freezes + 1 : player.streak_freezes;
    persist({
      coins: player.coins + reward.coins,
      tokens: player.tokens + reward.tokens,
      daily_streak: newStreak,
      best_daily_streak: newBest,
      daily_reward_claimed: true,
      streak_freezes: newFreezes,
      last_login_date: today,
    });
    sfx(playWin);
  }, [player, persist, sfx]);

  // Spending warning: auto-open responsible gambling modal at thresholds
  useEffect(() => {
    if (!player) return;
    const spent = player.session_spent_coins;
    if (spent === 500 || spent === 1000 || spent === 2000) {
      setRgOpen(true);
    }
  }, [player?.session_spent_coins]);

  const validMoves = findValidMoves(game.state);
  const canFinish =
    validMoves.length > 0 &&
    game.state.piles.stock.length === 0 &&
    game.state.piles.waste.length === 0;

  // Age gate: every visitor on this device must confirm 18+ before the game
  // loads. This is deliberately per-device rather than a shared database flag,
  // so one person confirming cannot wave everyone else past the check.
  if (!ageVerified) {
    return <AgeGate onVerify={handleAgeVerify} />;
  }

  if (ageVerified && !onboardingSeen && !onboardingComplete) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Sign-in gate: each player must have their own account so coins, winnings,
  // and progress are private per user (App Store requirement).
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen felt-texture flex items-center justify-center">
        <div className="text-teal-300/80 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <AuthScreen
        onSignIn={async (email, password) => {
          const { error } = await signIn(email, password);
          return { error: error?.message ?? null };
        }}
        onSignUp={async (email, password) => {
          const { error } = await signUp(email, password);
          return { error: error?.message ?? null };
        }}
      />
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen felt-texture flex items-center justify-center">
        <div className="text-teal-300/80 text-sm animate-pulse">Loading game...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen felt-texture flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-rose-300 font-semibold mb-1">Couldn't load your progress</p>
          <p className="text-teal-400/70 text-sm">The game still works — your coins, levels, and winnings just won't save until the connection is back.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col felt-texture overflow-hidden">
      <Header
        coins={coins}
        tokens={tokens}
        gamesWon={player?.games_won ?? 0}
        bestTime={player?.best_time_seconds ?? null}
        moves={game.state.moves}
        seconds={game.seconds}
        levelInfo={levelInfo}
        winningsPence={winningsPence}
        characterEmoji={activeCharacter.emoji}
        playerName={player?.player_name ?? 'Player'}
        winStreak={player?.current_streak ?? 0}
        adsWatchedToday={player?.ads_watched_today ?? 0}
        dailyAdCap={DAILY_AD_CAP}
        onOpenShop={() => setShopOpen(true)}
        onOpenLevels={() => setLevelModalOpen(true)}
        onOpenWallet={() => setWalletOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenCustomize={() => setCustomizeOpen(true)}
        onWatchAd={() => setAdOpen(true)}
        onOpenWager={() => setWagerOpen(true)}
        onOpenLuckyPick={() => setLuckyPickOpen(true)}
        onOpenSpeedMatch={() => setSpeedMatchOpen(true)}
        onOpenResponsibleGambling={() => setRgOpen(true)}
        currentWager={currentWager}
        speedPoints={player?.speed_points ?? 0}
        musicEnabled={musicEnabled}
        sfxEnabled={sfxEnabled}
        onToggleMusic={toggleMusic}
        onToggleSfx={toggleSfx}
        dailyStreak={player?.daily_streak ?? 0}
        onOpenDailyReward={() => setDailyRewardOpen(true)}
        dailyRewardClaimed={player?.daily_reward_claimed ?? false}
      />
      <BoostBar
        boosts={game.boosts}
        coins={coins}
        tokens={tokens}
        onUndo={() => { sfx(playCardMove); game.undo(); }}
        onHint={() => { sfx(playClick); game.requestHint(); }}
        onNewGame={handleStartNewGame}
        onAutoFinish={() => { sfx(playFoundation); game.finish(); }}
        canFinish={canFinish}
        onBuyUndo={handleBuyUndo}
        onBuyHint={handleBuyHint}
      />
      <GameBoard
        state={game.state}
        selected={game.selected}
        hint={game.hint}
        onPileClick={(pid, idx) => {
          const prevLen = game.state.piles[pid].length;
          game.handlePileClick(pid, idx);
          if (pid === 'stock') sfx(playCardFlip);
          else if (game.state.piles[pid]?.length > prevLen) sfx(playCardPlace);
          else sfx(playClick);
        }}
        onPileDoubleClick={(pid, idx) => {
          game.handlePileDoubleClick(pid, idx);
          sfx(playFoundation);
        }}
        cardBack={activeCardBack}
      />
      <LevelUpToast level={levelUp} onDismiss={() => setLevelUp(null)} />
      <ShopModal open={shopOpen} coins={coins} onClose={() => setShopOpen(false)} onBuySmall={handleShopSmallBuy} />
      <LevelModal
        open={levelModalOpen}
        xp={xp}
        level={levelInfo.level}
        maxLevelReached={maxLevelReached}
        onClose={() => setLevelModalOpen(false)}
      />
      <WalletModal
        open={walletOpen}
        winningsPence={winningsPence}
        totalDepositedPence={totalDepositedPence}
        lifetimeWonPence={player?.lifetime_won_pence ?? 0}
        maxLevelReached={maxLevelReached}
        level={levelInfo.level}
        winsSinceMilestone={player?.wins_since_milestone ?? 0}
        milestonesClaimed={player?.milestones_claimed ?? 0}
        onClose={() => setWalletOpen(false)}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
      <CustomizeModal
        open={customizeOpen}
        coins={coins}
        tokens={tokens}
        ownedCardBacks={ownedCardBacks}
        ownedCharacters={ownedCharacters}
        ownedOutfits={ownedOutfits}
        activeCardBack={activeCardBackId}
        activeCharacter={activeCharacterId}
        activeOutfit={activeOutfitId}
        onClose={() => setCustomizeOpen(false)}
        onBuyCardBack={handleBuyCardBack}
        onBuyCharacter={handleBuyCharacter}
        onBuyOutfit={handleBuyOutfit}
        onSelectCardBack={handleSelectCardBack}
        onSelectCharacter={handleSelectCharacter}
        onSelectOutfit={handleSelectOutfit}
      />
      <ProfileModal
        open={profileOpen}
        player={player}
        onClose={() => setProfileOpen(false)}
        onOpenCustomize={() => { setProfileOpen(false); setCustomizeOpen(true); }}
        onRegenerateName={handleRegenerateName}
        onSignOut={signOut}
      />
      <WinModal
        open={game.won}
        moves={game.state.moves}
        seconds={game.seconds}
        coinsEarned={coinsEarned}
        wagerPayout={currentWager > 0 ? currentWager * wagerTier.multiplier : 0}
        wagerStake={currentWager}
        cashWonPence={lastCashWonPence}
        onNewGame={handleStartNewGame}
      />
      <RewardedAdModal
        open={adOpen}
        adsWatchedToday={player?.ads_watched_today ?? 0}
        dailyCap={DAILY_AD_CAP}
        tokensPerAd={TOKENS_PER_AD}
        onClose={() => setAdOpen(false)}
        onReward={handleAdReward}
      />
      <WagerModal
        open={wagerOpen}
        coins={coins}
        currentWager={currentWager}
        onClose={() => setWagerOpen(false)}
        onSetWager={handleSetWager}
      />
      <LuckyPickModal
        open={luckyPickOpen}
        tokens={tokens}
        coins={coins}
        onClose={() => setLuckyPickOpen(false)}
        onWinTokens={handleLuckyPickWin}
        onSpendCoins={handleLuckyPickSpend}
      />
      <ResponsibleGamblingModal
        open={rgOpen}
        sessionSpent={player?.session_spent_coins ?? 0}
        lifetimeSpent={player?.lifetime_spent_coins ?? 0}
        onClose={() => setRgOpen(false)}
        onResetSession={handleResetSession}
      />
      <SpeedMatchModal
        open={speedMatchOpen}
        playerName={player?.player_name ?? 'Player'}
        speedPoints={player?.speed_points ?? 0}
        coins={coins}
        onClose={() => setSpeedMatchOpen(false)}
        onComplete={handleSpeedMatchComplete}
      />
      <DailyRewardModal
        open={dailyRewardOpen}
        dailyStreak={player?.daily_streak ?? 0}
        bestDailyStreak={player?.best_daily_streak ?? 0}
        streakFreezes={player?.streak_freezes ?? 0}
        claimed={player?.daily_reward_claimed ?? false}
        onClaim={handleClaimDailyReward}
        onClose={() => setDailyRewardOpen(false)}
      />
      <CharacterUnlockModal
        character={unlockedCharacter}
        onClose={() => setUnlockedCharacter(null)}
      />
    </div>
  );
}
