"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROFILE } from "@/data/profile";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";
import { HOME_SECTIONS } from "@/lib/site";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex size-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
    >
      {/* 아이콘은 CSS로 바꿔 hydration 전에도 테마와 어긋나지 않게 합니다. 라이트에서는 달, 다크에서는 해가 보입니다. */}
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="dark:hidden">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className="hidden dark:block">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}

export function TopBar({ isHome = true }: { isHome?: boolean }) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 8);
      if (Math.abs(y - lastY) < 6) return;
      setIsHidden(y > lastY && y > 120);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const prefix = isHome ? "" : "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-out-soft motion-reduce:transition-none",
        isHidden && "-translate-y-full",
        isScrolled || !isHome ? "border-b border-line bg-bg" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10 lg:px-20">
        <Link href="/" className="shrink-0 text-[15px]">
          <span className="font-semibold">{PROFILE.name}</span>
          <span className="text-muted">의 포트폴리오</span>
        </Link>
        <nav aria-label="섹션" className="flex min-w-0 items-center gap-7">
          <ul className="m-0 hidden list-none gap-7 p-0 md:flex">
            {HOME_SECTIONS.map(({ id, short }) => (
              <li key={id}>
                <a
                  href={`${prefix}#${id}`}
                  className={cn(
                    "text-sm transition-colors hover:text-accent-ink focus-visible:text-accent-ink",
                    !isHome && id === "project" ? "text-accent-ink" : "text-muted",
                  )}
                >
                  {short}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
