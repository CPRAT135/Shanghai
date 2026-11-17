interface HeaderAndOverlayProps {
  soundEnabled: boolean;
  menuOpen: boolean;
  clockText: string;
  onToggleSound: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

const NAV_ITEMS = [
  { href: '#hero', title: 'Home', index: '01 / PROLOGUE' },
  { href: '#marquee', title: 'Destination Reel', index: '02 / GALLERY' },
  { href: '#statement', title: 'City Spirit', index: '03 / OVERVIEW' },
  { href: '#destinations', title: 'Iconic Places', index: '04 / 06 STOPS' },
  { href: '#planner', title: 'AI Destination Planner', index: '05 / CONCIERGE' },
  { href: '#creators', title: 'The Creators & CVs', index: '06 / 03 PROFILES' },
  { href: '#footer', title: 'Local Time & Index', index: '07 / UTC+8' },
];

export function HeaderAndOverlay({
  soundEnabled,
  menuOpen,
  clockText,
  onToggleSound,
  onToggleMenu,
  onCloseMenu,
}: HeaderAndOverlayProps) {
  return (
    <>
      <header className="site-header">
        <a href="#top" className="brand-logo" aria-label="Shanghai Home">
          sh
        </a>
        <div className="header-controls">
          <button
            id="sound-toggle"
            type="button"
            className="sound-toggle mono-meta"
            aria-pressed={soundEnabled ? 'true' : 'false'}
            aria-label="Toggle ambient audio"
            onClick={onToggleSound}
          >
            {soundEnabled ? 'SOUND: ON' : 'SOUND: OFF'}
          </button>
          <button
            id="menu-toggle"
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen ? 'true' : 'false'}
            aria-controls="nav-overlay"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={onToggleMenu}
          >
            <svg
              className="menu-plus-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <nav
        id="nav-overlay"
        aria-label="Main Navigation"
        aria-hidden={menuOpen ? 'false' : 'true'}
        className={menuOpen ? 'is-open' : ''}
      >
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="nav-item">
              <a
                href={item.href}
                className="nav-link"
                tabIndex={menuOpen ? 0 : -1}
                onClick={onCloseMenu}
              >
                <span className="nav-link-title">{item.title}</span>
                <span className="nav-link-index mono-meta">{item.index}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-overlay-footer mono-meta">
          <span>31.2304° N, 121.4737° E</span>
          <span id="overlay-clock">{clockText}</span>
        </div>
      </nav>
    </>
  );
}
