import type { HistoryGroup, MainSkill, OtherSkillGroup } from "./types";

export const PROFILE = {
  name: "전지웅",
  role: "백엔드 개발자",
  email: "wjswldnd2000@naver.com",
  github: "https://github.com/JJW0123",
  githubHandle: "@JJW0123",
  /** 히어로 큰 제목. 줄마다 끊어 보입니다. */
  headline: ["근거 있는 코드를 쓰는", "백엔드 개발자 전지웅"],
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
      { period: "2024.12", title: "정보처리기사", subtitle: "한국산업인력공단" },
      { period: "2026.04", title: "TOEIC Speaking IM3", subtitle: "한국TOEIC위원회" },
    ],
  },
];

// TODO(확인 필요): level은 디자인 시안의 임시값입니다. 본인 기준으로 고쳐 주세요.
export const MAIN_SKILLS: MainSkill[] = [
  { name: "Java", level: 4, note: "인턴 관리자 시스템, 가상 주식 시뮬레이션, 무인 지게차 백엔드를 Java로 구현했습니다." },
  { name: "Spring Boot", level: 4, note: "REST API, 예외 응답 규칙, 스케줄러와 낙관적 락 기반 주문 처리를 구현했습니다." },
  { name: "MySQL", level: 4, note: "39개 테이블 정규화 ERD를 설계하고, 복합 키와 조건부 UPDATE로 정합성을 지켰습니다." },
  { name: "Redis", level: 3, note: "시세·랭킹 조회 캐시와 TTL 실행 토큰으로 배치 중복 실행을 막았습니다." },
  { name: "Python", level: 3, note: "파렛트 검출 모델 추가 학습과 30회 비교 실험 파이프라인을 작성했습니다." },
];

export const OTHER_SKILLS: OtherSkillGroup[] = [
  { label: "인프라", items: ["Docker Compose", "Nginx", "Oracle Cloud VM", "AWS EC2 · S3"] },
  { label: "모니터링", items: ["Prometheus", "Grafana Cloud"] },
  { label: "API · 인증", items: ["Swagger", "JWT"] },
  { label: "AI · 비전", items: ["PyTorch", "Hugging Face", "OpenCV", "ONNX Runtime"] },
  { label: "기타", items: ["MQTT", "Firebase", "C#", "Unity"] },
];
