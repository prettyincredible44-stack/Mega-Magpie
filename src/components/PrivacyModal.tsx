import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 glass flex items-center justify-between border-b border-brand-800/60 p-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">Privacy Policy</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-felt-600">
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm leading-relaxed text-white/70">
          <section>
            <h3 className="mb-1 font-semibold text-white">Overview</h3>
            <p>
              Mega Magpie Solitaire is a free-to-play game. We do not ask for payment,
              and there is no gambling, wagering, or real-money rewards of any kind.
              All points and tokens in the game are purely virtual and have no monetary value.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">Data We Collect</h3>
            <p>
              When you create an account we store your email address and a generated
              player name so we can save your progress across devices. We also store
              your game statistics (games played, games won, best time, level, XP)
              and your cosmetic preferences (card back, character, outfit).
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">Data We Do Not Collect</h3>
            <p>
              We do not collect payment information because the game is completely free.
              We do not collect location data, contacts, photos, or health information.
              No third-party analytics or advertising SDKs are used.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">How We Use Your Data</h3>
            <p>
              Your data is used solely to provide and improve the game experience —
              saving your progress, showing your statistics, and personalizing your
              cosmetics. We do not sell or share your data with third parties.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">Data Storage</h3>
            <p>
              Your data is stored securely on our backend provider (Supabase) and is
              protected by row-level security policies that ensure only you can read
              and modify your own player data.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">Your Rights</h3>
            <p>
              You can request deletion of your account and all associated data at any
              time by signing out — your game progress will no longer be accessible.
              To permanently delete your data, contact us at support@megamagpie.com.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">Children's Privacy</h3>
            <p>
              The game is suitable for all ages. We do not knowingly collect data from
              children under 13 without parental consent. If you believe a child has
              registered without consent, contact us and we will delete the account.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold text-white">Contact</h3>
            <p>
              Questions about this policy? Email support@megamagpie.com.
            </p>
          </section>

          <p className="pt-2 text-xs text-white/30">Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
