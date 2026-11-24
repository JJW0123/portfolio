/**
 * 메인 페이지에서 프로젝트를 누르면 페이지를 옮기지 않고 주소만 바꾼 뒤 상세 패널을 엽니다.
 * Next.js는 history.pushState/replaceState를 라우터와 동기화하므로 usePathname이 새 주소를 따라갑니다.
 */
const projectPath = (slug: string) => `/projects/${slug}/`;

export const slugFromPath = (pathname: string | null): string | null =>
  pathname?.match(/^\/projects\/([^/]+)\/?$/)?.[1] ?? null;

export const isPlainClick = (event: React.MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export const openProjectPanel = (slug: string) => window.history.pushState(null, "", projectPath(slug));

export const switchProjectPanel = (slug: string) => window.history.replaceState(null, "", projectPath(slug));
