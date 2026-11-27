import { Section } from "@/components/layout/Section";
import { HISTORY } from "@/data/profile";

export function Education() {
  const groups = HISTORY.filter((group) => group.label !== "경력");

  return (
    <Section id="education" num="04" title="교육 및 자격">
      <div className="flex flex-col gap-9">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="m-0 pb-1.5 text-[13px] font-medium text-muted">{group.label}</h3>
            <ul className="m-0 list-none p-0">
              {group.items.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-y-1.5 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline md:gap-x-10"
                >
                  {/* 이름 옆 메모는 줄이 좁으면 이름 아래로 내려가고, 좁은 화면에서는 날짜도 맨 아래로 내려갑니다. */}
                  <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                    <span className="text-lg font-medium">{item.title}</span>
                    {item.status && <span className="text-sm font-medium text-accent-ink">{item.status}</span>}
                    {item.subtitle && <span className="text-sm text-muted">{item.subtitle}</span>}
                  </div>
                  <span className="font-mono text-sm whitespace-nowrap text-muted md:text-right">{item.period}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
