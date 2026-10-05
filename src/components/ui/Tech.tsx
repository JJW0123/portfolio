"use client";

import { useState } from "react";
import type { Tech } from "@/data/types";
import { cn } from "@/lib/cn";

/** 아이콘 → 이모지 → 약어 배지 순으로 표시하고, 아이콘 로드에 실패하면 숨깁니다. */
export function TechIcon({ tech, size }: { tech: Tech; size: number }) {
  const [isBroken, setIsBroken] = useState(false);

  if (tech.icon && !isBroken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 외부 SVG라 next/image 최적화가 필요 없습니다.
      <img
        src={tech.icon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="block"
        onError={() => setIsBroken(true)}
      />
    );
  }
  if (tech.emoji) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center leading-none"
        style={{ width: size, height: size, fontSize: size * 0.8 }}
      >
        {tech.emoji}
      </span>
    );
  }
  if (tech.abbr) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex size-4 items-center justify-center rounded bg-accent-soft text-[9px] font-extrabold text-bg"
      >
        {tech.abbr}
      </span>
    );
  }
  return null;
}

/** filled: 경력 칩, outline: 프로젝트 상세 칩 */
export function TechChip({ tech, variant }: { tech: Tech; variant: "filled" | "outline" }) {
  const isFilled = variant === "filled";
  return (
    <li
      className={cn(
        "inline-flex items-center rounded-md",
        isFilled ? "gap-1.5 bg-chip py-[5px] pr-2.5 pl-1.5" : "gap-[7px] border border-line py-1.5 pr-[11px] pl-2",
      )}
    >
      <TechIcon tech={tech} size={16} />
      <span className={cn("font-semibold", isFilled ? "text-xs text-body" : "text-[13px] text-ink")}>{tech.name}</span>
    </li>
  );
}
