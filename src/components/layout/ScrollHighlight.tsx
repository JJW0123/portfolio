"use client";

import { useEffect } from "react";

/**
 * data-hl이 붙은 줄 가운데 화면 가운데 띠에 걸친 줄만 진하게 합니다 (Scroll highlight).
 * 움직임 줄이기 설정이면 켜지 않아 모든 줄이 그대로 보입니다.
 */
export function ScrollHighlight() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("hl-on");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.hl = entry.isIntersecting ? "on" : "";
        });
      },
      { rootMargin: "-30% 0px -30% 0px" },
    );
    document.querySelectorAll("[data-hl]").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove("hl-on");
    };
  }, []);

  return null;
}
