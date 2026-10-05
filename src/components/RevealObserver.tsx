"use client";

import { useEffect } from "react";

const STAGGER_BASE_S = 0.1;
const STAGGER_STEP_S = 0.15;

/**
 * [data-su] 요소가 화면에 들어오면 아래에서 올라오며 나타나게 합니다.
 * 서버 HTML에는 클래스가 없으므로 JS가 꺼져 있어도 내용은 그대로 보입니다.
 */
export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("su-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -100px 0px" },
    );

    const frame = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>("[data-su]").forEach((element) => {
        element.classList.add("su");
        const parent = element.parentElement;
        if (parent?.tagName === "UL") {
          const order = Array.from(parent.children).indexOf(element);
          element.style.animationDelay = `${STAGGER_BASE_S + order * STAGGER_STEP_S}s`;
        }
        observer.observe(element);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
