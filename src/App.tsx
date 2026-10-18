import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePlayerState } from '@/hooks/usePlayerState';
import { useGame } from '@/hooks/useGame';
import { getLevelFromXp } from '@/game/levels';
import { getTodayReward, canClaimDailyReward } from '@/game/dailyRewards';
import { sounds } from '@/lib/sounds';

import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import WinModal from '@/components/WinModal';
import ProfileModal from '@/components/ProfileModal';
import CustomizeModal from '@/components/CustomizeModal';
import DailyRewardModal from '@/components/DailyRewardModal';
import ShopModal from '@/components/ShopModal';
import LevelUpToast from '@/components/LevelUpToast';
import LevelModal from '@/components/LevelModal';
import SpeedMatchModal from '@/components/SpeedMatchModal';
import LuckyPickModal from '@/components/LuckyPickModal';

type ModalId = 'profile' | 'customize' | 'daily' | 'shop' | 'levelinfo' | 'speedmatch' | 'luckypick' | null;

const ONBOARDING_KEY = 'mms_onboarded_v1';

export default function App() {
  const { session, loading: authLoading, signOut } = useAuth();
  const userId = session?.user?.id;
  const { state, inventory, loading: stateLoading, updateState, addToInventory, ownsItem, refresh } = usePlayerState(userId);

  const [modal, setModal] = useState<ModalId>(null);
  const [winData, setWinData] = useState<{ seconds: number; moves: number; coins: number } | null>(null);
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem(ONBOARDING_KEY));
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  const handleWin = useCallback(
    (seconds: number, moves: number) => {
      const coinsEarned = 100;
      setWinData({ seconds, moves, coins: coinsEarned });
      refresh();
    },
    [refresh]
  );

  const { gameState, hintTarget, newGame, handleDraw, handleMove, handleUndo, handleHint, handleAutoFinish } =
    useGame(userId, handleWin);

  const handleNewGame = useCallback(() => {
    setWinData(null);
    newGame();
  }, [newGame]);

  const handleOnboarded = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setOnboarded(true);
  };

  const handleClaimDailyReward = async () => {
    if (!state) return;
    const reward = getTodayReward(state.daily_streak);
    const today = new Date().toISOString().split('T')[0];
    await updateState({
      coins: state.coins + reward.coins,
      tokens: state.tokens + reward.tokens,
      daily_reward_claimed: true,
      last_login_date: today,
      daily_streak: state.daily_streak + 1,
    });
    sounds.reward();
    setModal(null);
  };

  const handleCustomizeSelect = async (type: 'card_back' | 'character' | 'outfit', id: string) => {
    if (!state) return;
    if (type === 'card_back') await updateState({ active_card_back: id });
    if (type === 'character') await updateState({ active_character: id });
    if (type === 'outfit') await updateState({ active_outfit: id });
  };

  const handleBuyItem = async (itemType: 'card_back' | 'character' | 'outfit', id: string, cost: number) => {
    if (!state || state.coins < cost) return;
    await addToInventory(itemType, id);
    await updateState({ coins: state.coins - cost });
  };

  const handleBuyTokens = async (packId: string) => {
    if (!state) return;
    const tokenAmounts: Record<string, number> = { t1: 10, t2: 30, t3: 100 };
    const tokenCosts: Record<string, number> = { t1: 200, t2: 500, t3: 1500 };
    const tokens = tokenAmounts[packId] ?? 0;
    const cost = tokenCosts[packId] ?? 0;
    if (state.coins < cost) return;
    await updateState({ coins: state.coins - cost, tokens: state.tokens + tokens });
    sounds.coin();
  };

  const handleHintWithCost = useCallback(() => {
    if (!state || state.coins < 25) { sounds.error(); return; }
    updateState({ coins: state.coins - 25 });
    handleHint();
  }, [state, updateState, handleHint]);

  const handleUndoWithCost = useCallback(() => {
    if (!state || state.coins < 10) { sounds.error(); return; }
    updateState({ coins: state.coins - 10 });
    handleUndo();
  }, [state, updateState, handleUndo]);

  const ownedSet = new Set(inventory.map((i) => `${i.item_type}:${i.item_id}`));

  // Show daily reward modal automatically on first visit of the day
  const showDailyPrompt = state && canClaimDailyReward(state.last_login_date, state.daily_reward_claimed) && modal === null && !winData;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cozy-500" />
      </div>
    );
  }

  if (!session) return <AuthScreen onAuthed={() => {}} />;
  if (!onboarded) return <OnboardingScreen onComplete={handleOnboarded} />;

  const isLoading = stateLoading || !state;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cozy-500" />
      </div>
    );
  }

  const activeModal = modal ?? (showDailyPrompt ? 'daily' : null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header
        state={state}
        onProfile={() => setModal('profile')}
        onCustomize={() => setModal('customize')}
        onNewGame={handleNewGame}
      />

      <main className="w-full">
        <GameBoard
          gameState={gameState}
          onDraw={handleDraw}
          onMove={handleMove}
          onHint={handleHintWithCost}
          onUndo={handleUndoWithCost}
          onAutoFinish={handleAutoFinish}
          onNewGame={handleNewGame}
          hintTarget={hintTarget}
          cardBackId={state.active_card_back}
          hintCost={25}
          undoCost={10}
        />
      </main>

      {/* Win modal */}
      {winData && (
        <WinModal
          moves={gameState.moves}
          timeSeconds={winData.seconds}
          coinsWon={winData.coins}
          xpWon={50}
          onClose={() => setWinData(null)}
          onNewGame={handleNewGame}
        />
      )}

      {/* Level-up toast */}
      {levelUpLevel && (
        <LevelUpToast level={levelUpLevel} onDismiss={() => setLevelUpLevel(null)} />
      )}

      {/* Modals */}
      {activeModal === 'profile' && (
        <ProfileModal state={state} onClose={() => setModal(null)} onSignOut={signOut} />
      )}
      {activeModal === 'customize' && (
        <CustomizeModal
          state={state}
          ownedItems={ownedSet}
          onClose={() => setModal(null)}
          onSelect={handleCustomizeSelect}
          onBuy={handleBuyItem}
        />
      )}
      {activeModal === 'daily' && (
        <DailyRewardModal state={state} onClose={() => setModal(null)} onClaim={handleClaimDailyReward} />
      )}
      {activeModal === 'shop' && (
        <ShopModal
          state={state}
          onClose={() => setModal(null)}
          onBuyCoins={() => {}}
          onBuyTokens={handleBuyTokens}
        />
      )}
      {activeModal === 'levelinfo' && (
        <LevelModal state={state} onClose={() => setModal(null)} />
      )}
      {activeModal === 'speedmatch' && (
        <SpeedMatchModal
          onClose={() => setModal(null)}
          onComplete={() => setModal(null)}
          tokens={state.tokens}
        />
      )}
      {activeModal === 'luckypick' && (
        <LuckyPickModal
          onClose={() => setModal(null)}
          onWin={async (coins, tokens) => {
            await updateState({ coins: state.coins + coins, tokens: state.tokens + tokens });
          }}
          cost={50}
          canAfford={state.coins >= 50}
        />
      )}
    </div>
  );
}
