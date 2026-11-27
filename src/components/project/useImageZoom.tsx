"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/data/types";
import { cn } from "@/lib/cn";
import { padNumber } from "@/lib/project";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const OPEN_MS = 420;
const CLOSE_MS = 320;

interface OpenOptions {
  items: MediaItem[];
  index: number;
  trigger: HTMLElement;
  /** 그래프처럼 원본 크기로 봐야 하는 이미지. 화면보다 크면 스크롤합니다. */
  originalSize?: boolean;
  /** 확대 화면에서 다른 사진으로 넘겼을 때 바깥 슬라이더도 같은 사진으로 맞춥니다. */
  onIndexChange?: (index: number) => void;
  /** 닫을 때 돌아갈 자리(사진 버튼). 없으면 처음 누른 버튼으로 돌아갑니다. */
  resolveTrigger?: (index: number) => HTMLElement | null;
}

interface ZoomState {
  items: MediaItem[];
  index: number;
  direction: 1 | -1;
  originalSize: boolean;
  session: number;
}

/** 썸네일에서 실제로 사진이 그려진 영역. object-contain이면 상자보다 작습니다. */
function visibleRect(element: HTMLElement) {
  const image = element instanceof HTMLImageElement ? element : element.querySelector("img");
  const box = (image ?? element).getBoundingClientRect();
  if (!image || !image.naturalWidth || !image.naturalHeight || box.width === 0 || box.height === 0) return box;
  const ratio = image.naturalWidth / image.naturalHeight;
  const width = Math.min(box.width, box.height * ratio);
  const height = width / ratio;
  return new DOMRect(box.left + (box.width - width) / 2, box.top + (box.height - height) / 2, width, height);
}

const isOnScreen = (rect: DOMRect) =>
  rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;

