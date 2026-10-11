import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { HISTORY } from "@/data/profile";
import type { HistoryItem } from "@/data/types";

/**
 * 날짜 열 1칸 + 내용 열 2칸. 기존 교육 섹션과 같은 비율입니다.
 * 한 줄로 쌓이는 좁은 화면에서는 모두 왼쪽 정렬해 시선이 좌우로 오가지 않게 합니다.
 */
const ROW = "grid items-start gap-x-10 gap-y-1.5 md:grid-cols-3";
const DATE_COLUMN = "m-0 md:text-right";

function MoreDetails({ details }: { details: string[] }) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-bold text-accent [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">자세히 보기</span>
        <span className="hidden group-open:inline">접기</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className="h-1.5 w-2.5 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </summary>
      <ul className="m-0 mt-2.5 flex list-disc flex-col gap-1 pl-5">
        {details.map((detail) => (
          <li key={detail} className="text-sm leading-[1.7] text-body">
            {detail}
          </li>
        ))}
      </ul>
    </details>
  );
}

function HistoryRow({ item }: { item: HistoryItem }) {
  return (
    <div className={ROW}>
      <p className={`${DATE_COLUMN} text-[15px] text-muted`}>{item.period}</p>
      <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-lg font-bold text-ink">{item.title}</h3>
          {item.subtitle && <p className="m-0 text-[15px] text-body">{item.subtitle}</p>}
        </div>
        {item.details && <MoreDetails details={item.details} />}
      </div>
    </div>
  );
}

export function History() {
  return (
    <Section id="history" eyebrow="이력" title="지금까지의 경력과 교육입니다.">
      <div className="flex flex-col gap-9">
        {HISTORY.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && (
              <div
                aria-hidden="true"
                className="mx-auto h-px w-full max-w-[600px] bg-linear-to-r from-transparent via-line to-transparent"
              />
            )}
            {/* 빈 칸을 두어 분류명이 날짜 열 위에 오게 합니다. */}
            <div className={ROW}>
              <p className={`${DATE_COLUMN} text-[13px] font-bold tracking-[.1em] text-accent`}>{group.label}</p>
              <div aria-hidden="true" className="max-md:hidden md:col-span-2" />
            </div>
            {group.items.map((item) => (
              <HistoryRow key={item.title} item={item} />
            ))}
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
