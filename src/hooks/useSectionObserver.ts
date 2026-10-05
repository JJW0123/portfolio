"use client";

import { useEffect, useState } from "react";

/** 화면 세로 중앙 10% 띠에 걸친 섹션의 id */
export function useActiveSection(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState("");
  const key = ids.join(",");

  useEffect(() => {
    if (!key) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    key.split(",").forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}

export function useScrolledPast(id: string): boolean {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setIsPast(!entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id]);

  return isPast;
}
