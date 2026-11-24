import { cn } from "@/lib/cn";

/** 왼쪽에 번호·제목, 오른쪽에 내용을 두는 공통 섹션 틀. 넓은 화면에서는 오른쪽 진행선 자리를 비워 둡니다. */
export const SECTION_INNER =
  "mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-20 xl:pr-[200px]";

interface SectionProps {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, num, title, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("border-t border-rule", className)}>
      <div
        className={cn(
          SECTION_INNER,
          "grid gap-8 pt-9 pb-20 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:pb-[110px]",
        )}
      >
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[13px] text-muted">{num}</span>
          <h2 id={`${id}-title`} className="m-0 text-[22px] font-semibold">
            {title}
          </h2>
        </div>
        <div className="max-w-[940px] min-w-0">{children}</div>
      </div>
    </section>
  );
}
