export interface Metric {
  label: string;
  value: string;
}

/** 사진·영상 한 장. src는 public 아래 경로나 외부 주소입니다. */
export interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProblemStep {
  title?: string;
  lead: string;
  strong?: string;
  tail?: string;
  /** 사례 아래에 한 줄로 보이는 결과입니다. 없으면 숨깁니다. */
  result?: string;
  /** 사례마다 0~1장. 있으면 오른쪽에 작게 보입니다. */
  image?: MediaItem;
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
  hoverPreview?: MediaItem;
  /** 상세 페이지 상단 슬라이드. 첫 장은 목록에 마우스를 올렸을 때 미리보기로도 쓰입니다. */
  media?: MediaItem[];
  mediaNote?: string;
  metrics: Metric[];
  metricNote?: string;
  stack: string[];
  stackNote?: string;
  steps: ProblemStep[];
  /** 상세 페이지의 회고 칸 */
  ps?: string;
  retroMedia?: MediaItem;
  links: ProjectLink[];
  note?: string;
  /** 목록과 상세 페이지에서 제외합니다. */
  hidden?: boolean;
}

export interface HistoryItem {
  period: string;
  title: string;
  /** 경력에서는 제목 아래 설명, 교육·자격에서는 오른쪽 끝의 짧은 메모로 보입니다. */
  subtitle?: string;
  details?: string[];
}

export interface HistoryGroup {
  label: string;
  items: HistoryItem[];
}

/** 1~5. 화면에는 다섯 칸 막대와 하·중하·중·중상·상으로 보입니다. */
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface MainSkill {
  name: string;
  /** 기술 대표 로고 이미지 주소 */
  icon: string;
  level: SkillLevel;
  /** 이 기술로 무엇을 했는지 한 문장 */
  note: string;
}

export interface OtherSkillGroup {
  label: string;
  items: string[];
}
