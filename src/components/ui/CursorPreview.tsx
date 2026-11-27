"use client";

import { AnimatePresence, type MotionValue, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/data/types";

const WIDTH = 288;
const HEIGHT = (WIDTH * 2) / 3;
/** 가리킨 행과 이미지 사이 간격 */
const GAP = 12;
/** 화면 가장자리 여백 */
const EDGE = 8;

/** 오른쪽 사이드 진행선이 보이면 그 앞에서 멈춥니다. 넓은 화면에서만 보이므로 보이는 것만 셉니다. */
const safeRight = () => {
  let right = window.innerWidth;
  document.querySelectorAll('nav[aria-label="읽은 위치"]').forEach((nav) => {
    const rect = nav.getBoundingClientRect();
    if (rect.width > 0 && rect.left < right) right = rect.left;
  });
  return right - EDGE;
};

/** 미리보기가 고정 헤더 아래에 오도록 제한합니다. */
const safeTop = () => {
  const bar = document.querySelector("header.fixed")?.getBoundingClientRect();
  return Math.max(bar ? bar.bottom : 0, 0) + EDGE;
};
const SPRING = { stiffness: 260, damping: 30 };

/**
 * 프로젝트 행에 마우스를 올리면 미리보기 이미지를 띄웁니다.
 * 가로는 커서를 따라가고, 세로는 가리킨 행 바로 위에 붙여 읽고 있는 줄을 가리지 않습니다.
 * 행 위쪽에 자리가 없으면 행 아래로 내립니다.
 */
export function useCursorPreview() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const rowRef = useRef<HTMLElement | null>(null);
  const pointerX = useRef(0);

  const place = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const rect = row.getBoundingClientRect();
    const above = rect.top - GAP - HEIGHT;
    y.set(above >= safeTop() ? above : rect.bottom + GAP);
    x.set(Math.min(Math.max(pointerX.current + 16, EDGE), safeRight() - WIDTH));
  }, [x, y]);

  useEffect(() => {
    if (!media) return;
    const onMove = (event: PointerEvent) => {
      pointerX.current = event.clientX;
      place();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", place);
    };
  }, [media, place]);

  const bind = (item: MediaItem | undefined) => ({
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse" || !item) return;
      const wasHidden = rowRef.current === null;
      rowRef.current = event.currentTarget;
      pointerX.current = event.clientX;
      place();
      // 새로 나타날 때는 이전 자리에서 미끄러져 오지 않도록 바로 옮깁니다. 행 사이를 옮길 때만 부드럽게 따라갑니다.
      if (wasHidden) {
        springX.jump(x.get());
        springY.jump(y.get());
      }
      setMedia(item);
    },
    onPointerLeave: () => {
      rowRef.current = null;
      setMedia(null);
    },
  });

  const position = { x: reduce ? x : springX, y: reduce ? y : springY };
  return { bind, preview: <CursorPreview media={media} position={position} reduce={Boolean(reduce)} /> };
}

interface CursorPreviewProps {
  media: MediaItem | null;
  position: { x: MotionValue<number>; y: MotionValue<number> };
  reduce: boolean;
}

function CursorPreview({ media, position, reduce }: CursorPreviewProps) {
  return (
    <AnimatePresence>
      {media && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 hidden overflow-hidden bg-surface md:block"
          style={{ width: WIDTH, ...position }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
          <img src={media.src} alt="" className="block aspect-[3/2] w-full object-contain" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
