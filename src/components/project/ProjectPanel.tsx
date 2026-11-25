"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type KeyboardEvent, useCallback, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/layout/TopBar";
import type { Project } from "@/data/types";
import { getNeighbors } from "@/lib/project";
import { slugFromPath, switchProjectPanel } from "@/lib/panel";
import { SITE_TITLE } from "@/lib/site";
import { ProjectDetailView } from "./ProjectDetailView";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 메인 위로 오른쪽에서 밀려 들어오는 상세 패널.
 * 주소(/projects/slug/)가 열림 상태를 정하므로 브라우저 뒤로 가기로도 닫히고,
 * 닫히면 메인은 스크롤 위치 그대로 남아 있습니다. 새로고침하면 같은 주소의 단독 페이지가 열립니다.
 */
export function ProjectPanel({ projects, backgroundId }: { projects: Project[]; backgroundId: string }) {
  const pathname = usePathname();
  const slug = slugFromPath(pathname);
  const index = projects.findIndex((project) => project.slug === slug);
  const project = index >= 0 ? projects[index] : null;
  const isOpen = Boolean(project);

  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => window.history.back(), []);

  // 패널이 실제로 사라질 때까지 배경 스크롤과 조작을 막습니다.
  const attachDialog = useCallback((dialog: HTMLDivElement | null) => {
    scrollRef.current = dialog;
    if (!dialog) return;
    const background = document.getElementById(backgroundId);
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousInert = background?.inert;
    const trigger = document.activeElement;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    if (background) background.inert = true;
    return () => {
      scrollRef.current = null;
      root.style.overflow = previousOverflow;
      if (background) background.inert = previousInert ?? false;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [backgroundId]);

  useEffect(() => {
    if (!project) return;
    const previousTitle = document.title;
    document.title = `${project.title} | ${SITE_TITLE}`;
    closeRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [project]);

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (!event.repeat) close();
      return;
    }
    if (event.key !== "Tab") return;

    const tabbable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button, [tabindex]"))
      .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
    const first = tabbable[0];
    const last = tabbable.at(-1);
    const active = document.activeElement;
    if (!first || !last || !event.currentTarget.contains(active) ||
      (event.shiftKey ? active === first : active === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  };

  const select = (next: Project) => {
    switchProjectPanel(next.slug);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const neighbors = index >= 0 ? getNeighbors(projects, index) : null;

  return (
    <AnimatePresence>
      {isOpen && project && neighbors && (
        <div key="project-panel" className="fixed inset-0 z-[60]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
            onClick={close}
          />
          <motion.div
            ref={attachDialog}
            onKeyDown={onDialogKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="absolute inset-0 overflow-y-auto overscroll-contain bg-bg shadow-[-30px_0_80px_rgb(0_0_0/.18)] md:left-[4vw]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0.15 : 0.6, ease: EASE }}
          >
            <div>
              <div className="sticky top-0 z-50 border-b border-line bg-bg">
                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-20">
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="cursor-pointer border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
                  >
                    ← 전체 프로젝트
                  </button>
                  <ThemeToggle />
                </div>
              </div>
              <motion.div
                key={project.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                <ProjectDetailView
                  project={project}
                  prev={neighbors.prev}
                  next={neighbors.next}
                  scrollContainer={scrollRef}
                  onSelectProject={select}
                  onScrollTop={() => scrollRef.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
