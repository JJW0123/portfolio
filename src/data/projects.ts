import { ICON } from "./icons";
import type { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    slug: "forklift",
    title: "무인 지게차 물류 자동화",
    badge: "SSAFY 공통 프로젝트 우수상",
    period: "2026.07.14 — 2026.08.12",
    team: "6인 팀",
    role: "물체 인식·크기 측정 주 담당, 백엔드 공동 개발",
    summary:
      "화물의 크기와 무게 분포를 측정해 무인 지게차의 운반·적재를 돕는 시스템입니다. 화물을 올려놓는 받침대인 파렛트를 인식하고, 화물 크기를 계산하는 기능을 주로 맡았습니다. 백엔드 개발에도 참여해 측정 장치 사용 제어, 작업 상태 관리, 적재 위치 추천을 담당했습니다.",
    mediaText: "파렛트 인식 전후 비교와 화물 측정·운반 시연이 이 자리에 들어갑니다",
    metrics: [
      { label: "파렛트 검출 · 촬영 사진 12장", value: "0장 → 12장" },
      { label: "실제 환경의 추가 학습 사진", value: "289장" },
      { label: "평가 정답 재작성 · 사진 30장", value: "물체 142개" },
    ],
    metricNote: "파렛트 검출은 개선 전후 같은 촬영 사진 12장과 신뢰도 0.5 이상을 기준으로 확인했습니다.",
    stack: [
      { name: "Python", icon: ICON.python },
      { name: "PyTorch", icon: ICON.pytorch },
      { name: "RTMDet / MMDetection", abbr: "MM" },
      { name: "ONNX Runtime", abbr: "ON" },
      { name: "OpenCV", icon: ICON.opencv },
      { name: "Java 21", icon: ICON.java },
      { name: "Spring Boot", icon: ICON.spring },
      { name: "MySQL", icon: ICON.mysql },
    ],
    steps: [
      {
        title: "촬영 사진으로 파렛트 인식 개선",
        lead: "기존 모델은 목재 파렛트 사진 위주로 학습돼 있었습니다. 플라스틱 파렛트를 촬영한 사진 12장에서는 모두 검출에 실패했습니다.\n\n실험 환경에서 촬영한 사진 289장에 팀원과 함께 파렛트의 위치를 표시했습니다. 이 사진으로 모델을 추가 학습시키고, 사진에 변형을 주어 학습 데이터도 보완했습니다. 다시 평가했을 때는 같은 사진 12장 모두에서 파렛트를 찾아냈습니다.",
      },
      {
        title: "정답 데이터 재작성과 재평가",
        lead: "검출 성능 점수가 100%로 나와 정답 데이터의 작성 과정을 점검했습니다. 기존 정답은 모델의 예측 결과를 사람이 수정해 만든 것이었습니다. 이렇게 만들면 모델이 놓친 물체가 정답에서도 빠질 수 있었습니다.\n\n사진 30장에 있는 물체 142개의 위치와 종류를 직접 표시해 정답을 다시 만들었습니다. 이때는 모델의 예측을 참고하지 않았습니다. 새로 만든 정답 데이터로 같은 모델을 다시 평가했습니다. 그 결과 검출 성능 점수는 98.42%였습니다. 이후에도 이 정답을 기준으로 모델 성능을 비교했습니다.",
      },
      {
        title: "거리를 반영한 화물 크기 측정",
        lead: "같은 화물도 카메라에서 멀어질수록 사진 속에서는 작게 보였습니다. 사진 속 크기를 실제 크기로 바꾸려면 카메라와 화물 사이의 거리를 알아야 했습니다.\n\n카메라 보정값과 거리 센서의 측정값을 이용해 화물의 실제 크기를 계산했습니다. 박스를 여러 거리와 방향에서 촬영했습니다. 계산한 크기와 자로 잰 실제 크기를 비교해 측정 오차를 확인했습니다.",
      },
      {
        title: "측정 장치와 작업 순서 관리",
        lead: "측정 장치가 한 대뿐이라 요청이 겹치면 서로 다른 작업의 측정값이 섞일 수 있었습니다. 측정 장치는 한 번에 한 작업만 사용할 수 있도록 했습니다. 측정 응답이 일정 시간 안에 오지 않으면 해당 작업을 실패로 처리했습니다. 이때 장치도 다시 사용할 수 있는 상태로 바꿨습니다.\n\n작업이 정해진 순서대로 진행되도록 주요 상태 변경에도 조건을 뒀습니다. 예를 들어 측정 중인 작업만 측정 완료 상태로 바뀌게 했습니다. 작업이 실패하거나 취소되면 적재 위치 예약을 해제했습니다. 측정 완료 처리에 실패했을 때도 예약을 해제해 다른 작업이 해당 위치를 사용할 수 있게 했습니다.",
      },
    ],
    ps: "서로 다른 기능을 연결하려면 팀원 간에 처리 순서와 데이터 기준을 맞춰야 했습니다. 처리 순서와 담당 역할, 주고받는 데이터를 문서로 정리했습니다. 구현이 바뀌면 문서도 함께 수정해 최신 내용을 공유했습니다.",
    links: [{ label: "팀 GitHub", href: "https://github.com/bjs0306b/fast-autonomous-forklift" }],
  },
  {
    slug: "stock-simulation",
    title: "가상 주식 시뮬레이션",
    badge: "MAU 52,470명",
    period: "2026.04.25 — 2026.07.01",
    team: "개인 프로젝트",
    role: "설계·구현·배포·운영",
    summary:
      "실시간 시세로 모의 매매를 하는 서비스를 혼자 설계·구현·배포·운영했습니다. 조회는 캐시로, 거래는 락으로, 배치는 실행 토큰으로 나눠 처리하고 운영 지표로 확인했습니다.",
    mediaText: "시연 영상 촬영 예정 — 매매·랭킹 화면과 Grafana 지표 화면이 이 자리에 들어갑니다",
    metrics: [
      { label: "월 API 요청", value: "4,500만 건+" },
      { label: "API p95", value: "약 23ms" },
      { label: "5xx 오류율", value: "0.0011%" },
    ],
    stack: [
      { name: "Java 17", icon: ICON.java },
      { name: "Spring Boot", icon: ICON.spring },
      { name: "MySQL", icon: ICON.mysql },
      { name: "Redis", icon: ICON.redis },
      { name: "Nginx", icon: ICON.nginx },
      { name: "Prometheus", icon: ICON.prometheus },
      { name: "Grafana", icon: ICON.grafana },
    ],
    steps: [
      {
        lead: "요청의 대부분이 시세·랭킹 조회였습니다. ",
        strong: "전부 캐싱하면 잔고와 보유 수량이 실제와 달라질 수 있어",
        tail: " 갱신이 잦고 정합성 요구가 낮은 조회만 Redis로 옮기고, 거래는 데이터베이스에 남겼습니다.",
      },
      {
        lead: "같은 계정에서 주문이 동시에 들어오면 잔고와 보유 수량이 어긋납니다. ",
        strong: "충돌 자체는 드물어 전체를 잠그는 비관적 락 대신 낙관적 락으로 충돌만 감지해 재시도하게 했고",
        tail: ", 계정·종목 복합 키로 중복 보유 레코드를 막았습니다.",
      },
      {
        lead: "외부 시세 API를 한 번에 호출하던 스케줄러가 다음 주기까지 끝나지 않았습니다. 종목을 청크로 나눠 호출하고, ",
        strong: "인스턴스가 겹쳐도 같은 배치가 두 번 돌지 않도록",
        tail: " Redis에 TTL을 둔 실행 토큰을 사용했습니다.",
      },
      { lead: "운영 기간 동안 연동 계정 21,975개, 지원 종목 3,500종 이상, 누적 거래 135만 건 이상을 처리했습니다." },
      { lead: "2026년 7월 서비스 운영을 종료했습니다. 저장소와 관측 지표는 남아 있습니다." },
    ],
    links: [{ label: "GitHub", href: "https://github.com/JJW0123/stock-simulation" }],
    note: "과거 배포 주소 virtual-stock.xyz · 2026.07 운영 종료",
  },
  {
    slug: "vision-ai",
    title: "비전 AI 파인튜닝 챌린지",
    badge: "193팀 중 22위",
    period: "2026.04.01 — 2026.04.30",
    team: "5인 팀",
    role: "환경 구축·EDA·학습·프롬프트 튜닝",
    summary:
      "팀원마다 실험 조건이 달라 결과를 비교할 수 없었습니다. 시드와 하이퍼파라미터를 고정하고 데이터 로드부터 추론까지 하나의 파이프라인으로 묶은 뒤, 같은 조건에서 30회 실험을 비교했습니다.",
    mediaText: "실험 비교 화면이 이 자리에 들어갑니다",
    metrics: [
      { label: "정확도", value: "0.91683 → 0.93299" },
      { label: "동일 조건 실험", value: "30회 비교" },
    ],
    stack: [
      { name: "Python", icon: ICON.python },
      { name: "PyTorch", icon: ICON.pytorch },
      { name: "Hugging Face", icon: ICON.huggingface },
      { name: "Qwen", abbr: "Q" },
    ],
    steps: [
      {
        lead: "팀원마다 난수 시드와 하이퍼파라미터가 달라, 점수가 올라도 무엇 때문인지 알 수 없었습니다. ",
        strong: "성능을 올리기 전에 조건을 고정해 비교 기준을 먼저 만들었습니다.",
      },
      {
        lead: "데이터 로드부터 추론까지 하나의 파이프라인으로 묶어, ",
        strong: "실험 간 차이가 바꾼 변수 하나에서만 나오게",
        tail: " 했습니다.",
      },
      {
        lead: "정답이 특정 보기에 치우쳐 검증 점수가 실제 성능을 반영하지 못했습니다. ",
        strong: "계층화 분할로 학습·검증 세트의 정답 비율을 맞췄습니다.",
      },
      {
        lead: "모델이 보기 외에 설명을 덧붙이면 채점에서 오답이 됩니다. ",
        strong: "프롬프트로 응답을 a/b/c/d 한 글자로 제한",
        tail: "했습니다.",
      },
      { lead: "같은 조건 30회 비교로 정확도를 0.91683에서 0.93299까지 올렸고, 193팀 중 22위로 마쳤습니다." },
    ],
    links: [],
  },
  {
    slug: "komit",
    title: "코밋(Komit) — 외주·컨설팅 에스크로 플랫폼",
    period: "2026.08.24 — 2026.09.28",
    team: "5인 팀",
    role: "담당 내용 정리 예정",
    summary:
      "바이브 코딩으로 만든 서비스를 개발자와 함께 완성하는 외주·컨설팅 에스크로 플랫폼입니다. 상세 소개와 담당 기능은 초안 검토 후 채울 예정입니다.",
    mediaText: "코밋 서비스 화면과 시연 영상이 이 자리에 들어갑니다",
    metrics: [],
    stack: [
      { name: "Java 21" },
      { name: "Spring Boot" },
      { name: "PostgreSQL" },
      { name: "Redis" },
      { name: "FastAPI" },
      { name: "WebRTC" },
    ],
    steps: [
      { lead: "문제와 목표: 서비스가 해결하려는 문제와 주요 사용자 흐름을 정리할 예정입니다." },
      { lead: "설계와 구현: 담당 기능과 기술 선택의 이유를 초안 검토 후 채울 예정입니다." },
      { lead: "검증과 개선: 문제 해결 과정과 확인된 결과를 정리할 예정입니다." },
    ],
    links: [],
  },
  // 기존 사이트에서도 노출하지 않던 프로젝트입니다. 다시 보여주려면 hidden을 지우면 됩니다.
  {
    slug: "sharehouse",
    hidden: true,
    title: "쉐어하우스 매칭 플랫폼",
    period: "2024.10.26 — 2024.12.03",
    team: "개인 프로젝트",
    role: "기획·DB·백엔드·프론트엔드",
    summary:
      "쉐어하우스를 등록하고 조건에 맞는 방을 찾아 예약하는 서비스입니다. 사진은 S3에, 데이터는 데이터베이스에 나눠 저장하고, 서버가 화면을 그리던 초기 구조를 REST API와 JWT 인증으로 다시 만들었습니다.",
    mediaText: "하우스 목록·상세와 예약 화면이 이 자리에 들어갑니다",
    metrics: [],
    stack: [
      { name: "Java", icon: ICON.java },
      { name: "Spring Boot", icon: ICON.spring },
      { name: "AWS S3", icon: ICON.aws },
      { name: "Swagger", icon: ICON.swagger },
    ],
    steps: [
      {
        lead: "하우스 사진 용량이 커서 데이터베이스에 함께 저장하면 트랜잭션이 길어졌습니다. ",
        strong: "이미지는 S3에 올리고 데이터베이스에는 URL만 남겨",
        tail: " 미디어 처리와 트랜잭션을 분리했습니다.",
      },
      {
        lead: "서버가 화면을 그리고 세션으로 로그인을 유지하는 구조에서는 다른 클라이언트를 붙이기 어려웠습니다. ",
        strong: "REST API와 JWT 기반 무상태 인증으로 리팩터링해 서버가 세션을 들고 있지 않게",
        tail: " 했습니다.",
      },
      {
        lead: "회원·하우스·사진·예약 네 개 엔티티로 도메인을 나누고, ",
        strong: "인증과 예외 응답 규칙을 Swagger 문서에 함께 정리해",
        tail: " 화면 작업과 기준을 맞췄습니다.",
      },
      { lead: "지역 필터 검색과 예약 기능을 구현했습니다." },
    ],
    links: [{ label: "GitHub", href: "https://github.com/JJW0123/ShareHouse" }],
  },
  {
    slug: "idle-game",
    hidden: true,
    title: "모바일 방치형 게임",
    badge: "캡스톤 동상",
    period: "2023.04.03 — 2023.11.17",
    team: "4인 팀",
    role: "기여도 30% · 핵심 게임 로직·데이터 구조",
    summary:
      "건물을 세워 재화를 모으고 타워디펜스로 방어하는 방치형 게임입니다. 재화가 바뀔 때마다 서버에 저장하던 구조를 메모리 상태 관리와 일괄 저장으로 바꿨습니다.",
    mediaText: "게임 플레이 화면이 이 자리에 들어갑니다",
    metrics: [],
    stack: [
      { name: "C#", icon: ICON.csharp },
      { name: "Unity", icon: ICON.unity },
      { name: "Firebase", icon: ICON.firebase },
    ],
    steps: [
      {
        lead: "재화가 바뀔 때마다 Firebase에 쓰는 구조여서 조작 한 번에 네트워크 요청이 따라붙었습니다. ",
        strong: "방치형 게임은 재화 변동이 잦으니 저장 시점을 줄이는 편이 맞다고 보고",
        tail: ", 상태는 메모리에서 관리하고 1분 주기·게임 종료·재화 소모 시점에만 일괄 저장하게 바꿨습니다.",
      },
      {
        lead: "생산·레벨·업그레이드 로직이 건물마다 흩어져 같은 수치가 서로 달라졌습니다. ",
        strong: "중앙 관리 구조로 통합해 한 곳에서만 수치를 바꾸게",
        tail: " 했습니다.",
      },
      { lead: "2D Collider 이동·충돌과 타워디펜스 사거리·배치 비용·랜덤 덱 로직을 구현했습니다." },
      {
        lead: "팀원과 ",
        strong: "기능 인터페이스와 데이터 책임 범위를 먼저 합의해",
        tail: " 같은 기능을 두 번 만드는 일을 줄였습니다.",
      },
    ],
    links: [],
  },
];
