"use client";

import { AnimatePresence, type MotionValue, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import type { MediaItem } from "@/data/types";

export function useCursorPreview() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (!media) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [media, x, y]);

  const bind = (item: MediaItem | undefined) => ({
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType !== "mouse" || !item) return;
      x.set(event.clientX);
      y.set(event.clientY);
      setMedia(item);
    },
    onPointerLeave: () => setMedia(null),
  });

  return { bind, preview: <CursorPreview media={media} x={x} y={y} /> };
}

function CursorPreview({ media, x, y }: { media: MediaItem | null; x: MotionValue<number>; y: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const springX = useSpring(x, { stiffness: 260, damping: 28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28 });

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[288px] overflow-hidden bg-surface md:block"
          style={{ x: reduce ? x : springX, y: reduce ? y : springY, translateX: 24, translateY: "-50%" }}
          initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: reduce ? 0 : -3 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
          <img src={media.src} alt="" className="block aspect-[3/2] w-full object-contain" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
