import { Section } from "@/components/layout/Section";
import { HISTORY } from "@/data/profile";

export function Career() {
  const items = HISTORY.find((group) => group.label === "경력")?.items ?? [];

  return (
    <Section id="career" num="01" title="경력">
      <ol className="m-0 flex list-none flex-col gap-14 p-0">
        {items.map((item) => (
          <li key={item.title} className="grid gap-3 md:grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[160px_minmax(0,1fr)] md:gap-10">
            <span className="pt-1 font-mono text-sm text-muted">{item.period}</span>
            <div className="flex flex-col gap-3.5">
              <h3 className="m-0 text-[22px] font-semibold">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="m-0 text-base leading-[1.7] text-body">
                  {item.subtitle}
                </p>
              )}
              {item.details && (
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {item.details.map((detail) => (
                    <li key={detail} className="text-[15px] leading-[1.6] text-body">
                      — {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
