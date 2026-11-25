"use client";

import Link from "next/link";
import { useCursorPreview } from "@/components/ui/CursorPreview";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";

interface ProjectPagerProps {
  prev: Project;
  next: Project;
  onSelect?: (project: Project) => void;
}

export function ProjectPager({ prev, next, onSelect }: ProjectPagerProps) {
  const { bind, preview } = useCursorPreview();
  const items = [
    { project: prev, label: "← 이전 프로젝트", isNext: false },
    { project: next, label: "다음 프로젝트 →", isNext: true },
  ];

  return (
    <nav aria-label="다른 프로젝트" className="border-t border-rule">
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
        {items.map(({ project, label, isNext }) => (
          <Link
            key={label}
            href={`/projects/${project.slug}/`}
            {...bind(project.media?.[0])}
            onClick={(event) => {
              if (!onSelect || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              onSelect(project);
            }}
            className={cn(
              "group flex flex-col gap-3 px-5 pt-12 pb-16 md:px-10 lg:px-20",
              isNext && "border-t border-line md:items-end md:border-t-0 md:border-l md:text-right xl:pr-[200px]",
            )}
          >
            <span className="text-[13px] text-muted transition-colors group-hover:text-accent-ink group-focus-visible:text-accent-ink">{label}</span>
            <span className="text-[clamp(24px,2.3vw,32px)] leading-[1.4] font-semibold tracking-[-0.03em]">
              <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-soft group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                {project.title}
              </span>
            </span>
          </Link>
        ))}
      </div>
      {preview}
    </nav>
  );
}
