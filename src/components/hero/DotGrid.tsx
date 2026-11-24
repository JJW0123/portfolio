"use client";

import { useEffect, useRef } from "react";

const GAP = 36;
const SIZE = 2;
const RADIUS = 160;
const PUSH = 16;

const parseHex = (hex: string): [number, number, number] => {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * 히어로 전체에 깔리는 옅은 점 격자. 커서 근처 점만 바깥으로 밀리고 진해집니다 (Magnetic filings).
 * 터치 기기나 움직임 줄이기 설정에서는 정지한 격자만 그립니다.
 */
export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const isStatic =
      matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let colors = { base: [217, 217, 217], active: [154, 154, 154] };
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };
    let frame = 0;

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      colors = { base: parseHex(style.getPropertyValue("--dot")), active: parseHex(style.getPropertyValue("--dot-active")) };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const [br, bg, bb] = colors.base;
      const [ar, ag, ab] = colors.active;
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const t = dist < RADIUS ? (1 - dist / RADIUS) ** 2 * pointer.strength : 0;
          const px = dist > 0 ? x + (dx / dist) * PUSH * t : x;
          const py = dist > 0 ? y + (dy / dist) * PUSH * t : y;
          const s = SIZE + t * 1.4;
          ctx.fillStyle = `rgb(${br + (ar - br) * t},${bg + (ag - bg) * t},${bb + (ab - bb) * t})`;
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        }
      }
    };

    // 커서가 들어오고 나갈 때 세기를 천천히 올리고 내려, 멈추면 다시 조용한 격자로 돌아갑니다.
    const tick = () => {
      pointer.strength += (pointer.target - pointer.strength) * 0.12;
      draw();
      frame = Math.abs(pointer.target - pointer.strength) > 0.01 || pointer.target > 0 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.target = pointer.y >= 0 && pointer.y <= rect.height ? 1 : 0;
      wake();
    };
    const onLeave = () => {
      pointer.target = 0;
      wake();
    };

    readColors();
    resize();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    if (!isStatic) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
