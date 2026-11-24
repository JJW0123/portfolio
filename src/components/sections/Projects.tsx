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
      <ol className="m-0 list-none p-0">
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
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-soft group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                    {project.title}
                  </span>
                </h3>
                <p className="m-0 text-sm text-muted">
                  {[shortMeta(project), project.badge].filter(Boolean).join(" · ")}
                </p>
                {project.highlight && (
                  <p className="m-0 max-w-[640px] text-base leading-[1.65] text-body">{project.highlight}</p>
                )}
              </div>
              <span
                aria-hidden="true"
                className="text-[22px] transition-[transform,color] duration-300 ease-out-soft group-hover:translate-x-2 group-hover:text-accent"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {preview}
    </Section>
  );
}
