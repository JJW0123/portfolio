import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/types";

export const padNumber = (n: number): string => String(n).padStart(2, "0");

export const getVisibleProjects = (): Project[] => PROJECTS.filter((project) => !project.hidden);

export const findProject = (slug: string): Project | undefined =>
  getVisibleProjects().find((project) => project.slug === slug);

/** 목록에서는 이력과 같은 연.월 형식으로 줄이고, 일 단위 날짜는 상세에서만 보여줍니다. */
const toYearMonth = (period: string): string => period.replace(/(\d{4}\.\d{2})\.\d{2}/g, "$1");

export const shortMeta = (project: Project): string => `${toYearMonth(project.period)} · ${project.team}`;

export const fullMeta = (project: Project): string =>
  [project.period, project.team, project.role].filter(Boolean).join(" · ");

/** 양 끝에서는 반대쪽 끝으로 순환합니다. */
export const getNeighbors = <T>(items: readonly T[], index: number): { prev: T; next: T } => {
  const at = (i: number) => items[(i + items.length) % items.length];
  return { prev: at(index - 1), next: at(index + 1) };
};
