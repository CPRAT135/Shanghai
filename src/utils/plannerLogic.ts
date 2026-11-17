export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export interface PlannerPreferences {
  duration: string;
  pace: string;
  focus: string;
}

export const DEFAULT_PLANNER_PREFERENCES: PlannerPreferences = {
  duration: '2 Days',
  pace: 'Balanced',
  focus: 'Architecture & Landmarks',
};

export const PLANNER_STARTER_PROMPTS: Array<{ label: string; prompt: string }> = [
  {
    label: '2-Day Architecture & Skyline Route',
    prompt:
      'Design a 2-day Shanghai architecture and skyline itinerary covering Lujiazui, The Bund, and 1933 Old Millfun with Metro line connections and optimal golden-hour timing.',
  },
  {
    label: 'Heritage & Canal Day Trip',
    prompt:
      'Plan a calm 1-day cultural route pairing Yu Garden in the morning with Zhujiajiao Water Town in the afternoon, including metro exits and local snack stops.',
  },
  {
    label: 'Evening Bund & Nanjing Walk',
    prompt:
      'Create an evening walking route from People’s Square through Nanjing Road Pedestrian Street to The Bund for night skyline views.',
  },
  {
    label: 'Itinerary 3 Hari (Bahasa Indonesia)',
    prompt:
      'Buatkan itinerary wisata Shanghai 3 hari yang seimbang antara ikon modern, distrik bersejarah, kuliner lokal, dan rute Shanghai Metro dalam bahasa Indonesia.',
  },
];

export function sanitizeChatMessages(messages: unknown, maxTurns = 24): ChatTurn[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  const cleaned: ChatTurn[] = [];
  for (const item of messages) {
    if (!item || typeof item !== 'object') continue;
    const rawRole = (item as { role?: unknown }).role;
    const rawText = (item as { text?: unknown }).text;
    if ((rawRole === 'user' || rawRole === 'model') && typeof rawText === 'string') {
      const text = rawText.trim();
      if (text.length > 0) {
        cleaned.push({ role: rawRole, text });
      }
    }
  }

  if (cleaned.length > maxTurns) {
    return cleaned.slice(cleaned.length - maxTurns);
  }
  return cleaned;
}

export function buildPlannerSystemInstruction(preferences?: Partial<PlannerPreferences>): string {
  const duration = preferences?.duration || DEFAULT_PLANNER_PREFERENCES.duration;
  const pace = preferences?.pace || DEFAULT_PLANNER_PREFERENCES.pace;
  const focus = preferences?.focus || DEFAULT_PLANNER_PREFERENCES.focus;

  return [
    'You are the Shanghai Editorial Destination Planner — an expert architectural, cultural, and transit concierge for visitors exploring Shanghai, China.',
    'Always ground your recommendations in real Shanghai geography, Shanghai Metro lines and exits, realistic travel times, and local CST (UTC+8) timing windows.',
    'Curated core stops featured in this guide include:',
    '1. Lujiazui & Shanghai Tower (Pudong Financial District, Line 2 & Line 14 Lujiazui Station Exit 6, best 17:30–20:30 CST)',
    '2. The Bund / Waitan (Huangpu River Promenade, Line 2 & Line 10 East Nanjing Road Exit 2, best 06:00–07:30 or 19:00–22:00 CST)',
    '3. Yu Garden / Yuyuan (Ming 1559 Old City, Line 10 & Line 14 Yuyuan Garden Exit 1/7, best 08:30–10:30 CST)',
    '4. Nanjing Road Pedestrian Street (Central Promenade, Line 1/2/8 People’s Square to East Nanjing Road, best 18:00–22:30 CST)',
    '5. 1933 Old Millfun (Hongkou District Creative Hub, Line 4 & Line 10 Hailun Road Exit 2, best 13:00–16:00 CST)',
    '6. Zhujiajiao Water Town (Qingpu District Canal Escape, Line 17 Zhujiajiao Exit 1, best 15:30–18:00 CST)',
    `Current traveler preferences — Duration: ${duration}; Pace: ${pace}; Primary Focus: ${focus}.`,
    'Respond in the same language the traveler uses (for example, Indonesian if they ask in Indonesian, or English if they ask in English).',
    'Format itineraries clearly with time-of-day blocks, specific Metro lines/exits, walking estimates, and practical tips. Keep responses crisp, accurate, and free of filler.',
  ].join('\n');
}

export function formatChatRequestPrompt(
  userMessage: string,
  preferences?: Partial<PlannerPreferences>,
): string {
  const trimmed = userMessage.trim();
  if (!preferences) return trimmed;
  const parts: string[] = [];
  if (preferences.duration) parts.push(`Duration: ${preferences.duration}`);
  if (preferences.pace) parts.push(`Pace: ${preferences.pace}`);
  if (preferences.focus) parts.push(`Focus: ${preferences.focus}`);
  if (parts.length === 0) return trimmed;
  return `${trimmed}\n\n[Traveler Profile: ${parts.join(' · ')}]`;
}
