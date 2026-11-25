"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface SideProgressProps {
  sections: readonly { id: string; label: string }[];
  /** 페이지 전체가 아닌 상자(패널) 안에서 스크롤될 때 그 상자 */
  container?: RefObject<HTMLElement | null>;
}

export function SideProgress({ sections, container }: SideProgressProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll(container ? { container } : undefined);
  const [railHeight, setRailHeight] = useState(0);
  const [ticks, setTicks] = useState<number[]>([]);
  const [current, setCurrent] = useState(-1);
  const headY = useTransform(scrollYProgress, (p) => p * railHeight);

  // 부모가 렌더마다 새 배열을 넘겨도 효과가 다시 돌지 않도록 id 목록으로 비교합니다.
  const idsKey = sections.map(({ id }) => id).join(",");

  useEffect(() => {
    const box = container?.current ?? null;
    const ids = idsKey.split(",");
    const scrollTop = () => (box ? box.scrollTop : window.scrollY);
    const viewTop = () => (box ? box.getBoundingClientRect().top : 0);
    const viewHeight = () => (box ? box.clientHeight : window.innerHeight);
    const maxScroll = () => (box ? box.scrollHeight : document.documentElement.scrollHeight) - viewHeight();

    const measure = () => {
      const max = maxScroll();
      const height = railRef.current?.offsetHeight ?? 0;
      setRailHeight(height);
      const raw = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el || max <= 0) return 0;
        return Math.min(1, Math.max(0, (el.getBoundingClientRect().top - viewTop() + scrollTop()) / max));
      });
      // 끝의 짧은 섹션들은 같은 자리로 몰리므로 이름이 겹치지 않게 최소 간격을 둡니다.
      const gap = height > 0 ? 44 / height : 0;
      for (let i = 1; i < raw.length; i++) raw[i] = Math.max(raw[i], raw[i - 1] + gap);
      for (let i = raw.length - 1; i >= 0; i--) raw[i] = Math.min(raw[i], 1 - (raw.length - 1 - i) * gap);
      setTicks(raw);
    };

    const update = () => {
      const line = viewTop() + viewHeight() * 0.5;
      let index = -1;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) index = i;
      });
      // 맨 끝까지 내렸으면 마지막 섹션이 화면 절반에 못 미쳐도 현재 섹션으로 봅니다.
      if (scrollTop() >= maxScroll() - 2) index = ids.length - 1;
      setCurrent(index);
    };

    measure();
    update();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    if (box?.firstElementChild) resizeObserver.observe(box.firstElementChild);
    const scroller: HTMLElement | Window = box ?? window;
    scroller.addEventListener("scroll", update, { passive: true });
    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", update);
    };
  }, [idsKey, container]);

  const goTo = (id: string) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav
      aria-label="읽은 위치"
      className="pointer-events-none fixed top-[15vh] right-7 z-40 hidden h-[70vh] w-[200px] xl:block"
    >
      {/* 빈 영역은 마우스를 통과시켜 아래 프로젝트 행의 화살표까지 반응하게 하고, 섹션 이름만 누를 수 있게 합니다. */}
      <div ref={railRef} className="absolute top-0 right-0 h-full w-px bg-line">
        <motion.div
          className="absolute top-0 left-0 h-full w-px origin-top bg-ink"
          style={{ scaleY: scrollYProgress }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute -top-[3px] -left-[3px] size-[7px] rounded-full bg-accent"
          style={{ y: headY }}
        />
      </div>
      <ol className="m-0 list-none p-0">
        {sections.map(({ id, label }, i) => (
          <li key={id} className="absolute right-0 flex -translate-y-1/2 items-center" style={{ top: `${(ticks[i] ?? 0) * 100}%` }}>
            <button
              type="button"
              onClick={() => goTo(id)}
              aria-current={i === current ? "location" : undefined}
              className={cn(
                "pointer-events-auto cursor-pointer border-0 bg-transparent py-1 pr-6 pl-2 text-right text-[13px] whitespace-nowrap transition-colors duration-200",
                i === current ? "font-semibold text-accent-ink" : i < current ? "text-body" : "text-faint",
                "hover:text-accent-ink focus-visible:text-accent-ink",
              )}
            >
              {label}
            </button>
            <span
              aria-hidden="true"
              className={cn("absolute right-[-6px] h-px w-[13px]", i === current ? "bg-accent" : i < current ? "bg-ink" : "bg-faint")}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
