import { ICON } from "./icons";
import type { EducationItem, Experience, SkillGroup, Strength } from "./types";

export const PROFILE = {
  name: "전지웅",
  role: "백엔드 개발자",
  email: "wjswldnd2000@naver.com",
  github: "https://github.com/JJW0123",
  githubHandle: "@JJW0123",
  heroLines: [
    "운영 지표를 보고 원인을 찾아 설계와 구현으로 해결해 왔습니다.",
    "백엔드가 주 분야이고, AI·비전과 게임 개발도 경험했습니다.",
  ],
} as const;

export const STRENGTHS: Strength[] = [
  {
    title: "지표부터 확인합니다",
    body: "가상 주식 시뮬레이션은 요청량이 많아 어디가 느린지 짐작으로 판단할 수 없었습니다. Prometheus·Grafana로 RPS와 응답 지연, 오류율을 먼저 쌓아 두고 개선 지점을 정했습니다. 평균 14 RPS, 최대 219 RPS 구간에서 API p95 약 23ms, 5xx 오류율 0.0011%를 유지했습니다.",
    projectSlug: "stock-simulation",
    linkLabel: "가상 주식 시뮬레이션 보기",
  },
  {
    title: "동시 요청은 설계로 막습니다",
    body: "같은 자원에 요청이 겹치는 지점을 먼저 찾고, 코드 흐름이 아니라 락과 키 제약으로 막았습니다. 모의 매매의 동시 주문에는 낙관적 락과 복합 키를, 무인 지게차의 작업 상태 전이에는 조건부 UPDATE를 적용했습니다.",
    projectSlug: "forklift",
    linkLabel: "무인 지게차 프로젝트 보기",
  },
  {
    title: "결과를 다시 확인합니다",
    body: "좋게 나온 숫자를 그대로 쓰지 않았습니다. 무인 지게차에서는 모델의 예측을 참고하지 않고 정답 데이터를 다시 작성해 검출 성능을 재평가했고, 비전 AI 챌린지에서는 시드와 하이퍼파라미터를 고정해 30회 실험을 같은 조건에서 비교했습니다.",
    projectSlug: "vision-ai",
    linkLabel: "비전 AI 챌린지 보기",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    period: "2023.06 — 2023.12",
    title: "애드캡슐소프트 · 백엔드 인턴",
    summary:
      "내부 관리자 시스템과 공식 웹사이트 개선 프로젝트의 백엔드 아키텍처·API 담당. 약 60페이지 화면정의서를 6개 도메인으로 분류하고 39개 테이블 규모의 정규화 ERD와 DB 정의서를 설계했습니다.",
    stack: [
      { name: "Java", icon: ICON.java },
      { name: "Spring Boot", icon: ICON.spring },
      { name: "MySQL", icon: ICON.mysql },
    ],
    duties: [
      "관리자·권한·공통코드, 메뉴, 프로젝트, 뉴스, 채용, 문의 6개 도메인으로 화면정의서 분류",
      "PK/FK와 필수값 제약을 포함한 39개 테이블 정규화 ERD 및 DB 정의서 설계",
      "계층형 메뉴·공통코드 관리 기능과 동적 검색·필터링 구현",
      "최대 50MB, PDF/PPT/ZIP 화이트리스트를 적용한 파일 업로드 검증 구현",
      "필수값 누락·용량 초과 예외의 HTTP 상태 코드와 JSON 오류 응답 규칙 설계",
      "프론트엔드 인턴과 API·오류 응답 규칙 연동",
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Backend",
    items: [
      { name: "Java 17/21", icon: ICON.java },
      { name: "Spring Boot", icon: ICON.spring },
      { name: "MySQL", icon: ICON.mysql },
      { name: "Redis", icon: ICON.redis },
      { name: "Swagger", icon: ICON.swagger },
      { name: "JWT", icon: ICON.jwt },
    ],
  },
  {
    label: "Infra",
    items: [
      { name: "Docker Compose", icon: ICON.docker },
      { name: "Nginx", icon: ICON.nginx },
      { name: "Oracle Cloud VM", icon: ICON.oracle },
      { name: "AWS EC2 · S3", icon: ICON.aws },
      { name: "Prometheus", icon: ICON.prometheus },
      { name: "Grafana Cloud", icon: ICON.grafana },
      { name: "Firebase", icon: ICON.firebase },
    ],
  },
  {
    label: "AI · Vision",
    items: [
      { name: "Python", icon: ICON.python },
      { name: "PyTorch", icon: ICON.pytorch },
      { name: "Hugging Face", emoji: "🤗" },
    ],
  },
  {
    label: "AIoT · Game",
    items: [
      { name: "MQTT", icon: ICON.mqtt },
      { name: "C#", icon: ICON.csharp },
      { name: "Unity", icon: ICON.unity },
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    kind: "education",
    period: "2026.01 — 2026.12",
    title: "삼성 청년 SW·AI 아카데미(SSAFY)",
    subtitle: "수료 예정",
    details: ["Java 웹 개발, AI 활용, RAG 파이프라인, 알고리즘·CS", "무인 지게차 물류 자동화, 비전 AI 파인튜닝 챌린지 수행"],
  },
  {
    kind: "education",
    period: "2025.02 졸업",
    title: "명지전문대학 전공심화 컴퓨터공학과 학사",
    subtitle: "학점 4.0 / 4.5",
  },
  { kind: "certificate", period: "2024.12.11", title: "정보처리기사", subtitle: "한국산업인력공단" },
  { kind: "certificate", period: "2026.04.18", title: "TOEIC Speaking IM3", subtitle: "한국TOEIC위원회" },
];
