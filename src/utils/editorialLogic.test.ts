import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatShanghaiClock,
  lerp,
  clampMasterGain,
  clampTickGain,
  evaluateEditorialEase,
  buildArchitecturalFallbackSvg,
} from './editorialLogic';

test('formatShanghaiClock computes UTC+8 deterministically', () => {
  const utcMidnight = new Date('2026-11-13T00:00:00.000Z');
  assert.equal(formatShanghaiClock(utcMidnight), '08:00:00 CST');

  const utcLate = new Date('2026-11-13T22:15:09.000Z');
  assert.equal(formatShanghaiClock(utcLate), '06:15:09 CST');
});

test('lerp interpolates with factor 0.15', () => {
  assert.equal(lerp(0, 100, 0.15), 15);
  assert.equal(lerp(100, 100, 0.15), 100);
});

test('audio gain clamps stay within zero-crack limits', () => {
  assert.equal(clampMasterGain(0.95), 0.7);
  assert.equal(clampMasterGain(0), 0.0001);
  assert.equal(clampTickGain(0.5), 0.12);
  assert.equal(clampTickGain(0.08), 0.08);
});

test('evaluateEditorialEase is bounded in [0, 1]', () => {
  assert.equal(evaluateEditorialEase(-1), 0);
  assert.equal(evaluateEditorialEase(0), 0);
  assert.equal(evaluateEditorialEase(1), 1);
  assert.ok(evaluateEditorialEase(0.5) > 0.9);
});

test('buildArchitecturalFallbackSvg produces valid inline SVG data URI', () => {
  const uri = buildArchitecturalFallbackSvg('Lujiazui <Tower>', '2099 SECTOR 01', 0);
  assert.ok(uri.startsWith('data:image/svg+xml;charset=utf-8,'));
  const decoded = decodeURIComponent(uri.split(',')[1]);
  assert.ok(decoded.includes('2099 SECTOR 01'));
  assert.ok(decoded.includes('Lujiazui Tower'));
  assert.ok(decoded.includes('<svg'));
});
