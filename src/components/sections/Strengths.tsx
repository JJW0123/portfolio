import { OpenProjectLink } from "@/components/project/ProjectDrawerContext";
import { Section } from "@/components/ui/Section";
import { STRENGTHS } from "@/data/profile";
import { padNumber } from "@/lib/project";

export function Strengths() {
  return (
    <Section id="intro" eyebrow="핵심 역량" title="제가 문제를 다루는 방식입니다.">
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5 p-0">
        {STRENGTHS.map((strength, index) => (
          <li key={strength.title} data-su className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-6">
            <span className="text-sm font-extrabold text-accent">{padNumber(index + 1)}</span>
            <h3 className="m-0 text-lg font-bold text-ink">{strength.title}</h3>
            <p className="m-0 text-sm leading-[1.75] text-body">{strength.body}</p>
            <OpenProjectLink
              slug={strength.projectSlug}
              className="mt-auto inline-flex items-center gap-1.5 pt-1.5 text-[13px] font-bold"
            >
              {strength.linkLabel} <span aria-hidden="true">→</span>
            </OpenProjectLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
