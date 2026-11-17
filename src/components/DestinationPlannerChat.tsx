import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowUpRight, RotateCcw, Send } from 'lucide-react';
import {
  DEFAULT_PLANNER_PREFERENCES,
  PLANNER_STARTER_PROMPTS,
  type ChatTurn,
  type PlannerPreferences,
} from '../utils/plannerLogic';
import { audioEngine } from '../utils/audioEngine';

interface DestinationPlannerChatProps {
  externalPrompt: { id: number; text: string } | null;
}

const DURATION_OPTIONS = ['1 Day', '2 Days', '3 Days', '5 Days'];
const PACE_OPTIONS = ['Relaxed', 'Balanced', 'Packed'];
const FOCUS_OPTIONS = [
  'Architecture & Landmarks',
  'Heritage & Canals',
  'Food & Nightlife',
  'Photography',
];

const WELCOME_MESSAGE: ChatTurn = {
  role: 'model',
  text:
    'Welcome to the Shanghai Editorial Destination Planner. Select your trip duration, pace, and focus above — or ask in English or Indonesian for custom day-by-day itineraries, Shanghai Metro exits, golden-hour timing, and neighborhood routes across Lujiazui, The Bund, Yu Garden, Nanjing Road, 1933 Old Millfun, and Zhujiajiao.',
};

function renderFormattedInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function FormattedPlannerMessage({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="planner-formatted-copy">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-2" aria-hidden="true" />;
        }
        if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
          const cleanHeading = line.replace(/^#{1,3}\s+/, '');
          return (
            <h4 key={idx} className="planner-msg-heading">
              {renderFormattedInline(cleanHeading)}
            </h4>
          );
        }
        if (/^[-*•]\s+/.test(line)) {
          const cleanBullet = line.replace(/^[-*•]\s+/, '');
          return (
            <p key={idx} className="planner-msg-bullet">
              <span aria-hidden="true" className="planner-bullet-dash">
                —
              </span>
              <span>{renderFormattedInline(cleanBullet)}</span>
            </p>
          );
        }
        if (/^\d+\.\s+/.test(line)) {
          return (
            <p key={idx} className="planner-msg-numbered">
              {renderFormattedInline(line)}
            </p>
          );
        }
        return (
          <p key={idx} className="planner-msg-paragraph">
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export function DestinationPlannerChat({ externalPrompt }: DestinationPlannerChatProps) {
  const [preferences, setPreferences] = useState<PlannerPreferences>(DEFAULT_PLANNER_PREFERENCES);
  const [messages, setMessages] = useState<ChatTurn[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const lastExternalIdRef = useRef<number>(0);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function executeChatRequest(apiPayloadMessages: ChatTurn[]) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/planner/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiPayloadMessages,
          preferences,
        }),
      });

      const rawText = await response.text();
      let data: { reply?: string; error?: string } = {};
      try {
        data = rawText ? (JSON.parse(rawText) as { reply?: string; error?: string }) : {};
      } catch {
        const contentType = response.headers.get('content-type') || 'unknown';
        if (contentType.includes('text/html') || rawText.trim().startsWith('<!')) {
          throw new Error(
            'Backend API endpoint is unavailable on this static host (received HTML instead of JSON). Please open the active full-stack preview or restart the server.',
          );
        }
        throw new Error(`Invalid response format from planner API (HTTP ${response.status}).`);
      }

      if (!response.ok || !data.reply) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.reply! }]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach the Shanghai AI Destination Planner.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessageText(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    audioEngine.playWhoosh();

    const historyForApi = messages.filter((_, idx) => idx > 0);
    const nextMessages: ChatTurn[] = [...messages, { role: 'user', text: trimmed }];
    const apiPayloadMessages: ChatTurn[] = [...historyForApi, { role: 'user', text: trimmed }];

    setMessages(nextMessages);
    setInput('');
    await executeChatRequest(apiPayloadMessages);
  }

  async function retryLastRequest() {
    if (isLoading) return;
    const historyForApi = messages.filter((_, idx) => idx > 0);
    if (historyForApi.length === 0 || historyForApi[historyForApi.length - 1]?.role !== 'user') {
      return;
    }
    await executeChatRequest(historyForApi);
  }

  useEffect(() => {
    if (externalPrompt && externalPrompt.id !== lastExternalIdRef.current) {
      lastExternalIdRef.current = externalPrompt.id;
      void sendMessageText(externalPrompt.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessageText(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessageText(input);
    }
  }

  function handleClearThread() {
    setMessages([WELCOME_MESSAGE]);
    setErrorMessage(null);
    setInput('');
    inputRef.current?.focus();
  }

  const userTurnCount = messages.filter((m) => m.role === 'user').length;

  return (
    <section id="planner" className="planner-section" aria-labelledby="planner-heading">
      <div className="section-bar">
        <div>
          <h2 id="planner-heading" className="section-title">
            AI Destination Planner
          </h2>
          <p className="planner-subtitle">
            Multi-turn Shanghai itinerary concierge with live metro routing and local CST timing.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="section-count mono-meta whitespace-nowrap">
            {String(userTurnCount).padStart(2, '0')} QUERIES
          </span>
          <button
            type="button"
            className="planner-reset-btn mono-meta"
            onClick={handleClearThread}
            disabled={isLoading || userTurnCount === 0}
            aria-label="Clear conversation thread"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>CLEAR</span>
          </button>
        </div>
      </div>

      {/* Trip Preferences Toolbar */}
      <div className="planner-controls-grid">
        <div className="planner-control-group">
          <span className="planner-control-label mono-meta">DURATION</span>
          <div className="planner-segmented-row" role="group" aria-label="Trip duration">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={preferences.duration === opt}
                className={`planner-seg-btn ${preferences.duration === opt ? 'is-active' : ''}`}
                onClick={() => setPreferences((p) => ({ ...p, duration: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="planner-control-group">
          <span className="planner-control-label mono-meta">PACE</span>
          <div className="planner-segmented-row" role="group" aria-label="Travel pace">
            {PACE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={preferences.pace === opt}
                className={`planner-seg-btn ${preferences.pace === opt ? 'is-active' : ''}`}
                onClick={() => setPreferences((p) => ({ ...p, pace: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="planner-control-group planner-control-focus">
          <span className="planner-control-label mono-meta">FOCUS</span>
          <div className="planner-segmented-row" role="group" aria-label="Itinerary focus">
            {FOCUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={preferences.focus === opt}
                className={`planner-seg-btn ${preferences.focus === opt ? 'is-active' : ''}`}
                onClick={() => setPreferences((p) => ({ ...p, focus: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Starter Prompt Bar */}
      <div className="planner-starters" aria-label="Suggested itinerary prompts">
        <span className="planner-control-label mono-meta">QUICK ROUTES</span>
        <div className="planner-starters-list">
          {PLANNER_STARTER_PROMPTS.map((starter) => (
            <button
              key={starter.label}
              type="button"
              disabled={isLoading}
              className="planner-starter-btn"
              onClick={() => void sendMessageText(starter.prompt)}
            >
              <span>{starter.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Multi-Turn Chat Thread */}
      <div className="planner-shell">
        <div
          ref={threadRef}
          className="planner-thread"
          role="log"
          aria-live="polite"
          aria-label="Destination planner conversation history"
          data-testid="planner-thread"
        >
          {messages.map((msg, idx) => (
            <article
              key={idx}
              className={`planner-turn ${msg.role === 'user' ? 'is-user' : 'is-model'}`}
            >
              <div className="planner-turn-meta mono-meta">
                <span>{msg.role === 'user' ? 'TRAVELER' : 'SHANGHAI AI CONCIERGE'}</span>
                <span>TURN {String(idx + 1).padStart(2, '0')}</span>
              </div>
              <div className="planner-turn-body">
                {msg.role === 'user' ? (
                  <p className="planner-user-copy">{msg.text}</p>
                ) : (
                  <FormattedPlannerMessage text={msg.text} />
                )}
              </div>
            </article>
          ))}

          {isLoading && (
            <div className="planner-turn is-model" aria-busy="true">
              <div className="planner-turn-meta mono-meta">
                <span>SHANGHAI AI CONCIERGE</span>
                <span>COMPOSING ROUTE</span>
              </div>
              <p className="planner-loading-copy">
                Mapping Shanghai Metro connections and optimal time windows...
              </p>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="planner-error-banner" role="alert">
            <span>{errorMessage}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="planner-error-dismiss mono-meta"
                onClick={() => void retryLastRequest()}
                disabled={isLoading}
              >
                RETRY
              </button>
              <button
                type="button"
                className="planner-error-dismiss mono-meta"
                onClick={() => setErrorMessage(null)}
              >
                DISMISS
              </button>
            </div>
          </div>
        )}

        <form className="planner-input-bar" onSubmit={handleSubmit}>
          <label htmlFor="planner-input" className="sr-only">
            Ask the Shanghai AI Destination Planner
          </label>
          <textarea
            id="planner-input"
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for a custom Shanghai route, metro directions, or dining stops (English / Bahasa Indonesia)..."
            className="planner-textarea"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="planner-send-btn mono-meta"
            disabled={isLoading || input.trim().length === 0}
            aria-label="Send message to AI Destination Planner"
          >
            <span>{isLoading ? 'PLANNING...' : 'SEND'}</span>
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
