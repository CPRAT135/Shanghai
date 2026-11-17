interface EntryCurtainProps {
  dismissed: boolean;
  instant: boolean;
  onDismiss: (withSound: boolean) => void;
}

export function EntryCurtain({ dismissed, instant, onDismiss }: EntryCurtainProps) {
  return (
    <div
      id="entry-curtain"
      role="dialog"
      aria-modal="true"
      aria-label="Shanghai Destination Guide Entry"
      aria-hidden={dismissed ? 'true' : 'false'}
      className={dismissed ? 'is-dismissed' : ''}
      style={instant ? { transition: 'none' } : undefined}
    >
      <div className="curtain-inner">
        <p className="curtain-coords">SHANGHAI — 31.2304° N, 121.4737° E</p>
        <h2 className="curtain-title">Destination Guide &amp; City Explorer</h2>
        <p className="curtain-subtitle">
          Curated places, timeless neighborhoods, AI itinerary planning, and modern horizons along
          the Huangpu River.
        </p>
        <div className="curtain-actions">
          <button
            id="enter-with-sound"
            type="button"
            className="curtain-btn-primary"
            onClick={() => onDismiss(true)}
          >
            [ ENTER GUIDE — WITH SOUND ]
          </button>
          <button
            id="enter-silently"
            type="button"
            className="curtain-btn-secondary"
            onClick={() => onDismiss(false)}
          >
            [ ENTER SILENTLY ]
          </button>
        </div>
      </div>
    </div>
  );
}
