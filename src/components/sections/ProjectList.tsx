"use client";

import { OpenProjectLink, useProjectDrawer } from "@/components/project/ProjectDrawerContext";
import { Section } from "@/components/ui/Section";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";
import { padNumber, shortMeta } from "@/lib/project";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const { openIndex } = useProjectDrawer();
  const isActive = openIndex === index;

  return (
    <OpenProjectLink
      id={`prj-${project.slug}`}
      slug={project.slug}
      className="grid w-full scroll-mt-[88px] grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-5 border-b border-line px-2 py-[22px] text-ink transition-colors duration-150 hover:bg-surface hover:text-ink"
    >
      <span className={cn("text-[22px] leading-none font-extrabold text-accent", isActive ? "opacity-100" : "opacity-[.32]")}>
        {padNumber(index + 1)}
      </span>

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
          <span className="text-lg font-bold text-ink">{project.title}</span>
          {project.badge && (
            <span className="rounded-md bg-chip px-[9px] py-[3px] text-xs font-semibold text-accent">{project.badge}</span>
          )}
        </div>
        <span className="text-[13px] text-muted">{shortMeta(project)}</span>
        {project.highlight && <span className="text-sm leading-[1.6] text-body">{project.highlight}</span>}
      </div>

      <span
        aria-hidden="true"
        className={cn("flex justify-center text-[17px] text-muted transition-transform duration-200", isActive && "translate-x-[3px]")}
      >
        →
      </span>
    </OpenProjectLink>
  );
}

export function ProjectList({ projects }: { projects: readonly Project[] }) {
  return (
    <Section id="project" eyebrow="프로젝트" title="직접 설계하고 구현한 프로젝트입니다.">
      <ol className="m-0 list-none border-t border-line p-0">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectRow project={project} index={index} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
