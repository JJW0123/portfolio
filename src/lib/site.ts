import { PROFILE } from "@/data/profile";

/** CI에서 NEXT_PUBLIC_SITE_URL로 주입합니다. sitemap·OG의 절대 주소에 쓰입니다. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE_TITLE = `${PROFILE.name} 포트폴리오`;
export const SITE_DESCRIPTION = `${PROFILE.role} ${PROFILE.name}의 포트폴리오입니다. ${PROFILE.heroLines.join(" ")}`;

export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Backend Developer Portfolio" } as const;

export const HERO_ID = "main";

// 기존 사이트와 같은 키를 써서 방문자가 고른 테마를 유지합니다.
export const THEME_STORAGE_KEY = "jjw-theme-v2";
export const DEFAULT_THEME = "dark";

/** 첫 페인트 전에 테마 클래스를 맞춰 깜빡임을 막습니다. */
export const THEME_INIT_SCRIPT = `(function(){var t="${DEFAULT_THEME}";try{t=localStorage.getItem("${THEME_STORAGE_KEY}")||t}catch(e){}document.documentElement.classList.toggle("dark",t==="dark")})()`;
