"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/site";

type Theme = "dark" | "light";

// <html>의 dark 클래스를 기준으로 삼아, 인라인 테마 스크립트와 상태가 어긋나지 않게 합니다.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");
const getServerSnapshot = (): Theme => DEFAULT_THEME;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장이 막힌 환경(사생활 보호 모드 등)에서도 현재 화면의 전환은 유지합니다.
    }
  }, []);

  return { theme, toggleTheme };
}
