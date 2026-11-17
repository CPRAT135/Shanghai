import { useEffect, useRef } from 'react';
import type { Destination } from '../data/destinations';
import { buildArchitecturalFallbackSvg } from '../utils/editorialLogic';

interface BriefingModalProps {
  destination: Destination | null;
  destinationIndex: number;
  onClose: () => void;
  onPlanDestination: (destination: Destination) => void;
}

export function BriefingModal({
  destination,
  destinationIndex,
  onClose,
  onPlanDestination,
}: BriefingModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (destination && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [destination]);

  const isOpen = Boolean(destination);

  return (
    <div
      id="briefing-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={isOpen ? 'false' : 'true'}
      className={isOpen ? 'is-open' : ''}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {destination && (
        <div className="modal-panel">
          <div className="modal-top-bar">
            <span id="modal-code" className="mono-meta">
              {destination.code}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="modal-action-btn mono-meta"
                onClick={() => onPlanDestination(destination)}
              >
                PLAN WITH AI →
              </button>
              <button
                id="modal-close"
                ref={closeBtnRef}
                type="button"
                className="modal-close-btn mono-meta"
                onClick={onClose}
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>

          <div className="modal-hero-frame">
            <img
              id="modal-image"
              className="modal-hero-img"
              src={destination.image}
              alt={destination.alt}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallbackApplied === 'true') return;
                img.dataset.fallbackApplied = 'true';
                img.src = buildArchitecturalFallbackSvg(
                  destination.title,
                  destination.code,
                  destinationIndex,
                );
              }}
            />
          </div>

          <h3 id="modal-title" className="modal-title">
            {destination.title}
          </h3>
          <p id="modal-category" className="modal-category mono-meta">
            {destination.category}
          </p>

          <div className="modal-grid">
            <div>
              <p className="modal-label mono-meta">DESTINATION OVERVIEW</p>
              <p id="modal-description" className="modal-description">
                {destination.overview}
              </p>
            </div>
            <div className="modal-specs">
              <div className="modal-spec-item">
                <p className="modal-label mono-meta">BEST TIME TO VISIT</p>
                <p id="modal-best-time" className="modal-spec-value">
                  {destination.bestTime}
                </p>
              </div>
              <div className="modal-spec-item">
                <p className="modal-label mono-meta">SHANGHAI METRO ACCESS</p>
                <p id="modal-metro" className="modal-spec-value">
                  {destination.metro}
                </p>
              </div>
              <div>
                <p className="modal-label mono-meta">EXPERIENCE HIGHLIGHTS</p>
                <ul id="modal-highlights" className="modal-highlights">
                  {destination.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
