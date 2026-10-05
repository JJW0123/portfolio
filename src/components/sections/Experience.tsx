import { Section } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/Tech";
import { EXPERIENCES } from "@/data/profile";

export function Experience() {
  return (
    <Section id="experience" eyebrow="경력 사항" title="백엔드 아키텍처와 API 설계를 담당했습니다.">
      <div className="flex flex-col gap-9">
        {EXPERIENCES.map((experience) => (
          <div
            key={experience.title}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] items-start gap-x-10 gap-y-3"
          >
            <p className="m-0 text-right text-[15px] text-muted">{experience.period}</p>
            <div className="col-span-2 flex min-w-0 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="m-0 text-lg font-bold text-ink">{experience.title}</h3>
                <p className="m-0 text-sm leading-[1.7] text-body">{experience.summary}</p>
              </div>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {experience.stack.map((tech) => (
                  <TechChip key={tech.name} tech={tech} variant="filled" />
                ))}
              </ul>
              <p className="m-0 mt-1 -mb-1 text-[13px] font-bold tracking-[.08em] text-accent">담당 업무</p>
              <ul className="m-0 flex list-disc flex-col gap-[7px] py-0 pr-0 pl-[18px]">
                {experience.duties.map((duty) => (
                  <li key={duty} className="text-sm leading-[1.7] text-body">
                    {duty}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
