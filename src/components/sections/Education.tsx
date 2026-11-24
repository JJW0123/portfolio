import { Section } from "@/components/layout/Section";
import { HISTORY } from "@/data/profile";

export function Education() {
  const items = HISTORY.filter((group) => group.label !== "경력").flatMap((group) => group.items);

  return (
    <Section id="education" num="04" title="교육 및 자격">
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <li
            key={item.title}
            className="grid gap-1.5 border-b border-line py-[18px] md:grid-cols-[150px_minmax(0,1fr)] md:items-baseline md:gap-x-10 xl:grid-cols-[160px_minmax(0,1fr)_auto]"
          >
            <span className="font-mono text-sm text-muted">{item.period}</span>
            <span className="text-lg font-medium">{item.title}</span>
            {item.subtitle && <span className="text-[15px] text-muted md:col-start-2 xl:col-start-auto">{item.subtitle}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
