import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeChatMessages,
  buildPlannerSystemInstruction,
  formatChatRequestPrompt,
} from './plannerLogic';

test('sanitizeChatMessages filters invalid entries and trims whitespace', () => {
  const result = sanitizeChatMessages([
    { role: 'user', text: '  Plan 2 days in Shanghai  ' },
    { role: 'model', text: '' },
    { role: 'system', text: 'ignored' },
    { role: 'model', text: 'Day 1 starts at Yu Garden.' },
  ]);

  assert.deepEqual(result, [
    { role: 'user', text: 'Plan 2 days in Shanghai' },
    { role: 'model', text: 'Day 1 starts at Yu Garden.' },
  ]);
});

test('sanitizeChatMessages caps history length to maxTurns', () => {
  const many = Array.from({ length: 30 }, (_, idx) => ({
    role: idx % 2 === 0 ? 'user' : 'model',
    text: `Turn ${idx}`,
  }));
  const result = sanitizeChatMessages(many, 10);
  assert.equal(result.length, 10);
  assert.equal(result[0].text, 'Turn 20');
  assert.equal(result[9].text, 'Turn 29');
});

test('buildPlannerSystemInstruction embeds preferences and Shanghai stops', () => {
  const instruction = buildPlannerSystemInstruction({
    duration: '3 Days',
    pace: 'Relaxed',
    focus: 'Heritage & Canals',
  });
  assert.ok(instruction.includes('Duration: 3 Days'));
  assert.ok(instruction.includes('Pace: Relaxed'));
  assert.ok(instruction.includes('Primary Focus: Heritage & Canals'));
  assert.ok(instruction.includes('Zhujiajiao Water Town'));
  assert.ok(instruction.includes('Lujiazui & Shanghai Tower'));
});

test('formatChatRequestPrompt appends traveler profile metadata', () => {
  const formatted = formatChatRequestPrompt('  Where should I eat near The Bund?  ', {
    duration: '2 Days',
    pace: 'Balanced',
  });
  assert.equal(
    formatted,
    'Where should I eat near The Bund?\n\n[Traveler Profile: Duration: 2 Days · Pace: Balanced]',
  );
});
