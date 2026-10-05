import { Section } from "@/components/ui/Section";
import { TechIcon } from "@/components/ui/Tech";
import { SKILL_GROUPS } from "@/data/profile";

export function Skills() {
  return (
    <Section id="skills" eyebrow="기술 스택" title="프로젝트에서 직접 사용한 기술입니다.">
      <div className="flex flex-col gap-8">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="m-0 mb-3.5 text-[13px] font-bold tracking-[.1em] text-muted uppercase">{group.label}</h3>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3 p-0">
              {group.items.map((tech) => (
                <li
                  key={tech.name}
                  className="flex flex-col items-center gap-2 rounded-lg border border-line bg-surface px-2 py-4"
                >
                  <TechIcon tech={tech} size={30} />
                  <span className="text-center text-xs font-semibold text-body">{tech.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
