import { useState } from 'react';
import { Download, Check, Film, Image, AlertCircle, Archive } from 'lucide-react';

interface MediaItem {
  png: string;
  jpg: string;
  label: string;
}

interface VideoItem {
  filename: string;
  label: string;
}

const SCREENSHOTS: MediaItem[] = [
  { png: '01-game-board.png', jpg: '01-game-board.jpg', label: 'Game Board' },
  { png: '02-daily-reward-modal.png', jpg: '02-daily-reward-modal.jpg', label: 'Daily Reward' },
  { png: '03-profile-modal.png', jpg: '03-profile-modal.jpg', label: 'Profile' },
  { png: '04-wallet-overview.png', jpg: '04-wallet-overview.jpg', label: 'Wallet Overview' },
  { png: '05-wallet-deposit.png', jpg: '05-wallet-deposit.jpg', label: 'Wallet Deposit' },
  { png: '06-wallet-withdraw.png', jpg: '06-wallet-withdraw.jpg', label: 'Wallet Withdraw' },
  { png: '07-wager-modal.png', jpg: '07-wager-modal.jpg', label: 'Wager Modal' },
  { png: '08-levels-modal.png', jpg: '08-levels-modal.jpg', label: 'Levels' },
  { png: '09-customize-modal.png', jpg: '09-customize-modal.jpg', label: 'Customize' },
  { png: '10-shop-modal.png', jpg: '10-shop-modal.jpg', label: 'Shop' },
];

const VIDEOS: VideoItem[] = [
  { filename: '01-gameplay-preview.mp4', label: 'Gameplay Preview' },
  { filename: '02-wallet-wager-preview.mp4', label: 'Wallet & Wager Preview' },
  { filename: '03-shop-customize-preview.mp4', label: 'Shop & Customize Preview' },
];

const ALL_FILES = [
  ...SCREENSHOTS.map((s) => s.png),
  ...VIDEOS.map((v) => v.filename),
];

export default function AppStoreMedia() {
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (filename: string) => {
    setDownloading(filename);
    setError(null);
    try {
      const response = await fetch(`downloads/${filename}`);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 2000);
      setDownloaded((prev) => new Set(prev).add(filename));
    } catch (err) {
      setError(`Couldn't download ${filename}. Try the direct link button or right-click the preview.`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    for (const filename of ALL_FILES) {
      await handleDownload(filename);
      await new Promise((r) => setTimeout(r, 1000));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">App Store Media</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Screenshots: 1242×2688px PNG/JPEG (6.5" iPhone). Videos: H.264+AAC MP4, 30fps.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="downloads/all-screenshots-and-videos.zip"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-amber-400"
            >
              <Archive size={18} />
              Download ZIP
            </a>
            <button
              onClick={handleDownloadAll}
              disabled={downloading !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-700 disabled:opacity-50"
            >
              <Download size={18} />
              Download All
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-800 bg-rose-950/50 p-4 text-sm text-rose-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
            <span>{downloaded.size} of {ALL_FILES.length} downloaded</span>
            {downloaded.size === ALL_FILES.length && <span className="text-green-400">All files downloaded!</span>}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${(downloaded.size / ALL_FILES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Screenshots */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Image size={20} className="text-amber-400" />
            <h2 className="text-lg font-semibold">Screenshots</h2>
            <span className="text-xs text-neutral-500">1242×2688 · 6.5" iPhone · PNG or JPEG</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {SCREENSHOTS.map((item) => {
              const isDone = downloaded.has(item.png);
              const isDownloading = downloading === item.png;
              return (
                <div
                  key={item.png}
                  className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
                >
                  <div className="relative aspect-[1242/2688] overflow-hidden">
                    <img
                      src={`downloads/${item.jpg}`}
                      alt={item.label}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    {isDone && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                        <div className="rounded-full bg-green-500 p-2">
                          <Check size={20} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="mb-2 truncate text-xs font-medium text-neutral-300">{item.label}</p>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleDownload(item.png)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-1 rounded-lg bg-neutral-800 px-2 py-1.5 text-xs font-medium text-neutral-100 transition hover:bg-neutral-700 disabled:opacity-50"
                      >
                        {isDownloading ? '...' : isDone ? <Check size={14} /> : <Download size={14} />}
                        PNG
                      </button>
                      <button
                        onClick={() => handleDownload(item.jpg)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-1 rounded-lg bg-neutral-800 px-2 py-1.5 text-xs font-medium text-neutral-100 transition hover:bg-neutral-700 disabled:opacity-50"
                      >
                        <Download size={14} />
                        JPG
                      </button>
                      <a
                        href={`downloads/${item.png}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-lg bg-neutral-800 px-2 py-1.5 text-xs font-medium text-neutral-100 transition hover:bg-neutral-700"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Videos */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Film size={20} className="text-amber-400" />
            <h2 className="text-lg font-semibold">App Preview Videos</h2>
            <span className="text-xs text-neutral-500">H.264 + AAC · 30fps · 15-20s · MP4</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {VIDEOS.map((item) => {
              const isDone = downloaded.has(item.filename);
              const isDownloading = downloading === item.filename;
              return (
                <div
                  key={item.filename}
                  className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
                >
                  <div className="relative aspect-[1242/2688] overflow-hidden bg-black">
                    <video
                      src={`downloads/${item.filename}`}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      playsInline
                      controls
                    />
                  </div>
                  <div className="p-3">
                    <p className="mb-2 text-sm font-medium text-neutral-200">{item.label}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(item.filename)}
                        disabled={isDownloading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neutral-800 px-2 py-2 text-sm font-medium text-neutral-100 transition hover:bg-neutral-700 disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <span className="animate-pulse">Saving...</span>
                        ) : isDone ? (
                          <>
                            <Check size={16} /> Saved
                          </>
                        ) : (
                          <>
                            <Download size={16} /> Save
                          </>
                        )}
                      </button>
                      <a
                        href={`downloads/${item.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 transition hover:bg-neutral-700"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Instructions */}
        <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-200">How to upload to App Store Connect</h3>
          <ol className="space-y-2 text-sm text-neutral-400">
            <li>1. Click "Download ZIP" above to get all files at once, or download individual files</li>
            <li>2. Unzip the file on your Mac</li>
            <li>3. Go to App Store Connect → your app → Media → Screenshots section</li>
            <li>4. Under "6.5" Display", drag the PNG or JPEG screenshot files into the upload area</li>
            <li>5. For App Previews, click "Choose File" and select the MP4 video files</li>
            <li>6. Only the first 3 screenshots appear on the install sheet — pick your best ones</li>
          </ol>
          <div className="mt-4 rounded-lg bg-neutral-800/50 p-3 text-xs text-neutral-500">
            <strong className="text-neutral-400">Having trouble?</strong> Click "Open" to view the file in a new tab, then right-click and choose "Save Image As" (or "Save Video As"). Or use the "Download ZIP" button to get everything at once.
          </div>
        </div>
      </div>
    </div>
  );
}
