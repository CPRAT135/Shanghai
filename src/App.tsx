import { useCallback, useEffect, useRef, useState } from 'react';
import { DESTINATIONS, type Destination } from './data/destinations';
import { buildArchitecturalFallbackSvg, formatShanghaiClock } from './utils/editorialLogic';
import { audioEngine } from './utils/audioEngine';
import { CustomCursor } from './components/CustomCursor';
import { EntryCurtain } from './components/EntryCurtain';
import { HeaderAndOverlay } from './components/HeaderAndOverlay';
import { BriefingModal } from './components/BriefingModal';
import { DestinationPlannerChat } from './components/DestinationPlannerChat';
import { CreatorsSection } from './components/CreatorsSection';

const MARQUEE_SHAPES = ['marquee-shape-a', 'marquee-shape-b', 'marquee-shape-c'];
const HERO_CHARS = ['S', 'H', 'A', 'N', 'G', 'H', 'A', 'I'];

export default function App() {
  const isAutostart =
    typeof window !== 'undefined' && window.location.search.includes('autostart=1');

  const [curtainDismissed, setCurtainDismissed] = useState<boolean>(isAutostart);
  const [revealed, setRevealed] = useState<boolean>(isAutostart);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedDestIndex, setSelectedDestIndex] = useState<number | null>(null);
  const [creatorModalOpen, setCreatorModalOpen] = useState<boolean>(false);
  const [statementInView, setStatementInView] = useState<boolean>(false);
  const [clockText, setClockText] = useState<string>(() => formatShanghaiClock(new Date()));
  const [plannerPrompt, setPlannerPrompt] = useState<{ id: number; text: string } | null>(null);

  const statementRef = useRef<HTMLElement | null>(null);
  const lastFocusedBeforeDestModalRef = useRef<HTMLElement | null>(null);

  // Sync audio state
  useEffect(() => {
    return audioEngine.subscribe(setSoundEnabled);
  }, []);

  // Live Shanghai UTC+8 clock
  useEffect(() => {
    const updateClock = () => setClockText(formatShanghaiClock(new Date()));
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Body scroll-lock & reveal state classes
  useEffect(() => {
    const isLocked =
      !curtainDismissed || menuOpen || selectedDestIndex !== null || creatorModalOpen;
    document.body.classList.toggle('is-locked', isLocked);
    document.body.classList.toggle('is-revealed', revealed);
  }, [curtainDismissed, menuOpen, selectedDestIndex, creatorModalOpen, revealed]);

  // Statement masked line reveal
  useEffect(() => {
    const el = statementRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setStatementInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStatementInView(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Global Escape handler for destination modal & nav overlay
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (selectedDestIndex !== null) {
        closeDestinationModal();
      } else if (menuOpen) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDestIndex, menuOpen]);

  const handleDismissCurtain = useCallback((withSound: boolean) => {
    if (withSound) {
      audioEngine.playBootChime();
    }
    setCurtainDismissed(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setRevealed(true);
      }, 80);
    });
  }, []);

  const handleToggleSound = useCallback(() => {
    audioEngine.toggle();
  }, []);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (next) audioEngine.playWhoosh();
      return next;
    });
  }, []);

  const openDestinationModal = useCallback((idx: number) => {
    lastFocusedBeforeDestModalRef.current = document.activeElement as HTMLElement | null;
    audioEngine.playWhoosh();
    setSelectedDestIndex(idx);
  }, []);

  const closeDestinationModal = useCallback(() => {
    setSelectedDestIndex(null);
    const prevEl = lastFocusedBeforeDestModalRef.current;
    if (prevEl && typeof prevEl.focus === 'function') {
      prevEl.focus();
    }
  }, []);

  const handlePlanAroundDestination = useCallback((dest: Destination) => {
    setSelectedDestIndex(null);
    setPlannerPrompt({
      id: Date.now(),
      text: `Build a half-day route anchored around ${dest.title} (${dest.category}), including Metro directions (${dest.metro}), nearby dining, and the best timing window (${dest.bestTime}).`,
    });
    const plannerEl = document.getElementById('planner');
    if (plannerEl) {
      plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const selectedDestination =
    selectedDestIndex !== null ? DESTINATIONS[selectedDestIndex] ?? null : null;

  return (
    <div id="top">
      <CustomCursor />

      <EntryCurtain
        dismissed={curtainDismissed}
        instant={isAutostart}
        onDismiss={handleDismissCurtain}
      />

      <HeaderAndOverlay
        soundEnabled={soundEnabled}
        menuOpen={menuOpen}
        clockText={clockText}
        onToggleSound={handleToggleSound}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero-section">
          <p className="hero-kicker mono-meta">SHANGHAI DESTINATION GUIDE · 31.2304° N, 121.4737° E</p>
          <h1 className="hero-headline" aria-label="SHANGHAI">
            {HERO_CHARS.map((ch, idx) => (
              <span key={idx} className="char-mask">
                <span className="char-inner" style={{ transitionDelay: `${idx * 45}ms` }}>
                  {ch}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-subheadline">
            Explore futuristic skylines, vibrant waterfronts, and centuries-old neighborhoods at the
            heart of China’s coastal metropolis.
          </p>
        </section>

        {/* Infinite Destination Marquee */}
        <section id="marquee" className="marquee-section" aria-label="Shanghai Destinations Visual Reel">
          <div className="marquee-header mono-meta">
            <span>SECTION 01 · VISUAL JOURNEY</span>
            <span>HOVER TO REVEAL COLOR</span>
          </div>
          <div className="marquee-track" id="marquee-track">
            {[false, true].map((isDuplicate) => (
              <div
                key={isDuplicate ? 'dup' : 'primary'}
                className="marquee-group"
                aria-hidden={isDuplicate ? 'true' : undefined}
              >
                {DESTINATIONS.map((dest, idx) => (
                  <button
                    key={`${isDuplicate ? 'dup' : 'main'}-${dest.id}`}
                    type="button"
                    className="marquee-card"
                    tabIndex={isDuplicate ? -1 : 0}
                    aria-label={isDuplicate ? undefined : `Open overview for ${dest.title}`}
                    onClick={() => openDestinationModal(idx)}
                  >
                    <div className={`marquee-media ${MARQUEE_SHAPES[idx % 3]}`}>
                      <img
                        className="editorial-photo"
                        src={dest.image}
                        alt={dest.alt}
                        loading="eager"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.dataset.fallbackApplied === 'true') return;
                          img.dataset.fallbackApplied = 'true';
                          img.src = buildArchitecturalFallbackSvg(dest.title, dest.code, idx);
                        }}
                      />
                    </div>
                    <div className="marquee-caption">
                      <span className="marquee-title">{dest.title}</span>
                      <span className="marquee-code mono-meta">{dest.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Centered Introductory Statement */}
        <section
          id="statement"
          ref={statementRef}
          className={`statement-section ${statementInView ? 'is-inview' : ''}`}
        >
          <p className="statement-kicker mono-meta">CITY OF CONTRASTS · HUANGPU RIVER</p>
          <h2 className="statement-heading">
            <span className="line-mask">
              <span className="line-inner" style={{ transitionDelay: '0ms' }}>
                Where historic riverfront walks
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner" style={{ transitionDelay: '90ms' }}>
                meet the glowing skyline
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner" style={{ transitionDelay: '180ms' }}>
                of modern Pudong.
              </span>
            </span>
          </h2>
          <p className="statement-body">
            Shanghai is a vibrant destination where centuries of heritage blend effortlessly with
            fast-paced city life. From tranquil canal towns and bustling pedestrian avenues to
            panoramic observation decks above the clouds, every district invites you to slow down and
            experience a different side of the city.
          </p>
        </section>

        {/* Curated Destination Grid */}
        <section id="destinations" className="grid-section">
          <div className="section-bar">
            <h2 className="section-title">Curated Destinations</h2>
            <span className="section-count mono-meta">06 STOPS</span>
          </div>
          <div className="destination-grid" id="destination-grid">
            {DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.id}
                type="button"
                id={`sector-${dest.id}`}
                className="destination-card"
                aria-label={`View full guide for ${dest.title}`}
                onClick={() => openDestinationModal(idx)}
              >
                <div className="destination-media">
                  <img
                    className="editorial-photo"
                    src={dest.image}
                    alt={dest.alt}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallbackApplied === 'true') return;
                      img.dataset.fallbackApplied = 'true';
                      img.src = buildArchitecturalFallbackSvg(dest.title, dest.code, idx);
                    }}
                  />
                  <div className="destination-overlay" aria-hidden="true" />
                  <span className="card-arrow-badge" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
                <div className="destination-meta-row">
                  <div>
                    <h3 className="destination-title">{dest.title}</h3>
                    <p className="destination-category">{dest.category}</p>
                  </div>
                  <span className="destination-code mono-meta">{dest.code}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Destination Planner Section */}
        <DestinationPlannerChat externalPrompt={plannerPrompt} />

        {/* Creators & CVs Section */}
        <CreatorsSection onModalStateChange={setCreatorModalOpen} />
      </main>

      <BriefingModal
        destination={selectedDestination}
        destinationIndex={selectedDestIndex ?? 0}
        onClose={closeDestinationModal}
        onPlanDestination={handlePlanAroundDestination}
      />

      {/* Footer */}
      <footer id="footer" className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <p className="footer-brand">shanghai.</p>
              <p className="footer-bio">
                An editorial travel guide for exploring Shanghai. Featuring neighborhood stories,
                practical metro routes, AI-assisted itinerary planning, and curated stops created by
                Calvin, Elianna, and Vyonne.
              </p>
            </div>
            <div>
              <p className="footer-heading mono-meta">INDEX &amp; STOPS</p>
              <ul className="footer-links" id="footer-dest-links">
                {DESTINATIONS.map((dest) => (
                  <li key={dest.id}>
                    <a
                      href={`#sector-${dest.id}`}
                      className="footer-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const target = document.getElementById(`sector-${dest.id}`);
                        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                    >
                      {dest.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#planner" className="footer-link">
                    AI Destination Planner
                  </a>
                </li>
                <li>
                  <a href="#creators" className="footer-link">
                    Creators &amp; CVs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="footer-heading mono-meta">LOCAL TELEMETRY</p>
              <p id="shanghai-clock" className="telemetry-clock">
                {clockText}
              </p>
              <p className="telemetry-coords mono-meta">31.2304° N, 121.4737° E</p>
              <p className="telemetry-coords mono-meta" style={{ marginTop: '8px' }}>
                TIME ZONE: UTC+8
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SHANGHAI DESTINATION GUIDE · CALVIN, ELIANNA &amp; VYONNE.</span>
            <span>MONOCHROME EDITION · ENGLISH · LIVE COORDINATES</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
