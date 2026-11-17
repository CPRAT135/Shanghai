import { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { evaluateEditorialEase, lerp } from '../utils/editorialLogic';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl || typeof window === 'undefined') return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringInteractive = false;
    let scaleFrom = 1;
    let scaleTo = 1;
    let currentScale = 1;
    let scaleAnimStart = 0;
    let rafId = 0;
    const SCALE_DURATION = 500;

    const interactiveSelector = 'a, button, .destination-card, .marquee-card';

    function refreshCursorHoverState() {
      if (targetX < 0 || targetY < 0) return;
      const under = document.elementFromPoint(targetX, targetY);
      const interactive = under ? under.closest(interactiveSelector) : null;
      const shouldHover = Boolean(interactive && !interactive.closest('[aria-hidden="true"]'));
      if (shouldHover !== isHoveringInteractive) {
        isHoveringInteractive = shouldHover;
        scaleFrom = currentScale;
        scaleTo = shouldHover ? 2.5 : 1;
        scaleAnimStart = performance.now();
      }
    }

    function onMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (cursorEl && !cursorEl.classList.contains('is-visible')) {
        currentX = targetX;
        currentY = targetY;
        cursorEl.classList.add('is-visible');
      }
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as Element | null;
      const interactive = target?.closest(interactiveSelector);
      if (interactive && !isHoveringInteractive) {
        isHoveringInteractive = true;
        scaleFrom = currentScale;
        scaleTo = 2.5;
        scaleAnimStart = performance.now();
        audioEngine.playMicroTick();
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as Element | null;
      const interactive = target?.closest(interactiveSelector);
      if (interactive) {
        const relatedEl = e.relatedTarget as Element | null;
        const related = relatedEl?.closest(interactiveSelector);
        if (!related && isHoveringInteractive) {
          isHoveringInteractive = false;
          scaleFrom = currentScale;
          scaleTo = 1;
          scaleAnimStart = performance.now();
        }
      }
    }

    function animateCursor(now: number) {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      if (currentScale !== scaleTo) {
        const progress = (now - scaleAnimStart) / SCALE_DURATION;
        if (progress >= 1) {
          currentScale = scaleTo;
        } else {
          currentScale = scaleFrom + (scaleTo - scaleFrom) * evaluateEditorialEase(progress);
        }
      }

      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${(currentX - 16).toFixed(2)}px, ${(currentY - 16).toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(animateCursor);
    }

    window.addEventListener('scroll', refreshCursorHoverState, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    rafId = requestAnimationFrame(animateCursor);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', refreshCursorHoverState);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return <div id="custom-cursor" ref={cursorRef} aria-hidden="true" />;
}