/** 두 사각형 사이를 오가는 transform. 가운데를 기준으로 옮기고 크기를 맞춥니다. */
const flipTransform = (from: DOMRect, to: DOMRect) => {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${from.width / to.width})`;
};

/**
 * 사진을 누르면 화면 전체를 덮는 갤러리로 엽니다.
 * 누른 사진 자리에서 커지며 열리고, 좌우 화살표·키보드·스와이프로 넘기며, 닫으면 제자리로 돌아갑니다.
 */
export function useImageZoom() {
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  // 처음 열 때 커지는 효과가 시작되기 전까지 확대 사진을 숨겨, 화면 가운데에 먼저 번쩍이지 않게 합니다.
  const [shown, setShown] = useState(false);
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const optionsRef = useRef<OpenOptions | null>(null);
  const closingRef = useRef(false);
  const draggedRef = useRef(false);
  const sessionRef = useRef(0);

  function openImage(options: OpenOptions) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    optionsRef.current = options;
    closingRef.current = false;
    sessionRef.current += 1;
    setShown(false);
    setZoom({
      items: options.items,
      index: options.index,
      direction: 1,
      originalSize: Boolean(options.originalSize),
      session: sessionRef.current,
    });
    dialog.showModal();
  }

  const triggerFor = (index: number) => {
    const options = optionsRef.current;
    if (!options) return null;
    return options.resolveTrigger?.(index) ?? (index === options.index ? options.trigger : null);
  };

  // 열릴 때: 누른 사진 자리에서 화면 크기로 커집니다.
  const session = zoom?.session;
  useEffect(() => {
    if (session === undefined) return;
    const image = imageRef.current;
    const trigger = optionsRef.current?.trigger;
    if (!image) return;
    let cancelled = false;
    // 지난번 닫을 때 남은 페이드아웃(fill: forwards)을 지워야 다시 열 때 투명하게 남지 않습니다.
    for (const element of [backdropRef.current, chromeRef.current]) element?.getAnimations().forEach((a) => a.cancel());
    const fadeIn = { duration: reduce ? 0 : 260, easing: "ease-out", fill: "both" as const };
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], fadeIn);
    chromeRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { ...fadeIn, delay: reduce ? 0 : 120 });
    image.decode().catch(() => undefined).then(() => {
      if (cancelled) return;
      image.style.opacity = "1";
      setShown(true);
      if (reduce || !trigger) return;
      const from = visibleRect(trigger);
      const to = image.getBoundingClientRect();
      if (!isOnScreen(from) || to.width === 0) return;
      image.animate([{ transform: flipTransform(from, to) }, { transform: "none" }], { duration: OPEN_MS, easing: EASE });
    });
    return () => {
      cancelled = true;
    };
  }, [session, reduce]);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;
    closingRef.current = true;
    const image = imageRef.current;
    const duration = reduce ? 0 : CLOSE_MS;
    const fadeOut = { duration, easing: EASE, fill: "forwards" as const };
    const animations = [
      backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], fadeOut),
      chromeRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { ...fadeOut, duration: duration * 0.6 }),
    ];
    if (image) {
      const target = zoom ? triggerFor(zoom.index) : null;
      const from = image.getBoundingClientRect();
      const to = target ? visibleRect(target) : null;
      animations.push(
        to && isOnScreen(to) && from.width > 0
          ? image.animate([{ transform: "none" }, { transform: flipTransform(to, from) }], fadeOut)
          : image.animate([{ opacity: 1 }, { opacity: 0 }], fadeOut),
      );
    }
    Promise.all(animations.map((animation) => animation?.finished)).finally(() => dialog.close());
  }, [zoom, reduce]);

  const go = (step: 1 | -1) => {
    if (!zoom || zoom.items.length < 2 || closingRef.current) return;
    const count = zoom.items.length;
    const index = (zoom.index + step + count) % count;
    setZoom({ ...zoom, index, direction: step });
    optionsRef.current?.onIndexChange?.(index);
  };

  const current = zoom?.items[zoom.index];
  const count = zoom?.items.length ?? 0;
  const canSlide = count > 1 && !zoom?.originalSize;

  const imageZoom = (
    <dialog
      ref={dialogRef}
      aria-label="이미지 확대 보기"
      className="project-image-zoom fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-white backdrop:bg-transparent"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onKeyDown={(event) => {
        // Esc와 Tab은 바깥 프로젝트 패널 대신 네이티브 다이얼로그에 맡깁니다.
        event.stopPropagation();
        // 브라우저가 Esc로 바로 닫으면 줄어드는 효과를 못 보여 주므로 직접 닫습니다.
        if (event.key === "Escape") {
          event.preventDefault();
          requestClose();
        }
        if (event.key === "ArrowLeft") go(-1);
        if (event.key === "ArrowRight") go(1);
      }}
      onClose={() => {
        const target = zoom ? triggerFor(zoom.index) : null;
        setZoom(null);
        imageRef.current = null;
        target?.focus({ preventScroll: true });
      }}
    >
      <div ref={backdropRef} aria-hidden="true" className="absolute inset-0 bg-[#0c0c0c]" />

      {current && zoom && (
        <div
          className={cn(
            "absolute inset-x-0 top-14 bottom-16",
            zoom.originalSize ? "overflow-auto overscroll-contain" : "md:inset-x-20",
          )}
          onClick={(event) => {
            if (event.target === event.currentTarget) requestClose();
          }}
        >
          {zoom.originalSize ? (
            <div
              className="flex min-h-full w-max min-w-full items-center justify-center px-4"
              onClick={(event) => {
                if (event.target === event.currentTarget) requestClose();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 확대 화면에서는 원본을 표시합니다. */}
              <img
                ref={(element) => {
                  if (element) imageRef.current = element;
                }}
                src={current.src}
                alt={current.alt}
                style={{ opacity: shown ? 1 : 0 }}
                className="block h-auto w-auto max-w-none"
              />
            </div>
          ) : (
            <AnimatePresence initial={false} custom={zoom.direction}>
              <motion.div
                key={zoom.index}
                custom={zoom.direction}
                variants={{
                  enter: (direction: number) => ({ x: reduce ? 0 : direction * 80, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (direction: number) => ({ x: reduce ? 0 : direction * -80, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag={canSlide ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.5}
                onDragStart={() => {
                  draggedRef.current = true;
                }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -500) go(1);
                  else if (info.offset.x > 60 || info.velocity.x > 500) go(-1);
                }}
                onClick={(event) => {
                  if (draggedRef.current) {
                    draggedRef.current = false;
                    return;
                  }
                  if (event.target === event.currentTarget) requestClose();
                }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- 확대 화면에서는 원본을 표시합니다. */}
                <img
                  ref={(element) => {
                    if (element) imageRef.current = element;
                  }}
                  src={current.src}
                  alt={current.alt}
                  draggable={false}
                  style={{ opacity: shown ? 1 : 0 }}
                  className="block h-auto max-h-full w-auto max-w-full select-none"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      <div ref={chromeRef} className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex h-14 items-center justify-between px-4 md:px-6">
          <span className="font-mono text-xs text-white/60">
            {count > 1 && (
              <>
                <span className="text-white">{padNumber((zoom?.index ?? 0) + 1)}</span>
                {" / "}{padNumber(count)}
              </>
            )}
          </span>
          <button
            type="button"
            onClick={requestClose}
            className="min-h-11 cursor-pointer border-0 bg-transparent px-2 text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
          >
            닫기
          </button>
        </div>
        {canSlide && (
          <>
            <ZoomArrow direction="prev" onClick={() => go(-1)} />
            <ZoomArrow direction="next" onClick={() => go(1)} />
          </>
        )}
        <p className="absolute inset-x-0 bottom-0 m-0 flex h-16 items-center justify-center px-5 text-center text-[13px] text-white/70">
          {current?.caption ?? current?.alt}
        </p>
      </div>
    </dialog>
  );

  return { openImage, imageZoom };
}

function ZoomArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      aria-label={isNext ? "다음 이미지" : "이전 이미지"}
      onClick={onClick}
      className={cn(
        "group/arrow pointer-events-auto absolute top-1/2 hidden h-24 w-20 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-2xl text-white/50 transition-colors duration-200 hover:text-white focus-visible:text-white md:flex",
        isNext ? "right-0" : "left-0",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block transition-[translate] duration-300 ease-out-soft motion-reduce:transition-none",
          isNext ? "group-hover/arrow:translate-x-1" : "group-hover/arrow:-translate-x-1",
        )}
      >
        {isNext ? "→" : "←"}
      </span>
    </button>
  );
}
