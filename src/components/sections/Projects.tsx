"use client";

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { useCursorPreview } from "@/components/ui/CursorPreview";
import type { Project } from "@/data/types";
import { isPlainClick, openProjectPanel } from "@/lib/panel";
import { padNumber, shortMeta } from "@/lib/project";

export function Projects({ projects }: { projects: Project[] }) {
  const { bind, preview } = useCursorPreview();

  return (
    <Section id="project" num="02" title="프로젝트">
      <ol className="project-list m-0 list-none p-0">
        {projects.map((project, index) => (
          <li key={project.slug} className="border-b border-line">
            <Link
              href={`/projects/${project.slug}/`}
              className="group grid grid-cols-[auto_minmax(0,1fr)_auto] gap-5 py-[30px] md:gap-7"
              {...bind(project.hoverPreview ?? project.media?.[0])}
              onClick={(event) => {
                if (!isPlainClick(event)) return;
                event.preventDefault();
                openProjectPanel(project.slug);
              }}
            >
              <span className="pt-1 font-mono text-sm text-muted">{padNumber(index + 1)}</span>
              <div className="flex flex-col gap-2.5">
                <h3 className="m-0 text-[clamp(22px,2.2vw,30px)] leading-[1.45] font-semibold tracking-[-0.025em]">
                  {project.title}
                </h3>
                <p className="m-0 text-sm text-muted">
                  {[shortMeta(project), project.badge].filter(Boolean).join(" · ")}
                </p>
                {project.highlight && (
                  <p className="m-0 max-w-[640px] text-base leading-[1.65] text-body">{project.highlight}</p>
                )}
              </div>
              {/* 회색 화살표가 오른쪽으로 빠져나가고, 왼쪽에서 주황 화살표가 들어옵니다. */}
              <span aria-hidden="true" className="relative block h-[33px] w-[26px] overflow-hidden text-[22px] leading-[33px]">
                <span className="absolute inset-0 text-right text-muted transition-[translate] duration-600 ease-out-soft group-hover:translate-x-8 group-focus-visible:translate-x-8 motion-reduce:transition-none">
                  →
                </span>
                <span className="absolute inset-0 -translate-x-8 text-right text-accent-ink transition-[translate] duration-600 ease-out-soft group-hover:translate-x-0 group-hover:delay-120 group-focus-visible:translate-x-0 group-focus-visible:delay-120 motion-reduce:transition-none">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {preview}
    </Section>
  );
}
