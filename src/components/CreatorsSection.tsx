import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { CREATORS, type CreatorProfile } from '../data/creators';
import { audioEngine } from '../utils/audioEngine';

interface CreatorsSectionProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export function CreatorsSection({ onModalStateChange }: CreatorsSectionProps) {
  const [activeCreator, setActiveCreator] = useState<CreatorProfile | null>(null);
  const [modalTab, setModalTab] = useState<'dossier' | 'pdf'>('dossier');
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onModalStateChange?.(Boolean(activeCreator));
  }, [activeCreator, onModalStateChange]);

  useEffect(() => {
    if (!activeCreator) return;
    closeBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeCreator]);

  function openCreatorModal(creator: CreatorProfile, initialTab: 'dossier' | 'pdf' = 'dossier') {
    lastTriggerRef.current = document.activeElement as HTMLElement | null;
    audioEngine.playWhoosh();
    setModalTab(initialTab);
    setActiveCreator(creator);
  }

  function closeModal() {
    setActiveCreator(null);
    if (lastTriggerRef.current && typeof lastTriggerRef.current.focus === 'function') {
      lastTriggerRef.current.focus();
    }
  }

  return (
    <>
      <section id="creators" className="creators-section" aria-labelledby="creators-heading">
        <div className="section-bar">
          <div>
            <h2 id="creators-heading" className="section-title">
              The Creators &amp; Curators
            </h2>
            <p className="planner-subtitle">
              Curriculum Vitae &amp; portfolio dossiers of the three student authors behind this
              Shanghai editorial guide.
            </p>
          </div>
          <span className="section-count mono-meta whitespace-nowrap">03 PROFILES</span>
        </div>

        <div className="creators-grid">
          {CREATORS.map((creator) => (
            <article key={creator.id} className="creator-card">
              <div className="creator-card-header">
                <div className="creator-monogram" aria-hidden="true">
                  {creator.monogram}
                </div>
                <span className="mono-meta creator-index">{creator.indexCode}</span>
              </div>

              <div className="creator-identity">
                <h3 className="creator-name">{creator.name}</h3>
                <p className="creator-headline">{creator.headline}</p>
                <p className="creator-contact-line mono-meta">
                  {creator.location} · {creator.email}
                </p>
              </div>

              <p className="creator-about">{creator.about}</p>

              <dl className="creator-summary-list">
                <div className="creator-summary-row">
                  <dt className="mono-meta creator-dt">EDUCATION</dt>
                  <dd className="creator-dd">{creator.education[0]?.institution}</dd>
                </div>
                <div className="creator-summary-row">
                  <dt className="mono-meta creator-dt">KEY ACHIEVEMENT</dt>
                  <dd className="creator-dd">{creator.achievements[0]?.title}</dd>
                </div>
                <div className="creator-summary-row">
                  <dt className="mono-meta creator-dt">LANGUAGES</dt>
                  <dd className="creator-dd">{creator.languages.join(' · ')}</dd>
                </div>
                <div className="creator-summary-row">
                  <dt className="mono-meta creator-dt">CORE SKILLS</dt>
                  <dd className="creator-dd">{creator.skills.slice(0, 5).join(' · ')}</dd>
                </div>
              </dl>

              <div className="creator-actions">
                <button
                  type="button"
                  className="creator-primary-btn mono-meta"
                  aria-label={`View full CV for ${creator.name}`}
                  onClick={() => openCreatorModal(creator, 'dossier')}
                >
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>VIEW FULL CV</span>
                </button>
                <a
                  href={creator.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-pdf-link mono-meta"
                  aria-label={`Open original PDF CV for ${creator.name}`}
                >
                  <span>ORIGINAL PDF</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Creator CV Dossier Modal */}
      <div
        id="creator-cv-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
        aria-hidden={activeCreator ? 'false' : 'true'}
        className={activeCreator ? 'is-open' : ''}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        {activeCreator && (
          <div className="modal-panel cv-modal-panel">
            <div className="modal-top-bar">
              <span className="mono-meta">{activeCreator.indexCode} · CURRICULUM VITAE</span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="planner-segmented-row" role="tablist" aria-label="CV display mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={modalTab === 'dossier'}
                    className={`planner-seg-btn ${modalTab === 'dossier' ? 'is-active' : ''}`}
                    onClick={() => setModalTab('dossier')}
                  >
                    Structured CV
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={modalTab === 'pdf'}
                    className={`planner-seg-btn ${modalTab === 'pdf' ? 'is-active' : ''}`}
                    onClick={() => setModalTab('pdf')}
                  >
                    Original PDF
                  </button>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="modal-close-btn mono-meta"
                  onClick={closeModal}
                >
                  CLOSE [ESC]
                </button>
              </div>
            </div>

            <div className="cv-modal-header">
              <div>
                <h3 id="cv-modal-title" className="modal-title">
                  {activeCreator.name}
                </h3>
                <p className="modal-category mono-meta">{activeCreator.headline}</p>
              </div>
              <div className="cv-contact-block mono-meta">
                <span>{activeCreator.email}</span>
                <span>{activeCreator.phone}</span>
                <span>{activeCreator.location}</span>
              </div>
            </div>

            {modalTab === 'dossier' ? (
              <div className="cv-dossier-body">
                <div className="cv-section-block">
                  <p className="modal-label mono-meta">PROFILE / ABOUT</p>
                  <p className="modal-description">{activeCreator.about}</p>
                </div>

                <div className="cv-two-col">
                  <div className="cv-section-block">
                    <p className="modal-label mono-meta">ACHIEVEMENTS</p>
                    <ul className="cv-list">
                      {activeCreator.achievements.map((ach) => (
                        <li key={ach.title} className="cv-list-item">
                          <p className="cv-item-title">{ach.title}</p>
                          <p className="cv-item-meta mono-meta">{ach.issuer}</p>
                          {ach.detail && <p className="cv-item-detail">{ach.detail}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="cv-section-block">
                    <p className="modal-label mono-meta">EDUCATION</p>
                    <ul className="cv-list">
                      {activeCreator.education.map((edu) => (
                        <li key={edu.institution} className="cv-list-item">
                          <p className="cv-item-title">{edu.institution}</p>
                          <p className="cv-item-meta mono-meta">{edu.period}</p>
                          <p className="cv-item-detail">{edu.detail}</p>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <p className="modal-label mono-meta">LANGUAGES &amp; SKILLS</p>
                      <p className="cv-item-detail mb-2">
                        <strong className="font-bold text-black">Languages: </strong>
                        {activeCreator.languages.join(' · ')}
                      </p>
                      <p className="cv-item-detail">
                        <strong className="font-bold text-black">Skills &amp; Tools: </strong>
                        {activeCreator.skills.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="cv-section-block">
                  <p className="modal-label mono-meta">EXPERIENCE &amp; LEADERSHIP</p>
                  <div className="cv-exp-grid">
                    {activeCreator.experience.map((exp) => (
                      <div key={`${exp.role}-${exp.organization}`} className="cv-exp-item">
                        <div className="cv-exp-head">
                          <div>
                            <p className="cv-item-title">{exp.role}</p>
                            <p className="cv-item-meta mono-meta">{exp.organization}</p>
                          </div>
                          <span className="cv-item-meta mono-meta">{exp.period}</span>
                        </div>
                        <ul className="modal-highlights mt-2">
                          {exp.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cv-modal-footer">
                  <a
                    href={activeCreator.pdfUrl}
                    download={activeCreator.pdfFilename}
                    className="creator-primary-btn mono-meta"
                  >
                    DOWNLOAD ORIGINAL PDF
                  </a>
                </div>
              </div>
            ) : (
              <div className="cv-pdf-viewer">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3">
                  <span className="mono-meta text-neutral-600">{activeCreator.pdfFilename}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={activeCreator.pdfUrl}
                      download={activeCreator.pdfFilename}
                      className="creator-pdf-link mono-meta"
                    >
                      DOWNLOAD PDF
                    </a>
                    <a
                      href={activeCreator.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="creator-primary-btn mono-meta"
                    >
                      OPEN PDF IN NEW TAB ↗
                    </a>
                  </div>
                </div>
                <object
                  data={activeCreator.pdfUrl}
                  type="application/pdf"
                  aria-label={`Original CV PDF for ${activeCreator.name}`}
                  className="cv-pdf-iframe"
                >
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <p className="text-sm text-neutral-700">
                      Inline PDF preview is unavailable in this browser frame. Open or download the
                      original CV document below.
                    </p>
                    <a
                      href={activeCreator.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="creator-primary-btn mono-meta"
                    >
                      OPEN {activeCreator.pdfFilename} ↗
                    </a>
                  </div>
                </object>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
