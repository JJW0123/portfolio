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
  /** 목록 행에 보이는 한 줄 소개입니다. 처음 보는 사람도 읽을 수 있게 전문 용어 없이 씁니다. */
  highlight?: string;
  summary: string;
  /** 넣을 사진·영상 계획을 적어 두는 메모입니다. 화면에는 나오지 않습니다. */
  mediaPlan?: string;
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

export interface HistoryItem {
  period: string;
  title: string;
  subtitle?: string;
  /** 있으면 "자세히 보기"로 접어 둡니다. */
  details?: string[];
}

export interface HistoryGroup {
  label: string;
  items: HistoryItem[];
}

export interface Skill extends Tech {
  /** 주로 쓰는 기술은 타일을 강조합니다. */
  isCore?: boolean;
}

export interface SkillGroup {
  label: string;
  items: Skill[];
}
