export interface Tech {
  name: string;
  icon?: string;
  abbr?: string;
  emoji?: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface ProblemStep {
  title?: string;
  lead: string;
  strong?: string;
  tail?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  badge?: string;
  period: string;
  team: string;
  role?: string;
  summary: string;
  mediaText: string;
  metrics: Metric[];
  metricNote?: string;
  stack: Tech[];
  steps: ProblemStep[];
  ps?: string;
  links: ProjectLink[];
  note?: string;
  /** 목록과 상세 페이지에서 제외합니다. */
  hidden?: boolean;
}

export interface Strength {
  title: string;
  body: string;
  projectSlug: string;
  linkLabel: string;
}

export interface Experience {
  period: string;
  title: string;
  summary: string;
  stack: Tech[];
  duties: string[];
}

export interface SkillGroup {
  label: string;
  items: Tech[];
}

export interface EducationItem {
  period: string;
  title: string;
  subtitle: string;
  details?: string[];
  kind: "education" | "certificate";
}
