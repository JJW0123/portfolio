import { ICON } from "./icons";
import type { HistoryGroup, SkillGroup } from "./types";

export const PROFILE = {
  name: "전지웅",
  role: "백엔드 개발자",
  email: "wjswldnd2000@naver.com",
  github: "https://github.com/JJW0123",
  githubHandle: "@JJW0123",
  heroLines: [
    "운영 지표로 문제의 원인을 찾고 설계와 구현으로 해결해 왔습니다.",
    "백엔드가 주 분야이며 AI 개발도 경험했습니다.",
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
          "39개 테이블 규모의 ERD와 DB 정의서 설계",
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
        period: "2026.01 — 현재",
        title: "삼성 청년 SW·AI 아카데미(SSAFY) 15기",
        subtitle: "2026.12 수료 예정",
        details: ["Java 기반 웹 개발", "AI 활용과 RAG 파이프라인 구축", "알고리즘·CS"],
      },
      { period: "2025.02", title: "명지전문대학 전공심화 컴퓨터공학과 학사", subtitle: "졸업 · 학점 4.0 / 4.5" },
    ],
  },
  {
    label: "자격",
    items: [
      { period: "2024.12", title: "정보처리기사" },
      { period: "2026.04", title: "TOEIC Speaking IM3" },
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Backend",
    items: [
      { name: "Java 17/21", icon: ICON.java, isCore: true },
      { name: "Spring Boot", icon: ICON.spring, isCore: true },
      { name: "MySQL", icon: ICON.mysql, isCore: true },
      { name: "Redis", icon: ICON.redis, isCore: true },
    ],
  },
  {
    label: "Infra",
    items: [
      { name: "Prometheus", icon: ICON.prometheus, isCore: true },
      { name: "Grafana", icon: ICON.grafana, isCore: true },
      { name: "Docker Compose", icon: ICON.docker },
      { name: "Nginx", icon: ICON.nginx },
      { name: "AWS EC2 · S3", icon: ICON.aws },
      { name: "Oracle Cloud", icon: ICON.oracle },
      { name: "MQTT", icon: ICON.mqtt },
    ],
  },
  {
    label: "AI",
    items: [
      { name: "Python", icon: ICON.python },
      { name: "PyTorch", icon: ICON.pytorch },
      { name: "OpenCV", icon: ICON.opencv },
      { name: "ONNX Runtime", abbr: "ON" },
    ],
  },
];
