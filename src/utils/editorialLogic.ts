export function formatShanghaiClock(date: Date): string {
  const utcMs = date.getTime();
  const shanghaiMs = utcMs + 8 * 60 * 60 * 1000;
  const sh = new Date(shanghaiMs);
  const hh = String(sh.getUTCHours()).padStart(2, '0');
  const mm = String(sh.getUTCMinutes()).padStart(2, '0');
  const ss = String(sh.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss} CST`;
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clampMasterGain(gain: number): number {
  return Math.max(0.0001, Math.min(0.7, gain));
}

export function clampTickGain(gain: number): number {
  return Math.max(0.0001, Math.min(0.12, gain));
}

export function evaluateEditorialEase(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  // Cubic-bezier approximation for (0.16, 1, 0.3, 1)
  return 1 - Math.pow(1 - clamped, 4);
}

export function buildArchitecturalFallbackSvg(
  title: string,
  code: string,
  variantIndex: number,
): string {
  const safeTitle = title.replace(/[<>&"']/g, '');
  const safeCode = code.replace(/[<>&"']/g, '');
  const mode = Math.abs(variantIndex) % 3;
  let geometry = '';

  if (mode === 0) {
    geometry =
      '<line x1="120" y1="540" x2="120" y2="140" stroke="#000" stroke-width="1" stroke-opacity="0.35"/>' +
      '<polygon points="360,540 400,70 440,540" fill="none" stroke="#000" stroke-width="1.2"/>' +
      '<rect x="260" y="210" width="72" height="330" fill="none" stroke="#000" stroke-width="1" stroke-opacity="0.5"/>' +
      '<rect x="470" y="160" width="64" height="380" fill="none" stroke="#000" stroke-width="1" stroke-opacity="0.5"/>';
  } else if (mode === 1) {
    geometry =
      '<path d="M80 420 Q400 320 720 420" fill="none" stroke="#000" stroke-width="1.2"/>' +
      '<path d="M160 420 Q400 220 640 420" fill="none" stroke="#000" stroke-width="1" stroke-opacity="0.45"/>' +
      '<line x1="80" y1="450" x2="720" y2="450" stroke="#000" stroke-width="1" stroke-opacity="0.35"/>';
  } else {
    geometry =
      '<rect x="180" y="130" width="440" height="320" fill="none" stroke="#000" stroke-width="1.1"/>' +
      '<line x1="180" y1="130" x2="620" y2="450" stroke="#000" stroke-width="1" stroke-opacity="0.35"/>' +
      '<line x1="620" y1="130" x2="180" y2="450" stroke="#000" stroke-width="1" stroke-opacity="0.35"/>' +
      '<circle cx="400" cy="290" r="90" fill="none" stroke="#000" stroke-width="1"/>';
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">` +
    `<rect width="800" height="600" fill="#F4F4F4"/>` +
    `<g stroke="#000000" stroke-opacity="0.08" stroke-width="1">` +
    `<line x1="0" y1="150" x2="800" y2="150"/><line x1="0" y1="300" x2="800" y2="300"/><line x1="0" y1="450" x2="800" y2="450"/>` +
    `<line x1="200" y1="0" x2="200" y2="600"/><line x1="400" y1="0" x2="400" y2="600"/><line x1="600" y1="0" x2="600" y2="600"/>` +
    `</g>` +
    geometry +
    `<text x="48" y="64" font-family="monospace" font-size="14" letter-spacing="2" fill="#525252">${safeCode}</text>` +
    `<text x="48" y="556" font-family="sans-serif" font-weight="700" font-size="22" letter-spacing="-1" fill="#000000">${safeTitle}</text>` +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
