"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const NUMBER = /\d[\d,]*(?:\.\d+)?/g;

/** "4,500만 건+"처럼 글자가 섞인 값에서 숫자만 progress(0~1)만큼 키워 다시 씁니다. */
const formatAt = (value: string, progress: number): string =>
  value.replace(NUMBER, (match) => {
    const decimals = match.split(".")[1]?.length ?? 0;
    const target = Number(match.replace(/,/g, ""));
    const n = target * progress;
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: match.includes(","),
    });
  });

/** 화면에 들어오면 0부터 올라가는 수치. 서버 렌더와 움직임 줄이기 설정에서는 최종값을 그대로 보여줍니다. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [progress, setProgress] = useState(1);
  const [armed, setArmed] = useState(false);

  // 아직 화면 아래에 있을 때만 0으로 되돌려 둡니다. 이미 보이는 값이 갑자기 0이 되지 않게 합니다.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect && rect.top > window.innerHeight) {
      setProgress(0);
      setArmed(true);
    }
  }, []);

  useEffect(() => {
    if (!armed || !isInView) return;
    const controls = animate(0, 1, { duration: 1.2, ease: [0.22, 1, 0.36, 1], onUpdate: setProgress });
    return () => controls.stop();
  }, [armed, isInView]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{formatAt(value, progress)}</span>
    </span>
  );
}
