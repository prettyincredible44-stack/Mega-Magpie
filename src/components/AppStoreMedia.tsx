import { X } from 'lucide-react';

interface AppStoreMediaProps {
  onClose: () => void;
}

export default function AppStoreMedia({ onClose }: AppStoreMediaProps) {
  const screenshots = [
    { src: '/01-game-board.png', label: 'Game Board' },
    { src: '/02-daily-reward-modal.png', label: 'Daily Reward' },
    { src: '/03-profile-modal.png', label: 'Profile' },
    { src: '/08-levels-modal.png', label: 'Levels' },
    { src: '/09-customize-modal.png', label: 'Customize' },
    { src: '/10-shop-modal.png', label: 'Shop' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 glass flex items-center justify-between p-4 border-b border-brand-800/60 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">App Store Screenshots</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-felt-600">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {screenshots.map((s) => (
            <div key={s.src} className="rounded-xl overflow-hidden border border-brand-800/40">
              <img src={s.src} alt={s.label} className="w-full h-auto" />
              <p className="text-white/60 text-xs text-center py-1.5 bg-felt-700/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
