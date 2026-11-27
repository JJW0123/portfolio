"use client";

import { useEffect } from "react";

const TARGET_ID = "career";
/** 이동이 끝나지 않을 때를 대비한 최대 잠금 시간 */
const MAX_LOCK_MS = 1200;
/** 도착한 뒤 남은 관성 휠을 흘려보내는 짧은 여유 */
const SETTLE_MS = 120;
const SLACK = 8;

export function HeroSnap() {
  useEffect(() => {
    const target = document.getElementById(TARGET_ID);
    if (!target) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let lockedUntil = 0;

    // 경력 섹션의 시작을 고정 헤더 하단에 맞춥니다.
    const landing = () => {
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      return target.getBoundingClientRect().top + window.scrollY - padding;
    };
    const canGoDown = () => window.scrollY < landing() - SLACK;
    const canGoUp = () => window.scrollY > 0 && window.scrollY <= landing() + SLACK;

    let stopWatching = () => {};
    const go = (direction: "down" | "up") => {
      const top = direction === "down" ? landing() : 0;
      lockedUntil = Date.now() + MAX_LOCK_MS;
      stopWatching();
      const onArrive = () => {
        if (Math.abs(window.scrollY - top) > 2) return;
        lockedUntil = Date.now() + SETTLE_MS;
        stopWatching();
      };
      window.addEventListener("scroll", onArrive, { passive: true });
      stopWatching = () => window.removeEventListener("scroll", onArrive);
      window.scrollTo({ top, behavior: "smooth" });
    };

    const isInDialog = (event: Event) => (event.target as Element | null)?.closest?.('[role="dialog"]') != null;

    const tryGo = (delta: number): boolean => {
      if (delta > 0 && canGoDown()) go("down");
      else if (delta < 0 && canGoUp()) go("up");
      else return false;
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (reducedMotion.matches || event.ctrlKey || isInDialog(event)) return;
      if (Date.now() < lockedUntil) {
        event.preventDefault();
        return;
      }
      if (event.deltaY === 0) return;
      if (tryGo(event.deltaY)) event.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (reducedMotion.matches || event.touches.length !== 1 || isInDialog(event)) return;
      if (Date.now() < lockedUntil) {
        event.preventDefault();
        return;
      }
      const delta = touchStartY - (event.touches[0]?.clientY ?? 0);
      if (Math.abs(delta) < 12) return;
      if (tryGo(delta)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (reducedMotion.matches || isInDialog(event)) return;
      const el = event.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable]")) return;
      // Space는 버튼·링크를 누르는 키이기도 해서 그 위에서는 가로채지 않습니다.
      if (event.key === " " && el?.closest("button, a")) return;
      const isDown = event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey);
      const isUp = event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey);
      if (!isDown && !isUp) return;
      if (tryGo(isDown ? 1 : -1)) event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      stopWatching();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
