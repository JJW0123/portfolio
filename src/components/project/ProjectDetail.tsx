import Link from "next/link";
import { createElement, type HTMLAttributes } from "react";
import { TechChip } from "@/components/ui/Tech";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";
import { fullMeta, padNumber } from "@/lib/project";

/** 프로젝트 제목의 레벨. 드로어는 h2, 상세 페이지는 h1이고 하위 제목은 여기서부터 한 단계씩 내려갑니다. */
type TitleLevel = 1 | 2;

function Heading({ level, ...props }: { level: number } & HTMLAttributes<HTMLHeadingElement>) {
  return createElement(`h${level}`, props);
}

interface ProjectHeaderProps {
  project: Project;
  titleLevel: TitleLevel;
  isSticky?: boolean;
  /** 우측 상단 버튼(닫기 등) */
  actions?: React.ReactNode;
  /** 하단에 겹쳐 놓을 요소(진행 바 등) */
  children?: React.ReactNode;
}

export function ProjectHeader({ project, titleLevel, isSticky, actions, children }: ProjectHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-[3] flex flex-col gap-6 bg-navy px-12 py-6 shadow-[0_4px_16px_rgb(7_23_38/.12)] max-[600px]:px-5",
        isSticky && "sticky top-0",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2.5">
          {project.badge && <span className="self-start text-xs font-bold text-navy-accent">{project.badge}</span>}
          <Heading
            level={titleLevel}
            className="m-0 text-[28px] leading-[1.28] font-extrabold tracking-[-.04em] text-balance text-white"
          >
            {project.title}
          </Heading>
          <p className="m-0 text-[13px] leading-[1.6] text-navy-text">{fullMeta(project)}</p>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, labelOffset, children }: { label: string; labelOffset: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-5 border-t border-line py-6 max-[600px]:grid-cols-1 max-[600px]:gap-2.5">
      <p className={cn("m-0 text-[13px] font-bold text-accent", labelOffset)}>{label}</p>
      {children}
    </div>
  );
}

export function ProjectDetail({ project, titleLevel }: { project: Project; titleLevel: TitleLevel }) {
  const level = titleLevel + 1;
  return (
    <div className="flex flex-col px-12 pt-2 max-[600px]:px-5">
      <div className="flex flex-col gap-6 pt-7 pb-6">
        {/* 사진·시연 영상이 준비될 때까지 자리만 표시합니다. */}
        <div className="box-content flex aspect-video items-center justify-center rounded-lg bg-surface p-4">
          <span className="text-center text-xs text-muted">{project.mediaText}</span>
        </div>

        {project.metrics.length > 0 && (
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col-reverse gap-1">
                <dt className="text-[13px] text-muted">{metric.label}</dt>
                <dd className="m-0 text-2xl font-extrabold tracking-[-.03em] text-ink">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {project.metricNote && <p className="m-0 text-xs leading-[1.6] text-muted">{project.metricNote}</p>}
      </div>

      <DetailRow label="프로젝트 소개" labelOffset="pt-[3px]">
        <p className="m-0 text-[17px] leading-[1.75] font-medium tracking-[-.025em] text-ink">{project.summary}</p>
      </DetailRow>

      <DetailRow label="사용 기술" labelOffset="pt-1.5">
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {project.stack.map((tech) => (
            <TechChip key={tech.name} tech={tech} variant="outline" />
          ))}
        </ul>
      </DetailRow>

      {project.links.length > 0 && (
        <DetailRow label="링크" labelOffset="pt-px">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-bold text-accent hover:text-ink"
              >
                {link.label} ↗
              </a>
            ))}
            {project.note && <span className="text-xs text-muted">{project.note}</span>}
          </div>
        </DetailRow>
      )}

      <section aria-labelledby="process-heading" className="border-t border-line pt-7">
        <Heading level={level} id="process-heading" className="m-0 mb-2 text-[17px] font-bold text-accent">
          문제 해결
        </Heading>
        {project.steps.map((step, index) => (
          <div key={index} className="relative border-b border-line py-7">
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-0 text-[72px] leading-none font-extrabold text-chip"
            >
              {padNumber(index + 1)}
            </span>
            {step.title && (
              <Heading level={level + 1} className="relative m-0 mb-3 pr-20 text-[17px] leading-[1.5] font-bold text-ink">
                {step.title}
              </Heading>
            )}
            <p className="relative m-0 pr-20 text-base leading-[1.8] tracking-[-.02em] whitespace-pre-line text-body">
              {step.lead}
              {step.strong && <strong className="font-bold text-ink">{step.strong}</strong>}
              {step.tail}
            </p>
          </div>
        ))}
      </section>

      {project.ps && (
        <section aria-labelledby="ps-heading" className="pt-7">
          <Heading level={level} id="ps-heading" className="m-0 mb-3 text-[17px] font-bold text-accent">
            PS
          </Heading>
          <p className="m-0 text-[15px] leading-[1.8] text-body">{project.ps}</p>
        </section>
      )}
    </div>
  );
}

interface PagerItemProps {
  project: Project;
  isNext: boolean;
  onSelect?: (project: Project) => void;
}

function PagerItem({ project, isNext, onSelect }: PagerItemProps) {
  const className = cn(
    "flex cursor-pointer flex-col gap-1.5 border-0 bg-transparent p-0 text-left",
    isNext && "items-end text-right",
  );
  const content = (
    <>
      <span className="text-xs font-bold text-muted">{isNext ? "다음 프로젝트 →" : "← 이전 프로젝트"}</span>
      <span className="text-[15px] leading-[1.45] font-bold text-ink">{project.title}</span>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(project)} className={className}>
        {content}
      </button>
    );
  }
  return (
    <Link href={`/projects/${project.slug}/`} className={className}>
      {content}
    </Link>
  );
}

export function ProjectPager({ prev, next, onSelect }: { prev: Project; next: Project; onSelect?: (project: Project) => void }) {
  return (
    <nav
      aria-label="다른 프로젝트"
      className="mx-12 mt-8 mb-10 grid grid-cols-2 gap-6 border-t-2 border-ink pt-6 max-[600px]:mx-5"
    >
      <PagerItem project={prev} isNext={false} onSelect={onSelect} />
      <PagerItem project={next} isNext onSelect={onSelect} />
    </nav>
  );
}
