"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { Footer } from "@/components/layout/Footer";
import { SECTION_INNER, Section } from "@/components/layout/Section";
import { SideProgress } from "@/components/layout/SideProgress";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";
import { fullMeta, padNumber } from "@/lib/project";
import { CountUp } from "./CountUp";
import { MediaSlider } from "./MediaSlider";
import { ProjectPager } from "./ProjectPager";
import { useImageZoom } from "./useImageZoom";

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 border-b border-line py-[18px] md:grid-cols-[160px_minmax(0,1fr)] md:gap-10">
      <dt className="pt-0.5 text-sm text-muted">{label}</dt>
      <dd className="m-0">{children}</dd>
    </div>
  );
}

interface ProjectDetailViewProps {
  project: Project;
  prev: Project;
  next: Project;
  /** 패널로 열렸을 때 스크롤되는 상자. 없으면 페이지 전체 스크롤을 씁니다. */
  scrollContainer?: RefObject<HTMLElement | null>;
  /** 패널 안에서 이전/다음 프로젝트를 고르면 페이지 이동 대신 호출됩니다. */
  onSelectProject?: (project: Project) => void;
  onScrollTop?: () => void;
}

/** 상세 페이지 본문. 단독 페이지와 메인 위에 열리는 패널이 같이 씁니다. */
export function ProjectDetailView({ project, prev, next, scrollContainer, onSelectProject, onScrollTop }: ProjectDetailViewProps) {
  const isPanel = Boolean(scrollContainer);
  const slides = project.media ?? [];
  const roleDetail = project.roleDetail ?? project.role;
  const { retroMedia } = project;
  const { openImage, imageZoom } = useImageZoom();

  const sections = [
    { id: "overview", label: "개요", show: true },
    { id: "results", label: "성과", show: project.metrics.length > 0 },
    { id: "problems", label: "문제 해결", show: project.steps.length > 0 },
    { id: "retro", label: "회고", show: Boolean(project.ps) },
  ].filter((section) => section.show);
  const num = (id: string) => padNumber(sections.findIndex((section) => section.id === id) + 1);

  return (
    <>
      <header className={cn(SECTION_INNER, "flex flex-col gap-6 pb-16", isPanel ? "pt-6" : "pt-14")}>
        {!isPanel && (
          <Link href="/#project" className="self-start text-sm text-muted transition-colors hover:text-accent-ink focus-visible:text-accent-ink">
            ← 전체 프로젝트
          </Link>
        )}
        <div className="flex flex-col gap-4 pt-6 lg:pt-10">
          {project.badge && <p className="m-0 text-[15px] font-semibold text-accent-ink">{project.badge}</p>}
          <h1 className="m-0 text-[clamp(36px,4.5vw,64px)] leading-[1.3] font-semibold tracking-[-0.04em]">
            {project.title}
          </h1>
          <p className="m-0 text-[15px] text-muted">{fullMeta(project)}</p>
        </div>
      </header>

      {slides.length > 0 && (
        <MediaSlider slides={slides} label={`${project.title} 화면`} note={project.mediaNote} />
      )}

      <Section id="overview" num={num("overview")} title="개요">
        <dl className="m-0">
          <InfoRow label="소개">
            <p className="m-0 text-lg leading-[1.7]">{project.summary}</p>
          </InfoRow>
          {roleDetail && (
            <InfoRow label="맡은 일">
              <p className="m-0 text-base leading-[1.7] text-body">{roleDetail}</p>
            </InfoRow>
          )}
          {project.stack.length > 0 && (
            <InfoRow label="사용 기술">
              <p className="m-0 text-base leading-[1.7] text-body">{project.stack.join(", ")}</p>
              {project.stackNote && (
                <p className="m-0 mt-2 text-base leading-[1.7] text-body">{project.stackNote}</p>
              )}
            </InfoRow>
          )}
          {(project.links.length > 0 || project.note) && (
            <InfoRow label="링크">
              <div className="flex flex-wrap items-baseline gap-x-10 gap-y-2">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
                  >
                    {link.label} ↗
                  </a>
                ))}
                {project.note && <span className="text-[13px] text-muted">{project.note}</span>}
              </div>
            </InfoRow>
          )}
        </dl>
      </Section>

      {project.metrics.length > 0 && (
        <Section id="results" num={num("results")} title="성과">
          <dl
            className={cn(
              "m-0 grid gap-8 md:gap-0",
              project.metrics.length > 1 && (project.metrics.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"),
            )}
          >
            {project.metrics.map((metric, i) => (
              <div
                key={metric.label}
                className={cn("flex flex-col-reverse gap-2 md:pr-6", i > 0 && "md:border-l md:border-line md:pl-6")}
              >
                <dt className="text-sm text-muted">{metric.label}</dt>
                <dd className="m-0 text-[clamp(26px,2.6vw,40px)] leading-[1.3] font-semibold tracking-[-0.035em]">
                  <CountUp value={metric.value} />
                </dd>
              </div>
            ))}
          </dl>
          {project.metricNote && <p className="m-0 mt-10 text-[13px] leading-[1.6] text-muted">{project.metricNote}</p>}
        </Section>
      )}

      {project.steps.length > 0 && (
        <Section id="problems" num={num("problems")} title="문제 해결">
          <ol className="m-0 list-none border-t border-line p-0">
            {project.steps.map((step, i) => (
              <li key={i} className="flex flex-col gap-6 border-b border-line py-9 md:flex-row md:justify-between md:gap-12">
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <h3 className="m-0 flex items-baseline gap-4 text-[22px] leading-[1.45] font-medium">
                    <span className="font-mono text-[13px] font-normal text-muted">{padNumber(i + 1)}</span>
                    {step.title}
                  </h3>
                  <p className="m-0 max-w-[680px] text-base leading-[1.7] whitespace-pre-line text-body">
                    {step.lead}
                    {step.strong && <span className="text-ink">{step.strong}</span>}
                    {step.tail}
                  </p>
                  {step.result && (
                    <p className="m-0 font-mono text-sm text-ink">
                      <span aria-hidden="true" className="text-muted">→</span> {step.result}
                    </p>
                  )}
                </div>
                {step.image && (
                  <a href={step.image.src} target="_blank" rel="noopener noreferrer" className="shrink-0 self-start">
                    {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
                    <img
                      src={step.image.src}
                      alt={step.image.alt}
                      className="block aspect-[280/176] w-full bg-surface object-cover md:w-[280px]"
                    />
                  </a>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {project.ps && (
        <Section id="retro" num={num("retro")} title="회고">
          <p className="m-0 max-w-[640px] text-[17px] leading-[1.8]">{project.ps}</p>
          {retroMedia && (
            <figure className="m-0 mt-6 max-w-[801px]">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`이미지 확대: ${retroMedia.caption ?? retroMedia.alt}`}
                onClick={(event) =>
                  openImage({ items: [retroMedia], index: 0, trigger: event.currentTarget, originalSize: true })
                }
                className="relative block w-full cursor-zoom-in border-0 bg-transparent p-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기에서 원본을 사용합니다. */}
                <img src={retroMedia.src} alt={retroMedia.alt} className="block h-auto w-full" />
              </button>
              <figcaption className="mt-2 flex flex-wrap justify-between gap-x-3 text-xs leading-relaxed text-muted">
                <span>{retroMedia.caption}</span>
                <span>눌러서 확대</span>
              </figcaption>
            </figure>
          )}
          {retroMedia && imageZoom}
        </Section>
      )}

      <ProjectPager prev={prev} next={next} onSelect={onSelectProject} />
      <Footer bordered onTop={onScrollTop} />
      <SideProgress key={project.slug} sections={sections} container={scrollContainer} />
    </>
  );
}
