import { Section } from "@/components/ui/Section";
import { TechIcon } from "@/components/ui/Tech";
import { SKILL_GROUPS } from "@/data/profile";
import { cn } from "@/lib/cn";

export function Skills() {
  return (
    <Section id="skills" eyebrow="기술 스택" title="프로젝트에서 사용한 기술입니다.">
      <div className="flex flex-col gap-8">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="m-0 mb-3.5 text-[13px] font-bold tracking-[.1em] text-muted uppercase">{group.label}</h3>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3 p-0">
              {group.items.map((tech) => (
                <li
                  key={tech.name}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border bg-surface px-2 py-4",
                    tech.isCore ? "border-accent" : "border-line",
                  )}
                >
                  <TechIcon tech={tech} size={30} />
                  <span className={cn("text-center text-xs font-semibold", tech.isCore ? "text-ink" : "text-body")}>
                    {tech.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="m-0 text-xs text-muted">주로 쓰는 기술은 파란 테두리로 표시했습니다.</p>
      </div>
    </Section>
  );
}
