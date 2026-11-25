import { PROFILE } from "@/data/profile";
import { cn } from "@/lib/cn";
import { SECTION_INNER } from "./Section";

interface FooterProps {
  bordered?: boolean;
  /** 패널처럼 페이지 전체가 아닌 상자 안에서 맨 위로 갈 때 씁니다. */
  onTop?: () => void;
}

export function Footer({ bordered = false, onTop }: FooterProps) {
  const toTop = "cursor-pointer border-0 bg-transparent p-0 text-[13px] text-muted transition-colors hover:text-accent-ink focus-visible:text-accent-ink";
  return (
    <footer className={cn(bordered && "border-t border-line")}>
      <div className={cn(SECTION_INNER, "flex justify-between pt-6 pb-10 text-[13px] text-muted")}>
        <span>© 2026 {PROFILE.name}</span>
        {onTop ? (
          <button type="button" onClick={onTop} className={toTop}>
            맨 위로 ↑
          </button>
        ) : (
          <a href="#top" className={toTop}>
            맨 위로 ↑
          </a>
        )}
      </div>
    </footer>
  );
}
