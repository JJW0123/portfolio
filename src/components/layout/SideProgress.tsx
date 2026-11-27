"use client";

import { motion, useMotionValue } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface SideProgressProps {
  sections: readonly { id: string; label: string }[];
  /** 페이지 전체가 아닌 상자(패널) 안에서 스크롤될 때 그 상자 */
  container?: RefObject<HTMLElement | null>;
}

/** 이름이 겹치지 않도록 눈금 사이에 두는 최소 간격(px) */
const MIN_TICK_GAP = 44;
/** 스크롤 위치가 섹션 도착 위치와 이만큼 가까우면 도착한 것으로 봅니다. */
const SLACK = 2;

export function SideProgress({ sections, container }: SideProgressProps) {
  const navRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<number[]>([]);
  const [current, setCurrent] = useState(-1);
  const [covered, setCovered] = useState(false);
  /** 진행선 위 점과 채워진 선의 위치(0~1). 섹션에 도착하면 그 섹션의 눈금과 정확히 겹칩니다. */
  const progress = useMotionValue(0);
  const headY = useMotionValue(0);
  /** 항목을 눌러 이동한 섹션. 사용자가 직접 스크롤하면 풀립니다. */
  const pinnedRef = useRef<number | null>(null);
  const redrawRef = useRef<() => void>(() => {});

  // 부모가 렌더마다 새 배열을 넘겨도 효과가 다시 돌지 않도록 id 목록으로 비교합니다.
  const idsKey = sections.map(({ id }) => id).join(",");

  useEffect(() => {
    const box = container?.current ?? null;
    const ids = idsKey.split(",");
    const scrollTop = () => (box ? box.scrollTop : window.scrollY);
    const viewTop = () => (box ? box.getBoundingClientRect().top : 0);
    const viewHeight = () => (box ? box.clientHeight : window.innerHeight);
    const maxScroll = () =>
      Math.max(0, (box ? box.scrollHeight : document.documentElement.scrollHeight) - viewHeight());

    // 각 섹션 항목을 눌렀을 때 스크롤이 멈추는 위치와, 그 섹션의 눈금 위치(0~1)
    let landings: number[] = [];
    let tickAt: number[] = [];
    let max = 0;
    let railHeight = 0;

    const measure = () => {
      max = maxScroll();
      railHeight = railRef.current?.offsetHeight ?? 0;
      const padding = parseFloat(getComputedStyle(box ?? document.documentElement).scrollPaddingTop) || 0;
      landings = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top - viewTop() + scrollTop() - padding;
        return Math.min(max, Math.max(0, top));
      });
      const raw = landings.map((landing) => (max > 0 ? landing / max : 0));
      // 끝의 짧은 섹션들은 같은 자리로 몰리므로 이름이 겹치지 않게 최소 간격을 둡니다.
      const gap = railHeight > 0 ? MIN_TICK_GAP / railHeight : 0;
      for (let i = 1; i < raw.length; i++) raw[i] = Math.max(raw[i], raw[i - 1] + gap);
      for (let i = raw.length - 1; i >= 0; i--) raw[i] = Math.min(raw[i], 1 - (raw.length - 1 - i) * gap);
      tickAt = raw;
      setTicks(raw);
      redraw();
    };

    /**
     * 스크롤 위치를 진행선 위치로 바꿉니다. 섹션 도착 위치마다 그 섹션 눈금을 지나도록 구간별로 잇습니다.
     * 페이지 끝의 섹션들은 같은 위치에서 멈추므로, 누른 섹션이 있으면 그 섹션의 눈금으로 멈춥니다.
     */
    const toProgress = (y: number) => {
      const points = [{ x: 0, t: 0, i: -1 }, ...landings.map((x, i) => ({ x, t: tickAt[i] ?? 0, i })), { x: max, t: 1, i: -2 }];
      const merged: typeof points = [];
      for (const point of points) {
        const last = merged.at(-1);
        if (last && Math.abs(last.x - point.x) < 1) {
          if (last.i !== pinnedRef.current) merged[merged.length - 1] = point;
        } else merged.push(point);
      }
      if (y <= merged[0].x) return merged[0].t;
      for (let k = 1; k < merged.length; k++) {
        const a = merged[k - 1];
        const b = merged[k];
        if (y <= b.x) return a.t + ((b.t - a.t) * (y - a.x)) / (b.x - a.x);
      }
      return merged.at(-1)!.t;
    };

    const redraw = () => {
      const y = scrollTop();
      const p = toProgress(y);
      progress.set(p);
      headY.set(p * railHeight);

      let index = -1;
      landings.forEach((landing, i) => {
        if (landing <= y + SLACK) index = i;
      });
      setCurrent(pinnedRef.current ?? index);

      // 사진처럼 화면 끝까지 넓은 요소가 진행선 높이에 걸치면 진행선을 잠시 감춥니다.
      const band = navRef.current?.getBoundingClientRect();
      setCovered(
        Boolean(band && band.height > 0) &&
          [...document.querySelectorAll("[data-covers-side-progress]")].some((element) => {
            const rect = element.getBoundingClientRect();
            return rect.top < band!.bottom && rect.bottom > band!.top;
          }),
      );
    };
    redrawRef.current = redraw;

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    if (box?.firstElementChild) resizeObserver.observe(box.firstElementChild);
    const scroller: HTMLElement | Window = box ?? window;
    scroller.addEventListener("scroll", redraw, { passive: true });
    window.addEventListener("resize", measure);
    const unpin = () => {
      pinnedRef.current = null;
    };
    const unpinEvents = ["wheel", "touchstart", "keydown"] as const;
    unpinEvents.forEach((type) => window.addEventListener(type, unpin, { passive: true }));
    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", redraw);
      window.removeEventListener("resize", measure);
      unpinEvents.forEach((type) => window.removeEventListener(type, unpin));
    };
  }, [idsKey, container, progress, headY]);

  const goTo = (id: string, index: number) => {
    pinnedRef.current = index;
    redrawRef.current();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav
      ref={navRef}
      aria-label="읽은 위치"
      className={cn(
        "pointer-events-none fixed top-[15vh] right-7 z-40 hidden h-[70vh] w-[200px] transition-opacity duration-300 xl:block",
        covered && "opacity-0 [&_button]:pointer-events-none",
      )}
    >
      {/* 빈 영역은 마우스를 통과시켜 아래 프로젝트 행의 화살표까지 반응하게 하고, 섹션 이름만 누를 수 있게 합니다. */}
      <div ref={railRef} className="side-progress-rail absolute top-0 right-0 h-full w-px bg-line">
        <motion.div className="absolute top-0 left-0 h-full w-px origin-top bg-ink" style={{ scaleY: progress }} />
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
              onClick={() => goTo(id, i)}
              aria-current={i === current ? "location" : undefined}
              className={cn(
                "side-progress-label pointer-events-auto relative cursor-pointer border-0 bg-transparent py-1 pr-6 pl-2 text-right text-[13px] whitespace-nowrap transition-colors duration-200",
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
