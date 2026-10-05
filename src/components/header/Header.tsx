"use client";

import type { MouseEvent } from "react";
import { GitHubIcon, MoonIcon, SunIcon } from "@/components/ui/icons";
import { PROFILE } from "@/data/profile";
import { useActiveSection, useScrolledPast } from "@/hooks/useSectionObserver";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";
import { HERO_ID } from "@/lib/site";

const SECTIONS = [
  { id: "experience", label: "경력" },
  { id: "project", label: "프로젝트" },
  { id: "skills", label: "기술" },
  { id: "education", label: "교육" },
] as const;

const SECTION_IDS = SECTIONS.map((section) => section.id);
const NO_SECTIONS: readonly string[] = [];

const ICON_BUTTON =
  "flex size-8 items-center justify-center rounded-[9px] border border-line text-muted transition-colors hover:border-accent hover:text-accent";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(ICON_BUTTON, "cursor-pointer bg-transparent p-0")}
    >
      {/* 아이콘은 CSS로 전환해 hydration 전에도 테마와 어긋나지 않게 합니다. */}
      <span className="block leading-none dark:hidden">
        <SunIcon />
      </span>
      <span className="hidden leading-none dark:block">
        <MoonIcon />
      </span>
    </button>
  );
}

export function Header({ isHome = true }: { isHome?: boolean }) {
  const isPastHero = useScrolledPast(HERO_ID);
  const activeId = useActiveSection(isHome ? SECTION_IDS : NO_SECTIONS);
  // 상세 페이지에는 히어로가 없어 처음부터 배경을 채웁니다.
  const isFilled = !isHome || isPastHero;
  const sectionPrefix = isHome ? "" : "/";

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    event.preventDefault();
    const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-4 border-b px-6 transition-[background-color,border-color] duration-300",
        isFilled ? "border-line bg-bg" : "border-transparent bg-transparent",
      )}
    >
      <a
        href={isHome ? "#top" : "/"}
        onClick={scrollToTop}
        className="flex shrink-0 items-center text-inherit hover:text-inherit"
      >
        <p className="m-0 text-base leading-none whitespace-nowrap">
          <span className="font-extrabold text-ink">{PROFILE.name}</span>
          <span className="hidden font-normal text-muted md:inline"> | {PROFILE.role}</span>
        </p>
      </a>

      <nav aria-label="섹션 내비게이션" className="flex min-w-0 items-center gap-3">
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`${sectionPrefix}#${id}`}
            aria-current={activeId === id ? "location" : undefined}
            className={cn(
              "text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 hover:text-accent",
              activeId === id ? "text-accent" : "text-body",
            )}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={ICON_BUTTON}>
          <GitHubIcon />
        </a>
      </div>
    </header>
  );
}
