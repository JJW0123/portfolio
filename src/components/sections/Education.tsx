import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { EDUCATION } from "@/data/profile";
import type { EducationItem } from "@/data/types";

function EducationRow({ item }: { item: EducationItem }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] items-start gap-x-10 gap-y-3">
      <p className="m-0 text-right text-[15px] text-muted">{item.period}</p>
      <div className="col-span-2 flex min-w-0 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-lg font-bold text-ink">{item.title}</h3>
          <p className="m-0 text-[15px] text-body">{item.subtitle}</p>
        </div>
        {item.details && (
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
            {item.details.map((detail) => (
              <li key={detail} className="text-sm leading-[1.7] text-body">
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Education() {
  const firstCertificate = EDUCATION.findIndex((item) => item.kind === "certificate");

  return (
    <Section id="education" eyebrow="교육 및 자격">
      <div className="flex flex-col gap-9">
        {EDUCATION.map((item, index) => (
          <Fragment key={item.title}>
            {index === firstCertificate && index > 0 && (
              <div
                aria-hidden="true"
                className="mx-auto h-px w-full max-w-[600px] bg-linear-to-r from-transparent via-line to-transparent"
              />
            )}
            <EducationRow item={item} />
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
