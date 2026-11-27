import { PROFILE } from "@/data/profile";

/** CI에서 NEXT_PUBLIC_SITE_URL로 주입합니다. sitemap·OG의 절대 주소에 쓰입니다. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE_TITLE = `${PROFILE.name} 포트폴리오`;
export const SITE_DESCRIPTION = `${PROFILE.role} ${PROFILE.name}의 포트폴리오입니다. ${PROFILE.heroLines.join(" ")}`;

/**
 * `npm run pdf`로 만든 포트폴리오 PDF. 파일 이름 자체를 한글로 두어,
 * 브라우저 PDF 보기에서 저장하든 내려받기 링크로 받든 같은 이름으로 저장되게 합니다.
 */
const PDF_FILE_NAME = `${PROFILE.name}_포트폴리오.pdf`;
export const PORTFOLIO_PDF = { href: `/${PDF_FILE_NAME}`, fileName: PDF_FILE_NAME, preview: "/print/" } as const;

export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Backend Developer Portfolio" } as const;

// 기본 테마가 다크에서 라이트로 바뀌어, 예전에 저장된 선택을 이어받지 않도록 키를 바꿨습니다.
export const THEME_STORAGE_KEY = "jjw-theme-v3";
export const DEFAULT_THEME = "light";

/** 메인 페이지 섹션. 상단 메뉴와 오른쪽 진행선이 같은 목록을 씁니다. */
export const HOME_SECTIONS = [
  { id: "career", label: "경력", short: "경력" },
  { id: "project", label: "프로젝트", short: "프로젝트" },
  { id: "skills", label: "기술", short: "기술" },
  { id: "education", label: "교육 및 자격", short: "교육" },
  { id: "contact", label: "연락처", short: "연락처" },
] as const;

/** 첫 페인트 전에 테마 클래스를 맞춰 깜빡임을 막습니다. */
export const THEME_INIT_SCRIPT = `(function(){var t="${DEFAULT_THEME}";try{t=localStorage.getItem("${THEME_STORAGE_KEY}")||t}catch(e){}document.documentElement.classList.toggle("dark",t==="dark")})()`;
