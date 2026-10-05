import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/types";

export const padNumber = (n: number): string => String(n).padStart(2, "0");

export const getVisibleProjects = (): Project[] => PROJECTS.filter((project) => !project.hidden);

export const findProject = (slug: string): Project | undefined =>
  getVisibleProjects().find((project) => project.slug === slug);

export const shortMeta = (project: Project): string => `${project.period} · ${project.team}`;

export const fullMeta = (project: Project): string =>
  [project.period, project.team, project.role].filter(Boolean).join(" · ");

/** 양 끝에서는 반대쪽 끝으로 순환합니다. */
export const getNeighbors = <T>(items: readonly T[], index: number): { prev: T; next: T } => {
  const at = (i: number) => items[(i + items.length) % items.length];
  return { prev: at(index - 1), next: at(index + 1) };
};
