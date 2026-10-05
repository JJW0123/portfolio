"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";
import { getNeighbors } from "@/lib/project";
import { ProjectDetail, ProjectHeader, ProjectPager } from "./ProjectDetail";
import { useProjectDrawer } from "./ProjectDrawerContext";

const getFocusable = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>("button, a[href]")).filter(
    (element) => element.getBoundingClientRect().height > 0 && getComputedStyle(element).visibility !== "hidden",
  );

function lockBackground(): () => void {
  const main = document.querySelector("main");
  const header = document.querySelector("header");
  document.body.style.overflow = "hidden";
  if (main) main.inert = true;
  if (header) header.inert = true;
  return () => {
    document.body.style.overflow = "";
    if (main) main.inert = false;
    if (header) header.inert = false;
  };
}

export function ProjectDrawer() {
  const { projects, openIndex, shownIndex, openSlug, close } = useProjectDrawer();
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = openIndex !== null;
  const project = shownIndex !== null ? projects[shownIndex] : null;

  const setProgress = useCallback((ratio: number) => {
    if (progressRef.current) progressRef.current.style.width = `${Math.round(ratio * 100)}%`;
  }, []);

  // 닫히면 드로어를 열었던 요소로 포커스를 돌려줍니다.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockBackground();
    return () => {
      unlock();
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // 이전/다음으로 내용이 바뀌어도 맨 위부터 읽을 수 있게 스크롤과 포커스를 옮깁니다.
  useEffect(() => {
    if (openIndex === null || !panelRef.current) return;
    panelRef.current.scrollTop = 0;
    setProgress(0);
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [openIndex, setProgress]);

  // Tab 포커스가 드로어 밖으로 빠져나가지 않게 가둡니다.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = getFocusable(panelRef.current);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const handleScroll = () => {
    const panel = panelRef.current;
    if (!panel) return;
    setProgress(Math.min(1, panel.scrollTop / Math.max(1, panel.scrollHeight - panel.clientHeight)));
  };

  const neighbors = shownIndex !== null ? getNeighbors(projects, shownIndex) : null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-60 bg-[rgb(7_23_38/.45)] transition-opacity duration-250",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={project?.title}
        inert={!isOpen}
        onScroll={handleScroll}
        className={cn(
          "no-scrollbar fixed top-3 right-3 bottom-3 z-61 w-[min(720px,calc(100vw-24px))] overflow-auto rounded-xl bg-bg shadow-[0_24px_60px_rgb(7_23_38/.25)]",
          // 닫힐 때는 슬라이드가 끝난 뒤(.4s) visibility를 숨깁니다.
          isOpen
            ? "visible translate-x-0 [transition:translate_.4s_var(--ease-out-soft),visibility_0s_linear_0s]"
            : "invisible translate-x-[calc(100%+96px)] [transition:translate_.4s_var(--ease-out-soft),visibility_0s_linear_.4s]",
        )}
      >
        {project && neighbors && (
          <>
            <ProjectHeader
              project={project}
              titleLevel={2}
              isSticky
              actions={
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="닫기"
                  className="flex size-[34px] flex-none cursor-pointer items-center justify-center self-start rounded-lg border-0 bg-white/10 text-lg text-white hover:bg-white/22"
                >
                  ×
                </button>
              }
            >
              <div
                ref={progressRef}
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[3px] w-0 bg-navy-accent transition-[width] duration-100 ease-linear"
              />
            </ProjectHeader>
            <ProjectDetail project={project} titleLevel={2} />
            <ProjectPager
              prev={neighbors.prev}
              next={neighbors.next}
              onSelect={(target: Project) => openSlug(target.slug)}
            />
          </>
        )}
      </div>
    </>
  );
}
