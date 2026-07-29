interface AdultAlertModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdultAlertModal({
  isOpen,
  onConfirm,
  onCancel,
}: AdultAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-dark-card border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 text-center flex flex-col items-center gap-4">
        {/* Warning Icon */}
        <div className="size-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 text-3xl shadow-lg">
          🔞
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white tracking-tight">
          18+ Age Verification Required
        </h3>

        {/* Warning Body */}
        <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
          Warning: This section contains mature & erotic content intended strictly for adults aged{' '}
          <span className="font-bold text-red-400">18 years and older</span>. Please confirm your age before proceeding.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-all transform hover:scale-105 cursor-pointer shadow-lg shadow-red-600/20"
          >
            I am 18 or Older (Verify)
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl bg-dark-hover hover:bg-border-light text-text-muted hover:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Go Back (Safe Mode)
          </button>
        </div>
      </div>
    </div>
  );
}
