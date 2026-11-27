import type { HistoryGroup, MainSkill, OtherSkillGroup } from "./types";

export const PROFILE = {
  name: "전지웅",
  role: "백엔드 개발자",
  email: "wjswldnd2000@naver.com",
  github: "https://github.com/JJW0123",
  githubHandle: "@JJW0123",
  /** 히어로 큰 제목. 줄마다 끊어 보입니다. */
  headline: ["코드에 근거를 담는", "백엔드 개발자 전지웅"],
  heroLines: [
    "MAU 52,470명 규모의 서비스를 직접 개발하고 운영했습니다.",
    "비전 AI와 실시간 판단 모델을 서비스에 적용한 경험도 있습니다.",
  ],
} as const;

export const HISTORY: HistoryGroup[] = [
  {
    label: "경력",
    items: [
      {
        period: "2023.06 — 2023.12",
        title: "애드캡슐소프트 · 백엔드 인턴",
        subtitle: "관리자 시스템 DB 설계와 API 개발",
        details: [
          "약 60페이지 분량의 화면정의서를 6개 도메인으로 분류",
          "도메인별 데이터 관계와 제약 조건을 정의하고 ERD와 DB 정의서 작성",
          "계층형 메뉴·공통코드 관리 기능과 동적 검색·필터링 구현",
          "파일 업로드 검증과 HTTP 상태 코드별 JSON 오류 응답 규칙 설계",
        ],
      },
    ],
  },
  {
    label: "교육",
    items: [
      {
        period: "2026.01 — 2026.12",
        title: "삼성 청년 SW·AI 아카데미(SSAFY) 15기",
        status: "이수 중",
        details: ["Java 기반 웹 개발", "AI 활용과 RAG 파이프라인 구축", "알고리즘·CS"],
      },
      { period: "2025.02", title: "명지전문대학 전공심화 컴퓨터공학과 학사", subtitle: "학점 3.94 / 4.5" },
    ],
  },
  {
    label: "자격",
    items: [
      { period: "2024.12", title: "정보처리기사", subtitle: "한국산업인력공단" },
      { period: "2026.04", title: "TOEIC Speaking IM3", subtitle: "한국TOEIC위원회" },
    ],
  },
];

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const MAIN_SKILLS: MainSkill[] = [
  {
    name: "Java",
    icon: `${DEVICON}/java/java-original.svg`,
    level: 4,
    note: "인턴 때 계층형 메뉴와 동적 검색을 구현했습니다. 프로젝트에서는 시세·배당 계산, 적재 위치 선정, 한끗의 피드백 타임라인을 개발했습니다.",
  },
  {
    name: "Spring Boot",
    icon: `${DEVICON}/spring/spring-original.svg`,
    level: 4,
    note: "매매 API와 배당 스케줄러를 개발하고 미완료 배당을 재처리하도록 했습니다. 한끗에서는 AI 분석을 작업 큐로 비동기 처리했습니다.",
  },
  {
    name: "MySQL",
    icon: `${DEVICON}/mysql/mysql-original.svg`,
    level: 4,
    note: "인턴 때 관리자 시스템의 데이터 관계와 제약 조건을 설계했습니다. 주식 서비스에서는 거래 내역 저장과 잔고 갱신을 한 트랜잭션으로 처리했습니다.",
  },
  {
    name: "Redis",
    icon: `${DEVICON}/redis/redis-original.svg`,
    level: 3,
    note: "자주 조회하는 시세와 순위를 Redis에서 읽도록 구성했습니다. 방송 상태 조회 작업에는 만료 시간이 있는 락을 걸어 중복 실행을 막았습니다.",
  },
];

export const OTHER_SKILLS: OtherSkillGroup[] = [
  { label: "인프라", items: ["Docker Compose", "Nginx", "Oracle Cloud VM", "AWS EC2 · S3"] },
  { label: "모니터링", items: ["Prometheus", "Grafana Cloud"] },
  { label: "API · 인증", items: ["Swagger", "JWT"] },
  { label: "AI", items: ["Python", "PyTorch", "Hugging Face"] },
  { label: "협업", items: ["Git", "GitHub", "Jira"] },
  { label: "기타", items: ["Firebase", "C#", "Unity"] },
];
