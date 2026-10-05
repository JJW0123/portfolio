"use client";

import { createContext, useCallback, useContext, useMemo, useState, type MouseEvent } from "react";
import type { Project } from "@/data/types";

interface DrawerState {
  openIndex: number | null;
  /** 닫히는 애니메이션 동안 내용을 유지하려고 마지막으로 연 프로젝트를 기억합니다. */
  shownIndex: number | null;
}

interface ProjectDrawerContextValue extends DrawerState {
  projects: readonly Project[];
  openSlug: (slug: string) => void;
  close: () => void;
}

const ProjectDrawerContext = createContext<ProjectDrawerContextValue | null>(null);

export function useProjectDrawer(): ProjectDrawerContextValue {
  const context = useContext(ProjectDrawerContext);
  if (!context) throw new Error("useProjectDrawer는 ProjectDrawerProvider 안에서만 사용할 수 있습니다.");
  return context;
}

export function ProjectDrawerProvider({ projects, children }: { projects: readonly Project[]; children: React.ReactNode }) {
  const [state, setState] = useState<DrawerState>({ openIndex: null, shownIndex: null });

  const close = useCallback(() => setState((prev) => ({ ...prev, openIndex: null })), []);
  const openSlug = useCallback(
    (slug: string) => {
      const index = projects.findIndex((project) => project.slug === slug);
      if (index >= 0) setState({ openIndex: index, shownIndex: index });
    },
    [projects],
  );

  const value = useMemo(() => ({ ...state, projects, openSlug, close }), [state, projects, openSlug, close]);

  return <ProjectDrawerContext.Provider value={value}>{children}</ProjectDrawerContext.Provider>;
}

interface OpenProjectLinkProps {
  slug: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * 상세 페이지로 가는 실제 링크입니다. 일반 클릭은 드로어를 열고,
 * Ctrl/⌘ 클릭이나 JS가 없는 환경(검색 크롤러 포함)에서는 페이지로 이동합니다.
 */
export function OpenProjectLink({ slug, id, className, children }: OpenProjectLinkProps) {
  const { openSlug } = useProjectDrawer();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    openSlug(slug);
  };

  return (
    <a id={id} href={`/projects/${slug}/`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
